import { DataStoredInToken, TokenData } from "@modules/auth";
import UserSchema from "@modules/users/users.model";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exceptions";
import bcryptjs from "bcryptjs";
import { IUser } from "./index";
import jwt from "jsonwebtoken";
import LoginDto from "./auth.dto";

class AuthService {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ email: model.email });
    if (!user) {
      throw new HttpException(409, `Your email ${model.email} is not exist.`);
    }

    const isMacthPassword = await bcryptjs.compare(
      model.password!,
      user.password
    );
    if (!isMacthPassword)
      throw new HttpException(400, "Credential is not valid");

    return this.createToken(user);
  }

  public async getCurrentLoginUser(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId);
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    return user;
  }

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoredInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn: number = 3600;

    return {
      token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }
}

export default AuthService;
