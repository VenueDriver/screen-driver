module.exports.buildUpdateRequestParameters = (venue) => {
    return {
        TableName: process.env.VENUES_TABLE,
        Key: {
            id: venue.id,
        },
        ExpressionAttributeNames: {
            '#venue_name': 'name',
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':name': venue.name,
            ':screen_groups': venue.screen_groups,
            ':rev': venue._rev,
            ':new_rev': ++venue._rev,
        },
        UpdateExpression: 'SET #venue_name = :name, screen_groups = :screen_groups, #rev = :new_rev',
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };
};

module.exports.buildUpdateGroupsRequestParameters = (venue) => {
    return {
        TableName: process.env.VENUES_TABLE,
        Key: {
            id: venue.id,
        },
        ExpressionAttributeNames: {
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':screen_groups': venue.screen_groups,
            ':rev': venue._rev,
            ':new_rev': ++venue._rev,
        },
        UpdateExpression: 'SET screen_groups = :screen_groups, #rev = :new_rev',
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };
};

