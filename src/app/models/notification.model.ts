export interface NotificationModel{
    notifyId:string,
    title:string,
    description:string,
    type:"Invite" | "New Issue" | "New Request",
    status:"Read" | "Unread",
    helperId:string,
    createdOn:string,
};