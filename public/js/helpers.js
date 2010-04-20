exports.MiteHelpers = {
  time_entries_view: function(time_entries) {
    return time_entries.map(function(entry) {
      var note = entry['note'] + '';
      return {
        service_name: entry['service_name'] || '-',
        date_at: entry['date_at'],
        note: entry['note'],
        note_truncated: note.substr(0, 30) + (note.length > 30 ? '...' : ''),
        duration: Math.floor(entry['minutes'] / 60) + ':' + (entry['minutes'] % 60).toString().replace(/^(\d)$/, function(match) {return "0" + match;}),
        user_name: entry['user_name'],
        revenue: ((entry['revenue'] || 0) / 100.0).toFixed(2),
        project_name: entry['project_name']
      };
    });
  },

  flash: function(message) {
    $('#flash').text(message).show().delay(2000).fadeOut('slow');
  }
};