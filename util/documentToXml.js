var xml = require('xml');

function formatSubject(subject) {
	return {
		subject: subject
	};
}

function formatAffiliation(affiliation){
	return { affiliation: affiliation };
}

function formatCreator(creator) {
	return {
		creator: [{ creatorName: creator.creatorName }].concat(creator.affiliations.map(formatAffiliation))
	};
}

function formatContributor(contributor) {
	return {
		contributor: [{ _attr: { contributorType: contributor.contributorType } }, { contributorName: contributor.contributorName }].concat(contributor.affiliations.map(formatAffiliation))
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

function mapDocumentToXML(doc) {
	return {
		resource:
		[
			{
				_attr: {
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					xmlns: 'http://datacite.org/schema/kernel-3',
					'xsi:schemaLocation': 'http://datacite.org/schema/kernel-3 http://schema.datacite.org/meta/kernel-3/metadata.xsd'
				}
			},
			{ identifier: [{ _attr: { identifierType: doc.identifierType } }, doc.identifier] },
			{ creators: doc.creators.map(formatCreator) },
			{ titles: [{ title: doc.title }].concat(doc.titles.map(formatTitle)) },
			{ publisher: doc.publisher },
			{ publicationYear: doc.publicationYear },
			{ subjects: doc.subjects.map(formatSubject) },
			{ contributors: doc.contributors.map(formatContributor) },
			{ dates: doc.dates.map(formatDate) },
			{ language: doc.language },
			{ resourceType: [{ _attr: { resourceTypeGeneral: doc.resourceTypeGeneral } }, doc.resourceType] },
			{ sizes: [{ size: doc.file.size + ' byte' }] },
			{ formats: [{ format: doc.file.mimetype }] },
			{ version: doc.version }
		]
	}
}

exports = module.exports = function(doc){
	return xml(mapDocumentToXML(doc), { declaration: true, indent: true });
}
