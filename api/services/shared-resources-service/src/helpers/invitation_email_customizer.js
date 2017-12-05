const ClientUrlUtils = require('./client_url_utils');

class InvitationEmailCustomizer {

    static customize(event) {
        let userDetails = event.request.userAttributes;
        let clientAppUrl = ClientUrlUtils.getSignUpPageUrl();
        event.response.emailSubject = "[ScreenDriver] Welcome to ScreenDriver!";
        event.response.emailMessage = InvitationEmailCustomizer._getMessageTemplate(userDetails.email, clientAppUrl);
    }

    static _getMessageTemplate(userEmail, clientAppUrl) {
        return `
            <div>
                Hello,
                <br><br>
                You've been invited to the ScreenDriver application.
                <br><br>
                Your username is ${userEmail}. To complete registration follow the link and create a password of your choice:
                <br><br>
                ${clientAppUrl}{####}
                <br><br>
                The link will expire within 1 day. 
                <br><br>
                Please contact your system administrator in case of any issues with login.
                <br><br>
                Thank you!
            </div>
            <span style="display: none;">{username}</span>
        `
    }
}

module.exports = InvitationEmailCustomizer;
