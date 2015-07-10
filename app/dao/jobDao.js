/*
 * Dao for entity : job
 */

var models = require('../models/models.js');

module.exports = {

    /* Save the job to database */
    saveJob : function(job, callback) {

        job.save(function (err) {
            if (err) {
                callback("fail");
                return handleError(err);
            } else {
                callback("success");
            }
        });
    },
    
    /* Find the job associated with given job id  */
    getJob : function(id, callback) {

        models.Job.findById(id, function (err, job) {
            callback(job);
        });
    },
    
    /* Get all th jobs bookmarked by given userId  */
    getAllJobs : function(userId, callback) {

        models.Job.find({userId : userId}, function (err, jobs) {
            if (err) {
                console.log(err);
            }
            callback(jobs);
        });
    },
    
    /*  Delete the company associated with the job id  */
    deleteJob : function(id, callback){

        models.Job.findByIdAndRemove(id, function(err, modelDeleted) {
            if (err) {
                callback("fail");
            } else
                callback("success");    
        });
    },

    /* Count all the jobs for the company */
    countJobsForCompany : function(companyId, callback){

        models.Job.where({ 'companyID': companyId }).count(function (err, count) {
            if (err) {
                callback("fail");
            } else {
                callback(count);
            }
        });
    },

    /* Find a job by its jobId */
    findByJobId : function(jobId, callback) {

        models.Job.findOne({'jobId' : jobId}, function(err, job) {
            if (err) {
                console.log(err);
            } else if (job) {
                console.log("Job found");
                callback(job);
            } else {
                console.log("Job not found");
                callback(null);
            }
        });
    }
};