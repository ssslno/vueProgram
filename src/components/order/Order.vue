<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item  :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>订单管理</el-breadcrumb-item>
   <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
      <!-- 由于接口错误 功能无法实现 -->
      <!-- <el-row>
          <el-col :span="8">
              <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
          </el-col>

      </el-row> -->
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="order_pay">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.pay_status ==='1'" type="success">已付款</el-tag>
                  <el-tag v-else>未付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
              <template slot-scope="scope">
                  {{scope.row.create_time | dateFormat}}

              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button size="mini" @click="showBox" style="backgroundColor:#b7ccf1;color:#fff" icon="el-icon-edit"></el-button>
                  <!-- <el-button size="mini" @click="showProgressBox" style="backgroundColor:#7bb47e;color:#fff" icon="el-icon-location"></el-button> -->
              </template>
          </el-table-column>


      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 修改地址对话框 -->
  <el-dialog
  title="修改地址"
  :visible.sync="addressVisible"
  width="50%"
  @close="addressDialogClose"
 >
<el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
  <el-form-item label="省市区/县" prop="address1">
  <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
  </el-form-item>
   <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 展示物流进度 -->
<!-- <el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%"
 >
  <span>这是一段信息</span> -->
  
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderList:[],
            // 展示修改对话框
            addressVisible:false,
           addressForm:{
                address1:[],
                address2:''
           },
            addressFormRules:{
                address1:[{ required: true, message: '请选择省市区/县',
                 trigger: 'blur' }],
                 address2:[{ required: true, message: '请填写详细地址',
                 trigger: 'blur' }]
            },
            cityData,
            progressVisible:false,
            // 展示物流单号
            // progressInfo:[]
        }
     
    },
       created(){
            this.getOrderList()
        },
        methods:{
          async  getOrderList(){
               const {data:res} = await this.$http.get('orders',
               {params:this.queryInfo})
               if(res.meta.status !==200){
                   return this.$message.error('获取订单列表失败')
               }
              console.log(res);
              this.orderList = res.data.goods
              this.total =res.data.total
               
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getOrderList()

            },
            // 展示修改地址对话框
            showBox(){
                this.addressVisible =true

            },
            addressDialogClose(){
                this.$refs.addressFormRef.resetFields()
            },
        //     // 展示物流对话框 接口错误
        //    async showProgressBox(){
        //       const {data:res} =await this.$http.get('/kuaidi/1106975712662')
        //       if(res.meta.status !==200){
        //           return this.$message.error('获取物流信息失败')
        //       }
        //       this.progressInfo =res.data
        //       console.log(this.progressInfo);
        //       this.progressVisible =true

        //     }
            
        }

}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}

</style>