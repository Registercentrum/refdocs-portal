var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'documents';
	// locals.filters = {
	// 	category: req.params.category
	// };
	locals.data = {
		documents: []
	};

	// Load the documents
	view.on('init', function(next) {
		
		var q = keystone.list('Document').model
			.find({
				// page: req.query.page || 1,
				// perPage: 10,
				// maxPages: 10,
				// filters: {
				// 	'state': 'published'
				// }
			})
			.sort('-createdAt')
		
		q.exec(function(err, results) {
			locals.data.documents = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('documents');
	
};
