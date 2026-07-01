import requests
import datetime
import uuid
import json
from typing import Optional, List, Dict, Any

SUPABASE_URL = "https://qsyydjpuzjirxkqyjvqw.supabase.co"
SUPABASE_KEY = "sb_publishable_dccy2bN7gpHHT41CHqaKQQ_LHDR6g2U"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

class User:
    def __init__(self, id: str, google_id: str = None, email: str = None, name: str = None,
                 picture: str = None, plan: str = "free", checks_used: int = 0,
                 created_at: str = None, password_hash: str = None, username: str = None):
        self.id = id
        self.google_id = google_id
        self.email = email
        self.name = name
        self.picture = picture
        self.plan = plan
        self.checks_used = checks_used
        self.created_at = created_at
        self.password_hash = password_hash
        self.username = username

class Job:
    def __init__(self, id: str, user_id: str, job_id: str, file_name: str = None, status: str = "queued", verdict: str = None, max_score: float = None, runtime: float = None, result_json: Any = None, created_at: str = None, finished_at: str = None):
        self.id = id
        self.user_id = user_id
        self.job_id = job_id
        self.file_name = file_name
        self.status = status
        self.verdict = verdict
        self.max_score = max_score
        self.runtime = runtime
        self.result_json = result_json
        self.created_at = created_at
        self.finished_at = finished_at

def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        url = f"{SUPABASE_URL}/rest/v1/users?id=eq.{user_id}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            if data:
                return User(**data[0])
    except Exception as e:
        print(f"Error getting user by id: {e}")
    return None

def get_user_by_google_id(google_id: str) -> Optional[User]:
    try:
        url = f"{SUPABASE_URL}/rest/v1/users?google_id=eq.{google_id}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            if data:
                return User(**data[0])
    except Exception as e:
        print(f"Error getting user by google_id: {e}")
    return None

def get_user_by_email(email: str) -> Optional[User]:
    try:
        from urllib.parse import quote
        url = f"{SUPABASE_URL}/rest/v1/users?email=eq.{quote(email)}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            if data:
                return User(**data[0])
    except Exception as e:
        print(f"Error getting user by email: {e}")
    return None

def get_user_by_username(username: str) -> Optional[User]:
    try:
        from urllib.parse import quote
        url = f"{SUPABASE_URL}/rest/v1/users?username=eq.{quote(username)}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            if data:
                return User(**data[0])
    except Exception as e:
        print(f"Error getting user by username: {e}")
    return None

def create_local_user(username: str, password_hash: str, email: str = None, name: str = None) -> User:
    """Tạo user đăng ký bằng username/password."""
    url = f"{SUPABASE_URL}/rest/v1/users"
    payload = {
        "username": username,
        "email": email,
        "name": name or username,
        "password_hash": password_hash,
        "picture": None,
        "google_id": None,
    }
    res = requests.post(url, headers=HEADERS, json=payload)
    res.raise_for_status()
    data = res.json()
    return User(**data[0])

def create_user(google_id: str, email: str, name: str, picture: str) -> User:
    url = f"{SUPABASE_URL}/rest/v1/users"
    payload = {
        "google_id": google_id,
        "email": email,
        "name": name,
        "picture": picture
    }
    res = requests.post(url, headers=HEADERS, json=payload)
    res.raise_for_status()
    data = res.json()
    return User(**data[0])

def create_job(job_id: str, user_id: str, file_name: str) -> Job:
    url = f"{SUPABASE_URL}/rest/v1/jobs"
    payload = {
        "job_id": job_id,
        "user_id": user_id,
        "file_name": file_name,
        "status": "queued"
    }
    res = requests.post(url, headers=HEADERS, json=payload)
    res.raise_for_status()
    data = res.json()
    return Job(**data[0])

def get_job_by_job_id(job_id: str) -> Optional[Job]:
    try:
        url = f"{SUPABASE_URL}/rest/v1/jobs?job_id=eq.{job_id}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            if data:
                return Job(**data[0])
    except Exception as e:
        print(f"Error getting job by job_id: {e}")
    return None

def get_jobs_by_user_id(user_id: str) -> List[Job]:
    try:
        url = f"{SUPABASE_URL}/rest/v1/jobs?user_id=eq.{user_id}&order=created_at.desc"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            data = res.json()
            return [Job(**item) for item in data]
    except Exception as e:
        print(f"Error getting jobs by user_id: {e}")
    return []

def complete_job(job_id: str, status: str, verdict: str = None, max_score: float = None, runtime: float = None, result_json: dict = None, report_items: list = None):
    try:
        job = get_job_by_job_id(job_id)
        if not job:
            print(f"Job {job_id} not found to complete.")
            return
        
        url = f"{SUPABASE_URL}/rest/v1/jobs?id=eq.{job.id}"
        payload = {
            "status": status,
            "verdict": verdict,
            "max_score": max_score,
            "runtime": runtime,
            "result_json": result_json,
            "finished_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        res = requests.patch(url, headers=HEADERS, json=payload)
        res.raise_for_status()
        
        if report_items:
            items_url = f"{SUPABASE_URL}/rest/v1/report_items"
            payload_items = []
            for item in report_items:
                payload_items.append({
                    "job_id": job.id,
                    "sentence": item.get("sentence"),
                    "url": item.get("url"),
                    "title": item.get("title"),
                    "final_score": item.get("final_score"),
                    "lcs_score": item.get("lcs_score"),
                    "ngram_score": item.get("ngram_score"),
                    "semantic_score": item.get("semantic_score"),
                    "contiguous_score": item.get("contiguous_score", 0.0),
                    "matched_tokens": item.get("matched_tokens", []),
                    "snippet": item.get("snippet")
                })
            res_items = requests.post(items_url, headers=HEADERS, json=payload_items)
            
            # Fallback if inserting contiguous_score fails (e.g. column not yet added to Supabase)
            if res_items.status_code not in (200, 201):
                payload_fallback = []
                for item in report_items:
                    payload_fallback.append({
                        "job_id": job.id,
                        "sentence": item.get("sentence"),
                        "url": item.get("url"),
                        "title": item.get("title"),
                        "final_score": item.get("final_score"),
                        "lcs_score": item.get("lcs_score"),
                        "ngram_score": item.get("ngram_score"),
                        "semantic_score": item.get("semantic_score"),
                        "matched_tokens": item.get("matched_tokens", []),
                        "snippet": item.get("snippet")
                    })
                res_fallback = requests.post(items_url, headers=HEADERS, json=payload_fallback)
                res_fallback.raise_for_status()
    except Exception as e:
        print(f"Error completing job {job_id}: {e}")

def fail_job(job_id: str, error_msg: str):
    try:
        job = get_job_by_job_id(job_id)
        if not job:
            return
        url = f"{SUPABASE_URL}/rest/v1/jobs?id=eq.{job.id}"
        payload = {
            "status": "failed",
            "result_json": {"error": error_msg},
            "finished_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        res = requests.patch(url, headers=HEADERS, json=payload)
        res.raise_for_status()
    except Exception as e:
        print(f"Error failing job {job_id}: {e}")

def get_report_items(job_uuid: str) -> List[dict]:
    try:
        url = f"{SUPABASE_URL}/rest/v1/report_items?job_id=eq.{job_uuid}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code == 200:
            items = res.json()
            for item in items:
                if "contiguous_score" not in item or item["contiguous_score"] is None:
                    item["contiguous_score"] = 0.0
            return items
    except Exception as e:
        print(f"Error getting report items for job {job_uuid}: {e}")
    return []
