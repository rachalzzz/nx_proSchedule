<template>
  <div class="nx_ws">
    <!-- 頭部查詢 -->
    <div class="nx_gray_region"> 
        <el-form :inline="true" :model="formInline">
          <el-form-item label="批號">
            <el-input v-model="formInline.orderNo" placeholder="請輸入批號"></el-input>
          </el-form-item>
          <el-form-item label="款號">
            <el-input v-model="formInline.styleNo" placeholder="請輸入款號"></el-input>
          </el-form-item>
          <el-form-item label="工序">
            <el-select v-model="formInline.joinNo"  placeholder="請選擇工序">
              <el-option label="1006" value="1006"></el-option> 
            </el-select>
          </el-form-item> 
          <el-form-item label="时间">
            <el-date-picker v-model="formInline.date"  placeholder="請選擇时间" type="daterange" :picker-options="pickerOptions2"  range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" align="right">
            </el-date-picker>
          </el-form-item> 
          <el-form-item> 
            <el-button type="primary" @click='onSubmit'>查询</el-button>
          </el-form-item>
        </el-form>
                
    </div>
    <!-- 查詢內容 -->
    <el-button type="primary" class="save" >保存</el-button>
    <el-tabs v-model="activeName2" type="card">
      <el-tab-pane label="欄目標題11" name="first"> 
        <el-table ref="singleTable" :data="topData"   highlight-current-row  @current-change="handleCurrentChange" style="width: 100%">
          <el-table-column  label="款號"     prop="item1" align="center"> </el-table-column>
          <el-table-column  label="批號"     prop="item2" align="center"> </el-table-column>
          <el-table-column  label="工序"     prop="item3" align="center"> </el-table-column>
          <el-table-column  label="計劃開工" prop="item4" align="center"> </el-table-column>
          <el-table-column  label="計劃完工" prop="item5" align="center"> </el-table-column>
          <el-table-column  label="計劃數量" prop="item6" align="center"> </el-table-column>
          <el-table-column  label="確認開工"  align="center">  
              <template slot-scope="scope">  
                  <el-date-picker v-model="scope.row.item7" type="date" placeholder="选择日期"  style="width:125px" :picker-options="pickerOptions0">
                  </el-date-picker>
              </template>
          </el-table-column>
          <el-table-column  label="確認完工" prop="item8"  align="center"> 
              <template slot-scope="scope"> 
                  <el-date-picker v-model="scope.row.item8" type="date" placeholder="选择日期"  style="width:125px" :picker-options="pickerOptions0">
                  </el-date-picker>
              </template>
          </el-table-column>
          <el-table-column  label="確認數量" prop="item9"  align="center">
              <template slot-scope="scope"> 
                <el-input v-model="scope.row.item9"  class="rightInput" ></el-input>
              </template>
          </el-table-column> 
          <el-table-column  label="狀態"   align="center"   prop="item10"> </el-table-column> 
          </el-table>   
      </el-tab-pane> 
    </el-tabs>  
    <el-tabs v-model="activeName2"  type="card" v-if="this.currentRow">
          <el-tab-pane label="欄目標題22" name="first">
            <el-table :data="subData" stripe>
              <el-table-column type="index" >  </el-table-column>
              <el-table-column property="name1"    label="合約號" align="center"> </el-table-column>
              <el-table-column property="name2"    label="工序"  align="center"> </el-table-column>
              <el-table-column property="name3"    label="計劃開工" align="center"> </el-table-column>
              <el-table-column property="name4"    label="計劃完工" align="center"> </el-table-column>
              <el-table-column property="name5"    label="計劃數量"  align="center"> </el-table-column>
              <el-table-column property="name6"    label="確認開工" align="center"> </el-table-column>
              <el-table-column property="name7"    label="確認完工" align="center"> </el-table-column>
              <el-table-column property="name8"    label="確認數量"  align="center"> </el-table-column>
              <el-table-column property="name9"    label="狀態" align="center"> </el-table-column> 
            </el-table>  
          </el-tab-pane> 
        </el-tabs> 
  </div>
</template> 
<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      activeName2: 'first',
      currentRow: null,
      formInline: {
        orderNo: "",
        styleNo: "",
        joinNo: "",
        date: ""
      },
      //上部分數據
      topData:[],
      topData1: [{ 
          item1:'WC16092124',
          item2:'WC16092124',
          item3:'1006',
          item4:'2018-10-19',
          item5:'2018-12-25',
          item6:'56000',
          item7:'2018-10-19',
          item8:'2018-12-25',
          item9:'55560',
          item10:'排產' 
        },{ 
          item1:'WC18026289',
          item2:'WC18026289',
          item3:'1006',
          item4:'2018-09-10',
          item5:'2018-11-19',
          item6:'80050',
          item7:'2018-09-10',
          item8:'2018-11-19',
          item9:'80000',
          item10:'排產' 
        },{ 
          item1:'WC18025247',
          item2:'WC18025247',
          item3:'1006',
          item4:'2018-10-09',
          item5:'2018-12-19',
          item6:'4501400',
          item7:'2018-10-09',
          item8:'2018-12-19',
          item9:'450000',
          item10:'' 
        }
      ],
      subData:[],
      subData1: [{ 
          name1:'cc18081006',
          name2:'1006',
          name3:'2018-10-31',
          name4:'2018-11-31',
          name5:'2300',
          name6:'2018-10-31',
          name7:'2018-11-31',
          name8:'2300',
          name9:''  
        },{ 
          name1:'cc18081004',
          name2:'1006',
          name3:'2018-11-31',
          name4:'2018-12-31',
          name5:'5400',
          name6:'2018-11-31',
          name7:'2018-12-31',
          name8:'5400',
          name9:''  
        },{ 
          name1:'cc18081057',
          name2:'1006',
          name3:'2018-11-06',
          name4:'2018-11-31',
          name5:'2200',
          name6:'2018-11-07',
          name7:'2018-12-31',
          name8:'2200',
          name9:'' 
        }
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
      }
    };
  },
  methods: {
    setCurrent(row) {      
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) { 
      this.currentRow = val;
      this.subData=this.subData1
    },
    onSubmit(){
      console.log(this.formInline,456555)
      if(this.formInline.orderNo==''&&this.formInline.styleNo==''&&this.formInline.joinNo==''&&this.formInline.date==''){
          this.$message({ type: "error", message: "查詢條件不能為空" });  
      }else{
        const loading = this.$loading({
              lock: true,
              text: '加載中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.55)'
          });
          setTimeout(() => {
              loading.close();
              this.topData=this.topData1 
          }, 1000); 
      }
    }
  },
  created() {},
  mounted() {}
};
</script> 
<style scoped> 
.nx_gray_region {
  padding: 15px 30px;
  height: 45px;
  background-color: #f4f4f4;
}
.el-tabs{margin-top:20px}

.nx_ws .el-date-editor .el-input {
    width: 125px;
}

.save{
  position: absolute;
  right: 104px;
    z-index: 1;
    margin-top: 18px; 
} 
.el-table__body-wrapper{overflow:hidden}
 .el-table__empty-block{margin-left: -1px !important;}
</style>
