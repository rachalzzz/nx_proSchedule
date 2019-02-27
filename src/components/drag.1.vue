<template> 
<div class="content" > 
  <el-row :gutter="20">
    <!-- 左邊 -->
    <el-col :span="6" ><div class="grid-content bg-purple">
    <!-- 查詢條件 --> 
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
      <el-form-item label="時間："  prop="time">   
        <el-date-picker  v-model="ruleForm.time" 
          type="daterange"      align="right"      unlink-panels      range-separator="至"
          start-placeholder="开始日期"      end-placeholder="结束日期"    format="yyyy/MM/dd"   :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>        
      <el-form-item label="工序：" prop="process">
          <el-select v-model="ruleForm.process" placeholder="請選擇工序"  @change="jobListchange"> 
              <el-option v-for="item in JobnoList" :key="item.JOBID" :label="item.JOBNAME"  :value="item.JOBNO">
              </el-option>
          </el-select>  
      </el-form-item>     
      <el-form-item label="设备：" prop="p_Eqmmod"  v-if="this.ruleForm.process==1001||this.ruleForm.process==1002"> 
          <el-select v-model="ruleForm.p_Eqmmod" placeholder="請選擇设备" > 
              <el-option v-for="item in equipList" :key="item.EQMCODE" :label="item.EQMNAME"  :value="item.EQMCODE">
              </el-option>
          </el-select>   
      </el-form-item>   
      <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">查詢</el-button>
      </el-form-item>
    </el-form>
    <!-- 在產批號清單 -->
    <div class="grid-content grid-left">
      <div class="table_top">在產批號清單
        <i   class="el-icon-edit" @click="askDrag = true"></i> 
      </div>
      <el-collapse v-model="activeName"   v-loading="loadingIP">
          <div class="nodata"   v-if="this.inProduct.length==0"> 
            <i class="el-icon-warning"></i>{{inProductNodata}}
          </div>
          <el-table   :data="inProduct"  style="height: 650px;  overflow-y: scroll" v-else>
            <el-table-column prop="ORDNO"  label="批號"></el-table-column>
            <el-table-column prop="STYNO"  label="款號"></el-table-column>
            <el-table-column prop="ORDSEQ" label="数量"></el-table-column> 
          </el-table>
          <!-- <div class="table_content"  v-for="(item,index) in inProduct" :key="index"  v-dragging="{item: item, list: inProduct, group: 'item' }">    -->
          <!-- <div class="table_content" v-for="(item,index) in inProduct" :key="index"  v-else>
            <el-collapse-item :title="'批號：'+item.OrderNo+''" :name="index">
                <el-row :gutter="20">
                  <el-col :span="7"><div  class="grid-content">颜色</div></el-col>
                  <el-col :span="7"><div  class="grid-content">尺碼</div></el-col>
                  <el-col :span="10"><div class="grid-content">數量</div></el-col>
                </el-row> -->
                <!-- <div  v-for="(item1,index) in item.orderItem" :key="index" draggable='true' @dragstart='drag($event)'> -->
                <!-- <div  v-for="(item1,index) in item.OrderItem" :key="index">
                  <el-row :gutter="20" >
                    <el-col :span="7"><div class="grid-content">{{item1.color}}</div></el-col>
                    <el-col :span="7"><div class="grid-content">{{item1.size}}</div></el-col>
                    <el-col :span="10"><div class="grid-content">{{item1.num}}</div></el-col>
                  </el-row>  
                </div>  
            </el-collapse-item> 
          </div> -->
         
      </el-collapse> 
    </div>
    </div></el-col> 
    <!-- 右邊 -->
    <el-col :span="18"><div class="grid-content bg-purple">
      <!-- 頭部查詢 -->
      <el-form ref="form" :model="form"  v-loading="loadingWL" > 
        <el-form-item>
          <el-checkbox-group v-model="form.workListTrue"  @change="changewl">
            <span   v-for="(item,index) in workList" :key="index" style="margin-right:20px;">
              <el-checkbox :label="item.WCNO">{{item.WCNAME}}</el-checkbox>
            </span> 
          </el-checkbox-group>
        </el-form-item>
      </el-form> 
      <!--內容-->
      <div class="middle">
        <el-row :gutter="20">
          <!-- 中間內容進度 -->
          <el-col :span="16"><div class="grid-content" style="background:#fff"  v-loading="loadingWC" >
              <div class="nodata"   v-if="this.middleItem.length==0">
                <i class="el-icon-warning"></i>{{middleItemNodata}}
              </div>
              <div class="box"  v-for="(item,index) in middleItem" :key="index"   @click="nextPage2" v-else>
                <div class="box_title">{{item.WCNAME}}</div>
                <div class="box_progress" @drop='drop($event)' @dragover='allowDrop($event)'  >   
                  <span slot="reference" :style="'width:' + item.TQTY /item.PSQTY + '%;background:#F56C6C'" :key="index"  v-if="item.TQTY>0" >{{(item.TQTY/item.PSQTY).toFixed(0)}} %</span> 
                  <span slot="reference" :style="'width:' + item.JQTY /item.PSQTY + '%;background:#E6A23C'" :key="index"  v-if="item.JQTY>0" >{{(item.JQTY/item.PSQTY).toFixed(0)}} %</span> 
                  <span slot="reference" :style="'width:' + item.NQTY /item.PSQTY + '%;background:#67C23A'" :key="index"  v-if="item.NQTY>0" >{{(item.NQTY/item.PSQTY).toFixed(0)}} %</span> 
                  <!-- <span slot="reference" :style="'width:' + item.NQTY /item.PSQTY + '%;background:#666'" :key="index"  v-show="item.NQTY>0" >{{item.NQTY/item.PSQTY}} %</span>  -->
                </div>
              </div>               
          </div></el-col>
          <!-- 待產批號清單 -->
          <el-col :span="8"><div  class="grid-content"> 
            <div class="grid-content grid-left">
              <div class="table_top">待產批號清單</div>
              <el-collapse v-model="inactiveName"   v-loading="loadingWP" >
                 <div class="nodata"   v-if="this.waitProduct.length==0">
                  <i class="el-icon-warning"></i>{{waitProductNodata}}
                </div>
                <el-table   :data="waitProduct"  style="height: 650px;  overflow-y: scroll" v-else>
                  <el-table-column prop="ORDNO"  label="批號"></el-table-column>
                  <el-table-column prop="STYNO"  label="款號"></el-table-column>
                  <el-table-column prop="ORDSEQ" label="数量"></el-table-column> 
                </el-table>
                <!-- <div class="table_content"  v-for="(item,index) in waitProduct" :key="index" v-else>   
                  <el-collapse-item :title="'批號：'+item.orderNo+''" :name="index">
                      <el-row :gutter="20">
                        <el-col :span="7"><div  class="table_tab">颜色</div></el-col>
                        <el-col :span="7"><div  class="table_tab">尺碼</div></el-col>
                        <el-col :span="10"><div class="table_tab">數量</div></el-col>
                      </el-row>
                      <div  v-for="(item1,index) in item.orderItem" :key="index">
                        <el-row :gutter="20">
                          <el-col :span="7"><div class="table_tab">{{item1.color}}</div></el-col>
                          <el-col :span="7"><div class="table_tab">{{item1.size}}</div></el-col>
                          <el-col :span="10"><div class="table_tab">{{item1.num}}</div></el-col>
                        </el-row>  
                      </div>  
                  </el-collapse-item> 
                </div> -->
              </el-collapse>
            </div>  
          </div></el-col>  
        </el-row>
      </div> 
    </div></el-col> 
  </el-row> 
  <el-dialog title="在產批號生產調整"  :visible.sync="askDrag" top="8%" :close-on-click-modal="false">
    <el-form :model="dragForm" :rules="dragRules" ref="dragForm" label-width="90px" class="demo-ruleForm"> 
      <el-form-item label="在產批号:" prop="item11">
        <el-select v-model="dragForm.item11" placeholder="請選擇批號" @change="dragItem11()">
          <el-option v-for="item in inProduct" :key="item.orderNo" :label="item.orderNo" :value="item.orderNo">
          </el-option>
        </el-select> 
      </el-form-item> 
      <el-form-item label="款式調整:" prop="item11"  v-if="dragForm.item11">
        <el-select v-model="dragForm.item224" multiple   placeholder="请选择">
            <el-option  v-for="item in rows"  :key="item.id" :label="item.color" :value="item.id"> 
              <el-row :gutter="20">
                <el-col :span="9"><div>{{ item.color }}</div></el-col>
                <el-col :span="6"><div>{{ item.size }}</div></el-col>
                <el-col :span="8"><div>{{ item.num }}</div></el-col>
              </el-row> 
            </el-option>
          </el-select>  
      </el-form-item>
      <el-form-item v-if="dragForm.item11" v-for="(item,index) in dragForm.proStyle" :key="item.key" :label="'款式調整' + (index+1) + ':' " :prop="'emails.' + index + '.email'" :rules="{required: true,validator: notifyEmailPass, trigger: 'blur'  }">
         <el-select v-model="item.name"  placeholder="请选择">
            <el-option  v-for="item in rows"  :key="item.id" :label="item.color" :value="item.id"> 
              <el-row :gutter="20">
                <el-col :span="9"><div>{{item.color}}</div></el-col>
                <el-col :span="6"><div>{{item.size }}</div></el-col>
                <el-col :span="8"><div>{{item.num  }}</div></el-col>
              </el-row> 
            </el-option>
          </el-select> 
          <el-input-number v-model="item.num"   :min="1" label="數量"></el-input-number> 件,調整到
          <el-select v-model="item.place" placeholder="請選擇工廠">
            <el-option label="工廠一" value="1001"></el-option>
            <el-option label="工廠二" value="1002"></el-option>
            <el-option label="工廠三" value="1003"></el-option>
          </el-select>
          <span style="color:#409EFF;margin-left:20px;"  v-show="index ==0&&dragForm.proStyle.length<3"   @click="addp()">添加</span>
          <span style="color:#409EFF;margin-left:20px;"  v-show="index !=0" @click="delp(index)">删除</span>
      </el-form-item> 
      <el-form-item label="優先級:" prop="item44">
        <el-select v-model="dragForm.item44" placeholder="請選擇優先級">
          <el-option label="一級" value="001"></el-option>
          <el-option label="二級" value="002"></el-option>
          <el-option label="三級" value="003"></el-option>
        </el-select>
      </el-form-item>   
      <el-form-item label="補充說明:" prop="item5">
        <el-input type="textarea" style="width:460px" v-model="dragForm.item55"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"   @click="submitForm('dragForm')">提交</el-button>
        <el-button @click="askDrag = false">取消</el-button>
      </el-form-item>
    </el-form> 
  </el-dialog>
</div>
</template> 
<script>
import {
  GetJobnoList,
  GetEqm,
  GetProtingLst,
  GetWorkCenter,
  GetWorkC,
  GetProductingOrdLst,
  GetUnProductingOrdLst,
  GetProducting
} from "./../api/api";
import $ from "jquery";
let dom = null;
export default {
  data() {
    return {
      JobnoList: [], //工序列表
      equipList: [], //设备列表
      workList: [], //头部作业中心
      form: {
        //作业中心选中
        workListTrue: []
      },
      p_Wcno:'',
      ruleForm: {
        process: "",
        time: "",
        p_Eqmmod: ""
      },
      rules: {
        time: [{ required: true, message: "請選擇起止時間", trigger: "blur" }],
        process: [
          { required: true, message: "請選擇工序", trigger: ["blur", "change"] }
        ],
        p_Eqmmod: [
          { required: true, message: "請選擇設備", trigger: ["blur", "change"] }
        ]
      },
      waitProduct: [
        // {
        // orderNo:11111111111222,
        // orderItem:[{id:"1001",color:'red',size:"xxl",num:"12009"},{id:"1006",color:'#445522',size:"xs",num:"100"},{id:"1011",color:'green',size:"s",num:"253"}]
        // },
        // {
        // orderNo:111111111111111,
        // orderItem:[{id:"1002",color:'#556677',size:"xl",num:"15765"},{id:"10022",color:'bule',size:"s",num:"253"}]
        // },
        // {
        // orderNo:333333333333333,
        // orderItem:[{id:"1003",color:'#112233',size:"l",num:"200"},{id:"10032",color:'#456781',size:"xxl",num:"1234"}]
        // }
      ],
      waitProductNodata: "暫時沒有數據",
      //在產
      inProduct: [],
      // {
      // orderNo:'NX123444111',
      // orderItem:[
      //   {id:"1001",color:'red',size:"xxl",num:"120000"},
      //   {id:"1006",color:'#000000',size:"xs",num:"100"},
      //   {id:"1011",color:'green',size:"s",num:"20253"}
      //   ]
      // }
      inProductNodata: "暫時沒有數據",
      activeName: [0],
      inactiveName: [],
      // 中间生产進度條
      middleItem: [
        // {
        //  name:'二廠縫盤',
        //  proItem:[{progress:50,background:'#409EFF'},{progress:21,background:'#E6A23C'},{progress:2,background:'#F56C6C'}]
        // }
      ],
      middleItemNodata: "暫時沒有數據",
      dragDate: {},
      askDrag: false,
      //彈窗
      dragForm: {
        item11: "",
        item22: "",
        item224: "",
        item222: 1,
        item33: "",
        proStyle: [{ name: "", num: "", place: "" }]
      },
      dragRules: {
        item11: [
          { required: true, message: "請選擇起止時間", trigger: "blur" }
        ],
        item22: [
          { required: true, message: "請選擇起止時間", trigger: "blur" }
        ],
        item33: [
          { required: true, message: "請選擇起止時間", trigger: "blur" }
        ],
        item44: [{ required: true, message: "請選擇起止時間", trigger: "blur" }]
      },
      //彈窗選擇
      rows: [],
      loadingWP: false,
      loadingIP: false,
      loadingWL:false,
      loadingWC:false,
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  // mounted () {
  //   this.$dragging.$on('dragged', ({ value }) => {
  //     console.log(value.item)
  //     console.log(value.list)
  //   }) 
  // },
  methods: {
    //获取工序列表---------------------Star
    getJobListData() {
      GetJobnoList().then(data => {
          console.log(data, "工序列表");
          if(data.indexOf("Error") != -1){ 
             this.JobnoList = '';
          }else  if(data){
            this.JobnoList = data;
          }else{
            this.$message.error("获取数据失败，请稍後再試或联系管理员"); 
          } 
        }).catch(() => { 
          this.$message.error('請求超時，请稍后再试~');
        });
    },
    //改变工序---------------------Star
    jobListchange() {
      console.log(this.ruleForm.process, "已选工序");
      if (this.ruleForm.process == 1001 || this.ruleForm.process == 1002) {
        this.getEqmData(this.ruleForm.process);
      }
    },
    //获取设备---------------------Star
    getEqmData(e) {
      var params = {};
      params.p_Jobno = e;
      GetEqm(params).then(data => {
          console.log(data, "设备列表"); 
          if(data.indexOf("Error") != -1){ 
             this.equipList = '';
          }else  if(data){
            this.equipList = data;
          }else{
            this.$message.error("获取数据失败，请稍後再試或联系管理员"); 
          } 
        }).catch(() => { 
          this.$message.error('請求超時，请稍后再试~');
        });
    },
    //點擊查詢--在产清单----------------------------------------star
    onSubmit(formName) { 
      console.log(this.ruleForm,'this.ruleForm')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getWorkpart(); //工作中心
          this.getInpro(); //在产批号
          this.getWaitpro()//待产批号
          //this.getworkSpeed()
        } else {
          return false;
        }
      });
    },
    //工作中心----------------------------------------star
    getWorkpart() { 
      var params = {};
      params.p_Jobno  = this.ruleForm.process;
      params.p_Eqmmod = this.ruleForm.p_Eqmmod;
      GetWorkCenter(params).then(data => {
          console.log(data, "工作中心");  
          this.workList = data;  
        })
    },
    //在产批号----------------------------------------star
    getInpro(e) { 
      if(e){
          var p_Wcno1 = []; 
          if(e.length>0){
            for (let i = 0; i < e.length; i++) {
              var arr = {
                id: "'" + e[i] + "'"
              };
              p_Wcno1.push(arr.id);
            } 
            this.p_Wcno = "(" + p_Wcno1.toString() + ")"; 
          }else{
          this.p_Wcno =''; 
          } 
      }else{
        this.p_Wcno=this.ruleForm.p_Eqmmod
      } 
      var params = {};
      params.p_Dtfr  = this.ruleForm.time[0];
      params.p_Dtto  = this.ruleForm.time[1];
      params.p_Jobno = this.ruleForm.process  ; //工序
      params.p_Wcno  = this.p_Wcno    //工業中心
      console.log(params,123456)
       this.loadingIP = true;
      GetProductingOrdLst(params).then(data => {
          this.loadingIP = false;
          console.log(data, "在产批号");
          if(data.indexOf("资料为空") != -1){ 
            this.inProduct = '';
            this.inProductNodata = "沒有找到相關數據";  
          }else  if(data){
            this.inProduct = data;
          }else{
            this.$message.error("获取数据失败，请稍後再試或联系管理员"); 
          } 
        }).catch(() => {
          this.loadingIP=false
          this.$message.error('請求超時，请稍后再试~');
        });
    },
    //待产批号----------------------------------------star
    getWaitpro(e) {  
      if(e){
          var p_Wcno1 = []; 
          if(e.length>0){
            for (let i = 0; i < e.length; i++) {
              var arr = {
                id: "'" + e[i] + "'"
              };
              p_Wcno1.push(arr.id);
            } 
            this.p_Wcno = "(" + p_Wcno1.toString() + ")"; 
          }else{
            this.p_Wcno =''; 
          } 
      }else{
        this.p_Wcno=this.ruleForm.p_Eqmmod
      } 
      var params = {};
      params.p_Dtfr  = this.ruleForm.time[0];
      params.p_Dtto  = this.ruleForm.time[1];
      params.p_Jobno = this.ruleForm.process; //工序
      params.p_Wcno  = this.p_Wcno 
      this.loadingWP=true
      GetUnProductingOrdLst(params).then(data => {
          console.log(data, "待产批号");
          this.loadingWP=false
          if(data.indexOf("资料为空") != -1){ 
            this.waitProduct = '';
            this.waitProductNodata = "沒有找到相關數據"; 
          }else  if(data){
            this.waitProduct = data;
          }else{
            this.$message.error("获取数据失败，请稍後再試或联系管理员"); 
          } 
        }).catch(() => {
          this.loadingWP=false
          this.$message.error('請求超時，请稍后再试~');
        });
    },
    //勾选作业中心
    changewl() {
      console.log(this.form.workListTrue, "已选作业中心");
      this.getworkSpeed();
      this.getInpro(this.form.workListTrue); //在产批号
      this.getWaitpro(this.form.workListTrue)//待产批号
    },
    //生产进度----------------------------------------star
    getworkSpeed() { 
      this.loadingWC=true;
      var p_Wcno1 = [];
      if (this.form.workListTrue) {
        for (let i = 0; i < this.form.workListTrue.length; i++) {
          var arr = {
            id: "'" + this.form.workListTrue[i] + "'"
          };
          p_Wcno1.push(arr.id);
        }
      }
      if(p_Wcno1){
        this.p_Wcno = "(" + p_Wcno1.toString() + ")";
      }else{
        this.p_Wcno =''
      } 
      var params = {
        p_Dtfr: this.ruleForm.time[0], //20180101
        p_Dtto: this.ruleForm.time[1], //20180731
        p_Jobno: this.ruleForm.process, //工序
        p_Wcno: this.p_Wcno    //工序
      };
      console.log(params, "查询生产进度");
      GetProducting(params).then(data => {
          console.log(data, "生产进度");
           this.loadingWC=false;
         if(data.indexOf("资料为空") != -1){  
             this.middleItem = '';
            this.middleItemNodata = "沒有找到相關數據";
          } else  if(data){
            this.middleItem = data;
          }else{
            this.$message.error("获取数据失败，请稍後再試或联系管理员"); 
          }
        }).catch(() => {
          this.loadingWC=false
          this.$message.error('請求超時，请稍后再试~');
        });
    },
    //多選--------------------------------------------star
    getData() {
      var params = {};
      params.type = this.form.type;
      console.log(params);
      // this.$message({ type: "info", message:params });
    },
    submitForm(formName) {
      this.askDrag = false;
      this.$message({ type: "success", message: "點擊了提交" });
      return;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({ type: "success", message: "點擊了查詢" });
        } else {
          return false;
        }
      });
    },
    drag: function(event) {
      console.log(event, 111);
      dom = event.currentTarget;
    },
    drop: function(event) {
      console.log(event, 222);
      event.preventDefault();
      // this.$confirm('是否確定拖拽到此處？此操作不可修改', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   event.target.appendChild(dom);
      // }).catch(() => {
      //   return
      // });
      this.askDrag = true;
    },
    allowDrop: function(event) {
      console.log(event, 333);
      event.preventDefault();
    },
    nextPage2() {
      console.log(11);
       this.$router.push({ path: "/Gantt", query: { id: val,id: val,id: val,id: val } });
    },
    //篩選待產列表
    dragItem11() {
      this.rows = [];
      this.dragForm.item22 = [];
      this.inProduct.forEach(val => {
        if (val.orderNo == this.dragForm.item11) {
          this.rows = val.orderItem;
        }
      });
    },
    addp() {
      this.dragForm.proStyle.push({ name: "", num: "", place: "" });
    },
    delp(val) {
      this.dragForm.proStyle.splice(val, 1);
    },
    // onSubmit(){
    //   var params          ={};
    //       params.time     =this.form.time;
    //       params.process  =this.form.process;
    //       params.needle   =this.form.needle;
    //       params.work     =this.form.work;
    //   console.log(params)
    //   this.$message({ type: "info", message:params });
    //   return false
    // getVerifierList(params).then(data=>{
    //   if (data.code == 100) {
    //     console.log(data);
    //   } else {
    //       this.$message.error(data.msg);
    //   }
    // }).catch(() => {
    //     this.$message({ type: "info", message: "网络问题，请刷新重试~" });
    // });
          // {
      // orderNo:'NX123444111',
      // orderItem:[
      //   {id:"1001",color:'red',size:"xxl",num:"120000"},
      //   {id:"1006",color:'#000000',size:"xs",num:"100"},
      //   {id:"1011",color:'green',size:"s",num:"20253"}
      //   ]
      // }
    // test(){
    //     var a=[]
    //     var b=[]
    //     var data =[
    //       {
    //         orderNo:'NX123444111',
    //         orderItem:"{Jobno:2001,Color:粉紅色,Size:XS,Qty:38},{Jobno:2001,Color:粉紅色,Size:S,Qty:51},{Jobno:2001,Color:粉紅色,Size:M,Qty:55}"
    //       },
    //       {
    //         orderNo:'NX1234442222',
    //         orderItem: "{Jobno:2001,Color:粉紅色,Size:M,Qty:55},{Jobno:2001,Color:粉紅色,Size:L,Qty:32},{Jobno:2001,Color:粉紅色,Size:XL,Qty:25}"
    //       }
    //     ]
    //     for(var i=0;i<data.length;i++){ 
    //        var arr1={
    //          orderNo:data[i].orderNo,
    //          orderItem:data[i].orderItem.split("},{"),
    //        }  
    //        a.push(arr1)
    //        for(var j=0;j<a[i].orderItem.length;j++){
    //          console.log(a[i].orderItem.length,'arr1[i].orderItem.length')
    //          var arr2={
    //            item:a[i].orderItem[j].split(","),
    //          }
    //          console.log(arr2,2312)

    //        }
          
    //     } 
    //     console.log(a,'a')
    // }
  },
  mounted() {
    this.getJobListData(); 
  }
};
</script> 
<style scoped>
.nodata {
  width: 100%;
  padding: 20px 0;
  color: dimgrey;
  font-size: 14px;
  text-align: center;
}
.nodata i {
  margin-right: 10px;
}
.box_progress span::-webkit-scrollbar {
  width: 0px;
}
.warning {
  background: #e6a23c;
}
.success {
  background: #67c23a;
}
.danger {
  background: #f56c6c;
}

.box {
  width: 100%;
  margin-top: 20px;
}
.box_progress {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #ebeef5;
  overflow: hidden;
  border: 2px solid #000;
  border-radius: 4px;
}
.box_progress span {
  border-right: 1px solid #000;
  float: left;
  font-size: 14px;
  color: #fff;
}
.box_progress .el-row {
  width: 5% !important;
  background: #409eff;
  float: left;
  overflow: hidden;
  margin: 0 !important;
  border-right: 1px solid #000;
}
.box_progress .el-col {
  visibility: hidden;
}
.box_progress .el-collapse-item {
  width: 5% !important;
  background: #409eff !important;
  float: left;
  overflow: hidden;
  margin: 0 !important;
  border-right: 1px solid #000;
}

.el-form-item {
  width: 95%;
  margin-left: 2%;
  margin-bottom: 20px;
}
.demo-ruleForm {
  overflow: hidden;
}
.demo-ruleForm .el-input__inner {
  width: 222px;
}
.demo-ruleForm .el-input--suffix .el-input__inner {
  padding-right: 38px !important;
}
.el-form--inline .el-form-item__label {
  float: none;
  display: inline-block;
  width: 82px;
  text-align: left;
}
.demo-ruleForm {
  padding: 15px 0 5px 0;
}

.table_top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  overflow: hidden;
}
.table_top .el-icon-edit {
  float: right;
  padding: 17px 20px;
  cursor: pointer;
}
.table_top .el-icon-edit:active {
  color: #409eff;
  font-size: 20px;
}
/* 卡片 */
.grid-left {
  background: #f7f7f7;
}
.grid-right {
  background: #f7f7f7;
}
.grid-left .card {
  width: 90%;
  margin: 0 auto 15px auto;
  border-radius: 4px;
  padding: 8px;
  text-align: left;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #e6a23c;
  color: #fff;
}
.grid-left .card_title {
  height: 30px;
  line-height: 30px;
}
.grid-left .card_title span {
  font-size: 20px;
}
.table_content .el-collapse-item__header {
  background: #409eff !important;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 15px;
}
.table_content .grid-content {
  background: #fff;
  text-align: center;
  font-size: 14px;
}
.table_tab {
  background: #fff;
  text-align: center;
  font-size: 14px;
}
/* 中間 */
.middle {
  background: #fff;
}
.middle .grid-content {
  background: #f7f7f7;
}

.bg-purple {
  /* background: #d3dce6; */
  background: #e5e9f2;
}
</style>
