<template>
<section id='content' class="box columns is-multiline">
  <div class="column is-6">
    <b-field label='Station Name *' :type="errors.has('name') ? 'is-danger': ''" :message="errors.has('name') ? errors.first('name') : ''">
      <b-input placeholder='Enter Station Name' v-model="name" name="name" data-vv-as="'Station Name'" v-validate="'required|alpha_spaces'" rounded></b-input>
    </b-field>

    <div class="columns">
      <div class="column is-half">
        <b-field label="Select Start Time">
          <b-timepicker v-model="startTime" :min-time='minTime' :max-time='maxTime' :increment-minutes='10' rounded></b-timepicker>
        </b-field>
      </div>

      <div class="column is-half">
        <b-field label="Select End Time">
          <b-timepicker v-model="endTime" :min-time='minTime' :max-time='maxTime' :increment-minutes='10' rounded></b-timepicker>
        </b-field>
      </div>
    </div>

    <b-field label="Description" :type="errors.has('description') ? 'is-danger': ''" 
      :message="errors.has('description') ? errors.first('description') : ''">
      <b-input maxlength="500" type="textarea" name="description" v-validate.immediate="'required'"
      data-vv-as="'Description'" v-model="description"></b-input>
    </b-field>
  </div>
  
  <div class="column is-4" style="margin-left: 5vw;">
    <b-field label="Image">
      <b-upload v-model="files" drag-drop>
        <section class="section" v-if="!files || files.length <= 0">
          <div class="content has-text-centered" id="preview">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Click to upload an image</p>
          </div>
        </section>
        <section class="image-section" v-else-if="files && files.length > 0">
          <figure id="preview" class="content has-text-centered image is-4by3">
            <img :src="readImageFile">
          </figure>
        </section>
      </b-upload>
    </b-field>
  </div>

  <div class="column is-11">
		<b-field label="Roles" style="margin-top: -2vh;">
      <b-field grouped group-multiline>
        <div class="control" v-if="roles.length>0" v-for="role in roles" :key="role.roleName">
          <b-tag v-if="(role.roleName)" type="is-primary" size="is-medium" attached closable @close="removeRole(role)">
            {{role.roleName}}
          </b-tag>
        </div>
        <button class="button is-primary" @click="isComponentModalActive = true">
          <b-icon icon="plus-circle"></b-icon>
          <span>Add Role</span>
        </button>
      </b-field>
    </b-field>

    <b-modal :active.sync="isComponentModalActive" @click="onClose()" has-modal-card>
      <modal-form></modal-form>
    </b-modal>

    <br/>

    <!-- Add Station button -->
    <button id="addStnBtn" class="button is-success" :disabled="isDisabled" @submit.prevent="validateBeforeSubmit">Add Station</button>

  </div>

</section>
</template>

<script>
import moment from 'moment'
import DataModel from '~/models/dataModel.js'
import config from '~/config.js'

let roleList = []
const ModalForm = {
  template: `<div>
<div class='modal-card'>
<header class='modal-card-head'>
<p class='modal-card-title'>Add Role</p>
</header>
<section class='modal-card-body columns is-marginless'>
	<div class='column'>
		<b-field label='Role Name' :type="errors.has('roleName') ? 'is-danger': ''"
		:message="errors.has('roleName') ? errors.first('roleName') : ''">
			<b-input
				v-model='roleName'
				placeholder='New Role'
				name="roleName"
				data-vv-as="'Role Name'"
				v-validate.immediate="'required|alpha_spaces'">
			</b-input>
		</b-field>
		<b-field class='columns' grouped>
			<div class='column is-half'>
				<b-field label='Duration'>
					<b-select expanded placeholder='Select Activity Duration' v-model="duration">
						<option value="20">20 mins</option>
						<option value="30">30 mins</option>
						<option value="40">40 mins</option>
					</b-select>
				</b-field>
			</div>
			<div class='column is-half'>
				<b-field label='Capacity'>
					<b-select expanded v-model='capacity' placeholder='Select Max. Capacity' required>
						<option v-for="i in 12" :key="i">{{ i }}</option>
					</b-select>
				</b-field>
			</div>
		</b-field>
		<b-field label='Image'>
			<b-field class='file'>
				<b-upload v-model='files' accept="image/*">
					<a class='button is-primary'>
					<b-icon icon='upload'></b-icon>
					<span>Upload Image</span>
					</a>
				</b-upload>
				<span class='file-name'
					v-if='files && files.length'>
					{{ files[0].name }}
				</span>
			</b-field>
		</b-field>
	</div>
</section>
<footer class='modal-card-foot'>
<button class='button' type='button' @click='$parent.close()'>Close</button>
<button class='button is-primary' :disabled='isDisabled' @click.prevent='validateBeforeSubmit()'>Add New Role</button>
</footer>
</div>
</div> `,
	methods: {
		addRole() {
			let roleExist = false
			if (roleList.length > 0) {
				let roleName = roleList.find(i => i.roleName.toLowerCase() === 
        this.roleName.trim().toLowerCase()).roleName
				if (roleName) {
					this.alertRoleExists()
				}
			}
			if (!roleExist) {
        let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.duration, 2, this.files[0])
				roleList.push(role)
				this.$parent.close()
			}
		},
		alertRoleExists() {
			this.$dialog.alert({
				title: "Role Exists",
				message: `Error! The Role \'${this.roleName}\' Already Exists`,
				type: "is-danger",
				hasIcon: true
			})
		},
		validateBeforeSubmit() {
			this.$validator.validateAll().then(res => {
				if (res) {
					this.addRole()
				} else {
					this.$dialog.alert({
						title: "Error",
						message: `Error! Please correct errors before submitting again.`,
						type: "is-danger",
						hasIcon: true
					})
				}
			})
		}
	},
	data() {
		return {
			roleName: '',
			capacity: 4,
			duration: 20,
			files: []
		};
	},
	computed: {
		isDisabled() {
			return !this.roleName || !this.capacity || !this.files[0]
		}
	}
}

export default {
  components: {
    ModalForm
  },
  data() {
    const min = new Date()
    min.setHours(10)
    min.setMinutes(0)
    const max = new Date()
    max.setHours(18)
    max.setMinutes(0)
    return {
      isComponentModalActive: false,
      name: '',
      description: '',
      roles: [],
      minTime: min,
      maxTime: max,
      startTime: min,
      endTime: max,
      files: [],

    }
  },
  beforeMount() {
    this.$store.commit('setPageTitle', 'Add Station')
  },
  methods: {
    async submit() {
      let res = await this.$axios.get(`http://${config.serverURL}/stations`)

      if (res.data.find(i => i.station_name.toLowerCase() === this.name.trim().toLowerCase())) {
        this.$dialog.alert({
          title: 'Error: Add Station',
          message: `The Station: \'${this.name}\' already exists`,
          type: 'is-danger',
          hasIcon: true,
          iconPack: 'mdi'
        })
      } else {
        let station = new DataModel.Station(this.name.trim(), this.description.trim(),
          moment(this.startTime, 'HH:mm').format('HH:mm'), moment(this.endTime, 'HH:mm').format('HH:mm'),
          this.roles)

        let formData = new FormData()
        formData.append('webFormData', JSON.stringify(station))
        formData.append(station.name, this.files[0])
        for (var i = 0; i < station.roles.length; i++) {
          let file = station.roles[i].file
          formData.append("Role-" + station.roles[i].roleName, file)
        }

        this.$axios.post(`http://${config.serverURL}/stations/`, formData)
          .then(res => {
            roleList = []
            this.roles = roleList
            if (res.status === 200) {
              this.$dialog.confirm({
                title: 'Add Station',
                message: `A new station \'${this.name}\' has been successfully added.`,
                type: 'is-success',
                hasIcon: true,
                icon: 'check-circle',
                iconPack: 'mdi',
                onConfirm: () => this.$router.push('/Admin/Stations')
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    validateBeforeSubmit(e) {
      this.$validator.validateAll().then(() => {
          console.log('TRUE')
        })
        .catch(() => {
          console.log('FALSE')
          return false
        })
    },
    removeRole(role) {
      this.roles.splice(this.roles.findIndex(i => i.roleName === role.roleName), 1)
      roleList = this.roles;
    }
  },
  computed: {
    isDisabled() {
      return !this.name || !(this.roles.length > 0) || !this.description || !this.files[0]
    },
    getRoles() {
      roles = roleList
    },
    readImageFile() {
      if (this.files) {
        return URL.createObjectURL(this.files[0])
      }
    }
  },
  beforeUpdate() {
    this.roles = roleList
  }
}
</script>

<style scoped>
/* #addStnBtn {
  float: right;
} */
#preview {
  width: 20vw;
  height: 80%;
}

.section {
  height: 30vh;
}

.image-section {
  padding: 24px;
}
</style>
