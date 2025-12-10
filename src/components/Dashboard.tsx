import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const card = "rounded-2xl bg-[#141414] border border-[#FF4500]/20 shadow-none";
const pad = "p-6 sm:p-7";

const activityPool = [
  { label: "Bought Ares Scout #214", price: "0.42 ETH", color: "bg-emerald-400" },
  { label: "Listed Olympus Rover #88", price: "1.05 ETH", color: "bg-blue-400" },
  { label: "Sold Dust Runner #12", price: "0.78 ETH", color: "bg-amber-400" },
  { label: "Canceled listing for Helios Patch #7", price: "0.15 ETH", color: "bg-gray-500" },
  { label: "Received offer for Mars Token #92", price: "0.21 ETH", color: "bg-purple-400" },
  { label: "Placed bid on Rover Chip #48", price: "0.31 ETH", color: "bg-pink-400" },
];

type Activity = {
  label: string;
  price: string;
  color: string;
  time: string;
  timestamp: number;
  id: string;
};

const Dashboard: React.FC = () => {
  const priceRange = useMemo(() => ({ min: 0.2, max: 1.2 }), []);

  // Generate sequential time display based on timestamp
  const getTimeDisplay = (timestamp: number): string => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const randomPrice = () => {
    const { min, max } = priceRange;
    const value = Math.random() * (max - min) + min;
    return `${value.toFixed(2)} ETH`;
  };

  // Generate initial sequential activities
  const generateInitialActivities = (): Activity[] => {
    const now = Date.now();
    const timeOffsets = [3, 10, 45, 120, 360, 1440]; // minutes in sequence
    
    return timeOffsets.map((minutesAgo, index) => {
      const base = activityPool[index % activityPool.length];
      const timestamp = now - (minutesAgo * 60 * 1000);
      
      return {
        ...base,
        price: base.price === "-" ? randomPrice() : base.price,
        time: getTimeDisplay(timestamp),
        timestamp,
        id: `initial-${timestamp}-${index}`
      };
    });
  };

  // Load activities from localStorage or generate initial ones
  const loadActivities = (): Activity[] => {
    try {
      const saved = localStorage.getItem('marsPioneersActivities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Update time displays for loaded activities
          return parsed.map(activity => ({
            ...activity,
            time: getTimeDisplay(activity.timestamp)
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load activities from localStorage');
    }
    
    return generateInitialActivities();
  };

  const [activities, setActivities] = useState<Activity[]>(() => loadActivities());

  // Save activities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('marsPioneersActivities', JSON.stringify(activities));
    } catch (error) {
      console.warn('Failed to save activities to localStorage');
    }
  }, [activities]);

  // Update time displays every minute to age the activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          time: getTimeDisplay(activity.timestamp)
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Continuous activity generation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const base = activityPool[Math.floor(Math.random() * activityPool.length)];
        const newActivity: Activity = {
          ...base,
          price: base.price === "-" ? randomPrice() : base.price,
          timestamp: Date.now(),
          time: "Just now",
          id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Add to top and limit to 20 items
        return [newActivity, ...prev].slice(0, 20);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [priceRange]);

  // Sort by timestamp (newest first) and take only first 5 for dashboard
  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => b.timestamp - a.timestamp),
    [activities]
  );

  // Show only latest 5 activities on dashboard
  const visibleActivities = sortedActivities.slice(0, 5);

  const actionButton =
    "min-w-[115px] h-11 inline-flex items-center justify-center rounded-xl border border-[#FF4500]/40 bg-gradient-to-b from-[#141414] to-[#0b0b0b] px-5 text-sm font-semibold text-gray-100 hover:border-[#FF4500]/80 hover:text-white transition-colors duration-200";

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 pt-32 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-[#FF4500]/70">
              User Mission Hub
            </p>
            <h1 className="text-4xl font-bold text-white">Pioneer Control Center</h1>
            <p className="mt-2 text-gray-400 max-w-xl">
              Track your purchases, listings, and market activity inside the Mars Pioneers marketplace.
            </p>
          </div>

          {/* Buttons - Removed Settings and Support */}
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link to="/profile" className={actionButton}>
              Profile
            </Link>
            <Link to="/mynfts" className={actionButton}>
              My NFTs
            </Link>
            <Link to="/sell" className={actionButton}>
              Sell NFT
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Owned NFTs", value: 0 },
            { title: "Listed NFTs", value: 0 },
            { title: "Total Purchases", value: 0 },
            { title: "Total Sales", value: 0 },
          ].map((stat) => (
            <div key={stat.title} className={`${card} ${pad}`}>
              <p className="text-xs uppercase text-gray-400 tracking-wide">{stat.title}</p>
              <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* RECENT ACTIVITY */}
          <div className={`${card} ${pad} lg:col-span-2`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link
                to="/activity"
                state={{ activities: sortedActivities }}
                className="text-[#FF4500] text-sm hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {visibleActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
                    <div>
                      <p className="text-white">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MARKET HIGHLIGHTS - Fixed height with self-start */}
          <div className={`${card} ${pad} self-start lg:sticky lg:top-32`}>
            <h2 className="text-xl font-semibold mb-6">Market Highlights</h2>

            <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0f0f0f] py-10">
              <p className="text-sm text-gray-500 text-center">
                Market data will appear here once available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;