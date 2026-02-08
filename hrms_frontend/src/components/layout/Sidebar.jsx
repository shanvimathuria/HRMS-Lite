import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-gray-800 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
      {/* Top */}
      <div className="p-5">
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
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-5 border-t border-gray-800">
        <p className="text-sm font-medium">Admin</p>
        <p className="text-xs text-gray-400">Administrator</p>
      </div>
    </aside>
  );
}
