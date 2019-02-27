<template>
  <div class="container">
    <!-- <div class="right-container" v-if="selectedTask"  :style="'height:' + wheight + 'px' ">
      <div class="gantt-selected-info">
        <div> 
          <span><b>工序: </b>{{selectedTask.id}}</span><br/> 
          <span><b>開始時間: </b>{{selectedTask.start_date|niceDate}}</span><br/>
          <span><b>結束時間: </b>{{selectedTask.end_date|niceDate}}</span><br/>
          <span><b>計劃工時: </b>{{selectedTask.duration}}天</span><br/>
          <span><b>完成度: </b>{{selectedTask.progress|toPercent}}%</span><br/> 
          <span><b>完成数量: </b>{{selectedTask.text}}</span><br/> 
        </div>
      </div> 
    </div> -->
    <gantt class="left-container"  :style="'height:' + wheight + 'px' " :tasks="tasks"  @task-updated="logTaskUpdate" @link-updated="logLinkUpdate" @task-selected="selectTask"></gantt>
    <el-button type="info" id="submit"  @click="submit" :loading="loading" size="small">保存</el-button>
   <!-- <el-button type="info" id="submit"  @click="submit" :loading="loading" size="small">保存</el-button>
      <el-dialog title="新增排產"  :visible.sync="phDrag" top="8%" :close-on-click-modal="true">
        <el-form :model="dragForm" :rules="dragRules" ref="dragForm" label-width="90px">  
          <el-form-item label="修改內容:" prop="item4">
            <el-select v-model="dragForm.item4" placeholder="請選擇優先級">
              <el-option label="特急" value="001"></el-option>
              <el-option label="正常" value="002"></el-option> 
            </el-select>
          </el-form-item>    
          <el-form-item>
            <el-button type="primary"   @click="phDrag = false" :loading="loading">提交</el-button>
            <el-button @click="phDrag = false">取消</el-button>
          </el-form-item>
        </el-form> 
      </el-dialog> -->
  
  </div>
</template>
<script>
import Gantt from './Gantt1.vue'  
export default {
  name: 'app',
  components: {Gantt},
  data () {
    return { 
      phDrag:false,
      dragForm:{
        item4:''
      },
      dragRules:{},
      loading:false,
      tasks: { 
        data: [
          {id:'XX部門',    text: '1000/3000',  start_date: '15-10-2018',   duration: 3, end_date: '7-12-2018',   progress: 1.1,        open: true,     parent: '', },
          {id:'縫盤',      text: '600/3000',   start_date: '15-10-2018',   duration: 3, end_date: '05-11-2018',  progress: 0.4,        open: true,     parent: 'XX部門',},
          {id:'埋夾',      text: '300/3000',   start_date: '20-10-2018',   duration: 7, end_date: '05-11-2018',  progress: 0.4,        open: true,     parent: '縫盤',}, 
          {id:'鎖眼',      text: '0/3000',     start_date: '30-10-2018',   duration: 3, end_date: '7-11-2018',   progress: 0,        open: true,     parent: '縫盤',},
          {id:'上領',      text: '0/3000',     start_date: '13-11-2018',   duration: 7, end_date: '1-12-2018',   progress: 0,        open: true,     parent: '縫盤',},
          {id:'NC18090211',text: '100/3000',   start_date: '21-10-2018',   duration: 7, end_date: '05-11-2018',  progress: 0.4,        open: true,     parent: '埋夾',}, 
          {id:'NC18090222',text: '20/3000',   start_date: '23-10-2018',   duration: 7,  end_date: '05-11-2018',  progress: 0.3,        open: true,     parent: '埋夾',}, 
          {id:'NC18090233',text: '300/3000',   start_date: '26-10-2018',   duration: 7, end_date: '05-11-2018',  progress: 0.2,        open: true,     parent: '埋夾',}, 
          {id:'挑撞',      text: '600/3000',   start_date: '25-11-2018',   duration: 3, end_date: '05-12-2018',  progress: 0.1,        open: true,     parent: 'XX部門',} 
        ], 
        links: [],
        newdata: [ 
          {id:'NC18090211',text: '1000/3000',  start_date: '5-10-2018',   duration: 3, end_date: '7-12-2018',   progress: 1.1,        open: true,     parent: '', },
          {id:'縫盤',      text: '600/3000',   start_date: '5-10-2018',   duration: 3, end_date: '05-11-2018',  progress: 0.4,        open: true,     parent: 'NC18090211',},
          {id:'埋夾',      text: '300/3000',   start_date: '8-10-2018',   duration: 7, end_date: '05-11-2018',  progress: 0.4,        open: true,     parent: '縫盤',}, 
          {id:'鎖眼',      text: '0/3000',     start_date: '9-10-2018',   duration: 3, end_date: '7-11-2018',   progress: 0,        open: true,     parent: '縫盤',},
          {id:'上領',      text: '0/3000',     start_date: '13-11-2018',   duration: 7, end_date: '1-12-2018',   progress: 0,        open: true,     parent: '縫盤',}
        ],  
        type:true
      },        
    selectedTask: null, 
    wheight:""
    }
  },
  filters: {
    toPercent (val) {
      if(!val) return '0'
      return Math.round((+val) * 100)
    },
    niceDate (obj){
      return `${obj.getFullYear()} / ${obj.getMonth()} / ${obj.getDate()}`
    }
  },
  methods: {
    submit(){
       this.loading = true;  
      if(this.loading){ 
        setTimeout(() => {
            this.$message({ type: "success", message: "保存成功" });
            this.loading = false;  
        }, 1200);   
      }
    },
    selectTask (task) { 
      //  this.$router.push({ path: "/Gantt3"})
            //  return false  
     
    }, 
    addMessage (message) { console.log(33)
      this.messages.unshift(message)
      if(this.messages.length > 40) {
        this.messages.pop()
      }
    }, 
    logTaskUpdate (id, mode, task) { 
      console.log(id, mode, task,998)
      let text = (task && task.text ? ` (${task.text})`: '')
      let message = `${mode}: ${id} ${text}`
      console.log(message.length,7887585)
      this.addMessage(message)
    },

    logLinkUpdate (id, mode, link) {
      console.log(11)
      let message = `Link ${mode}: ${id}`
      if(link){
        message += ` ( source: ${link.source}, target: ${link.target} )`
      }
      this.addMessage(message)
    },
    //获取數據 
    hh(){ 
  　　　 this.wheight=window.innerHeight-20;  
  　}
  },
  created(){
　　this.hh()  
  },
  mounted() {  
  }
}
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #submit{ position: fixed;right:10px; top:5px;}
.gantt_blank{ display: none}
.gantt_task_content{ text-align: left !important}
  .container {
    height: 100%;
    width: 100%;
  }
  .gantt_grid,.gantt_grid_data,.gantt_grid_scale{width: 410px !important}
  .gantt_cell {width:160px;}
  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
/* .gantt_task_line{height:12px !important;line-height: 12px !important}
.gantt_task_progress{ margin-top: 20px;} */
  .right-container {
    border-right: 1px solid #cecece;
    float: right;
    height: 100%;
    width: 340px;
    box-shadow: 0 0 5px 2px #aaa;
    position: relative;
    z-index:2;
  }

  .gantt-messages {
    list-style-type: none;
    height: 50%;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 5px;
  }

  .gantt-messages > .gantt-message {
    background-color: #f4f4f4;
    box-shadow:inset 5px 0 #d69000;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 5px 0;
    padding: 8px 0 8px 10px;
  }

  .gantt-selected-info {
  border-bottom: 1px solid #cecece;
    box-sizing: border-box;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    height: 50%;
    line-height: 28px;
    padding: 10px;
  }

  .gantt-selected-info h2 {
    border-bottom: 1px solid #cecece;
  }
  
  .select-task-prompt h2{
    color: #d9d9d9;
  }
  .gantt_task_line{
    background: #8edcec  !important
  }
</style>