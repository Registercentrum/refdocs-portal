var keystone = require('keystone');
var Types = keystone.Field.Types;
var shortid = require('shortid');
var langs = require('iso-639-1');
var azure = require('keystone-storage-adapter-azure');
var prefix = keystone.get('data cite prefix');
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
	  generateFilename: function (file) {
		  return prefix + '/' + shortid.generate() + '.' + file.extension;
	  } 
  },
  schema: {
    container: true,
    etag: true,
    url: true
  }
});

var currYear = (new Date()).getUTCFullYear();

var titleNames = [
	{ field: 'translatedTitle', name: 'TranslatedTitle' },
	{ field: 'alternativeTitle', name: 'AlternativeTitle' },
	{ field: 'subtitle', name: 'Subtitle' }
];

var dateNames = [
	{ field: 'dateAccepted', name: 'Accepted' },
	{ field: 'dateAvailable', name: 'Available' },
	{ field: 'dateCreated', name: 'Created' },
	{ field: 'dateIssued', name: 'Issued' },
	{ field: 'dateSubmitted', name: 'Submitted' }
];

function getLanguangeSelections(){
	return langs.getLanguages(langs.getAllCodes()).map(
		function(x) {
			return {label: x.name, value: x.code}
		}
	).sort(
		function(a, b) {
			return a.label.localeCompare(b.label);
		}
	);
}

var Document = new keystone.List('Document', {
	map: { name: 'title' },
	track: true
});

Document.add({
	postfix: {
        type: String,
        'default': shortid.generate,
        index: true,
        unique: true,
        noedit: true
    },
	identifierType: {
		type: Types.Select,
		options: 'DOI', 
		default: 'DOI',
		emptyOption: false,
		hidden: true
	},
	creators: { type: Types.Relationship, ref: 'Creator', many: true, required: true, initial: true },
	title: { type: String, required: true, initial: true },
	translatedTitle: { type: String, collapse: true },
	alternativeTitle: { type: String, collapse: true },
	subtitle: { type: String, collapse: true },
	publisher: { type: String, required: true, initial: true },
	publicationYear: { type: Number, index: true, max: currYear + 1, min: 1900, initial: true, required: true, default: currYear },
	subjectString: { type: Types.Textarea, label: 'Subjects', note: 'Separate your different subjects with semicolon. \n\nExample: `subject one;subject two`'},
	//Contributors
	contributors: { type: Types.Relationship, ref: 'Contributor', many: true },
	dateAccepted: { type: Types.Date, collapse: true, format: 'YYYY-MM-DD' },
	dateAvailable: { type: Types.Date, collapse: true, format: 'YYYY-MM-DD' },
	dateCreated: { type: Types.Date, collapse: true, format: 'YYYY-MM-DD' },
	dateIssued: { type: Types.Date, collapse: true, format: 'YYYY-MM-DD' },
	dateSubmitted: { type: Types.Date, collapse: true, format: 'YYYY-MM-DD' },
	language: { type: Types.Select, options: getLanguangeSelections(), default: 'en', emptyOption: false },
	predefinedResourceType: { label: 'Select from a list of predifined resource types', type: Boolean, initial: true, default: true },
	resourceTypeExamples: { type: Types.Select, label: 'Resource Type', emptyOption: false, initial: true, required: true, options: ['Book', 'Book Chapter', 'Book Prospectus', 'Book Review', 'Book Series', 'Conference Abstract', 'Conference Paper', 'Conference Poster', 'Conference Program', 'Dictionary Entry', 'Disclosure', 'Dissertation', 'Edited Book', 'Encyclopedia Entry', 'Funding Submission', 'Journal Article', 'Journal Issue', 'License', 'Magazine Article', 'Manual', 'Newsletter Article', 'Newspaper Article', 'Online Resource', 'Patent', 'Registered Copyright', 'Report', 'Research Tool', 'Supervised Student Publication', 'Tenure-Promotion', 'Test', 'Trademark', 'Translation', 'University Academic Unit', 'Website', 'Working Paper'], dependsOn: { predefinedResourceType: true }}, 
	resourceTypeFreeText: { type: String, label: 'Resource Type', initial: true, required: true, dependsOn: { predefinedResourceType: false }},
	resourceTypeGeneral: { type: Types.Select, initial: true, required: true, emptyOption: false, options: ['Collection','Dataset','Event','Image','InteractiveResource','Model','PhysicalObject','Service','Software','Sound','Text','Workflow','Other']},
	versionMajor: { type: Types.Number, default: 1 },
	versionMinor: { type: Types.Number, default: 0 },
	// Azure File
	// Maybe should be required?
	file: { type: Types.File, storage: storage, initial: true }
});

Document.schema.virtual('version').get(function() {
	return this.versionMajor + '.' + this.versionMinor; 
});

Document.schema.virtual('resourceType').get(function(){
	return this.predefinedResourceType ? this.resourceTypeExamples : this.resourceTypeFreeText;
});

Document.schema.virtual('subjects').get(function(){
	return !this.subjectString ? [] : this.subjectString.split(';').map(function(s) {
		return s.trim();
	});
});

Document.schema.virtual('identifier').get(function(){
	return prefix + '/' + this.postfix; 
});

Document.schema.virtual('titles').get(function(){
	var doc = this;
	return titleNames
		.map(function(t){
			return { value: doc.get(t.field), type: t.name };
		})
		.filter(function(t){
			return !!t.value
		});
});

Document.schema.virtual('dates').get(function(){
	var doc = this;
	return dateNames
		.map(function(d){
			var currDate = doc._[d.field];
			return { value: currDate && currDate.format(), type: d.name };
		})
		.filter(function(d){
			return !!d.value;
		});
});

Document.defaultColumns = 'title, creators, publicationYear, createdAt';
Document.defaultSort = '-createdAt';
Document.register();
