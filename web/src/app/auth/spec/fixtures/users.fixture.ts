import {User} from "../../../core/entities/user";

export class UsersFixture {

    static getUserWithAdminRights(): User {
        let user = new User();
        user.id = 'adminId';
        user.email = 'admin@example.com';
        user.isAdmin = true;
        return user;
    }

    static getUserWithOperatorRights(): User {
        let user = new User();
        user.id = 'userId';
        user.email = 'user@example.com';
        user.isAdmin = false;
        return user;
    }

}
