var sys = require('sys');

exports.actions = function(mite_client) {
  return {
    '/projects': function(params, res) {
      var data_collector = create_data_collector(params['accounts'].length, function(datas) {
        send_json(JSON.stringify(join_json_arrays(datas)), res);
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
    
    },
    '/time_entries': function(params, res) {
      var data_collector = create_data_collector(params['projects'].length, function(datas) {
        send_json(JSON.stringify(join_json_arrays(datas)), res);
      });
      collect_time_entries(params, data_collector);
    },
    '/time_entries.csv': function(params, res) {
      var data_collector = create_data_collector(params['projects'].length, function(datas) {
        var entries = join_json_arrays(datas);
        var data = 'Project;Service;Minutes;User;Date;Note;Revenue\n' + entries.map(function(e) {
          return [e['project_name'], e['service_name'], e['minutes'], e['user_name'], e['date_at'], e['note'], e['revenue']].join(';');
        }).join('\n');
        res.sendHeader(200, {"Content-Type": 'text/csv', "Content-Length": data.length });
        res.write(data);
        res.close();
      });
      collect_time_entries(params, data_collector);
    }
  }
  
  function collect_time_entries(params, data_collector) {
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
  }
  
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
  
  function join_json_arrays(json_arrays) {
    return json_arrays.map(function(item) {return JSON.parse(item)}).reduce(function(accumulator, array) {
      for(var i in array) {
        accumulator.push(array[i]);
      };
      return accumulator;
    }, [])
  };
  
  function send_json(data, res) {
    res.sendHeader(200, {"Content-Type": 'application/json', "Content-Length": data.length });
    res.write(data);
    res.close();
  };
  
  
};