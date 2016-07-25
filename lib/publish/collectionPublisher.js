'use strict'

class CollectionPublisher {
    publish(publicationName, getCollectionFn) {
        Meteor.publish(publicationName, findCollection, {is_auto: true});
        
        function findCollection() {
            return getCollectionFn().find({}, { limit: 10 }); 
        }
    }
}

export default CollectionPublisher;