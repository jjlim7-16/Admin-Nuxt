<template>
  <section id="content"  class="column is-four-fifths">

    <b-field grouped>
      <b-field expanded>
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon>
        <span>11:20AM to 11:40AM</span>
      </button>
      </b-field>


      <b-field expanded>
      <b-input placeholder="Search for a queue number"
               type="search"
               icon="magnify"
               rounded>
      </b-input>
      </b-field>
    </b-field>


    <b-table :data="tableDataSimple">

      <template slot-scope="props" >
        <b-table-column field="queue_No" label="Queue No." width="120" >
          {{ props.row.queue_No }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name">
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="kidzos" label="Kidzos">
          {{ props.row.kidzos }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered>
          {{ props.row.time_in }}
        </b-table-column>

        <b-table-column field="status" label="Status">
          {{ props.row.status }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
  export default{
    data() {
      const tableDataSimple = [
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1001, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '-', 'status': 'Pending' },
        { 'queue_No': 1002, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:20AM', 'status': 'Confirmed' },
        { 'queue_No': 1002, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:20AM', 'status': 'Confirmed' },
        { 'queue_No': 1002, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:20AM', 'status': 'Confirmed' },
        { 'queue_No': 1002, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:20AM', 'status': 'Confirmed' },
        { 'queue_No': 1002, 'role_name': 'Cabin Crew', 'kidzos': 10, 'time_in': '11:20AM', 'status': 'Confirmed' },
      ]
      return {
        tableDataSimple,
      }
    }
  }
</script>

<style>
  #content {
    margin: 25px 60px 25px 70px;
  }
</style>
