<template>
	<div id="form" class="box container">
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

    <br/>
    <button class="button is-success" @click="login()">Login</button>
  </div>
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
      try {
        console.log('Login...')
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        if (this.$auth.loggedIn) {
          console.log('Logged In')
          console.log(this.$auth.user_type)
          if (this.$auth.user.user_type === 'Admin') {
            this.$router.push('/Admin/Stations')
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  beforeMount() {
    if (this.$auth.loggedIn) {
      console.log('Is Logged In')
      const user = this.$auth.user
      if (user.user_type === 'Admin') {
        this.$router.push('/Admin/Stations')
      }
      else {
        this.$router.push('/Crew/' + user.station)
      }
    }
  },
}
</script>
