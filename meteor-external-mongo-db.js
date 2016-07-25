'use strict'
import ExternalDb from './lib/externalDb/externalDb';
import externalDbFactory from './lib/externalDb/externalDbFactory';
import ExternalDbPublisher from './lib/externalDb/externalDbPublisher';

export const name = 'meteor-external-mongo-db';
export { ExternalDbPublisher, ExternalDb, externalDbFactory };
export default ExternalDbPublisher;
