var sys = require('sys'),
  fs = require('fs');

try {
  runTests('.');
  sys.puts('\033[1;32mALL GREEN\033[m');
} catch(e) {
  sys.puts('\033[0;31mERRORS\033[m');
  throw(e);
}



function runTests(dir) {
  fs.readdirSync(dir).forEach(function(file) {
    var path = dir + '/' + file;
    if(fs.statSync(path).isFile() && file != 'all.js') {
      sys.puts('** running tests in ' + path);
      require(path.replace('.js', ''));
    } else if(fs.statSync(path).isDirectory()) {
      runTests(path);
    }
  });
};
