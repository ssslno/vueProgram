<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item  :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>商品管理</el-breadcrumb-item>
   <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片 -->
  <el-card>
      <el-row>
          <el-col>
           <el-button @click="showAddCateDialog">
               添加分类
           </el-button>
          </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns"
      :selection-type="false" :expand-type ="false" :show-index="true"
       index-text="#" border>
       <template slot="isok" slot-scope="scope">
           <i class="el-icon-success" style="color:#7bb47e"
            v-if="scope.row.cat_deleted ===false"></i>
           <i class="el-icon-error" style="color:#ccc" v-else></i>
       </template>
       <!-- 排序 -->
       <template slot="order" slot-scope="scope">
           <el-tag size="mini" type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
           <el-tag size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
           <el-tag size="mini" type="info" v-else>三级</el-tag>
       </template>
       <!-- 操作 删除列slot-scope="scope" -->
       <template slot="opt" slot-scope="scope" >
           <!-- <el-button size="mini" @click="showEditCateDialog(scope.row.cat_id)" >编辑</el-button> -->
           <el-button size="mini" @click="cateDelete(scope.row.cat_id)" style="background:#b7ccf1">删除</el-button>
       </template>
        
      </tree-table>


      <!-- 分页区 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog
  title="添加分类"
  :visible.sync="addCatDialogVisible"
  width="50%"
  @close="addCateDialogClosed"
  >
  <!-- 添加分类的表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules"
   ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
      <!-- options用来指定数据源 -->
      <!--  -->
      <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',
    children:'children',checkStrictly:true }"
    @change="parentCateChanged"
    clearable ></el-cascader>

  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
              // 分页数据
            querInfo:{
                type:3,
                pagenum:1,
               pagesize:5
            },
            // 商品分类数据列表
            cateList:[],
            total:0,
            //为tree-table指定列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                // 表示将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'isok'
            },{
                label:'排序',
                // 表示将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'order'

            },
            {
                label:'操作',
                // 表示将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'opt'

            }
            ],
            addCatDialogVisible:false,
            // 添加分类的表单
            addCateForm:{
                cat_name:'',
                // 父级分类id
                cat_pid:0,
                // 分类等级，默认要添加的是1级分类
                cat_level:0
            },
            // 添加分类表单的验证规则
            addCateFormRules:{
                cat_name:[
                  { required: true, message: '请输入分类名称', trigger: 'blur' },
  
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 选中的父级分类的id数组
            selectedKeys:[]


        }
    },
    created(){
        this.getCateList()

    },
    methods:{
        // 获取商品分类数据
      async  getCateList(){
           const {data:res} =await this.$http.get('categories',
           {params:this.querInfo})
           if(res.meta.status !==200) {
               return this.$message.error('获取商品列表失败')
           }
         
           console.log(res);
           this.cateList = res.data.result
           this.total = res.data.total
           
           
        },
        // 监听分页 pagesize改变
        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum改变
        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮展示添加分类对话框
        showAddCateDialog(){
            // 获取父级分类列表
           this.getParentCateList()
            // 再展示对话框
            this.addCatDialogVisible = true
        },
        //  添加对话框里获取父级分类列表
     async getParentCateList(){
           const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !==200){
                return this.$message.error('获取列表失败')
            }
            console.log(res.data);
            this.parentCateList = res.data
        },
        // 选择项发送变化时触发这个函数
        parentCateChanged(){
            console.log(this.selectedKeys);
            // 如果selectedKeys数组中的length大于0，证明选中了父级分类，
            //反之，说明没有选中任何父级分类
            if(this.selectedKeys.length >0){
                // 父级分类的id
               this.addCateForm.cat_pid =
                this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }
            else{
                  this.addCateForm.cat_pid =0
  
            // 为当前分类的等级赋值
                this.addCateForm.cat_level =0

            }

        },
        // 点击按钮，添加新的分类
       addCate(){
           this.$refs.addCateFormRef.validate(async valid =>{
                // 带有校验的添加
            if(!valid) return 
           const {data:res} = await this.$http.post('categories',this.addCateForm)
           if(res.meta.status !==201){
               return this.$message.error('添加分类失败')
           }
           this.$message.success('添加分类成功')
           this.getCateList()
            this.addCatDialogVisible = false
           })
           
        },
        //监听对话框关闭
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys =[]
            this.addCateForm.cat_level =0
            this.addCateForm.cat_pid = 0
        },
       async cateDelete(id){
            //根据id删除用户
  
    const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        //如果用户确认删除，返回字符串confirm
        //如果用户取消了删除，返回字符串cancel
      //console.log(confirmResult);
      if(confirmResult !=='confirm'){
        return this.$message('已经取消删除')
      }
     const {data:res} = await this.$http.delete('categories/'+id)
     if(res.meta.status !==200){
       return this.$message.error('删除失败')
     }
     this.$message.success('删除用户成功')
     this.getCateList()

    },
    // 编辑功能
    showEditCateDialog(){

    }       
     }
    }
    


</script>

<style lang="less" scoped>
.el-button {
    background-color: #7bb47e;
    color:#fff
}
.treeTable{
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}


</style>