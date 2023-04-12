import { IsNotEmpty, IsEmail, MinLength } from "class-validator";

export default class RegisterDto {
  constructor(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  public first_name: string | undefined;

  @IsNotEmpty()
  public last_name: string | undefined;

  @IsNotEmpty()
  @IsEmail()
  public email: string | undefined;

  @IsNotEmpty()
  @MinLength(6)
  public password: string | undefined;
}
