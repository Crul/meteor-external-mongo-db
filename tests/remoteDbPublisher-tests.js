// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";
import RemoteDb from '../lib/remoteDb/remoteDb';
import RemoteDbPublisher from '../lib/remoteDb/remoteDbPublisher';
import meteorUtils from '../lib/utils/meteorUtils';

Tinytest.add('RemoteDbPublisher', function (test) {
  test.isNotUndefined(RemoteDbPublisher);
});

Tinytest.add('RemoteDbPublisher should connect', function (test) {
  remoteDbMock.open.reset();
  remoteDbMock.collectionNames.reset();

  let remoteDbPublisher = new RemoteDbPublisher();
  sinon.stub(remoteDbPublisher.remoteDbFactory, 'create').returns(remoteDbMock);
  remoteDbPublisher.connect(testData.url);

  test.isTrue(remoteDbMock.open.calledOnce);
  test.isTrue(meteorUtils.bindEnvironment.calledOnce);
  test.isTrue(remoteDbMock.collectionNames.calledOnce);
  test.isTrue(remoteDbMock.collectionNames.calledWith(bindEnvironmentFn));

  test.equal(remoteDbPublisher.dbPool[testData.name], remoteDbMock);
});

Tinytest.add('RemoteDbPublisher should not connect if connectionIsOpened', function (test) {
  remoteDbMock.open.reset();

  let remoteDbPublisher = new RemoteDbPublisher();
  remoteDbPublisher.dbPool[remoteDbMock.name] = remoteDbMock; 
  sinon.stub(remoteDbMock, 'isConnected').returns(true);
  sinon.stub(remoteDbPublisher.remoteDbFactory, 'create').returns(remoteDbMock);
  remoteDbPublisher.connect(testData.url);

  test.isTrue(remoteDbMock.open.notCalled);
});

/*
Tinytest.add('RemoteDbPublisher should disconnect', function (test) {
  remoteDbMock.close.reset();
  let remoteDbPublisher = new RemoteDbPublisher();
  remoteDbPublisher.dbPool[testData.name] = remoteDbMock;

  remoteDbPublisher.disconnect(testData.name);

  test.isTrue(remoteDbMock.close.calledOnce);
});

Tinytest.add('RemoteDbPublisher should not processCollections if connection hasBeenOpenedBefore', function (test) {
  
});
*/

Tinytest.add('RemoteDbPublisher should processCollections', function (test) {
  let db = {};
  let error = undefined;
  let resultCount = _.random(1, 10);
  let results = _.range(resultCount);
  let remoteDbPublisherStub = {
    setCollectionPool: _.identity,
    publishDbCollections: _.identity,
    publishCollection: _.identity
  };
  sinon.stub(remoteDbPublisherStub, 'setCollectionPool');
  sinon.stub(remoteDbPublisherStub, 'publishDbCollections');
  sinon.stub(remoteDbPublisherStub, 'publishCollection');
  let remoteDbPublisher = new RemoteDbPublisher();

  remoteDbPublisher.processCollections(remoteDbPublisherStub, db, error, results);

  test.isTrue(remoteDbPublisherStub.setCollectionPool.calledOnce);
  test.isTrue(remoteDbPublisherStub.setCollectionPool.calledWith(db, results));

  test.isTrue(remoteDbPublisherStub.publishDbCollections.calledOnce);
  test.isTrue(remoteDbPublisherStub.publishDbCollections.calledWith(db));

  test.equal(remoteDbPublisherStub.publishCollection.callCount, resultCount);
});

Tinytest.add('RemoteDbPublisher should setCollectionPool', function (test) {
  let dbCollections = [{name:'c1'}, {name:'c2'}];
  let mongoCollections = _.range(dbCollections.length);
  let createCollectionStub = sinon.stub(remoteDbMock, 'createCollection'); 
  for (var i in dbCollections)
    createCollectionStub.withArgs(dbCollections[i].name).returns(mongoCollections[i]);
  let remoteDbPublisher = new RemoteDbPublisher();

  remoteDbPublisher.setCollectionPool(remoteDbMock, dbCollections);
  
  let publisherDbCollectionPool = remoteDbPublisher.dbCollectionPool[remoteDbMock.name];
  test.equal(publisherDbCollectionPool, dbCollections);
  test.equal(createCollectionStub.callCount, dbCollections.length);
  for (var i in dbCollections) {
    let dbCollection = dbCollections[i];
    let publisherMongoCollection = remoteDbPublisher.mongoCollectionPool[dbCollection.name];
    let expectedMongoCollection = mongoCollections[i];
    test.equal(publisherMongoCollection, expectedMongoCollection);
  }
});

Tinytest.add('RemoteDbPublisher should publishDbCollections', function (test) {
  let remoteDbPublisher = new RemoteDbPublisher();
  sinon.stub(remoteDbPublisher.arrayPublisher, 'publish');

  remoteDbPublisher.publishDbCollections(remoteDbMock);

  test.isTrue(remoteDbPublisher.arrayPublisher.publish.calledOnce);
  test.isTrue(remoteDbPublisher.arrayPublisher.publish.calledWith(remoteDbMock.publicationName, sinon.match.func));
});

Tinytest.add('RemoteDbPublisher should publishCollection', function (test) {
  let collection = {name:'c1'};
  let remoteDbPublisher = new RemoteDbPublisher();
  sinon.stub(remoteDbPublisher.collectionPublisher, 'publish');

  remoteDbPublisher.publishCollection(remoteDbPublisher, remoteDbMock, collection);

  test.isTrue(remoteDbPublisher.collectionPublisher.publish.calledOnce);
  test.isTrue(remoteDbPublisher.collectionPublisher.publish.calledWith(collection.name, sinon.match.func));
});
