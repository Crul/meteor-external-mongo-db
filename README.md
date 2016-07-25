# meteor external mongo db

external mongo db connector for angular meteor apps

```Batchfile
meteor add crul:meteor-external-mongo-db
```

## dependencies

- ecmascript
- underscore
- random 

## package exports

this packages exports **ExternalMongoDb** class (server side) which has 2 methods:
- connect(dbUrl)
- disconnect(dbName) 

```javascript
import { ExternalMongoDb } from 'meteor/crul:meteor-external-mongo-db';
let externalMongoDb = new ExternalMongoDb();
externalMongoDb.connect('mongodb://127.0.0.1:27017/dbName');
externalMongoDb.disconnect('dbName');
```

# example project instructions 

- meteor configuration

    ```Batchfile
    meteor create meteorTestApp
    cd meteorTestApp
    meteor remove autopublish
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
            Session.set('collectionLoaded', true)
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
