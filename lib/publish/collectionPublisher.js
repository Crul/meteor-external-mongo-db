'use strict'
import publisher from './publisher';

class CollectionPublisher {
    publish(publicationName, getCollectionFn) {
        publisher.publish(publicationName, findCollection);
        
        function findCollection(where, options) {
            let collection = getCollectionFn();         
            where = where || {};
            options = options || {};
            options.limit = options.limit || 10;
                        
            return collection.find(where, options); 
        }
    }
}

let collectionPublisher = new CollectionPublisher();

export default collectionPublisher;