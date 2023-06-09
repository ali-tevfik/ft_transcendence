import { Controller, Get, Req, Param,Delete, Put , UploadedFile , UseInterceptors, Post, Body, Res ,StreamableFile, UseGuards} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './updateUserProfil.dto';
import { join } from 'path';

import * as fs  from "fs";

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}

    @Get('avatar/:filename')
    getImage(@Param('filename') filename: string, @Res() res) {
      const imageFilePath = join(__dirname, '../../upload', filename);
      console.log("filename is  " + filename + " " + imageFilePath)
      return res.sendfile(imageFilePath);
    }
    
    @Post('avatar/:imageName')
        @UseInterceptors(FileInterceptor('avatar'))
        async updateAvatar(
            @Req() req,
            @Param('imageName') imageName : string,
            @UploadedFile() avatar: Express.Multer.File,
	)
    {
        fs.writeFileSync(process.cwd() + "/upload/" + imageName, avatar.buffer);

        return this.userService.updataAvatar(imageName,req.user);
	}

    @Get('all')
    getAllUser(){
        console.log("\n\nget all user\n\n")
        return this.userService.findByAllUser();
    }
    @Get(':intraId')
    getUserByintraId(@Param('intraId') id: string){
        return this.userService.findByintraId(id)
    }

    @Post('update-user-profile')
    async updateUserProfile(@Body() userDTO: UpdateUserProfileDto){
        return await this.userService.updateUserProfile(userDTO );
    }

    @Put('block/:blocker/:blocked')
	async blockUser(
		@Param('blocker') blockerUserName: string,
		@Param('blocked') blockedUserName: string,
	){
		await this.userService.blockUser(blockerUserName, blockedUserName);
	}

	@Put('unblock/:blocker/:blocked')
	async unBlockUser(
		@Param('blocker') blockerUserName: string,
		@Param('blocked') blockedUserName: string,
	): Promise<UserDto[]> {
		return await this.userService.unBlockUser(blockerUserName, blockedUserName);
	}

	@Get('blocked/:userName')
	async getBlockedUsers(
		@Param('userName') userName: string
	): Promise<UserDto[]> {
		return await this.userService.getBlockedUsers(userName);
	}

	@Get()
	async findAll(): Promise<any> {
		return this.userService.getAllUsersTables();
	}
	
	// @Get('status')
	// async getAllUsersStatus(): Promise<UserDto[]> {
	// 	return await this.userService.getAllUsersStatus();
	// }

	@Get(':userName')
	async findUserByuserName(
		@Param('userName') userName: string): Promise<UserDto> {
		return this.userService.findUserByUserName(userName);
	}

	@Get(':id')
	async findOne(
		@Param('id') id: number): Promise<any> {
			return this.userService.getOneUsersTables(id);
	}

	@Delete(':id')
	delete(@Param('id') id: number) {
		return this.userService.deleteUser(id);
	}	
  
}
