import { RequestModel } from "./request.mode";
import { UserModel } from "./user.model";

export interface CollectionModel{
    colId:string,
    name:string,
    workId:string,
    creater:UserModel,
    createdOn:string,
    request:RequestModel[]
};