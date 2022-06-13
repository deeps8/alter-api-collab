import { UserModel } from "./user.model";

export interface InviteModel{
    invId:string,
    workId:string,
    workspaceName:string,
    sender:UserModel,
    receiver:UserModel,
    createdOn: string,
    status:"Accepted" | "Rejected" | "Pending",
    authority?:string
};