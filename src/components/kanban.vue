<template>
  <div class="nx_ws">
    <el-table :data="tableData" stripe>
      <el-table-column  prop="p_no"    label="生產批號" align="center"></el-table-column>
      <el-table-column  prop="p_name"  label="款式名稱" align="center"></el-table-column>
      <el-table-column  prop="p_Jobno" label="生產工序" align="center"></el-table-column> 
      <el-table-column  prop="p_eqm"   label="生產線"   align="center"></el-table-column>  
      <el-table-column  prop="j_num"   label="計劃數量" align="center"></el-table-column>
      <el-table-column  prop="a_num"   label="目標數量" align="center"></el-table-column>
      <el-table-column  prop="p_num"   label="生產數量" align="center"></el-table-column> 
      <el-table-column  prop="p_speed" label="生產速度" align="center"></el-table-column> 
      <el-table-column  prop="s_speed" label="標準速度" align="center"></el-table-column> 
      <el-table-column  prop="per"     label="百分比"   align="center"></el-table-column>  
      <el-table-column  label="標識">
        <template slot-scope="scope"> 
          <img v-if="scope.row.icon==1" src="../assets/up.png" style="width:18px"/>
          <img v-if="scope.row.icon==2" src="../assets/down.png"  style="width:18px"/> 
        </template>
      </el-table-column>
      <el-table-column  prop="state"   label="狀態"></el-table-column>
    </el-table>

    <el-button type="primary"  @click="goNext"  style="margin:200px ">生產確認頁</el-button>
  </div>
  
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
     tableData: [
        {
          p_no: 'CC18087089', p_name: '測試1', p_Jobno: '織片',p_eqm: 'SH18', j_num: '50000',a_num:'50000',p_num: '35789', p_speed: '80分/件', s_speed: '65分/件',per:'20%',icon: '1',state: ''
        },
        {
          p_no: 'NC18080169',
          p_name: '測試2',
          p_Jobno: '織片',
          p_eqm: 'SH18', 
          j_num: '21000',a_num:'21000',
          p_num: '56800', 
          p_speed: '70分/件',
          s_speed: '90分/件',per:'20%',
          icon: '2',
          state: '排產' 
        },
        {
          p_no: 'NC18080169',
          p_name: '測試3',
          p_Jobno: '縫盤',
          p_eqm: 'SH18', 
          j_num: '80000',a_num:'80000',
          p_num: '56800', 
          p_speed: '70分/件',
          s_speed: '90分/件',per:'20%',
          icon: '2',
          state: '待料', 
        } ,
        {
          p_no: 'FM18087089',
          p_name: '測試4',
          p_Jobno: '查片',
          p_eqm: 'SH12', 
          j_num: '56000',a_num:'56000',
          p_num: '35789', 
          p_speed: '80分/件',
          s_speed: '65分/件',per:'40%',
          icon: '1',
          state: '', 
        },{
          p_no: 'CC18080154',
          p_name: '測試2',
          p_Jobno: '織片',
          p_eqm: 'SH18', 
          j_num: '21000',a_num:'21000',
          p_num: '56800', 
          p_speed: '70分/件',
          s_speed: '90分/件',per:'20%',
          icon: '2',
          state: '排產' 
        },
        {
          p_no: 'NC18080163',
          p_name: '測試23',
          p_Jobno: '縫盤',
          p_eqm: 'SH18', 
          j_num: '67000',a_num:'67000',
          p_num: '56800', 
          p_speed: '70分/件',
          s_speed: '90分/件',per:'60%',
          icon: '1',
          state: '', 
        } ,{
          p_no: 'CC18080219',
          p_name: '測試22',
          p_Jobno: '織片',
          p_eqm: 'SH18', 
          j_num: '21000',a_num:'21000',
          p_num: '56800', 
          p_speed: '70分/件',
          s_speed: '90分/件',per:'40%',
          icon: '1',
          state: '' 
        },
        {
          p_no: 'NC18080349',
          p_name: '測試3',
          p_Jobno: '挑撞',
          p_eqm: 'SH18', 
          j_num: '54000',a_num:'54000',
          p_num: '56800', 
          p_speed: '44分/件',
          s_speed: '22分/件',per:'70%',
          icon: '1',
          state: '', 
        } 
      ]
    };
  },
  methods: {
    goNext(){
      this.$router.push({ path: "/schedule" }); 
    }
  },
  created() {},
  mounted() {}
};
</script> 
<style scoped>
.a tr {
    background:#409EFF !important
} 
</style>
