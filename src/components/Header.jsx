
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { notifs } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        {/* Logo Section */}
        <Link to="/" className="flex flex-col leading-tight">
          <h1 className="text-2xl font-extrabold text-green-400">Ride-Sher</h1>
          <span className="text-sm text-slate-200 tracking-wide">
            Car-Pooling Platform
          </span>
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-6 text-base font-medium items-center">
          <li className="relative">
  <Link
    to="/notifications"
    className="hover:text-green-400 transition duration-150 flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 9v5.159c0 .538-.214 1.055-.595 1.436L6 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
      />
    </svg>
    <span className="ml-1">Notifications</span>

    {/* 🔴 Badge */}
    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
      {notifs}
    </span>
  </Link>
</li>


            <li>
              <Link
                to="/me-as-driver"
                className="hover:text-green-400 transition duration-150"
              >
                MeAsDriver
              </Link>
            </li>
            <li>
              <Link
                to="/me-as-passenger"
                className="hover:text-green-400 transition duration-150"
              >
                MeAsPassenger
              </Link>
            </li>
            {/* <li>
              <Link
                to="/my-journeys"
                className="hover:text-green-400 transition duration-150"
              >
                My Journeys
              </Link>
            </li> */}
            <li>
              <Link
                to="/"
                className="hover:text-green-400 transition duration-150"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-green-400 transition duration-150"
              >
                About
              </Link>
            </li>
            <li>
              <Link to="/profile">
                {currentUser ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-green-400 hover:scale-105 transition duration-150"
                  />
                ) : (
                  <span className="hover:text-green-400 transition duration-150">
                    Sign In
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

