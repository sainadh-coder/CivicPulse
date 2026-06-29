import os
import uuid
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, firestore

_db = None
_memory_issues = {}
_memory_users = {
    "u1": {"id": "u1", "name": "Maya Rao", "email": "maya@example.com", "xp": 420, "badge": "Legend", "issues_reported": 16, "issues_resolved": 7, "joined_at": datetime.now(timezone.utc)},
    "u2": {"id": "u2", "name": "Aarav Mehta", "email": "aarav@example.com", "xp": 315, "badge": "Hero", "issues_reported": 11, "issues_resolved": 4, "joined_at": datetime.now(timezone.utc)},
    "u3": {"id": "u3", "name": "Fatima Khan", "email": "fatima@example.com", "xp": 240, "badge": "Warrior", "issues_reported": 8, "issues_resolved": 2, "joined_at": datetime.now(timezone.utc)},
}


def _badge_for_xp(xp):
    if xp >= 400:
        return "Legend"
    if xp >= 250:
        return "Hero"
    if xp >= 120:
        return "Warrior"
    return "Rookie"


def init_firebase():
    global _db
    if _db:
        return _db
    try:
        if firebase_admin._apps:
            _db = firestore.client()
            return _db
        service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        if service_account_path and os.path.exists(service_account_path):
            firebase_admin.initialize_app(credentials.Certificate(service_account_path), {"projectId": project_id})
        else:
            firebase_admin.initialize_app(options={"projectId": project_id})
        _db = firestore.client()
    except Exception:
        _db = None
    return _db


def serialize_doc(snapshot):
    data = snapshot.to_dict()
    data["id"] = snapshot.id
    return normalize_timestamps(data)


def normalize_timestamps(value):
    if isinstance(value, dict):
        return {key: normalize_timestamps(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_timestamps(item) for item in value]
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


def create_issue(issue):
    db = init_firebase()
    now = datetime.now(timezone.utc)
    issue = {
        **issue,
        "upvotes": int(issue.get("upvotes", 0)),
        "status": issue.get("status", "reported"),
        "created_at": now,
        "resolved_at": None,
        "comments": issue.get("comments", []),
    }
    if db:
        ref = db.collection("issues").document()
        ref.set(issue)
        reporter_id = issue.get("reporter_id")
        if reporter_id:
            user_ref = db.collection("users").document(reporter_id)
            user_ref.set({
                "id": reporter_id,
                "name": issue.get("reporter_name", "Citizen"),
                "email": issue.get("reporter_email", ""),
                "xp": firestore.Increment(10),
                "badge": "Rookie",
                "issues_reported": firestore.Increment(1),
                "issues_resolved": firestore.Increment(0),
                "joined_at": now,
            }, merge=True)
        return {"id": ref.id, "success": True}
    issue_id = str(uuid.uuid4())
    _memory_issues[issue_id] = {"id": issue_id, **issue}
    reporter_id = issue.get("reporter_id", "guest-citizen")
    existing = _memory_users.get(reporter_id, {"id": reporter_id, "name": issue.get("reporter_name", "Citizen"), "email": issue.get("reporter_email", ""), "xp": 0, "issues_reported": 0, "issues_resolved": 0, "joined_at": now})
    existing["xp"] = int(existing.get("xp", 0)) + 10
    existing["badge"] = _badge_for_xp(existing["xp"])
    existing["issues_reported"] = int(existing.get("issues_reported", 0)) + 1
    _memory_users[reporter_id] = existing
    return {"id": issue_id, "success": True}


def list_issues():
    db = init_firebase()
    if db:
        snapshots = db.collection("issues").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        return [serialize_doc(item) for item in snapshots]
    return [normalize_timestamps(issue) for issue in _memory_issues.values()]


def upvote_issue(issue_id):
    db = init_firebase()
    if db:
        db.collection("issues").document(issue_id).update({"upvotes": firestore.Increment(1)})
        return {"success": True}
    if issue_id in _memory_issues:
        _memory_issues[issue_id]["upvotes"] = int(_memory_issues[issue_id].get("upvotes", 0)) + 1
    return {"success": True}


def update_issue_status(issue_id, status):
    db = init_firebase()
    payload = {"status": status}
    if status == "resolved":
        payload["resolved_at"] = datetime.now(timezone.utc)
    if db:
        db.collection("issues").document(issue_id).update(payload)
        return {"success": True}
    if issue_id in _memory_issues:
        _memory_issues[issue_id].update(payload)
    return {"success": True}


def city_health():
    issues = list_issues()
    total = len(issues)
    open_issues = len([issue for issue in issues if issue.get("status") != "resolved"])
    resolved = len([issue for issue in issues if issue.get("status") == "resolved"])
    high_severity = len([issue for issue in issues if int(issue.get("severity", 0)) >= 8])
    score = round(82 - open_issues * 4 - high_severity * 7 + resolved * 5)
    score = max(0, min(100, score if total else 76))
    return {"score": score, "total": total, "open": open_issues, "resolved": resolved, "high_severity": high_severity}


def leaderboard():
    db = init_firebase()
    if db:
        snapshots = db.collection("users").order_by("xp", direction=firestore.Query.DESCENDING).limit(10).stream()
        users = [serialize_doc(item) for item in snapshots]
    else:
        users = list(_memory_users.values())
    users = sorted(users, key=lambda user: int(user.get("xp", 0)), reverse=True)[:10]
    for user in users:
        user["badge"] = _badge_for_xp(int(user.get("xp", 0)))
    return normalize_timestamps(users)
