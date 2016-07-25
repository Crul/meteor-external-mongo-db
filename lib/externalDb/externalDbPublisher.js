'use strict'
import externalDbFactory from './externalDbFactory';
import arrayPublisher from '../publish/arrayPublisher';
import collectionPublisher from '../publish/collectionPublisher';
import meteorWrap from '../utils/meteorWrap';

class ExternalDbPublisher {

    constructor() {
        this.externalDbFactory = externalDbFactory;
        this.arrayPublisher = arrayPublisher;
        this.collectionPublisher = collectionPublisher;
        
        this.dbPool = {};
        this.dbCollectionPool = {};
        this.mongoCollectionPool = {};
    }

    connect(dbUrl) {
        let externalDb = this.externalDbFactory.create(dbUrl);
        if (this.isConnectionOpened(externalDb))
            return;

        externalDb.open();
        //if (this.hasBeenOpenedBefore(externalDb))
        //    return this.setCollectionPool(externalDb, this.dbCollectionPool[externalDb.name]);

        this.dbPool[externalDb.name] = externalDb;
        let processCollectionsFn = _.partial(this.processCollections, this, externalDb);
        let meteorProcessCollectionsFn = meteorWrap.bindEnvironment(processCollectionsFn);
        externalDb.collectionNames(meteorProcessCollectionsFn);
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
        let getCollectionFn = _.partial(_.result, self.mongoCollectionPool, collection.name);
        self.collectionPublisher.publish(collection.name, getCollectionFn);
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
        throw new Meteor.Error(500, `ExternalDbPublisher.${msg}`);
    }
}

export default ExternalDbPublisher;