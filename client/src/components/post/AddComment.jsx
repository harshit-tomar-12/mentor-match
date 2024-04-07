import React, { useState } from "react";

function AddComment({ postId, onCommentAdded }) {
    const [content, setContent] = useState("");
    const userId=localStorage.getItem('id');
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/user/post/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    content,
                }),
            });
            

            if (response.ok) {
                // Comment added successfully, you can perform any additional actions here
                console.log('Comment added successfully!');
                onCommentAdded();
                // Clear the input field
                setContent("");
            } else {
                console.error('Failed to add comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    return (
        <div className="py-2 px-4">
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-2">
                    <img src="./images/profile_photo_cat.jpg" alt="Profile picture" className="w-9 h-9 rounded-full" />
                    <div className="flex-1 flex bg-gray-100 dark:bg-dark-third rounded-full items-center justify-between px-3">
                        <input 
                            type="text" 
                            placeholder="Write a comment..." 
                            className="outline-none bg-transparent flex-1" 
                            name="content"
                            value={content}
                            onChange={handleContentChange}
                        />
                        <div className="flex space-x-0 items-center justify-center">
                            <button type="submit" className="w-7 h-7 grid place-items-center rounded-full hover:bg-gray-200 cursor-pointer text-gray-500 dark:text-dark-txt dark:hover:bg-dark-second text-xl"><i className='bx bx-send'></i></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddComment;
