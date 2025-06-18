import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { AlignJustify } from "lucide-react";
import { getPayroll } from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserRole } from "../lib/auth";


const PayrollCard = () => {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const role = getUserRole(user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        if (!isAuthenticated || role !== "admin") {
          return;
        }

        const data = await getPayroll(id, getAccessTokenSilently);
        setPayroll(data);
      } catch (err) {
        console.error("Error loading payroll card:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [id, getAccessTokenSilently, isAuthenticated, role]);

  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Unauthorized: Admin access only.
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#F3F8FF] font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-6 m-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar}>
                <AlignJustify className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">Payroll Summary</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : payroll ? (
            <div className="space-y-4 text-gray-800 text-sm">
              <div><strong>Employee:</strong> {payroll.full_name}</div>
              <div><strong>Department:</strong> {payroll.department}</div>
              <div><strong>Base Salary:</strong> {payroll.base_salary} JD</div>
              <div><strong>Bonus:</strong> {payroll.bonus} JD</div>
              <div><strong>Deductions:</strong> {payroll.deductions} JD</div>
              <div><strong>Net Salary:</strong> <span className="font-bold text-green-600">{payroll.net_salary} JD</span></div>
              <div><strong>Last Updated:</strong> {new Date(payroll.updated_at).toLocaleString()}</div>
            </div>
          ) : (
            <div className="text-red-500">Payroll not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCard;
