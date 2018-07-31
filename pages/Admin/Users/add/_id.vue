<template>
  <section id="content" class="box">

    <b-field label='Username *'>
      <b-input expanded placeholder='Enter Username' maxlength="30" rounded></b-input>
    </b-field>

    <b-field label='Station Name'>
      <b-select expanded placeholder='Select Station' rounded>
        <option value="1">All</option>
        <option value="2">Aviation Academy</option>
        <option value="3">Pizza Hut</option>
        <option value="4">Fireman</option>
      </b-select>
    </b-field>

    <b-field label="Password">
        <b-input expanded type="password" maxlength="30" password-reveal rounded></b-input>
    </b-field>

    <b-field label="User Role">
      <div class="block">
        <b-radio v-model="radio"native-value="Super Admin" disabled>Super Admin</b-radio>
        <b-radio v-model="radio"native-value="Admin">Admin</b-radio>
        <b-radio v-model="radio"native-value="Crew">Crew</b-radio>
      </div>
    </b-field>

    <br />

    <!-- Add User button -->
    <button id="addUserBtn" class="button is-success" disabled>Add User</button>


    <!-- <b>Username *</b>
    <b-field>
      <b-input  maxlength="30" rounded></b-input>
    </b-field>

    <b>Station Name</b>
    <b-field>
      <b-select placeholder="Select a station"  rounded>
        <option value="1">ALL</option>
        <option value="2">Aviation Academy</option>
        <option value="3">Pizza Hut</option>
        <option value="4">Fireman</option>
      </b-select>
    </b-field>

    <b>Password*</b>
    <b-field>
      <b-input type="password"  maxlength="30" rounded password-reveal></b-input>
      <p class="control" >
        <button type="is-rounded" class="button is-primary">Generate</button>
      </p>
    </b-field>

    <b>Roles</b>
    <div class="block">
      <b-radio v-model="radio"
               native-value="Super Admin">
        Super Admin
      </b-radio>
      <b-radio v-model="radio"
               native-value="Admin">
        Admin
      </b-radio>
      <b-radio v-model="radio"
               native-value="Crew">
        Crew
      </b-radio>
    </div>

    <button class="button is-danger">Submit</button> -->
    
  </section>
</template>

<script>
import config from '~/config.js'

export default {
  name: "add.vue",
  data() {
		return {
			radio:"Admin"
    }
	},
	beforeCreate() {
		this.$store.commit('setPageTitle', 'Add User')
	}
}
</script>
