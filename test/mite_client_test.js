var assert = require('assert'),
  mite_client = require('../lib/mite_client').mite_client;

(function test_projects() {
  var http_arguments = {};
  var data = [], http = stub_http_client('[{"name": "project1"}]');


  var client = mite_client(http);
  client.projects('upstream', '7654', function(_data) {
    data.push(_data);
  });

  assert.deepEqual(data, ['[{"name": "project1"}]', null])
  assert.equal(http_arguments.port, 80);
  assert.equal(http_arguments.host, 'upstream.mite.yo.lk');
  assert.equal(http_arguments.path, '/projects.json?api_key=7654');
  assert.deepEqual(http_arguments.headers, {"Host": 'upstream.mite.yo.lk'});
  assert.ok(http_arguments.closed);
  
  function stub_http_client(data) {
    return {
      createClient: function(port, host) {
        http_arguments.host = host;
        http_arguments.port = port;
        return {
          request: function(path, headers) {
            http_arguments.path = path;
            http_arguments.headers = headers;
            return {
              addListener: function(type, callback) {
                callback({
                  statusCode: '200',
                  setBodyEncoding: function() {},
                  addListener: function(type, callback) {
                    callback(data);
                  }
                });
              },
              close: function() {
                http_arguments.closed = true;
              }
            };
          }
        };
      }
    };
  }
})();

