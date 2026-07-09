import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import List

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT_DIR / "data" / "resumes.json"
load_dotenv(ROOT_DIR / ".env")

storage_lock = Lock()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class PersonalInfo(BaseModel):
    fullName: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    website: str = ""
    linkedin: str = ""
    summary: str = ""


class Experience(BaseModel):
    company: str = ""
    role: str = ""
    startDate: str = ""
    endDate: str = ""
    location: str = ""
    bullets: List[str] = Field(default_factory=list)


class Education(BaseModel):
    school: str = ""
    degree: str = ""
    field: str = ""
    startDate: str = ""
    endDate: str = ""
    location: str = ""
    notes: str = ""


class Project(BaseModel):
    name: str = ""
    link: str = ""
    description: str = ""
    tech: str = ""


class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""


class LanguageEntry(BaseModel):
    name: str = ""
    level: str = ""


class ResumeData(BaseModel):
    templateId: str = "modern-minimal"
    personal: PersonalInfo = Field(default_factory=PersonalInfo)
    experience: List[Experience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    languages: List[LanguageEntry] = Field(default_factory=list)


class Resume(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    share_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:10])
    data: ResumeData = Field(default_factory=ResumeData)
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)


class ResumeCreate(BaseModel):
    data: ResumeData


class ResumeUpdate(BaseModel):
    data: ResumeData


def read_resumes() -> List[dict]:
    if not DATA_FILE.exists():
      DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
      DATA_FILE.write_text("[]", encoding="utf-8")
    raw = DATA_FILE.read_text(encoding="utf-8").strip() or "[]"
    return json.loads(raw)


def write_resumes(items: List[dict]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")


app = FastAPI(title="Resumely API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
def root():
    return {"message": "Resumely API", "status": "ok"}


@api_router.post("/resumes", response_model=Resume)
def create_resume(payload: ResumeCreate):
    resume = Resume(data=payload.data)
    with storage_lock:
        items = read_resumes()
        items.append(resume.model_dump())
        write_resumes(items)
    return resume


@api_router.get("/resumes/{share_id}", response_model=Resume)
def get_resume(share_id: str):
    with storage_lock:
        items = read_resumes()
    for item in items:
        if item.get("share_id") == share_id:
            return Resume(**item)
    raise HTTPException(status_code=404, detail="Resume not found")


@api_router.put("/resumes/{share_id}", response_model=Resume)
def update_resume(share_id: str, payload: ResumeUpdate):
    with storage_lock:
        items = read_resumes()
        for index, item in enumerate(items):
            if item.get("share_id") == share_id:
                item["data"] = payload.data.model_dump()
                item["updated_at"] = utc_now()
                items[index] = item
                write_resumes(items)
                return Resume(**item)
    raise HTTPException(status_code=404, detail="Resume not found")


@api_router.get("/templates")
def list_templates():
    return {
        "templates": [
            {"id": "modern-minimal", "name": "Modern Minimal", "description": "Single column, generous whitespace, sans-serif clarity.", "vibe": "Minimal"},
            {"id": "editorial", "name": "Editorial", "description": "Two column layout with serif headings and elegant dividers.", "vibe": "Elegant"},
            {"id": "bold-creative", "name": "Bold Creative", "description": "High contrast headers with a striking dark sidebar.", "vibe": "Bold"},
            {"id": "timeline", "name": "Timeline", "description": "Chronological experience with a vertical connector line.", "vibe": "Structured"},
            {"id": "tech-compact", "name": "Tech Compact", "description": "Dense, monospaced accents. Perfect for developers.", "vibe": "Tech"},
            {"id": "classic-corporate", "name": "Classic Corporate", "description": "Traditional, ATS-friendly with horizontal rules.", "vibe": "Classic"},
            {"id": "startup-vibe", "name": "Startup Vibe", "description": "Accent color highlights and pill skill tags.", "vibe": "Modern"},
            {"id": "academic", "name": "Academic CV", "description": "Structured for publications and research lists.", "vibe": "Formal"},
        ]
    }


app.include_router(api_router)
origins = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)