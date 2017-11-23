'use strict';

module.exports.handler = (event, context, callback) => {
    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
        customizeInvitationEmail(event)
    }
    callback(null, event);
};

function customizeInvitationEmail(event) {
    let userDetails = event.request.userAttributes;
    let clientAppUrl = getSignUpUrl();
    event.response.emailSubject = "[ScreenDriver] Welcome to ScreenDriver!";
    event.response.emailMessage = getMessageTemplate(userDetails.email, clientAppUrl);
}

function getSignUpUrl() {
    let clientAppUrl = process.env.STAGE === 'production' ? process.env.CLIENT_APP_URL : process.env.CLIENT_APP_STAGING_URL;
    return `${clientAppUrl}/#/auth/first/?token=`;
}

function getMessageTemplate(userEmail, clientAppUrl) {
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
            Please contact your system administrator in case of any issues with login.
            <br><br>
            Thank you!
        </div>
        <span style="display: none;">{username}</span>
    `
}
