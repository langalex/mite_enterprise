var sys = require("sys"), 
  http = require("http"),
  mite_server = require('./mite_server').mite_server,
  port = 3000;

sys.puts("* mite.enterprise running on http://0.0.0.0:" + port);

http.createServer(mite_server).listen(port);


