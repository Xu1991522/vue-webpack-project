(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"48Bk":function(e,t,n){"use strict";var r=n("cn34"),a=n.n(r);a.a},VFj2:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.data,"span-method":e.colspan,border:""}},[n("el-table-column",{attrs:{label:"一级菜单",width:"240",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{staticClass:"content-rowspan"},[e.configurable?n("el-checkbox",{attrs:{value:!!e.selected[t.row.parent.label]},on:{change:function(n){return e.select(t.row.parent,n)}}},[e._v("\n          "+e._s(t.row.parent.name)+"\n        ")]):n("span",[e._v(e._s(t.row.parent.name))])],1)]}}])}),n("el-table-column",{attrs:{label:"二级菜单",align:"left",width:"240"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{staticClass:"content-rowspan"},[e.configurable&&!t.row.empty?n("el-checkbox",{attrs:{value:!!e.selected[t.row.label]},on:{change:function(n){return e.select(t.row,n)}}},[e._v("\n          "+e._s(t.row.name)+"\n        ")]):n("span",[e._v(e._s(t.row.empty?"无":t.row.name))])],1)]}}])}),n("el-table-column",{attrs:{label:"功能模块",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[!t.row.empty&&t.row.children.filter(function(e){return"4"!==e.category}).length?n("div",{staticClass:"content-rowspan"},[e.configurable?n("div",e._l(t.row.children.filter(function(e){return"4"!==e.category}),function(t){return n("el-checkbox",{key:t.id,attrs:{value:!!e.selected[t.label]},on:{change:function(n){return e.select(t,n)}}},[e._v("\n            "+e._s(t.name)+"\n          ")])})):n("span",[e._v(e._s(t.row.children.filter(function(e){return"4"!==e.category}).map(function(e){return e.name}).join("、")))])]):n("div",{staticClass:"content-rowspan"},[e._v("无")])]}}])})],1)},a=[],i=(n("SRfc"),n("Vd3H"),n("iv4g")),s=n("yT7P"),o=(n("f3/d"),n("rE2o"),n("ioFf"),n("rGqo"),n("V4l9")),c=function(e){var t=[],n=!0,r=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var o=i.value,c={parent:"",id:o.id,name:o.name,label:"1-"+o.id,children:[]},l=!0,u=!1,d=void 0;try{for(var f,h=o.subMenu[Symbol.iterator]();!(l=(f=h.next()).done);l=!0){var p=f.value,m={parent:c,id:p.id,name:p.name,label:"2-"+p.id,children:[]},v=!0,b=!1,g=void 0;try{for(var y,w=p.authEntities[Symbol.iterator]();!(v=(y=w.next()).done);v=!0){var _=y.value;m.children.push({parent:m,id:_.id,name:_.name,label:"3-"+_.id,category:_.category,children:[]})}}catch(e){b=!0,g=e}finally{try{v||null==w.return||w.return()}finally{if(b)throw g}}c.children.push(m)}}catch(e){u=!0,d=e}finally{try{l||null==h.return||h.return()}finally{if(u)throw d}}o.subMenu.length||c.children.push({parent:c,empty:!0}),t.push(c)}}catch(e){r=!0,a=e}finally{try{n||null==s.return||s.return()}finally{if(r)throw a}}return t},l=function(e){var t={},n=!0,r=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var o=i.value;t["1-"+o.id]=!0;var c=!0,l=!1,u=void 0;try{for(var d,f=(o.subMenu||[])[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var h=d.value;t["2-"+h.id]=!0;var p=!0,m=!1,v=void 0;try{for(var b,g=(h.authEntities||[])[Symbol.iterator]();!(p=(b=g.next()).done);p=!0){var y=b.value;t["3-"+y.id]=!0}}catch(e){m=!0,v=e}finally{try{p||null==g.return||g.return()}finally{if(m)throw v}}}}catch(e){l=!0,u=e}finally{try{c||null==f.return||f.return()}finally{if(l)throw u}}}}catch(e){r=!0,a=e}finally{try{n||null==s.return||s.return()}finally{if(r)throw a}}return t},u=function(e,t,n){var r={},a=function e(t){t.empty||(r[t.label]=!1,t.children.forEach(e))},i=function e(t){r[t.label]=!0,t.parent&&e(t.parent)};return n?i(e):a(e),Object(s["a"])({},t,r)},d=function(e,t){var n=[];return e.forEach(function(e){if(t[e.label]){var r={id:e.id,subMenu:[],authEntities:[]};n.push(r),e.children.forEach(function(e){if(t[e.label]){var n={id:e.id,subMenu:[],authEntities:[]};r.subMenu.push(n),e.children.forEach(function(e){t[e.label]&&n.authEntities.push({id:e.id,menu_id:n.id})})}})}}),n},f={name:"",props:{permissions:{type:Array,required:!0},granted:{type:Array,required:!0},configurable:{props:Boolean,default:!1}},data:function(){return{nodes:[],selected:{}}},computed:{data:function(){return Object(o["a"])(this.nodes.map(function(e){return e.children}))},colspan:function(){var e=function(e){return e[e.length-1]},t=this.nodes.reduce(function(t,n){var r=t.res,a=t.range,s=n.children.length;return{res:Object(i["a"])(r).concat([s]),range:Object(i["a"])(a).concat([e(a)+s])}},{res:[],range:[0]}),n=t.res,r=t.range;return function(e){e.row,e.column;var t=e.rowIndex,a=e.columnIndex;if(0===a){var i=r.indexOf(t);return i>-1?{rowspan:n[i],colspan:1}:{rowspan:0,colspan:0}}}}},methods:{setup:function(){var e=function(e){return e.sort(function(e,t){return e.sequence<t.sequence?-1:1})};this.nodes=c(e(this.permissions.map(function(t){return Object(s["a"])({},t,{subMenu:e((t.subMenu||[]).map(function(t){return Object(s["a"])({},t,{authEntities:e(t.authEntities||[])})}))})}))),this.selected=l(this.granted),this.$emit("change",d(this.nodes,this.selected))},select:function(e,t){var n=u(e,this.selected,t),r=[];e.label.match(/^1-/)&&t&&e.children.forEach(function(e){e.empty||(n=u(e,n,t),r.push(e))}),!e.empty&&e.label.match(/^2-/)&&t&&r.push(e),e.label.match(/^3-/)&&t&&r.push(e.parent),r.forEach(function(e){e.children.forEach(function(e){"4"===e.category&&(n=u(e,n,t))})}),this.selected=n}},created:function(){this.setup()},watch:{permissions:function(){this.setup()},granted:function(){this.setup()},selected:function(e){this.$emit("change",d(this.nodes,e))}}},h=f,p=n("KHd+"),m=Object(p["a"])(h,r,a,!1,null,null,null);t["a"]=m.exports},cn34:function(e,t,n){},j69K:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("BackButton"),n("div",{staticClass:"tab-con"},[n("div",{staticClass:"permissionTable"},[e.permissions.length?n("permissions-table",{attrs:{permissions:e.permissions,granted:e.granted,configurable:e.access.update},on:{change:function(t){e.selected=t}}}):n("div",{staticStyle:{padding:"20px"}},[e._v("权限加载中...")])],1),e.access.update?n("div",{staticClass:"buttonCon"},[n("el-row",[n("el-button",{staticStyle:{"margin-right":"15px"},attrs:{type:"primary",size:"small"},on:{click:e.save}},[e._v("保存配置")]),n("el-button",{attrs:{size:"small"},on:{click:e.cancel}},[e._v(" 取消 ")])],1)],1):e._e()])],1)},a=[],i=(n("f3/d"),n("Nlzp")),s=n("VFj2"),o={name:"assignPermissions",data:function(){return{action:"",role:{id:"",name:""},permissions:[],granted:[],selected:[],submitting:!1}},computed:{access:function(){var e=this.$store.getters.access.UPDATE_ROLE;return{update:e}}},methods:{save:function(){var e=this;if(!this.submitting){if(!this.selected.length)return this.$message({type:"error",message:"请配置角色权限"});this.submitting=!0,i["a"].IUserService.addRole({roleId:this.role.id,roleName:this.role.name,role:this.selected}).then(function(t){if(!t)return Promise.reject(Error("保存失败"));e.role.id===e.$store.getters.user.roleBean.id?e.$store.dispatch("REFRESH_PERMISSIONS").then(function(){return e.$router.back()}).catch(function(t){e.$message({type:"error",message:t.message||"重新获取权限失败"})}):e.$router.back()}).catch(function(t){e.$message({type:"error",message:t.message})}).then(function(){e.submitting=!1})}},cancel:function(){this.$router.back()}},created:function(){var e=this,t=this.$route.query;t.id&&(this.role={id:+t.id,name:t.name},i["a"].IUserService.getAuthList({roleId:+t.id}).then(function(t){e.granted=t,e.selected=t}).catch(function(n){e.$message({type:"error",message:n.message||"获取角色["+t.name+"]权限失败"})})),i["a"].IUserService.getAllMenuBeans({}).then(function(t){e.permissions=t}).catch(function(t){e.$message({type:"error",message:t.message||"获取全部权限失败"})})},components:{permissionsTable:s["a"]}},c=o,l=(n("48Bk"),n("KHd+")),u=Object(l["a"])(c,r,a,!1,null,"3f0ebe1d",null);t["default"]=u.exports}}]);