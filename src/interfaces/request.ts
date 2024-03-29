import { Category, Post, User, Comment } from "@prisma/client";
import { Request } from "express";

export interface AuthRequest extends Request {
  currentUser: User
}

export interface PostRequest extends AuthRequest{
  post: Post
}

export interface CategoryRequest extends AuthRequest{
  category: Category
}

export interface CommentRequest extends AuthRequest{
  comment: Comment
}

export interface UserRequest extends AuthRequest{
  user: User,
  body: {
    name: string,
    password: string,
    email:string
  }
}