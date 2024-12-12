import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-10 flex w-full flex-col items-center justify-between border-b-2 border-b-[#222224] bg-[#ee1515] px-16 py-6 text-white backdrop-blur-md">
      <div className="flex w-full items-center justify-between md:justify-evenly">
        <Link
          to="/"
          className="text-3xl font-semibold opacity-80 transition-all duration-300 hover:opacity-100"
        >
          PokéMaster
        </Link>

        {/* regular navigation */}
        <ul className="hidden md:flex gap-10">
          <li>
            <button
              onClick={() => handleNavigation('/dex')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéDex
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/builder')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéBuilder
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/tracker')}
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéTracker
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/counter')}
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
                onClick={() => handleNavigation('/dex')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéDex
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/builder')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéBuilder
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/tracker')}
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
              >
                PokéTracker
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/counter')}
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