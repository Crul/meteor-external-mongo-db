'use strict'
import RemoteDbFactory from './remoteDbFactory';
import ArrayPublisher from '../publish/arrayPublisher';
import CollectionPublisher from '../publish/collectionPublisher';
import meteorUtils from '../utils/meteorUtils';

class RemoteDbPublisher {

    constructor() {
        this.remoteDbFactory = new RemoteDbFactory();
        this.dbPool = {};
        this.dbCollectionPool = {};
        this.mongoCollectionPool = {};
        this.arrayPublisher = new ArrayPublisher();
        this.collectionPublisher = new CollectionPublisher();
    }

    connect(dbUrl) {
        let remoteDb = this.remoteDbFactory.create(dbUrl);
        if (this.isConnectionOpened(remoteDb))
            return;

        remoteDb.open();
        //if (this.hasBeenOpenedBefore(remoteDb))
        //    return this.setCollectionPool(remoteDb, this.dbCollectionPool[remoteDb.name]);

        this.dbPool[remoteDb.name] = remoteDb;
        let processCollectionsFn = _.partial(this.processCollections, this, remoteDb);
        let meteorProcessCollectionsFn = meteorUtils.bindEnvironment(processCollectionsFn);
        remoteDb.collectionNames(meteorProcessCollectionsFn);
    }

    disconnect(dbName) {
        let database = this.dbPool[dbName];
        if (!database)
            this.error(`disonnect - undefined database: ${dbName}`);

        //database.close();
    }

    processCollections(self, db, error, results) {
        let collections = results;
        if (error || !collections)
            this.error(`processCollections - error: ${error || 'undefined results'}`);

        self.setCollectionPool(db, collections);
        self.publishDbCollections(db);
        _.each(collections, _.partial(self.publishCollection, self, db));
    }

    setCollectionPool(db, collections) {
        this.dbCollectionPool[db.name] = collections;
        _.each(collections, _.partial(setCollectionPool, this));
        
        function setCollectionPool(self, collection) {
            let collectionName = collection.name;
            self.mongoCollectionPool[collectionName] = db.createCollection(collectionName);
        }
    }

    publishDbCollections(db) {
        let getArrayFn = _.partial(_.result, this.dbCollectionPool, db.name);
        this.arrayPublisher.publish(db.publicationName, getArrayFn);
    }

    publishCollection(self, db, collection) {
        let collectionPublicationName = db.getCollectionPublicationName(collection);
        let getCollectionFn = _.partial(_.result, self.mongoCollectionPool, collection.name);
        self.collectionPublisher.publish(collectionPublicationName, getCollectionFn);
    }

    hasBeenOpenedBefore(db) {
        db = this.dbPool[db.name] || db;
        return !!this.dbPool[db.name];
    }

    isConnectionOpened(db) {
        db = this.dbPool[db.name] || db;
        return this.hasBeenOpenedBefore(db) && db.isConnected();
    }

    error(msg) {
        throw new Meteor.Error(500, `RemoteDbPublisher.${msg}`);
    }
}

export default RemoteDbPublisher;