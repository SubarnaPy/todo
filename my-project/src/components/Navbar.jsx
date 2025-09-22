import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClass = "relative px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105";
  const mobileNavLinkClass = "block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 transform hover:translate-x-2";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-gradient-to-r from-white/95 via-indigo-50/90 to-purple-50/95 dark:from-slate-900/95 dark:via-indigo-900/80 dark:to-purple-900/90 backdrop-blur-xl shadow-2xl border-b border-indigo-200/30 dark:border-indigo-700/50'
        : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-slate-800 dark:via-purple-900 dark:to-indigo-900 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-110 ${
              scrolled
                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-200 dark:shadow-indigo-900/50'
                : 'bg-white/20 backdrop-blur-sm shadow-white/20'
            }`}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className={`text-3xl font-bold cursor-pointer transition-all duration-500 ${
              scrolled ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' : 'text-white'
            }`}>
              Todo<span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Pro</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="/" className={`relative px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              scrolled
                ? 'text-indigo-700 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 dark:text-indigo-300 dark:hover:text-white dark:hover:from-indigo-600 dark:hover:to-purple-600'
                : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-5 h-5 mr-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-white/20'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                Home
              </span>
            </a>
            <a href="/tasks" className={`relative px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              scrolled
                ? 'text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 dark:text-emerald-300 dark:hover:text-white dark:hover:from-emerald-600 dark:hover:to-teal-600'
                : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-5 h-5 mr-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-white/20'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Tasks
              </span>
            </a>
            {/* <a href="/about" className={`relative px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              scrolled
                ? 'text-violet-700 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500 dark:text-violet-300 dark:hover:text-white dark:hover:from-violet-600 dark:hover:to-purple-600'
                : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-5 h-5 mr-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-violet-100 dark:bg-violet-800' : 'bg-white/20'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About
              </span>
            </a>
            <a href="/contact" className={`relative px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              scrolled
                ? 'text-rose-700 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 dark:text-rose-300 dark:hover:text-white dark:hover:from-rose-600 dark:hover:to-pink-600'
                : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-5 h-5 mr-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-rose-100 dark:bg-rose-800' : 'bg-white/20'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Contact
              </span>
            </a> */}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl ${
                scrolled
                  ? 'text-amber-600 hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 dark:text-amber-400 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30'
                  : 'text-white hover:bg-white/10'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-amber-100 dark:bg-amber-800' : 'bg-white/20'
              }`}>
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 translate-y-2 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-2' : 'translate-y-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-6 space-y-3 ${
            scrolled
              ? 'border-t border-indigo-200/50 dark:border-indigo-700/50 bg-gradient-to-b from-white/50 to-indigo-50/30 dark:from-slate-800/50 dark:to-indigo-900/30'
              : 'border-t border-white/20 bg-gradient-to-b from-white/10 to-transparent'
          }`}>
            <a href="/" className={`${mobileNavLinkClass} ${
              scrolled ? 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50' : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-white/20'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                Home
              </span>
            </a>
            <a href="/tasks" className={`${mobileNavLinkClass} ${
              scrolled ? 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50' : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-white/20'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Tasks
              </span>
            </a>
            {/* <a href="/about" className={`${mobileNavLinkClass} ${
              scrolled ? 'text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-800/50' : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-violet-100 dark:bg-violet-800' : 'bg-white/20'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About
              </span>
            </a> */}
            {/* <a href="/contact" className={`${mobileNavLinkClass} ${
              scrolled ? 'text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800/50' : 'text-white hover:bg-white/10'
            }`}>
              <span className="flex items-center">
                <div className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-rose-100 dark:bg-rose-800' : 'bg-white/20'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Contact
              </span>
            </a> */}

            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className={`${mobileNavLinkClass} w-full text-left ${
                scrolled ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50' : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="flex items-center">
                <div className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-amber-100 dark:bg-amber-800' : 'bg-white/20'
                }`}>
                  {isDark ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
