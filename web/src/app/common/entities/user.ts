
export class User {

    id: string = '';
    email: string = '';
    password?: string = '';
    newPassword?: string = '';
    isAdmin: boolean = false;
    _rev: number;

    constructor(user?: User) {
        if (user) {
            this.id = user.id;
            this.email = user.email;
            this.password = user.password;
            this.newPassword = user.newPassword;
            this.isAdmin = user.isAdmin;
            this._rev = user._rev;
        }
    }

    static isEmailValid(email: string): boolean {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }
}