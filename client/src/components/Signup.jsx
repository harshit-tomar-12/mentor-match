import { useState } from "react";
import picui from "../asstes/picui.png";
import Navigation from "./Navigation";

import "../index.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Example() {
  const [Username, setUsername] = useState("");
  const [Address, setAddress] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const [selectedImageFiles, setSelectedImageFiles] = useState('');
  const [admin, setAdmin] = useState(false);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const isAdmin = admin === 'mentor' || admin === 'both';
  
    

    // Create a data object with email and password
    const data = { email, password,Username,Phonenumber,Address,isAdmin, selectedImageFiles};

    try {
      // Send a POST request to your backend API
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        // Handle successful submission
        console.log("User signed up successfully!");
        // Update state variable to redirect to login page
        navigate('/login');
      } else {
        // Handle errors if the request was not successful
        console.error("Failed to sign up:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    const base64Files = await convertBase64(file)
  
   
  
    setSelectedImageFiles(base64Files);
  };

  

  return (
    <>
    <Navigation/>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 min-h-screen h-full lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/feed">
            <img
              className="mx-auto h-10 w-auto"
              src={picui}
              alt="Mentor Match"
            />
          </Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-200">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold leading-6 text-zinc-300"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="Username"
                  name="Username"
                  type="Username"
                  autoComplete="Username"
                  required
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
           
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold leading-6 text-zinc-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold leading-6 text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="Address"
                className="block text-sm font-bold leading-6 text-zinc-300"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  id="Address"
                  name="Address"
                  type="Address"
                  autoComplete="Address"
                  required
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="Phonenumber"
                className="block text-sm font-bold leading-6 text-zinc-300"
              >
                Phonenumber
              </label>
              <div className="mt-2">
                <input
                  id="Phonenumber"
                  name="Phonenumber"
                  type="Phonenumber"
                  autoComplete="Phonenumber"
                  required
                  value={Phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  className="block text-sm font-bold leading-6 text-zinc-300"
                >
                  Role
                </label>
              </div>
              <div className="mt-2">
                <label htmlFor="mentor" className="flex items-center">
                  <input
                    type="radio"
                    id="mentor"
                    name="role"
                    value="mentor"
                    checked={admin === "mentor"}
                    onChange={() => setAdmin("mentor")}
                  />
                  <span className="ml-2 text-gray-900">Mentor</span>
                </label>
                <label htmlFor="mentee" className="flex items-center">
                  <input
                    type="radio"
                    id="mentee"
                    name="role"
                    value="mentee"
                    checked={admin === "mentee"}
                    onChange={() => setAdmin("mentee")}
                  />
                  <span className="ml-2 text-gray-900">Mentee</span>
                </label>
                <label htmlFor="both" className="flex items-center">
                  <input
                    type="radio"
                    id="both"
                    name="role"
                    value="both"
                    checked={admin === "both"}
                    onChange={() => setAdmin("both")}
                  />
                  <span className="ml-2 text-gray-900">Both</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Upload Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} multiple />
          </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-300">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-red-600 hover:text-zinc-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
