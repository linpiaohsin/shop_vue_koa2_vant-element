<template>
  <div class="app-container">
    <div>
      <el-input
        placeholder="输入商品名称"
        v-model="goodsName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="addGoods">添加</el-button>
    </div>
    <el-table :data="shoppingList" stripe style="width: 100%">
      <el-table-column prop="NAME" label="商品名称" width="250"></el-table-column>

      <el-table-column width="150" label="商品单价">
        <template slot-scope="scope">
          <span>¥{{scope.row.PRESENT_PRICE}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.IMAGE1" width="50px" height="50px">
        </template>
        <!-- <template slot-scope="scope">
 
      <div v-html="scope.row.DETAIL"></div>
        </template>-->
      </el-table-column>
      <el-table-column prop="AMOUNT" width="150" label="库存数量"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="openDetail(scope.row.DETAIL)">查看详情</el-button>
          <el-button type="info" plain @click="modifyDetail(scope.row.ID)">修改</el-button>
          <el-button type="warning" plain @click="deleteDetail(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- add Goods Form -->
    <el-dialog title="添加生鲜" :visible.sync="formVisible">
      <el-form v-model="form">
        <el-form-item label="商品编号(唯一)" :label-width="formLabelWidth">
          <el-input v-model="form.ID" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.NAME" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="form.PRESENT_PRICE" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="form.AMOUNT" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="请选择一级菜单" @change="getCategorySub">
            <el-option
              v-for="(item,index) in categooryList"
              :key="index"
              :label="item.MALL_CATEGORY_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
          <el-select v-model="form.SUB_ID" placeholder="请选择二级菜单" >
            <el-option
              v-for="(item,index) in categorySubList"
              :key="index"
              :label="item.MALL_SUB_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload
            :file-list="file"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情图片" :label-width="formLabelWidth">
          <el-upload
            :file-list="fileList"
            class="avatar-uploader"
            :action="uploadUrl"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            list-type="picture-card"
            :data="uploadData"
            :on-success="handleSuccess"
            :on-error="uploadError"
            :before-upload="beforeAvatarUpload"
            :on-preview="doLookImg"
            :on-remove="doDeleteImg"
          >
            <i class="el-icon-plus" style="width:10px;height:10px"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFresh">确 定</el-button>
      </div>
    </el-dialog>
    <!-- edit form -->
    <el-dialog title="编辑生鲜" :visible.sync="editFormVisible">
      <el-form v-model="form1">
        <el-form-item label="商品编号(唯一)" :label-width="formLabelWidth">
          <el-input v-model="form1.ID" autocomplete="off" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form1.NAME" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="form1.PRESENT_PRICE" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="form1.AMOUNT" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-select v-model="form1.category" placeholder="请选择一级菜单" @change="getCategorySub">
            <el-option
              v-for="(item,index) in categooryList"
              :key="index"
              :label="item.MALL_CATEGORY_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
          <el-select v-model="form1.SUB_ID" :label='form1.SUB_ID' placeholder="请选择二级菜单">
            <el-option
              v-for="(item,index) in categorySubList"
              :key="index"
              :label="item.MALL_SUB_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload
            v-model="form1.DETAIL"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情图片" :label-width="formLabelWidth">
          <div v-html="imgList" style="width:200px">

          </div>
          <el-upload
            :file-list="fileList"
            class="avatar-uploader"
            :action="uploadUrl"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            list-type="picture-card"
            :data="uploadData"
            :on-success="handleSuccess"
            :on-error="uploadError"
            :before-upload="beforeAvatarUpload"
            :on-preview="doLookImg"
            :on-remove="doDeleteImg"
          >
            <i class="el-icon-plus" style="width:10px;height:10px"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureToModify">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生鲜页详情" :visible.sync="dialogVisible" width="30%">
      <div v-html="images"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      background
      @size-change="handleSizeChange"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="shoppingListCount"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceApi.config.js";
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import upload from "@/components/ImageUpload.vue";
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination, upload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      file:[],
      editFormVisible: false,
      imgsUrl: "",
      uploadData: { key: "", token: "" },
      formAdd: { brandLogo: "" },
      form: {
        NAME: "",
        PRESENT_PRICE: "",
        AMOUNT: "",
        category: "",
        SUB_ID: "",
        IMAGE1: ""
      },
      form1: {
        NAME: "",
        PRESENT_PRICE: "",
        AMOUNT: "",
        category: "",
        SUB_ID: "",
        IMAGE1: ""
      },
      goodsName:'',
      imgList:'',
      uploadUrl: url.uploadfile,
      imageUrl: "",
      imageUrls: "",
      categorySubList: [],
      categooryList: [],
      fileList: [],
      formLabelWidth: "120px",
      formVisible: false,
      images: "",
      dialogVisible: false,
      page: 1,
      shoppingListCount: 1,
      shoppingList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      filePath: "",
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  mounted() {
    // this.getList()
    this.initShoppingMsg();
  },
  methods: {
    sureToModify(id){
      axios({
        url:url.sureToModify,
        method:'post',
        data:{
          goodsMsg : this.form1
        }
      }).then(res=>{
        if(res.data.message&&res.data.code == 200){
            this.$message('更新成功')
        }
      })
      this.editFormVisible = false
      this.initShoppingMsg()
    },
    modifyDetail(id) {
      this.editFormVisible = true;
      axios({
        url:url.editGoods,
        method:'post',
        data:{
          id:id
        }
      }).then(res=>{
        if(res.data.code == 200&&res.data.message){
          this.form1 = res.data.message
          this.imageUrl = this.form1.IMAGE1
          this.imgList = this.form1.DETAIL
 
        }
      })
    },
    deleteDetail(id) {
      console.log(id);
      axios({
        url: url.deleteGoods,
        method: "post",
        data: { id: id }
      }).then(res => {
        console.log(res);
        if (res.data.code == 200 && res.data.message) {
          this.$message(res.data.message);
        } else {
          this.$message(res.data.message);
        }
      });
      this.initShoppingMsg();
    },
    doDeleteImg(file, fileList) {
      console.log("删除成功", file, fileList);
      let logoAry;
      let key;
      if (this.editState) {
        logoAry = this.mainInfo.brandLogo.split("/");
      } else {
        logoAry = this.formAdd.brandLogo.split("/");
      }
      key = logoAry[logoAry.length - 1];
      deleteQiniuImg({ key }).then(res => {
        if (res.code === "0") {
          if (this.editState) {
            this.mainInfo.brandLogo = "";
          } else {
            this.formAdd.brandLogo = "";
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    doLookImg() {
      this.uploadDialogVisible = true;
      this.uploadDialogImg = this.editState
        ? this.mainInfo.brandLogo
        : this.formAdd.brandLogo;
    },
    handleSuccess(res, file, fileList) {
      this.imageUrls = URL.createObjectURL(file.raw);
      // console.log(res);
      if (res.message && res.code == 200) {
        this.imgsUrl = this.imgsUrl.concat(
          '<img src="' + res.imgUrl + '" width="100%" height="auto" alt="" />'
        );
        console.log(this.imgsUrl);
      }
    },
    beforeAvatarUpload(file) {
      console.log(file, "beforeAvatarUpload");
      // var observable = qiniu.upload(file, key, token, putExtra, config)
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      this.uploadData.key = `upload_pic_${new Date().getTime()}_${file.name}`;
    },
    uploadError(err, file, fileList) {
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    addFresh() {
      this.formVisible = false;
      axios({
        url: url.addGoods,
        method: "post",
        data: {
          NAME: this.form.NAME,
          PRESENT_PRICE: this.form.PRESENT_PRICE,
          AMOUNT: this.form.AMOUNT,
          // category :this.form.category,
          SUB_ID: this.form.SUB_ID,
          IMAGE1: this.filePath,
          ID: this.form.ID,
          DETAIL: this.imgsUrl
        }
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.$message(response.data.message);
          this.initShoppingMsg();
        } else {
          this.$message(response.data.message);
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      if (res.message && res.code == 200) {
        this.filePath = res.imgUrl;
        console.log(this.filePath);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    add() {
      axios({
        url: url.uploadfile,
        method: "post",
        data: {
          file: file
        }
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.$message("添加商品成功");
          this.initShoppingMsg();
        } else {
          this.$message("error");
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    openDetail(images) {
      this.dialogVisible = true;
      this.images = images;
    },
    sentGoods(id) {
      console.log("===>", id);

      axios({
        url: url.sentGoods,
        method: "post",
        data: {
          goodId: id
        }
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.$message("向买家发货成功");
          this.initShoppingMsg();
        } else {
          this.$message("error");
        }
      });
    },
    addGoods() {
      this.formVisible = true;
      axios({
        url: url.goodsCategory,
        method: "get"
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.categooryList = response.data.message;
          
          // console.log(this.categooryList);
        }
      });
    },
    getCategorySub() {
      axios({
        url: url.goodsCategorySub,
        method: "post",
        data: {
          categoryId: this.form.category
        }
      }).then(response => {
        // console.log(this.form.category);

        if (response.data.message && response.data.code == 200) {
          this.categorySubList = response.data.message;
        }
      });
    },
    agreeRefund(id) {
      console.log("===>", id);

      axios({
        url: url.agreeRefundGoods,
        method: "post",
        data: {
          goodId: id
        }
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.$message("已同意买家退款");
          this.initShoppingMsg();
        } else {
          this.$message("error");
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(this.page);
      this.initShoppingMsg();
    },
    initShoppingMsg() {
      axios({
        url: url.getAllGoods,
        method: "post",
        data: {
          page: this.page
        }
      }).then(response => {
        if (response.data.message && response.data.code == 200) {
          this.shoppingList = response.data.message;
          this.shoppingListCount = response.data.count;
        }
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      axios({
        url:url.serchGoods,
        method:'post',
        data:{
          name:this.goodsName
        }
      }).then(res=>{
        if(res.data.message&&res.data.code == 200){
            this.shoppingList = res.data.message
            this.shoppingListCount = this.shoppingList.length;
        }
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style sccope>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
