import  {asyncHandler1}  from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../models/User.js";
// import { uplodecloudinaryFile } from "../utils/cloudniary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";



const generateAccessandRefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    user.refreshtoken = refreshtoken;
    await user.save({ validatedBeforeSave: false })
    return { accesstoken, refreshtoken }


  } catch (error) {

  }
}


const registerUser = asyncHandler1(async (req, res) => {
  const { fullName, username, password, email } = req.body;
  console.log(req.body);


  // ✅ Validate fields
  if (!fullName) throw new Apierror(400, "Full name is required");
  if (!email) throw new Apierror(400, "Email is required");
  if (!password) throw new Apierror(400, "Password is required");
  if (!username) throw new Apierror(400, "Username is required");

  // ✅ Check if user already exists
  const existUser = await User.findOne({
    $or: [{ email }, { username }]
  });
  console.log(existUser);


  if (existUser) {
    throw new Apierror(400, "User already exists!");
  }


  // ✅ Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });
  console.log(user);


  // ✅ Exclude sensitive info
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);


  if (!createdUser) {
    throw new Apierror(500, "Something went wrong while creating user");
  }

  // ✅ Send response
  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "User registered successfully!"));
});

const loginUser = asyncHandler1(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new Apierror(400, "Username and password give me otherwise not login")
  }
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new Apierror(400, "User is not exist please check")
  }

  const ispasswordValid = await user.isPasswordCorrect(password);

  if (!ispasswordValid) {
    throw new Apierror(400, "Password is not corrects ")
  }
  const { refreshtoken, accesstoken } = await generateAccessandRefreshtoken(user._id);

  const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("refreshtoken", refreshtoken, option).cookie("accesstoken", accesstoken, option).json(
    new Apiresponse(200,
      {
        user: loggedInuser,
        accesstoken,
        refreshtoken,


      },
      "User logged In Succesfullly"
    )
  )


})


const logutUser = asyncHandler1(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const option = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).clearCookie("refreshtoken", option)
    .clearCookie("accesstoken", option).json(new Apiresponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler1(async (req, res) => {
  const IncomingrefreshToken = req.cookie.refreshToken || req.body.refreshToken
  if (!IncomingrefreshToken) {
    throw new Apierror(401, "unauthroized request")
  }
  try {
    const decodedRefreshToken = jwt.verify(
      IncomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new Apierror(401, "Invilid refresh token !")
    }

    if (IncomingrefreshToken !== user?.refreshToken) {
      throw new Apierror(401, "Invilid refresh token ")
    }

    const { accesstoken, newRefreshtoken } = await generateAccessandRefreshtoken(user._id);
    return res.status(200)
      .cookie("accessToken", accesstoken, option)
      .cookie("refreshToken", newRefreshtoken, option)
      .json(
        200,
        {
          newRefreshtoken,
          accesstoken
        },
        "Successfully generate accessToken"

      )
  } catch (error) {
    throw new Apierror(401, error?.message || "Invilid refresh token"
    )
  }


})


const getcurrentUser = asyncHandler1(async (req, res) => {
  return res.status(200).json(200, req.user, "Current user Fetch successfully ")
})


export {
    registerUser,
    loginUser,
    logutUser,
    refreshAccessToken,
    getcurrentUser
}