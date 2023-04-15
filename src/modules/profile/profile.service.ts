import { IUser } from "@modules/auth";
import {
  IEducation,
  IExperience,
  IFollower,
  IFriend,
  IProfile,
  ISocial,
} from "./profile.interface";
import ProfileSchema from "./profile.model";
import { HttpException } from "@core/exceptions";
import normalize from "normalize-url";
import CreateProfileDto from "./dtos/create_profile.dto";
import { UserSchema } from "@modules/users";
import AddExperienceDto from "./dtos/add_experience.dto";
import AddEducationDto from "./dtos/add_education.dto";

class ProfileService {
  public async getCurrentProfile(userId: string): Promise<Partial<IUser>> {
    const user = await ProfileSchema.findOne({ user: userId })
      .populate("User", ["name", "avatar"])
      .exec();

    if (!user)
      throw new HttpException(400, "There is no profile for this user");

    return user;
  }

  public async createProfile(
    userId: string,
    profileDto: CreateProfileDto
  ): Promise<IProfile> {
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = profileDto;

    const profileFileds: Partial<IProfile> = {
      user: userId,
      company,
      location,
      website:
        website && website != ""
          ? normalize(website.toString(), { forceHttps: true })
          : "",
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: string) => " " + skill.trim()),
      status,
    };

    const socialFields: ISocial = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = normalize(value, { forceHttps: true });
      }
    }

    profileFileds.social = socialFields;

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: userId },
      { $set: profileFileds },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return profile;
  }

  public async deleteProfile(userId: string) {
    await ProfileSchema.findOneAndRemove({ user: userId }).exec();
    await UserSchema.findOneAndRemove({ _id: userId }).exec();
  }

  public async getAllProfiles(): Promise<Partial<IUser>[]> {
    const profiles = await ProfileSchema.find()
      .populate("user", ["name", "avatar"])
      .exec();

    return profiles;
  }

  public addExperience = async (
    userId: string,
    experience: AddExperienceDto
  ) => {
    const newExp = {
      ...experience,
    };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "There is ot profile for this user");
    }

    profile.experience.unshift(newExp as IExperience);
    await profile.save();

    return profile;
  };

  public deleteExperience = async (userId: string, experienceId: string) => {
    const profile = await ProfileSchema.findOne({ user: userId }).exec();

    if (!profile) {
      throw new HttpException(400, "There is not profile for this user");
    }

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== experienceId
    );

    await profile.save();
    return profile;
  };

  public addEducation = async (userId: string, education: AddEducationDto) => {
    const newEducation = {
      ...education,
    };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "There is ot profile for this user");
    }

    profile.education.unshift(newEducation as IEducation);
    await profile.save();

    return profile;
  };

  public deleteEducation = async (userId: string, educationId: string) => {
    const profile = await ProfileSchema.findOne({ user: userId }).exec();

    if (!profile) {
      throw new HttpException(400, "There is not profile for this user");
    }

    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== educationId
    );

    await profile.save();
    return profile;
  };

  public follow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({
      user: toUserId,
    }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follower: IFollower) => follower.user.toString() === toUserId
      )
    ) {
      throw new HttpException(400, "You has been already followed this user");
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follower: IFollower) => follower.user.toString() === fromUserId
      )
    ) {
      throw new HttpException(
        400,
        "Target user has been already followed this user"
      );
    }
    if (!fromProfile.followings) fromProfile.followings = [];
    if (!toProfile.followers) toProfile.followers = [];
    fromProfile.followings.unshift({ user: toUserId });
    toProfile.followers.unshift({ user: fromUserId });

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public unfollow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({
      user: toUserId,
    }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follower: IFollower) => follower.user.toString() !== toUserId
      )
    ) {
      throw new HttpException(400, "You has not been yet follwed this user");
    }

    if (
      toProfile.followers &&
      toProfile.followers && toProfile.followers.findIndex((follower: IFollower) => follower.user.toString() === fromUserId) !== -1) {
      throw new HttpException(400, "You has not being followed this user");
    }

    if (!fromProfile.followings) fromProfile.followings = [];
    fromProfile.followings = fromProfile.followings.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.followers) toProfile.followers = [];
    toProfile.followers = toProfile.followers.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public addFriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({
      user: toUserId,
    }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      toProfile.friend_requests &&
      toProfile.friend_requests.some(
        (follower: IFollower) => follower.user.toString() === toUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has been already send a friend request to this user"
      );
    }

    if (
      toProfile.friends &&
      toProfile.friends.some(
        (follower: IFollower) => follower.user.toString() === fromUserId
      )
    ) {
      throw new HttpException(
        400,
        "Target user has been already be friend this user"
      );
    }
    if (!toProfile.friend_requests) toProfile.friend_requests = [];
    toProfile.friend_requests.unshift({
      user: fromUserId,
    } as IFriend);

    await toProfile.save();
    return toProfile;
  };

  public unfriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile)
      throw new HttpException(400, "There is not profile for your user");

    const toProfile = await ProfileSchema.findOne({
      user: toUserId,
    }).exec();

    if (!toProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      toProfile.friends && toProfile.friends.findIndex((follower: IFollower) => follower.user.toString() === fromUserId)) {
      throw new HttpException(400, "You has not yet be friend this user");
    }

    if (!fromProfile.friends) fromProfile.friends = [];
    fromProfile.friends = fromProfile.friends.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.friends) toProfile.friends = [];
    toProfile.friends = toProfile.friends.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public acceptFriendRequest = async (
    currentUserId: string,
    requestUserId: string
  ) => {
    const currentProfile = await ProfileSchema.findOne({
      user: currentUserId,
    }).exec();

    if (!currentProfile)
      throw new HttpException(400, "There is not profile for your user");

    const requestProfile = await ProfileSchema.findOne({
      user: requestUserId,
    }).exec();

    if (!requestProfile)
      throw new HttpException(400, "There is not profile for target user");

    if (
      requestProfile.friends &&
      requestProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === currentUserId
      )
    ) {
      throw new HttpException(400, "You are not be friend");
    }

    if (
      currentProfile.friends &&
      currentProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === requestUserId
      )
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    if (
      currentProfile.friend_requests &&
      currentProfile.friend_requests.some(
        (friend: IFriend) => friend.user.toString() !== requestUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has not any friend request related to this user"
      );
    }

    currentProfile.friend_requests = currentProfile.friend_requests.filter(
      ({ user }) => user.toString() !== requestUserId
    );

    currentProfile.friends.unshift({ user: requestUserId } as IFriend);
    requestProfile.friends.unshift({ user: currentUserId } as IFriend);

    await currentProfile.save();
    await requestProfile.save();
    return currentProfile;
  };
}

export default ProfileService;
