import { Route } from "@core/interfaces";
import { Router } from "express";
import UsersController from "./users.controller";
import { validationMiddleware } from "@core/middleware";
import RegisterDto from "./dtos/register.dto";

export default class UserRoute implements Route {
  public path = "/api/users";
  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(RegisterDto, true),
      this.usersController.register
    );

    this.router.put(
      this.path + "/:id",
      validationMiddleware(RegisterDto, true),
      this.usersController.updateUser
    );

    this.router.get(this.path + "/:id", this.usersController.getUserById);
  }
}
