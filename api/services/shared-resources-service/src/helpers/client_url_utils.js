class ClientUrlUtils {

    static getSignUpPageUrl() {
        return `${ClientUrlUtils._getClientAppUrl()}/#/auth/first/?token=`;
    }

    static getResetPasswordFormUrl(email) {
        return `${ClientUrlUtils._getClientAppUrl()}/#/auth/reset-password/?email=${email}&token=`;
    }

    static _getClientAppUrl() {
        return process.env.STAGE === 'production' ? process.env.CLIENT_APP_URL : process.env.CLIENT_APP_STAGING_URL;
    }
}

module.exports = ClientUrlUtils;
