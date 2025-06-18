"use client"

import { useState, useEffect } from "react"
import { AlignJustify } from "lucide-react"
import UserSidebar from "../components/user-sidebar"
import { getUserById, checkIn, checkOut } from "../api"
import { useAuth0 } from "@auth0/auth0-react"

const UserInformation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getAccessTokenSilently, user } = useAuth0()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const userId = user?.sub?.split("|")[1] || localStorage.getItem("user_id") || 1
      const data = await getUserById(userId, () => getAccessTokenSilently())
      setUserInfo(data)
    } catch (error) {
      console.error("Error fetching user info:", error)
      if (user) {
        setUserInfo({
          full_name: user.name || user.nickname || "User",
          email: user.email,
          phone: user.phone_number || "N/A",
          job_title: "Employee",
          department: "General",
          hire_date: "N/A",
          status: "Active",
          base_salary: "N/A",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
        <UserSidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full relative">
      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}

      <UserSidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-3 md:p-6 m-2 md:m-4 w-full md:w-auto">
        <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition active:scale-95">
                <AlignJustify className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">My Information</h1>
            </div>
          </div>

          {/* Welcome */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-2xl font-bold">
                  {userInfo?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold mb-1">
                  Welcome back, {userInfo?.full_name || user?.name || "User"}!
                </h2>
                <p className="text-blue-100 text-sm md:text-base">Here's your employee information</p>
              </div>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InfoBox label="Full Name" value={userInfo.full_name} />
            <InfoBox label="Email" value={userInfo.email} />
            <InfoBox label="Phone" value={userInfo.phone || "N/A"} />
            <InfoBox label="Job Title" value={userInfo.job_title} />
            <InfoBox label="Department" value={userInfo.department} />
            <InfoBox
              label="Hire Date"
              value={userInfo.hire_date ? new Date(userInfo.hire_date).toLocaleDateString() : "N/A"}
            />
            <InfoBox label="Status" value={userInfo.status} status />
            {userInfo.base_salary && (
              <InfoBox label="Base Salary" value={`$${userInfo.base_salary?.toLocaleString()}`} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Submit Request */}
              <button
                onClick={() => (window.location.href = "/userrequests")}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">📄</div>
                <div>
                  <p className="font-medium text-gray-900">Submit Request</p>
                  <p className="text-sm text-gray-600">Time off, WFH, and more</p>
                </div>
              </button>

              {/* Check In */}
              <button
                onClick={async () => {
                  try {
                    const tokenFn = () => getAccessTokenSilently()
                    const userId = user?.sub
                    await checkIn(userId, tokenFn)
                    alert("Checked in successfully!")
                  } catch (err) {
                    alert("Check-in failed: " + err.message)
                  }
                }}
                className="flex items-center gap-3 p-4 bg-green-100 rounded-lg hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">✔️</div>
                <div>
                  <p className="font-medium text-green-900">Check In</p>
                  <p className="text-sm text-green-700">Start your day</p>
                </div>
              </button>

              {/* Check Out */}
              <button
                onClick={async () => {
                  try {
                    const tokenFn = () => getAccessTokenSilently()
                    const userId = user?.sub
                    await checkOut(userId, tokenFn)
                    alert("Checked out successfully!")
                  } catch (err) {
                    alert("Check-out failed: " + err.message)
                  }
                }}
                className="flex items-center gap-3 p-4 bg-red-100 rounded-lg hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">⏹️</div>
                <div>
                  <p className="font-medium text-red-900">Check Out</p>
                  <p className="text-sm text-red-700">Log out for the day</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoBox = ({ label, value, status = false }) => (
  <div className="bg-gray-50 rounded-xl p-4 md:p-6 hover:shadow-md transition-all">
    <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
    {status ? (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="text-base md:text-lg font-semibold text-gray-900">{value}</p>
    )}
  </div>
)

export default UserInformation
