'use strict'

class Publisher {
    publish(publicationName, fn) {
        Meteor.publish(publicationName, fn, {is_auto: true});
    }
}

let publisher = new Publisher();

export default publisher;