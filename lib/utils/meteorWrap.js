'use strict'

let meteorWrap = {
    bindEnvironment: function(fn) {
        return Meteor.bindEnvironment(fn);
    }
};

export default meteorWrap;