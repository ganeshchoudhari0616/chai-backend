import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

// upload ch use kas karaych 

const router = Router()
// kutli function excute honya agodar middleware cha use kartat kutl dusri functionality cha use karycha asel tr
// je method excute hot ahe tyagodar just use karycha  
// middleware ase inject karycha ast
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )


export default router