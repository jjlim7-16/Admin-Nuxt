<template>
  <section id="content" class="box">
    <b>Username*</b>
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


    <button class="button is-danger">Submit</button>
  </section>
</template>

<script>
    export default {
      name: "add.vue",
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
