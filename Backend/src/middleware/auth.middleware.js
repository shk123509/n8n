import { Apierror } from "../utils/Apierror.js";
import { asyncHandler1 } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"


export const verifyJWT = asyncHandler1(async (req, _, next) => {
  try {
    // Check cookies or Authorization header (handles both Bearer and Berer)
    const token = req.cookies?.accesstoken || 
                  req.header("Authorization")?.replace("Bearer ", "") ||
                  req.header("Authorization")?.replace("Berer ", "");

    if (!token) {
      return next(new Apierror(401, "Unauthorized User - No Token Found"));
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

    if (!user) {
      return next(new Apierror(401, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new Apierror(401, error.message || "Access token is invalid"));
  }
});