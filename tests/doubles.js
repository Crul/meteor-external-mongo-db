import meteorUtils from '../lib/utils/meteorUtils';

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
            collectionNames: sinon.spy(_.identity)
        }
    }
};
sinon.stub(MongoInternals, 'RemoteCollectionDriver').returns(connectionMock);

Mongo = Mongo || {};
Mongo.Collection = Mongo.Collection || _.identity;
collectionMock = {};
sinon.stub(Mongo, 'Collection').returns(collectionMock);

remoteDbMock = {
    name: testData.name,
    collectionNames: sinon.spy(_.identity),
    open: sinon.spy(_.identity),
    close: sinon.spy(_.identity),
    isConnected: _.identity,
    createCollection: _.identity
};

bindEnvironmentFn = _.identity;
sinon.stub(meteorUtils, 'bindEnvironment').returns(bindEnvironmentFn);
