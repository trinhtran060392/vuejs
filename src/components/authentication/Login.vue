<template>
  <v-dialog v-model="showLoginDialog" persistent max-width="400px">
    <v-card v-show="step === listStepLogin.login">
      <v-toolbar class="header" >
        <v-toolbar-title>ĐĂNG NHẬP</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Số điện thoại " solo  v-model="userLogin.phone" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Mật khẩu " solo type="password" v-model="userLogin.password" required>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat @click="login">  Đăng nhập
          </v-btn>
          <div class="btn-last">Quên mật khẩu</div>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat @click.native="showLoginDialog = false">Đóng</v-btn>
          <div class="btn-last">Đăng ký</div>
        </v-flex>
      </v-card-actions>
    </v-card>
    <v-card v-show="step === listStepLogin.kickDevice">
      <v-toolbar class="header">
        <v-toolbar-title>Danh sách thiết bị</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="package-description">
          <span>Bạn đã đăng nhập quá thiết bị bằng tài khoản này</span></br>
          <span>Để tiếp tục sử dụng, vui lòng xóa bớt thiết bị hoặc nâng cấp gói cước</span>
        </div>
        <v-container grid-list-md>
          <v-list two-line>
            <div v-for="(item, index) in listDeviceClone" :key="item.model" >
              <v-list-tile 
                avatar
                ripple
                @click="toggle(item, index)"
                v-bind:class="{ active: item.checkbox === true }">
                <v-list-tile-action>
                  <v-checkbox v-model="item.checkbox"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.model }}</v-list-tile-title>
                  <v-list-tile-sub-title>Đăng nhập lần cuối: {{ item.last_date }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>
          </v-list>
          <v-divider></v-divider>
        </v-container>
        <div></div>
      </v-card-text>
      <v-card-actions >
        <v-flex xs6 >
          <v-btn color="blue darken-1" class="" flat @click="kickDevice()" > Xóa thiết bị
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="" flat @click="upgradeNDevice()" > Nâng cấp gói cước</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  import Auth from '../authentication/Auth'
  import Constant from '../shared/Constant'
  import Ulti from '../shared/Ulti'
  export default {
    computed: {
      showLoginDialog: {
      // getter
        get: function () {
          return this.$store.getters.showLoginDialog
        },
        // setter
        set: function (newValue) {
          this.$store.dispatch('showLoginDialog', false)
        }
      },
      isAutoLogin () {
        return this.$store.getters.isAutoLogin
      },
      listRegisterDevice () {
        return this.$store.getters.listRegisterDevice
      },
      step () {
        return this.$store.getters.stepLogin
      },
      accountInfo: {
        get: function () {
          return this.$store.getters.accountInfo
        },
        set: function (accountInfo) {
          this.$store.dispatch('setAccountInfo', accountInfo)
        }
      }
    },
    data () {
      return {
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 10 || 'Name must be less than 10 characters'
        ],
        passwordRules: [
          v => !!v || 'Name is required'
        ],
        errorMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ CSKH',
        selectedDevice: [],
        listDeviceClone: []
      }
    },
    watch: {
      listRegisterDevice (newValue) {
        console.log('change')
        let devices = JSON.parse(JSON.stringify(newValue.devices))
        this.listDeviceClone = this.removeDeviceCurrent(devices)
      }
    },
    methods: {
      login: function () {
        Auth.login(this.userLogin).then((response) => {
          if (response.status === Constant.statusCode.OK) {
            let accountInfo = {
              id: this.userLogin.phone,
              accessToken: response.body.access_token,
              tokenSecret: response.body.token_secret,
              refresh_token: response.body.refresh_token,
              expiration_date: response.body.expiration_date,
              refresh_token_expiration_date: response.body.refresh_token_expiration_date,
              temp_password: response.body.temp_password,
              status: response.body.status
            }
            this.accountInfo = accountInfo
            this.$store.dispatch('setToken', accountInfo.accessToken)
            this.checkAccountUse()
          }
        })
      },
      upgradeNDevice () {
        // this.$store.dispatch('showLoginDialog', false)
        // this.$store.dispatch('showPackage', true)
      },
      toggle (item, index) {
        const i = this.selectedDevice.indexOf(item)
        if (i > -1) {
          item.checkbox = false
          this.$set(this.listDeviceClone, index, item)
          this.selectedDevice.splice(i, 1)
        } else {
          item.checkbox = true
          this.$set(this.listDeviceClone, index, item)
          this.selectedDevice.push(item)
        }
      },
      kickDevice () {
        let lengthSelectedDevice = this.selectedDevice.length
        let obj = {
          devices: []
        }
        if (lengthSelectedDevice > 0) {
          for (let index = 0; index < lengthSelectedDevice; index++) {
            const element = this.selectedDevice[index]
            obj.devices.push(element.id)
          }
          Auth.kickDevice(obj).then((response) => {
            if (response.status === Constant.statusCode.OK) {
              this.login()
            }
          })
        } else {
          this.messegeError = 'Vui lòng chọn thiết bị muốn xóa !'
        }
      },
      removeDeviceCurrent (data) {
        let currentDeviceId = Ulti.getDeviceid()
        for (let index = 0; index < data.length; index++) {
          let element = data[index]
          if (element.id === currentDeviceId) {
            data.splice(index, 1)
            break
          }
        }
        return data
      }
    }
  }
</script>
<style lang='scss' scoped>
.header {
  background-color: #0a0e15
}
.header .toolbar__content {
  text-align: center;
  .toolbar__title {
    color: #ffcc05;
    width: 100%;
  }
}
.card__text, .card__actions {
  background-color: #0E1623
}
.btn-login {
  min-width: 80%;
  background-color: rgba(86,86,86,0.28) !important;
  color: white !important;
  text-transform: none;
}
.input-group.input-group--solo {
  background: rgba(86,86,86,0.28) !important;
}
.btn-last {
  padding: 20px 0px
}

</style>