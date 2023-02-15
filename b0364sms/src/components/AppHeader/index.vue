<template>
  <div class="header">
    <a href="#">
      <!-- <img src="../../assets/图片1.png" class="logo" width="25px"> -->
      <span class="el-icon-s-custom" style="color: aliceblue"></span>
      <span class="title">相亲网站管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a" class="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" class="el-icon-circle-close">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="date-weather">
      <span class="date">{{ currentTime }}</span>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <span class="weather">
        <i :class="wea_img"></i>
        &nbsp; &nbsp;
        {{ wea }}
        &nbsp; &nbsp;
        {{ tem_day }}/{{ tem_night }}
        C&deg;
      </span>
    </span>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" style="width: 400px">
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="userForm.oldPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="userForm.pass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$refs['userForm'].resetFields()">重置 </el-button>
        <el-button type="primary" @click="submitForm('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 被引入的是一个文件中的某个方法的时候，import 加{方法名}
import { reqWeather } from "@/api/jsonp";
import { formatDate } from "@/utils/dateUtils";
// 引入的是默认的，也就是说文件中是 export default xx{} 的时候，import 的时候不加{}
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import userApi from "@/api/user";
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      userApi.checkPwd(this.user._id, value).then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          callback();
        } else {
          callback(new Error(resp.msg));
        }
      });
    };
    var validatePass = (rule, value, callback) => {
      if (value !== this.userForm.pass) {
        callback(new Error("两次密码输入的不一样"));
      } else {
        callback();
      }
    };
    return {
      user: memoryUtils.user,
      currentTime: formatDate(Date.now()),
      tem_day: "",
      tem_night: "",
      wea: "",
      wea_img: "",
      dialogFormVisible: false,
      timer: 0,
      userForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "change" },
        ],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "change" },
        ],
      },
    };
  },

  components: {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.getWeather();
    this.getTime();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi
            .updatePwd(this.user._id, this.userForm.checkPass)
            .then((response) => {
              const resp = response.data;
              if (resp.status == 0) {
                this.handleLogout();
                this.dialogFormVisible = false;
                this.$message({
                  message: "修改密码成功，请重新登录",
                  type: "success",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();

          break;

        default:
          break;
      }
      this.$message("click on item " + command);
    },
    handleLogout() {
      memoryUtils.user = {};
      storageUtils.removeUser();
      this.$router.replace("/login");
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].resetFields();
      });
    },
    getWeather() {
      reqWeather("哈尔滨").then((response) => {
        const { wea, wea_img, tem_night, tem_day } = response;
        const weaImgs = {
          xue: "el-icon-loading",
          lei: "el-icon-lightning",
          shachen: "el-icon-wind-power",
          wu: "el-icon-partly-cloudy",
          bingbao: "el-icon-ice-cream-round",
          yun: "el-icon-cloudy",
          yu: "el-icon-heavy-rain",
          yin: "el-icon-cloudy-and-sunny",
          qing: "el-icon-sunny",
        };
        this.tem_day = tem_day;
        this.tem_night = tem_night;
        this.wea = wea;
        this.wea_img = weaImgs[wea_img];
      });
    },
    getTime() {
      this.timer = setInterval(() => {
        this.currentTime = formatDate(Date.now());
      }, 1000);
    },
  },
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #333;
}

a {
  text-decoration: none;
}

.el-icon-s-custom {
  position: absolute;
  top: 16px;
  left: 45px;
}

.title {
  position: absolute;

  left: 80px;
  color: aliceblue;
  text-align: center;
}

.el-dropdown {
  float: right;
  margin-right: 40px;
  cursor: pointer;
}

.el-dropdown-link {
  color: aliceblue;
}

.date-weather {
  float: right;
  margin-right: 30px;
  color: aliceblue;
}
</style>