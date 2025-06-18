"use client";

import { useState } from "react";

const createJobApplication = async (data) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/job-applications/public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit application");
  }

  return res.json();
};

const UserJobRequest = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    work_location: "",
    classification: "",
    resume_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createJobApplication(formData);
      setMessage("Application submitted successfully! We'll review it and get back to you.");
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        work_location: "",
        classification: "",
        resume_url: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Sales Representative",
    "Marketing Specialist",
    "HR Specialist",
    "Accountant",
    "Project Manager",
  ];

  const departments = ["Engineering", "Design", "Sales", "Marketing", "HR", "Finance", "Operations"];

  return (
    <div className="min-h-screen bg-[#F3F8FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img src="/assets/logo.png" alt="Company Logo" className="w-32 h-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Our Team</h1>
            <p className="text-gray-600">Apply for a position at Clicks Digitals</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input fields */}
              {[
                { label: "Full Name *", name: "full_name", type: "text", required: true },
                { label: "Email Address *", name: "email", type: "email", required: true },
                { label: "Phone Number", name: "phone", type: "tel" },
                { label: "Resume/CV URL (Optional)", name: "resume_url", type: "url" },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required={required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter your ${name.replace("_", " ")}`}
                  />
                </div>
              ))}

              {/* Dropdowns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Work Location</label>
                <select
                  name="work_location"
                  value={formData.work_location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <select
                  name="classification"
                  value={formData.classification}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserJobRequest;
