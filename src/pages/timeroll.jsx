import { useState, useEffect } from "react"
import Sidebar from "../components/sidebar"
import { AlignJustify } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getTimerollData } from "../api"
import { useAuth0 } from "@auth0/auth0-react"

const TimerollPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timesheets, setTimesheets] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    fetchTimerollData()
  }, [])

  const fetchTimerollData = async () => {
    try {
      const data = await getTimerollData(() => getAccessTokenSilently())
      setTimesheets(data)
    } catch (error) {
      console.error("Error fetching timeroll data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (timesheet) => {
    navigate(`/timerollcard/${timesheet.id}`, {
      state: { timesheet },
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(`2000-01-01T${checkIn}`)
    const end = new Date(`2000-01-01T${checkOut}`)
    const diff = (end - start) / (1000 * 60 * 60) // Convert to hours
    return Math.max(0, diff).toFixed(1)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-row gap-2">
              <button
                onClick={toggleSidebar}
                className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 active:scale-95"
              >
                <AlignJustify
                  className={`w-8 h-8 transition-all duration-300 ${
                    isSidebarOpen ? "transform rotate-0 hover:scale-110" : "transform rotate-180 hover:scale-110"
                  }`}
                />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mt-1.5 hover:text-gray-900 transition-colors duration-300">
                Timeroll
              </h1>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-[700px] px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
            />
          </div>

          {/* Timeroll Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {timesheets.map((timesheet) => (
              <div
                key={timesheet.id}
                onClick={() => handleCardClick(timesheet)}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-blue-200"
              >
                {/* Date Header */}
                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(timesheet.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                  <p className="text-sm text-gray-500">User ID: {timesheet.user_id}</p>
                </div>

                {/* Time Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check In:</span>
                    <span className="text-sm font-medium text-green-600">{formatTime(timesheet.check_in)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check Out:</span>
                    <span className="text-sm font-medium text-red-600">{formatTime(timesheet.check_out)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Hours Worked:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {calculateHoursWorked(timesheet.check_in, timesheet.check_out)}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 flex justify-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      timesheet.check_out ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {timesheet.check_out ? "Complete" : "In Progress"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {timesheets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Timesheet Data</h3>
              <p className="text-gray-500">No timesheet records available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimerollPage
