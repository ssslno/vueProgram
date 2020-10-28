<template>
  <div>
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item  :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>商品管理</el-breadcrumb-item>
   <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
 <!-- 卡片 -->
 <el-card>
     <el-row :gutter="20">
         <el-col :span="8">
               <el-input v-model="queryInfo.query" placeholder="请输入内容"  clearable @clear="getGoodsList">
 <el-button slot="append"  @click="getGoodsList" icon="el-icon-search"></el-button>
  </el-input>
         </el-col>
         <el-col :span="4">
      
         </el-col>
     </el-row>
     <!-- 表格 -->
     <el-table :data="goodsList" border stripe>
       <el-table-column type="index"></el-table-column>
       <el-table-column width="500px" label="商品名称" prop="goods_name"></el-table-column>
       <el-table-column width="130px" label="商品价格(元)" prop="goods_price"></el-table-column>
       <el-table-column width="100px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
     </el-table>
     <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10 , 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            goodsList:[]

        }
    },
    created(){
         this.getGoodsList()
    },
    methods:{
     async getGoodsList(){
          const {data:res} =await this.$http.get('goods',{params:this.queryInfo})
          if(res.meta.status !==200){
              return this.$message.error('商品列表获取失败')
          }
          this.goodsList = res.data
          this.goodsList = res.data.goods
          this.total = res.data.total
      },
      handleSizeChange(newSize){
          this.queryInfo.pagesize =newSize
          this.getGoodsList()
      },
      handleCurrentChange(newPage){
          this.queryInfo.pagenum =newPage
          this.getGoodsList()
      }
    }

}
</script>

<style lang="less" scoped>
.el-button {
 background-color:#7bb47e;
 color:#fff
}

</style>