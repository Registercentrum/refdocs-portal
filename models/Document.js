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
	title: { type: String, required: true, initial: true },
	translatedTitle: { type: String, collapse: true },
	alternativeTitle: { type: String, collapse: true },
	subtitle: { type: String, collapse: true },
	publisher: { type: String },
	subject: { type: Types.Textarea, note: 'Separate your different subjects with semicolon '},
	//Contributors
	dateAccepted: { type: Types.Date, collapse: true },
	dateAvailable: { type: Types.Date, collapse: true },
	dateCreated: { type: Types.Date, collapse: true },
	dateIssued: { type: Types.Date, collapse: true },
	dateSubmitted: { type: Types.Date, collapse: true },
	language: { type: Types.Select, options: getLanguangeSelections()},
	resourceType: { type: String, required: false },
	resourceTypeGeneral: { type: Types.Select, options: ['Book', 'Book Chapter', 'Book Prospectus', 'Book Review', 'Book Series', 'Conference Abstract', 'Conference Paper', 'Conference Poster', 'Conference Program', 'Dictionary Entry', 'Disclosure', 'Dissertation', 'Edited Book', 'Encyclopedia Entry', 'Funding Submission', 'Journal Article', 'Journal Issue', 'License', 'Magazine Article', 'Manual', 'Newsletter Article', 'Newspaper Article', 'Online Resource', 'Patent', 'Registered Copyright', 'Report', 'Research Tool', 'Supervised Student Publication', 'Tenure-Promotion', 'Test', 'Trademark', 'Translation', 'University Academic Unit', 'Website', 'Working Paper']}, 
	versionMajor: { type: Types.Number },
	versionMinor: { type: Types.Number }
	// Azure File

	// author: { type: Types.Relationship, ref: 'User', index: true },
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	// categories: { type: Types.Relationship, ref: 'Document', many: true }
});

Document.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Document.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Document.register();
