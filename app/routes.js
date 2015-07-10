/*
 * Define api's exposed by the application
 */

var https = require('https');
var jobDao = require('./dao/jobDao.js');
var companyDao = require('./dao/companyDao.js');
var models = require('./models/models.js');
var Client = require('node-rest-client').Client;
var client = new Client();

module.exports = function(job, passport) {
	

	// frontend routes =========================================================
	// route to handle all angular requests

	job.get('/', function(req, res) {
		if (req.user) {
			res.sendfile('./public/index.html');
		} else {
			res.sendfile('./public/views/login.html');
		}
	});



	/* Routes for external api requests from frontend */

	/* Make api request to search jobs */
	job.get('/searchJob', function(req, res){

		var description = req.query.description;
		var location = req.query.location;
		var api_url = "/positions.json?";

		var find = ' ';
		var regex = new RegExp(find, 'g');

		if (typeof description !== 'undefined') {
			description = description.replace(regex, '+');
			api_url += 'description=' + description + '&';
		}

		if (typeof location !== 'undefined') {
			location = location.replace(regex, '+');
			api_url += '&location=' + location;
		}

		//Get json for given request
		getJSON(api_url, function(statusCode, result) {
        	res.send(result);
        });
	});

	//Make external api request to get individual job details
	job.get('/jobDetail', function(req, res){

		var jobId = req.query.jobId;
		var api_url = "/positions/" + jobId + '.json?markdown=true';

		getJSON(api_url, function(statusCode, result) {
        	res.send(result);
        });
	});



	/* Database routes for job*/

	// Save job in mongodb
	job.post('/saveJob', function(req, res) {
		var job = req.body.job;
		var modelJob =  new models.Job(job);
		modelJob.userId = req.user._id;

		console.log("Job id:" + modelJob.jobId);
		jobDao.findByJobId(modelJob.jobId, function(result) {
		    if(result == null) {
				jobDao.saveJob(modelJob, function(result) {
					res.send(result);	
				});
		    } else {
				res.send("exists");
		    }
		});
	});
	
	// Get all the jobs for current user
	job.get('/getAllMyJobs', function(req, res) {

		jobDao.getAllJobs(req.user._id, function(jobs) {
			res.send(jobs);
		});
	});
	
	// Get details for a individual job for current user
	job.get('/getJob', function(req, res) {
		var jobId = req.query.jobId;

		jobDao.getJob(jobId, function(job) {
			res.send(job);
		});	
	});

	// Get job count for a given company
	job.get('/getCompanyJobCount', function(req, res) {
		var companyId = req.query.companyId;

		jobDao.countJobsForCompany(companyId, function(count) {
			res.end('{"count" : ' + count  + ', "status" : 200}');
		});	
	});

	// Update job in database
	job.put('/editJob', function(req, res) {
		var job = req.body.job;	

		models.Job.update({ _id: job._id }, { $set : job}).exec();
		res.send("updated");
	});

	// Delete the job from database
	job.delete('/deleteJob/:jobId', function(req, res) {
		var jobId = req.params.jobId;

		jobDao.deleteJob(jobId, function(jobs) {
			res.send(jobs);
		});
	});



	/* Database routes for company*/

	//Save company in database
	job.post('/saveCompany', function(req, res){
		var company = req.body.company;
		var modelCompany =  new models.Company(company);
		modelCompany.userId = req.user._id;

		companyDao.findByCompanyName(modelCompany.name, function(result) {
		    if(result == null) {
				companyDao.saveCompany(modelCompany, function(result) {
					res.send(result);	
				});
		    } else {
				res.send(result._id);
		    }
		});
	});

	// Get company with given company id
	job.get('/getCompany', function(req, res) {
		var companyId = req.query.companyId;

		companyDao.getCompany(companyId, function(company) {
			res.send(company);
		});
	});

	// Delete the company from database
	job.delete('/deleteCompany/:companyId', function(req, res) {
		var companyId = req.params.companyId;	

		companyDao.deleteCompany(companyId, function(result) {
			res.end('{"result" : ' + result  + ', "status" : 200}');
		});
	});

	

	/* Login, Logout, Register routes*/

	// GET login page
	job.get('/login', function(req, res) {
		// Display the Login page with any flash message, if any
		res.sendfile('./public/views/login.html');
	});

	// Handle Login POST
	job.post('/login', passport.authenticate('login', {
		successRedirect: '/index',
		failureRedirect: '/relogin',
		failureFlash : true 
	}));
	
	// GET relogin page
	job.get('/relogin', function(req, res){
		res.sendfile('./public/views/relogin.html');
	});
       
	// GET Registration Page
	job.get('/signup', function(req, res){
		res.sendfile('./public/views/register.html');
	});
       
	//Handle Registration POST
	job.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true 
	}));
	
	//Handle logout request
	job.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	/* Generic routes */
	
	job.get('/index', function(req, res) {
		if (req.user) {
			res.sendfile('./public/index.html');
		} else {
			res.sendfile('./public/views/login.html');
		}
	});
	
	job.get('*', function(req, res) {
		if (req.user) {
			res.sendfile('./public/index.html');
		} else {
			res.sendfile('./public/views/login.html');
		}
	});
};


/**
 * getJSON:  REST get request returning JSON object(s)
 * @param api_url: url for requesting json
 * @param callback: callback to pass the results JSON object(s) back
 */
function getJSON(api_url, onResult)
{
	var options = {
		host: 'jobs.github.com',
		port: 443,
		path : api_url,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
    	}
	};

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log('rest::getJSON ' + options.host + options.path + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        res.send('error: ' + err.message);
    });

    req.end();
};