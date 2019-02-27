<template> 
<div class="content drag" >  
  <div class="left-content bg-purple">
    <!-- 查詢條件 --> 
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
      <el-form-item label="時間："  prop="time">   
        <el-date-picker  v-model="ruleForm.time" 
          type="daterange"      align="right"      unlink-panels      range-separator="至" placeholder="請選擇時間" 
          start-placeholder="开始日期"      end-placeholder="结束日期"  format="yyyy/MM/dd"   value-format="yyyy-MM-dd"   :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>        
      <el-form-item label="工序：" prop="process">
          <el-select v-model="ruleForm.process" placeholder="請選擇工序" @change="jobListchange"> 
              <el-option v-for="item in JobnoList" :key="item.JOBID" :label="item.JOBNAME"  :value="item.JOBNO">
              </el-option>
          </el-select>  
      </el-form-item>     
      <el-form-item label="设备：" prop="p_Eqmmod"  v-if="this.ruleForm.process == 1001 || this.ruleForm.process == 1002"> 
          <el-select v-model="ruleForm.p_Eqmmod" placeholder="請選擇设备" > 
              <el-option v-for="item in equipList" :key="item.EQMCODE" :label="item.EQMNAME"  :value="item.EQMCODE">
              </el-option>
          </el-select>   
      </el-form-item>   
      <el-form-item>
          <el-button type="primary" size="medium" @click="onSubmit('ruleForm')" :loading="loading1">查詢</el-button>
      </el-form-item>
    </el-form>
    <!-- 在產批號清單 -->
    <div class="grid-content grid-left">
      <div class="table_top">
          在產批號清單  
          <el-button  size="small" type="primary" v-if="this.inProduct.length!=0"  class="pull-right mr20 mt10" @click="saveSort" :loading="loading2">保存排序</el-button> 
          <!-- <el-button  size="small" type="primary"  @click="inDrag = true" class="pull-right mr20 mt10" v-if="this.inProduct.length!=0">狀態調整</el-button>  -->
      </div>
      <el-collapse v-model="activeName" > 
          <div  style="height: 630px;  overflow-y: scroll"> 
              <div class="pBox" v-for="(item,index) in this.inProduct" :key="index"  v-dragging="{ item: item, list: inProduct, group: 'item' }"> 
                <div  class="subTitle" >
                  <i class="el-icon-arrow-right pl5" @click="toggleShow(index)" v-if="!item.show"></i>
                  <i class="el-icon-arrow-down pl5" @click="toggleShow(index)"  v-else></i>
                   {{item.orderNo}} 
                  <span class="static_t" v-if="item.static==1">停</span>
                  <span class="static_d"  v-if="item.static==2">待</span>
                  <i   class="el-icon-edit edit" @click="editOne(item)"></i> 
                </div>
                <div class="subBox" v-if="item.show">
                    <div class="subItem">顏色</div>
                    <div class="subItem">尺碼</div>
                    <div class="subItem">數量</div>
                </div>
                <div class="subBox" v-for="subitem in item.orderItem"  :key="subitem.id" v-if="item.show">
                    <div class="subItem">{{subitem.color}}</div>
                    <div class="subItem">{{subitem.size}}</div>
                    <div class="subItem">{{subitem.num}}</div>
                </div>
              </div> 
          </div> 
      </el-collapse> 
    </div> 
  </div>
  <!-- 右邊 -->
  <div class="right-content" >
      <!-- 頭部查詢 -->
      <div class="searchBar"> 
        <div>
          生產線
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group  v-model="checkedWorkList" :min="1"  label="活动名称">
              <el-checkbox v-for="(item,index) in workList" :label="item.WCNO" :key="index">{{item.WCNAME}}</el-checkbox>
          </el-checkbox-group> 
          <el-row> 
            <el-button type="primary" size="medium" :disabled='this.workList.length==0'  @click="topSubmit"  :loading="loading3">查詢</el-button> 
            <el-button type="primary" size="medium" :disabled='this.workList.length==0'  @click="phDrag = true">新增排產</el-button>
            <!-- <el-button type="primary" size="medium"  >添加工廠</el-button>  -->
          </el-row> 
        </div>
      </div> 
      <!--內容-->
      <div class="middle">
        <div class="grid-content"> 
              <div class="box"  v-for="(item,index) in middleItem" :key="index"   @click="nextPage2"> 
                  <div class="box_title">{{item.WCNAME}}</div>  
                  <div class="box_progress">     
                    <span slot="reference" v-for="(item1,index1) in item.proItem" :key="index1" size="mini"  :style="'width:' + item1.progress + '%;background:' + item1.background" v-if="item1.progress>0" >{{item1.progress}}% </span>  
                  </div>  
              </div>               
          </div>
      </div>       
  </div>  

  <el-dialog title="在產批號生產狀態調整"  :visible.sync="inDrag" top="10%" :close-on-click-modal="false">
    <el-form :model="inForm" :rules="inRules" ref="inForm" label-width="90px" class="demo-ruleForm"> 
      <el-form-item label="批號:">
        <el-select v-model="inForm.orderNo"  :disabled="true">
          <el-option :label="inForm.orderNo" :value="inForm.orderNo"></el-option> 
        </el-select>
      </el-form-item> 
      <el-form-item label="狀態:"> 
        <el-select v-model="inForm.static">
          <el-option label="停工" :value="1"></el-option> 
          <el-option label="待產" :value="2"></el-option>
          <el-option label="排產" :value="0"></el-option>
        </el-select> 
      </el-form-item>  
      <el-form-item>
        <el-button type="primary"   @click="saveInDrag('inForm')" :loading="loading">提交</el-button>
        <el-button @click="inDrag = false">取消</el-button>
      </el-form-item>
    </el-form> 
  </el-dialog>
  <el-dialog title="新增排產"  :visible.sync="phDrag" top="10%" :close-on-click-modal="true">
    <el-form :model="dragForm" :rules="dragRules" ref="dragForm" label-width="90px"> 
      <el-form-item label="排產批號:" prop="item1">
        <el-select v-model="dragForm.item1" placeholder="請選擇批號">
          <el-option v-for="item in this.iwProduct" :key="item.orderNo" :label="item.orderNo" :value="item.orderNo">
          </el-option>
        </el-select> 
      </el-form-item> 
      <el-form-item label="計劃排產:">
        <el-date-picker disabled v-model="dragForm.item2" type="daterange" align="center" unlink-panels      range-separator="至" :picker-options="pickerOptions" start-placeholder="开始日期"      end-placeholder="结束日期"  format="yyyy/MM/dd"   value-format="yyyy-MM-dd"  >
        </el-date-picker>
         /
        <el-input style="width:15%"  disabled v-model="dragForm.item3"></el-input>件
      </el-form-item> 
       <el-form-item label="確認排產:">
        <el-date-picker  v-model="dragForm.item4" type="daterange" align="center" unlink-panels range-separator="至" start-placeholder="开始日期"      end-placeholder="结束日期"  format="yyyy/MM/dd"   value-format="yyyy-MM-dd"  >
        </el-date-picker>
        /
        <el-input style="width:15%" type="number"  v-model="dragForm.item5"></el-input>件
      </el-form-item> 

      <el-form-item label="排產線:"  prop="item6">
         <el-checkbox-group  v-model="dragForm.item6" :min="1"  label="活动名称">
              <el-checkbox v-for="(item,index) in workList" :label="item.WCNO" :key="index">{{item.WCNAME}}</el-checkbox>
          </el-checkbox-group>  
      </el-form-item> 
      <el-form-item label="優先級:" prop="item7">
        <el-input style="width:15%" v-model="dragForm.item7" :disabled="true"></el-input>/
        <el-input style="width:15%" type="number" v-model="dragForm.item9"></el-input>      
      </el-form-item>   
      <el-form-item label="補充說明:" prop="item8">
        <el-input type="textarea" style="width:32%" v-model="dragForm.item8"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"   @click="submitForm('dragForm')" :loading="loading">提交</el-button>
        <el-button @click="phDrag = false">取消</el-button>
      </el-form-item>
    </el-form> 
  </el-dialog> 
</div>
</template> 
<script>
import('./../assets/css/drag.css')
import $ from "jquery"; 
export default {
  data() {
    return {
      //工序列表
      JobnoList: [
        {
          JOBID: 1001,
          PARENTID: 100,
          JOBTY: 1,
          JOBNO: "1001",
          JOBNAME: "織機",
          MKSEQ: 1
        },
        {
          JOBID: 1003,
          PARENTID: 100,
          JOBTY: 1,
          JOBNO: "1003",
          JOBNAME: "電腦機查片",
          MKSEQ: 2
        },
        {
          JOBID: 1006,
          PARENTID: 100,
          JOBTY: 1,
          JOBNO: "1006",
          JOBNAME: "電腦機下欄查片",
          MKSEQ: 2
        },
        {
          JOBID: 1008,
          PARENTID: 100,
          JOBTY: 1,
          JOBNO: "1008",
          JOBNAME: "電機拆嚇欄",
          MKSEQ: 3
        },
        {
          JOBID: 2001,
          PARENTID: 200,
          JOBTY: 1,
          JOBNO: "2001",
          JOBNAME: "縫盤",
          MKSEQ: 1
        },
        {
          JOBID: 2003,
          PARENTID: 200,
          JOBTY: 1,
          JOBNO: "2003",
          JOBNAME: "查縫",
          MKSEQ: 3
        },
        {
          JOBID: 2002,
          PARENTID: 200,
          JOBTY: 1,
          JOBNO: "2002",
          JOBNAME: "挑撞",
          MKSEQ: 4
        },
        {
          JOBID: 2005,
          PARENTID: 200,
          JOBTY: 1,
          JOBNO: "2005",
          JOBNAME: "查挑",
          MKSEQ: 5
        },
        {
          JOBID: 3001,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3001",
          JOBNAME: "拉眼",
          MKSEQ: 1
        },
        {
          JOBID: 3002,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3002",
          JOBNAME: "前照燈",
          MKSEQ: 2
        },
        {
          JOBID: 3003,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3003",
          JOBNAME: "前補衣",
          MKSEQ: 3
        },
        {
          JOBID: 3004,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3004",
          JOBNAME: "執污",
          MKSEQ: 4
        },
        {
          JOBID: 3006,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3006",
          JOBNAME: "洗水",
          MKSEQ: 6
        },
        {
          JOBID: 3007,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3007",
          JOBNAME: "洗后照燈",
          MKSEQ: 7
        },
        {
          JOBID: 3008,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3008",
          JOBNAME: "后補衣",
          MKSEQ: 8
        },
        {
          JOBID: 3009,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3009",
          JOBNAME: "車位",
          MKSEQ: 9
        },
        {
          JOBID: 3010,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3010",
          JOBNAME: "分碼",
          MKSEQ: 10
        },
        {
          JOBID: 3011,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3011",
          JOBNAME: "燙衣",
          MKSEQ: 11
        },
        {
          JOBID: 3012,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3012",
          JOBNAME: "度尺",
          MKSEQ: 12
        },
        {
          JOBID: 3013,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3013",
          JOBNAME: "拉嘜",
          MKSEQ: 13
        },
        {
          JOBID: 3014,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3014",
          JOBNAME: "車嘜",
          MKSEQ: 14
        },
        {
          JOBID: 3015,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3015",
          JOBNAME: "初查",
          MKSEQ: 15
        },
        {
          JOBID: 3017,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3017",
          JOBNAME: "初補",
          MKSEQ: 17
        },
        {
          JOBID: 3018,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3018",
          JOBNAME: "復查",
          MKSEQ: 18
        },
        {
          JOBID: 3019,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3019",
          JOBNAME: "復補",
          MKSEQ: 19
        },
        {
          JOBID: 3020,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3020",
          JOBNAME: "總查",
          MKSEQ: 20
        },
        {
          JOBID: 3021,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3021",
          JOBNAME: "鈕門",
          MKSEQ: 21
        },
        {
          JOBID: 3023,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3023",
          JOBNAME: "釘鈕",
          MKSEQ: 23
        },
        {
          JOBID: 3025,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3025",
          JOBNAME: "點位",
          MKSEQ: 25
        },
        {
          JOBID: 3027,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3027",
          JOBNAME: "刷灰",
          MKSEQ: 3027
        },
        {
          JOBID: 3030,
          PARENTID: 300,
          JOBTY: 1,
          JOBNO: "3030",
          JOBNAME: "倒/拼紗",
          MKSEQ: 3030
        },
        {
          JOBID: 9003,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9003",
          JOBNAME: "分缸",
          MKSEQ: 3
        },
        {
          JOBID: 9004,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9004",
          JOBNAME: "分碼",
          MKSEQ: 4
        },
        {
          JOBID: 9005,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9005",
          JOBNAME: "掛牌",
          MKSEQ: 5
        },
        {
          JOBID: 9006,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9006",
          JOBNAME: "查配料",
          MKSEQ: 6
        },
        {
          JOBID: 9007,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9007",
          JOBNAME: "終檢",
          MKSEQ: 7
        },
        {
          JOBID: 9008,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9008",
          JOBNAME: "終度",
          MKSEQ: 8
        },
        {
          JOBID: 9009,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9009",
          JOBNAME: "件包",
          MKSEQ: 9
        },
        {
          JOBID: 9012,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9012",
          JOBNAME: "裝箱",
          MKSEQ: 12
        },
        {
          JOBID: 9013,
          PARENTID: 900,
          JOBTY: 1,
          JOBNO: "9013",
          JOBNAME: "查牌",
          MKSEQ: 13
        }
      ],
      //设备列表
      equipList: [],
      //头部作业中心
      workList: [],
      //作业中心选中
      checkedWorkList:[],
      i_Wcno: "",
      w_Wcno: "",
      ruleForm: {
        process: "",
        time: "",
        p_Eqmmod: ""
      },      
      rules: {
        time: [{required: true, message: "請選擇起止時間", trigger: "blur" , type: 'array'}],
        process: [{ required: true, message: '請選擇工序', trigger: 'change' }        ],
        p_Eqmmod: [{ required: true, message: '請選擇設備', trigger: 'change' }        ]
      }, 
      //在產 
      inProduct: [],
      inProduct1: [
        {
          orderNo: "NC18100167",
          listNo:1,
          static:0,
          show:false,
          orderItem: [
            { id: "1001", color: "粉紅色", size: "M", num: "120,000" },
            { id: "1002", color: "深紫色", size: "L", num: "20,000" }
          ]
        },
        {
          orderNo: "CC18087093",
          listNo:2,
          static:0,
          show:false,
          orderItem: [
            { id: "2001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "2003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
        {
          orderNo: "NC18100039",
          listNo:3,
          static:0,
          show:false,
          orderItem: [
            { id: "3001", color: "深黃色", size: "M", num: "5,000" },
            { id: "3002", color: "花深綠", size: "L", num: "3,000" }
          ]
        },
        {
          orderNo: "FN18100031",
          listNo:4,
          static:0,
          show:false,
          orderItem: [
            { id: "4001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "4002", color: "大紅色", size: "XXL", num: "500" },
            { id: "4003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
        {
          orderNo: "CC18100407",
          listNo:5,
          static:0,
          show:false,
          orderItem: [
            { id: "3001", color: "花姜黃", size: "M", num: "5,000" },
            { id: "3002", color: "淺棕色", size: "L", num: "3,000" }
          ]
        },{
          orderNo: "NC18100567",
          listNo:6,
          static:1,
          show:false,
          orderItem: [
            { id: "1001", color: "粉紅色", size: "M", num: "120,000" },
            { id: "1002", color: "深紫色", size: "L", num: "20,000" }
          ]
        },
        {
          orderNo: "CC18087013",
          listNo:7,
          static:2,
          show:false,
          orderItem: [
            { id: "2001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "2003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
      ],
      //待產
      iwProduct: [
        {
          orderNo: "NC18100111",
          listNo:1,
          static:0,
          show:false,
          orderItem: [
            { id: "1001", color: "粉紅色", size: "M", num: "120,000" },
            { id: "1002", color: "深紫色", size: "L", num: "20,000" }
          ]
        },
        {
          orderNo: "CC18087222",
          listNo:2,
          static:0,
          show:false,
          orderItem: [
            { id: "2001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "2003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
        {
          orderNo: "NC18100333",
          listNo:3,
          static:0,
          show:false,
          orderItem: [
            { id: "3001", color: "深黃色", size: "M", num: "5,000" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "3002", color: "花深綠", size: "L", num: "3,000" }
          ]
        },
        {
          orderNo: "FN18100444",
          listNo:4,
          static:0,
          show:false,
          orderItem: [
            { id: "4001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "4002", color: "大紅色", size: "XXL", num: "500" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "4003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
        {
          orderNo: "CC18100555",
          listNo:5,
          static:0,
          show:false,
          orderItem: [
            { id: "3001", color: "花姜黃", size: "M", num: "5,000" },
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "3002", color: "淺棕色", size: "L", num: "3,000" }
          ]
        },{
          orderNo: "NC18100666",
          listNo:6,
          static:0,
          show:false,
          orderItem: [
            { id: "2002", color: "大紅色", size: "XXL", num: "500" },
            { id: "1001", color: "粉紅色", size: "M", num: "120,000" },
            { id: "1002", color: "深紫色", size: "L", num: "20,000" }
          ]
        },
        {
          orderNo: "CC18087777",
          listNo:7,
          static:0,
          show:false,
          orderItem: [
            { id: "2001", color: "淺棕色", size: "XL", num: "1,000" },
            { id: "2003", color: "寶藍色", size: "S", num: "1,500" }
          ]
        },
      ],
      //在產調整彈窗
      inForm:{orderNo:'',static:1}, 
      inRules: {
        orderNo: [{ required: true, message: "請選擇批號", trigger: "blur" }]
      }, 
      activeName: [0],
      inactiveName: [],
      // 中间生产進度條
      middleItem:[],
      middleItem1: [
        {WCNAME:'一廠.縫盤',
         proItem:[{progress:10,background:'#E51C23'},{progress:30,background:'#259B24'},{progress:30,background:'#e6aa1c'}] 
        },
        {WCNAME:'二廠.縫盤',
         proItem:[{progress:5,background:'#E51C23'},{progress:20,background:'#e6aa1c'},{progress:40,background:'#259B24'}] 
        }
      ], 
      dragDate: {},
      phDrag: false,
      inDrag: false,
      //彈窗
      dragForm: {
        item1: "",
        item2: ["2018-12-04", "2018-12-30" ],
        item3: 3000,
        item4: ["2018-12-04", "2018-12-30" ],
        item5:3000,
        item6:  [],
        item7: 0,
        item9:'',
        item8:''
      },
      dragForm1: {
        item1: "",
        item2: ["2018-12-04", "2018-12-30" ],
        item3: 3000,
        item4: ["2018-12-04", "2018-12-30" ],
        item5:3000,
        item6:  [],
        item7: 0,
        item9:'',
        item8:''
      },
      dragRules: {
        item1: [
          { required: true, message: "請選擇排產批號", trigger: "blur" }
        ], 
        item6: [{ required: true, message: "請選擇排產線", type:'array', trigger: "blur" }]
      },
       fullscreenLoading: false,
      //彈窗選擇
      rows: [],
      loading:false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      pickerOptions: {
            disabledDate(time) {return time.getTime() < Date.now() - 8.64e7;}
      }, 
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
      }
    };
  },
  methods: {  
    //生產線查詢
    topSubmit(){
      if(this.checkedWorkList.length==0){
        this.$message({ type: "error", message: "請先選擇生產線" }); 
      }else{
         this.loading3 = true;  
          setTimeout(() => {
              this.loading3 = false;  
              this.middleItem=this.middleItem1 
          }, 1000); 
      }

    }, 
    //點擊查詢--在产清单----------------------------------------star
    onSubmit(formName) { 
      console.log(this.ruleForm,5632)
      this.$refs[formName].validate(valid => {
        if (valid) { 
          this.loading1 = true;  
          setTimeout(() => {
               this.loading1 = false;  
              //工作中心
              this.workList=[];
              this.workList.push(
                { WCNO: "c1", WCNAME: "一廠.縫盤" },
                { WCNO: "c2", WCNAME: "二廠.縫盤" },
                { WCNO: "c3", WCNAME: "三廠.縫盤" }
              ); 
              this.inProduct = this.inProduct1; 
          }, 1000); 
        } else {
          return false;
        }
      });
    },
    //改变工序---------------------Star
    jobListchange() {
      if (this.ruleForm.process == 1001 || this.ruleForm.process == 1002) {
        this.equipList.push(
          { EQMCODE: "SH8", EQMNAME: "SM8" },
          { EQMCODE: "SI8", EQMNAME: "SI 8G" },
          { EQMCODE: "SH10", EQMNAME: "SM 10G" },
          { EQMCODE: "STI12", EQMNAME: "SI 12G" },
          { EQMCODE: "SH12", EQMNAME: "SM 12G" },
          { EQMCODE: "ST16", EQMNAME: "STOLL 16G" },
          { EQMCODE: "ST7.2", EQMNAME: "ST 7.2" },
          { EQMCODE: "SH18", EQMNAME: "SM 18G" },
          { EQMCODE: "STI14", EQMNAME: "SI 14G" },
          { EQMCODE: "SH14", EQMNAME: "SM 14G" },
          { EQMCODE: "SH15", EQMNAME: "SM 15G" },
          { EQMCODE: "ST6.2", EQMNAME: "ST 6.2G" },
          { EQMCODE: "ST3", EQMNAME: "ST 3.5.2G" },
          { EQMCODE: "ST4", EQMNAME: "ST 4G" }
        );
      }
    }, 
    //展开隐藏批号信息
    toggleShow(i){  
      this.inProduct[i].show=!this.inProduct[i].show  
    },
    //調整批號狀態
    editOne(item){
      this.inDrag=true
      this.inForm.orderNo=item.orderNo
      console.log(item,98)
    },
    saveInDrag(){ 
          this.loading = true;  
          if(this.loading){  
            setTimeout(() => {
                for(var i=0;i<this.inProduct.length;i++){
                  if(this.inProduct[i].orderNo==this.inForm.orderNo){
                    this.inProduct[i].static=this.inForm.static
                  }
                }
                this.inDrag=false
                this.inForm={orderNo:'',static:1}
                this.loading = false;  
            }, 1500); 
          }else{
            this.$message({ type: "success", message: "請不要重複提交" });
          } 
    },
    submitForm(formName) {   
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;  
          if(this.loading){  
            setTimeout(() => { 
              for(var i=0;i<this.iwProduct.length;i++){
                if(this.iwProduct[i].orderNo==this.dragForm.item1){
                  this.inProduct.push(this.iwProduct[i])
                  this.iwProduct.splice(i,1)
                  console.log(this.dragForm,1222) 
                }
              }
              this.$message({ type: "success", message: "提交成功" });
              this.dragForm=this.dragForm1;
              this.loading = false; 
              this.phDrag = false;  
            }, 1000);           
          }else{
            this.$message({ type: "success", message: "請不要重複提交" });
          }
        } else { 
          return false;
        }
      });
    },
    //保存排序
    saveSort(){
        this.loading2 = true;  
        if(this.loading2){  
          setTimeout(() => {
            this.$message({ type: "success", message: "修改成功" });
            this.loading2 = false;  
          }, 1300); 
        }
    },
    nextPage2() {
      // var p_Dtfr = this.ruleForm.time[0];
      // var p_Dtto = this.ruleForm.time[1];
      this.$router.push({ path: "/Gantt"})
        // path: "/Gantt",
        // query: {
        //   p_Dtfr: p_Dtfr,
        //   p_Dtto: p_Dtto,
        //   p_Jobno: this.ruleForm.process,
        //   p_Wcno: this.w_Wcno
        // }
        //  });
    },

  },
  mounted() {
    // this.getJobListData();
   this.$dragging.$on('dragged', ({value}) => {
      console.log(value.item)
      console.log(value.list)
      console.log(value)
    }) 
  }
};
</script> 
<style scoped>


</style>
