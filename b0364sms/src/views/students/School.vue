<template>
  <div>
    <div style="margin-top: 20px" class="btn_box">
      <el-button type="primary" @click="handleAdd">添加活动</el-button>
    </div>
    <el-table :data="schools" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="schoolname" label="活动名称"> </el-table-column>
      <el-table-column prop="schooltitle" label="活动主题"> </el-table-column>
      <el-table-column prop="schoolplace" label="活动地点"> </el-table-column>
      <el-table-column prop="schooltime" label="活动时间"> </el-table-column>
      <el-table-column prop="schoolprincipal" label="负责人"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row._id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加活动弹窗 -->
    <el-dialog title="添加/编辑活动" :visible.sync="schoolFormVisible" width="500px">
      <el-form :model="school" status-icon ref="schoolForm" label-width="100px" label-position="right"
        style="width: 400px" :rules="rules">
        <el-form-item label="活动名称" prop="schoolname">
          <el-input v-model="school.schoolname" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动主题" prop="schooltitle">
          <el-input v-model="school.schooltitle" placeholder="请输入活动主题"></el-input>
        </el-form-item>
        <el-form-item label="活动地点" prop="schoolplace">
          <el-input v-model="school.schoolplace" placeholder="请输入活动地点"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="schooltime">
          <el-input v-model="school.schooltime" placeholder="请输入活动时间"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="schoolprincipal">
          <el-input v-model="school.schoolprincipal" placeholder="请输入负责人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="schoolFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="
          school._id === null
            ? addData('schoolForm')
            : updateData('schoolForm')
        ">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页控件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import schoolApi from "@/api/school.js";
export default {
  data() {
    return {
      totalPage: 1, //总共有多少页
      currentPage: 1, //当前在多少页
      pageSize: 5, //一页显示多少条
      total: 0, // 总数据几条
      schools: [],
      schoolFormVisible: false,
      school: {
        _id: null,
        schoolname: "",
        schooltitle: "",
        schoolplace: "",
        schooltime: "",
        schoolprincipal: "",
      },
      rules: {
        schoolname: [
          {
            required: true,
            message: "活动名称必须输入",
            trigger: ["blur", "change"],
          },
        ],
        schooltitle: [
          {
            required: true,
            message: "活动主题必须输入",
            trigger: ["blur", "change"],
          },
        ],
        schoolplace: [
          {
            required: true,
            message: "活动地点必须输入",
            trigger: ["blur", "change"],
          },
        ],
        schooltime: [
          {
            required: true,
            message: "活动时间必须输入",
            trigger: ["blur", "change"],
          },
        ],
        schoolprincipal: [
          {
            required: true,
            message: "活动负责人必须输入",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  components: {},
  mounted() {
    this.fetchSchools();
  },
  methods: {
    handleAdd() {
      this.school = {
        _id: null,
        schoolname: "",
      };
      this.schoolFormVisible = true;
      this.$nextTick(() => {
        this.$refs["schoolForm"].resetFields();
      });
    },
    handleEdit(_id) {
      console.log(_id);
      this.handleAdd();
      schoolApi.getById(_id).then((response) => {
        const res = response.data;
        if (res.status === 0) {
          this.school = res.data;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          schoolApi.update(this.school).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.fetchSchools();
              this.schoolFormVisible = false;
            }
          });
        } else {
          return false;
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
        schoolApi.deleteById(id).then((response) => {
          const res = response.data;
          if (res.status == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.totalPage = (this.total - 1) / this.pageSize;
            this.fetchSchools();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      this.fetchSchools();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchSchools();
      console.log(`当前页: ${val}`);
    },
    fetchSchools() {
      if (this.currentPage > Math.ceil(this.totalPage)) {
        this.currentPage = Math.ceil(this.totalPage);
      }
      schoolApi
        .getSchoolList(this.currentPage, this.pageSize)
        .then((response) => {
          console.log(this.currentPage, this.pageSize);
          const res = response.data;
          if (res.status == 0) {
            console.log(res);
            this.schools = res.data.data;
            this.total = res.data.total;
            this.totalPage = this.total / this.pageSize;
          }
        });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          schoolApi.add(this.school).then((response) => {
            const res = response.data;
            console.log("添加活动", res);
            if (res.status === 0) {
              this.schoolFormVisible = false;
              this.fetchSchools();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>