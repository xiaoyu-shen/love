<template>
  <div>
    <div style="margin-top: 20px" class="btn_box">
      <el-button type="primary" @click="handleAdd">添加地区</el-button>
    </div>
    <el-table :data="majors" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="majorname" label="地区姓名"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" size="small"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.row._id)"
            type="danger"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加地区弹窗 -->
    <el-dialog
      title="添加/编辑地区"
      :visible.sync="majorFormVisible"
      width="500px"
    >
      <el-form
        :model="major"
        status-icon
        ref="majorForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="地区名称" prop="majorname">
          <el-input
            v-model="major.majorname"
            placeholder="请输入地区名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="majorFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            major._id === null ? addData('majorForm') : updateData('majorForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
import majorApi from "@/api/major.js";
export default {
  data() {
    return {
      totalPage: 1, //总共有多少页
      currentPage: 1, //当前在多少页
      pageSize: 5, //一页显示多少条
      total: 0, // 总数据几条
      majors: [],
      majorFormVisible: false,
      major: {
        _id: null,
        majorname: "",
      },
      rules: {
        majorname: [
          {
            required: true,
            message: "地区名称必须输入",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  components: {},
  mounted() {
    this.fetchmajors();
  },
  methods: {
    handleAdd() {
      this.major = {
        _id: null,
        majorname: "",
      };
      this.majorFormVisible = true;
      this.$nextTick(() => {
        this.$refs["majorForm"].resetFields();
      });
    },
    handleEdit(_id) {
      console.log(_id);
      this.handleAdd();
      majorApi.getById(_id).then((response) => {
        const res = response.data;
        if (res.status === 0) {
          this.major = res.data;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          majorApi.update(this.major).then((response) => {
            const res = response.data;
            if (res.status === 0) {
              this.fetchmajors();
              this.majorFormVisible = false;
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
        majorApi.deleteById(id).then((response) => {
          const res = response.data;
          if (res.status == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.totalPage = (this.total - 1) / this.pageSize;
            this.fetchmajors();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      this.fetchmajors();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchmajors();
      console.log(`当前页: ${val}`);
    },
    fetchmajors() {
      if (this.currentPage > Math.ceil(this.totalPage)) {
        this.currentPage = Math.ceil(this.totalPage);
      }
      majorApi
        .getmajorList(this.currentPage, this.pageSize)
        .then((response) => {
          console.log(this.currentPage, this.pageSize);
          const res = response.data;
          if (res.status == 0) {
            console.log(res);
            this.majors = res.data.data;
            this.total = res.data.total;
            this.totalPage = this.total / this.pageSize;
          }
        });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          majorApi.add(this.major).then((response) => {
            const res = response.data;
            console.log("添加地区", res);
            if (res.status === 0) {
              this.majorFormVisible = false;
              this.fetchmajors();
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