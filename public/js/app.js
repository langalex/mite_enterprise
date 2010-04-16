var app = $.sammy('#app', function() {
  this.use(Sammy.Mustache, 'ms');
  this.use(Sammy.NestedParams);
  
  this.get('#/', function() {
    this.partial('templates/projects/new.ms')
  });
  
  this.get('#/projects', function(context) {
    $.get('/projects', {api_key: context.params['api_key'], subdomain: context.params['subdomain']},
      function(projects) {
        context.projects = projects;
        context.api_key = context.params['api_key'];
        context.subdomain = context.params['subdomain'];
        context.partial('templates/projects/index.ms', function(html) {
          $('#projects').html(html);
        });
      }
    )
  });
  
  this.get('#/time_entries', function(context) {
    $.get('/time_entries', {projects: context.params['projects'], api_key: context.params['api_key'],
      subdmain: context.params['api_key']}, function(time_entries) {
        context.time_entries = time_entries;
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