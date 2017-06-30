const Q = require('q');

const database = require('./../dynamodb');
const dbHelper = require('./../helpers/db_helper');

const tables = [process.env.VENUES_TABLE, process.env.CONTENT_TABLE];

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
            .then(venues => {
                let identificatiors = venues.map(venue => venue.id);
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
