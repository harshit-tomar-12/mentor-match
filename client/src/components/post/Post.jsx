import React ,{useState,useEffect } from 'react'
import AddComment from './AddComment'
import Comments from './Comments'

function Post({admin}) {

    const userID=localStorage.getItem('id');
    const [posts, setPosts] = useState([]);
  
    const [showComments, setShowComments] = useState(false);
    const [showAddComment, setShowAddComment] = useState(false);
   

    useEffect(() => {
        fetchPosts();
    }, [userID]); 

    const fetchPosts = async () => {
        let requestBody = {}; // Initialize request body

        if (!admin) { // If not admin, include userID in the request
            requestBody = {
                userID: localStorage.getItem('id')
            };
        }
        try {
            const response = await fetch('http://localhost:5000/api/user/posts/view', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestBody }), // Ensure email is sent as an object
        });
            if (response.ok) {
                const postData = await response.json();
               
               
                setPosts(postData);
               
            } else {
                console.error('Failed to fetch posts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
        setShowAddComment(!showAddComment); // Toggle showAddComment state
    };
    const handleCommentAdded = () => {
        // Comment added successfully, hide AddComment component
        setShowAddComment(false);
    };
    const handleAfterComment=()=>{
        setShowAddComment(false);
    }
    return (
        <>
        {posts.map((post) => (
            <div key={post._id} className="shadow bg-white mt-4 rounded-lg h-max">
                {/* POST AUTHOR */}
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex space-x-2 items-center">
                        <div className="relative">
                            <img src={post.filename} alt="Profile picture" className="w-10 h-10 rounded-full" />
                            <span className="bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2"></span>
                        </div>
                        <div>
                            <div className="font-semibold">
                                {post.email}
                            </div>
                            <span className="text-sm text-gray-500">10h</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 grid place-items-center text-xl text-gray-500 hover:bg-gray-200 rounded-full cursor-pointer">
                        <i className='bx bx-dots-horizontal-rounded'></i>
                    </div>
                </div>
                {/* END POST AUTHOR */}
    
                {/* POST CONTENT */}
                <div className="text-justify px-4 py-2">
                    <p>
                        {post.content}
                    </p>
                </div>
                <div className="flex justify-center">
                    {post.images.map((image) => (
                        <img key={image._id} src={image.url} alt="Post Image" className="w-full max-h-96 object-cover" />
                    ))}
                </div>
                {/* END POST CONTENT */}
                {/* POST EVENTS */}
                <div className="px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-row-reverse items-center">
                            <span className="ml-2 text-gray-500">
                                55
                            </span>
                        </div>
                        <div className="text-gray-500">
                            <span onClick="" style={{ cursor: 'pointer' }}>{post.comments.length} comments</span>
                        </div>
                    </div>
                </div>
                {/* END POST EVENTS */}
    
                {/* POST ACTION */}
                <div className="py-2 px-4">
                    <div className="border border-gray-200 border-l-0 border-r-0 py-1">
                        <div className="flex space-x-2">
                            <div className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 text-xl py-2 rounded-lg cursor-pointer text-gray-500">
                                <i className='bx bx-like'></i>
                                <span className="text-sm font-semibold">Like</span>
    
                            </div>
                            <div className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 text-xl py-2 rounded-lg cursor-pointer text-gray-500" onClick={handleCommentClick}>
                                <i className='bx bx-comment'></i>
                                <span className="text-sm font-semibold">Comment</span>
                            </div>
    
                        </div>
                    </div>
                </div>
                {/* END POST ACTION */}
                {showComments && (
                        <Comments postId={post._id} />
                    )}
                    {showAddComment && (
                        <AddComment postId={post._id} onCommentAdded={handleAfterComment} />
                    )}
            </div>
        ))}
    </>
        );
   
}

export default Post