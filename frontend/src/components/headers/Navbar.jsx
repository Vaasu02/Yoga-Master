import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import useThemeSwitcher from '../hook/useThemeSwitcher'
import { motion } from 'framer-motion';


const navLinks = [
  { name: "Home", route: "/" },
  { name: "Instructors", route: "/instructors" },
  { name: "Classes", route: "/classes" },
];


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, seIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useThemeSwitcher();
  const [navBg, setNavBg] = useState("bg-[#15151580]");
  const user = true;

  const toggleMobileMenu = () => {
    seIsMobileMenuOpen(!isMobileMenuOpen);
  };



  // useEffect(() => {
  //   const darkClass = "dark";
  //   const root = window.document.documentElement;
  //   if (isDarkMode) {
  //     root.classList.add(darkClass);
  //   } else {
  //     root.classList.remove(darkClass);
  //   }
  // }, [isDarkMode]);

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLogin(location.pathname === "/login");
    setIsFixed(
      location.pathname === "/register" || location.pathname === "/login"
    );
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handelLogout = () => {
    console.log("logged out");
  }

  useEffect(() => {
    if (scrollPosition > 100) {
      if (isHome) {
        setNavBg(
          "bg-white backdrop-filter backdrop-blur-xl bg-opacity-0 dark:text-white text-black"
        );
      } else {
        setNavBg("bg-white dark:bg-black dark:text-white text-black");
      }
    } else {
      setNavBg(
        `${isHome || location.pathname === "/"
          ? "bg-transparent"
          : "bg-white dark:bg-black"
        }dark:text-white text-white`
      );
    }
  }, [scrollPosition]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${isHome ? navBg : "bg-white border border-b-2 border-black dark:bg-black backdrop-blur-2xl"} ${isFixed ? 'static' : 'fixed'} top-0 transition-colors duration-500 ease-in-out w-full z-10`}
    >

      <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
        {/* logo */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center">
            <div>
              <h1 className="text-2xl inline-flex gap-3 items-center font-bold">
                YogaMaster
                <img src="/logo.jpg" alt="not" className="w-8 h-8" />
              </h1>
              <p className="font-bold text-[13px] tracking-[8px]">
                Quick Explore
              </p>
            </div>
          </div>

          {/* mobile menu */}
          <div className="md:hidden flex items-center">
            <button type="button" onClick={toggleMobileMenu} className="text-gray-300 hover:text-white focus:outline-none" ><FaBars className="h-6 w-6 hover:text-primary" /></button>
          </div>


          <div className="hidden md:block text-black dark:text-white">
            <div className="flex">
              <ul className="ml-10 flex items-center space-x-4 pr-4">
                {navLinks.map((link) => (
                  <li key={link.route}>
                    <NavLink
                      to={link.route}
                      style={{ whiteSpace: 'nowrap' }}
                      className={({ isActive }) =>
                        `font-bold ${isActive
                          ? "text-secondary"
                          : `${navBg.includes("bg-transparent")
                            ? "text-white"
                            : "text-black dark:text-white"
                          }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}

                {/* based on user */}
                {user ? null : isLogin ? (
                  <li>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `font-bold ${isActive
                          ? "text-secondary"
                          : `${navBg.includes("bg-transparent")
                            ? "text-white"
                            : "text-black dark:text-white"
                          }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      Register
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `font-bold ${isActive
                          ? "text-secondary"
                          : `${navBg.includes("bg-transparent")
                            ? "text-white"
                            : "text-black dark:text-white"
                          }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                )}

                {user && (
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        `font-bold ${isActive
                          ? "text-secondary"
                          : `${navBg.includes("bg-transparent")
                            ? "text-white"
                            : "text-black dark:text-white"
                          }`
                        } hover:text-secondary duration-300`
                      }
                      to="/dashboard"
                    >
                      DashBoard
                    </NavLink>
                  </li>
                )}

                {user && (
                  <li>
                    <img
                      src="/logo.jpg"
                      alt="no"
                      className="h-[40px] rounded-full w-[40px]"
                    />
                  </li>
                )}

                {
                  user && <li>
                    <NavLink onClick={handelLogout}
                      className={'font-bold px-3 py-2 bg-secondary text-white rounded-xl'}
                    >Logout</NavLink>
                  </li>
                }

                {/* color toggle */}
                <li>
                  <button onClick={() => setIsDarkMode(isDarkMode === "light" ? "dark" : "light")}
                    className={`ml-3 flex items-center justify-center rounded-full p-1
                    ${isDarkMode === "light" ? "bg-dark text-light" : "bg-light text-dark"}`}
                  >
                    {
                      isDarkMode === "dark" ?
                        <FaSun className={"fill-dark"} />
                        : <FaMoon className={"fill-dark"} />
                    }
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
