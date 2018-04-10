<template>
  <v-dialog v-model="isShowPackage" persistent max-width="400px">
    <v-card class="package" v-show="step === listStep.listDeviceUse">
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
            <template v-for="(item, index) in listDevice">
              <v-list-tile 
                avatar
                ripple
                @click="toggle(item, index)"
                :key="item.title"
                v-bind:class="{ active: selectedDevice.indexOf(index) < 0 }">
                <v-list-tile-action>
                  <v-checkbox v-model="item.checkbox"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.model }}</v-list-tile-title>
                  <v-list-tile-sub-title>Đăng nhập lần cuối: {{ item.last_date }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <v-divider></v-divider>
        </v-container>
        <div>{{messegeError}}</div>
      </v-card-text>
      <v-card-actions >
        <v-flex xs6 >
          <v-btn color="blue darken-1" class="" flat @click="kickDevice()" > Xóa thiết bị
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="" flat > Nâng cấp gói cước</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
    <v-card class="package" v-show="step === listStep.choseTypePackage">
      <v-toolbar class="header">
        <v-toolbar-title>Lựa chọn gói</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="package-description">Đăng ký dịch vụ để được xem nội dung Gói Basic (150 kênh truyền hình, tính năng xem lại, tua lại kênh truyền hình, kho Phim, Thiếu nhi, liveshows ca nhạc, sự kiện thể thao E-sports được truyền hình trực tiếp) không giới hạn lưu lượng tốc độ cao 3G-4G.</div>
        <v-container grid-list-md>
          <v-list one-line>
            <v-radio-group v-model="radioGroup">
              <template v-for="item in listPackage">
                <v-list-tile v-bind:class="{ active: radioGroup === item.price }">
                    <v-list-tile-action>
                      <v-radio v-model="item.price"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.model}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="package-price">{{ item.price }}</v-list-tile-action>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-container>
        <div class="info-package">Gói cước sẽ tự động gia hạn vào chu kỳ cước tiếp theo.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat > Quay lại
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat > Xác nhận</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
    <v-card class="package" v-show="step === listStep.choseTypePeriod">
      <v-toolbar class="header">
        <v-toolbar-title>Lựa chọn gói</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="package-description">Đăng ký dịch vụ để được xem nội dung Gói Basic (150 kênh truyền hình, tính năng xem lại, tua lại kênh truyền hình, kho Phim, Thiếu nhi, liveshows ca nhạc, sự kiện thể thao E-sports được truyền hình trực tiếp) không giới hạn lưu lượng tốc độ cao 3G-4G.</div>
        <v-container grid-list-md>
          <v-list one-line>
            <v-radio-group v-model="radioGroup">
              <template v-for="item in listPackage">
                <v-list-tile v-bind:class="{ active: radioGroup === item.price }">
                    <v-list-tile-action>
                      <v-radio v-model="item.price"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.model}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="package-price">{{ item.price }}</v-list-tile-action>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-container>
        <div class="info-package">Gói cước sẽ tự động gia hạn vào chu kỳ cước tiếp theo.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat > Quay lại
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat > Xác nhận</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    computed: {
      isShowPackage: {
        get () {
          return this.$store.getters.isShowPackage
        }
      },
      listPackage: {
        get () {
          return this.$store.getters.listPackage
        }
      },
      listDevice: {
        get () {
          return this.$store.getters.listDevice
        }
      },
      screenMax: {
        get () {
          let screenMax = this.$store.getters.screenMax
          return screenMax
        }
      }
    },
    data () {
      return {
        radioGroup: 1,
        step: 0,
        listStep: {
          listDeviceUse: 0,
          choseTypePackage: 1,
          choseTypePeriod: 2
        },
        messegeError: ''
      }
    },
    created () {
      if (this.$route.name === 'account') {
        this.step = 2
      }
    },
    methods: {
      toggle (item, index) {
        const i = this.selectedDevice.indexOf(index)
        if (i > -1) {
          this.selectedDevice.splice(i, 1)
        } else {
          this.selectedDevice.push(index)
        }
      }
    }
  }
</script>
<style lang='scss'>
@import "src/assets/style/main.scss";
.package {
  .package-description {
    color: $yellow;
    background-color: transparent !important;
  }
  .info-package {
    color: darkgray !important
  }
  .list .active {
    .list__tile {
      background: rgba(89, 91, 93, 0.51) ;
    }
  }
  .list__tile {
    background: #0a0e15;
    margin: 10px 0px;
    .package-price {
      color: $yellow
    }
  } 
}

</style>