import Navigation from './components/Navigation';
import Hero from './components/Hero';
import NFTCollection from './components/NFTCollection';
import LoreHub from './components/LoreHub';
import Community from './components/Community';
import Vision from './components/Vision';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

import Profile from './components/Profile';
import Settings from './components/Settings';
import Support from './components/Support';
import MyNFTs from './components/MyNFTs';
import SellNFT from './components/SellNFT';
import ActivityPage from './components/ActivityPage';
import Whitepaper from './components/Whitepaper';
import FAQs from './components/FAQs';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Cookies from './components/Cookies';


// Router imports
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';


function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation (e.g., /#nft-collection)
    if (location.hash) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (location.pathname === '/') {
      // Scroll to top when navigating to home without hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navigation />
        <ScrollToHash />

        <Routes>

          {/* 🏠 Homepage */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <NFTCollection />
                <LoreHub />
                <Community />
                <Vision />
                <Footer />
              </>
            }
          />

          {/* 🧑‍🚀 User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 👤 User Pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />

          {/* 📦 User NFTs */}
          <Route path="/mynfts" element={<MyNFTs />} />

          {/* 💰 Sell NFT Page */}
          <Route path="/sell" element={<SellNFT />} />

          {/* 📜 Full Recent Activity Page */}
          <Route path="/activity" element={<ActivityPage />} />

          {/* 📄 Resources Pages */}
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
