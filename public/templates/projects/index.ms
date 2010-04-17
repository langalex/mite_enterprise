<h2>Select projects</h2>

<form action="#/time_entries" method="get">
  <input type="hidden" name="api_key" value="{{api_key}}"/>
  <input type="hidden" name="subdomain" value="{{subdomain}}"/>
  
  <ul>
    {{#projects}}
      <li>
        <input type="checkbox" name="project_ids[]" value="{{id}}" id="project_{{id}}"/>
        <label for="project_{{id}}">{{name}}</label>
      </li>
    {{/projects}}
  </ul>
  
  <fieldset>
    <legend>Select date range (yyyy-mm-dd)</legend>
    <p>
      <label for="from">From:</label>
      <input type="text" class="datepicker" name="from" id="from"/>
    </p>

    <p>
      <label for="to">To:</label>
      <input type="text" class="datepicker" name="to" id="from"/>
    </p>
    <p>You have to fill out both or none.</p>
  </fieldset>

  <p><input type="submit" value="Load Report"/></p>
</form>