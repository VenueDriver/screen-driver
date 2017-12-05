class ForgotPasswordEmailCustomizer {

    static customize(event) {
        let clientAppUrl = ForgotPasswordEmailCustomizer._getSignUpUrl();
        event.response.emailSubject = "[ScreenDriver] Your password reset verification code";
        event.response.emailMessage = ForgotPasswordEmailCustomizer._getMessageTemplate(clientAppUrl);
    }

    static _getSignUpUrl() {
        let clientAppUrl = process.env.STAGE === 'production' ? process.env.CLIENT_APP_URL : process.env.CLIENT_APP_STAGING_URL;
        return `${clientAppUrl}/#/auth/reset-password/?token=`;
    }

    static _getMessageTemplate(clientAppUrl) {
        return `
            <div>
                Hello,
                <br><br>
                You've recently requested for resetting the password.
                <br><br>
                Use the following link to proceed reset password operation:
                <br><br>
                ${clientAppUrl}{####}
                <br><br>
                Please contact your system administrator in case of any issues with password reset.
                <br><br>
                Best regards,
                <br>
                ScreenDriver team
            </div>
        `
    }

}

module.exports = ForgotPasswordEmailCustomizer;
