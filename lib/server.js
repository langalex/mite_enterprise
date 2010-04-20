var sys = require("sys"), 
  http = require("http"),
  mite_server = require('./mite_server').mite_server,
  mite_client = require('./mite_client').mite_client,
  port = 3000,
  host = '127.0.0.1';

process.addListener('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
});

sys.puts("* mite.enterprise running on http://" + host + ":" + port);

http.createServer(mite_server(mite_client(http))).listen(port, host);


