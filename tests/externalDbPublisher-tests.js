'use strict'
import { Tinytest } from "meteor/tinytest";
import ExternalDb from '../lib/externalDb/externalDb';
import ExternalDbPublisher from '../lib/externalDb/externalDbPublisher';
import meteorWrap from '../lib/utils/meteorWrap';

Tinytest.add('ExternalDbPublisher', function (test) {
  test.isNotUndefined(ExternalDbPublisher);
});

Tinytest.add('ExternalDbPublisher should connect', function (test) {
  externalDbMock.open.reset();
  externalDbMock.collectionNames.reset();
  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.externalDbFactory.create.reset();

  externalDbPublisher.connect(testData.url);

  test.isTrue(externalDbPublisher.externalDbFactory.create.calledOnce);
  test.isTrue(externalDbMock.open.calledOnce);
  test.isTrue(meteorWrap.bindEnvironment.calledOnce);
  test.isTrue(externalDbMock.collectionNames.calledOnce);
  test.isTrue(externalDbMock.collectionNames.calledWith(bindEnvironmentFn));
  test.equal(externalDbPublisher.dbPool[testData.name], externalDbMock);
});

Tinytest.add('ExternalDbPublisher should not connect if connectionIsOpened', function (test) {
  externalDbMock.open.reset();
  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.dbPool[externalDbMock.name] = externalDbMock; 
  externalDbMock.isConnected.returns(true);
  externalDbPublisher.externalDbFactory.create.reset();

  externalDbPublisher.connect(testData.url);

  test.isTrue(externalDbPublisher.externalDbFactory.create.calledOnce);
  test.isTrue(externalDbMock.open.notCalled);
});

/*
Tinytest.add('ExternalDbPublisher should disconnect', function (test) {
  externalDbMock.close.reset();
  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.dbPool[testData.name] = externalDbMock;

  externalDbPublisher.disconnect(testData.url);

  test.isTrue(externalDbMock.close.calledOnce);
});

Tinytest.add('ExternalDbPublisher should not processCollections if connection hasBeenOpenedBefore', function (test) {
  
});
*/

Tinytest.add('ExternalDbPublisher should processCollections', function (test) {
  let db = {};
  let error = undefined;
  let resultCount = _.random(1, 10);
  let results = _.range(resultCount);
  let externalDbPublisherStub = {
    setCollectionPool: _.identity,
    publishDbCollections: _.identity,
    publishCollection: _.identity
  };
  sinon.stub(externalDbPublisherStub, 'setCollectionPool');
  sinon.stub(externalDbPublisherStub, 'publishDbCollections');
  sinon.stub(externalDbPublisherStub, 'publishCollection');

  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.processCollections(externalDbPublisherStub, db, error, results);

  test.isTrue(externalDbPublisherStub.setCollectionPool.calledOnce);
  test.isTrue(externalDbPublisherStub.setCollectionPool.calledWith(db, results));
  test.isTrue(externalDbPublisherStub.publishDbCollections.calledOnce);
  test.isTrue(externalDbPublisherStub.publishDbCollections.calledWith(db));
  test.equal(externalDbPublisherStub.publishCollection.callCount, resultCount);
});

Tinytest.add('ExternalDbPublisher should setCollectionPool', function (test) {
  let dbCollections = [{name:'c1'}, {name:'c2'}];
  let mongoCollections = _.range(dbCollections.length);
  externalDbMock.createCollection.reset(); 
  for (var i in dbCollections)
    externalDbMock.createCollection.withArgs(dbCollections[i].name).returns(mongoCollections[i]);
  let externalDbPublisher = new ExternalDbPublisher();

  externalDbPublisher.setCollectionPool(externalDbMock, dbCollections);
  
  let publisherDbCollectionPool = externalDbPublisher.dbCollectionPool[externalDbMock.name];
  test.equal(publisherDbCollectionPool, dbCollections);
  test.equal(externalDbMock.createCollection.callCount, dbCollections.length);
  for (var i in dbCollections) {
    let dbCollection = dbCollections[i];
    let publisherMongoCollection = externalDbPublisher.mongoCollectionPool[dbCollection.name];
    let expectedMongoCollection = mongoCollections[i];
    test.equal(publisherMongoCollection, expectedMongoCollection);
  }
});

Tinytest.add('ExternalDbPublisher should publishDbCollections', function (test) {
  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.arrayPublisher.publish.reset();

  externalDbPublisher.publishDbCollections(externalDbMock);

  test.isTrue(externalDbPublisher.arrayPublisher.publish.calledOnce);
  test.isTrue(externalDbPublisher.arrayPublisher.publish.calledWith(externalDbMock.publicationName, sinon.match.func));
});

Tinytest.add('ExternalDbPublisher should publishCollection', function (test) {
  let collection = {name:'c1'};
  let externalDbPublisher = new ExternalDbPublisher();
  externalDbPublisher.collectionPublisher.publish.reset();

  externalDbPublisher.publishCollection(externalDbPublisher, externalDbMock, collection);

  test.isTrue(externalDbPublisher.collectionPublisher.publish.calledOnce);
  test.isTrue(externalDbPublisher.collectionPublisher.publish.calledWith(collection.name, sinon.match.func));
});
