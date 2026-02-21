import { ArrowLeft, Check, Coins } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'; import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";
import { useState } from "react";
const plans = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    billing: "month",
    credits: 100,
    maxWebsites: 2,
    regenerations: 5,
    description: "Perfect to explore GenAI",
    features: [
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
    ],
    popular: false,
    button: "Get Started",
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    billing: "month",
    credits: 500,
    maxWebsites: 10,
    regenerations: 50,
    description: "For serious creators & freelancers",
    features: [
      "Everything in Free",
      "Faster generation",
      "Edit & regenerate",
    ],
    popular: true,
    button: "Upgrade to Pro",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹1499",
    billing: "month",
    credits: 1000,
    maxWebsites: "Unlimited",
    regenerations: "Unlimited",
    description: "For teams & power users",
    features: [
      "Unlimited iterations",
      "Highest priority",
      "Team collaboration",
      "Dedicated support",
    ],
    popular: false,
    button: "Contact Sales",
  },
];
const Pricing = () => {

  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null)

  const handleBilling = async (planKey) => {
    if (!userData) {
      navigate("/")
      return
    }
    if (planKey == "free") {
      navigate("/dashboard")
      return
    }
    setLoading(planKey)
    try {
      const result = await axios.post(`${serverUrl}/api/billing`, { planType: planKey }, { withCredentials: true })
      window.location.href = result.data.sessionUrl
      setLoading(null)
    } catch (error) {
      setLoading(null)
      console.log(error)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-40 w-100 h-100 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>
      <button
        className="relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back
      </button>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-zinc-400 text-lg">
          Buy credits once, build anytime.
        </p>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -14, scale: 1.03 }}
            className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
            ${p.popular
                ? "border-indigo-500 bg-linear-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
              }`}
          >
            {p.popular && (
              <span className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500">
                Most Popular
              </span>
            )}
            <h1 className="text-xl font-semibold mb-2">{p.name}</h1>
            <p className="text-zinc-400 text-sm mb-6">{p.description}</p>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-zinc-400 mb-1">/month</span>
            </div>
            <div className="flex items-center gap-2 mb-8">
              <Coins size={18} className="text-yellow-400" />
              <span className="font-semibold">{p.credits}     Credits</span>
            </div>
            <ul className="space-y-3 mb-10">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-zinc-300"><Check size={16} className="text-green-400" />{f}</li>
              ))}
            </ul>
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              onClick={() => handleBilling(p.key)}
              className={`w-full py-3 rounded-xl font-semibold transition ${p.popular ? "bg-indigo-500 hover:bg-indigo-600" : "bg-white/10 hover:bg-white/20"}disabled:opacity-60`}
            >{loading === p.key ? "Redirecting..." : p.button}

            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
