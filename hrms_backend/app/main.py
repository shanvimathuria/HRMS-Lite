from app import models
from app.database import engine
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes import employees
from app.routes import attendance
from app.routes import dashboard
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

models.Base.metadata.create_all(bind=engine)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    return {"status": "Database connected successfully"}