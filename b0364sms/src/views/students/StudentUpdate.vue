<template>
  <div>
    <el-button icon="el-icon-arrow-left" circle @click="$router.replace('/student')"></el-button>
    <el-form :model="updateStudent" :rules="rules" ref="studentForm" class="update-form" label-width="100px"
      label-position="right" style="width: 100%; height: 100%">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateStudent.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="updateStudent.gender" placeholder="请点击选择">
          <el-option v-for="option in genderOptions" :key="option.type" :label="option.name" :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="毕业院校" prop="school">
        <el-autocomplete class="inline-input" v-model="updateStudent.school" :fetch-suggestions="querySearchSchool"
          placeholder="请输入内容"></el-autocomplete>
      </el-form-item>
      <el-form-item label="所在地区" prop="major">
        <el-autocomplete class="inline-input" v-model="updateStudent.major" :fetch-suggestions="querySearchMajor"
          placeholder="请输入内容"></el-autocomplete>
      </el-form-item>
      <el-form-item label="薪资水平" prop="grade">
        <el-select v-model="updateStudent.grade" placeholder="请点击选择">
          <el-option v-for="option in gradeOptions" :key="option.type" :label="option.name" :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="updateStudent.education" placeholder="请点击选择">
          <el-option v-for="option in educationOptions" :key="option.type" :label="option.name" :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="从事职业" prop="direction">
        <el-select v-model="updateStudent.direction" placeholder="请点击选择">
          <el-option v-for="option in directionOptions" :key="option.type" :label="option.name" :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_number">
        <el-input v-model="updateStudent.id_number"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="updateStudent.phone"></el-input>
      </el-form-item>
      <el-form-item label="亲属姓名" prop="parent">
        <el-input v-model="updateStudent.parent"></el-input>
      </el-form-item>
      <el-form-item label="亲属联系电话" prop="parent_phone">
        <el-input v-model="updateStudent.parent_phone"></el-input>
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="updateStudent.address"></el-input>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="updateStudent.qq"></el-input>
      </el-form-item>
      <el-form-item label="所在交友圈" prop="class">
        <el-select v-model="updateStudent.class" placeholder="请点击选择">
          <el-option v-for="option in classOptions" :key="option._id" :label="option.name" :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间" prop="addmission_date">
        <el-date-picker v-model="updateStudent.addmission_date" type="date" placeholder="选择日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="专属红娘" prop="teacher_id">
        <el-select v-model="updateStudent.teacher_id" placeholder="请点击选择">
          <el-option v-for="option in teacherOptions" :key="option._id" :label="option.name" :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服" prop="manager_id">
        <el-select v-model="updateStudent.manager_id" placeholder="请点击选择">
          <el-option v-for="option in managerOptions" :key="option._id" :label="option.name" :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="照片" prop="pictures">
        <!-- <el-input v-model="updateStudent.pictures"></el-input> -->
        <el-upload :action="baseApi + '/manage/img/upload'" list-type="picture-card" :auto-upload="true"
          :file-list="fileList" name="image" accept="image/*" :on-change="handleChange">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="pictureDialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <vue-tinymce v-model="updateStudent.note" :setting="setting"></vue-tinymce>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="
        updateStudent._id == null
          ? addData('studentForm')
          : updateData('studentForm')
      ">确定</el-button>
    </div>
  </div>
</template>

<script>
// import studentApi from "@/api/student";
import userApi from "@/api/user";
import classApi from "@/api/classs";
import schoolApi from "@/api/school";
import majorApi from "@/api/major";
import studentApi from "@/api/student";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      value = value.trim();
      const pwdReg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    var validateIdNumber = (rule, value, callback) => {
      value = value.trim();
      const _IDRe18 =
        /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      const _IDre15 =
        /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
      if (_IDRe18.test(value) || _IDre15.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的身份证号码"));
      }
    };
    return {
      setting: {
        //去除文件栏
        menubar: false,
        //定义工具栏
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        //工具栏模块
        plugins: "link image media table lists fullscreen quickbars imagetools",
        language: "zh_CN", //本地化设置
        height: 350,
      },
      baseApi: process.env.VUE_APP_BASE_API,
      baseUrl: process.env.VUE_APP_SERVICE_URL,
      pictureDialogVisible: false,
      fileList: [],
      dialogImageUrl: "",
      disabled: false,
      updateStudent: {
        name: "", //姓名
        gender: "", //性别
        school: "", //毕业院校
        major: "", //所在地区
        grade: "", //薪资水平
        education: "", //学历
        direction: "", //从事职业
        id_number: "", //身份号码
        phone: "", //电话号码
        parent: "", //亲属姓名
        parent_phone: "", //亲属联系电话
        address: "", //家庭住址
        qq: "", //QQ号码
        class: "", //所在交友圈
        addmission_date: "", //注册时间
        teacher_id: "", //专属红娘id
        manager_id: "", //客服id
        pictures: [], //照片数组
        note: "", //备注信息
      },
      rules: {
        name: [{ required: true, message: "请输入学员姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        direction: [
          { required: true, message: "请选择从事职业", trigger: "blur" },
        ],
        id_number: [
          { required: true, validator: validateIdNumber, trigger: "blur" },
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        class: [{ required: true, message: "请选择所在交友圈", trigger: "blur" }],
        teacher_id: [
          { required: true, message: "请选择授课专属红娘", trigger: "blur" },
        ],
        manager_id: [
          { required: true, message: "请选择客服", trigger: "blur" },
        ],
      },
      userAll: [],
      genderOptions: [
        { type: "0", name: "男" },
        { type: "1", name: "女" },
      ],
      gradeOptions: [
        { type: "1", name: "五千以下" },
        { type: "2", name: "五千到一万" },
        { type: "3", name: "一万到一万五" },
        { type: "4", name: "一万五到两万" },
        { type: "5", name: "两万以上" },
      ],
      directionOptions: [
        { type: "1", name: "web前端" },
        { type: "2", name: "Java" },
        { type: "3", name: "UI/UE" },
        { type: "4", name: "C/C++" },
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
      schoolOptions: [],
      majorOptions: [],
      state1: "",
      state2: "",
    };
  },

  components: {},
  mounted() {
    // this.fetchStudents();
    this.getUserList();
    this.getSchoolList();
    this.getClassList();
    this.getMajorList();
    this.getStudent();
  },
  methods: {
    handleRemove(file) {
      studentApi.reqDeleteImg(file.name).then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.fileList.splice(this.fileList.indexOf(file), 1);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.pictureDialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      if (file.status == "success") {
        const result = file.response;
        if (result.status == 0) {
          const { name, url } = result.data;
          file = fileList[fileList.length - 1];
          file.name = name;
          file.url = url;
        }
        this.fileList = fileList;
      }
    },
    querySearchSchool(queryString, cb) {
      var schoolOptions = this.schoolOptions;
      var results = queryString
        ? schoolOptions.filter(this.createFilter(queryString))
        : schoolOptions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchMajor(queryString, cb) {
      var majorOptions = this.majorOptions;
      var results = queryString
        ? majorOptions.filter(this.createFilter(queryString))
        : majorOptions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    getImgs() {
      return this.fileList.map((file) => file.name);
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateStudent.pictures = this.getImgs();
          studentApi.add(this.updateStudent).then((response) => {
            const resp = response.data;
            if (resp.status == 0) {
              this.$router.replace("/student");
            }
          });
        } else {
          return false;
        }
      });
    },
    getStudent() {
      const { _id } = this.$route.params;
      if (_id !== "-1") {
        studentApi.getById(_id).then((response) => {
          const resp = response.data;
          if (resp.status == 0) {
            this.updateStudent = resp.data;
            const { pictures } = resp.data;
            if (pictures && pictures.length > 0) {
              this.fileList = pictures.map((img, index) => ({
                name: img,
                url: this.baseUrl + "/upload/" + img,
                status: "success",
                uid: -index,
              }));
            }
          }
        });
      }
    },
    updateData(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].validate((valid) => {
        console.log(this.updateStudent);
        if (valid) {
          this.updateStudent.pictures = this.getImgs();
          studentApi.update(this.updateStudent).then((response) => {
            const resp = response.data;
            console.log(resp);
            if (resp.status == 0) {
              console.log('111')
              this.$router.replace("/student");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
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
          const arr = resp.data;
          for (let i = 0; i < arr.length; i++) {
            this.schoolOptions[i].value = arr[i].schoolname;
          }
        }
      });
    },
    getMajorList() {
      majorApi.getMajorAll().then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          this.majorOptions = resp.data;
          const arr1 = resp.data;
          for (let i = 0; i < arr1.length; i++) {
            this.majorOptions[i].value = arr1[i].majorname;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 380px;
}
</style>