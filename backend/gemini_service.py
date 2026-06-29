import base64
import json
import os
import re

import requests

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


class GeminiError(RuntimeError):
    pass


def _api_key():
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise GeminiError("GEMINI_API_KEY is not configured")
    return key


def _post_gemini(payload):
    response = requests.post(
        GEMINI_ENDPOINT,
        params={"key": _api_key()},
        json=payload,
        timeout=40,
    )
    if response.status_code >= 400:
        raise GeminiError(f"Gemini API error {response.status_code}: {response.text[:300]}")
    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise GeminiError("Gemini returned an unexpected response") from exc


def _extract_json(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise GeminiError("Gemini response did not include JSON")
    return json.loads(match.group(0))


def _split_data_url(image_data):
    if "," in image_data and image_data.startswith("data:"):
        header, encoded = image_data.split(",", 1)
        mime = header.split(";")[0].replace("data:", "") or "image/jpeg"
        return mime, encoded
    base64.b64decode(image_data, validate=True)
    return "image/jpeg", image_data


def analyze_image(image_data):
    mime_type, encoded = _split_data_url(image_data)
    prompt = """Analyze this civic issue photo. Return JSON only:
{type: pothole|water_leak|streetlight|waste|other,
 severity: 1-10,
 estimated_days: number,
 description: string (2 sentences, formal)}"""
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": mime_type, "data": encoded}},
            ]
        }],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 512},
    }
    result = _extract_json(_post_gemini(payload))
    result["severity"] = max(1, min(10, int(result.get("severity", 5))))
    result["estimated_days"] = max(1, min(14, int(result.get("estimated_days", 3))))
    if result.get("type") not in {"pothole", "water_leak", "streetlight", "waste", "other"}:
        result["type"] = "other"
    return result


def generate_letter(issue):
    from datetime import date

    prompt = f"""
Generate a professional formal complaint letter to "The Municipal Commissioner" with all issue details, dated today, demanding action within 7 working days.
Date: {date.today().isoformat()}
Use this civic issue data:
Issue type: {issue.get("issue_type", "civic issue")}
Location: {issue.get("location", "reported location")}
Severity: {issue.get("severity", "not specified")}/10
Description: {issue.get("description", "")}
Reporter: {issue.get("reporter_name", "Concerned Citizen")}

The letter must include recipient, subject, clear facts, public impact, requested action within 7 working days, and polite closing.
Return only the letter text.
"""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.35, "maxOutputTokens": 900},
    }
    return _post_gemini(payload).strip()
