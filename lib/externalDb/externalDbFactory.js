'use strict'
import ExternalDb from './externalDb';

class ExternalDbFactory {
    create(dbUrl) {
        return new ExternalDb(dbUrl);
    }
}

let externalDbFactory = new ExternalDbFactory();

export default externalDbFactory;