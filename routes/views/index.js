var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	locals.data = {};

	view.on('init', function(next){
		keystone.list('Document').model
			.count(function(err, count){
				if(!err){
					locals.data.nDocuments = count;
				}
				next(err);
			});
	});
	// Render the view
	view.render('index');
	
};
