const User = require('../modals/userModel');
const Post = require('../modals/postModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('../utils/cloudnary')


module.exports.register = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;


    if (!username || !email || !password || !age) {
      return res.status(400).json({
        message: 'All Fields required',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: 'User Already Exists',
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      age,
    });

    await user.save();

    return res.status(201).json({
      message: 'User Registered Successfully',
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'User Not Registered Successfully',
      success: false,
    });
  }
};


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password both required",
        success: false,
      });
    }

    
    const user = await User.findOne({ email }).populate('posts'); 

    if (!user) {
      return res.status(401).json({
        message: "User does not exist, please register first",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password is incorrect",
        success: false,
      });
    }

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

   
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'User not logged in successfully',
      success: false,
    });
  }
};

module.exports.logout = async (_, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
     
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong while logging out",
      success: false
    });
  }
};


module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // if(!userId){
    //     return res.status(401).json({
    //     message: 'UserId doesnot exist',
    //     success: false,
    //     });
    // }
    const user = await User.findById(userId)
      .select('-password')
      .populate('posts')
      .populate('bookmarks');

    if (!user) {
      return res.status(400).json({
        message: 'User doesnot exist',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'profile fecthed successfully',
      success: true,
      user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'profile not fetched',
      success: false
    })
  }

}

module.exports.editProfile = async (req, res) => {
  try {
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Profile picture update (if provided)
    if (profilePicture) {
      const image = getDataUri(profilePicture);
      const cloudImageResponse = await cloudinary.uploader.upload(image);
      user.profilePicture = cloudImageResponse.secure_url;
    }

    // Bio update (if provided)
    if (bio !== undefined) {
      user.bio = bio;
    }

    // Gender update (if provided)
    if (gender !== undefined) {
      user.gender = gender;
    }

    // Save only if something was updated
    await user.save();

    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({
      message: "Profile not updated successfully",
      success: false,
      error: error.message,
    });
  }
};


module.exports.suggesteduser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.id } }).select('-password');
    if (!users) {
      res.status(401).json({
        message: "user not found"
      })
    }

    res.status(200).json({
      users,
      message: "fetched ALL User",
      success: true
    })

  } catch (error) {
    console.log(error);
    res.status(200).json({
      users:[],
      message: "Not Fetched ALL User",
      success: false
    })
  }
}

module.exports.followUnfollow = async (req,res)=>{
  try {
    const followKrneWala = req.id;
    const jiskoFollowKrnaHai = req.params.id;

    const followKrneWalaUser = await User.findById(followKrneWala);
    const jiskoFollowKrnaHaiUser = await User.findById(jiskoFollowKrnaHai);

    if(jiskoFollowKrnaHaiUser.followers.includes(followKrneWala)){
      await User.updateOne({_id:jiskoFollowKrnaHai},{$pull:{followers:followKrneWala}});
      await User.updateOne({_id:followKrneWala},{$pull:{followings:jiskoFollowKrnaHai}});
      
        return res.status(201).json({
                message: "Unfollow Successfully",
                success: true
        })
    }
    else{
        await User.updateOne({_id:jiskoFollowKrnaHai},{$push:{followers:followKrneWala}});
        await User.updateOne({_id:followKrneWala},{$push:{followings:jiskoFollowKrnaHai}});
        return res.status(201).json({
                message: "follow Successfully",
                success: true
        })
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"There is some problem while folowing and unfollowing"
    })
  }
}

