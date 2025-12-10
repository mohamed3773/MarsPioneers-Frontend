import React, { useState } from "react";

const faqs = [
  {
    question: "How do I list an NFT?",
    answer:
      "Open your NFT in the Sell flow, set a price, review the estimated receive amount, and confirm the listing. It goes live instantly.",
  },
  {
    question: "Can I edit the price after listing?",
    answer: "Yes, navigate to My NFTs, choose Edit Price on a listed item, and confirm the new amount.",
  },
  {
    question: "When do I receive funds?",
    answer: "Sales settle immediately to your connected wallet after marketplace and royalty fees are applied.",
  },
];

const Support: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-gray-400">Need help?</p>
        <h1 className="text-2xl font-semibold text-white">Support Center</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-[#121212] border border-[rgba(255,69,0,0.25)]/50 rounded-xl p-6 shadow-lg shadow-black/30 space-y-4">
          <h2 className="text-lg font-semibold text-white">FAQ</h2>
          <div className="divide-y divide-[#1f1f1f]">
            {faqs.map((item, index) => (
              <div key={item.question} className="py-3">
                <button
                  onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.question}</p>
                    {openIndex === index && (
                      <p className="text-sm text-gray-300 mt-2 leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                  <span className="text-orange-400 text-xl">{openIndex === index ? "−" : "+"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#121212] border border-[rgba(255,69,0,0.25)]/50 rounded-xl p-5 shadow-lg shadow-black/30 space-y-3">
            <h3 className="text-lg font-semibold text-white">Contact Form</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#0D0D0D] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-orange-500/50 outline-none"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={4}
              className="w-full bg-[#0D0D0D] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-orange-500/50 outline-none"
            />
            <button className="w-full bg-orange-500/80 hover:bg-orange-500 text-white font-semibold rounded-lg px-4 py-3 transition-colors shadow-lg shadow-orange-500/20">
              Send Message
            </button>
          </div>

          <div className="bg-[#121212] border border-[rgba(255,69,0,0.25)]/50 rounded-xl p-5 shadow-lg shadow-black/30 space-y-2">
            <h3 className="text-lg font-semibold text-white">Email Support</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Reach us directly at <span className="text-orange-400">support@marspioneers.io</span> for account or transaction inquiries.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Response time: under 24h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;