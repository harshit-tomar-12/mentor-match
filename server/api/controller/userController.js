const user = require('../model/user');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Post=require('../model/post')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const Comment =require('../model/comment');

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getOneProfiles = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  user
    .findOne({ email, password }, { _id: 1 }) // Only return the _id field
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Profile not found." });
      }console.log(data);
      return res.json(data);
    })
    .catch((err) => {
      return res.json({ Error: err });
    });
};


const newProfile = async(req, res) => {
  console.log("newuser")
  const { email, Username, password, Phonenumber, Address, isAdmin,selectedImageFiles } = req.body;
  const username=Username;
  const phonenumber=Phonenumber;
  const address=Address;
  const admin=isAdmin;
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };
  const result = await cloudinary.uploader.upload(selectedImageFiles, opts);
  const filename=result.secure_url;



  user
    .findOne({ username: username })
    .then((data) => {
      if (!data) {
        const newUser = new user({
          email: email || "", // Set email to provided value or empty string
          username: username || "", // Set username to provided value or empty string
          password: password || "", // Set password to provided value or empty string
          phonenumber: phonenumber || "", // Set phonenumber to provided value or empty string
          address: address || "", // Set address to provided value or empty string
          filename:filename || "", // Set filename if file was uploaded
          admin: admin || false // Set admin to provided value or false
        });

        console.log(newUser.filename);

        return newUser.save();
      } else {
        throw new Error("Details already exist");
      }
    })
    .then((data) => {
      
      res.json(data);
    })
    .catch((err) => {
      // Delete the uploaded image if something goes wrong
      if (req.file) {
        fs.unlinkSync(`uploads/${req.file.filename}`);
      }

      return res.json({ Error: err.message || "Something went wrong, please try again." });
    });
};


const updateUserPassword = (req, res) => {
  const { email, newPassword } = req.body;

  // Check if email and newPassword are provided
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and newPassword are required." });
  }

  // Find the user by email and update the password
  user.findOneAndUpdate(
    { email }, // Use only email field to find the user
    { password: newPassword }, // Update the password field
    { new: true }
  )
    .then((updatedData) => {
      if (!updatedData) {
        return res.status(404).json({ message: "User not found." });
      }
      console.log("Password updated successfully:", updatedData);
      return res.json({ message: "Password updated successfully." });
    })
    .catch((err) => {
      console.error("Error updating password:", err);
      return res.status(500).json({ message: "Failed to update password." });
    });
};

const updateUserProfile = (req, res) => {
  const { email, username, phonenumber, address } = req.body; // Remove password field

  user.findOneAndUpdate(
    { email }, // Use only email field to find the user
    { username, phonenumber, address }, // Update other fields except password
    { new: true }
  )
    .then((updatedData) => {
      if (!updatedData) {
        return res.status(404).json({ message: "Profile not found." });
      }
      console.log("Updated Data:", updatedData);
      return res.json(updatedData);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Failed to update profile." });
    });
};

const deleteUserProfile = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  user.deleteOne({ email })
    .then((data) => {
      if (data.deletedCount === 0) {
        return res.status(404).json({ message: "Profile not found." });
      } else {
        return res.json({ message: "Profile deleted." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Failed to delete profile." });
    });
};

const uploadProfileImage = async (req, res) => {
  const { email, images } = req.body;
  
  
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  try {
    // Decode base64 images and videos
    const result = await cloudinary.uploader.upload(images, opts);
    console.log(result.secure_url);

    const foundUser = await user.findOne({ email });
    console.log(foundUser);

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

   

    foundUser.filename = result.secure_url;
    await foundUser.save();

    res.status(200).send(result.secure_url);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


const getProfileImage = async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const photo = await user.findOne({ email });

    if (!photo || !photo.filename) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const imagePath = path.join(__dirname, '..', 'upload', photo.filename);
    res.sendFile(imagePath);
  } 
  
  catch (error) {
    console.error('Error fetching image by ID:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

const getGeneralData = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      // If email is not provided, fetch all user data
      const allUsers = await user.find();
      return res.json(allUsers);
    }

    const userData = await user.findOne({ email });
    if (!userData) {
      return res.status(404).json({ message: "Profile not found." });
    }

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const createPost = async (req, res) => {
  const { userId, content, pollOptions, images, videos } = req.body;
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };


  try {
    // Decode base64 images and videos
 
    const result = await cloudinary.uploader.upload(images, opts);
      

   

    // Create a new post object with the received data
    const newPost = new Post({
      userId,
      content,
      pollOptions,
      images: [{ url: result.secure_url }],
     
    });

    // Save the new post to the database
    await newPost.save();

    // Return the newly created post in the response
    res.status(201).json("success");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
};



const viewPosts = async (req, res) => {
  const { userID } = req.body.requestBody;
  console.log("userId", userID);
  try {
    let posts;
    if (!userID) {
      // If userID is blank or not provided, fetch all posts
      posts = await Post.find()
        .populate("images")
        .populate("userId")
        .select("-__v");
    } else {
      // If userID is provided, fetch posts for that user
      posts = await Post.find({ userId: userID })
        .populate("images")
        .populate("userId")
        .select("-__v");
    }

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};

const likePost = async (req, res) => {
  const { postId, userId } = req.body;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Add user ID to the likes array
    post.likes.push(userId);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post." });
  }
};

const commentOnPost = async (req, res) => {
  const { postId, userId, content } = req.body;
 
  const text=content;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Create a new comment
    const newComment = new Comment({
      postId,
      userId,
      text
    });
    await newComment.save();

    // Add comment ID to the post's comments array
    post.comments.push(newComment._id);
    await post.save();

    res.json(newComment);
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ error: "Failed to comment on post." });
  }
};
const getCommentsByPostId = async (req, res) => {
  const postId  = req.body.postId;
  console.log(req.body.postId);
  try {
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

const likeComment = async (req, res) => {
  const { commentId, userId } = req.body;
  
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Add user ID to the userComments array
    comment.userComments.push(userId);
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Failed to like comment." });
  }
};

const commentOnComment = async (req, res) => {
  const { commentId, userId, text } = req.body;
  
  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found." });
    }

    const newComment = new Comment({
      postId: parentComment.postId,
      userId,
      commentId, // ID of the parent comment
      text
    });

    await newComment.save();
    res.json(newComment);
  } catch (error) {
    console.error("Error commenting on comment:", error);
    res.status(500).json({ error: "Failed to comment on comment." });
  }
};

const followUser = async (req, res) => {
  const { followerId, followingId } = req.body;
  
  try {
    // Assuming you have a User model with followings and followers fields
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);
    
    if (!follower || !following) {
      return res.status(404).json({ error: "User not found." });
    }

    // Add followingId to follower's followings array
    follower.followings.push(followingId);
    await follower.save();

    // Add followerId to following's followers array
    following.followers.push(followerId);
    await following.save();

    res.json({ message: "User followed successfully." });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Failed to follow user." });
  }
};

const unfollowUser = async (req, res) => {
  const { followerId, followingId } = req.body;
  
  try {
    // Assuming you have a User model with followings and followers fields
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);
    
    if (!follower || !following) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove followingId from follower's followings array
    follower.followings = follower.followings.filter(id => id !== followingId);
    await follower.save();

    // Remove followerId from following's followers array
    following.followers = following.followers.filter(id => id !== followerId);
    await following.save();

    res.json({ message: "User unfollowed successfully." });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Failed to unfollow user." });
  }
};

module.exports = {
  newProfile,
  getOneProfiles,
  updateUserProfile,
  deleteUserProfile,
  updateUserPassword,
  uploadProfileImage,
  getProfileImage,
  getGeneralData,
  createPost,
  viewPosts,
  likePost,
  commentOnPost,
  likeComment,
  commentOnComment,
  followUser,
  unfollowUser,
  getCommentsByPostId
};
