import { UserModel } from "./user.model";

export interface WorkspaceModel{
    workId:string,
    name:string,
    summary:string,
    type:"Team" | "Personal",
    owner: UserModel,
    createdOn: string,
    team:UserModel[],
    collectionCount:number,
    requestCount:number
};