import { InjectRepository } from '@nestjs/typeorm';
import {UserI} from './user.interface'
import {CreateUserDTO} from '../dto/create-user-dto'
import { UpdateUserProfileDto } from './updateUserProfil.dto';
import { Injectable } from '@nestjs/common';
import { ADMIN, UserEntity } from '../typeorm/user.entity';
import { Repository, DataSource, createQueryBuilder } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { RoomEntity, GENERAL_CHAT } from 'src/typeorm/room.entity';
import { RoomUserEntity, UserRole } from 'src/typeorm/roomUser.entity';



@Injectable()
export class UserService {
  constructor(
	private dataSource: DataSource,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(RoomEntity)
		private roomRepository: Repository<RoomEntity>,
		@InjectRepository(RoomUserEntity)
		private roomUserRepository: Repository<RoomUserEntity>,){}


		// async initializeAdmin() {
		// 	let admin = await this.userRepository.findOne({ 
		// 		where: { userName: ADMIN } 
		// 	});
		
		// 	if (!admin) {
		// 		admin = this.userRepository.create({ userName: ADMIN });
		// 		await this.userRepository.save(admin);
		// 	};
		// }


  async disabledTwoFactor(user: UserEntity){
	await this.userRepository.update(user.id,{
		TwoFactorAuth: false,
		twoFactorAuthSecret:null
	})
  }

  async createUser(userData: CreateUserDTO): Promise<UserI> {
	const newUser = this.userRepository.create(userData);
	const createdUser: UserI = await this.userRepository.save(newUser);
	const generalChatRoom = await this.roomRepository.findOne({
		where: {roomName: GENERAL_CHAT}
	});
	const newRoomUser = this.roomUserRepository.create({
		userRole: UserRole.MEMBER,
		user: newUser,
		room: generalChatRoom,
	});
	newUser.isLogged = true
	await this.dataSource.manager.save(newRoomUser);
	console.log("newuser " + newUser)
	console.log("create user " + createdUser)


	return createdUser;
	}


	async updateTwoFactorStatus(id:number, isAuth:boolean){
		await this.userRepository.update(id,{
			TwoFactorAuth: isAuth
		})
	}
	async addAuthSecretKey(key:string,user:UserI){

		// if (!user || typeof user.id !== 'number') {
		// 	throw new Error('Invalid user data');
		//   }
		await this.userRepository.update(user.id,{
			twoFactorAuthSecret: key
			});
	}

	async findByintraIdEntitiy(intraId: string): Promise<UserEntity> {
		return await this.userRepository.findOne({
			where: { intraId: intraId },
		});
	}
	async findByintraId(intraIdToFind: string): Promise<UserI> {
		return await this.userRepository.findOne({
			where: { intraId: intraIdToFind },
		});
	}

	async findByAllUser(): Promise<UserI[]> {
		const users: UserEntity[] = await this.userRepository.find();
		return users as UserI[];
	}

	async findByID(idToFind: number): Promise<UserI> {
		const user =
		 await this.userRepository.findOne({
			where: { id: idToFind },
		});
		return user;
	}

	async findId(intrabyId: string): Promise<number>{
		const user  = await this.userRepository.findOne({
			where: {intraId: intrabyId}
		})
		return user.id;
	}

	async updataAvatar(path: string, user: UserEntity): Promise<UserI>{
			await this.userRepository.update(user.id,{
				avatar: "http://localhost:3001/user/avatar/" + path
			});
			console.log("succes update avatar");
			return user;
	}

	async updateUserProfile(updateUserInfo: UpdateUserProfileDto): Promise<UserI | undefined> {
		try {
		  const id = await this.findId(updateUserInfo.intraId); // findId fonksiyonunun tamamlanmasını bekleyin
		  console.log(id + " da " + updateUserInfo.avatar);
	  
		  await this.userRepository.update(id, {
			userName: updateUserInfo.userName,
		  });
		  
		  console.log("kaydetme başarılı");
		  return await this.findByID(updateUserInfo.id);
		} catch (error) {
		  console.log("hata: " + error);
		  return undefined;
		}
	  }




	  async findUserByUserName(userName: string): Promise<UserDto> {
		const user = await this.userRepository.findOne({ 
			where: { userName: userName } 
		});
		if(!user)
			return 
		const { id, status, intraId } = user;
		return {
			id,
			userName,
			intraId,
			status,
		}
	}

	async updateStatus(userName: string, status: string): Promise<void> {
		const user = await this.userRepository.findOne({
			where: { userName: userName }
		});
		console.log("hello status")
		if(!user)
			return
		user.status = status;
		console.log("status changed")
		await this.userRepository.save(user);
	}

	async updateLogIn(userName: string, isLogged: boolean): Promise<void> {
		const user = await this.userRepository.findOne({
			where: { userName: userName }
		});
		console.log("hello isLogged")
		if(!user)
			return
		user.isLogged = isLogged;
		console.log("isLogged changed")
		await this.userRepository.save(user);
	}

	async getAllUsersStatus(): Promise<UserDto[]> {
		const users = await this.userRepository.find();
		
		const userData = users.map(({ id, userName, intraId, avatar, status }) => {
			return {
				id,
				userName,
				intraId,
				avatar,
				status,
			}
		});

		return userData as UserDto[];
	}

	getAllUsersTables(): Promise<any> {
		return this.userRepository.find({
			relations: {
				messages: true,
				roomLinks: true,
				contactLinks: true,
			},
		});
	}	
	
	getOneUsersTables(id: number): Promise<any> {
		return this.userRepository.find({
			relations: {
				messages: true,
				roomLinks: true,
				contactLinks: true,
			},
			where: {id: id,},
		});
	}	  
	
	async blockUser(blockerUserName: string, blockedUserName: string): Promise<void> {
		const [blocker, blocked] = await Promise.all([
			this.userRepository.findOne({ 
				where: { userName: blockerUserName },
				relations: ['blocking'], 
			}),
			this.userRepository.findOne({ 
				where: { userName: blockedUserName },
			}),
		]);

		blocker.blocking.push(blocked);
		await this.userRepository.save(blocker);
	}

	async unBlockUser(blockerUserName: string, blockedUserName: string): Promise<UserDto[]> {
		const [blocker, blocked] = await Promise.all([
			this.userRepository.findOne({ 
				where: { userName: blockerUserName },
				relations: ['blocking'], 
			}),
			this.userRepository.findOne({ 
				where: { userName: blockedUserName },
			}),
		]);

		const index = blocker.blocking.findIndex(user => user.id === blocked.id);

		if (index !== -1) {
			blocker.blocking.splice(index, 1);
			await this.userRepository.save(blocker);
		};

		const userData = blocker.blocking.map(({ id, userName, status }) => {
			return {
				id,
				userName,
				status
			}
		});

		return userData as UserDto[]
	}

	async getBlockedUsers(userName: string): Promise<UserDto[]> {
		const user = await this.userRepository.findOne({ 
			where: { userName: userName },
			relations: ['blocking']
		});

		const userData = user.blocking.map(({ id, userName, status }) => {
			return {
				id,
				userName,
				status,
			}
		});
		return userData as UserDto[];
	}
	  
	async deleteUser(id: number) {
		return this.userRepository.delete(id);
	}

	// ////////////////////////////////// idil

	async findUserByUserIddto(userId: number): Promise<UserDto> {
		const user = await this.userRepository.findOne({ 
			where: { id: userId } 
		});
		if(!user)
			return 
		const { userName, status } = user;
		return {
			id : userId,
			userName,
			status,
		}
	}

	async findUserByUserId(userId: number): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ 
			where: { id: userId } 
		});
	
		if(!user)
			throw new Error(`User with ID ${userId} not found`);
	
		return user;
	}

	async changeRank(userId: number) {
		const user = await this.userRepository.findOne({ 
			where: { id: userId } 
		});
	
		if(!user)
			throw new Error(`User with ID ${userId} not found`);

		const allUsers = await this.userRepository.find({
			order: {
				score: 'DESC',
			},
		});
		for (let i = 0; i < allUsers.length; i++) {
			allUsers[i].rank = i + 1;
			await this.userRepository.save(allUsers[i]);
		}
		return user;
	}
}
