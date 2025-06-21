import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { AlignJustify, TrendingUp } from "lucide-react";
import { getEmployee, deleteEmployee } from "../api"; // ✅ Fixed import
import { useAuth0 } from "@auth0/auth0-react";

const EmployeeProfile = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchEmployee = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getEmployee(id, () => token);
      setEmployee(data);
    } catch (error) {
      console.error("Failed to fetch employee", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.employee) {
      setEmployee(state.employee);
      setLoading(false);
    } else {
      fetchEmployee();
    }
  }, [state, id]);

  if (loading || !employee) {
    return <div className="p-10 text-center text-gray-600">Loading employee...</div>;
  }

  const informationBoxes = [
    { title: "Name", value: employee.full_name },
    { title: "Position", value: employee.job_title },
    { title: "Phone Number", value: employee.phone },
    { title: "Department", value: employee.department },
    { title: "Salary", value: `${employee.base_salary} JD` },
    { title: "Years in the Company", value: employee.yearsInCompany || "1" },
    { title: "Location", value: employee.location || "Amman, Jordan" },
    { title: "Type", value: employee.type || "Full Time" },
  ];

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                <AlignJustify className="w-7 h-7 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Employee</h1>
            </div>

            {/* ✅ Edit & Delete Buttons side by side */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigate(`/editemployeepage/${employee.id}`, { state: { employee } })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this employee?")) {
                    try {
                      const token = await getAccessTokenSilently();
                      await deleteEmployee(employee.id, () => token);
                      alert("Employee deleted successfully.");
                      navigate("/employees");
                    } catch (err) {
                      console.error("Error deleting employee:", err);
                      alert("Failed to delete employee.");
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="flex gap-8 flex-wrap">
            {/* Left - Card */}
            <div className="flex-shrink-0">
              <div className="bg-[#192841] mt-5 text-white rounded-2xl p-8 w-80 mb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name || "Employee")}&background=random`}
                      alt="Employee Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=96&width=96";
                      }}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-white mb-6"></div>
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-1">Name</p>
                  <h2 className="text-white text-lg font-semibold">{employee.full_name}</h2>
                </div>
                <div className="mb-8">
                  <p className="text-gray-300 text-sm mb-1">Position</p>
                  <h3 className="text-white text-lg font-semibold">{employee.job_title}</h3>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-gray-300 text-sm">{employee.email}</p>
                  <p className="text-gray-300 text-sm">{employee.phone}</p>
                </div>
              </div>

              {/* Salary Info */}
              <div className="flex gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md flex-1">
                  <p className="text-gray-600 text-sm mb-1">Salary this Month</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-semibold">{employee.net_salary} JD</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      0.5%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Info Grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {informationBoxes.map((box, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <p className="text-gray-600 text-sm mb-2">{box.title}</p>
                    <p className="text-gray-900 font-semibold text-lg">{box.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
