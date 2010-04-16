var static = require("../vendor/static/static").static,
  sys = require("sys"),
  querystring = require('querystring');

exports.mite_server = function(mite_client) {
  var mite_client = mite_client;
  return function(req, res) {
    var query = req.url;
    var path = query.split('?')[0];
    var params_string = querystring.unescape(query.split('?')[1] + ''); 
    var params = params_string.split('&').map(param_to_array).reduce(param_arrays_to_hash, {});
    
    if(path == '/projects') {
      mite_client.projects(params.subdomain, params.api_key, sendJSON(res));
    } else if(path == '/time_entries') {
      var data_collector = function(no_of_requests) {
        var datas = [];
        
        return {
          collector_callback: function() {
            var data = '';
            return function(_data) {
              if(_data) {
                data = data + _data;
              } else {
                datas.push(data);
                if(datas.length == no_of_requests) {
                  send_data(JSON.stringify(join_json_arrays(datas)), res);
                }
              }
            };
          }
        };
        
        function join_json_arrays(json_arrays) {
          return json_arrays.map(function(item) {return JSON.parse(item)}).reduce(function(accumulator, array) {
            for(var i in array) {
              accumulator.push(array[i]);
            };
            return accumulator;
          }, [])
        };
      }(params['project_ids'].length);
      params['project_ids'].forEach(function(project_id) {
        mite_client.time_entries(params.subdomain, params.api_key, {
          from: params['from'], to: params['to'], project_id: project_id}, data_collector.collector_callback());
      });
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
        send_data(data, res);
      }
    };
  };
  
  function send_data(data, res) {
    res.sendHeader(200, {"Content-Type": 'application/json', "Content-Length": data.length });
    res.write(data);
    res.close();
  };

  function param_arrays_to_hash(accumulator, current) {
    var name = current[0];
    var value = current[1];
    if(name.substr(-2) == '[]') {
      var normalized_name = name.substr(0, name.length -2);
      accumulator[normalized_name] = accumulator[normalized_name] || [];
      accumulator[normalized_name].push(value);
    } else {
      accumulator[name] = value;
    }
    return accumulator;
  };
  
  function param_to_array(param) {
    return param.split('=');
  };
  
};