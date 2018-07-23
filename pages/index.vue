<template>
  <section>
    <img src="img-whitelogo.png" alt="logo" />
    <div id="form" class="columns is-centered section">
      <div class="box column is-5">
        <b-field :type="errors.has('username') ? 'is-danger': ''"
        :message="errors.has('username') ? errors.first('username') : ''">
          <b-input placeholder='Username' v-model='username' name='username' data-vv-as="'Username'"
          v-validate="'required|alpha'"></b-input>
        </b-field>

        <b-field :type="errors.has('password') ? 'is-danger': ''"
        :message="errors.has('password') ? errors.first('password') : ''">
          <b-input type='password' placeholder='Password' v-model='password' name='password' data-vv-as="'Password'"
          v-validate="'required'"></b-input>
        </b-field>

        <button class="button" @click="login()">Login</button>
      </div>
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
        this.$router.push('/Crew/')
      }
    }
  },
}
</script>

<style scoped>

img {
  display: block;
  margin: auto;
  margin-top: 5%;
  position: relative;
  width: 18%;
  height: auto;
}

#form {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.box {
  background-color: #F9F9F9;
  padding: 25px;
}

.field {
  margin-top: 20px;
}

.button {
  width: 100%;
  background-color: #FF4C65;
  color: white;
  font-weight: bold;
  margin: 15px 0;
}

</style>
