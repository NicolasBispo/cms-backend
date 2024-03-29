import express from 'express'
import passport from 'passport';
const router = express.Router();


router.post("/login", passport.authenticate("jwt", { session: false }));

router.post("/register")

export const defaultRoutes = router