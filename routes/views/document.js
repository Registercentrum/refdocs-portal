var keystone = require('keystone');
var xml = require('xml');

function formatSubject(subject) {
	return {
		subject: subject
	};
}

function formatCreator(creator) {
	return {
		creator: [{ creatorName: creator.creatorName }, { affiliation: creator.affiliation }]
	};
}

function formatContributor(contributor) {
	return {
		contributor: [{ _attr: { contributorType: contributor.contributorType } }, { contributorName: contributor.contributorName }, { affiliation: contributor.affiliation }]
	};
}

function formatDate(date) {
	return {
		date: [{ _attr: { dateType: date.type } }, date.value]
	};
}

function formatTitle(title) {
	return {
		title: [{ _attr: { titleType: title.type } }, title.value]
	};
}

function mapJsonToXML(json) {
	return {
		resource:
		[
			{
				_attr: {
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					xmlns: 'http://schema.labs.datacite.org/meta/kernel-4.0/',
					'xsi:schemaLocation': 'http://schema.labs.datacite.org/meta/kernel-4.0/metadata.xsd'
				}
			},
			{ identifier: [{ _attr: { identifierType: json.identifierType } }, json.identifier] },
			{ creators: json.creators.map(formatCreator) },
			{ titles: [{ title: json.title }].concat(json.titles.map(formatTitle)) },
			{ publisher: json.publisher },
			{ publicationYear: json.publicationYear },
			{ subjects: json.subjects.map(formatSubject) },
			{ contributors: json.contributors.map(formatContributor) },
			{ dates: json.dates.map(formatDate) },
			{ language: json.language },
			{ resourceType: [{ _attr: { resourceTypeGeneral: json.resourceTypeGeneral } }, json.resourceType] },
			{ sizes: [{ size: json.file.size + ' byte' }] },
			{ formats: [{ format: json.file.mimetype }] },
			{ version: json.version }
		]
	}
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
		} else {
			res.type('xml');
			res.send(xml(mapJsonToXML(result), { declaration: true, indent: true }));
		}
	});
};
