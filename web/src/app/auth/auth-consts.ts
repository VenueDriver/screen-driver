import {environment} from "../../environments/environment";

export const USER_EMAIL = 'user_email';
export const USER_ID = 'user_id';
export const USER_IS_ADMIN = 'user_is_admin';

export const ID_TOKEN_PARAM = 'id_token';
export const REFRESH_TOKEN_PARAM = 'refresh_token';
export const ACCESS_TOKEN_PARAM = 'access_token';
export const ROLLBACK_URL_PARAM = 'rollbackUrl';

export const AUTH_URI = '/auth';
export const CONTENT_URI = '/content';

export const EXCLUSIVE_URLS = [
    'auth',
];

const AUTH_API_ENDPOINT = `${environment.apiUrl}/api/auth/`;
export const SIGN_IN_API = `${AUTH_API_ENDPOINT}sign_in`;
export const SIGN_OUT_API = `${AUTH_API_ENDPOINT}sign_out`;
export const TOKEN_REFRESH_API = `${AUTH_API_ENDPOINT}token/refresh`;
export const RESET_PASSWORD_API = `${AUTH_API_ENDPOINT}profile/password/reset`;
export const CONFIRM_RESET_PASSWORD_API = `${AUTH_API_ENDPOINT}profile/password/reset/confirm`;
