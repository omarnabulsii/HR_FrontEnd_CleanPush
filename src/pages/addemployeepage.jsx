import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/sidebar"
import { AlignJustify, ArrowLeft, Save, Upload } from "lucide-react"
import { createEmployee } from "../api"
import { useAuth0 } from "@auth0/auth0-react"

console.log("✅ AddEmployeePage is rendering");

const AddEmployeePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()

  const [formData, setFormData] = useState({
    full_name: "",
    job_title: "",
    department: "",
    phone: "",
    email: "",
    password: "",
    base_salary: "",
    bonus: "",
    deductions: "",
    hire_date: "",
    status: "Active",
    role: "employee",
    photo: null,
  })

  const [saving, setSaving] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const employeeData = {
        full_name: formData.full_name,
        job_title: formData.job_title,
        department: formData.department,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        base_salary: Number.parseFloat(formData.base_salary) || 0,
        bonus: Number.parseFloat(formData.bonus) || 0,
        deductions: Number.parseFloat(formData.deductions) || 0,
        hire_date: formData.hire_date,
        status: formData.status,
        role: formData.role,
      }

      await createEmployee(employeeData, () => getAccessTokenSilently())
      alert("Employee added successfully!")
      navigate("/employees")
    } catch (error) {
      console.error("Error adding employee:", error)
      alert("Error adding employee")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto hover:shadow-xl transition-all duration-300">
          {/* Header Section */}
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
                Add New Employee
              </h1>
            </div>
            <Link
              to="/employees"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Employees
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
                  {formData.photo ? (
                    <img
                      src={URL.createObjectURL(formData.photo) || "/placeholder.svg"}
                      alt="Employee"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Upload className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter job title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date *</label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary</label>
                  <input
                    type="number"
                    name="base_salary"
                    value={formData.base_salary}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter base salary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bonus</label>
                  <input
                    type="number"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter bonus amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deductions</label>
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter deductions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/employees"
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeePage
