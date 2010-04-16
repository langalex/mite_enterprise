exports.MiteHelpers = {
  time_entries_view: function(time_entries) {
    return time_entries.map(function(_entry) {
      var entry = _entry['time_entry'];
      return {
        service_name: entry['service_name'] || '-',
        date_at: entry['date_at'],
        note: entry['note'],
        duration: Math.floor(entry['minutes'] / 60) + ':' + entry['minutes'] % 60,
        user_name: entry['user_name'],
        revenue: (entry['revenue'] || 0) / 100.0
      };
    });
  }
};