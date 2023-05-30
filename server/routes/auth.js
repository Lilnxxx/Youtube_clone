import express from 'express'

import {signup,signin, signout} from "../controllers/auth.js"
const router= express.Router();

router.post("/signup",signup)

router.post("/signin",signin)
router.get('/signout',signout)
router.post("/google")
export default router