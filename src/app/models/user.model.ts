import { NotificationModel } from "./notification.model";

export interface UserModel{
    uid:string,
    username:string,
    email:string,
    notification?:Array<NotificationModel>
};