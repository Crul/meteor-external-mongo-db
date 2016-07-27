Package.describe({
  name: 'crul:meteor-external-mongo-db',
  version: '0.3.8',
  summary: 'external mongo db connector for angular meteor apps',
  git: 'https://github.com/Crul/meteor-external-mongo-db',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.5.1');
  api.use('ecmascript');
  api.use('underscore');
  api.use('random');
  api.mainModule('meteor-external-mongo-db.js');
});

Package.onTest(function(api) {
  Npm.depends({ 'sinon': '1.14.1' });

  api.use('ecmascript');
  api.use('underscore');
  api.use('random');
  api.use('tinytest');

  api.use('practicalmeteor:sinon');
  api.use('crul:meteor-external-mongo-db');

  api.add_files('lib/utils/meteorWrap.js');
  api.add_files('lib/externalDb/externalDbPublisher.js', 'server');
  api.add_files('lib/externalDb/externalDb.js');
  
  api.add_files('tests/doubles.js');

  api.add_files('tests/externalDb-tests.js');
  api.add_files('tests/externalDbPublisher-tests.js', 'server');
});
