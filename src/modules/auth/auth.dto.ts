import { IsNotEmpty, IsEmail, MinLength } from "class-validator";

export default class LoginDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  @IsEmail()
  public email: string | undefined;

  @IsNotEmpty()
  @MinLength(6)
  public password: string | undefined;
}
