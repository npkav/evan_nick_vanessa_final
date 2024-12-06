import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 z-10 flex w-full flex-col items-center justify-between border-b-2 border-b-[#222224] bg-[#ee1515] px-16 py-6 text-white backdrop-blur-md">
      <div className="flex w-full items-center justify-between md:justify-evenly">
        <a
          href="#home"
          className="text-3xl font-semibold opacity-80 transition-all duration-300 hover:opacity-100"
        >
          PokéMaster
        </a>

        {/* regular navigation */}
        <ul className="hidden md:flex gap-10">
          <li>
            <a
              href="#pokedex"
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéDex
            </a>
          </li>
          <li>
            <a
              href="#pokebuilder"
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéBuilder
            </a>
          </li>
          <li>
            <a
              href="#poketracker"
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéTracker
            </a>
          </li>
          <li>
            <a
              href="#pokecounter"
              className="text-lg opacity-40 transition-all duration-300 hover:opacity-100 hover:text-[#f0f0f0]"
            >
              PokéCounter
            </a>
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
              <a
                href="#pokedex"
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
                onClick={toggleMenu}
              >
                PokéDex
              </a>
            </li>
            <li>
              <a
                href="#pokebuilder"
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
                onClick={toggleMenu}
              >
                PokéBuilder
              </a>
            </li>
            <li>
              <a
                href="#poketracker"
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
                onClick={toggleMenu}
              >
                PokéTracker
              </a>
            </li>
            <li>
              <a
                href="#pokecounter"
                className="text-lg opacity-40 transition-all duration-300 hover:opacity-100"
                onClick={toggleMenu}
              >
                PokéCounter
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;