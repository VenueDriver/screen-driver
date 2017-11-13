'use strict';

module.exports.handler = (event, context, callback) => {
    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
        customizeInvitationEmail(event)
    }
    callback(null, event);
};

function customizeInvitationEmail(event) {
    let userDetails = event.request.userAttributes;
    event.response.emailSubject = "[ScreenDriver] Welcome to ScreenDriver!";
    event.response.emailMessage = getMessageTemplate(userDetails.email);
}

function getMessageTemplate(userEmail) {
    return `
        <div>
            Hello,
            <br><br>
            You've been invited to the ScreenDriver application.
            <br><br>
            Your username is ${userEmail}. Your temporary password to the first login is:
            <br><br>
            <b>{####}</b>
            <br><br>
            This password is for one time usage. Please, set a new one while the first login.
            <br><br>
            Please contact your system administrator in case of any issues with login.
            <br><br>
            Thank you!
        </div>
        <span style="display: none;">{username}</span>
    `
}
