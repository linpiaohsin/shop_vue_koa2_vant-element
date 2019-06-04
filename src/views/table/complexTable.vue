<template>
  <div class="app-container">
    
    <el-table
    :data="shoppingList"
    stripe
    style="width: 100%">
    <el-table-column
      prop="createDate"
      label="订单日期"
      width="250">
    </el-table-column>
    <el-table-column
      prop="name"
      label="商品名称"
      width="280">
    </el-table-column>
    <el-table-column
      width="150"
      label="订单金额">
      <template slot-scope="scope">
        <span >¥{{scope.row.price}}</span>
      </template>
    </el-table-column>
    <el-table-column
    width="200"

    label="商品图片">
    <template slot-scope="scope">
      <img :src="scope.row.image" width="50px" height="50px"/>
    </template>
    </el-table-column>
    <el-table-column
    prop="count"
    width="100"
    label="商品数量">
    </el-table-column>
    <el-table-column
    label="当前状态">
    <template slot-scope="scope">
      <!-- <el-button v-if='scope.row.status==0' type="info">待发货</el-button>
      <el-button v-if='scope.row.status==1' type="info">申请退款</el-button>
      <el-button v-if='scope.row.status==2' type="info">待收货</el-button>
      <el-button v-if='scope.row.status==3' type="warning">已退款</el-button>
      <el-button v-if='scope.row.status==4' type="success">待评价</el-button> -->
      <span v-if='scope.row.status==0'>待发货</span>
      <span v-if='scope.row.status==1'>申请退款</span>
      <span v-if='scope.row.status==2'>已发货</span>
      <span v-if='scope.row.status==3'>已退款</span>
      <span v-if='scope.row.status==4'>待评价</span>
    </template>
    </el-table-column>
    <el-table-column
    label="操作">
    <template slot-scope="scope">
      <el-button v-if='scope.row.status==0' type="primary" @click="sentGoods(scope.row._id)">发货 </el-button>
      <el-button v-else-if='scope.row.status==1' type="danger" @click="agreeRefund(scope.row._id)">退款 </el-button>
      <el-button v-else type="info" plain="" disabled>完成</el-button>


      
    </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    @size-change="handleSizeChange"
    :current-page.sync="page"
    @current-change="handleCurrentChange"
    layout="prev, pager, next, jumper"
    :total="shoppingListCount">
  </el-pagination>
      

  </div>
</template>

<script>
import axios from 'axios'
import url from '@/serviceApi.config.js'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      page:1,
      shoppingListCount:1,
      shoppingList:[],
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
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    // this.getList()
    this.initShoppingMsg()
    
  },
  methods: {
    sentGoods(id){
      console.log('===>',id);
      
      axios({
        url:url.sentGoods,
        method:'post',
        data:{
          goodId:id
        }
        }).then(response=>{
        if(response.data.message&&response.data.code == 200){
          this.$message('向买家发货成功')
          this.initShoppingMsg()
        }else{
          this.$message('error')
        }
      })
    },
    agreeRefund(id){
      console.log('===>',id);

      axios({
        url:url.agreeRefundGoods,
        method:'post',
        data:{
          goodId:id
        }
      }).then(response=>{
        if(response.data.message&&response.data.code == 200){
          this.$message('已同意买家退款')
          this.initShoppingMsg()
        }else{
          this.$message('error')
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(this.page);
      this.initShoppingMsg()

    },
    initShoppingMsg(){
      axios({
        url:url.getBuyMsg,
        method:'post',
        data:{
          page:this.page
        }

      }
      ).then(response=>{
        if(response.data.message&&response.data.code == 200){
            this.shoppingList = response.data.message
            this.shoppingListCount = response.data.count.length
         
            
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
