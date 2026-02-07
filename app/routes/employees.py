from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)
 
#CREATE EMPLOYEE

@router.post( "/",
    response_model=schemas.EmployeeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    # Check duplicate employee_id
    existing_employee_id = db.query(models.Employee).filter(
        models.Employee.employee_id == employee.employee_id
    ).first()

    if existing_employee_id:
        raise HTTPException(
            status_code=409,
            detail="Employee ID already exists"
        )

    # Check duplicate email
    existing_email = db.query(models.Employee).filter(
        models.Employee.email == employee.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    new_employee = models.Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee

#SHOW all EMPLOYEES

@router.get( "/", response_model=list[schemas.EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return employees

# Delete Employees

@router.delete("/{employee_db_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_db_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_db_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)
    db.commit()

    return None
