import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { AlignJustify, FileText } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

const OnBoarding = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [applicant, setApplicant] = useState(null);

  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`http://localhost:3001/api/job-applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Applicant not found");
        const data = await res.json();
        setApplicant(data);
      } catch (err) {
        console.error("Failed to fetch applicant:", err);
        alert("Unable to load applicant. Returning to job applications.");
        navigate("/jobapplication");
      }
    };

    fetchApplicant();
  }, [id, navigate, getAccessTokenSilently]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const steps = [1, 2, 3, 4];
  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    const token = await getAccessTokenSilently();

    try {
      if (selectedStatus === "approve") {
        const res = await fetch("http://localhost:3001/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: applicant.full_name,
            email: applicant.email,
            phone: applicant.phone,
            password: "12345678",
            role: "employee", // ✅ FIXED VALUE HERE
            job_title: applicant.position,
            department: applicant.department,
            hire_date: new Date().toISOString().split("T")[0],
            base_salary: 0,
            bonus: 0,
            deductions: 0,
            location: applicant.work_location,
            type: applicant.classification,
          }),
        });

        if (!res.ok) throw new Error("Failed to create user");
        alert("User approved and added to the system.");
        navigate("/employees");
      } else if (selectedStatus === "onhold") {
        const res = await fetch(`http://localhost:3001/api/job-applications/${applicant.id}/hold`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to move applicant to onhold");
        alert("Applicant moved back to job applications.");
        navigate("/jobapplication");
      } else {
        alert(`Only APPROVE or ONHOLD have defined actions.\nSelected: ${selectedStatus.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Error during onboarding action:", error);
      alert("An error occurred while processing the applicant. Check console for details.");
    }
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 bg-gray-50 rounded-lg">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );

  if (!applicant) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-gray-500 text-lg">
        Loading applicant...
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
                <AlignJustify className="w-8 h-8" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mt-1">Onboarding</h1>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-8">
              {steps.map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${num <= currentStep ? "bg-[#192841]" : "bg-gray-400"}`}>{num}</div>
                  {num < steps.length && <div className={`w-16 h-1 ${num < currentStep ? "bg-[#192841]" : "bg-gray-300"}`}></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-xl border p-8 shadow-lg">
            <div className="flex gap-8">
              <div className="flex flex-col items-center space-y-4 min-w-[200px]">
                <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                  <img src="/placeholder.svg?height=96&width=96" alt="Employee" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">{applicant.full_name}</h3>
                <p className="text-sm text-blue-600 text-center">{applicant.position}</p>
              </div>

              <div className="flex-1 w-full px-4">
                {currentStep === 1 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">New Employee</h2>
                    <div className="space-y-6 w-full">
                      <InfoRow label="Job Title" value={applicant.position} />
                      <InfoRow label="Department" value={applicant.department} />
                      <InfoRow label="Work Location" value={applicant.work_location} />
                      <InfoRow label="Classification" value={applicant.classification} />
                      <InfoRow label="Hire Date" value={new Date().toLocaleDateString()} />
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">Documents</h2>
                    <div className="grid grid-cols-2 gap-6">
                      {["CV", "Clearance", "ID", "Passport"].map((name, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-20 h-24 border border-red-500 rounded-md flex items-center justify-center bg-white mb-2">
                            <FileText className="w-12 h-12 text-red-500" />
                            <span className="absolute mt-6 text-xs font-bold text-red-500">PDF</span>
                          </div>
                          <span className="text-sm text-gray-700">{name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">Interview Scheduling</h2>
                    <p className="text-sm text-gray-500">Schedule feature (optional).</p>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">Review & Status</h2>
                    <div className="space-y-3">
                      {["approve", "pending", "deny", "onhold"].map((status) => (
                        <button
                          key={status}
                          className={`w-full py-2 px-4 rounded-full text-center transition-colors ${
                            selectedStatus === status
                              ? status === "approve"
                                ? "bg-green-500 text-white"
                                : "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button onClick={handleBack} disabled={currentStep === 1} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg">Back</button>
              {currentStep < 4 ? (
                <button onClick={handleNext} className="px-6 py-2 bg-[#192841] text-white rounded-lg">Next</button>
              ) : (
                <button onClick={handleFinish} className="px-6 py-2 bg-[#192841] text-white rounded-lg">Finish</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
