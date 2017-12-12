'use strict';

const InvitationEmailCustomizer = require('./helpers/invitation_email_customizer');
const ForgotPasswordEmailCustomizer = require('./helpers/forgot_password_email_customizer');

module.exports.handler = (event, context, callback) => {
    let emailType = event.triggerSource;

    switch (emailType) {
        case 'CustomMessage_AdminCreateUser':
            InvitationEmailCustomizer.customize(event);
            break;
        case 'CustomMessage_ForgotPassword':
            ForgotPasswordEmailCustomizer.customize(event);
            break;
    }

    callback(null, event);
};
