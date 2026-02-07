from sqlalchemy import Column, Integer, String, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func


# Employee model

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(20), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    attendance_records = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete"
    )


# Attendance model

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    status = Column(String(10), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    employee = relationship("Employee", back_populates="attendance_records")