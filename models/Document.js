var keystone = require('keystone');
var Types = keystone.Field.Types;
var shortid = require('shortid');
var langs = require('iso-639-1');
/**
 * Document Model
 * ==========
 */

function getLanguangeSelections(){
	return langs.getLanguages(langs.getAllCodes()).map(
		function(x) {
			return {label: x.name, value: x.code}
		}
	);
}

var Document = new keystone.List('Document', {
	map: { name: 'title' }
});

Document.add({
	identifier: {
        type: String,
        'default': shortid.generate,
        index: true,
        unique: true,
        noedit: true
    },
	identifierType: {
		type: Types.Select,
		options: [{value: 'doi', label: 'DOI'}],
		default: 'doi',
		emptyOption: false,
		hidden: true
	},
	creators: { type: Types.Relationship, ref: 'Creator', many: true, required: true, initial: true },
	title: { type: String, required: true, initial: true },
	translatedTitle: { type: String, collapse: true },
	alternativeTitle: { type: String, collapse: true },
	subtitle: { type: String, collapse: true },
	publisher: { type: String },
	publicationYear: { type: Types.Date, default: Date.now, required: true, initial: true, note: 'Only year is selected from date'},
	subjects: { type: Types.Textarea, note: 'Separate your different subjects with semicolon. \n\nExample: `subject one;subject two`'},
	//Contributors
	contributors: { type: Types.Relationship, ref: 'Contributor', many: true },
	dateAccepted: { type: Types.Date, collapse: true },
	dateAvailable: { type: Types.Date, collapse: true },
	dateCreated: { type: Types.Date, collapse: true },
	dateIssued: { type: Types.Date, collapse: true },
	dateSubmitted: { type: Types.Date, collapse: true },
	language: { type: Types.Select, options: getLanguangeSelections() },
	freeTextResourceType: { type: Boolean, required: false },
	resourceTypeExamples: { type: Types.Select, label: 'Resource Type', options: ['Book', 'Book Chapter', 'Book Prospectus', 'Book Review', 'Book Series', 'Conference Abstract', 'Conference Paper', 'Conference Poster', 'Conference Program', 'Dictionary Entry', 'Disclosure', 'Dissertation', 'Edited Book', 'Encyclopedia Entry', 'Funding Submission', 'Journal Article', 'Journal Issue', 'License', 'Magazine Article', 'Manual', 'Newsletter Article', 'Newspaper Article', 'Online Resource', 'Patent', 'Registered Copyright', 'Report', 'Research Tool', 'Supervised Student Publication', 'Tenure-Promotion', 'Test', 'Trademark', 'Translation', 'University Academic Unit', 'Website', 'Working Paper'], dependsOn: { freeTextResourceType: false }}, 
	resourceTypeFreeText: { type: String, label: 'Resource Type', dependsOn: { freeTextResourceType: true }},
	resourceTypeGeneral: { type: Types.Select, options: ['Collection','Dataset','Event','Image','InteractiveResource','Model','PhysicalObject','Service','Software','Sound','Text15','Workflow','Other']},
	versionMajor: { type: Types.Number, default: 1 },
	versionMinor: { type: Types.Number, default: 0 }
	// Azure File

	// author: { type: Types.Relationship, ref: 'User', index: true },
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	// categories: { type: Types.Relationship, ref: 'Document', many: true }
});

Document.schema.virtual('version').get(function() {
	return this.versionMajor + '.' + this.versionMinor; 
});

Document.schema.virtual('resourceType').get(function(){
	return this.freeTextResourceType ? this.resourceTypeFreeText : this.resourceTypeExamples;
});

Document.defaultColumns = 'title, creators';
Document.register();
