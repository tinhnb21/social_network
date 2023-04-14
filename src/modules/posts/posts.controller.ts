import { Request, Response, NextFunction } from "express";
import PostService from "./posts.service";
import CreatePostDto from "./dtos/create_post.dto";

export default class PostsController {
  private postService = new PostService();

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const userId = req.user.id;
      const result = await this.postService.createPost(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const postId = req.params.id;
      const result = await this.postService.updatePost(postId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.postService.getAllPosts();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const post = await this.postService.getPostById(postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public getAllPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Number(req.params.page);
      const keyword = req.query.keyword || "";
      const posts = await this.postService.getAllPaging(
        keyword.toString(),
        page
      );
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const post = await this.postService.deletePost(req.user.id, postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const likes = await this.postService.likePost(req.user.id, postId);
      res.status(200).json(likes);
    } catch (error) {
      next(error);
    }
  };

  public unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const likes = await this.postService.unlikePost(req.user.id, postId);
      res.status(200).json(likes);
    } catch (error) {
      next(error);
    }
  };
}
