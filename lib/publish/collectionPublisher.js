'use strict'

class CollectionPublisher {
    publish(publicationName, getCollectionFn) {
        Meteor.publish(publicationName, findCollection);
        
        function findCollection() {
            return getCollectionFn().find({}, { limit: 10 }); 
        }
    }
}

export default CollectionPublisher;