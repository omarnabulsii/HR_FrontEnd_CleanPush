import { useAuth0 } from "@auth0/auth0-react"
import { useState, useEffect } from "react"
import Sidebar from "../components/sidebar"
import {
  AlignJustify,
  Users,
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react"
import { getDashboardStats } from "../api"
import { getUserRole } from "../lib/auth"

const HRDashboard = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const role = getUserRole(user)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!isAuthenticated || role !== "admin") return
        const data = await getDashboardStats(() => getAccessTokenSilently())
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, role, getAccessTokenSilently])

  if (!isLoading && (!isAuthenticated || role !== "admin")) {
    return <div className="p-6 text-red-600 font-semibold">Unauthorized: Admins only.</div>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Active Employees",
      value: stats?.activeEmployees || 0,
      icon: Users,
      color: "bg-green-500",
      change: "+8%",
      isPositive: true,
    },
    {
      title: "Pending Applications",
      value: stats?.pendingApplications || 0,
      icon: FileText,
      color: "bg-yellow-500",
      change: "+5%",
      isPositive: true,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: "bg-orange-500",
      change: "-2%",
      isPositive: false,
    },
    {
      title: "Total Payroll",
      value: `$${(stats?.totalPayroll || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: "+15%",
      isPositive: true,
    },
  ]

  return (
    <div className="flex bg-[#F3F8FF] font-roboto min-h-screen">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-row gap-2">
              <button
                onClick={toggleSidebar}
                className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 active:scale-95"
              >
                <AlignJustify className="w-8 h-8" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mt-1.5">HR Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=random`}
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border"
              />
              <div className="text-sm text-gray-600">Welcome back, {user?.name || user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      card.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {card.isPositive ? (
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 inline mr-1" />
                    )}
                    {card.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Applications */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Job Applications</h2>
              {stats?.recentActivities?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{activity.full_name}</p>
                        <p className="text-sm text-gray-600">Applied for {activity.position}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent applications</p>
              )}
            </div>

            {/* User Requests */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Requests</h2>
              {stats?.recentRequests?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentRequests.map((req, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{req.type}</p>
                        <p className="text-sm text-gray-600">From {req.period_start} to {req.period_end}</p>
                        <p className="text-xs text-gray-500 italic">{req.notes}</p>
                      </div>
                      <div className="text-sm font-semibold capitalize text-blue-600">{req.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent leave requests</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HRDashboard
