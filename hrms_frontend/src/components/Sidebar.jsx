import { NavLink } from 'react-router-dom'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ChartBarIcon
    },
    {
      name: 'Employees', 
      href: '/employees',
      icon: UserGroupIcon
    },
    {
      name: 'Attendance',
      href: '/attendance', 
      icon: ClockIcon
    }
  ]

  return (
    <div className="flex flex-col w-64 bg-slate-800 text-white min-h-screen">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">HRMS <span className="text-blue-400">Lite</span></h1>
        <p className="text-gray-400 text-sm mt-1">Human Resource Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive 
                  ? 'bg-slate-700 text-white border-r-2 border-blue-500' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar