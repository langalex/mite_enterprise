var sys = require('sys'),
  mite_server = require('../../lib/mite_server').mite_server,
  assert = require('assert');
  
(function test_projects() {
  
  var response = stub_response();
  var client = stub_client('projects', ['[{"project":{"name":', '"project1"}}]'], ['[{"project":{"name":', '"project2"}},{"project":{"name":', '"project3"}}]']);
  
  mite_server(client)({url: '/projects?accounts[]=upstream|12345&accounts[]=kriesse|65762'}, response);

  assert.deepEqual(response.data,
    '[{"name":"project1","subdomain":"upstream","api_key":"12345"},{"name":"project2","subdomain":"kriesse","api_key":"65762"},{"name":"project3","subdomain":"kriesse","api_key":"65762"}]');
  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 182);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.deepEqual(client.subdomains, ['upstream', 'kriesse']);
  assert.deepEqual(client.api_keys, ['12345', '65762']);
})();

(function test_time_entries_for_one_project() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time_entry":{"time": "2010-01-01"}}]']);
  
  mite_server(client)({url: '/time_entries?from=2010-01-01&to=2010-03-01&projects%5B%5D=upstream|12345|3'}, response);

  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 23);
  assert.equal(response.data, '[{"time":"2010-01-01"}]');
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.deepEqual(client.subdomains, ['upstream']);
  assert.deepEqual(client.api_keys, ['12345']);
  assert.deepEqual(client.parameters, [{from: '2010-01-01', to: '2010-03-01', project_id: '3'}]);
})();

(function test_time_entries_for_many_projects() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time_entry":{"time":"2010-01-01"}}]'], ['[{"time_entry":{"time":"2010-02-01"}},{"time_entry":{"time":"2010-04-01"}}]']);
  
  mite_server(client)({url: '/time_entries?projects%5B%5D=upstream|abxy|3&projects%5B%5D=kriesse|bnmh|4'}, response);

  assert.equal(response.data, '[{"time":"2010-01-01"},{"time":"2010-02-01"},{"time":"2010-04-01"}]');
  assert.deepEqual(client.parameters.map(function(item) {return item.project_id;}), ['3', '4']);
  assert.deepEqual(client.api_keys, ['abxy', 'bnmh']);
  assert.deepEqual(client.subdomains, ['upstream', 'kriesse']);
})();

(function test_time_entries_csv() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time_entry":{"project_name":"project 1","service_name":"programming 90","minutes":192,"user_name":"Thilo","date_at":"2010-03-09","note":"done work","revenue":28800}}]']);
  
  mite_server(client)({url: '/time_entries.csv?projects%5B%5D=upstream|abxy|3'}, response);

  assert.equal(response.data, 'Project;Service;Minutes;User;Date;Note;Revenue\nproject 1;programming 90;192;Thilo;2010-03-09;done work;28800');
  assert.equal(response.headers["Content-Type"], 'text/csv');
  assert.equal(response.headers["Content-Length"], 108);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
})();


function stub_response() {
  return({
    sendHeader: function(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    write: function(data) {
      this.data = (this.data || '') + data;
    },
    close: function() {
      this.closed = true;
    }
  });
};

function stub_client(function_name) {
  var data = extract_data(arguments);
  var client = {subdomains: [], api_keys: [], parameters: []};
  var i = 0;
  client[function_name] = function(subdomain, api_key, parameters_callback) {
    this.subdomains.push(subdomain);
    this.api_keys.push(api_key);
    this.parameters.push(arguments.length == 4 ? parameters_callback : {});
    var callback = arguments.length == 4 ? arguments[3] : arguments[2];
    for(var j in data[i]) {
      callback(data[i][j]);
    };
    i++;
    callback(null);
  };
  return client;
  
  function extract_data(args) {
    var data = [];
    for(var i in args) {
      if(i > 0) {
        data[i-1] = args[i];
      };
    };
    return data;
  }
};