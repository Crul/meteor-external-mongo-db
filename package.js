Package.describe({
  name: 'crul:meteor-external-mongo-db',
  version: '0.2.1',
  summary: 'external mongo db connector for angular meteor apps',
  git: 'https://github.com/Crul/meteor-external-mongo-db',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.5.1');
  api.use('ecmascript');
  api.use('underscore');
  api.use('random');
  api.mainModule('meteor-external-mongo-db.js', 'server');
});

Package.onTest(function(api) {
  Npm.depends({ 'sinon': '1.14.1' });

  api.use('ecmascript');
  api.use('underscore');
  api.use('tinytest');

  api.use('practicalmeteor:sinon');
  api.use('crul:meteor-external-mongo-db');

  api.add_files('lib/utils/meteorUtils.js');
  api.add_files('lib/remoteDb/remoteDbPublisher.js', 'server');
  api.add_files('lib/remoteDb/remoteDb.js');
  
  api.add_files('tests/doubles.js');

  api.add_files('tests/remoteDb-tests.js');
  api.add_files('tests/remoteDbPublisher-tests.js', 'server');
});
