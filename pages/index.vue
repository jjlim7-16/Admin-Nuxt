<template>
	<section id="form" class="columns is-centered section">
    <div class="box column is-5 is-narrow">
      <b-field label='Username' :type="errors.has('username') ? 'is-danger': ''" 
        :message="errors.has('username') ? errors.first('username') : ''">
        <b-input placeholder='Username' v-model='username' name='username' data-vv-as="'Username'"
        v-validate="'required|alpha'"></b-input>
      </b-field>

      <b-field label='Password' :type="errors.has('password') ? 'is-danger': ''" 
        :message="errors.has('password') ? errors.first('password') : ''">
        <b-input type='password' placeholder='Password' v-model='password' name='password' data-vv-as="'Password'"
        v-validate="'required'"></b-input>
      </b-field>

      <button class="button is-success" @click="login()">Login</button>
    </div>
  </section>
</template>

<script>
// import Cookie from 'js-cookie'

export default {
  middleware: 'auth',
  layout: 'fullscreen',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // async login() {
    //   await this.$store.dispatch("api/auth/login", {
    //     username: this.username,
    //     password: this.password
    //   })
    //   .then(result => {
    //     console.log("result", result)
    //     this.$router.push({ path: '/Admin' })
    //   })
    //   .catch(error => {
    //     this.loading = false
    //     if (error.response && error.response.data) {
    //       // this.alert = {
    //       //   type: "error",
    //       //   message: error.response.data.message || error.response.status
    //       // }
    //     }
    //   })
    // }
    async login() {
      this.error = null
      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>

<style scoped>
/* #form {
  max-width: 45%;
  margin-top: 10%;
} */

.is-vertical-center {
  display: flex;
  align-items: center;
}
</style>
