'use strict'
import ExternalDb from './lib/externalDb/externalDb';
import ExternalDbFactory from './lib/externalDb/externalDbFactory';
import ExternalDbPublisher from './lib/externalDb/externalDbPublisher';

export const name = 'meteor-external-mongo-db';
export { ExternalDbPublisher, ExternalDb, ExternalDbFactory };
export default ExternalDbPublisher;
