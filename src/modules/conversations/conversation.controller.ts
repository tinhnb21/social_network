import { NextFunction, Request, Response } from "express";
import ConversationsService from "./conversations.service";
import SendMessageDto from "./dtos/send_message.dto";

export default class ConversationsController {
    private conversationsService = new ConversationsService();

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: SendMessageDto = req.body;
            const result = await this.conversationsService.sendMessage(req.user.id, model);
            res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    }

    public getMyConversation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.conversationsService.getMyConversation(req.user.id);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
}