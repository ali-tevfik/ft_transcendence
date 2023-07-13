import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { RoomEntity } from "./room.entity";
import { MessageEntity } from "./message.entity";
import { RoomUserEntity } from "./roomUser.entity";

export const ADMIN = 'admin';

@Entity()
@Unique(['userName'])
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column({ name: 'intraId',nullable: true, unique: true })
  	intraId: string;

 	@Column({nullable: true })
	public avatar: string;


	@Column({ nullable: true })
	status: string;


	@Column({})
	isLogged: boolean = false;

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.user)
	roomLinks: RoomUserEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.contact)
	contactLinks: RoomUserEntity[];

	@ManyToMany(() => UserEntity, user => user.blockedBy)
	@JoinTable({ name: "block" })
	blocking: UserEntity[];
	
	@ManyToMany(() => UserEntity, user => user.blocking)
	blockedBy: UserEntity[];

}
