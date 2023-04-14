import { Route } from "@core/interfaces";
import { Router } from "express";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import PostsController from "./posts.controller";
import CreatePostDto from "./dtos/create_post.dto";
import CreateCommentDto from "./dtos/create_comment_dto.dto";

class PostRoute implements Route {
  public path = "/api/v1/posts";
  public router = Router();

  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.createPost
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.updatePost
    );

    this.router.get(`${this.path}`, this.postsController.getAllPosts);
    this.router.get(`${this.path}/:id`, this.postsController.getPostById);
    this.router.get(
      `${this.path}/paging/:page`,
      this.postsController.getAllPaging
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      this.postsController.deletePost
    );

    this.router.put(
      `${this.path}/like/:id`,
      authMiddleware,
      this.postsController.likePost
    );
    this.router.put(
      `${this.path}/unlike/:id`,
      authMiddleware,
      this.postsController.unlikePost
    );

    this.router.put(
      `${this.path}/comments/:id`,
      authMiddleware,
      validationMiddleware(CreateCommentDto, true),
      this.postsController.addComment
    );

    this.router.put(
      `${this.path}/comments/:postId/:commentId`,
      authMiddleware,
      this.postsController.removeComment
    );
  }
}

export default PostRoute;
