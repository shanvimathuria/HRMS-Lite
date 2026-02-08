from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

# schema for creating employee 

class EmployeeCreate(EmployeeBase):
    pass

# schema for reading employee details
class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceBase(BaseModel):
    attendance_date: date
    status: str

#Schema for marking attendance

class AttendanceCreate(AttendanceBase):
    employee_db_id: int

#Schema for returning attendance data
class AttendanceResponse(AttendanceBase):
   
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Schema for filtered attendance response with total present days
class AttendanceFilterResponse(BaseModel):
    employee_id: int
    employee_name: str
    employee_email: str
    department: str
    total_present_days: int
    total_records: int  # Total attendance records in the date range
    
    class Config:
        from_attributes = True