import axios from 'axios'

// Base URL for the API - Your Render backend  
const BASE_URL = 'https://hrms-lite-backend-o8u0.onrender.com'

console.log('🚀 API CONFIGURATION LOADED!')
console.log('🌐 Backend URL:', BASE_URL)
console.log('📋 Available endpoints:')
console.log('   GET /employees/ - Get All Employees')
console.log('   POST /employees/ - Create Employee') 
console.log('   DELETE /employees/{employee_db_id} - Delete Employee')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for slow Render responses
})

// Employee API endpoints - Updated to match your exact API spec
export const employeeAPI = {
  // GET /employees/ - Get All Employees
  getAll: async () => {
    console.log('🔄 GET /employees/ - Fetching all employees')
    console.log('🌐 URL:', `${BASE_URL}/employees/`)
    const response = await api.get('/employees/')
    console.log('✅ API Response:', response.data)
    return response
  },
  
  // POST /employees/ - Create Employee
  create: async (employeeData) => {
    console.log('🔄 POST /employees/ - Creating employee')
    console.log('📤 Data:', employeeData)
    console.log('🌐 URL:', `${BASE_URL}/employees/`)
    const response = await api.post('/employees/', employeeData)
    console.log('✅ Employee created:', response.data)
    return response
  },
  
  // DELETE /employees/{employee_db_id} - Delete Employee  
  delete: async (employee_db_id) => {
    console.log('🔄 DELETE /employees/{employee_db_id} - Deleting employee')
    console.log('🗑️ employee_db_id:', employee_db_id)
    console.log('🌐 URL:', `${BASE_URL}/employees/${employee_db_id}`)
    const response = await api.delete(`/employees/${employee_db_id}`)
    console.log('✅ Employee deleted')
    return response
  },
  
  // Get employee by ID (if needed)
  getById: async (id) => {
    console.log('🔄 Fetching employee by ID:', id)
    const response = await api.get(`/employees/${id}`)
    console.log('✅ Employee fetched:', response.data)
    return response
  },
  
  // Update employee (if needed)
  update: async (id, employeeData) => {
    console.log('🔄 Updating employee:', id, employeeData)
    const response = await api.put(`/employees/${id}`, employeeData)
    console.log('✅ Employee updated:', response.data)
    return response
  },
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.status, response.config.method?.toUpperCase(), response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    })
    
    // Provide helpful error messages
    if (error.code === 'ERR_NETWORK') {
      error.userMessage = `Cannot connect to API server at ${BASE_URL}. Please ensure your backend server is running.`
    } else if (error.response?.status === 404) {
      error.userMessage = `API endpoint not found: ${error.config?.url}. Check your API URL configuration.`
    } else if (error.response?.status >= 500) {
      error.userMessage = `Server error (${error.response.status}). Please check your backend server.`
    } else if (error.response?.status === 400) {
      error.userMessage = error.response.data?.message || 'Invalid request data. Please check your input.'
    } else {
      error.userMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.'
    }
    
    return Promise.reject(error)
  }
)

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

export default api