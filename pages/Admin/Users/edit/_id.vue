<template>
  <section id="content" class="box">
    <b>Username*</b>
    <b-field width="410px">
      <b-input type="name"  maxlength="30"></b-input>
    </b-field>


    <b>Station Name</b>
    <b-field>
      <b-select placeholder="Select a station" >
        <option value="1">ALL</option>
        <option value="2">Aviation Academy</option>
        <option value="3">Pizza Hut</option>
        <option value="4">Fireman</option>
      </b-select>
    </b-field>

    <b>Password*</b>
    <b-field>
      <b-input type="password"  maxlength="30"  password-reveal></b-input>
      <p class="control" >
        <button  class="button is-primary">Generate</button>
      </p>
    </b-field>


    <b>Roles</b>
    <b-field>
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
    </b-field>


    <button class="button is-danger">Submit</button>
  </section>
</template>

<script>
  export default {
    name: "edit.vue",
    data(){
      return{
        radio:"Admin"
      }
    }
  }
</script>

<style scoped>
  #content {
    margin: 15px;
  }
</style>
