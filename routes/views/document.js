var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals;
	
	// Set locals
	locals.filters = {
		document: req.params.document
	};
	locals.data = {	};
	
	// Load the current document
		
	var q = keystone.list('Document').model.findOne({
		identifier: locals.filters.document
	}).populate('creators contributors');
	
	q.exec(function(err, result) {
		if(err || !result){
			res.send(err);
		} else {
			locals.data.document = result._doc;
			locals.data.document.subjects = result.subjectArray;
			locals.data.document.version = result.version;
			locals.data.document.resourceType = result.resourceType;

			res.send(locals.data.document);
		}
	});
};
