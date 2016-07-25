# meteor external mongo db [![Build Status](https://travis-ci.org/Crul/meteor-external-mongo-db.svg?branch=master)](https://travis-ci.org/Crul/meteor-external-mongo-db)

external / remote mongo db connector for angular meteor apps

```Batchfile
meteor add crul:meteor-external-mongo-db
```

## quick start

```javascript
import { ExternalDbPublisher } from 'meteor/crul:meteor-external-mongo-db';

if (Meteor.isServer) {
    var externalDbPublisher = new ExternalDbPublisher();
    externalDbPublisher.connect('mongodb://127.0.0.1:27017/dbName');
    // externalDbPublisher.disconnect('dbName'); // not working :(
}
```

## dependencies

- ecmascript
- underscore
- random 

## api

this packages exports:
- **ExternalDbPublisher** class (server side) which has 2 methods:
    - **connect(dbUrl)**: it publish:
        - a collection named **'dbName-collections'** with the collections of the remote DB
        - all the server collections with plain names, find function signature: **find(where, options)**

    - *disconnect(dbName)*: **disabled**, disconnect works but you cannot re-connect again so I've disabled the disconnect feature

- **ExternalDb** class, use: new ExternalDb(dbUrl);
- **externalDbFactory** instance, use: externalDbFactory.create(dbUrl);

! because collections are published with plain names, remote DB should have no collection with same name than collections in local DB  

## roadmap

- add count support (tmeasday:publish-counts?)
- add configuration/settings (optional prefix for collections)
- disconnect / reconnect

# example project instructions 

- meteor configuration

    ```Batchfile
    meteor create meteorTestApp
    cd meteorTestApp
    meteor add crul:meteor-external-mongo-db
    ```

- add main.js code to server:

    ```javascript
    import { Meteor } from 'meteor/meteor';
    import ExternalDbPublisher from 'meteor/crul:meteor-external-mongo-db';

    Meteor.startup(() => {
        var externalDbPublisher = new ExternalDbPublisher();
        externalDbPublisher.connect('mongodb://127.0.0.1:27017/dbName');
    });
    ```

- add main.js code to client:

    ```javascript
    import { Meteor } from 'meteor/meteor';
    import './main.html';

    Meteor.subscribe('dbName-collections');
    let Collections = new Meteor.Collection('dbName-collections');
    let Collection;
    let collections = {};

    Template.body.helpers({
        collections() {
            return Collections.find({});
        },
        collection() {
            return Collection.find({}, { limit: 10 });
        },
        collectionLoaded() {
            return Session.get('collectionLoaded');
        }
    });

    Template.body.events({
        'click .collection'(event, instance) {
            let collectionName = $(arguments[0].currentTarget).html();

            Meteor.subscribe(collectionName);
            collections[collectionName] = collections[collectionName] || new Meteor.Collection(collectionName) 
            Collection = collections[collectionName];
            Session.set('collectionLoaded', true);
        }
    });
    ```

- add main.html code to client:

    ```html
    <body>        
        <div style="border: solid 1px #000">
        {{#each item in collections}}
            <button class="collection">{{item.name}}</button>
        {{/each}}
        </div>

        {{#if collectionLoaded}}
            <div style="border: solid 1px #666">
            {{#each item in collection}}
                <div class="feed">{{item._id}}</div>
            {{/each}}
            </div>
        {{/if}}
    </body>
    ```
