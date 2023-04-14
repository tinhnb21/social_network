import { Route } from "@core/interfaces";
import { Router } from "express";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import GroupsController from "./groups.controller";
import CreateGroupDto from "./dtos/create_group.dto";

class PostRoute implements Route {
    public path = "/api/v1/groups";
    public router = Router();

    public groupsController = new GroupsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(CreateGroupDto, true),
            this.groupsController.createGroup
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            validationMiddleware(CreateGroupDto, true),
            this.groupsController.updateGroup
        );

        this.router.delete(
            `${this.path}/:id`,
            this.groupsController.deleteGroup
        );

        this.router.get(
            `${this.path}`,
            this.groupsController.getAll
        );
    }
}

export default PostRoute;
