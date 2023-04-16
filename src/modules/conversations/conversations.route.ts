import { Route } from "@core/interfaces";
import { Router } from "express";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import ConverstionsController from "./conversation.controller";
import SendMessageDto from "./dtos/send_message.dto";

class ConversationsRoute implements Route {
    public path = "/api/v1/conversations";
    public router = Router();

    public conversationsController = new ConverstionsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(SendMessageDto, true),
            this.conversationsController.sendMessage
        );
    }
}

export default ConversationsRoute;
