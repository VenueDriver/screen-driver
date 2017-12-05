const ClientUrlUtils = require('./client_url_utils');

class ForgotPasswordEmailCustomizer {

    static customize(event) {
        let userDetails = event.request.userAttributes;
        let clientAppUrl = ClientUrlUtils.getResetPasswordFormUrl(userDetails.email);
        event.response.emailSubject = "[ScreenDriver] Your password reset verification code";
        event.response.emailMessage = ForgotPasswordEmailCustomizer._getMessageTemplate(clientAppUrl);
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
