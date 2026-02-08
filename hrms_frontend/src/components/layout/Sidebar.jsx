import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-gray-800 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
  }`;

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col justify-between z-40">
      {/* Top */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h1 className="text-xl font-bold">
          HRMS <span className="text-blue-400">Lite</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Human Resource Management
        </p>

        <nav className="mt-8 space-y-2">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/employees" className={navClass}>
            Employees
          </NavLink>
          <NavLink to="/attendance" className={navClass}>
            Attendance
          </NavLink>
          <NavLink to="/attendance-records" className={navClass}>
            Attendance Records
          </NavLink>
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-5 border-t border-gray-800 flex-shrink-0">
        <p className="text-sm font-medium">Admin</p>
        <p className="text-xs text-gray-400">Administrator</p>
      </div>
    </aside>
  );
}
