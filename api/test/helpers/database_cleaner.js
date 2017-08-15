const Q = require('q');

const database = require('../../src/dynamodb/dynamodb');
const dbHelper = require('../../src/helpers/db_helper');

const tables = [process.env.VENUES_TABLE, process.env.CONTENT_TABLE, process.env.SETTINGS_TABLE, process.env.SCHEDULES_TABLE];

class DatabaseCleaner {
    static cleanDatabase() {
        return Q.all(tables.map(table => {
            return this.getAllId(table)
                .then(ids => { return this.cleanTable(table, ids)})
        }))
    }

    static getAllId(table) {
        let deferred = Q.defer();
        dbHelper.findAll(table)
            .then(items => {
                let identificatiors = items.map(item => item.id);
                deferred.resolve(identificatiors)
            });

        return deferred.promise;
    }


    static cleanTable(table, ids) {
        return Q.all(ids.map(id => {
            return this.deleteItem(table, id)
        }))
    }

    static deleteItem(tableName, id) {
        let deferred = Q.defer();
        var params = {
            TableName: tableName,
            Key: {
                id: id,
            },
        };
        database.delete(params, (error) => {
            if (error) {
                deferred.reject(error);
                throw new Error(error)
            }
            deferred.resolve();
        });
        return deferred.promise
    }
}

module.exports = DatabaseCleaner;
