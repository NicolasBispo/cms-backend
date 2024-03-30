import { Category, Post, User, Comment, Reply } from "@prisma/client";
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
  commentId: number
}

export interface ReplyRequest extends CommentRequest{
  reply: Reply
}

export interface UserRequest extends AuthRequest{
  user: User,
  body: {
    name: string,
    password: string,
    email:string
  }
}