(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[34],{D2qc:function(t,e,a){"use strict";var s=a("e42c"),i=a.n(s);i.a},QM0R:function(t,e,a){"use strict";var s=a("19FS"),i=function(t,e){return t?s["format"](t,e):"-"};e["a"]=i},RMM4:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.flase?a("div",{staticClass:"container--home"},[a("div",{staticClass:"total__container"},[a("div",{staticClass:"total__left"},[a("div",{staticClass:"total__title total__title--all"},[t._v("总卡数")]),a("div",{staticClass:"total__content"},[a("span",{staticClass:"total__text"},[t._v(t._s(t.total))]),a("span",{staticClass:"total__unit"},[t._v("（张）")])])]),a("div",{staticClass:"total__right"},[a("div",{staticClass:"total__title total__title--stock"},[t._v("库存待出库")]),a("div",{staticClass:"total__content"},[a("span",{staticClass:"total__type total__type--cmcc",attrs:{title:"移动"}},[t._v(t._s(t.stock.CMCC?t.stock.CMCC.inStore:0)+" ")]),a("span",{staticClass:"total__type total__type--unicom",attrs:{title:"联通"}},[t._v(t._s(t.stock.UNICOM?t.stock.UNICOM.inStore:0)+" ")]),a("span",{staticClass:"total__type total__type--cnet",attrs:{title:"电信"}},[t._v(t._s(t.stock.CNET?t.stock.CNET.inStore:0)+" ")])])])]),a("div",{staticClass:"section__title"},[t._v("卡数量")]),t._m(0),a("div",{staticClass:"section__title"},[t._v("月用量")]),a("div",{staticClass:"flow__container"},[a("div",{staticClass:"flow__header"},[a("el-date-picker",{staticClass:"date__input",attrs:{type:"month",placeholder:"选择日期"},on:{change:t.fetchMonthFlowValues},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}})],1),t._m(1)])]):a("h1",[t._v("to be continued")])},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pie__container"},[a("div",{staticClass:"pie__item"},[a("div",{staticClass:"pie__header"},[t._v("移动各状态卡数")]),a("div",{staticClass:"pie__body"},[a("div",{staticClass:"pie__wrapper pie__wrapper--cmcc"})])]),a("div",{staticClass:"pie__item"},[a("div",{staticClass:"pie__header"},[t._v("联通各状态卡数")]),a("div",{staticClass:"pie__body"},[a("div",{staticClass:"pie__wrapper pie__wrapper--unicom"})])]),a("div",{staticClass:"pie__item"},[a("div",{staticClass:"pie__header"},[t._v("电信各状态卡数")]),a("div",{staticClass:"pie__body"},[a("div",{staticClass:"pie__wrapper pie__wrapper--cnet"})])])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"flow__body"},[a("div",{staticClass:"graph__wrapper--flow"})])}],n=(a("HEwt"),a("iv4g")),r=(a("rGqo"),a("yt8O"),a("RW0V"),a("oyJW")),o=a("yT7P"),c=a("Fk5u"),l=a.n(c),u=a("Nlzp"),_=a("imai"),p=a("V4l9"),d=a("QM0R"),h={inactive:"#939090",using:"#54bce5",stopped:"#cecece",canceling:"#f7c94f",lost:"#91603f"},f={inactive:"待激活",using:"使用中",stopped:"停机",canceling:"预约取消",lost:"挂失"},v={WAITING_TO_ACTIVATE:"inactive",USING:"using",STOPPED:"stopped",APPOINT_TO_CANCEL_ACCOUNT:"canceling",LOST:"lost"},m=function(t){return t.reduce(function(t,e){var a;return e?Object(o["a"])({},t,(a={},Object(r["a"])(a,v[e.category],e.count),Object(r["a"])(a,"total",t.total+e.count),a)):t},Object(o["a"])({total:0},Object.keys(v).reduce(function(t,e){return Object(o["a"])({},t,Object(r["a"])({},v[e],0))},{})))},C={name:"home",data:function(){return{total:0,stock:{},date:new Date}},computed:{user:function(){return this.$store.getters.user},internal:function(){return"ADMIN"===this.user.roleBean.label}},methods:{fetchCardStockCounts:function(){var t=this;u["a"].ICardManager.getSummary({}).then(function(e){t.total=e.total,t.stock=e.countByOperator.reduce(function(t,e){return Object(o["a"])({},t,Object(r["a"])({},e.label,e))},{}),e.countByOperator.forEach(function(e){return t.renderStatusPieGraph(e.label,m(e.countInCategory))})}).catch(function(e){t.$message({type:"error",message:e.message||"获取库存数量失败"})})},fetchMonthFlowValues:function(t){var e=this,a=new Date(t);(this.internal?u["a"].IProxyManager.getHomeFlowCountInMonth({proxyId:this.user.id,month:+a}):u["a"].IProxyManager.getFlowCountInMonth({proxyId:this.user.id,month:+a})).then(function(t){e.renderDailyFlowGraph(Object(_["a"])(a),t)}).catch(function(t){e.$message({type:"error",message:t.message||"获取月流量趋势数据失败"})})},renderStatusPieGraph:function(t,e){if(this.charts){this.charts&&this.charts[t]&&this.charts[t].dispose();var a=["inactive","using","stopped","canceling","lost"],s=a.map(function(t){return{value:e[t],name:f[t],label:t}}),i={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{x:"center",y:"bottom",data:a.map(function(t){return{name:f[t],icon:"circle"}})},series:[{name:"各状态卡数",type:"pie",radius:"60%",center:["50%","45%"],hoverOffset:5,label:{normal:{show:!1},emphasis:{show:!0}},data:s,itemStyle:{color:function(t){return h[t.data.label]},emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},n=this.$el.querySelector(".pie__wrapper--"+t.toLowerCase()),r=l.a.init(n);r.setOption(i),this.charts[t]=r}},renderDailyFlowGraph:function(t,e){if(this.charts){this.charts&&this.charts.flow&&this.charts.flow.dispose();var a,s=function(e){for(var a=e.reduce(function(t,e){return Object(o["a"])({},t,Object(r["a"])({},new Date(e.date).getDate(),e.count))},{}),s=[],i=0;i<t;i++)s[i]=a[i+1]||0;return s},i=Math.max.apply(Math,Object(n["a"])(Object(p["a"])(e.map(function(t){return t.content.map(function(t){return t.count})}))).concat([0])),c=Math.pow(2,20);i<c?(i=c,a=c/5):i=void 0;var u=Object(d["a"])(this.date,"yyyy-MM-"),_={title:{text:"日用量趋势图",textStyle:{align:"right",fontWeight:"normal",fontColor:"#666",fontSize:12,height:16},padding:[10,0,0,0],left:0},tooltip:{trigger:"axis",formatter:function(t,e,a){var s=t[0].axisValue,i=u+(s<10?"0"+s:s),n=t.map(function(t){return t.marker+t.seriesName+": "+(t.value/Math.pow(2,20)).toFixed(1)+"G"});return"".concat(i,"<br/>").concat(n.join("<br/>"))}},grid:{left:"1%",top:"10%",right:"1%",bottom:"3%",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:Array.from({length:t},function(t,e){return e+1})},yAxis:{type:"value",max:i,interval:a,axisLabel:{formatter:function(t){var e=(t/Math.pow(2,20)).toFixed(1);return"0.0"===e?"0(GB)":e}}},series:e.map(function(t){return Object(o["a"])({},t,{type:"line",data:s(t.content)})})},h=this.$el.querySelector(".graph__wrapper--flow"),f=l.a.init(h);f.setOption(_),this.charts.flow=f}}},created:function(){},beforeDestroy:function(){var t=this;Object.keys(this.charts).forEach(function(e){t.charts[e]&&(t.charts[e].dispose(),t.charts[e]=null)}),this.charts=null}},y=C,b=(a("D2qc"),a("KHd+")),g=Object(b["a"])(y,s,i,!1,null,"78d1a1ce",null);e["default"]=g.exports},e42c:function(t,e,a){}}]);