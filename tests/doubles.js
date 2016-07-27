'use strict'
import meteorWrap from '../lib/utils/meteorWrap';
import externalDbFactory from '../lib/externalDb/externalDbFactory'
import arrayPublisher from '../lib/publish/arrayPublisher'
import collectionPublisher from '../lib/publish/collectionPublisher'

function _foo() { return function(){}; }

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
MongoInternals.RemoteCollectionDriver = MongoInternals.RemoteCollectionDriver || _foo();
connectionMock = {
    mongo: {
        close: sinon.spy(_foo()),
        db: {
            listCollections: _foo()
        }
    }
};
connectionMongoDbListCollectionsMock= {
    toArray: sinon.spy(_foo())
}
sinon.stub(connectionMock.mongo.db, 'listCollections').returns(connectionMongoDbListCollectionsMock);
sinon.stub(MongoInternals, 'RemoteCollectionDriver').returns(connectionMock);

Mongo = Mongo || {};
Mongo.Collection = Mongo.Collection || _foo();
collectionMock = {};
sinon.stub(Mongo, 'Collection').returns(collectionMock);

externalDbMock = {
    name: testData.name,
    listCollections: sinon.spy(_foo()),
    open: sinon.spy(_foo()),
    close: sinon.spy(_foo()),
    isConnected:_foo(),
    createCollection: _foo()
};

sinon.stub(externalDbMock, 'isConnected');
sinon.stub(externalDbMock, 'createCollection');

bindEnvironmentFn = _foo();
sinon.stub(meteorWrap, 'bindEnvironment').returns(bindEnvironmentFn);

sinon.stub(externalDbFactory, 'create').returns(externalDbMock);
sinon.stub(arrayPublisher, 'publish');
sinon.stub(collectionPublisher, 'publish');
