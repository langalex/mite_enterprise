var app = $.sammy('#app', function() {
  this.use(Sammy.Mustache, 'ms');
  this.use(Sammy.NestedParams);
  this.helpers(exports.MiteHelpers);
  
  this.get('#/', function(context) {
    context.redirect('#/accounts');
  });
  
  this.get('#/accounts', function(context) {
    context.accounts = $.jStorage.get('accounts', []);
    context.any_accounts = context.accounts.length > 0;
    context.partial('templates/accounts/index.ms');
  });
  
  this.post('#/accounts', function(context) {
    var accounts = $.jStorage.get('accounts', []);
    var account = context.params['account'];
    accounts.push(account);
    $.jStorage.set('accounts', accounts);
    
    context.redirect('#/');
  });
  
  this.get('#/projects', function(context) {
    var subdomain = context.params['account'].split('|')[0];
    var api_key = context.params['account'].split('|')[1];
    $.get('/projects', {api_key: api_key, subdomain: subdomain},
      function(projects) {
        context.projects = projects.map(function(item) {return(item['project'])});
        context.api_key = api_key;
        context.subdomain = subdomain;
        context.partial('templates/projects/index.ms', function(html) {
          $('#projects').html(html);
        });
      }
    )
  });
  
  this.get('#/time_entries', function(context) {
    var that = this;
    $.get('/time_entries', {api_key: context.params['api_key'],
      subdomain: context.params['subdomain'], project_ids: context.params['project_ids'],
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