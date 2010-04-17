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
  
  this.get('#/accounts/delete/:subdomain', function(context) {
    var accounts = $.jStorage.get('accounts', []);
    accounts = remove_account(accounts, context.params['subdomain']);
    $.jStorage.set('accounts', accounts);
    context.redirect('#/accounts');
    
    function remove_account(accounts, subdomain) {
      var new_accounts = [];
      for(var i in accounts) {
        if(accounts[i]['subdomain'] != subdomain) {
          new_accounts.push(accounts[i]);
        };
      };
      return new_accounts;
    };
  });
  
  this.get('#/projects', function(context) {
    $.get('/projects', {accounts: context.params['accounts']},
      function(projects) {
        context.projects = projects.map(function(project) {
          return {id: project['id'], api_key: project['api_key'],
            subdomain: project['subdomain'], name: project['name']};
        });
        context.partial('templates/projects/index.ms', function(html) {
          $('#projects').html(html);
        });
      }
    );
  });
  
  this.get('#/time_entries', function(context) {
    $.get('/time_entries', {projects: context.params['projects'],
        from: context.params['from'], to: context.params['to']}, function(time_entries) {
        context.time_entries = context.time_entries_view(time_entries);
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