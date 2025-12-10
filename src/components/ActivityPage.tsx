
import { useLocation, Link } from "react-router-dom";

export default function ActivityPage() {
  const location = useLocation();
  const activities = location.state?.activities || [];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 pt-32 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">All Recent Activity</h1>

        <Link to="/dashboard" className="text-[#FF4500] text-sm hover:underline">
          ← Back to Dashboard
        </Link>

        <div className="mt-6 divide-y divide-white/10">
          {activities.length === 0 && (
            <p className="text-gray-400 text-sm mt-4">No activity found.</p>
          )}

          {activities.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>

              <p className="text-sm text-gray-300">
                {item.price === "-" ? "-" : item.price}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
