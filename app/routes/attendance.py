from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from datetime import date
from fastapi import Query

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

#mark attendence

@router.post("/", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    attendance: schemas.AttendanceCreate,
    db: Session = Depends(get_db)
):
    
    employee = db.query(models.Employee).filter(
        models.Employee.id == attendance.employee_db_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_db_id,
        models.Attendance.attendance_date == attendance.attendance_date
    ).first()


    if existing_attendance:
        raise HTTPException(
            status_code=409,
            detail="Attendance already marked for this date"
        )

    new_attendance = models.Attendance(
        employee_id=attendance.employee_db_id,
        attendance_date=attendance.attendance_date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance

#show attendance 

@router.get("/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_attendance_for_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).order_by(models.Attendance.attendance_date.desc()).all()

    return attendance_records


# filter attendance by date(bonus functionality)

@router.get("/filter/", response_model=list[schemas.AttendanceResponse])
def filter_attendance_by_date(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="start_date cannot be after end_date"
        )

    records = db.query(models.Attendance).filter(
        models.Attendance.attendance_date.between(start_date, end_date)
    ).order_by(models.Attendance.attendance_date).all()

    return records
