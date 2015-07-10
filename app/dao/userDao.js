/*
 * Dao for entity : user
 */

var models = require('../models/models.js');

module.exports = {
    
    /* Save the current user to database */
    saveUser : function(user, callback) {
        user.save(function (err) {
            if(err) {
                console.log(err);
                callback("fail");
            } else {
                callback("success");
            }
        });
    },
    
    /* Find a user by its name */
    findByUsername : function(username, callback) {
        models.User.findOne({'username' : username}, function(err, user) {
            if (err) {
                console.log(err);
            } else if (user) {
                console.log("User found");
                callback(user);
            } else {
                console.log("User not found");
                callback(null);
            }
        });
    }
};