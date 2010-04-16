<h2>Time Entries</h2>

<table>
  <thead>
    <tr>
      <th>Time</th>
      <th>Description</th>
      <th>Duration</th>
      <th>Amount</th>
      <th>User</th>
    </tr>
  </thead>
  <tbody>
  {{#time_entries}}
    <tr>
      <td>{{time}}</td>
      <td>{{description}}</td>
      <td>{{duration}}</td>
      <td>{{amount}}</td>
      <td>{{user}}</td>
    </tr>
  {{/time_entries}}
  </tbody>
</table>