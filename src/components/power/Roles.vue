<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item  :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
   <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片 -->
  <el-card>
    <el-button @click="rolesDialogVisible=true">添加角色</el-button>
    <el-table :data="rolesList" stripe>
        <!-- 展开权限 -->
      <el-table-column width="120px" label="查看权限" type="expand" >
    
        <template slot-scope="scope" >
          <el-row :class="['bdbottom',i1 === 0?'bdtop':'','vcenter']" 
          :key="item1.id" v-for="(item1,i1) in scope.row.children">
          
            <el-col :span="5">
            <el-tag closable type="info" @close="removeRightById(scope.row,item1.id)">  {{item1.authName}}</el-tag><i class="el-icon-arrow-right"></i>
            </el-col>
      
            <el-col :span="19">
            
              <el-row :class="[ i2 ===0? '':'bdtop','vcenter']" 
              :key="item2.id" v-for="(item2,i2) in item1.children" >
                <el-col :span="6">
                  <el-tag closable @close="removeRightById(scope.row,item2.id)" >{{item2.authName}}</el-tag><i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                 
                  <el-tag @close="removeRightById(scope.row,item3.id)" type="success" :class="[ i3 ===0? '':'bdtop']" 
                   closable :key="item3.id" v-for="(item3,i3) in item2.children">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
               


      <el-table-column  label="编号" width="80px" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
       <el-table-column label="操作" width="400px" >
        <template slot-scope="scope">
           <el-button @click="editRoleList(scope.row.id)" size="mini" type="primary" plain ><i class="el-icon-edit"></i>编辑</el-button>
          <el-button @click="deleteRoleList(scope.row.id)" size="mini" type="success" plain><i class="el-icon-delete"></i>删除</el-button>
          <el-button @click="showSetRightDialog(scope.row)" size="mini" type="info" plain><i class="el-icon-user"></i>分配权限</el-button>
        </template>
       </el-table-column>
    </el-table>
  </el-card>
<!-- 添加角色对话框 -->
<el-dialog
  title="添加角色"
  :visible.sync="rolesDialogVisible"
  width="30%"
  @close="resetDialogClosed"
  >
   <el-form ref="addRolesRef" :model="addRoles" label-width="80px" >
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRoles.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input  v-model="addRoles.roleDesc"></el-input>
  </el-form-item>
  </el-form> 
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleList">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改对话框 -->
<el-dialog
  title="编辑角色"
  :visible.sync="editDialogVisible"
  width="30%"
  @close="editDialogClosed"
  >
   <el-form ref="editRolesRef" :model="editForm" label-width="80px" >
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input  v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form> 
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addEditRoles">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限对话框 -->
<el-dialog
  title="提示"
  :visible.sync="setRightdialogVisible"
  width="50%"
  @close="setRightDialogClosed"
  >
  <el-tree ref="treeRef" :data="rightsList" :default-checked-keys="defKeys"
   :props="treeProps" node-key="id" default-expand-all show-checkbox></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    return {
      rolesList:[],
      rolesDialogVisible:false,
      addRoles:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      editForm:{},
      editDialogVisible:false,
       setRightdialogVisible:false,
      //  所有权限的数据
       rightsList:[],
      //  树形控件
       treeProps:{
         label:'authName',
         children:'children'
       },
      //  默认选中节点的id值数组
       defKeys:[],
      //  当前即将分配角色的id
       roleId:'',
       
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    //获取角色列表
  async  getRolesList(){
     const {data:res} = await this.$http.get('roles')
     if(res.meta.status !==200){
       return this.$message.error('获取角色列表失败')
     }
     this.rolesList = res.data
    },
    //关闭重置添加角色对话框
   resetDialogClosed(){
      this.$refs.addRolesRef.resetFields()
    },
    //添加用户
   async  addRoleList(){
    const {data:res}=  await this.$http.post('roles',this.addRoles)
    if(res.meta.status !==201){
      return this.$message.error('添加用户失败')
    }
    this.$message.success('添加用户成功')
    this.rolesDialogVisible = false;
    this.getRolesList()
    },
    //编辑对话框
      async editRoleList (id){
      const {data:res} =await this.$http.get('roles/'+id)
      if (res.meta.status !==200){
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data;
      this.editDialogVisible = true

  },
    //监听编辑对话框关闭
    editDialogClosed(){
      this.$refs.editRolesRef.resetFields()
    },
    //编辑角色
    async addEditRoles(){
    
       const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
         roleName:this.editForm.roleName,
         roleDesc:this.editForm.roleDesc
       }) 
        if(res.meta.status !==200) {
          return this.$message.error('修改用户失败')
        }
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success('修改用户成功')
      },
      //删除用户
     async deleteRoleList(id){
       const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //如果用户确认删除，返回字符串'confirm'
        //如果用户取消了删除，返回字符串cancel
      //console.log(confirmResult);
        if(confirmResult !=='confirm'){
          return this.$message('已经取消删除')
        }
        const {data:res} = await this.$http.delete('roles/'+id)
        if(res.meta.status !==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getRolesList()
      },
      //根据id删除对应的权限

     async removeRightById(role,rightId){
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        if(confirmResult !=='confirm'){
          return this.$message.info('取消了删除')
        }
      const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
       if(res.meta.status !==200){
          return this.$message.error('删除失败')
        }
        role.children = res.data
      },
      // 展示分配权限对话框
     async showSetRightDialog(role){
       this.roleId =role.id
       
        // 获取所有权限列表
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status !==200){
          this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
        console.log(this.rightsList);
        //递归获取三级节点
        this.getLeafKeys(role,this.defKeys)
         this.setRightdialogVisible =true
      },
      // 通过递归形式获取角色下所有三级权限id
      getLeafKeys(node,arr){
        if(!node.children){
          // 如果当前node节点不包含children属性 则是三级节点
          return arr.push(node.id)
        }
        // 递归
        node.children.forEach(item =>{
          this.getLeafKeys(item,arr)
        })

      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed(){
        this.defKeys = []
      },
      // 点击为角色分配权限
     async allotRights(){
        const keys = [...this.$refs.treeRef.getCheckedKeys(),
       ... this.$refs.treeRef.getHalfCheckedKeys()]
       const idStr =keys.join(',')
     const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status !==200){
          return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightdialogVisible =false
      },
      // 展示分配角色
     
      }

}
</script>
<style lang="less" scoped>
.el-button:first-child {
    background-color: #b7ccf1;
    color:#fff
}
.el-tag{
  margin:7px
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}


</style>