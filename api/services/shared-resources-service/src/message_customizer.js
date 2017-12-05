'use strict';

const InvitationEmailCustomizer = require('./helpers/invitation_email_customizer');

module.exports.handler = (event, context, callback) => {
    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
        InvitationEmailCustomizer.customize(event);
    }
    callback(null, event);
};
