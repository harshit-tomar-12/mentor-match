import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mentor card component
const MentorCard = ({ mentor }) => {
  const navigate = useNavigate(); 
  // State to manage follow status
  const [isFollowing, setIsFollowing] = useState(false);

  // Function to handle follow button click
  const handleFollow = () => {
    // Toggle follow status
    setIsFollowing(!isFollowing);
  };

  const handleMentorClick = () => {
    // Navigate to ProfileCard component passing the mentor's data
    
    navigate(`/profile`,  { state: { mentor } });
  };
  return (
    <div className="dark:bg-slate-800 gap-6 flex items-center justify-center my-2 mx-2">
      <div className="bg-gray-100 dark:bg-gray-700 relative shadow-xl overflow-hidden hover:shadow-2xl group rounded-xl p-5 transition-all duration-500 transform">
        <div className="flex items-center gap-4">
          <img 
            src={mentor.filename}
            className="w-14 group-hover:w-14 group-hover:h-18 h-14 object-center object-cover rounded-full transition-all duration-500 delay-500 transform"
            alt="Mentor Avatar"
          />
          <div className="flex flex-col" onClick={handleMentorClick}>
            <h1 className="text-gray-600 dark:text-gray-200 font-bold text-sm md:text-lg">
              {mentor.username}
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">{mentor.phonenumber}</p>
            <a
              className="text-xs text-gray-500 dark:text-gray-200 group-hover:opacity-100 opacity-0 transform transition-all delay-300 duration-500"
            >
              {mentor.address}
            </a>
          </div>
          {/* Conditional rendering of follow button based on follow status */}
          {!isFollowing ? (
            <button 
              className="follow-button text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-md py-1 px-3 transition-colors duration-300 ease-in-out transform hover:scale-105"
              onClick={handleFollow} // Call handleFollow when button is clicked
            >
              Follow
            </button>
          ) : (
            <button 
              className="follow-button text-xs text-white bg-green-500 hover:bg-green-600 rounded-md py-1 px-3 transition-colors duration-300 ease-in-out transform hover:scale-105"
              onClick={handleFollow} // Call handleFollow when button is clicked
            >
              Following
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
