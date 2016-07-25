'use strict'
import { Tinytest } from "meteor/tinytest";
import ExternalDb from '../lib/externalDb/externalDb';

let remoteCollectionDriverStub = MongoInternals.RemoteCollectionDriver;
let closeConnectionSpy = connectionMock.mongo.close;
let collectionNamesSpy = connectionMock.mongo.db.collectionNames;
let mongoCollectionStub = Mongo.Collection;

Tinytest.add('ExternalDb', function (test) {
  test.isNotUndefined(ExternalDb);
});

Tinytest.add('ExternalDb should parse url', function (test) {
  remoteCollectionDriverStub.reset();
  
  let externalDb = new ExternalDb(testData.url);

  test.equal(externalDb.url, testData.url);
  test.equal(externalDb.name, testData.name);
  test.equal(externalDb.publicationName, testData.publicationName);
  test.isTrue(remoteCollectionDriverStub.notCalled);
});

Tinytest.add('ExternalDb should create collection without driver if has not been opened', function (test) {
  mongoCollectionStub.reset();

  let externalDb = new ExternalDb(testData.url);
  let collection = externalDb.createCollection(testData.collection.name);

  test.equal(collection, collectionMock);
  test.isTrue(mongoCollectionStub.calledOnce);
  test.isTrue(mongoCollectionStub.calledWith(testData.collection.name));
  let driver = mongoCollectionStub.firstCall.args[1]._driver;
  test.isUndefined(driver);
});

Tinytest.add('ExternalDb should create collection with publicationName if not collectionName', function (test) {
  mongoCollectionStub.reset();

  let externalDb = new ExternalDb(testData.url);
  externalDb.createCollection();

  test.isTrue(mongoCollectionStub.calledOnce);
  test.isTrue(mongoCollectionStub.calledWith(testData.publicationName));
});

if (Meteor.isServer) {

  Tinytest.add('ExternalDb should open connection', function (test) {
    remoteCollectionDriverStub.reset();

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();

    test.isTrue(remoteCollectionDriverStub.calledOnce);
    test.isTrue(remoteCollectionDriverStub.calledWith(testData.url));
  });

  Tinytest.add('ExternalDb should close connection', function (test) {
    closeConnectionSpy.reset();

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();
    externalDb.close();

    test.isTrue(closeConnectionSpy.calledOnce);
  });

  Tinytest.add('ExternalDb should call collectionNames', function (test) {
    let callback = _.identity;
    collectionNamesSpy.reset();

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();
    externalDb.collectionNames(callback);

    test.isTrue(collectionNamesSpy.calledOnce);
    test.isTrue(collectionNamesSpy.calledWith(callback));
  });
  
  Tinytest.add('ExternalDb should create collection with driver if has been opened', function (test) {
    mongoCollectionStub.reset();

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();
    externalDb.createCollection(testData.collection.name);

    test.isTrue(mongoCollectionStub.calledOnce);
    test.isTrue(mongoCollectionStub.calledWith(testData.collection.name));
    let driver = mongoCollectionStub.firstCall.args[1]._driver;
    test.equal(driver, connectionMock);
  });

  Tinytest.add('ExternalDb should be connected when has been opened', function (test) {
    mongoCollectionStub.reset();
    connectionMock.mongo.db.state = testData.connectedState;

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();
    let isConnected = externalDb.isConnected();

    test.isTrue(isConnected);
  });

  Tinytest.add('ExternalDb should not be connected when has not been opened', function (test) {
    mongoCollectionStub.reset();
    connectionMock.mongo.db.state = testData.connectedState;

    let externalDb = new ExternalDb(testData.url);
    let isConnected = externalDb.isConnected();

    test.isFalse(isConnected);
  });
  
  Tinytest.add('ExternalDb should not be connected when state is not connected', function (test) {
    mongoCollectionStub.reset();
    connectionMock.mongo.db.state = testData.notConnectedState;

    let externalDb = new ExternalDb(testData.url);
    externalDb.open();
    let isConnected = externalDb.isConnected();

    test.isFalse(isConnected);
  });
}


