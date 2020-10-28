<template>
<!-- 头部 -->
<el-container class="home_container">
      
  <el-header>
      <div>
          <img class="home_logo" src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <!-- 侧边栏 -->
  <el-container>
    <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
      background-color="#7bb47e"
      text-color="#fff"
      active-text-color="#ccc"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!--二级菜单  -->
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path"
          @click="saveNavState('/'+subItem.path)"> 
            <template slot="title">
        
          <i class="el-icon-edit"></i>
         
          <span>{{subItem.authName}}</span>
        </template></el-menu-item>
          
      </el-submenu>
     
    </el-menu>
    </el-aside>
    <!-- 主体 -->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return {
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'

            },
            //是否折叠
            isCollapse:false,
            //被激活的链接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList(),
        this.activePath = window.sessionStorage.getItem('activePath')
  

    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
       
        },
        //获取所有菜单
         async getMenuList() {
             const {data:res} =await this.$http.get('menus')
             if(res.meta.status!==200)return this.$message.error(res.meta.msg)
             this.menulist = res.data
           
         

          },
          toggleCollapse (){
             this.isCollapse = !this.isCollapse

          },
          //保存链接的激活状态
          saveNavState(activePath){
              window.sessionStorage.setItem('activePath',activePath)
              this.activePath =activePath
          }
    }

}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #c3d0f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:#7bb47e;
    font-size: 24px;
    font-weight: 700;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #c5d9ec;

    i {
        color:#fff
    }
}
.el-main {
    background-color: #eaedf1;
}
.home_container {
    height: 100%;
}
.home_logo {
    width: 50px;
    height: 50px;
}
.el-button {
    background-color: #7bb47e;
}
.iconfont {
    margin-right: 10px;
}
.el-menu {
    border-right:none
}
.toggle-button {
    background-color: #fff;
    color:#7bb47e;
    font-size: 12px;
    text-align: center;
    letter-spacing: .2em;
    line-height: 24px;
    cursor: pointer;
}
</style>
