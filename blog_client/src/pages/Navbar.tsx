
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Blog", to: "/blog" },       
    { name: "Profile", to: "/profile" },
    { name: "Login", to: "/login" },
    { name: "Register", to: "/register" },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {}
        <h1 className="text-xl font-bold">Blog APP</h1>

        {}
        <button
          className="lg:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <span className="text-2xl">☰</span>
        </button>

        {}
        <div className="hidden lg:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {}
      {open && (
        <div className="flex flex-col gap-4 mt-4 lg:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
