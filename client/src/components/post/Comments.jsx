import React, { useState,useEffect } from 'react'
import AddChildComment from './AddChildComment';

function Comments({postId}) {
    console.log(postId);
    
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                }),
            });
            if (response.ok) {
                const commentsData = await response.json();
                setComments(commentsData);
               
            } else {
                console.error('Failed to fetch comments:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

   
     



    return (
        <>
        {comments.map((comment) => (
            <div key={comment._id} className="py-2 px-4">
                {/* COMMENT */}
                <div className="flex space-x-2">
                    <img src="./images/profile_photo_cat.jpg" alt="Profile picture" className="w-9 h-9 rounded-full" />
                    <div>
                        <div className="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
                            <span className="font-semibold block">{comment.userId}</span>
                            <span>{comment.text}</span> {/* Assuming the text field exists */}
                        </div>
                        <div className="p-2 text-xs text-gray-500 dark:text-dark-txt">
                            <span className="font-semibold cursor-pointer">Like</span>
                            <span className="mx-1">.</span>
                            <span className="font-semibold cursor-pointer" >Reply</span>
                            <span className="mx-1">.</span>
                            6h
                        </div>
                        {/* CHILD COMMENT */}
                        {/* <div className="flex space-x-2">
                            <img src="./images/profile_photo_cat.jpg" alt="Profile picture" className="w-9 h-9 rounded-full" />
                            <div>
                                <div className="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
                                    <span className="font-semibold block">Can Canbolat</span>
                                    <span>first child comment</span>
                                </div>
                                <div className="p-2 text-xs text-gray-500 dark:text-dark-txt">
                                    <span className="font-semibold cursor-pointer">Like</span>
                                    <span className="mr-2">.</span>
                                    <span className="font-semibold cursor-pointer" onClick={show}>Reply</span>
                                    <span className="mx-1">.</span>
                                    5h
                                </div>
                            </div>
                        </div> */}
                        {/* END CHILD COMMENT */}

                        {/* ADD CHILD COMMENT */}
                        {/* <div className={isCommentDisplay}>
                            <AddChildComment />
                        </div> */}
                        {/* END ADD CHILD COMMENT */}
                    </div>
                </div>
                {/* END COMMENT */}
            </div>
        ))}
    </>
    )
}

export default Comments