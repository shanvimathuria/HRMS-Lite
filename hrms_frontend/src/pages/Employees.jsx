import { useState, useEffect } from 'react'
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import EmptyState from '../components/EmptyState'
import AddEmployeeModal from '../components/AddEmployeeModal'
import EmployeeTable from '../components/EmployeeTable'
import { employeeAPI } from '../api/api'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load employees on component mount
  useEffect(() => {
    console.log('🔄 Employees component mounted, fetching employees...')
    console.log('🌐 Will connect to: https://hrms-lite-backend-o8u0.onrender.com/employees/')
    
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      fetchEmployees()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true) 
      setError('')
      console.log('📡 Starting to fetch employees...')
      
      const response = await employeeAPI.getAll()
      console.log('✅ API Response:', response)
      console.log('✅ Employees data:', response.data)
      
      // Ensure we have an array and log the count
      const employeesList = Array.isArray(response.data) ? response.data : []
      console.log('📋 Setting employees list:', employeesList)
      console.log('📊 Employee count:', employeesList.length)
      
      setEmployees(employeesList)
      
    } catch (err) {
      console.error('❌ Error fetching employees:', err)
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })
      
      // Clear employees on error and don't set error message (as requested)
      setEmployees([])
      
    } finally {
      setIsLoading(false)
      console.log('📡 Fetch complete')
    }
  }

  const handleAddEmployee = () => {
    setIsModalOpen(true)
    setError('')
    setSuccessMessage('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitEmployee = async (employeeData) => {
    try {
      setIsSubmitting(true)
      setError('')
      console.log('📝 Form data received:', employeeData)
      
      // Log the exact data being sent to API
      console.log('📤 Sending to API:', JSON.stringify(employeeData, null, 2))
      console.log('🌐 POST URL: https://hrms-lite-backend-o8u0.onrender.com/employees/')
      
      // Create new employee via API
      const response = await employeeAPI.create(employeeData)
      console.log('✅ API Response:', response)
      console.log('✅ Created employee:', response.data)
      
      // Add new employee to the list
      const newEmployee = response.data
      setEmployees(prev => {
        const updated = [...prev, newEmployee]
        console.log('📋 Updated employee list:', updated)
        return updated
      })
      
      // Close modal and show success message
      setIsModalOpen(false)
      setSuccessMessage(`Employee ${employeeData.full_name} has been added successfully!`)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
      
    } catch (err) {
      console.error('❌ Error creating employee:', err)
      console.error('❌ Error response:', err.response)
      console.error('❌ Error data:', err.response?.data)
      console.error('❌ Error status:', err.response?.status)
      
      // Log more details for debugging
      if (err.response) {
        console.error('📤 Request that failed:', {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        })
      }
      
      // Don't show error message in UI (as requested) but log it
      console.error('❌ Create employee failed:', err.message)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEmployee = (employee) => {
    // TODO: Implement edit functionality
    console.log('Edit employee:', employee)
  }

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
      try {
        console.log('🗑️ Attempting to delete employee:', employee)
        
        // Use the database ID (not employee_id) for the DELETE endpoint
        // API expects: DELETE /employees/{employee_db_id}
        const employee_db_id = employee.id // This is the database ID from your API response
        
        console.log('🗑️ Using employee_db_id for deletion:', employee_db_id)
        console.log('🌐 DELETE URL will be:', `https://hrms-lite-backend-o8u0.onrender.com/employees/${employee_db_id}`)
        
        await employeeAPI.delete(employee_db_id)
        
        // Remove employee from list using the database ID
        setEmployees(prev => prev.filter(emp => emp.id !== employee.id))
        
        setSuccessMessage(`Employee ${employee.full_name} has been deleted.`)
        setTimeout(() => setSuccessMessage(''), 3000)
        
      } catch (err) {
        console.error('❌ Error deleting employee:', err)
        console.error('❌ Delete failed for employee:', employee)
        console.error('❌ Error response:', err.response)
      }
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">Manage your team members</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              console.log('🧪 MANUAL API TEST STARTING...')
              console.log('🌐 Testing URL: https://hrms-lite-backend-o8u0.onrender.com/employees/')
              try {
                // Method 1: Direct fetch
                console.log('🧪 Method 1: Direct fetch')
                const response1 = await fetch('https://hrms-lite-backend-o8u0.onrender.com/employees/', {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                })
                const data1 = await response1.json()
                console.log('🧪 Direct fetch result:', data1)
                
                // Method 2: Using our API
                console.log('🧪 Method 2: Using our employeeAPI')
                const response2 = await employeeAPI.getAll()
                console.log('🧪 API result:', response2.data)
                
                // Update state with the data
                setEmployees(Array.isArray(data1) ? data1 : [])
                console.log('🧪 State updated with employees')
                
              } catch (err) {
                console.error('🧪 Test failed:', err)
                console.error('🧪 Error details:', {
                  message: err.message,
                  status: err.response?.status,
                  data: err.response?.data
                })
              }
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200 shadow-sm"
          >
            🧪 Test API
          </button>
          <button
            onClick={fetchEmployees}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '🔄'
            )}
            Refresh
          </button>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200 shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Employee List or Empty State */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading employees...</span>
            </div>
          </div>
        ) : employees.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title="No employees yet"
            description="Add your first employee to get started."
            actionButton={
              <button
                onClick={handleAddEmployee}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                Add Employee
              </button>
            }
          />
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Employee List ({employees.length})
              </h3>
              <div className="text-sm text-gray-600">
                🔍 Debug: {employees.length} employees loaded
              </div>
            </div>
            <EmployeeTable 
              employees={employees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployee}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default Employees