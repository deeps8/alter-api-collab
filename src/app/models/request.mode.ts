import { KeyValue } from "../workspace/wk-tab/wk-tab.component";
import { UserModel } from "./user.model";

export interface RequestModel{
    reqId:string,
    name:string,
    creator:UserModel,
    createdOn:string,
    url:string,
    method:"POST"|"GET"|"PUT"|"DELETE"|"PATCH",
    reqHeaders?:KeyValue[],
    reqParams?:KeyValue[],
    reqBody:string,
    response?:{
            resBody?:string,
            resHeaders?:KeyValue[],
            cookies?:KeyValue[],
            status?:string,
            time?:string,
            size?:string
        }
};