/*
 * Define all the entities(models) to be used in the application
 */

// Grab the required modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

/* Mongoose schema for user */
var UserSchema = new Schema({
    firstName : String,
    lastName : String,
    email : String,
    username : String,
    password : {type : String, default: ''}
});

/* Mongoose schema for company */
var CompanySchema = new Schema({
    name : String,
	url : {type : String, default: ''},
	logo : {type : String, default: ''}
});

/* Mongoose schema for job */
var JobSchema = new Schema({
	jobId : String,
    name : String,
    priority : { type: Number, default: 5 },
    title : String,
    bookmarkedOn : { type: Date, default: Date.now },
    createdAt : Date,
    description : String,
    location : String,
    type : String,
    howToApply : String,
    url : String,
    companyID : { type: Schema.Types.ObjectId, ref: 'Company' },
    userId : { type: Schema.Types.ObjectId, ref: 'User' }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/* Mongoose schema for admin : Currently not used */
var AdminSchema = new Schema({
    firstName : {type : String, default: ''},
    lastName : {type : String, default: ''},
    employeeId : {type : String, default: ''}
});

module.exports = {
	Admin : mongoose.model('Admin', AdminSchema),
	Job : mongoose.model('Job', JobSchema),
    User : mongoose.model('User', UserSchema),
    Company : mongoose.model('Company', CompanySchema)
}
