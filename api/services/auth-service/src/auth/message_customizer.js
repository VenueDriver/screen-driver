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
    event.response.emailMessage = `
        Your username is ${userDetails.email} and temporary password is {####}. 
        
        If you have any problem with first login, please, contact your system administrator.
        
        <span style="display: none;">{username}</span>
    `;
}
