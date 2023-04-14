import { NextFunction, Request, Response, request } from "express";
import ProfileService from "./profile.service";
import { IUser } from "@modules/auth";
import CreateProfileDto from "./dtos/create_profile.dto";
import { IProfile } from "./profile.interface";
import AddExperienceDto from "./dtos/add_experience.dto";
import AddEducationDto from "./dtos/add_education.dto";

class ProfileController {
  private profileService = new ProfileService();

  public getCurrentProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const resultObj: Partial<IUser> =
        await this.profileService.getCurrentProfile(userId);
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };

  public getByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.id;

    try {
      const userData: Partial<IUser> =
        await this.profileService.getCurrentProfile(userId);
      res.status(200).json({ data: userData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public getAllProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resultObj: Partial<IUser>[] =
        await this.profileService.getAllProfiles();
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };

  public createProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: CreateProfileDto = req.body;
    const userId = req.user.id;
    try {
      const createUserData: IProfile = await this.profileService.createProfile(
        userId,
        userData
      );
      res.status(201).json({ data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.id;
    try {
      await this.profileService.deleteProfile(userId);
      res.status(200).json({ message: "Delete profile successfully" });
    } catch (error) {
      next(error);
    }
  };

  public createExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data: AddExperienceDto = req.body;
    const userId = req.user.id;
    try {
      const user: IProfile = await this.profileService.addExperience(
        userId,
        data
      );
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const expId: string = req.params.exp_id;
    const userId: string = req.user.id;
    try {
      const profile = await this.profileService.deleteExperience(userId, expId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public createEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data: AddEducationDto = req.body;
    const userId = req.user.id;
    try {
      const user: IProfile = await this.profileService.addEducation(
        userId,
        data
      );
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const eduId: string = req.params.edu_id;
    const userId: string = req.user.id;
    try {
      const profile = await this.profileService.deleteEducation(userId, eduId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileService.follow(req.user.id, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public unfollow = async (req: Request, res: Response, next: NextFunction) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileService.unfollow(req.user.id, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileService.addFriend(
        req.user.id,
        toUserId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public unfriend = async (req: Request, res: Response, next: NextFunction) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileService.unfriend(req.user.id, toUserId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const toUserId: string = req.params.id;
    try {
      const profile = await this.profileService.acceptFriendRequest(
        req.user.id,
        toUserId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
