var job = angular.module('GetJobs', ['ngRoute']);
var possibleTypes = ["GET", "POST"];

// Main controller
job.controller('parentController', function($scope, GetJobsService, $window) {
    $scope.logOut = function(){
        GetJobsService.logOut();
        $window.location.href = "/login";
    }
});

/* Controller for database interactions*/

// Controller for viewing all my bookmarked jobs and possibily delete bookmarks
job.controller('ViewMyJobsController', function($scope, GetJobsService, $location) {
    $scope.jobs = [];
    
    var showJobs = function() {
        GetJobsService.getMyJobs().then(function(jobs) {
            $scope.jobs = jobs; 
        });
    };
    showJobs();

    $scope.removeJob = function(jobId) {
        GetJobsService.getJob(jobId).then(function(job) {
            GetJobsService.getCompanyJobCount(job.companyID).then(function(result) {
               // Last job for the company - user so delete company
               if (result.count <= 1) {
                    GetJobsService.removeCompany(job.companyID).then(function(result) {
                        console.log(job.companyID + " deleted " + result);
                    });
                }
                GetJobsService.removeJob(jobId).then(function(result) {
                    showJobs();
                });
            });
        });
    };
});

// Controller for viewing details of a individual bookmarked job
job.controller('ViewMyJobDetailsController', function($scope, GetJobsService, $routeParams, $location){
    $scope.job = {};
    $scope.company = {};
    var jobId = $routeParams.jobId;

    var showJob = function() {
        GetJobsService.getJob(jobId).then(function(job) {
            $scope.job = job;
            GetJobsService.getCompany(job.companyID).then(function(company){
                $scope.company = company;
            });
        });
    };
    showJob();

    $scope.updateJob = function(jobId) {
        GetJobsService.updateJob($scope.job);
        $location.path( "/viewMyJobs" );
    };

    $scope.removeJob = function(jobId) {
        GetJobsService.getJob(jobId).then(function(job) {
            GetJobsService.getCompanyJobCount(job.companyID).then(function(result) {
               if (result.count <= 1) {
                    GetJobsService.removeCompany(job.companyID).then(function(result) {
                        console.log(job.companyID + " deleted " + result);
                    });
                }
                GetJobsService.removeJob(jobId).then(function(result) {
                    $location.path( "/viewMyJobs" );
                });
            });
        });
    };
});


/* Controller for external api interactions*/

// Controller for job search page
job.controller('SearchJobController', function($scope, GetJobsService, $location) {
    $scope.jobs = [];
    $scope.searchParams = {};

    $scope.searchJobs = function() {

        GetJobsService.searchJob($scope.searchParams.description, 
                                 $scope.searchParams.location, 
                                 $scope.searchParams.partTime).then(function(jobs) {

            //Project selected fields from all the available jobs
            projectedJobs = [];
            for (var i = 0 ; i < jobs.length ; i++) {
                job = jobs[i];
                projectedJob = {};
                projectedJob.id = job.id;
                projectedJob.title = job.title;
                projectedJob.created_on = job.created_at;
                projectedJob.location = job.location;
                projectedJob.type = job.type;
                projectedJob.company = job.company;
                projectedJob.title = job.title;
                projectedJobs.push(projectedJob);
            }
            $scope.jobs = projectedJobs;
        });
    };
});

// Controller to view details of online jobs
job.controller('ViewJobDetailsController', function($scope, GetJobsService, $routeParams, $location) {
    $scope.job = {};
    var jobId = $routeParams.jobId;

    $scope.alerts = [];

    var getData = function(){
        GetJobsService.getDetails(jobId).then(function(job) {
            $scope.job = job;
            $scope.job.priority = 5;
        });
    };
    getData();

    $scope.saveJob = function() {

        company = {};
        company.name = $scope.job.company;
        company.url = $scope.job.company_url;
        company.logo = $scope.job.company_logo;

        GetJobsService.saveCompany(company).then(function(companyId) {
            //Project job details as per job model
            projectedJob = {};
            projectedJob.jobId = $scope.job.id;
            projectedJob.name = $scope.job.company;
            projectedJob.title = $scope.job.title;
            projectedJob.priority = $scope.job.priority;
            projectedJob.description = $scope.job.description;
            projectedJob.createdAt = $scope.job.created_at;
            projectedJob.location = $scope.job.location;
            projectedJob.type = $scope.job.type;
            projectedJob.howToApply = $scope.job.how_to_apply;
            projectedJob.url = $scope.job.url;
            projectedJob.companyID = companyId;

            //GetJobsService.saveJob(projectedJob);
            GetJobsService.saveJob(projectedJob).then(function(status) {
                if (status == "exists") {
                    $scope.alerts.push({msg: 'You have the job already bookmarked !!'});
                    console.log('exists');
                } else {
                    $location.path( "/viewMyJobs" );
                }
            });
            
        });
    };
});