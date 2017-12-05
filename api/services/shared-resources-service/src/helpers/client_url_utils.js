class ClientUrlUtils {

    static getSignUpPageUrl() {
        return `${ClientUrlUtils._getClientAppUrl()}/#/auth/first/?token=`;
    }

    static getResetPasswordFormUrl() {
        return `${ClientUrlUtils._getClientAppUrl()}/#/auth/reset-password/?token=`;
    }

    static _getClientAppUrl() {
        return process.env.STAGE === 'production' ? process.env.CLIENT_APP_URL : process.env.CLIENT_APP_STAGING_URL;
    }
}

module.expotrs = ClientUrlUtils;
