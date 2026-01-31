import { Apierror } from "../utils/Apierror.js";
import { asyncHandler1 } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"


export const verifyJWT = asyncHandler1(async (req, _, next) => {
  try {
    // ⬇️ FIXED: "Berer" ko "Bearer" kar diya (Spelling Fix)
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Apierror(401, "Unauthorized User");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new Apierror(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    // Apierror ko properly throw karein
    next(new Apierror(401, error.message || "Access token is invalid"));
  }
});