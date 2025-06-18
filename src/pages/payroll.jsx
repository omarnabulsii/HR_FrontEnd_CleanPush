import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { AlignJustify, Search, MoreVertical } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { getUserRole } from "../lib/auth";
import { getPayrollData } from "../api";

const PayrollPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const role = getUserRole(user);

  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-semibold">
        Unauthorized: Admin access only
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchPayroll = async () => {
    try {
      const data = await getPayrollData(getAccessTokenSilently);
      setPayrolls(data);
    } catch (error) {
      console.error("Failed to fetch payroll:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-roboto w-full">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <AlignJustify className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Payroll</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-gray-500 text-center">Loading payroll data...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">#ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Base Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Bonus</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Deductions</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Net Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payrolls.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.base_salary} JD
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.bonus} JD
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.deductions} JD
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.net_salary} JD
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/payrollcard?id=${item.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </a>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;