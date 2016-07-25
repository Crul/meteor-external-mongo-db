'use strict'

// http://meteorcapture.com/publishing-anything/
class ArrayPublisher {
    publish(publicationName, getArrayFn) {
        Meteor.publish(publicationName, publishItems, {is_auto: true});

        function publishItems() {
            _.each(getArrayFn(), _.partial(addItem, this));
            this.ready();
            
            function addItem(self, item) {
                self.added(publicationName, Random.id(), item);
            }
        }
    }
}

export default ArrayPublisher;