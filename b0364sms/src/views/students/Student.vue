<template>
  <div>
    <!-- 条件查询 -->
    <el-form :inline="true" :model="search" class="demo-form-inline" ref="searchForm" style="margin: 20px 0">
      <el-form-item prop="name">
        <el-input v-model="search.name" placeholder="根据姓名查询" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item prop="direction">
        <el-select v-model="search.direction" placeholder="根据从事行业查询" style="width: 150px">
          <el-option v-for="option in directionOptions" :key="option.type" :label="option.name" :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="class">
        <el-select v-model="search.class" placeholder="根据交友圈查询" style="width: 150px">
          <el-option v-for="option in classOptions" :key="option._id" :label="option.name" :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="teacher">
        <el-input v-model="search.teacher" placeholder="根据红娘查询" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item prop="manager">
        <el-input v-model="search.manager" placeholder="根据客服查询" style="width: 150px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="students" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学员姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender | dataFilter(genderOptions) }}</span>
            </el-form-item>
            <el-form-item label="毕业院校">
              <span>{{ props.row.school }}</span>
            </el-form-item>
            <el-form-item label="所在行业 ">
              <span>{{ props.row.major }}</span>
            </el-form-item>
            <el-form-item label="薪资水平">
              <span>{{ props.row.grade | dataFilter(gradeOptions) }}</span>
            </el-form-item>
            <el-form-item label="学历">
              <span>{{
                  props.row.education | dataFilter(educationOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="从事行业">
              <span>{{
                  props.row.direction | dataFilter(directionOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="身份号码">
              <span>{{ props.row.id_number }}</span>
            </el-form-item>
            <el-form-item label="电话号码">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="亲属姓名">
              <span>{{ props.row.parent }}</span>
            </el-form-item>
            <el-form-item label="亲属联系电话">
              <span>{{ props.row.parent_phone }}</span>
            </el-form-item>
            <el-form-item label="家庭住址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="QQ号码">
              <span>{{ props.row.qq }}</span>
            </el-form-item>
            <el-form-item label="所在交友圈">
              <span>{{
                  props.row.class | teacherOrManagerFilter(classOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ props.row.addmission_date }}</span>
            </el-form-item>
            <el-form-item label="红娘">
              <span>{{
                  props.row.teacher_id | teacherOrManagerFilter(teacherOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="客服">
              <span>{{
                  props.row.manager_id | teacherOrManagerFilter(managerOptions)
              }}</span>
            </el-form-item>
            <el-form-item label="照片">
              <el-image style="
                  width: 100px;
                  height: 100px;
                  margin-right: 10px;
                  padding: 5px;
                  border: 1px solid #ccc;
                " v-for="(item, index) in props.row.pictures" :key="index" :src="baseUrl + '/upload/' + item"
                :preview-src-list="setSrcList(props.row.pictures)">
              </el-image>
            </el-form-item>
            <el-form-item label="备注信息">
              <span v-html="props.row.note"></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" prop="id" width="60px">
      </el-table-column>
      <el-table-column label="姓名" prop="name"> </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | dataFilter(genderOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="从事行业" prop="direction">
        <template slot-scope="scope">
          <span>{{ scope.row.direction | dataFilter(directionOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone"> </el-table-column>
      <el-table-column label="所在交友圈" prop="class">
        <template slot-scope="scope">
          <span>{{
              scope.row.class | teacherOrManagerFilter(classOptions)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="红娘" prop="teacher_id">
        <template slot-scope="scope">
          <span>{{
              scope.row.teacher_id | teacherOrManagerFilter(teacherOptions)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客服" prop="manager_id">
        <template slot-scope="scope">
          <span>{{
              scope.row.manager_id | teacherOrManagerFilter(managerOptions)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import studentApi from "@/api/student";
import userApi from "@/api/user";
import classApi from "@/api/classs";
import schoolApi from "@/api/school";
import majorApi from "@/api/major";
export default {
  data() {
    return {
      userAll: [],
      baseUrl: process.env.VUE_APP_SERVICE_URL,
      students: [],
      pageSize: 5,
      total: 0,
      currentPage: 1,
      totalPage: 1,
      searchMap: {
        name: "",
        direction: "",
        class: "",
        teacher_id: "",
        manager_id: "",
      },
      search: {
        name: "",
        direction: "",
        class: "",
        teacher: "",
        manager: "",
      },
      genderOptions: [
        { type: "0", name: "男" },
        { type: "1", name: "女" },
      ],
      schoolOptions: [],
      majorOptions: [],
      gradeOptions: [
        { type: "1", name: "五千以下" },
        { type: "2", name: "五千到一万" },
        { type: "3", name: "一万到一万五" },
        { type: "4", name: "一万五到两万" },
        { type: "5", name: "两万以上" },
      ],
      directionOptions: [
        { type: "1", name: "计算机" },
        { type: "2", name: "金融" },
        { type: "3", name: "投资" },
        { type: "4", name: "保险" },
        { type: "5", name: "销售" },
      ],
      educationOptions: [
        { type: "1", name: "专科" },
        { type: "2", name: "本科" },
        { type: "3", name: "硕士" },
        { type: "4", name: "社会" },
      ],
      classOptions: [],
      teacherOptions: [],
      managerOptions: [],
    };
  },
  filters: {
    dataFilter(type, dataOptions) {
      const obj = dataOptions.find((obj) => obj.type == type);
      return obj ? obj.name : null;
    },
    teacherOrManagerFilter(_id, options) {
      const obj = options.find((obj) => obj._id == _id);
      return obj ? obj.name : null;
    },
  },

  components: {},
  mounted() {
    console.log(this.directionOptions);
    this.fetchStudents();
    this.getUserList();
    this.getSchoolList();
    this.getClassList();
    this.getMajorList();
  },

  methods: {
    handleEdit(_id) {
      this.$router.push(`/student/update/${_id}`);
    },
    handleDelete(_id) {
      this.$confirm("确认删除词条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          studentApi.deleteById(_id).then((response) => {
            const res = response.data;
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            if (res.status == 0) {
              // this.totalPage = (this.total - 1) / this.pageSize;
              this.fetchStudents();
            }
          });
        })
        .catch(() => { });
    },
    handleAdd() {
      this.$router.push(`/student/update/-1`);
    },
    searchData() {
      this.currentPage = 1;
      const resTeacher =
        this.userAll.find((item) => item.name == this.search.teacher) || {};
      const resManager =
        this.userAll.find((item) => item.name == this.search.manager) || {};
      if (resTeacher._id) {
        this.searchMap.teacher_id = resTeacher._id;
      } else if (this.search.teacher) {
        this.searchMap.teacher_id = -1;
      } else {
        this.searchMap.teacher_id = "";
      }
      if (resManager._id) {
        this.searchMap.manager_id = resManager._id;
      } else if (this.search.manager) {
        this.searchMap.manager_id = -1;
      } else {
        this.searchMap.manager_id = "";
      }
      this.searchMap.direction = this.search.direction || "";
      this.searchMap.name = this.search.name || "";
      this.searchMap.class = this.search.class || "";
      this.fetchStudents();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      // });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      this.fetchStudents();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchStudents();
      console.log(`当前页: ${val}`);
    },
    setSrcList(imgList) {
      return imgList.map((item) => this.baseUrl + "/upload/" + item);
    },
    fetchStudents() {
      studentApi
        .getStudentList(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          if (resp.status == 0) {
            this.students = resp.data.data;
            this.total = resp.data.total;
            this.totalPage = this.total / this.pageSize;
            console.log("this.students", this.students);
          }
        });
    },
    getClassList() {
      classApi.getClassAll().then((response) => {
        const resp = response.data;
        console.log("classResp", resp);
        if (resp.status == 0) {
          this.classOptions = resp.data;
        }
      });
    },
    getSchoolList() {
      schoolApi.getSchoolAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.schoolOptions = resp.data;
        }
      });
    },
    getMajorList() {
      majorApi.getMajorAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.majorOptions = resp.data;
        }
      });
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
  },
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>