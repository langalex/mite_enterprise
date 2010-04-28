var app = $.sammy('#app', function() {
  this.use(Sammy.Mustache, 'ms');
  this.use(Sammy.NestedParams);
  this.helpers(exports.MiteHelpers);
  this.store = new Sammy.Store({name: 'data', type: ['local', 'cookie']});
  
  this.get('#/', function(context) {
    context.redirect('#/accounts');
  });
  
  this.get('#/accounts', function(context) {
    load_accounts(context);
  });
  
  this.post('#/accounts', function(context) {
    var accounts = app.store.get('accounts') || [];
    var account = context.params['account'];
    accounts.push(account);
    app.store.set('accounts', accounts);
    
    context.redirect('#/');
  });
  
  this.get('#/accounts/delete/:subdomain', function(context) {
    var accounts = app.store.get('accounts') || [];
    accounts = remove_account(accounts, context.params['subdomain']);
    app.store.set('accounts', accounts);
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
    if($('#projects').get().length == 0) {
      load_accounts(context, load_projects);
    } else {
      load_projects(context);
    };
  });
  
  this.get('#/time_entries', function(context) {
    if($('#projects').get().length == 0) {
      load_accounts(context, function() {
        context.params['accounts'] = context.params['projects'].map(function(project) {
          var parts = project.split('|');
          return [parts[0], parts[1]].join('|');
        });
        load_projects(context, load_time_entries);
      });
    } else {
      load_time_entries(context);
    };
    
    function load_time_entries(context) {
      var params = {projects: context.params['projects'],
          from: context.params['from'], to: context.params['to']};
      if(context.params['projects']) {
        $.get('/time_entries', params, function(time_entries) {
            context.query = jQuery.param(params);
            context.time_entries = context.time_entries_view(time_entries);
            context.partial('templates/time_entries/index.ms', function(html) {
              $('#time_entries').html(html);
            });
        });
      } else {
        context.flash('You did not choose any projects.');
      }
    };
  });
  
  function load_accounts(context, after_callback) {
    context.accounts = app.store.get('accounts') || [];
    context.any_accounts = context.accounts.length > 0;
    context.partial('templates/accounts/index.ms', function(html) {
      $(context.app.element_selector).html(html);
      if(after_callback) {
        after_callback(context);
      };
    });
  };
  
  function load_projects(context, after_callback) {
    if(context.params['accounts']) {
      $.get('/projects', {accounts: context.params['accounts']},
        function(projects) {
          context.projects = projects.map(function(project) {
            return {id: project['id'], api_key: project['api_key'],
              subdomain: project['subdomain'], name: project['name']};
          });
          context.partial('templates/projects/index.ms', function(html) {
            $('#projects').html(html);
            if(after_callback) {
              after_callback(context);
            }
          });
        }
      );
    } else {
      context.flash('You did not choose any accounts.');
    };
  };
  
  
});

$(function() {
  app.run('#/');
});