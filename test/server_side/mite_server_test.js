var sys = require('sys'),
  mite_server = require('../../lib/mite_server').mite_server,
  assert = require('assert');
  
(function test_projects() {
  
  var response = stub_response();
  var client = stub_client('projects', ['[{"name":', ' "project1"}]']);
  
  mite_server(client)({url: '/projects?api_key=12345&subdomain=upstream'}, response);

  assert.equal(response.data, '[{"name": "project1"}]');
  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 22);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.equal(client.subdomain, 'upstream');
  assert.equal(client.api_key, '12345');
})();

(function test_time_entries_for_one_project() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time": "2010-01-01"}]']);
  
  mite_server(client)({url: '/time_entries?api_key=12345&subdomain=upstream&from=2010-01-01&to=2010-03-01&project_ids%5B%5D=3'}, response);

  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 23);
  assert.equal(response.data, '[{"time":"2010-01-01"}]');
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.equal(client.subdomain, 'upstream');
  assert.equal(client.api_key, '12345');
  assert.deepEqual(client.parameters, [{from: '2010-01-01', to: '2010-03-01', project_id: '3'}]);
})();

(function test_time_entries_for_many_projects() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time":"2010-01-01"}]'], ['[{"time":"2010-02-01"}]']);
  
  mite_server(client)({url: '/time_entries?api_key=12345&subdomain=upstream&project_ids%5B%5D=3&project_ids%5B%5D=4'}, response);

  assert.equal(response.data, '[{"time":"2010-01-01"},{"time":"2010-02-01"}]');
  assert.deepEqual(client.parameters.map(function(item) {return item.project_id}), ['3', '4']);
  
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
  })
};

function stub_client(function_name) {
  var data = extract_data(arguments);
  var client = {};
  var i = 0;
  client[function_name] = function(subdomain, api_key, parameters_callback) {
    this.subdomain = subdomain;
    this.api_key = api_key;
    this.parameters = (this.parameters || []);
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