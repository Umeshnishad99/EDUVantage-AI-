# ── FastAPI ML Service ───────────────────────────────────────
FROM python:3.10-slim
WORKDIR /app
COPY ml-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ml-api/main.py ml-api/model.pkl ml-api/scaler.pkl ./
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
