import { useState } from 'react';
import Navigation from './Navigation';
import loadinganimation from '../asstes/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [postContent, setPostContent] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [selectedImageFiles, setSelectedImageFiles] = useState('');
  const [selectedVideoFiles, setSelectedVideoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = localStorage.getItem('id');
  let navigate = useNavigate();
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
        content: postContent,
        pollOptions: pollOptions,
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
        navigate('/profile');
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
  
   
  
    setSelectedImageFiles(base64Files);
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedVideoFiles(files);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...pollOptions];
    updatedOptions.splice(index, 1);
    setPollOptions(updatedOptions);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <Navigation />
      {loading && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-75 flex justify-center items-center">
          <div className="relative flex justify-center items-center">
            
           
          
          </div>
        </div>
      )}
      <div className={`min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8 ${loading ? 'blur' : ''}`}>
        <h2 className="text-3xl font-bold mb-8 text-center">Create Post</h2>
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 rounded-md p-4 mb-6 focus:outline-none focus:border-blue-500"
            value={postContent}
            onChange={handlePostContentChange}
            placeholder="Write your post here"
            rows="6"
          />

          {/* Instructions */}
          <div className="text-gray-600 mb-6">
            <p className="mb-2">Instructions:</p>
            <ul>
              <li>Include relevant information such as event details, announcements, or discussions.</li>
              <li>Ensure the photos are relevant and add value to your content.</li>
              <li>Keep the videos short and focused to maintain viewer interest.</li>
              <li>Use polls to engage with your audience and encourage participation.</li>
              <li>Review your post content and ensure it aligns with the provided instructions.</li>
            </ul>
          </div>

          {/* Photo Upload Section */}
          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Upload Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} multiple />
          </div>

          {/* Video Upload Section */}
          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Upload Video</label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} multiple />
          </div>

          {/* Poll Section */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">Create Poll</h3>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 mr-2 focus:outline-none focus:border-blue-500"
                  value={option}
                  onChange={(event) => handlePollOptionChange(index, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    className="text-red-500 font-semibold focus:outline-none"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md focus:outline-none"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
