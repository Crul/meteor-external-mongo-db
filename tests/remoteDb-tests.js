// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";
import RemoteDb from '../lib/remoteDb/remoteDb';

let remoteCollectionDriverStub = MongoInternals.RemoteCollectionDriver;
let closeConnectionSpy = connectionMock.mongo.close;
let collectionNamesSpy = connectionMock.mongo.db.collectionNames;
let mongoCollectionStub = Mongo.Collection;

Tinytest.add('RemoteDb', function (test) {
  test.isNotUndefined(RemoteDb);
});

Tinytest.add('RemoteDb should parse url', function (test) {
  remoteCollectionDriverStub.reset();
  
  let remoteDb = new RemoteDb(testData.url);

  test.equal(remoteDb.url, testData.url);
  test.equal(remoteDb.name, testData.name);
  test.equal(remoteDb.publicationName, testData.publicationName);
  test.isTrue(remoteCollectionDriverStub.notCalled);
});

Tinytest.add('RemoteDb should open connection', function (test) {
  remoteCollectionDriverStub.reset();

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();

  test.isTrue(remoteCollectionDriverStub.calledOnce);
  test.isTrue(remoteCollectionDriverStub.calledWith(testData.url));
});

Tinytest.add('RemoteDb should close connection', function (test) {
  closeConnectionSpy.reset();

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();
  remoteDb.close();

  test.isTrue(closeConnectionSpy.calledOnce);
});

Tinytest.add('RemoteDb should call collectionNames', function (test) {
  let callback = _.identity;
  collectionNamesSpy.reset();

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();
  remoteDb.collectionNames(callback);

  test.isTrue(collectionNamesSpy.calledOnce);
  test.isTrue(collectionNamesSpy.calledWith(callback));
});

Tinytest.add('RemoteDb should create collection without driver if has not been opened', function (test) {
  mongoCollectionStub.reset();

  let remoteDb = new RemoteDb(testData.url);
  let collection = remoteDb.createCollection(testData.collection.name);

  test.equal(collection, collectionMock);
  test.isTrue(mongoCollectionStub.calledOnce);
  test.isTrue(mongoCollectionStub.calledWith(testData.collection.name));
  let driver = mongoCollectionStub.firstCall.args[1]._driver;
  test.isUndefined(driver);
});

Tinytest.add('RemoteDb should create collection with driver if has been opened', function (test) {
  mongoCollectionStub.reset();

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();
  remoteDb.createCollection(testData.collection.name);

  test.isTrue(mongoCollectionStub.calledOnce);
  test.isTrue(mongoCollectionStub.calledWith(testData.collection.name));
  let driver = mongoCollectionStub.firstCall.args[1]._driver;
  test.equal(driver, connectionMock);
});

Tinytest.add('RemoteDb should create collection with publicationName if not collectionName', function (test) {
  mongoCollectionStub.reset();

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.createCollection();

  test.isTrue(mongoCollectionStub.calledOnce);
  test.isTrue(mongoCollectionStub.calledWith(testData.publicationName));
});

Tinytest.add('RemoteDb should be connected when has been opened', function (test) {
  mongoCollectionStub.reset();
  connectionMock.mongo.db.state = testData.connectedState;

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();
  let isConnected = remoteDb.isConnected();

  test.isTrue(isConnected);
});

Tinytest.add('RemoteDb should not be connected when has not been opened', function (test) {
  mongoCollectionStub.reset();
  connectionMock.mongo.db.state = testData.connectedState;

  let remoteDb = new RemoteDb(testData.url);
  let isConnected = remoteDb.isConnected();

  test.isFalse(isConnected);
});

Tinytest.add('RemoteDb should not be connected when state is not connected', function (test) {
  mongoCollectionStub.reset();
  connectionMock.mongo.db.state = testData.notConnectedState;

  let remoteDb = new RemoteDb(testData.url);
  remoteDb.open();
  let isConnected = remoteDb.isConnected();

  test.isFalse(isConnected);
});