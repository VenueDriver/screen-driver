import {UserRole} from "../auth/user-roles";

export interface NavBarLink {
    title: string;
    routerLink: string;
    permittedFor: UserRole;
}
