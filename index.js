'use strict';

var request = require('request');
var _ = require('lodash');
var q = require('q');
var logger = require('./logger.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var TESTRAIL_URL = process.env.TESTRAIL_URL;
var TESTRAIL_USER = process.env.TESTRAIL_USER;
var TESTRAIL_PASSWORD = process.env.TESTRAIL_PASSWORD;

TESTRAIL_URL += !TESTRAIL_URL.match(/\/$/) 
  ? '/' 
  : '';
  
TESTRAIL_URL += 'index.php?/api/v2/';

var cipher = 'Basic ' + new Buffer(TESTRAIL_USER + ':' + TESTRAIL_PASSWORD).toString('base64');

var options = {
  headers: {
      'Authorization': cipher, 
      'Content-Type': 'application/json'
  }
};

var get = function(url) {
    var deferred = q.defer();
    var requestURL = TESTRAIL_URL + url;
    //logger.debug(requestURL);
    var getOptions = _.merge(options, {"url": requestURL});
    request.get(getOptions, function(error, response, body){
        if (!error && response.statusCode === 200) { 
          //logger.debug(JSON.parse(body));
          deferred.resolve(body);
        } else { 
          logger.error(body);
          deferred.reject("received non-200 response"); 
        }
    });
    return deferred.promise;
};

var post = function(url, params){
    var deferred = q.defer();
    var requestURL = TESTRAIL_URL + url;
    var postOptions = _.merge(options, {"url": requestURL});
    postOptions = _.merge(postOptions, {"body": JSON.stringify(params)});
    //logger.debug(JSON.stringify(postOptions));
    request.post(postOptions, function(error, response, body){
        if (!error && response.statusCode === 200) { 
          //logger.debug(JSON.parse(body));
          deferred.resolve(body);
        } else { 
          logger.error(body);
          deferred.reject("received non-200 response"); 
        }
    });
    return deferred.promise;
};

var requestURL = '';
var applyFilters = function(url, filtersObj){
    for (var filter in filtersObj) {
      if (filtersObj.hasOwnProperty(filter)) {
        url += ('&' + filter + '=' + filtersObj[filter]);
      }
    }
    return url;
}

var testrailjs = {};

testrailjs.cases = {
  "getCase" : function(caseId){
    return get('get_case/' + caseId);
  },

  "getCases" : function(projectId, suiteId, sectionId, filtersObj){
    if (typeof(suiteId) !== 'undefined' && typeof(sectionId) !== 'undefined'){
        requestURL = 'get_cases/' + projectId + '&suite_id=' + suiteId + '&section_id' + sectionId;
    } else {
        requestURL = 'get_cases/' + projectId + '&suite_id=' + suiteId;
    }

    if (!!filtersObj) {
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "addCase" : function(sectionId, params){
    return post('add_case/' + sectionId, params);
  },

  "updateCase" : function(caseId){
    return post('update_case/' + caseId, params);
  },

  "deleteCase": function(caseId){
    return post('delete_case/' + caseId);
  }
};

testrailjs.projects = {
  "getProject" : function(projectId){
    return get('get_project/' + projectId);
  },

  "getProjects" : function(filtersObj){
    requestURL = 'get_projects';
    if (!!filtersObj) {
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "addProject" : function(params){
    return post('add_project', params);
  },

  "updateProject" : function(projectId, params){
    return post('update_project/' + projectId, params);
  },

  "deleteProject" : function(projectId){
    return post('delete_project/' + projectId);
  }
};

testrailjs.results = {
  "getResults" : function(testId, filtersObj){
    requestURL = 'get_results/' + testId;

    if (!!filtersObj){
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "getResultsForCase" : function(runId, caseId, filtersObj){
    requestURL = 'get_results_for_case/' + runId + '/' + caseId;

    if (!!filtersObj){
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "getResultsForRun" : function(runId, filtersObj){
    requestURL = 'get_results_for_run/' + runId;

    if (!!filtersObj){
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "addResult" : function(testId, params){
    return post('add_result/' + testId, params);
  },

  "addResultForCase" : function(runId, caseId, params){
    return post('add_result/' + runId + '/' + caseId, params);
  },

  "addResults" : function(runId, params){
    return post('add_results/' + runId, params);
  },

  "addResultsForCases" : function(runId, params){
    return post('add_results_for_cases/' + runId, params);
  }
};

testrailjs.runs = {
  "getRun" : function(runId){
    return get('get_run/' + runId);
  },

  "getRuns" : function(projectId, filtersObj){
    requestURL = 'get_runs/' + projectId;

    if (!!filtersObj){
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  },

  "addRun" : function(projectId, params){
    return post('add_run/' + projectId, params);
  },

  "updateRun" : function(runId, params){
    return post('update_run/' + runId, params);
  },

  "closeRun" : function(runId){
    return post('close_run/' + runId);
  },

  "deleteRun" : function(runId){
    return post('delete_run/' + runId);
  }
};

testrailjs.suites = {
  "getSuite" : function(suiteId){
    return get('get_suite/' + suiteId);
  },

  "getSuites" : function(projectId){
    return get('get_suites/' + projectId);
  },

  "addSuite" : function(projectId, params){
    return post('add_suite/' + projectId, params);
  },

  "updateSuite" : function(suiteId, params){
    return post('update_suite/' + suiteId, params);
  },

  "deleteSuite" : function(suiteId){
    return post('delete_suite/' + suiteId);
  }
};

testrailjs.tests = {
  "getTest" : function(testId){
    return get('get_test/' + testId);
  },

  "getTests" : function(runId, filtersObj){
    requestURL = 'get_tests/' + runId;

    if (!!filtersObj){
      requestURL = applyFilters(requestURL, filtersObj);
    }

    return get(requestURL);
  }
};

module.exports = testrailjs;