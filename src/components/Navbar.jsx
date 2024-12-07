import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="fixed top-0 z-10 flex w-full flex-col items-center justify-between border-b-2 border-b-[#222224] bg-[#ee1515] px-16 py-6 text-white backdrop-blur-md">
      <div className="flex w-full items-center justify-between md:justify-evenly">
        <button
          onClick={() => scrollToSection('home')}
          className="text-3xl font-semibold opacity-80 transition-all duration-300 hover:opacity-100"
        >
          PokéMaster
        </button>

        {/* regular navigation */}
        <ul className="hidden md:flex gap-10">
          <li>
            <button
              onClick={() => scrollToSection('dex')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéDex
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('builder')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéBuilder
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('tracker')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéTracker
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('counter')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéCounter
            </button>
          </li>
        </ul>

        {/* mobile menu button */}
        <button className="text-xl md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* mobile navigation */}
      <div className={`md:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="mt-4">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <button
                onClick={() => scrollToSection('dex')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéDex
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('builder')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéBuilder
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('tracker')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéTracker
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('counter')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéCounter
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;