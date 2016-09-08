var keystone = require('keystone');

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
			res.redirect(303, result.file.url);
		}
	});
};
