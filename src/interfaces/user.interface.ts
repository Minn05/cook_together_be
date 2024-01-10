
export interface User {
    username: string;
    fullname: string;
    email: string;
    password: string;
    birthday: Date;
    height: number;
    weight: number;
}

export interface IUpdateProfile {
    user?: string;
    fullname?: string;
    height?: Number;
    weight?: Number;
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string
}

export interface INewFriend {
    uidFriend: string
}

export interface IAcceptFollowerRequest {
    uidFriend: string,
    uidNotification: string
}