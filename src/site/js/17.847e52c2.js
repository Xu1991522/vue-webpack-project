(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"0+h+":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("BackButton"),a("div",{staticStyle:{width:"100%",height:"36px",position:"relative",top:"-45px",left:"45px","z-index":"99"}},[a("div",{staticStyle:{float:"left","line-height":"36px",margin:"0 10px"}},[e._v("角色类型:")]),a("el-select",{staticStyle:{width:"300px"},model:{value:e.role.id,callback:function(t){e.$set(e.role,"id",t)},expression:"role.id"}},e._l(e.rolelist,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}))],1),a("el-row",{staticStyle:{position:"relative",top:"-25px"},attrs:{gutter:10}},[a("el-col",{attrs:{span:5}},[a("div",{staticClass:"inner-filt"},[a("el-input",{staticStyle:{width:"90%",margin:"0 0 10px 10px"},attrs:{placeholder:"搜索成员、部门"},on:{input:e.filter},model:{value:e.selectvalue,callback:function(t){e.selectvalue=t},expression:"selectvalue"}},[a("i",{staticClass:"el-input__icon el-icon-search",attrs:{slot:"prefix"},slot:"prefix"})]),e._l(e.groupedarr,function(t,l){return a("div",{key:l,class:[e.activename===t[0].departmentName?"tree-active":"","tree-item"],on:{click:function(i){e.selecttabledata(t,t[0].departmentName)}}},[a("img",{attrs:{src:i("Dd9m"),alt:""}}),a("span",{staticClass:"department-text"},[e._v(e._s(t[0].departmentName.length>4?t[0].departmentName.substring(8):t[0].departmentName))])])}),e.tipsshow?a("div",{staticStyle:{margin:"5px 20px","font-size":"12px",color:"#8791A1"}},[e._v("无相关成员或部门")]):e._e()],2)]),a("el-col",{attrs:{span:19}},[a("div",{staticClass:"tags-container"},[a("span",{staticStyle:{"margin-right":"10px","font-size":"12px","line-height":"40px"}},[e._v("已选择:")]),e._l(e.users,function(t){return a("el-tag",{key:t.userName,attrs:{closable:""},on:{close:function(i){e.handleClose(t)}}},[e._v("\n          "+e._s(t.userName)+"\n        ")])})],2),a("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{"max-height":e.clientHeight,data:e.tabledata},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection","min-width":"1"}}),a("el-table-column",{attrs:{prop:"userId",label:"用户名","min-width":"2"}}),a("el-table-column",{attrs:{prop:"userName",label:"姓名","min-width":"2"}}),a("el-table-column",{attrs:{prop:"departmentName",label:"部门","min-width":"6"}})],1),a("el-row",{staticStyle:{"margin-top":"20px"}},[a("el-col",{attrs:{span:2,offset:1}},[a("el-button",{staticStyle:{background:"#038ae3",color:"#fff"},attrs:{plain:"",disabled:!e.users.length},on:{click:function(t){e.insertUser("insert")}}},[e._v("添加")])],1),a("el-col",{attrs:{span:2}},[a("el-button",{staticStyle:{"margin-left":"15px"},on:{click:function(t){e.insertUser("cancel")}}},[e._v("取消")])],1)],1)],1)],1)],1)},l=[],n=(i("yt8O"),i("RW0V"),i("rGqo"),i("Nlzp")),s=i("oyJW"),r=i("iv4g"),c=i("yT7P"),o=function(e){return function(t){return t.reduce(function(t,i){var a=e(i);return Object(c["a"])({},t,Object(s["a"])({},a,Object(r["a"])(t[a]||[]).concat([i])))},{})}},u=o,d={name:"addAdmin",data:function(){return{treedata:[],tipsshow:!1,selectvalue:"",filteredarr:[],groupedarr:[],tabledata:[],users:[],activename:"",role:{id:""},rolelist:[],clientHeight:0}},created:function(){this.clientHeight=document.body.clientHeight>794?550:330,this.getAllRole(),this.getAllOaUserInfo()},methods:{getAllRole:function(){var e=this;n["a"].IUserService.getAllRole({}).then(function(t){e.rolelist=t})},insertUser:function(e,t){var i=this;"insert"===e?this.role.id?n["a"].IUserService.insertUser({users:this.users.map(function(e){return{loginName:e.userId,name:e.userName,roleBean:{id:i.role.id}}})}).then(function(e){if(!e)return Promise.reject(Error("该用户已激活"));i.$message({type:"success",message:"添加成功"}),i.$router.back()}).catch(function(e){i.$message({type:"error",message:e.message})}):this.$message({type:"warning",message:"请先选择角色类型"}):t?t.forEach(function(e){i.$refs.multipleTable.toggleRowSelection(e)}):this.$refs.multipleTable.clearSelection()},handleClose:function(e){this.insertUser("cancel",[this.users[this.users.indexOf(e)]]),this.users.splice(this.users.indexOf(e),1)},handleSelectionChange:function(e){this.users=e},getAllOaUserInfo:function(){var e=this;this.$api.IUserService.getAllOaUserInfo({}).then(function(t){e.treedata=t.users,e.filter()})},filter:function(){var e=this;this.filteredarr=[],this.treedata.forEach(function(t){(t.userName.indexOf(e.selectvalue)>-1||t.departmentName.indexOf(e.selectvalue)>-1||t.userId.indexOf(e.selectvalue)>-1)&&e.filteredarr.push(t)}),this.groupedarr=u(function(e){return e.departmentName})(this.filteredarr),this.tabledata=this.groupedarr[Object.keys(this.groupedarr)[0]],this.activename=Object.keys(this.groupedarr)[0],this.tipsshow="{}"===JSON.stringify(this.groupedarr)&&""!==this.selectvalue},selecttabledata:function(e,t){this.tabledata=e,this.activename=t}}},p=d,h=(i("7Ge4"),i("KHd+")),m=Object(h["a"])(p,a,l,!1,null,"6d75a5ec",null);t["default"]=m.exports},"7Ge4":function(e,t,i){"use strict";var a=i("uKhM"),l=i.n(a);l.a},Dd9m:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAIAAADd4huNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJBRDI0MDM0MzczMTFFOEIwQzE5M0Y0RDFBNTczREUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJBRDI0MDQ0MzczMTFFOEIwQzE5M0Y0RDFBNTczREUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkFEMjQwMTQzNzMxMUU4QjBDMTkzRjREMUE1NzNERSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkFEMjQwMjQzNzMxMUU4QjBDMTkzRjREMUE1NzNERSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Poj2VBMAAAA4SURBVHjaYqxZepEBA+R7q/Bxc6AJMjFgA7vOPMYUZPz5+y8DcYCledUVIpUyMRANRpWSoBQgwAAZqwplS6a8lgAAAABJRU5ErkJggg=="},uKhM:function(e,t,i){}}]);