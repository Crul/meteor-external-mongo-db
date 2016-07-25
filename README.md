# meteor external mongo db [![Build Status](https://travis-ci.org/Crul/meteor-external-mongo-db.svg?branch=master)](https://travis-ci.org/Crul/meteor-external-mongo-db)

external mongo db connector for angular meteor apps

```Batchfile
meteor add crul:meteor-external-mongo-db
```

## quick start

```javascript
if (Meteor.isServer) {
    import { ExternalMongoDb } from 'meteor/crul:meteor-external-mongo-db';
    let externalMongoDb = new ExternalMongoDb();
    externalMongoDb.connect('mongodb://127.0.0.1:27017/dbName');
    externalMongoDb.disconnect('dbName');
}
```

## dependencies

- ecmascript
- underscore
- random 

## api

this packages exports **ExternalMongoDb** class (server side) which has 2 methods:
- **connect(dbUrl)**: it publish:
    - a collection named **'dbName-collections'** with the collections of the remote DB
    - all the server collections with plain names, find function signature: **find(where, options)**

- disconnect(dbName): not working :( 

! because collections are published with plain names, remote DB should have no collection with same name than collections in local DB  

## roadmap

- add configuration/settings (optional prefix for collections)
- disconnect / reconnect

# example project instructions 

- meteor configuration

    ```Batchfile
    meteor create meteorTestApp
    cd meteorTestApp
    meteor add sesion
    meteor add crul:meteor-external-mongo-db
    ```

- add main.js code to server:

    ```javascript
    import { Meteor } from 'meteor/meteor';
    import { ExternalMongoDb } from 'meteor/crul:meteor-external-mongo-db';

    Meteor.startup(() => {
        var externalMongoDb = new ExternalMongoDb();
        externalMongoDb.connect('mongodb://127.0.0.1:27017/dbName');
    });
    ```

- add main.js code to client:

    ```javascript
    import { Meteor } from 'meteor/meteor';
    import './main.html';

    Meteor.subscribe('umdm-collections');
    let Collections = new Meteor.Collection('umdm-collections');
    let Collection;
    let collections = {};

    Template.body.helpers({
        collections() {
            return Collections.find({});
        },
        collection() {
            return Collection.find({});
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
