var keystone = require('keystone');
var Types = keystone.Field.Types;

function getFullName(person){
	return person.givenName ? (person.familyName + ', ' + person.givenName) : person.familyName;	
}

/**
 * Person Model
 * ==========
 */

var Person = new keystone.List('Person');

Person.add({
	familyName: { type: String, required: true, initial: true },
	givenName: { type: String, required: false, initial: true },
	affiliation: { type: Types.Textarea },
});


Person.defaultColumns = 'familyName, givenName, affiliation';
Person.register();

/**
 * Creator Model
 * ==========
 */

var Creator = new keystone.List('Creator', {
	inherits: Person,
	map: { name: 'identifierName' }
});

Creator.add({});

Creator.schema.virtual('creatorName').get(function() {
	return getFullName(this); 
});

Creator.schema.virtual('identifierName').get(function(){
	return getFullName(this) + (this.affiliation ? ' (' + this.affiliation + ')' : '');
});

Creator.defaultColumns = 'familyName, givenName, affiliation';
Creator.register();

/**
 * Contributor Model
 * ================= 
 */

var Contributor = new keystone.List('Contributor', {
	inherits: Person,
	map: { name: 'identifierName' }
});

Contributor.add({
	contributorType: { type: Types.Select, options: ['ContactPerson','DataCollector','DataCurator','DataManager','Distributor','Editor','HostingInstitution','Producer','ProjectLeader','ProjectManager','ProjectMember','RegistrationAgency','RegistrationAuthority','RelatedPerson','Researcher','ResearchGroup','RightsHolder','Sponsor','Supervisor','WorkPackageLeader','Other'], required: true, initial: true }
});

Contributor.schema.virtual('contributorName').get(function(){
	return getFullName(this);
});

Contributor.schema.virtual('identifierName').get(function(){
	return getFullName(this) + ' (' + this.contributorType + ') (' + (this.affiliation || '') + ')';
})

Contributor.defaultColumns = 'familyName, givenName, affiliation, contributorType';
Contributor.register();
