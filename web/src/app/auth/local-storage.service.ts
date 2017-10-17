import * as AuthConsts from "./auth-consts";

export class LocalStorageService {

    public static saveUserDetails(userDetails: any) {
        localStorage.setItem(AuthConsts.USER_EMAIL, userDetails.email);
        localStorage.setItem(AuthConsts.USER_ID, userDetails.id);
        localStorage.setItem(AuthConsts.USER_IS_ADMIN, userDetails.isAdmin.toString());
    }

    public static clear() {
        localStorage.removeItem(AuthConsts.ID_TOKEN_PARAM);
        localStorage.removeItem(AuthConsts.REFRESH_TOKEN_PARAM);
        localStorage.removeItem(AuthConsts.USER_EMAIL);
        localStorage.removeItem(AuthConsts.USER_ID);
        localStorage.removeItem(AuthConsts.USER_IS_ADMIN);
    }

    public static saveAuthTokens(tokens: any) {
        LocalStorageService.setIdToken(tokens['token']);
        LocalStorageService.setRefreshToken(tokens['refreshToken']);
    }

    public static getUserDetails(): any {
        return {
            email: LocalStorageService.getItem(AuthConsts.USER_EMAIL),
            isAdmin: LocalStorageService.getItem(AuthConsts.USER_IS_ADMIN),
            userId: LocalStorageService.getItem(AuthConsts.USER_ID)
        }
    }

    public static getIdToken(): string {
        return LocalStorageService.getItem(AuthConsts.ID_TOKEN_PARAM);
    }

    public static setIdToken(idToken) {
        LocalStorageService.setItem(AuthConsts.ID_TOKEN_PARAM, idToken);
    }

    public static getRefreshToken(): string {
        return LocalStorageService.getItem(AuthConsts.REFRESH_TOKEN_PARAM);
    }

    public static setRefreshToken(refreshToken) {
        return LocalStorageService.setItem(AuthConsts.REFRESH_TOKEN_PARAM, refreshToken);
    }

    public static setRollbackUrl(rollbackUrl) {
        LocalStorageService.setItem(AuthConsts.ROLLBACK_URL_PARAM, rollbackUrl);
    }

    public static getRollbackUrl(): string {
        return LocalStorageService.getItem(AuthConsts.ROLLBACK_URL_PARAM);
    }

    public static setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    public static getItem(key: string): any {
        return localStorage.getItem(key);
    }
}