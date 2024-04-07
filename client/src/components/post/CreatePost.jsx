import React,{useState} from 'react'
import { FaFeeling, FaImage, FaVideo ,FaTimes} from 'react-icons/fa';
import loadinganimation from '../../asstes/loading.json';
import Lottie from 'lottie-react';

function CreatePost() {
    const [postContent, setPostContent] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [selectedImageFiles, setSelectedImageFiles] = useState('');
    const [selectedVideoFiles, setSelectedVideoFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const id = localStorage.getItem('id');
   
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    
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
      setLoading(true);
      try {
        const postData =   {
          userId: id,
          content: textareaValue,
         
          images: selectedImageFiles,
        
        };
  
        console.log(postData);
  
        const response = await fetch('http://localhost:5000/api/user/post/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
  
        if (response.ok) {
          console.log('Post created successfully!');
          
          setLoading(false);
          setSuccessModalVisible(true);
       
        } else {
          console.error('Failed to create post:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handlePostContentChange = (event) => {
      setPostContent(event.target.value);
    };
  
    const handlePhotoUpload = async (event) => {
      const file = event.target.files[0];
      const base64Files = await convertBase64(file)
      setSelectedImage(file);
      console.log(selectedImage);
    
     
    
      setSelectedImageFiles(base64Files);
    };
  
   
    const handleImageRemove = () => {
        setTimeout(() => {
            setSelectedImage(null);
          }, 1000);
      };
      const handleModalClose = () => {
        setSuccessModalVisible(false);
        setSelectedImage(null);
      
        setTextareaValue('');
    };
  
  
  
    const [textareaValue, setTextareaValue] = useState('');
  
    const handleTextAreaChange = (event) => {
      setTextareaValue(event.target.value);
    };
  
    const calculateHeight = (element) => {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const lines = Math.ceil(element.scrollHeight / lineHeight);
      const minHeight = lineHeight * 2; // Set a minimum height
      const height = Math.max(minHeight, lines * lineHeight);
      element.style.height = `${height}px`; // Set the calculated height to the textarea
    };
  
    
    return (
        <React.Fragment>
        {/* Loading Animation */}
        {loading && (
          <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-75 flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500">
              <Lottie animationData={loadinganimation} />
            </div>
          </div>
        )}
  
        {/* Success Modal */}
        {successModalVisible && (
             <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-75 flex justify-center items-center">
             <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-2xl font-semibold mb-4">Success!</h2>
                 <p className="text-gray-800">Post successfully created.</p>
                 <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none" onClick={handleModalClose}>Close</button>
             </div>
         </div>
        )}
  
        {/* ADD POST */}
        <div className="px-4 mt-4 shadow rounded-lg bg-white dark:bg-dark-second">
          <div className="p-2 border-b border-gray-300 dark:border-dark-third flex space-x-4">
            <img src="./images/profile_photo_cat.jpg" alt="Profile picture" className="w-10 h-10 rounded-full" />
            <div className="flex-1 bg-gray-100 rounded-full flex items-center justify-start pl-4 cursor-pointer dark:bg-dark-third text-gray-500 text-lg dark:text-dark-txt">
              <textarea
                className="w-full border border-gray-300 rounded-full p-4 mb-6 focus:outline-none focus:border-blue-500"
                onChange={handleTextAreaChange}
                placeholder="Write what's in your mind for your students"
                rows="6"
                style={{ height: '50px' }}
              />
            </div>
          </div>
          <div className="p-2 flex">
            {selectedImage ? (
              <>
                <label
                  htmlFor="imageUpload"
                  className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-green-500"
                >
                  <FaImage />
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-dark-txt">{selectedImage.name}</span>
                  {selectedImage && <FaTimes className="ml-2 cursor-pointer" onClick={handleImageRemove} />}
                </label>
              </>
            ) : (
              <>
                <label
                  htmlFor="imageUpload"
                  className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-green-500"
                >
                  <FaImage />
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-dark-txt">Upload Image</span>
                </label>
                <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </>
            )}
            <button className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none" onClick={handleSubmit}>
              Post
            </button>
          </div>
        </div>
        {/* END ADD POST */}
      </React.Fragment>
    )
}

export default CreatePost