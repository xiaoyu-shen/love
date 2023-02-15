<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
    </div>
    <el-table :data="users" style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column
        prop="create_time"
        :formatter="resetDate"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        prop="role_id"
        label="所属角色"
        :formatter="formatRole"
      ></el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="userFormVisible" width="500px">
      <el-form
        :model="user"
        ref="userForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
          v-if="user._id === null ? true : false"
        >
          <el-input v-model="user.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select
            v-model="user.role_id"
            class="filter-item"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in roleOptions"
              :label="option.name"
              :key="option._id"
              :value="option._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            user._id === null ? addData('userForm') : updateData('userForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/user.js";
import { formatDateNoTime } from "@/utils/dateUtils.js";
export default {
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
    var validatePhone = (rule, value, callback) => {
      value = value.trim();
      const length = value && value.length;
      const pwdReg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("手机号码不能为空！！！"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      userFormVisible: false,
      totalPage: 1, //总共有多少页
      currentPage: 1, //当前在多少页
      pageSize: 5, //一页显示多少条
      total: 0, // 总数据几条
      users: [], // 用户数据列表
      user: {
        _id: null,
        username: "",
        password: "",
        name: "",
        role_id: "",
        phone: "",
      },
      rules: {
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: true,
            validator: validatePhone,
            trigger: ["blur", "change"],
          },
        ],

        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur",
          },
          { min: 4, message: "请输入密码", trigger: "blur" },
        ],
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        role_id: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
      },
      roleOptions: [],
    };
  },

  components: {},

  mounted() {
    this.fetchUsers();
  },
  methods: {
    handleAdd() {
      this.user = {
        _id: null,
        username: "",
        password: "",
        name: "",
        role_id: "",
        phone: "",
      };
      this.userFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.add(this.user).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.fetchUsers();
              this.userFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.update(this.user).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.fetchUsers();
              this.userFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    fetchUsers() {
      if (this.currentPage > Math.ceil(this.totalPage)) {
        this.currentPage = Math.ceil(this.totalPage);
      }
      userApi.getUserList(this.currentPage, this.pageSize).then((response) => {
        console.log(this.currentPage, this.pageSize);
        const resp = response.data;
        if (resp.status == 0) {
          console.log(resp);
          this.users = resp.data.data;
          this.roleOptions = resp.data.roles;

          this.total = resp.data.total;
          this.totalPage = this.total / this.pageSize;
        }
      });
    },
    handleEdit(_id) {
      console.log(_id);
      this.handleAdd();
      userApi.getById(_id).then((response) => {
        const res = response.data;
        if (res.status === 0) {
          this.user = res.data;
        }
      });
    },
    handleDelete(id) {
      console.log(id);
      this.$confirm("确认删除词条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        userApi.deleteById(id).then((response) => {
          const res = response.data;
          if (res.status == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.totalPage = (this.total - 1) / this.pageSize;
            this.fetchUsers();
          }
        });
      });
    },
    resetDate(row, column, cellValue, index) {
      return formatDateNoTime(cellValue);
    },
    formatRole(row, column, cellValue, index) {
      const role =
        this.roleOptions.find((item) => item._id === cellValue) || {};
      return role.name;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      this.fetchUsers();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUsers();
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style scoped>
</style>