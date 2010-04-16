var static = require("../vendor/static/static").static,
  sys = require("sys");

exports.mite_server = function(mite_client) {
  var mite_client = mite_client;
  return function(req, res) {
    var query = req.url;
    var path = query.split('?')[0];
    var params_string = query.split('?')[1] + ''; 
    var params = params_string.split('&').map(param_to_array).reduce(arrays_to_hash, {});
    
    if(path == '/projects') {
      mite_client.projects(params.subdomain, params.api_key, sendJSON(res));
    } else if(path == '/time_entries') {
      mite_client.time_entries(params.subdomain, params.api_key, sendJSON(res));
    } else {
      static("public", req, res);
    };
  };  
  
  function sendJSON(res) {
    var data = '';
    return function(_data) {
      if(_data) {
        data = data + _data;
      } else {
        res.sendHeader(200, {"Content-Type": 'application/json', "Content-Length": data.length });
        res.write(data);
        res.close();
      }
    };
  };

  function arrays_to_hash(previousValue, currentValue) {
    previousValue[currentValue[0]] = currentValue[1];
    return previousValue;
  };
  
  function param_to_array(param) {
    return param.split('=');
  };
  
};