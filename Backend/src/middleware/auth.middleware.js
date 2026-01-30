import { Apierror } from "../utils/Apierror.js";
import { asyncHandler1 } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"


export const verifyJWT = asyncHandler1(async (req, _, next) => {
  try {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Berer ", "")

    if (!token) {
      throw new Apierror(401, "Unauthorization User")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select("-password -refreshToken")

    if (!user) {
      throw new Apierror(401, "Invilid access token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new Apierror(401, error.message || "Access token is invilid")
  }
})