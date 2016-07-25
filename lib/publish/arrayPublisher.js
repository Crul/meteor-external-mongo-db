'use strict'
import publisher from './publisher';

// http://meteorcapture.com/publishing-anything/
class ArrayPublisher {

    publish(publicationName, getArrayFn) {
        publisher.publish(publicationName, publishItems);

        function publishItems() {
            _.each(getArrayFn(), _.partial(addItem, this));
            this.ready();
            
            function addItem(self, item) {
                self.added(publicationName, Random.id(), item);
            }
        }
    }
}

let arrayPublisher = new ArrayPublisher();

export default arrayPublisher;