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
      var data_collector = create_data_collector(params['accounts'].length, function(datas) {
        send_data(JSON.stringify(join_json_arrays(datas)), res);
      });
      params['accounts'].forEach(function(account) {
        var subdomain = account.split('|')[0],
          api_key = account.split('|')[1];
        mite_client.projects(subdomain, api_key, data_collector.collector_callback(function(data) {
          var json = JSON.parse(data);
          var projects = json.map(function(item) {
            var project = item['project'];
            project['subdomain'] = subdomain;
            project['api_key'] = api_key;
            return project;
          });
          return JSON.stringify(projects);
        }));
      });
    } else if(path == '/time_entries') {
      var data_collector = create_data_collector(params['projects'].length, function(datas) {
        send_data(JSON.stringify(join_json_arrays(datas)), res);
      });
      params['projects'].forEach(function(project) {
        var subdomain = project.split('|')[0],
          api_key = project.split('|')[1],
          project_id = project.split('|')[2];
        mite_client.time_entries(subdomain, api_key, {
          from: params['from'], to: params['to'], project_id: project_id}, data_collector.collector_callback(function(data) {
            var json = JSON.parse(data);
            var time_entries = json.map(function(entry) {return entry['time_entry'];});
            return JSON.stringify(time_entries);
          }));
      });
    } else {
      static("public", req, res);
    };
  };
  
  function create_data_collector(no_of_requests, callback) {
    var datas = [];
    return {
      collector_callback: function(data_mapper) {
        data_mapper = data_mapper || function(data) {return data;};
        return collect_request_data(function(data) {
          datas.push(data_mapper(data));
          if(datas.length == no_of_requests) {
            callback(datas);
          };
        });
      }
    };
  };
  
  function join_json_arrays(json_arrays) {
    return json_arrays.map(function(item) {return JSON.parse(item)}).reduce(function(accumulator, array) {
      for(var i in array) {
        accumulator.push(array[i]);
      };
      return accumulator;
    }, [])
  };
  
  
  function sendJSON(res) {
    return collect_request_data(function(data) {
      send_data(data, res);
    });
  };
  
  function collect_request_data(collected_data_callback) {
    var data = '';
    return function(_data) {
      if(_data) {
        data = data + _data;
      } else {
        collected_data_callback(data);
      };
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