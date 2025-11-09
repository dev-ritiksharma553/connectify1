const User = require('../modals/userModel');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('../utils/cloudnary');
const Post = require('../modals/postModel');
const Comment = require('../modals/comment')
const sharp = require('sharp');
const { options } = require('../routes/postRoutes');
const { populate } = require('dotenv');
const path = require('path');
const { getReceiverSocketId } = require('../socket/socket');
const { io } = require('../socket/socket')
module.exports.addPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;

        const user = await User.findById(req.id);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        if (!image) {
            return res.status(400).json({
                message: "Image not found",
                success: false
            });
        }
        const imageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'cover' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        const cloudUploadedImage = await cloudinary.uploader.upload(fileUri);

        const post = new Post({
            caption,
            image: cloudUploadedImage.secure_url,
            author: user._id,
        });

        await post.populate([
            { path: 'author', select: '-password' },
            { path: 'comments', populate: { path: 'author', select: '-password' } }
        ]);

        await post.save();

        user.posts.push(post._id);
        await user.save();

        return res.status(200).json({
            message: "Posted successfully",
            success: true,
            post
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Not posted successfully",
            success: false
        });
    }
};
module.exports.allPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' })
            .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });
        if (!posts) {
            return res.status(401).json({
                message: "posts not found",
                success: false
            })
        }
        return res.status(200).json({
            posts: posts,
            message: "All Post fatched",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            posts: [],
            message: "Not fatched post",
            success: false
        })
    }
}
module.exports.allUserPost = async (req, res) => {
    try {
        const user = await User.findById(req.id)
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'author',
                        select: 'username profilePicture'
                    },
                    {
                        path: 'comments',
                        options: { sort: { createdAt: -1 } },
                        populate: {
                            path: 'author',
                            select: 'username profilePicture'
                        }
                    }
                ]
            });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User posts fetched",
            posts: user.posts,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: [],
            success: false
        });
    }
};
module.exports.likePost = async (req, res) => {
    try {
        const likedBy = req.id;
        const postId = req.params.id; 

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false
            });
        }

        if (post.likes.includes(likedBy)) {
            // dislike
            post.likes.pull(likedBy);
            await post.save();


            const user = await User.findById(likedBy).select('username profilePicture');
            const postOwnerId = post.author.toString();
            if (postOwnerId !== likedBy) {
                const notification = {
                    type: 'dislike',
                    userId: likedBy,
                    userDetail: user,
                    postId,
                    message: 'Your Post is disLiked'
                }
                const postOwnerSocketId = getReceiverSocketId(postOwnerId);

                io.to(postOwnerSocketId).emit('notification', notification);

            }

            return res.status(200).json({
                message: "disliked",
                success: true,
                updatedLikes: post.likes
            });
        } else {
            // like
            post.likes.push(likedBy);
            await post.save();
            const user = await User.findById(likedBy).select('username profilePicture');
            const postOwnerId = post.author.toString();
            if (postOwnerId !== likedBy) {
                const notification = {
                    type: 'like',
                    userId: likedBy,
                    userDetail: user,
                    postId,
                    message: 'Your Post is Liked'
                }
                const postOwnerSocketId = getReceiverSocketId(postOwnerId);

                io.to(postOwnerSocketId).emit('notification', notification);

            }
            return res.status(200).json({
                message: "liked",
                success: true,
                updatedLikes: post.likes
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Not able to like or dislike",
            success: false
        });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const { text } = req.body;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is invalid",
                success: false
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });

        post.comments.push(comment._id);
        await post.save();

        // Optional: populate author so frontend can display username/profilePicture
        await comment.populate({ path: "author", select: "username profilePicture" });

        return res.status(200).json({
            message: "Comment Added",
            comment,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.getCommentsofPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            })

        if (!comments) {
            return res.status(404).json({
                message: 'No comments found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Comments found',
            success: true,
            comments: comments
        })

    } catch (err) {
        console.log(err);
    }
}
module.exports.deletePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        if (!post) {
            return res.status(400).json({
                message: "post not found",
                success: false
            })
        }
        const isValid = user.posts.includes(postId);
        if (!isValid) {
            return res.status(400).json({
                message: "You have no access to delete this post",
                success: false
            })
        }
        user.posts.pull(postId);
        await user.save();
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId })
        return res.status(200).json({
            message: "post deleted successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "post not deleted successfully",
            success: false
        })
    }

}
module.exports.bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        if (!postId) {
            return res.status(500).json({
                message: "Post ID not provided",
                success: false
            });
        }

        const user = await User.findOne({ _id: userId });

        const isBookmarked = user.bookmarks.includes(postId);
        if (isBookmarked) {
            await user.bookmarks.pull(postId);
            await user.save();
            return res.status(200).json({
                message: "Unbookmarked",
                success: true
            });
        } else {
            await user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({
                message: "bookmarked",
                success: true
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};




