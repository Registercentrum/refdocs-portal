var keystone = require('keystone'),
	request = require('request'),
	documentToXml = require('../../util/documentToXml');

var username = keystone.get('data cite user'),
	password = keystone.get('data cite password'),
	testMode = keystone.get('data cite test mode');
	
function performDOIUpload(res, doi, url){
	request({
		uri: 'https://mds.datacite.org/doi',
		auth: {
			user: username,
			pass: password
		},
		qs: {
			testMode: testMode
		},
		method: 'post',
		formData: {
			doi: doi,
			url: url
		}
	}).pipe(res);
}

function performMetaUpload(res, xml){
	request({
		uri: 'https://mds.datacite.org/metadata',
		auth: {
			user: username,
			pass: password
		},
		qs: {
			testMode: testMode
		},
		method: 'post',
		body: xml,
		headers: {'Content-Type': 'application/xml;charset=UTF-8'}
	}).pipe(res);
}

exports = module.exports = function (req, res) {

	var locals = res.locals;

	// Set locals
	locals.filters = {
		document: req.params.document
	};
	locals.data = {};

	// Load the current document

	var q = keystone.list('Document').model
		.findOne({
			postfix: locals.filters.document
		})
		.populate('creators contributors')

	q.exec(function (err, result) {
		if (err || !result) {
			res.send(err);
		} else if(!result.file || !result.file.url){
			res.send('missing file');
		} else {
			if(req.url.indexOf('upload/metadata/') !== -1){
				performMetaUpload(res, documentToXml(result));
			} else{
				performDOIUpload(res, result.identifier, 'http://refdocs.registercentrum.se/' + result.identifier);
			}
		}
	});
};
