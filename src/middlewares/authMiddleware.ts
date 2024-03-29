import { NextFunction, Response } from 'express';
import { AuthRequest } from '../interfaces/request';
import passport from '../config/passportConfig';
import { User } from '@prisma/client';

export function isAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  passport.authenticate("local", (err: Error, user: User, info: any) => { 
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.currentUser = user;
    return next();
  })(req, res, next);
}
