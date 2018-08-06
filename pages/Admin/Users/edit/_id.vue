<template>
  <section id="content" class="box columns is-multiline">
    <div class="column is-7">
      <b-field label='Roles*'>
        <div class="block">
          <b-radio v-model="account_type" native-value="Admin" disabled>Admin</b-radio>
          <b-radio v-model="account_type" native-value="Crew" disabled>Crew</b-radio>
        </div>
      </b-field>

      <b-field label='Station Name*' v-show="account_type === 'Crew'">
        <b-select placeholder="Select a station"  v-model="account_type_id" disabled>
          <option v-for="crewAccountType in crewAccountTypeList"
                  :value="crewAccountType.account_type_id"
                  :key="crewAccountType.account_type_id">
            {{crewAccountType.station_name}}
          </option>
        </b-select>
      </b-field>

      <b-field label='Username*' :type="errors.has('username') ? 'is-danger': ''"
        :message="errors.has('username') ? errors.first('username') : ''">
        <b-input placeholder='Enter Username' v-model="username" name="username" data-vv-as="'username'"
          v-validate="'required|alpha_spaces'" rounded></b-input>
      </b-field>

      <b-field label='Password*' :type="errors.has('password') ? 'is-danger': ''"
        :message="errors.has('password') ? errors.first('password') : ''">
        <b-input placeholder='Enter Password' type="password" v-model="password" name="password"
        v-validate="'required'" password-reveal rounded></b-input>
      </b-field>

      <!-- <b-field label='Confirm Password*' :type="errors.has('password_confirmation') ? 'is-danger': ''"
        :message="errors.has('password_confirmation') ? errors.first('password_confirmation') : ''">
        <b-input placeholder='Enter Password' v-model="password_confirmation" name="password_confirmation" type="password"
        v-validate="'required'"></b-input>
      </b-field> -->

      <br/>
      <button class="button is-success is-pulled-right" @click="submit()">Save Changes</button>
      <router-link to="/Admin/Users/" class="button is-light right-spaced is-pulled-right">Cancel</router-link>
    </div>
  </section>
</template>

<script>
import config from '~/config.js'
import DataModel from '~/models/dataModel.js'

export default {

  data(){
    return{
      crewAccountTypeList: [],
      username: '',
      password:'',
      password_confirmation: '',
      account_type:'Admin',
      stationId:'',
      account_type_id:'',
      userList: null
    }
  },
  async beforeMount() {
    this.$store.commit('setPageTitle', 'Edit User')
    try {
      let res = await this.$axios.get(`http://${config.serverURL}/user/${this.$route.params['id']}`)
      this.crewAccountTypeList.station_name = res.data[1]
      this.userList = res.data[0]
      this.username = this.userList.username
      this.account_type_id = this.userList.account_type_id
      this.account_type = this.userList.account_type
      this.stationId = this.userList.station_id

      res = await this.$axios.get(`http://${config.serverURL}/user/getAccountTypeCrewList/`)
      this.crewAccountTypeList= res.data
      for (var i in this.data){
        if (this.data[i].account_type != 'Admin') {
          for (var a in this.crewAccountTypeList) {
            if (this.crewAccountTypeList[a].account_type==this.data[i]) {
              this.data[i].station_name = this.crewAccountTypeList[a].station_name
            }
          }
        } else {
          this.data[i].station_name = "NULL"
        }
      }
    } catch(err) {
      console.log(err)
    }
  },
  methods:{
    submit(){
      if(this.account_type == 'Admin'){
        this.account_type_id = 1
      }
      let webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
      console.log(this.account_type_id+this.username+this.password);
      axios.put(`http://localhost:8000/user/`+ this.$route.params['id'], webFormData)
        .then(res => {
          if (res.status === 200) {
            this.$dialog.alert({
              title: 'Edit User',
              message: `User \'${this.username}\' has been successfully edited.`,
              type: 'is-success',
              hasIcon: true,
              icon: 'check-circle',
              iconPack: 'mdi'
            })
            this.$router.go({path: '/Admin/Users', force: true})
          }
        })

        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.right-spaced {
  margin-right: 1.5vw;
}
</style>
