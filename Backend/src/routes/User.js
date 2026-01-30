import { Router } from "express";
import { registerUser, loginUser, logutUser,getcurrentUser } from "../controllers/User.js";
// import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();


router.route("/register").post(
    registerUser
)

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logutUser)

router.route("/get-user").get(verifyJWT, getcurrentUser)


export default router