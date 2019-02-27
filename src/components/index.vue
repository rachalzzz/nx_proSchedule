<template>
  <div class="hd-content" style="text-align:center;font-size:30px;"> 
      <br/><br/>
      <el-input v-model="pUser" style="width:300px" placeholder="请输入用户名"></el-input><br/>
      <el-input v-model="pID"  style="width:300px" placeholder="请输入用户id"></el-input><br/>
      <el-input v-model="p_Jobno"  style="width:300px" placeholder="请输入工序"></el-input><br/><br/>
      <el-button type="primary" @click="getEmpDataBtn">getEmpData</el-button>
      <el-button type="primary" @click="getIDBtn">getpID</el-button><br/><br/><br/>
      <span>pID:{{id}}</span><br/><br/>
      <span>getEmpData:{{EmpData}}</span>
      
  </div>
</template> 
<script>
import { 
  GetEqm,Logon,Logout
} from "./../api/api";
export default {
  data() {
    return {  
      EmpData:null,
      id:'',  
      p_Jobno:'', 

      pUser:'', 
      pPwd:'', 
      pDBPwd:'', 
      pPriv:'', 
      pID:'1256',
    };
  },
  methods: {
    getEmpDataBtn(){ 
      var params = {}; 
      params.pUser  = this.pUser;
      params.pID    = this.pID;
      params.p_Jobno  = this.p_Jobno;
      GetEqm(params).then(data => { 
        if(data== -1){ 
          this.$message.error("获取数据失败，请稍後再試或联系管理员~");
        }else{
          console.log(data,'EmpData')
          this.EmpData=data
        } 
      }).catch(() => { 
        this.$message.error('請求超時，请稍后再试~');
      });
    },
    getIDBtn(){ 
      var params = {}; 
     //Logon(string pUser, string pPwd, string pDBPwd, bool pPriv, long pID)
      params.pUser  = this.pUser;
      params.pPwd   = this.pPwd;
      params.pDBPwd = this.pDBPwd;
      params.pPriv  = this.pPriv;
      params.pID    = this.pID;
      Logon(params).then(data => { 
        if(data== -1){ 
          this.$message.error("获取数据失败，请稍後再試或联系管理员~");
        }else{ 
          this.id=data
          this.$message('请求成功');
        } 
      }).catch(() => { 
        this.$message.error('請求超時，请稍后再试~');
      });
    } ,
    stopTimer(){ 
       this.$confirm('确定要退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      // var params = {}; 
      // params.pUser  = this.pUser;
      // params.pID    = this.pID;
      // params.p_Jobno  = this.p_Jobno;
      // Logout(params).then(data => { 
      //   if(data== -1){ 
      //     this.$message.error("获取数据失败，请稍後再試或联系管理员~");
      //   }else{
      //     console.log(data,'EmpData')
      //     this.EmpData=data
      //   } 
      // }).catch(() => { 
      //   this.$message.error('請求超時，请稍后再试~');
      // });
    },
  },
  mounted() {
    this.getIDBtn();  
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function (e) {
        this.stopTimer();
    } 
  }
};
</script> 