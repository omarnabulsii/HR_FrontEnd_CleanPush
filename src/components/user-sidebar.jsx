"use client"
import { Link } from "react-router-dom"
import { User, FileText, LogOut } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

const UserSidebar = ({ isOpen }) => {
  const { logout, user } = useAuth0()

  const handleLogout = () => {
    logout({ returnTo: window.location.origin })
  }

  return (
    <div
      className={`${
        isOpen ? "w-20" : "w-0"
      } bg-gray-800 flex flex-col items-center py-5 shadow-lg transition-all duration-300 overflow-hidden h-screen md:relative fixed top-0 left-0 z-50 md:z-auto ${
        isOpen ? "md:w-20" : "md:w-0"
      } ${isOpen ? "w-64 md:w-20" : "w-0"}`}
    >
      <div className="text-white font-bold text-xl mb-16">
        <img alt="logo" src="/assets/logo.png" className="w-12 h-12" />
      </div>

      <nav className="flex flex-col gap-10">
        <Link to="/user-information">
          <User
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Information"
          />
        </Link>

        <Link to="/userrequests">
          <FileText
            className="w-10 h-10 text-white cursor-pointer hover:scale-110 hover:text-blue-400 transition-all"
            title="Requests"
          />
        </Link>
      </nav>

      {/* Profile and Logout Section */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <Link to="/profile">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-blue-400 hover:scale-110 transition-all cursor-pointer"
            title="Profile"
          />
        </Link>
        <button onClick={handleLogout}>
          <LogOut
            className="w-8 h-8 text-red-400 cursor-pointer hover:scale-110 hover:text-red-500 transition-all"
            title="Logout"
          />
        </button>
      </div>
    </div>
  )
}

export default UserSidebar
