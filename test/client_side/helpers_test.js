var helpers = require('../../public/js/helpers').MiteHelpers,
  assert = require('assert');

assert.equal('-', helpers.time_entries_view([{}])[0].service_name);
assert.equal('programming', helpers.time_entries_view([{service_name: 'programming'}])[0].service_name);

assert.equal('2010-01-01', helpers.time_entries_view([{date_at: '2010-01-01'}])[0].date_at);
assert.equal('1:23', helpers.time_entries_view([{minutes: 83}])[0].duration);
assert.equal('joe', helpers.time_entries_view([{user_name: 'joe'}])[0].user_name);
assert.equal('world domination', helpers.time_entries_view([{project_name: 'world domination'}])[0].project_name);

assert.equal('10.50', helpers.time_entries_view([{revenue: 1050}])[0].revenue);
assert.equal('0', helpers.time_entries_view([{}])[0].revenue);

assert.equal('worked', helpers.time_entries_view([{note: 'worked'}])[0].note);
assert.equal('', helpers.time_entries_view([{note: ''}])[0].note_truncated);
assert.equal('worked', helpers.time_entries_view([{note: 'worked'}])[0].note_truncated);
assert.equal('i did a lot of work on this pr...', helpers.time_entries_view([{note: 'i did a lot of work on this project that i can tell ya' }])[0].note_truncated);