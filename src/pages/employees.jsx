import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { AlignJustify, MoreVertical, Plus } from 'lucide-react';
import { getEmployees } from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserRole } from "../lib/auth";

const EmployeesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const role = getUserRole(user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchEmployees = async () => {
    try {
      if (!isAuthenticated || role !== "admin") {
        throw new Error("Unauthorized");
      }

      const token = await getAccessTokenSilently();
      console.log("🔐 Token being sent to API:", token);

      const data = await getEmployees(() => token);

      console.log("✅ Employees fetched:", data);

      // Show only employees (not admins)
      setEmployees(data.filter(emp => emp.role === "employee"));
    } catch (error) {
      console.error("❌ Failed to fetch employees:", error.message || error);
      alert("Unauthorized or failed to load employees.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [isAuthenticated, role]);

  if (!isAuthenticated || role !== "admin") {
    return <div className="p-6 text-red-600 font-semibold">Unauthorized: Admins only.</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar}>
                <AlignJustify className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">Employees</h1>
            </div>
            <Link to="/addemployeepage">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg active:scale-95">
                <Plus className="w-5 h-5" />
                Add New Employee
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Full Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{employee.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.job_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.department}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.email}</td>
                      <td className="px-6 py-4">
                        <Link to={`/employee/${employee.id}`} state={{ employee }}>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
