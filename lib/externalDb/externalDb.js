'use strict'

let connectedState = 'connected';
class ExternalDb {
    
    constructor(dbUrl) {
        this.url = dbUrl;
        this.name = dbUrl.split('/').pop();
        this.publicationName = `${this.name}-collections`;
        this.connection;
    }

    open() {
        this.connection = new MongoInternals.RemoteCollectionDriver(this.url);
    }

    close() {
        if (this.connection)
            this.connection.mongo.close();
    }

    listCollections(callback) {
        if (this.connection)
            return this.connection.mongo.db.listCollections().toArray(callback);
    }

    createCollection(collectionName) {
        let publicationName = (collectionName || this.publicationName);
        return new Mongo.Collection(publicationName, { _driver: this.connection});
    }

    isConnected() {
        return this.connection && this.connection.mongo.db.state == connectedState;
    }
}

export default ExternalDb;