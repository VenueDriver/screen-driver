
export class User {

    id: string = '';
    email: string = '';
    password?: string = '';
    newPassword?: string = '';
    isAdmin: boolean = false;

    constructor(user?: User) {
        if (user) {
            this.id = user.id;
            this.email = user.email;
            this.password = user.password;
            this.newPassword = user.newPassword;
            this.isAdmin = user.isAdmin;
        }
    }
}
