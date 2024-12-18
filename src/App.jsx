import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dex from './components/Dex';
import Builder from './components/Builder';
import Tracker from './components/Tracker';
import Counter from './components/Counter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* main app component */
function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full overflow-y-auto bg-[#f0f0f0]">
        <motion.div
          className="fixed inset-0 min-h-screen w-full bg-[linear-gradient(to_right,#ee151580_1px,transparent_1px),linear-gradient(to_bottom,#ee151580_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
          animate={{
            x: [14, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.25,
            ease: "linear",
          }}
        />
        <main className="relative z-10 flex flex-col items-center px-4 md:px-8 lg:px-16">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dex" element={<Dex />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/counter" element={<Counter />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;