import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux';
import { Coins } from "lucide-react"
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import confetti from "canvas-confetti";

const Home = () => {
  const [openlogin, setOpenLogin] = useState(false)
  const { userData } = useSelector(state => state.user)
  const [openProfile, setOpenProfile] = useState(false)
  const [websites, setWebsites] = useState([])
  const [showCelebrate, setShowCelebrate] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/log-out`, { withCredentials: true })
      sessionStorage.removeItem("loginCelebrated");
      dispatch(setUserData(null))
      setOpenProfile(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const highlights = [
    {
      title: "AI Generated Code",
      desc: "GenAI builds production-ready websites with clean code, smooth animations, and responsive layouts. Designed for performance and scalability, making projects easy to grow."
    },
    {
      title: "Fully Responsive Layouts",
      desc: "GenAI helps you create real websites with clean code, beautiful animations, and responsive design. Turn your ideas into powerful web projects—fast and simple"
    },
    {
      title: "Production Ready Output",
      desc: "GenAI delivers modern websites with clean code, fluid animations, and scalable structure. Build faster, launch smarter, and grow without limits."
    }
  ];

  useEffect(() => {
    if (!userData) return
    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(result.data || [])
      } catch (error) {
        console.log(error)
      }
    }
    handleGetAllWebsites()
  }, [userData])

  useEffect(() => {
    if (!userData) return;

    // Prevent repeat on refresh
    if (sessionStorage.getItem("loginCelebrated")) return;

    sessionStorage.setItem("loginCelebrated", "true");
    setShowCelebrate(true);

    // Left confetti
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 }
    });

    // Right confetti
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 }
    });

    const timer = setTimeout(() => {
      setShowCelebrate(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userData]);

  return (
    <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center '>
          <div className='text-lg font-semibold cursor-pointer'>
            GenAI
          </div>
          <div className='flex items-center gap-5'>
            <div className='hidden md:inline text-sm text-white hover:text-zinc-400 cursor-pointer' onClick={() => navigate("/pricing")}>
              Pricing
            </div>
            {userData && <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition'>
              <Coins size={14} className='text-yellow-400' />
              <span className='text-zinc-300'>Credit</span>
              <span>{userData.credit}</span>
              <span className='font-semibold'>+</span>
            </div>}
            {!userData ?
              <button className='px-4 py-2 rounded-lg border border-green-400 hover:bg-white/10 text-sm cursor-pointer' onClick={() => setOpenLogin(true)} >
                Get Started
              </button> :
              <div className='relative' ref={profileRef}>
                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                  <img src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} className='w-9 h-9 rounded-full border-white/20 object-cover' /></button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'
                      >
                        <div className='px-4 py-3 border-b border-white/10'>
                          <p className='text-sm font-medium truncate'>{userData.name}</p>
                          <p className='text-xs text-zinc-200 truncate'>{userData.email}</p>
                        </div>
                        <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                          <Coins size={14} className='text-yellow-400' />
                          <span className='text-zinc-300' onClick={() => navigate("/pricing")}>Credit</span>
                          <span>{userData.credit}</span>
                          <span className='font-semibold'>+</span>
                        </button>
                        <button className='w-full px-4 py-3 text-left text-sm hover:bg-white/5' onClick={() => navigate("/dashboard")}>DashBoard</button>
                        <button className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5'
                          onClick={handleLogout}
                        >Logout</button>

                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            }
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className='pt-44 pb-32 px-6 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-5xl md:text-7xl font-bold tracking-tight'>
          Build Stunning Websites <br />
          <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'> with AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
        >
          Describe your idea and let AI generate a modern,responsive, production-ready websites.
        </motion.p>
        <button className='px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12 cursor-pointer' onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}>
          {userData ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>
      {!userData &&
        <section className='max-w-7xl mx-auto px-6 pb-32'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className='rounded-2xl bg-white/5 border border-white/10 p-8'
              >
                <h1 className='text-xl font-semibold mb-3'>{h.title}</h1>
                <p className='text-sm text-zinc-400'>{h.desc}.</p>
              </motion.div>
            ))}
          </div>
        </section>}

      {userData && websites?.length > 0 && (
        <section className='max-w-7xl mx-auto px-6 pb-32'>
          <h3 className='text-2xl font-semibold mb-6'>Your Websites</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {websites.slice(0, 3).map((w, i) => (
              <motion.div
                key={w._id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/editor/${w._id}`)}
                className='cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden'>
                <div className='h-40 bg-black'>
                  <iframe srcDoc={w.latestCode}
                    sandbox="allow-scripts"
                    className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' />

                </div>
                <div className='p-4'>
                  <h3 className='text-base font-semibold'>{w.title}</h3>
                  <p className='text-xs text-zinc-400'>Last Updated {""}
                    {new Date(w.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      <footer className='border-t border-white/10 py-10 text-center text-sm text-white'>
        <span className="transition hover:text-zinc-500">
          &copy; {new Date().getFullYear()} GenAI. All rights reserved.
        </span>
      </footer>

      {
        openlogin && <LoginModal open={openlogin} onClose={() => setOpenLogin(false)} />
      }
      <AnimatePresence>
        {showCelebrate && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-200 "
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
