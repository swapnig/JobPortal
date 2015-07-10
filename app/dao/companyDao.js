/*
 * Dao for entity : company
 */

var models = require('../models/models.js');

module.exports = {

    /* Save the company to database and return its object id on success */
    saveCompany : function(company, callback) {

        company.save(function (err) {
            if (err) {
                callback("fail");
                return handleError(err);
            } else {
                callback(company._id);
            }
        });
    },
    
    /* Find the company associated with given company id  */
    getCompany : function(id, callback) {
        models.Company.findById(id, function (err, company) {
            callback(company);
        });
    },
    
    /* Delete the company associated with given company id */
    deleteCompany : function(id, callback) {

        models.Company.findByIdAndRemove(id, function(err, modelDeleted){
            if (err) {
                callback("fail");
            } else {
                callback("success");    
            }
        });
    },

    /* Find a company by its name */
    findByCompanyName : function(name, callback) {

        models.Company.findOne({'name' : name}, function(err, company) {
            if (err) {
                console.log(err);
            } else if (company) {
                console.log("Company found");
                callback(company);
            } else {
                console.log("Company not found");
                callback(null);
            }
        });
    }
};