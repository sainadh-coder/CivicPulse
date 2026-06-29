from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

# ── MOCK DATA (works without Firebase) ──────────────────
ISSUES = [
  {
    "id": "mock-1",
    "type": "pothole",
    "severity": 9,
    "status": "reported",
    "title": "Deep pothole near school crossing",
    "description": "Large pothole forcing bikes into traffic.",
    "ai_description": "Severe road surface degradation detected.",
    "location": {
      "lat": 17.3850, "lng": 78.4867,
      "address": "School Road, Hyderabad"
    },
    "photo_url": "https://images.unsplash.com/photo-1515162816951-d5ea80c8db79?w=800",
    "reporter_id": "user1",
    "reporter_name": "Rahul Sharma",
    "upvotes": 34,
    "estimated_days": 3,
    "created_at": "2026-06-25T10:00:00Z",
    "resolved_at": None
  },
  {
    "id": "mock-2",
    "type": "water_leak",
    "severity": 7,
    "status": "in_progress",
    "title": "Water leak flooding market lane",
    "description": "Underground pipe leaking for 3 days.",
    "ai_description": "Critical water infrastructure failure.",
    "location": {
      "lat": 17.3950, "lng": 78.4967,
      "address": "Market Lane, Hyderabad"
    },
    "photo_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "reporter_id": "user2",
    "reporter_name": "Priya Patel",
    "upvotes": 21,
    "estimated_days": 5,
    "created_at": "2026-06-26T12:00:00Z",
    "resolved_at": None
  },
  {
    "id": "mock-3",
    "type": "streetlight",
    "severity": 5,
    "status": "verified",
    "title": "Broken streetlight at bus stop",
    "description": "Light off for 4 nights, unsafe after 8PM.",
    "ai_description": "Street lighting failure in public area.",
    "location": {
      "lat": 17.3750, "lng": 78.4767,
      "address": "Central Bus Stop, Hyderabad"
    },
    "photo_url": "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800",
    "reporter_id": "user3",
    "reporter_name": "Amit Kumar",
    "upvotes": 15,
    "estimated_days": 2,
    "created_at": "2026-06-27T09:00:00Z",
    "resolved_at": None
  },
  {
    "id": "mock-4",
    "type": "waste",
    "severity": 6,
    "status": "resolved",
    "title": "Overflowing waste bins at park",
    "description": "Garbage overflow near park entrance.",
    "ai_description": "Waste management failure detected.",
    "location": {
      "lat": 17.4050, "lng": 78.5067,
      "address": "City Park, Hyderabad"
    },
    "photo_url": "https://images.unsplash.com/photo-1558618047-f2e38b1da9c0?w=800",
    "reporter_id": "user4",
    "reporter_name": "Sneha Reddy",
    "upvotes": 8,
    "estimated_days": 1,
    "created_at": "2026-06-24T14:00:00Z",
    "resolved_at": "2026-06-28T10:00:00Z"
  },
  {
    "id": "mock-5",
    "type": "pothole",
    "severity": 8,
    "status": "reported",
    "title": "Multiple potholes on main highway",
    "description": "Series of deep potholes causing accidents.",
    "ai_description": "Multiple road surface failures detected.",
    "location": {
      "lat": 17.4150, "lng": 78.5167,
      "address": "NH-65 Highway, Hyderabad"
    },
    "photo_url": "https://images.unsplash.com/photo-1515162816951-d5ea80c8db79?w=800",
    "reporter_id": "user5",
    "reporter_name": "Vikram Singh",
    "upvotes": 45,
    "estimated_days": 7,
    "created_at": "2026-06-28T08:00:00Z",
    "resolved_at": None
  }
]

USERS = [
  {"id": "user1", "name": "Maya Rao", "xp": 420,
   "badge": "Legend", "issues_reported": 8},
  {"id": "user2", "name": "Aarav Mehta", "xp": 315,
   "badge": "Hero", "issues_reported": 6},
  {"id": "user3", "name": "Fatima Khan", "xp": 240,
   "badge": "Warrior", "issues_reported": 4},
  {"id": "user4", "name": "Rohan Iyer", "xp": 90,
   "badge": "Rookie", "issues_reported": 2},
  {"id": "user5", "name": "Sneha Reddy", "xp": 175,
   "badge": "Warrior", "issues_reported": 3}
]

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.get("/api/issues")
def get_issues():
    return jsonify({"issues": ISSUES})

@app.post("/api/issues")
def create_issue():
    data = request.get_json() or {}
    new_issue = {
        "id": f"issue-{len(ISSUES)+1}",
        **data,
        "upvotes": 0,
        "status": "reported",
        "created_at": "2026-06-29T00:00:00Z"
    }
    ISSUES.append(new_issue)
    return jsonify(new_issue), 201

@app.patch("/api/issues/<issue_id>/upvote")
def upvote(issue_id):
    for issue in ISSUES:
        if issue["id"] == issue_id:
            issue["upvotes"] += 1
            return jsonify(issue)
    return jsonify({"error": "not found"}), 404

@app.patch("/api/issues/<issue_id>/status")
def update_status(issue_id):
    data = request.get_json() or {}
    for issue in ISSUES:
        if issue["id"] == issue_id:
            issue["status"] = data.get("status", issue["status"])
            return jsonify(issue)
    return jsonify({"error": "not found"}), 404

@app.get("/api/city-health")
def city_health():
    total = len(ISSUES)
    resolved = sum(1 for i in ISSUES if i["status"] == "resolved")
    avg_severity = sum(i["severity"] for i in ISSUES) / total
    score = int((resolved/total)*50 + (10-avg_severity)*5)
    score = max(0, min(100, score))
    return jsonify({"score": score, "total": total,
                    "resolved": resolved})

@app.post("/api/analyze-image")
def analyze_image():
    # Smart mock - rotates through realistic responses
    import random
    responses = [
        {"type": "pothole", "severity": 8, "estimated_days": 4,
         "description": "Severe road surface degradation detected. Deep structural damage requires immediate municipal repair team deployment."},
        {"type": "water_leak", "severity": 7, "estimated_days": 5,
         "description": "Underground water pipe failure identified. Continuous leakage causing road damage and water wastage."},
        {"type": "streetlight", "severity": 5, "estimated_days": 2,
         "description": "Street lighting infrastructure failure detected. Immediate replacement required for public safety."},
        {"type": "waste", "severity": 6, "estimated_days": 1,
         "description": "Waste management overflow detected. Sanitation team deployment required within 24 hours."}
    ]
    return jsonify(random.choice(responses))

@app.post("/api/generate-letter")
def generate_letter():
    data = request.get_json() or {}
    issue_type = data.get("issue_type", "civic issue")
    location = data.get("location", "the reported location")
    severity = data.get("severity", 5)
    description = data.get("description", "")
    reporter_name = data.get("reporter_name", "Concerned Citizen")
    from datetime import datetime
    date = datetime.now().strftime("%B %d, %Y")
    letter = f"""Date: {date}

To,
The Municipal Commissioner,
Greater Hyderabad Municipal Corporation,
Hyderabad, Telangana - 500001

Subject: Urgent Request for Immediate Resolution of {issue_type.replace('_',' ').title()} at {location}

Respected Sir/Madam,

I, {reporter_name}, am writing this letter to bring to your urgent attention a severe civic issue that has been adversely affecting the residents of our community and requires immediate intervention from your esteemed office.

ISSUE DETAILS:
- Type: {issue_type.replace('_',' ').title()}
- Location: {location}
- Severity Level: {severity}/10
- Description: {description}

This issue has been causing significant inconvenience and poses a serious safety risk to the citizens of our area. Despite being a matter of public concern, it has not received the attention it deserves.

We hereby request your office to:
1. Acknowledge this complaint within 48 hours
2. Deploy the appropriate repair/maintenance team within 72 hours
3. Complete the resolution within 7 working days
4. Provide a status update to the reporting citizen

The severity of this issue (rated {severity}/10) demands immediate priority action. Further delay may result in accidents, property damage, or deterioration of public infrastructure.

We trust that your office will treat this matter with the urgency it deserves and take swift action for the benefit of the citizens.

Thanking you,

{reporter_name}
Reported via CivicPulse AI Platform
Date: {date}

[This letter was auto-generated by CivicPulse AI - Community Hero Platform]"""
    return jsonify({"letter_text": letter})

@app.get("/api/leaderboard")
def get_leaderboard():
    sorted_users = sorted(USERS, key=lambda x: x["xp"],
                          reverse=True)
    return jsonify({"users": sorted_users})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
