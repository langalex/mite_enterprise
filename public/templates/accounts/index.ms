<div id="new_account" class="stage">
  <h2>Add mite account</h2>
  <form action="#/accounts" method="POST">
    <p>
      <label for="account_subdomain">mite subdomain:</label>
      <input type="text" name="account[subdomain]" id="account_subdomain"/>
      <span class="hint">The subdomain part of http://&lt;subdomain&gt;.mite.yo.lk/</span>
    </p>
    <p>
      <label for="account_api_key">mite API key:</label>
      <input type="text" name="account[api_key]" id="account_api_key"/>
      <span class="hint">You find your API key at http://&lt;subdomain&gt;.mite.yo.lk/myself</span>
    </p>
    <p>
      <input type="submit" value="Add Account"/><br/>
      <span class="hint">We don't store that data on our server, only in your browser.</span>
    </p>
  </form>
</div>

<div id="accounts" class="stage">
  {{#any_accounts}}
    <h2>Accounts</h2>
    <form action="#/projects" method="GET">
      <ul>
        {{#accounts}}
          <li>
            <input type="checkbox" name="accounts[]" value="{{subdomain}}|{{api_key}}" id="account_{{subdomain}}"/>
            <label for="account_{{subdomain}}">{{subdomain}}</label>
            <a href="#/accounts/delete/{{subdomain}}" class="button" onclick="return confirm('Really remove the account?');">remove</a>
          </li>
        {{/accounts}}
      </ul>
      <p><input type="submit" value="Load Projects"></input></p>
    </form>
  {{/any_accounts}}
</div>

<div id="projects" class="stage"></div>

<div id="time_entries" class="stage"></div>