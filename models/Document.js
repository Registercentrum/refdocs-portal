var keystone = require('keystone');
var Types = keystone.Field.Types;
var shortid = require('shortid');
var langs = require('iso-639-1');
var azure = require('keystone-storage-adapter-azure');
/**
 * Document Model
 * ==========
 */

/**
 * Azure Storage Configuration
 */
var storage = new keystone.Storage({
  adapter: azure,
  azure: {
    // accountName: 'myaccount', // required; defaults to env.AZURE_STORAGE_ACCOUNT
    // accountKey: 'secret', // required; defaults to env.AZURE_STORAGE_ACCESS_KEY
    // container: 'mycontainer', // required; defaults to env.AZURE_STORAGE_CONTAINER
    generateFilename: keystone.Storage.randomFilename, // default
  },
  schema: {
    container: true, // optional; store the referenced container in the database
    etag: true, // optional; store the etag for the resource
    url: true, // optional; generate & store a public URL
  },
});

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
	publicationYear: { type: Types.Date, default: Date.now, required: true, index: true, initial: true, note: 'Only year is selected from date'},
	subjects: { type: Types.Textarea, note: 'Separate your different subjects with semicolon. \n\nExample: `subject one;subject two`'},
	//Contributors
	contributors: { type: Types.Relationship, ref: 'Contributor', many: true },
	dateAccepted: { type: Types.Date, collapse: true },
	dateAvailable: { type: Types.Date, collapse: true },
	dateCreated: { type: Types.Date, collapse: true },
	dateIssued: { type: Types.Date, collapse: true },
	dateSubmitted: { type: Types.Date, collapse: true },
	language: { type: Types.Select, options: getLanguangeSelections() },
	resourceType: { type: String, required: false },
	resourceTypeGeneral: { type: Types.Select, options: ['Book', 'Book Chapter', 'Book Prospectus', 'Book Review', 'Book Series', 'Conference Abstract', 'Conference Paper', 'Conference Poster', 'Conference Program', 'Dictionary Entry', 'Disclosure', 'Dissertation', 'Edited Book', 'Encyclopedia Entry', 'Funding Submission', 'Journal Article', 'Journal Issue', 'License', 'Magazine Article', 'Manual', 'Newsletter Article', 'Newspaper Article', 'Online Resource', 'Patent', 'Registered Copyright', 'Report', 'Research Tool', 'Supervised Student Publication', 'Tenure-Promotion', 'Test', 'Trademark', 'Translation', 'University Academic Unit', 'Website', 'Working Paper']}, 
	versionMajor: { type: Types.Number, default: 1 },
	versionMinor: { type: Types.Number, default: 0 },
	// Azure File
	file: { type: Types.File, storage: storage, initial: true }
});

Document.schema.virtual('version').get(function() {
	return this.versionMajor + '.' + this.versionMinor; 
});

Document.defaultColumns = 'title, creators';
Document.register();
