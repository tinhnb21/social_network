import { IUser, UserSchema } from "@modules/users";
import { HttpException } from "@core/exceptions";
import { IGroup, IManager, IMember } from "./groups.interface";
import CreateGroupDto from "./dtos/create_group.dto";
import GroupSchema from './groups.model';
import { profile } from "winston";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupService {
    public async createGroup(
        userId: string,
        groupDto: CreateGroupDto
    ): Promise<IGroup> {
        const user = await UserSchema.findById(userId).select('-password').exec();
        if (!user) throw new HttpException(400, 'User id is not exist');

        const existingGroup = await GroupSchema.find({
            $or: [{ name: groupDto.name }, { code: groupDto.code }],
        }).exec();

        console.log('existingGroup', existingGroup);

        if (existingGroup.length > 0) throw new HttpException(400, 'Name or code existed');

        const newGroup = new GroupSchema({
            ...groupDto
        });
        const group = await newGroup.save();

        return group;
    }

    public async updateGroup(
        groupId: string,
        groupDto: CreateGroupDto
    ): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const existingGroup = await GroupSchema.find({
            $and: [
                { $or: [{ name: groupDto.name }, { code: groupDto.code }] },
                { _id: { $ne: groupId } }
            ]
        }).exec();

        if (existingGroup.length > 0)
            throw new HttpException(400, 'Name or code existed');

        const groupFields = { ...groupDto };

        const updatedGroup = await GroupSchema.findOneAndUpdate({ _id: groupId }, { $set: groupFields }, { new: true }).exec();

        if (!updatedGroup) throw new HttpException(400, "Update is not success");
        return updatedGroup;
    }

    public async getAllGroup(): Promise<IGroup[]> {
        const groups = await GroupSchema.find().exec();
        return groups;
    }

    public async deleteGroup(groupId: string): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const deletedGroup = await GroupSchema.findOneAndDelete({
            _id: groupId
        }).exec();

        if (!deletedGroup) throw new HttpException(400, 'Update is not success');

        return deletedGroup;
    }

    public async joinGroup(userId: string, groupId: string): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const user = await UserSchema.findById(userId).exec();
        if (!user) throw new HttpException(400, "User id is not exist");

        if (group.member_requests && group.member_requests.some((item: IMember) => item.user.toString() === userId)) {
            throw new HttpException(400, "You has already been requested to join this group");
        }

        if (group.members && group.members.some((item: IMember) => item.user.toString() === userId)) {
            throw new HttpException(400, "You has already been be member to join of this group");
        }

        group.member_requests.unshift({ user: userId } as IMember);

        await group.save();
        return group;
    }

    public async approveJoinRequest(userId: string, groupId: string): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const user = await UserSchema.findById(userId).exec();
        if (!user) throw new HttpException(400, "User id is not exist");

        if (group.member_requests && group.member_requests.some((item: IMember) => item.user.toString() !== userId)) {
            throw new HttpException(400, "There is not any request of this user");
        }

        if (group.members && group.members.some((item: IMember) => item.user.toString() !== userId)) {
            throw new HttpException(400, "This user has already been in group");
        }

        group.member_requests = group.member_requests.filter(({ user }) => user.toString() !== userId);

        group.members.unshift({ user: userId } as IMember);

        await group.save();
        return group;
    }

    public async addManager(groupId: string, request: SetManagerDto): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const user = await UserSchema.findById(request.userId).exec();
        if (!user) throw new HttpException(400, "User id is not exist");

        if (group.managers && group.managers.some((item: IManager) => item.user.toString() === request.userId)) {
            throw new HttpException(400, "You has  already been set manager to this group");
        }

        group.managers.unshift({ user: request.userId, role: request.role } as IManager);

        await group.save();
        return group;
    }

    public async removeManager(groupId: string, userId: string): Promise<IGroup> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const user = await UserSchema.findById(userId).exec();
        if (!user) throw new HttpException(400, "User id is not exist");

        if (group.managers && group.managers.some((item: IManager) => item.user.toString() !== userId)) {
            throw new HttpException(400, "You has not yet been manager of this group");
        }

        group.managers = group.managers.filter(({ user }) => user.toString() !== userId);
        await group.save();
        return group;
    }

    public async getAllMembers(groupId: string): Promise<IUser[]> {
        const group = await GroupSchema.findById(groupId).exec();
        if (!group) throw new HttpException(400, "Group id is not exist");

        const userIds = group.members.map((member) => { return member.user });

        const users = UserSchema.find({ _id: userIds }).select('-password').exec();
        return users;
    }
}
