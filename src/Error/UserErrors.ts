export default class ErrorsUser extends Error{
    constructor(public message:string){
        super(message);
        this.name = this.constructor.name;
    }
}
export enum UserErrors{
    NOT_FOUND= "User not found",
}
