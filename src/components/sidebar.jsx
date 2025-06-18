import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CircleDollarSign,
  Clock,
  UserCircle,
  LogOut
} from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin + "/login" });
  };

  return (
    <div className={`${
      isOpen ? 'w-20' : 'w-0'
    } bg-gray-800 flex flex-col items-center py-5 shadow-lg transition-all duration-300 overflow-hidden h-screen`}>
      <div className="text-white font-bold text-xl mb-16">
        <img alt="logo" src='/assets/logo.png'/>
      </div>
      <nav className="flex flex-col gap-10">
        <Link to="/dashboard">
          <LayoutDashboard 
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Dashboard"
          />
        </Link>
        <Link to="/employees">
          <Users 
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Employees"
          />
        </Link>
        <Link to="/jobapplication">
          <div className="w-10 h-10">
            <UserPlus 
              className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
              title="Recruiting"
            />
          </div>
        </Link>
        <Link to="/payroll">
          <CircleDollarSign 
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Payroll"
          />
        </Link>
        <Link to="/timeroll">
          <Clock 
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Time Roll"
          />
        </Link>
      </nav>

      {/* Profile Section */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <UserCircle 
          className="w-12 h-12 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
          title="Profile"
        />
        <LogOut 
          onClick={handleLogout}
          className="w-8 h-8 text-red-400 cursor-pointer hover:scale-110 hover:text-red-500 transition-all"
          title="Logout"
        />
      </div>
    </div>
  );
};

export default Sidebar;
