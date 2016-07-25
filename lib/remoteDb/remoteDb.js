'use strict'

let connectedState = 'connected';
class RemoteDb {
    constructor(dbUrl) {
        this.url = dbUrl;
        this.name = dbUrl.split('/').pop();
        this.publicationName = `${this.name}-collections`;
        this.connection;
    }

    open() {
        this.connection = new MongoInternals.RemoteCollectionDriver(this.url);
        return this.connection;
    }

    close() {
        if (this.connection) this.connection.mongo.close();
    }

    collectionNames(callback) {
        return this.connection.mongo.db.collectionNames(callback);
    }

    createCollection(collectionName) {
        let publicationName = (collectionName || this.publicationName);
        return new Mongo.Collection(publicationName, { _driver: this.connection});
    }

    isConnected() {
        return this.connection && this.connection.mongo.db.state == connectedState;
    }

    getCollectionPublicationName(collection) {
        return `${this.name}-${collection.name}`;
    }
}

export default RemoteDb;