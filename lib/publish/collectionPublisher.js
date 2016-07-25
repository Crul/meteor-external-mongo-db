'use strict'

class CollectionPublisher {
    publish(publicationName, getCollectionFn) {
        console.log('pulishing ' + publicationName);
        Meteor.publish(publicationName, findCollection);
        
        function findCollection() {
            return getCollectionFn().find({}, { limit: 10 }); 
        }
    }
}

export default CollectionPublisher;