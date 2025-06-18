"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/user-sidebar"
import { AlignJustify } from "lucide-react"
import { getRequests, createRequest } from "../api"
import { useAuth0 } from "@auth0/auth0-react"
import { getUserRole } from "../lib/auth"

const UserRequests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [leaveType, setLeaveType] = useState("")
  const [dayType, setDayType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const role = getUserRole(user)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await getRequests(getAccessTokenSilently)
      const userRequests = data.filter((r) => r.user_id === user.sub)
      setRequests(userRequests)
    } catch (err) {
      console.error("Failed to fetch requests", err)
      setError("Failed to fetch your leave requests.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && role === "user") {
      fetchRequests()
    }
  }, [isAuthenticated, role])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      user_id: user.sub,
      type: leaveType,
      day_type: dayType,
      period_start: startDate,
      period_end: endDate,
      notes,
    }

    try {
      await createRequest(payload, getAccessTokenSilently)
      setLeaveType("")
      setDayType("")
      setStartDate("")
      setEndDate("")
      setNotes("")
      fetchRequests() // Refresh
      alert("Leave request submitted.")
    } catch (err) {
      console.error("Submit error", err)
      setError("Submission failed.")
    }
  }

  if (!isAuthenticated || role !== "user") {
    return <div className="p-6 text-red-600 font-semibold">Unauthorized: Users only</div>
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full relative">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-3 md:p-6 m-2 md:m-4 w-full md:w-auto">
        <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg h-full overflow-y-auto transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <AlignJustify className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold">My Leave Requests</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              name="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              className="p-3 border rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <select
              name="dayType"
              value={dayType}
              onChange={(e) => setDayType(e.target.value)}
              required
              className="p-3 border rounded-lg"
            >
              <option value="">Day Type</option>
              <option value="full">Full Day</option>
              <option value="half">Half Day</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />
            <textarea
              placeholder="Notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-1 md:col-span-2 p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Submit Request
            </button>
          </form>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3">Previous Requests</h2>
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="border p-3 rounded-xl bg-gray-50">
                  <div className="text-sm font-medium">Type: {r.type}</div>
                  <div className="text-sm">Start: {r.period_start}</div>
                  <div className="text-sm">End: {r.period_end}</div>
                  <div className="text-sm">Status: {r.status}</div>
                  {r.notes && <div className="text-sm italic">Notes: {r.notes}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRequests
