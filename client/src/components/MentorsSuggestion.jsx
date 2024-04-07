import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook to navigate programmatically
import MentorCard from './MentorCard'; // Import the MentorCard component

const MentorSuggestions = () => {
  const [mentors, setMentors] = useState([]); // State to hold the mentors data

  useEffect(() => {
    // Function to fetch mentors data from the backend
    const fetchMentors = async () => {
      try {
        const data={};
        const response = await await fetch('http://localhost:5000/api/user/generaldata', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }); // Adjust the API endpoint URL accordingly
        if (response.ok) {
          const data = await response.json();
          setMentors(data); // Set the mentors state with the fetched data
        } else {
          console.error('Failed to fetch mentors:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors(); // Call the fetchMentors function when the component mounts
  }, []); // Dependency array to ensure the effect runs only once on component mount




  

 

  return (
    <div className="mentor-page">
      <div className="dark:bg-slate-800 gap-6 flex-col items-end justify-end" style={{ alignItems: 'flex-end' }}>
        {mentors.map((mentor, index) => (
          // Wrap MentorCard with a clickable element and attach onClick event handler
          <div key={index}  className='h-1/2 cursor-pointer'>
            <MentorCard mentor={mentor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorSuggestions;
