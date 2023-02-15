<template>
  <div>
    <el-form
      :model="updateRole"
      status-icon
      ref="roleForm"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="updateRole.name"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-tree
      :data="authList"
      show-checkbox
      node-key="index"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      @check-change="handleCheckChange"
      ref="tree"
    >
    </el-tree>
  </div>
</template>

<script>
import menuList from "@/config/menuConfig";
export default {
  data() {
    return {
      checkedKeys: [],
      updateRole: {},
      authList: [],
      rules: {
        name: [
          { required: true, message: "角色名称必须输入", trigger: "blur" },
        ],
      },
    };
  },
  props: ["role"],
  mounted() {
    this.updateRole = { ...this.role };
    this.authList = this.getAuthNodes(menuList);
    this.checkedKeys = this.role.menus;
  },

  watch: {
    role(val) {
      if (val) {
        this.$nextTick(() => {
          this.updateRole = { ...val };
          this.checkedKeys = val.menus;
          this.$refs["tree"].setCheckedKeys(this.checkedKeys);
        });
      }
    },
  },
  components: {},

  methods: {
    getAuthNodes(menuList) {
      return menuList.map((item) => {
        if (!item.children) {
          return {
            index: item.index,
            label: item.title,
          };
        } else {
          return {
            index: item.index,
            label: item.title,
            children: this.getAuthNodes(item.children),
          };
        }
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      //   console.log(data, checked, indeterminate);
      if (checked) {
        this.checkedKeys.push(data.index);
        let set = new Set(this.checkedKeys);
        this.checkedKeys = Array.from(set);
      } else {
        if (this.checkedKeys.indexOf(data.index) != -1) {
          this.checkedKeys.splice(this.checkedKeys.indexOf(data.index), 1);
        }
      }
      //   console.log("this.checkedKeys", this.checkedKeys);
    },
    getMenus() {
      this.updateRole.menus = this.checkedKeys;
      return this.updateRole;
    },
  },
};
</script>

<style scoped>
</style>