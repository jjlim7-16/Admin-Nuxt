<template>
  <section id="fullScreen">
    <img src="img-whitelogo.png" alt="logo" />
    <div id="form" class="columns is-centered section" @keyup.enter="login()">
      <div class="box column is-5">
        <b-field :type="errors.has('username') ? 'is-danger': ''"
        :message="errors.has('username') ? errors.first('username') : ''">
          <b-input placeholder='Username' v-model='username' name='username' data-vv-as="'Username'"
          v-validate="'required|alpha_dash'"></b-input>
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
import Cookie from 'js-cookie'
import config from '~/config'

export default {
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
				let res = await this.$axios.post(`http://${config.serverURL}/auth/login`, {
					username: this.username,
					password: this.password
				})
				if (res.status === 200) {
					const auth = res.data
					this.$store.commit('update', auth)
          Cookie.set('auth', auth)
          this.$axios.setToken(auth.token, 'Bearer')
					if (auth.user.account_type === 'Admin') {
						this.$router.push('/Admin/Dashboard')
					}
					if (auth.user.account_type === 'Crew') {
						this.$router.push(`/Crew/${auth.user.station_id}`)
					}
				}
			} catch (err) {
				this.$dialog.alert({
					title: `Login Failed`,
					message: err.response.data.message,
					type: 'is-danger',
					hasIcon: true,
					iconPack: 'mdi'
				})
			}
    }
  },
  beforeMount() {
    if (this.$store.state.loggedIn === true) {
      console.log('Is Logged In')
      const user = this.$store.state.user
      if (user.account_type === 'Admin') {
        this.$router.push('/Admin/Dashboard')
      }
      else {
        this.$router.push('/Crew/')
      }
    }
  }
}
</script>

<style scoped>
#fullScreen {
  background-color: #FF4C65;
  height: 100vh;
  width: 100vw;
}

img {
  display: block;
  margin: auto;
  padding-top: 5%;
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
