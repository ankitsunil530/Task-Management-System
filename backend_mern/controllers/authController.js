import  User  from '../models/userModel.js';
import bcryptjs from 'bcrypt';
import generatedAccessToken from '../utils/generateToken.js';

export async function loginUser(request,response){
    try {
        const { user_id , password } = request.body


        if(!user_id || !password){
            return response.status(400).json({
                message : "provide userid, password",
                error : true,
                success : false
            })
        }

        const user = await User.findOne({user_id })

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        

        const updateUser = await User.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
       

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                user : {
                    name : user.name,
                    user_id : user.user_id,
                    email : user.email,
                    role : user.role,
                    status : user.status
                    
                },
                accesstoken
                
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const registerUser=async (req, res) => {
    const { name,user_id,email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists'

         });
      }
  
      const hashedPassword = await bcryptjs.hash(password, 10);
  
      const newUser = new User({
        name,
        user_id,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully',
       data : {
        name : newUser.name,
        user_id : newUser.user_id,
        email : newUser.email,
        role : newUser.role,
        status : newUser.status
       }
       });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
}
export async function logoutUser(request, response) {
    try {
      response.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
      });
  
      return response.status(200).json({
        message: "Logout successful",
        success: true,
        error: false
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Logout failed",
        success: false,
        error: true
      });
    }
  }
export const updateUser=async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcryptjs.hash(password, 10);
  
      await user.save();
  
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
}  
export const getUser=async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { password, ...userWithoutPassword } = user._doc;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
}
export const getAllUsers=async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
}   


export async function deleteUser(request, response) {
  try {
    const { user_id } = request.params;

    if (!user_id) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false
      });
    }

    const user = await User.findOne({ user_id });

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    await User.deleteOne({ user_id });

    return response.status(200).json({
      message: "User deleted successfully",
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false
    });
  }
}
export const userProfile=async(req,res)=>{
     const user=req.user.id;

    try {
        const userProfile=await User.findById(user).select("-password")
        if(!userProfile){
            return res.status(404).json({
                message : "User not found",
                error : true,
                success : false
            })
        }
        return res.json({
            message : "User profile",
            error : false,
            success : true,
            data : userProfile
        })
    }
    catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

}