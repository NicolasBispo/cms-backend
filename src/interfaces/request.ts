import { Post, User } from "@prisma/client";
import { Request } from "express";

export interface AuthRequest extends Request {
  currentUser: User
}

export interface PostRequest extends AuthRequest{
  post: Post
}

export interface UserRequest extends Request{
  user: User,
  body: {
    name: string,
    password: string,
    email:string
  }
}