import React,{useEffect,useState} from "react";
import ProfileCard from "./ProfileCard";
import ProfilePosts from "./ProfilePosts";
import { useNavigate } from 'react-router-dom';
import Navigation from "./Navigation";
export default function AdminProfile() {
  let navigate=useNavigate();
const email=localStorage.getItem('email');
if(!email){
  navigate('/login');
}

  const [AdminInfo,setAdminInfo]=useState('');




  useEffect(() => {
    // Retrieve email from local storage
    const email = localStorage.getItem("email");
    const data={email}
    

    // Fetch user data from backend using the email
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/generaldata', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if(response){
          const userdata=await response.json();
         
          setAdminInfo(userdata);
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, []);

  return (

    <>
        <Navigation/>
      <ProfileCard mentor={AdminInfo}/>
      {/* <ProfilePosts mentor={name}/> */}
    </>
  );
}