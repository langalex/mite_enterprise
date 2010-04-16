<h2>Select projects</h2>

<form action="#/time_entries" method="get">
  <input type="hidden" name="api_key" value="{{api_key}}"/>
  <input type="hidden" name="subdomain" value="{{subdomain}}"/>
  
  <ul>
    {{#projects}}
      <li>
        <input type="checkbox" name="projects[]" value="{{id}}"/> {{name}}
      </li>
    {{/projects}}
  </ul>

  <p><input type="submit" value="Load Report"/></p>
</form>