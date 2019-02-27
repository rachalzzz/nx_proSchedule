<template>
  <div class="nx_ws" :style="'height:' + wheight + 'px' ">
      <div class="login">
        <div class='header'>生產產能系統</div>
        <el-form :model="form">
          <el-form-item >
            <el-input v-model="form.name" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.pwd" type="password"></el-input>
          </el-form-item> 
           <el-button type="primary" @click="tologin">登录</el-button>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
      return { 
        wheight:'',
        form: {
          name: 'DEV', 
          pwd: '123456'
        }
      }
  } ,
  methods: { 
    tologin(){
      this.$router.push({ path: "/kanban" }); 
    },
    //獲取數據 
    geth(){ 
  　　　 this.wheight=window.innerHeight;  
  　}
  },
  created(){
　　this.geth()  
  },
  mounted() {  
  } 
}


</script> 
<style scoped>
 .nx_ws{ width: 100%;height:100%; overflow: hidden; }
 .login{ width: 100%; height: 290px; margin-top:10%;        
  opacity: 0.9;text-align: center;padding-top:50px;
  background: linear-gradient(to bottom right, #3392f5 0%, #80bdfd 100%);}
  .el-input {      
    background-color: rgba(255, 255, 255, 0.2);
    width: 300px;
    border-radius: 3px; 
    margin: 0 auto 10px auto; 
    font-size: 18px;
    color: white; 
    font-weight: 300;}
  .el-button{ width: 300px;border-radius: 3px;  background: white; color: #3392f5; }
  .header{ color:#fff;font-size: 30px; margin-bottom:20px;}
</style>
