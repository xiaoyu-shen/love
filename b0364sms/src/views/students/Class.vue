<template>
  <div>
    <!-- 重置 -->
    <el-form
      :inline="true"
      :model="search"
      class="demo-form-inline"
      ref="searchForm"
      style="margin: 20px"
    >
      <el-form-item prop="teacher">
        <el-input
          v-model="search.teacher"
          placeholder="根据专属红娘查询"
        ></el-input>
      </el-form-item>
      <el-form-item prop="manager">
        <el-input
          v-model="search.manager"
          placeholder="根据客服查询"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加交友圈弹窗 -->
    <el-dialog title="红娘编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="classForm"
        :model="updateClass"
        label-width="100px"
        style="width: 400px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="交友圈名称" prop="name">
          <el-input v-model="updateClass.name"></el-input>
        </el-form-item>
        <el-form-item label="专属红娘红娘" prop="teacher_id">
          <el-select
            v-model="updateClass.teacher_id"
            placeholder="请点击选择专属红娘"
            class="filter-item"
          >
            <el-option
              v-for="option in teacherOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客服" prop="manager_id">
          <el-select
            v-model="updateClass.manager_id"
            placeholder="请点击选择客服"
            class="filter-item"
          >
            <el-option
              v-for="option in managerOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="
              updateClass._id === null
                ? addData('classForm')
                : updateData('classForm')
            "
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  -->
    <el-table
      :data="classs"
      height="380"
      border
      style="width: 100%"
      prop="table"
    >
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="交友圈名称"> </el-table-column>
      <el-table-column
        prop="teacher_id"
        label="专属红娘"
        :formatter="formatTeacher"
      >
      </el-table-column>
      <el-table-column
        prop="manager_id"
        label="客服"
        :formatter="formatManager"
      >
      </el-table-column>

      <el-table-column label="操作">
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
    <!-- 分页控件 -->
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
  </div>
</template>

<script>
import classApi from "@/api/classs.js";
import userApi from "@/api/user";
export default {
  data() {
    return {
      totalPage: 1, //总共有多少页
      currentPage: 1, //当前在多少页
      pageSize: 5, //一页显示多少条
      total: 0, // 总数据几条
      classs: [],
      updateClass: {
        _id: null,
        name: "",
        teacher_id: "",
        manager_id: "",
        stage: "",
      },
      search: {
        teacher: "",
        manager: "",
      },
      searchMap: {
        teacher_id: "",
        manager_id: "",
      },
      userAll: [],
      teacherOptions: [],
      managerOptions: [],
      dialogFormVisible: false,
      rules: {
        name: [{ require: true, message: "请输入交友圈名称", trigger: "blur" }],
        teacher_id: [{ require: true, message: "请选择红娘", trigger: "blur" }],
        manager_id: [{ require: true, message: "请选择客服", trigger: "blur" }],
      },
    };
  },

  components: {},
  mounted() {
    this.fetchClass();
    this.getUserList();
  },
  methods: {
    handleAdd() {
      this.updateClass = {
        _id: null,
        name: "",
        teacher_id: "",
        manager_id: "",
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["classForm"].resetFields();
      });
    },
    addData(formName) {
     
      this.$refs[formName].validate((valid) => {
        if (valid) {
          classApi.add(this.updateClass).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchClass();
              this.dialogFormVisible = false;
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
          classApi.update(this.updateClass).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchClass();
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    searchData() {
      this.currentPage = 1;
      const resTeacher =
        this.userAll.find((item) => item.name === this.search.teacher) || {};
      const resManager =
        this.userAll.find((item) => item.name === this.search.manager) || {};
      this.searchMap.teacher_id = resTeacher._id || "";
      this.searchMap.manager_id = resManager._id || "";
      this.fetchClass();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.searchData();
    },
    getUserList() {
      userApi.getUserAll().then((response) => {
        const res = response.data;
        if (res.status == 0) {
          this.userAll = res.data;
          this.userAll.forEach((item) => {
            if (item.role_id === "62d8ef9dfdbe91bdec969b66") {
              this.teacherOptions.push(item);
            } else if (
              item.role_id === "62d8efa7fdbe91bdec969b69" ||
              item.role_id === "62d8ef97fdbe91bdec969b63"
            ) {
              this.managerOptions.push(item);
            }
          });
        }
      });
    },
    formatManager(row, column, cellValue, index) {
      // console.log("cellValue", cellValue);
      const manager = this.userAll.find((item) => item._id == cellValue) || {};
      return manager.name;
    },
    formatTeacher(row, column, cellValue, index) {
      // console.log("cellValue", cellValue);
      const teacher = this.userAll.find((item) => item._id == cellValue) || {};
      return teacher.name;
    },
    fetchClass() {
      classApi
        .getClassList(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const res = response.data;
          if (res.status == 0) {
            this.classs = res.data.data;
            this.total = res.data.total;
          }
        });
    },
    handleDelete(_id) {
      console.log(_id);
      this.$confirm("确认删除这条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classApi.deleteById(_id).then((response) => {
            const res = response.data;
            if (res.status == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.totalPage = (this.total - 1) / this.pageSize;
              this.fetchClass();
            }
          });
        })
        .catch(() => {});
    },
    async handleEdit(_id) {
      console.log(_id);
      this.handleAdd();
      let resp = await classApi.getById(_id);
      resp = resp.data;
      if (resp.status === 0) {
        this.updateClass = resp.data;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      this.fetchClass();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchClass();
      console.log(`当前页: ${val}`);
    },
    // fetchClass() {
    //   classApi
    //     .getUserList(this.currentPage, this.pageSize, this.searchMap)
    //     .then((response) => {
    //       const res = response.data;
    //       if (res.status == 0) {
    //         this.classs = res.data.data;
    //         this.total = res.data.total;
    //       }
    //     });
    // },
  },
};
</script>

<style scoped>
</style>