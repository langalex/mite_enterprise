<h2>Time Entries</h2>

<table>
  <thead>
    <tr>
      <th>Time</th>
      <th>Note</th>
      <th>Duration</th>
      <th>Revenue</th>
      <th>User</th>
      <th>Service</th>
    </tr>
  </thead>
  <tbody>
  {{#time_entries}}
    <tr>
      <td>{{date_at}}</td>
      <td>{{note}}</td>
      <td>{{duration}}</td>
      <td>{{revenue}}</td>
      <td>{{user_name}}</td>
      <td>{{service_name}}</td>
    </tr>
  {{/time_entries}}
  </tbody>
</table>