<h2>Select projects</h2>

<form action="#/time_entries" method="get">
  <ul>
    {{#projects}}
      <li>
        <input type="checkbox" name="projects[]" value="{{subdomain}}|{{api_key}}|{{id}}" id="project_{{id}}"/>
        <label for="project_{{id}}">{{name}} ({{subdomain}})</label>
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