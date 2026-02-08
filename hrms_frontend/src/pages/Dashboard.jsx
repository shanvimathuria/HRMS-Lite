const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your HRMS dashboard</p>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
          <p className="text-gray-600">Dashboard content will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard