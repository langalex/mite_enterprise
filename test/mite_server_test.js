var sys = require('sys'),
  mite_server = require('../lib/mite_server').mite_server,
  assert = require('assert');
  
(function test_projects() {
  
  var response = stub_response();
  mite_server({url: '/projects'}, response);

  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 64);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
})();

(function test_time_entries() {
  var response = stub_response();
  mite_server({url: '/time_entries'}, response);

  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 123);
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
  })
};