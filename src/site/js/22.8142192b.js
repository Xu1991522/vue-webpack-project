(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{AV0v:function(e,t,a){"use strict";var n=a("AoJk"),s=a.n(n);s.a},AoJk:function(e,t,a){},NkKH:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.pagebean,border:""}},[a("el-table-column",{attrs:{prop:"name",label:"任务名称","min-width":"25"}}),a("el-table-column",{attrs:{prop:"runningStatusName",label:"运行状态","min-width":"8"}}),a("el-table-column",{attrs:{prop:"description",label:"任务描述","min-width":"40"}}),a("el-table-column",{attrs:{prop:"statusName",label:"任务状态",width:"100"}}),e.access.update?a("el-table-column",{attrs:{label:"操作",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.access.update&&"就绪待执行"===e.pagebean[t.$index].runningStatusName?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.operate("runRightNow",e.pagebean[t.$index].name)}}},[e._v("立即执行")]):e._e(),e.access.update&&"启用"===e.pagebean[t.$index].statusName?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.operate("disable",e.pagebean[t.$index].name)}}},[e._v("禁用")]):e._e(),e.access.update&&"禁用"===e.pagebean[t.$index].statusName?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.operate("enable",e.pagebean[t.$index].name)}}},[e._v("启用")]):e._e()]}}])}):e._e()],1),a("el-pagination",{attrs:{background:"","current-page":e.pager.pageIndex,"page-sizes":[10,20,30,40,50],"page-size":e.pager.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.pager.recCount},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)},s=[],i={name:"",data:function(){return{loading:!0,pager:{pageIndex:1,pageSize:10,recCount:0},pagebean:[]}},computed:{access:function(){var e=this.$store.getters.access.UPDATE_TASK;return{update:e}}},created:function(){this.list()},methods:{list:function(){var e=this;this.$api.ITaskManager.list({page:this.pager.pageIndex-1,size:this.pager.pageSize}).then(function(t){e.loading=!1,e.pagebean=t.content,e.pager.pageIndex=t.number+1,e.pager.pageSize=t.size,e.pager.recCount=t.totalElements})},handleCurrentChange:function(e){this.pager.pageIndex=e,this.list()},handleSizeChange:function(e){this.pager.pageSize=e,this.list()},enableJob:function(e){var t=this;this.$api.ITaskManager.enableJob({name:e}).then(function(e){e?(t.list(),t.$message({message:"启用成功",type:"success"})):t.$message({message:"启用失败，请联系管理员",type:"error"})})},runRightNow:function(e){var t=this;this.$api.ITaskManager.runRightNow({name:e}).then(function(e){e?(t.list(),t.$message({message:"执行成功",type:"success"})):t.$message({message:"执行失败，请联系管理员",type:"error"})})},disable:function(e){var t=this;this.$api.ITaskManager.disable({name:e}).then(function(e){e?(t.list(),t.$message({message:"禁用成功",type:"success"})):t.$message({message:"禁用失败，请联系管理员",type:"error"})})},operate:function(e,t){var a=this;"runRightNow"===e?this.$confirm("您确定要立即执行"+t+"么",{type:"warning"}).then(function(){a.runRightNow(t)}).catch(function(e){return e}):"disable"===e?this.$confirm("您确定要禁用"+t+"么",{type:"warning"}).then(function(){a.disable(t)}).catch(function(e){return e}):this.$confirm("您确定要启用"+t+"么",{type:"warning"}).then(function(){a.enableJob(t)}).catch(function(e){return e})}}},r=i,o=(a("AV0v"),a("KHd+")),c=Object(o["a"])(r,n,s,!1,null,"6b5be5a4",null);t["default"]=c.exports}}]);