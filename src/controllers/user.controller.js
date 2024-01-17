import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
//he user je ahe te direct database la connect ahe 
import { User } from "../models/user.model.js";

const registerUser = asyncHandler ( async (req,res) =>{
    // get user details from frontend
    // validation  - not empty
    // check if user already exists: username, email
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    //  remove passowrd and refresh token field from response
    // return res

    const {userName,fullName,email,password}= req.body;
    console.log("reqbody",req.body);
    // ith frontend kadun data yet ahe req.body madhe
    console.log("email:",email);
    console.log("password:",password);

    // validation  - not empty
    if(
        [fullName,email,userName,password].some((field) =>
        field?.trim() === "")
        //some ka ghetalo karan ki khup sare if condition hotet mnun ek ashi functinality use kelo ki jithe fakt ekch if cha use karta yeta
    )
    {
        throw new ApiError(400,"All fields are required")
    }

    // check if user already exists: username, email
    const existedUser = User.findOne({
        // operator cha use kar ith
      $or: [{userName}, {email}]
    })
    console.log("existedUser",existedUser);
    if(existedUser){
        throw new ApiError(409,"USer with email or username already exists")
    }

     // upload them to cloudinary, avatar

    //  req.body he express det tasch multer he req.files det
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImagePath[0]?.path;
    console.log("avatar",avatarLocalPath);
    console.log("avatar",coverImageLocalPath);
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(409,"USer with email or username already exists")
    }

    //  // create user object - create entry in db
    // data base madhe kas entry karycha ? eka prakare karta yet User cha use karun databse sobaat connect karta yet
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // return res
    return res.status(201).json(
        // apiresponse cha object karun hyachay dware data send karat ahe or ghet ahe
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
}) 

export {registerUser}