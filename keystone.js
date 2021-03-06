// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();
var pkg = require('./package.json');
// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'RefDocs',
	'brand': 'RefDocs',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',

	'data cite prefix': process.env.DATA_CITE_PREFIX,
	'data cite user': process.env.DATA_CITE_USER,
	'data cite password': process.env.DATA_CITE_PASSWORD,
	'data cite test mode': process.env.DATA_CITE_TEST_MODE !== 'false',

	'version': pkg.version
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'documents': 'documents',
	'creators': 'creators',
	'contributors': 'contributors'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
