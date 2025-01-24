export class UserModel {
    userId?: number;
    userName: string = '';
    loginID: string = '';
    password: string = '';
    roleID: number = 0;
    isActive: boolean = true;
    isDeleted: boolean = false;
    isLogin: boolean = false;
    previousLoginDate?: Date | null;
    previousLogoutTime?: Date | null;
    lastLoginDate?: Date | null;
    loginIpAddress?: string | null;
    logoutDate?: Date | null;
    modifiedDateTime: Date = new Date();
    modifiedBy: number = 0;
    roleName?: string | null;
  }
  