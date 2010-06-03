var sys = require('sys');

exports.mite_client = function(http_client) {
  return {
    projects: function(subdomain, api_key, callback) {
      get('/projects.json', subdomain, api_key, {}, callback);
    },
    time_entries: function(subdomain, api_key, parameters, callback) {
      get('/time_entries.json', subdomain, api_key, parameters, callback);
    }
  };
  
  function get(path, subdomain, api_key, parameters, callback) {
    var host = subdomain + '.mite.yo.lk';
    var mite = http_client.createClient(80, host);
    parameters.api_key = api_key;
    
    sys.log('GET http://' + host + path + '?' + params_to_string(parameters) + '\n');
    var request = mite.request(path + '?' + params_to_string(parameters), {'Host': host, 'User-Agent': 'mite.enterprise/0.1'});
    
    request.addListener('response', function (response) {
      if(response.statusCode == '200') {
        response.setBodyEncoding('utf-8');
        response.addListener('data', function (chunk) {
          callback(chunk);
        });
        response.addListener('end', function() {
          callback(null);
        });
      } else {
        sys.puts('ERROR got status ' + response.statusCode);
        response.addListener('data', function (chunk) {
          sys.puts('BODY: ' + chunk);
          callback(null);
        });
      };
    });
    request.close();
    
    function params_to_string(object) {
      var params = [];
      for(var i in object) {
        params.push([i, object[i]].join('='));
      }
      return params.join('&');
    };
    
  }
};