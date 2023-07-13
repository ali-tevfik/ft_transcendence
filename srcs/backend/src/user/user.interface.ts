
export interface UserI {
	id?: number;
	intraId?: string;
	userName?: string;
	avatar?: string;
	avatarSmall?: string
	friends?: UserI[]
	// twoFactorAuthenticationSecret: string;
}
