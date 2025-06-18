import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import HRDashboard from "./pages/dashboard";
import EmployeesPage from "./pages/employees";
import EmployeeProfile from "./pages/employeecard";
import EditEmployeePage from "./pages/editemployeepage";
import PayrollPage from "./pages/payroll";
import PayrollCard from "./pages/payrollcard";
import TimerollPage from "./pages/timeroll";
import TimerollCard from "./pages/timerollcard";
import JobApplications from "./pages/jobapplication";
import OnBoarding from "./pages/onboardingpage";
import UserRequests from "./pages/userrequests";
import UserJobRequest from "./pages/userjobrequest";
import EmployeeInfoPage from "./pages/usernformation";
import AddEmployeePage from "./pages/addemployeepage";
import Login from "./pages/login";
import NotFound from "./pages/NotFound"; // ✅ Import the 404 page

import { getUserRole } from "./lib/auth";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const role = isAuthenticated ? getUserRole(user) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading user permissions...</p>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<HRDashboard />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/addemployeepage" element={<AddEmployeePage />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/editemployeepage/:id" element={<EditEmployeePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/payrollcard" element={<PayrollCard />} />
        <Route path="/timeroll" element={<TimerollPage />} />
        <Route path="/timerollcard/:id" element={<TimerollCard />} />
        <Route path="/jobapplication" element={<JobApplications />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/onboarding/:id" element={<OnBoarding />} />
        <Route path="/userrequests" element={<UserRequests />} />
        <Route path="/userjobrequest" element={<UserJobRequest />} />
        <Route path="/user-information" element={<EmployeeInfoPage />} />
        <Route path="*" element={<NotFound />} /> {/* ✅ 404 fallback */}
      </Routes>
    );
  }

  if (role === "user") {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/user-information" />} />
        <Route path="/login" element={<Navigate to="/user-information" />} />
        <Route path="/user-information" element={<EmployeeInfoPage />} />
        <Route path="/userrequests" element={<UserRequests />} />
        <Route path="/userjobrequest" element={<UserJobRequest />} />
        <Route path="*" element={<NotFound />} /> {/* ✅ 404 fallback */}
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-4">No valid role found for your account.</p>
        <p className="text-sm text-gray-500">Role detected: {role}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default App;
