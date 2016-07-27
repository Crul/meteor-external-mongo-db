'use strict'
import meteorWrap from '../lib/utils/meteorWrap';
import externalDbFactory from '../lib/externalDb/externalDbFactory'
import arrayPublisher from '../lib/publish/arrayPublisher'
import collectionPublisher from '../lib/publish/collectionPublisher'

testData = {
  name: 'umdm',
  url: 'mongodb://127.0.0.1:27017/umdm',
  publicationName: 'umdm-collections',
  collection: { name: 'pipas' },
  collectionPublicationName: 'umdm-pipas',
  connectedState: 'connected',
  notConnectedState: 'not-connected'
};

MongoInternals = MongoInternals || {};
MongoInternals.RemoteCollectionDriver = MongoInternals.RemoteCollectionDriver || _.identity;
connectionMock = {
    mongo: {
        close: sinon.spy(_.identity),
        db: {
            listCollections: sinon.spy(_.identity)
        }
    }
};
sinon.stub(MongoInternals, 'RemoteCollectionDriver').returns(connectionMock);

Mongo = Mongo || {};
Mongo.Collection = Mongo.Collection || _.identity;
collectionMock = {};
sinon.stub(Mongo, 'Collection').returns(collectionMock);

externalDbMock = {
    name: testData.name,
    listCollections: sinon.spy(_.identity),
    open: sinon.spy(_.identity),
    close: sinon.spy(_.identity),
    isConnected:_.identity,
    createCollection: _.identity
};

sinon.stub(externalDbMock, 'isConnected');
sinon.stub(externalDbMock, 'createCollection');

bindEnvironmentFn = _.identity;
sinon.stub(meteorWrap, 'bindEnvironment').returns(bindEnvironmentFn);

sinon.stub(externalDbFactory, 'create').returns(externalDbMock);
sinon.stub(arrayPublisher, 'publish');
sinon.stub(collectionPublisher, 'publish');