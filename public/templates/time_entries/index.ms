<h2>Time Entries</h2>
<p>Download as <a href="/time_entries.csv?{{query}}">CSV</a></p>

<table>
  <thead>
    <tr>
      <th>Time</th>
      <th>Note</th>
      <th>Duration</th>
      <th>Revenue</th>
      <th>User</th>
      <th>Project</th>
      <th>Service</th>
    </tr>
  </thead>
  <tbody>
  {{#time_entries}}
    <tr>
      <td>{{date_at}}</td>
      <td title="{{note}}">{{note_truncated}}</td>
      <td class="number">{{duration}}</td>
      <td class="number">{{revenue}}</td>
      <td>{{user_name}}</td>
      <td>{{project_name}}</td>
      <td>{{service_name}}</td>
    </tr>
  {{/time_entries}}
  </tbody>
</table>