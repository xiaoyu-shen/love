<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="100px" class="login-form">
      <h1 class="login-title">登录</h1>
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" class="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/login.js";
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils";
export default {
  // el:'#login',
  data() {
    var validateUserName = (rule, value, callback) => {
      value = value.trim();
      const length = value && value.length;
      const pwdReg = /^[a-zA-Z0-9_]+$/;
      if (value === "") {
        callback(new Error("账号不能为空！！！"));
      } else if (length < 4 || length > 12) {
        callback(new Error("账号长度在4-12位之间！！！"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("账号中只能存在英文、数字、下划线"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      value = value.trim();
      const length = value && value.length;
      const pwdReg = /^[a-zA-Z0-9_]+$/;
      if (value === "") {
        callback(new Error("密码不能为空！！！"));
      } else if (length < 4 || length > 12) {
        callback(new Error("密码长度在4-12位之间！！！"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("密码中只能存在英文、数字、下划线"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // console.log(this.form.username,this.form.password);
          let result = await login(this.form.username, this.form.password);
          console.log("result", result);
          result = result.data;
          if (result.status == 0) {
            this.$message({
              message: "登录成功",
              type: "success",
            });
            const user = result.data;
            storageUtils.saveUser(user);
            memoryUtils.user = user;
            console.log(user);
            this.$router.replace("/");
          }
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.login-container {
  position: absolute;
  width: 99%;
  height: 98%;
  background: url("../../assets/ekFNXdz2.webp") no-repeat center;
  overflow: hidden;
}

.login-form {
  /* position: absolute;  */
  width: 350px;
  margin: 65px auto;
  border-radius: 20px;
  box-shadow: 10px 10px 10px 5px rgb(104, 101, 101, 0.5);
  padding: 30px;
  background-color: rgba(252, 217, 217, 0);
}

.login-title {
  text-align: center;
}
</style>