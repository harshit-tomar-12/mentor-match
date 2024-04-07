import React, { useEffect, useState ,useRef} from 'react';
import Navigation from './Navigation';
import { FiEdit } from 'react-icons/fi';
import dummy from '../asstes/dummy.jpg'
import loadinganimation from '../asstes/loading.json';
import Lottie from 'lottie-react';

const Editprofile = () => {
    const [AdminInfo, setAdminInfo] = useState('');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
  
  
    const email=localStorage.getItem('email');
    const data = { email };
   
    const handleModalClose = () => {
        setSuccessModalVisible(false);
       
      
        
    };
  

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

    const handleImageUpdate = async (event) => {
        setLoading(true);
       const file = event.target.files[0];
      const images = await convertBase64(file)
      const postData =   {
        email: email,
        images: images,
      
      };
     
     

      try {
        const response = await fetch('http://localhost:5000/api/user/profile/uploadphoto', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            console.log('Image uploaded successfully!');
            const imageUrl = await response.text(); // Get the secure URL from the response
            console.log('Image uploaded successfully:', imageUrl);
            dummy=imageUrl;     
            fetchUserData();  
            setLoading(false);     // You can add logic here to update the UI or show a success message
        } else {
            console.error('Failed to upload image:', response.statusText);
            // You can add logic here to show an error message to the user
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        // You can add logic here to show an error message to the user
    }
    };
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/generaldata', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response) {
                const userdata = await response.json();
                setAdminInfo(userdata);
                // Set initial form data to pre-fill the input fields
                setFormData(userdata);
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        // Retrieve email from local storage
        const email = localStorage.getItem("email");
        

        // Fetch user data from backend using the email
       

        if (email) {
            fetchUserData();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            console.log(formData);
            const response = await fetch('http://localhost:5000/api/user/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Profile updated successfully!');
                fetchUserData();
                setLoading(false);
                // You can add logic here to show a success message or redirect the user
            } else {
                console.error('Failed to update profile:', response.statusText);
                // You can add logic here to show an error message
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // You can add logic here to show an error message
        }
    };
    const fileInputRef = useRef(null);

    const handleImageclick = () => {
        fileInputRef.current.click(); // Trigger click event on file input
    };

    return (
        <>
            <Navigation />
            {loading && (
          <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-75 flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500">
              <Lottie animationData={loadinganimation} />
            </div>
          </div>
        )}

{successModalVisible && (
             <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-75 flex justify-center items-center">
             <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-2xl font-semibold mb-4">Success!</h2>
                 <p className="text-gray-800">Post successfully created.</p>
                 <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none" onClick={handleModalClose}>Close</button>
             </div>
         </div>
        )}
            <div className="flex justify-center mt-20 px-8">
           
                <form className="max-w-2xl" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap border shadow rounded-lg p-3 dark:bg-gray-600">
                        <h2 className="text-xl text-gray-600 dark:text-gray-300 pb-2">Account settings:</h2>

                        {/* Circular Image Section */}
                        <div className="flex justify-center items-center relative">
                            <img
                                src={AdminInfo.filename || dummy} // Default image path
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                            />
                            <div
                                className="absolute bottom-0 right-0 bg-white rounded-full flex items-center justify-center cursor-pointer"
                                onClick={handleImageclick}
                            >
                                <FiEdit className="text-gray-600 dark:text-gray-300" /> {/* Edit icon */}
                            </div>
                            <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpdate} // Call handleImageChange when file selected
                />
                        </div>

                        <div className="flex flex-col gap-2 w-full border-gray-400">
                            {/* Pre-fill Input Fields */}
                            <div>
                                <label className="text-gray-600 dark:text-gray-400">User name</label>
                                <input
                                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                                    type="text"
                                    name="username"
                                    defaultValue={formData.username || ''} // Pre-fill with AdminInfo data
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 dark:text-gray-400">Email</label>
                                <input
                                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                                    type="text"
                                    name="email"
                                    defaultValue={formData.email || ''} // Pre-fill with AdminInfo data
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 dark:text-gray-400">address</label>
                                <textarea
                                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                                    name="address"
                                    defaultValue={formData.address || ''} // Pre-fill with AdminInfo data
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div>
                                <label className="text-gray-600 dark:text-gray-400">phonenumber</label>
                                <textarea
                                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                                    name="phonenumber"
                                    defaultValue={formData.phonenumber || ''} // Pre-fill with AdminInfo data
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div>
                                <label className="text-gray-600 dark:text-gray-400">password</label>
                                <textarea
                                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                                    type="password"
                                    name="password"
                                    defaultValue={formData.password || ''} // Pre-fill with AdminInfo data
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
                                    type="submit">Save changes</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Editprofile;
