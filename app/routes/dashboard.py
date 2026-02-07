from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# No of present days per employee (bonus funtionality)

@router.get("/present-days")
def present_days_per_employee(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.Employee.id.label("employee_db_id"),
            models.Employee.full_name,
            func.count(
                func.nullif(models.Attendance.status != "Present", True)
            ).label("present_days")
        )
        .outerjoin(models.Attendance)
        .group_by(models.Employee.id)
        .all()
    )

    return [
        {
            "employee_db_id": r.employee_db_id,
            "full_name": r.full_name,
            "present_days": r.present_days
        }
        for r in results
    ]
# DASHBOARD SUMMARY (bonus functionality - shows total employees, total attendance records and attendence for today)

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_employees = db.query(models.Employee).count()

    total_attendance = db.query(models.Attendance).count()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.attendance_date == func.current_date(),
        models.Attendance.status == "Present"
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.attendance_date == func.current_date(),
        models.Attendance.status == "Absent"
    ).count()

    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance,
        "present_today": present_today,
        "absent_today": absent_today
    }
