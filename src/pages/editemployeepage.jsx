import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { updateEmployee, getEmployee } from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import { Save } from "lucide-react";

const EditEmployeePage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    full_name: "",
    job_title: "",
    department: "",
    phone: "",
    email: "",
    base_salary: "",
    bonus: "",
    deductions: "",
    hire_date: "",
    status: "Active",
    role: "employee",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = state?.employee
          ? state.employee
          : await getEmployee(id, () => token);

        setFormData({
          full_name: data.full_name,
          job_title: data.job_title,
          department: data.department,
          phone: data.phone,
          email: data.email,
          base_salary: data.base_salary,
          bonus: data.bonus,
          deductions: data.deductions,
          hire_date: data.hire_date?.split("T")[0] || "", // Ensure date format
          status: data.status,
          role: data.role,
        });
      } catch (error) {
        console.error("Failed to load employee data:", error);
        alert("Error loading employee");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, state, getAccessTokenSilently]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getAccessTokenSilently();
      await updateEmployee(id, formData, () => token);
      alert("Employee updated successfully");
      navigate(`/employee/${id}`);
    } catch (error) {
      console.error("Failed to update employee", error);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading employee data...</div>;
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <button onClick={toggleSidebar}>
              <span className="text-lg font-semibold">Edit Employee</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-lg"
              placeholder="Full Name"
            />
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-lg"
              placeholder="Job Title"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-lg"
              placeholder="Department"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
              placeholder="Phone"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-lg"
              placeholder="Email"
            />
            <input
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleInputChange}
              placeholder="Base Salary"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              name="bonus"
              value={formData.bonus}
              onChange={handleInputChange}
              placeholder="Bonus"
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleInputChange}
              placeholder="Deductions"
              className="border px-4 py-2 rounded-lg"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>

            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeePage;
