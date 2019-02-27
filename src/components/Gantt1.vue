<template>
  <div ref="gantt"></div> 
</template> 
<script>   
export default {
  name: 'gantt',
  props: {
    phDrag:{
       type: Boolean,
       default: false
    },
    dragForm:{
      type: Object,
      default () {
        return {dragForm: {}}
      }
    },
    tasks: {
      type: Object,
      default () {
        return {data: [],newdata: [], links: [],type:''}
      }
    }, 
  }, 
    
  methods: {
    $_initGanttEvents: function () {
      if(gantt.$_eventsInitialized) 
        if(this.$refs.tasks.type){ console.log(222)
          gantt.init(this.$refs.gantt)
          gantt.parse(this.$refs.newdata) 
        }else{ 
          console.log(111)
          return;
        }
      gantt.attachEvent('onTaskSelected', (id) => {  
        let task = gantt.getTask(id) 
        this.$emit('task-selected', task)   
        
      })
      gantt.attachEvent('onAfterTaskAdd', (id, task) => { 
        this.$emit('task-updated', id, 'inserted', task)
        task.progress = task.progress || 0
        if(gantt.getSelectedId() == id) {
          this.$emit('task-selected', task)
        }
      })
      // gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      //   this.$emit('task-updated', id, 'updated', task)
      // })
      gantt.attachEvent('onAfterTaskDelete', (id) => { 
        this.$emit('task-updated', id, 'deleted')
        if(!gantt.getSelectedId()) {
          this.$emit('task-selected', null)
        }
      })
      gantt.attachEvent('onAfterLinkAdd', (id, link) => { 
        this.$emit('link-updated', id, 'inserted', link)
      })
      gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
        this.$emit('link-updated', id, 'updated', link)
      })
      gantt.attachEvent('onAfterLinkDelete', (id, link) => {
        this.$emit('link-updated', id, 'deleted')
      })
      if(gantt.$_eventsInitialized){
        this.$refs.tasks.type=false
      }
      gantt.$_eventsInitialized = true
    },  
    // getData() { 
      //   const loading = this.$loading({
      //       lock: true,
      //       text: '加载中...',
      //       spinner: 'el-icon-loading',
      //       background: 'rgba(0, 0, 0, 0.25)'
      //     })
      //   var params={}
      //   this.tasks.data=[],
      //   // params.p_Dtfr  =  '2018-07-01'; 
      //   // params.p_Dtto  = '2018-07-31'; 
      //   // params.p_Jobno = 2001 
      //   // params.p_Wcno  = "('HYFL01.2001','HYFL06.2001')" 
      //   params.p_Dtfr  =new Date(this.$router.history.current.query.p_Dtfr); 
      //   params.p_Dtto  =new Date(this.$router.history.current.query.p_Dtto);  
      //   params.p_Jobno =this.$router.history.current.query.p_Jobno;  
      //   params.p_Wcno  =this.$router.history.current.query.p_Wcno;    
      //     GetWorkCenterGant(params).then(data => {  
      //       loading.close();
      //         if(data.indexOf("Error") != -1){ 
      //           this.$message.error('沒有數據')  
      //         }else  if(data){
      //         console.log(data,'aaaaaadd') 
      //           this.tasks.data=data   
      //           this.$_initGanttEvents(); 
      //           gantt.init(this.$refs.gantt)
      //           gantt.parse(this.$props.tasks)
      //         }else{
      //           this.$message.error("请稍後再試或联系管理员~"); 
      //         } 
      //       }).catch(() => { 
      //         loading.close();
      //         this.$message.error('請求超時，请稍后再试~');
      //       });
    // },
  },
  mounted () {
    // console.log(this.$router,'this.$router') 
    //  this.getData() 
      this.$_initGanttEvents(); 
      gantt.init(this.$refs.gantt)
      gantt.parse(this.$props.tasks)
} 
}
</script>

<style>
 .gantt_task_progress_drag,.gantt_link_point,.gantt_add,#add,.gantt_grid_head_add {
    display: none !important;
} 
</style>