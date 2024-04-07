const mongoose = require('mongoose');
const User = require('./user');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assuming you have a User model
        required: true
    },
    title: {
        type: String,
        
    },
    content: {
        type: String,
       
    },
    postName: {
        type: String,
     
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: [
        {
            url: {
                type: String, // Store image URLs
                
            }
        }
    ],
    videos: [
        {
            url: String, // Store video URLs
        }
    ],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like' // Assuming you have a Like model
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' // Assuming you have a Comment model
    }]
});

module.exports = mongoose.model('Post', postSchema);
