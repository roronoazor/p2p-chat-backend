import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
    
    @IsNotEmpty()
    @Length(8, 11)
    @ApiProperty()
    phoneNumber: string;
}


export class LoginUserDto {
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    @Length(8, 11)
    phoneNumber: string;
}