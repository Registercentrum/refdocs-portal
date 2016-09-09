var keystone = require('keystone');
var documentToXml = require('../../util/documentToXML');
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
		} else {
			res.type('xml');
			res.send(documentToXml(result));
		}
	});
};
