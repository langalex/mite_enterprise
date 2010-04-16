var static = require("../vendor/static/static").static,
  sys = require("sys");

exports.mite_server = function(req, res) {
  var path = req.url;
  sys.debug(path);
  if(path.match(/^\/projects(\?.+)?/)) {
    var data = '[{"name": "achilles", "id": "1"}, {"name": "cinexe", "id": "2"}]';
    sendJSON(data, res);
  } else if(path.match(/^\/time_entries(\?.+)?/)) {
    var data = '[{"description": "coded stuff", "time": "2010-04-16 12:21:04", "duration": "3:56", "user": "Joe Doe", "amount": "330 EUR"}]';
    sendJSON(data, res);
  } else {
    static("public", req, res);
  };
  
  function sendJSON(data, response) {
    response.sendHeader(200, {"Content-Type": 'application/json', "Content-Length": data.length });
    response.write(data);
    response.close();
  }
  
};