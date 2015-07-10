angular.module('GetJobs').service("GetJobsService", function( $http, $q ) {

        // Return public API.
        return({
            searchJob : searchJob,
            getDetails : getDetails,
            saveJob : saveJob,
            getJob : getJob,
            updateJob : updateJob,
            removeJob: removeJob,
            getMyJobs : getMyJobs,
            getCompanyJobCount : getCompanyJobCount,
            saveCompany : saveCompany,
            getCompany : getCompany,
            removeCompany : removeCompany,
            logOut : logOut
        });

        // ---
        // PUBLIC METHODS.
        // ---


        /* Api's for making external api requests */

        // Search for jobs online
        function searchJob( description, location, jobType ) {
            var request = $http({
                method: "get",
                url: "/searchJob",
                params: {
                    description : description,
                    location : location,
                    jobType : jobType
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Fetch job details for a single job id
        function getDetails( jobId ) {
            var request = $http({
                method: "get",
                url: "/jobDetail",
                params: {
                    jobId : jobId
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };


        /* Api's for interaction with jobs in remote collection */

        // Add a job with the given name to the remote collection.
        function saveJob( job ) {
            var request = $http({
                method: "post",
                url: "/saveJob",
                data: {
                    job : job
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Get job with given job id from remote collection.
        function getJob( jobId ) {
            var request = $http({
                method: "get",
                url: "/getJob",
                params: {
                    jobId : jobId
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Update job in the remote collection.
        function updateJob(job) {
            var request = $http({
                method: "put",
                url: "/editJob",
                data: {
                    job : job
                }
            });
        }

        // Remove job with the given job id from the remote collection.
        function removeJob( jobId ) {
            var request = $http({
                method: "delete",
                url: "/deleteJob/"+jobId
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Get all of the jobs in the remote collection.
        function getMyJobs() {
            var request = $http({
                method: "get",
                url: "/getAllMyJobs"
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Get job count for company with given company id in the remote collection.
        function getCompanyJobCount( companyId ) {
            var request = $http({
                method: "get",
                url: "/getCompanyJobCount",
                params: {
                    companyId : companyId
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };


        /* Api's for interaction with companies in remote collection */

        // Add a company with the given name to the remote collection.
        function saveCompany( company ) {
            var request = $http({
                method: "post",
                url: "/saveCompany",
                data: {
                    company : company
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Get company with given company id from remote collection.
        function getCompany( companyId ) {
            var request = $http({
                method: "get",
                url: "/getCompany",
                params: {
                    companyId : companyId
                }
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // Remove company with the given company id from the remote collection.
        function removeCompany( companyId ) {
            var request = $http({
                method: "delete",
                url: "/deleteCompany/" + companyId
            });
            return( request.then( handleSuccess, handleError ) );
        };

        /* Api's for authentication */

        //Logout current user
        function logOut() {
            var request = $http({
                method: "get",
                url: "/logout"
            });
            return( request.then( handleSuccess, handleError ) );
        };

        // ---
        // PRIVATE METHODS.
        // ---

        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError( response ) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            return( response.data );
        }
    }
);