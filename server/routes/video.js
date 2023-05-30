import express from 'express'
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from "../controllers/video.js"
import { verifyToken } from '../verifyToken.js';

const router= express.Router();

router.post("/",verifyToken,addVideo)
router.delete("/:id",verifyToken,deleteVideo)
router.get("/trend",trend)
router.get("/random",random)
router.get("/sub",verifyToken,sub)
router.get('/tags',getByTag)
router.get('/search',search)
router.get("/:id",getVideo)
router.put("/find/:id",verifyToken,updateVideo)
router.put("/view/:id",addView)



export default router;