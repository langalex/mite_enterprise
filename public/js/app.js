var app = $.sammy('#app', function() {
  this.use(Sammy.Mustache, 'ms');
  this.use(Sammy.NestedParams);
  this.helpers(exports.MiteHelpers);
  
  this.get('#/', function() {
    this.partial('templates/projects/new.ms')
  });
  
  this.get('#/projects', function(context) {
    $.get('/projects', {api_key: context.params['api_key'], subdomain: context.params['subdomain']},
      function(projects) {
        context.projects = projects.map(function(item) {return(item['project'])});
        context.api_key = context.params['api_key'];
        context.subdomain = context.params['subdomain'];
        context.partial('templates/projects/index.ms', function(html) {
          $('#projects').html(html);
        });
      }
    )
  });
  
  this.get('#/time_entries', function(context) {
    var that = this;
    $.get('/time_entries', {api_key: context.params['api_key'],
      subdomain: context.params['subdomain'], project_id: context.params['project_id'],
        from: context.params['from'], to: context.params['to']}, function(time_entries) {
        context.time_entries = that.time_entries_view(time_entries);
        context.partial('templates/time_entries/index.ms', function(html) {
          $('#time_entries').html(html);
        });
      }
    );
  });
  
  
});

$(function() {
  app.run('#/');
});