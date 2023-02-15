<template>
  <div>
    <div style="margin: 10px 5px 10px 0px">
      <el-button type="primary" @click="handleAdd">创建角色</el-button>
      <el-button type="primary" :disabled="!currentRow ? true : false" @click="handleUpdateAuth">设置角色权限</el-button>
    </div>
    <el-table ref="singleTable" :data="roleList" highlight-current-row @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column type="index" width="50" label="序号"> </el-table-column>
      <el-table-column property="name" label="角色名称"> </el-table-column>
      <el-table-column property="create_time" label="创建时间" :formatter="resetDate"></el-table-column>
      <el-table-column property="auth_time" label="授权时间" :formatter="resetDate">
      </el-table-column>
      <el-table-column property="auth_name" label="授权人"> </el-table-column>
    </el-table>
    <!-- 添加角色弹窗 -->
    <el-dialog title="添加角色" :visible.sync="roleFormVisible" width="500px">
      <el-form :model="role" status-icon ref="roleForm" label-width="100px" label-position="right" style="width: 400px"
        :rules="roleRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('roleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色权限 -->
    <el-dialog title="添加角色权限" :visible.sync="roleAuthVisible" width="500px">
      <Auth :role="currentRow" ref="auth"></Auth>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAuthVisible = false">取 消</el-button>

        <el-button type="primary" @click="updateRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Auth from "./Auth.vue";
import roleApi from "@/api/role.js";
import memoryUtils from "@/utils/memoryUtils";
import { formatDateNoTime } from "@/utils/dateUtils";
export default {
  data() {
    return {
      // rules: {
      //   name: [
      //     {
      //       required: true,
      //       message: "请输入角色名称",
      //       trigger: ["blur", "change"],
      //     },
      //   ],
      // },
      currentRow: null,
      roleList: [],
      role: {
        name: "",
        menus: [],
      },
      roleFormVisible: false,
      roleAuthVisible: false,
      roleRules: {
        name: [
          { required: true, message: "角色名称必须输入", trigger: "blur" },
        ],
      },
    };
  },

  components: { Auth },
  mounted() {
    this.fetchData();
  },
  methods: {
    //打开设置权限窗口
    handleUpdateAuth() {
      this.roleAuthVisible = true;
    },
    resetDate(row, column, cellValue, index) {
      return formatDateNoTime(cellValue);
    },

    updateRole() {
      console.log(this.$refs["auth"].getMenus());
      const newRole = this.$refs["auth"].getMenus();
      this.currentRow.menus = newRole.menus;
      this.currentRow.name = newRole.name;
      this.currentRow.auth_name = memoryUtils.user.username;
      roleApi.updateRole(this.currentRow).then((response) => {
        const res = response.data;
        console.log(res);
        if (res.status === 0) {
          this.$message({
            message: "更新角色成功",
            type: "success",
          });
          this.roleAuthVisible = false;
          this.fetchData();
        }
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(val);
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          roleApi.addRole(this.role.name).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.$message({
                message: "新增角色成功",
                type: "success",
              });
              this.roleFormVisible = false;
              this.fetchData();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.roleFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].resetFields();
      });
    },
    fetchData() {
      roleApi.getRolelist().then((response) => {
        console.log("response", response);
        const resp = response.data;
        if (resp.status === 0) {
          this.roleList = resp.data;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>