import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import Sidebar from "../components/sidebar"
import { AlignJustify } from 'lucide-react'

const TimeRollCard = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timeroll, setTimeroll] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    if (state?.timeroll) {
      setTimeroll(state.timeroll)
    } else if (id) {
      fetchTimeroll()
    }
  }, [id, state])

  const fetchTimeroll = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/timeroll/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTimeroll(data)
      }
    } catch (error) {
      console.error("Error fetching timeroll:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!timeroll) {
    return <div className="flex items-center justify-center h-screen">Time roll not found</div>
  }

  const timeInfoBoxes = [
    { title: "Check In", value: timeroll.checkIn },
    { title: "Check Out", value: timeroll.checkOut },
    { title: "Total Hours", value: timeroll.totalHours },
    { title: "Overtime", value: timeroll.overtime },
    { title: "Status", value: timeroll.status },
    { title: "Shift", value: timeroll.shift },
    { title: "Total Breaks", value: timeroll.totalBreaks || "1h" },
    { title: "Late Arrival", value: timeroll.lateArrival || "0min" },
    { title: "Early Leave", value: timeroll.earlyLeave || "0min" }
  ]

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-row gap-2">
              <button
                onClick={toggleSidebar}
                className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 active:scale-95"
              >
                <AlignJustify 
                  className={`w-8 h-8 transition-all duration-300 ${
                    isSidebarOpen ? 'transform rotate-0 hover:scale-110' : 'transform rotate-180 hover:scale-110'
                  }`} 
                />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Time Roll Details</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {timeInfoBoxes.map((box, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-gray-600 text-sm mb-2">{box.title}</h3>
                <p className="text-2xl font-semibold text-gray-900">{box.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeRollCard