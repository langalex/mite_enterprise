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

(function test_time_entries() {
  var response = stub_response();
  var client = stub_client('time_entries', ['[{"time": "2010-01-01"}]']);
  
  mite_server(client)({url: '/time_entries?api_key=12345&subdomain=upstream&from=2010-01-01&to=2010-03-01&project_id=3'}, response);

  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 24);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.equal(client.subdomain, 'upstream');
  assert.equal(client.api_key, '12345');
  assert.deepEqual(client.parameters, {from: '2010-01-01', to: '2010-03-01', project_id: '3'})
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

function stub_client(function_name, data) {
  var client = {};
  client[function_name] = function(subdomain, api_key, parameters_callback) {
    this.subdomain = subdomain;
    this.api_key = api_key;
    this.parameters = arguments.length == 4 ? parameters_callback : {};
    var callback = arguments.length == 4 ? arguments[3] : arguments[2];
    for(var i in data) {
      callback(data[i]);
    };
    callback(null);
  };
  return client;
};