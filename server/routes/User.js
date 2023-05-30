import express from 'express'
import { update, deleteUser, getUser, subscribe, unsubscribe, like, dislike } from "../controllers/User.js"
import {verifyToken} from '../verifyToken.js'

const router= express.Router();

router.delete('/:id',verifyToken,deleteUser)
router.put('/:id',verifyToken,update)
router.get('/find/:id',getUser)
router.put('/sub/:id',verifyToken,subscribe)
router.put('/unsub/:id',verifyToken,unsubscribe)
router.put('/like/:id',verifyToken,like)
router.put('/dislike/:id',verifyToken,dislike)


export default router;