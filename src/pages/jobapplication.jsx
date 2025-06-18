import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { AlignJustify } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getJobApplications } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const JobApplications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getJobApplications(() => getAccessTokenSilently());
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationClick = (application) => {
    navigate(`/onboarding/${application.id}`, {
      state: { application },
    });
  };

  const categorizeApplications = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return {
      today: applications.filter((a) => new Date(a.submitted_at) >= today),
      yesterday: applications.filter((a) => {
        const d = new Date(a.submitted_at);
        return d >= yesterday && d < today;
      }),
      lastWeek: applications.filter((a) => {
        const d = new Date(a.submitted_at);
        return d >= lastWeek && d < yesterday;
      }),
      lastMonth: applications.filter((a) => {
        const d = new Date(a.submitted_at);
        return d >= lastMonth && d < lastWeek;
      }),
      onHold: applications.filter((a) => a.status === "on_hold"),
    };
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const ApplicationBox = ({ application }) => (
    <div
      className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
      onClick={() => handleApplicationClick(application)}
    >
      <p className="text-gray-600 text-sm">Name</p>
      <p className="font-semibold text-lg">{application.full_name}</p>
      <p className="text-xs text-gray-500 mt-1">{application.position}</p>
    </div>
  );

  const categorized = categorizeApplications();

  return (
    <div className="flex h-full w-full bg-[#F3F8FF]">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 p-6 m-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <AlignJustify className="w-8 h-8" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-[700px] px-4 py-2.5 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="space-y-8">
            {["today", "yesterday", "lastWeek", "lastMonth", "onHold"].map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
                  {category} ({categorized[category].length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categorized[category].map((app) => (
                    <ApplicationBox key={app.id} application={app} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
