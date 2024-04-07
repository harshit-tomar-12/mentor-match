import { Link ,useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import picnav from '../asstes/picnav.png';

export default function Navigation() {
  const email = localStorage.getItem("email");
  const [userName, setUserName] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  let navigate=useNavigate();

 let url='';
 if(localStorage.getItem('url')){
  url=localStorage.getItem('url');
 }
 
  const handleLogout = () => {
    // Clear email and userID from local storage
    localStorage.removeItem('email');
    localStorage.removeItem('userID');
    localStorage.removeItem('url');
    // Navigate to the landing page
    navigate('/');
  };

 

  return (
    <>
      <nav className="py-3 bg-footer border-solid shadow-2xl min-h-20 max-h-20">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link to="/" className="max-h-14 min-h-8 flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap pt-2 text-white">
              <img
                src={picnav}
                className="max-h-44 min-h-44"
                alt="M M Logo"
              />
            </span>
          </Link>

          <div className="flex items-center pt-2 lg:order-2">
          {!email && ( <Link
                to="/login"
                className="text-white bg-red-700 hover:bg-white hover:text-black font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-1 sm:mr-2 lg:mr-0 dark:bg-red-600 dark:hover:bg-red-500"
              >
                Login <i className="ri-login-box-line"></i>
              </Link>
            )}

            

            <div className="relative ml-3">
              <div>
              <button
                  type="button"
                  className="relative flex rounded-full bg-zinc-600 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-800"
                  id="user-menu-button"
                  aria-expanded={showDropdown} // Set aria-expanded based on dropdown visibility
                  aria-haspopup="true"
                  onClick={() => setShowDropdown(!showDropdown)} // Show dropdown on mouse enter
                   // Hide dropdown on mouse leave
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={url}
                    alt=""
                  />
                </button>
              </div>
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                  <div className="py-1" role="none">
                    <Link to="/adminprofile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" tabIndex="-1" id="user-menu-item-0">Profile</Link>
                    <Link to="/feed" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" tabIndex="-1" id="user-menu-item-1">Home</Link>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer" role="menuitem" tabIndex="-1" id="user-menu-item-2"onClick={handleLogout}>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
}
