from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

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

@router.get("/{employee_id}", response_model=list[schemas.AttendanceWithEmployeeResponse])
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
            detail=f"Employee with database ID {employee_id} not found"
        )

    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee.id
    ).order_by(models.Attendance.attendance_date.desc()).all()

    # Add employee info to each attendance record
    response_data = []
    for record in attendance_records:
        response_data.append({
            "employee_db_id": employee.id,
            "employee_business_id": employee.employee_id,
            "employee_name": employee.full_name,
            "attendance_date": record.attendance_date,
            "status": record.status,
            "created_at": record.created_at
        })

    return response_data


# filter attendance by date with total present days per employee

@router.get("/filter/", response_model=list[schemas.AttendanceFilterResponse])
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

    # Get all attendance records in the date range with employee info
    attendance_records = (
        db.query(models.Attendance, models.Employee)
        .join(models.Employee, models.Employee.id == models.Attendance.employee_id)
        .filter(models.Attendance.attendance_date.between(start_date, end_date))
        .all()
    )

    if not attendance_records:
        return []  # Return empty list instead of raising an error

    # Process the data to group by employee
    employee_summary = {}
    
    for attendance, employee in attendance_records:
        emp_id = employee.id
        
        if emp_id not in employee_summary:
            employee_summary[emp_id] = {
                "employee_id": emp_id,
                "employee_name": employee.full_name,
                "employee_email": employee.email,
                "department": employee.department,
                "total_present_days": 0,
                "total_records": 0
            }
        
        employee_summary[emp_id]["total_records"] += 1
        if attendance.status.lower() == "present":
            employee_summary[emp_id]["total_present_days"] += 1

    # Convert to list and sort by employee name
    result = list(employee_summary.values())
    result.sort(key=lambda x: x["employee_name"])
    
    return result
