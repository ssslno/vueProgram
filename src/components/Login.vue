<template>
  <div class="login_container">
      <div class="login_box">
          <div class="avatar_box">
              <img src="../assets/logo.png" alt="">
          
          </div>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
           <el-form-item prop="username" >
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
         </el-form-item>
         <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"
            type="password"></el-input>
         </el-form-item>
        
         <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
         </el-form-item>
          </el-form>
      </div>

  </div>
</template>

<script>
export default {
    name:'Login',
    data(){
        return {
            //登录表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456',
            },
            //表单的验证规则对象
            loginFormRules:{
                username:[
                    { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                password:[
                     { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }

        }
    },
    methods:{
        //点击重置按钮 重置表单
        resetLoginForm(){
           this.$refs.loginFormRef.resetFields()

        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
            if(!valid) return 
            const {data:res}=await this.$http.post('login',this.loginForm);
            if(res.meta.status!==200) return this.$message.error('登录失败')
         
          window.sessionStorage.setItem('token',res.data.token);//保存token值
          this.$router.push('/home')

      

            })
        }
    }

}
</script>

<style lang="less" scoped>
.login_container {
     height: 100%;
     background-color: #b7ccf1;
    
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

}
.avatar_box{
    height: 100px;
    width: 100px; 
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    img {
        width: 80%;
        height: 80%;    
        text-align: center;
    }  
}
.primary{
    background-color:#b7ccf1;


}
.btns {
    display: flex;
    justify-content: flex-end;
}
.login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
}




</style>