'use strict'

class CollectionPublisher {
    publish(publicationName, getCollectionFn) {
        Meteor.publish(publicationName, findCollection, {is_auto: true});
        
        function findCollection(where, options) {
            let collection = getCollectionFn();         
            where = where || {};
            options = options || {};
            options.limit = options.limit || 10;
                        
            return collection.find(where, options); 
        }
    }
}

export default CollectionPublisher;