# meteor external mongo db

external mongo db connector for angular meteor apps

(work in process...)

# how to use

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
    Meteor.startup(() => {
        var externalMongoDb = new ExternalMongoDb();
        externalMongoDb.connect('mongodb://127.0.0.1:27017/dbName');
    });
```
- add main.js code to client:

```javascript
    import { Meteor } from 'meteor/meteor';
    import './main.html';

    Meteor.subscribe('dbName-collections');
    var Collections = new Meteor.Collection('dbName-collections');

    Template.body.helpers({
        collections() {
            return Collections.find({});
        }
    });
```
- add main.html code to client:

```html
    <head>
        <title>test</title>
    </head>

    <body>
        <h1>Welcome to Meteor!</h1>
        
        {{#each collections}}
            <div>{{name}}</div>
        {{/each}}
    </body>
```