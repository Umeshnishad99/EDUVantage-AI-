from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict
import joblib
import numpy as np
import pandas as pd
import os
import json
import warnings

warnings.filterwarnings("ignore")

app = FastAPI(title="Student Performance Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model & scaler ───────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

try:
    model  = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print(f"✅ Model  loaded from {MODEL_PATH}")
    print(f"✅ Scaler loaded from {SCALER_PATH}")
except Exception as e:
    print(f"❌ Error loading model/scaler: {e}")
    model  = None
    scaler = None


class PredictionInput(BaseModel):
    math:            Optional[float] = Field(0.0,  ge=0,   le=100)
    english:         Optional[float] = Field(0.0,  ge=0,   le=100)
    computer:        Optional[float] = Field(0.0,  ge=0,   le=100)
    physics:         Optional[float] = Field(0.0,  ge=0,   le=100)
    chemistry:       Optional[float] = Field(0.0,  ge=0,   le=100)
    biology:         Optional[float] = Field(0.0,  ge=0,   le=100)
    attendance_rate: Optional[float] = Field(90.0, ge=0,   le=100)
    study_hours:     Optional[float] = Field(5.0,  ge=0,   le=168)
    parent_support:  Optional[int]   = Field(3,    ge=1,   le=5)
    free_time:       Optional[int]   = Field(3,    ge=1,   le=5)
    go_out:          Optional[int]   = Field(2,    ge=1,   le=5)
    internet_access: Optional[int]   = Field(1,    ge=0,   le=1)
    extracurricular: Optional[int]   = Field(0,    ge=0,   le=1)
    part_time_job:   Optional[int]   = Field(0,    ge=0,   le=1)
    ses_quartile:    Optional[int]   = Field(2,    ge=1,   le=4)

    @field_validator('*', mode='before')
    @classmethod
    def convert_null_to_default(cls, v, info):
        if v is None:
            return cls.model_fields[info.field_name].default
        return v


@app.get("/")
def home():
    return {"status": "running", "model_ready": model is not None}


@app.post("/predict")
async def predict(data: PredictionInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="ML Model or Scaler not loaded.")

    try:
        # 1. Feature Transformation
        attendance_as_ratio = data.attendance_rate / 100.0
        feature_dict = {
            'Math':            [data.math],
            'English':         [data.english],
            'Computer':        [data.computer],
            'Physics':         [data.physics],
            'Chemistry':       [data.chemistry],
            'Biology':         [data.biology],
            'AttendanceRate':  [attendance_as_ratio],
            'StudyHours':      [data.study_hours],
            'ParentSupport':   [data.parent_support],
            'FreeTime':        [data.free_time],
            'GoOut':           [data.go_out],
            'InternetAccess':  [data.internet_access],
            'Extracurricular': [data.extracurricular],
            'PartTimeJob':     [data.part_time_job],
            'SES_Quartile':    [data.ses_quartile],
        }

        df             = pd.DataFrame(feature_dict)
        scaled         = scaler.transform(df)
        raw_prediction = model.predict(scaled)[0]
        predicted_gpa  = round(float(np.clip(raw_prediction, 0, 10)), 2)

        # 2. Performance Category
        if predicted_gpa >= 7.5:
            category = "High"
        elif predicted_gpa >= 5.0:
            category = "Medium"
        else:
            category = "Low"

        # 3. Recommendation Logic
        weak_areas = []
        recommendations = []
        
        subjects = {
            "Math": data.math, "English": data.english, "Computer": data.computer,
            "Physics": data.physics, "Chemistry": data.chemistry, "Biology": data.biology
        }
        for sub, score in subjects.items():
            if score < 50:
                weak_areas.append(sub)
                recommendations.append(f"Focus on {sub} fundamentals and practice more problems.")

        if data.attendance_rate < 75:
            weak_areas.append("Attendance")
            recommendations.append("Your attendance is low. Consistent presence in class is vital for better performance.")
        
        if data.study_hours < 4:
            recommendations.append("Increase your daily study hours to better grasp complex topics.")

        if not recommendations:
            recommendations.append("Maintain your current study routine and continue to excel.")

        # 4. Roadmap Generation (JSON)
        roadmap = [
            {"week": "Week 1–2", "topic": "Basics & Fundamentals", "description": f"Review foundational concepts in {', '.join(weak_areas) if weak_areas else 'all core subjects'}."},
            {"week": "Week 3–4", "topic": "Practice & Application", "description": "Solve previous year papers and work on assignments."},
            {"week": "Week 5", "topic": "Mock Tests & Evaluation", "description": "Take full-length mock tests to evaluate your progress."}
        ]

        return {
            "predicted_gpa": predicted_gpa,
            "category":      category,
            "weak_areas":    weak_areas,
            "recommendations": " ".join(recommendations),
            "roadmap":       roadmap
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

