# HRMS Lite – Human Resource Management System

### Core Features
- Employee Management
  - Add new employee
  - View all employees
  - Delete employee
- Attendance Management
  - Mark daily attendance (Present / Absent)
  - View attendance records per employee

### Bonus Features
- Filter attendance records by date range
- Dashboard summary (employee counts, present/absent today)
- Attendance analytics (total present days per employee)

## 🛠 Tech Stack
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Deployment:** Render

## Project Structure
app/
├── routes/
│ ├── employees.py
│ ├── attendance.py
│ ├── dashboard.py
├── database.py
├── models.py
├── schemas.py
├── main.py

## 🔗 API Endpoints

### Employee APIs
- `POST /employees`  
  Add a new employee

- `GET /employees`  
  Retrieve all employees

- `DELETE /employees/{employee_db_id}`  
  Delete an employee using database primary key

---

### Attendance APIs
- `POST /attendance`  
  Mark attendance for an employee

- `GET /attendance/{employee_db_id}`  
  Retrieve attendance records for an employee

- `GET /attendance/filter`  
  Filter attendance records by date range

---

### Dashboard APIs
- `GET /dashboard/summary`  
  Retrieve dashboard counts (total employees, present/absent today)

- `GET /dashboard/present-days`  
  Retrieve total present days per employee

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db

## Create Virtual Environment

It is recommended to use a virtual environment to isolate project dependencies.

### Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate

## Run Locally

### Install dependencies
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
http://127.0.0.1:8000/docs #(open swagger UI)