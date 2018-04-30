<template>
<div>

  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
      <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
    </a>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
    </div>
  </nav>

  <section class="container is-centered" id="mySection">

    <form class="container is-centered">
      <b-field label="Name">
        <b-input placeholder="Name of station" v-model="name"></b-input>
      </b-field>

      <b-field label="Description" >
        <b-input type="textarea" v-model="description">
        </b-input>
      </b-field>

      <b-field label="Number of roles" >
        <b-input type="number" min="1" max="5" v-model="noRoles"></b-input>
      </b-field>

      <b-field label="Number of participants" >
        <b-input type="number" min="0" max="20" v-model="noParticipants"></b-input>
      </b-field>

      <b-field label="Number of sessions" >
        <b-input type="number" min="0" max="36" v-model="sessions"></b-input>
      </b-field>

      <b-field label="Number of reserved slots" >
        <b-input type="number" min="0" max="10" v-model="noRSlots"></b-input>
      </b-field>

      <div class="columns">

        <b-field label="Start Time" class="column">
          <b-timepicker hour-format="12" :increment-minutes="5" v-model="sTime"></b-timepicker>
        </b-field>

        <b-field label="End Time" class="column">
          <b-timepicker hour-format="12" :increment-minutes="5" v-model="eTime"></b-timepicker>
        </b-field>

      </div>

      <a class="button is-success is-flex" v-on:click="submit">ADD</a>

    </form>

    <b-table :bordered="true" :mobile-cards="true" id="myTable">

      <b-table-column label="ID" width="40" numeric>
      </b-table-column>

      <b-table-column label="First Name">
      </b-table-column>

      <b-table-column label="Last Name">
      </b-table-column>

      <b-table-column label="Date" centered>
      </b-table-column>

      <b-table-column label="Gender">
      </b-table-column>

    </b-table>

  </section>
</div>
</template>

<script>
import axios from 'axios';
function WebFormData(name, description, noRoles, noParticipants, sessions, noRSlots, sTime, eTime) {
    this.name = name,
    this.description = description,
    this.noRoles = noRoles,
    this.noParticipants = noParticipants,
    this.sessions = sessions,
    this.noRSlots = noRSlots,
    this.sTime = sTime,
    this.eTime = eTime
}
export default {
  components: {},
  data() {
    return {
      name: '',
      description: '',
      noRoles: '0',
      noParticipants: '0',
      sessions: '0',
      noRSlots: '0',
      sTime: new Date(),
      eTime: new Date()
    }
  },
  methods: {
    submit(event) {
      //Currently give false time. Install moment into project at a later time
      let webFormData = new WebFormData(this.name, this.description, this.noRoles, this.noParticipants,
        this.sessions, this.noRSlots, 670, 880);
      console.dir(webFormData);
      let webFormDataInString = JSON.stringify(webFormData);
      axios.post('http://localhost:8080/stations/', {
        body: this.webFormDataInString
      })
      .then(response => {
        console.dir(response.data)
      })
      .catch(e => {
        console.dir(e)
      })
    }
  }
}
</script>

<style>
#mySection {
  padding-top: 3rem;
}

form {
  padding: 1rem;
  background-color: hsl(0, 0%, 96%)
}

#myTable {
  padding-top: 1rem;
}
</style>
