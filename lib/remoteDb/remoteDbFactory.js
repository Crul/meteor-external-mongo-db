'use strict'
import RemoteDb from './remoteDb';

class RemoteDbFactory {
    create(dbUrl) {
        return new RemoteDb(dbUrl);
    }
}

export default RemoteDbFactory;