(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[31],{"5FnI":function(t,a,s){},PQvm:function(t,a,s){"use strict";var e=s("5FnI"),n=s.n(e);n.a},QM0R:function(t,a,s){"use strict";var e=s("19FS"),n=function(t,a){return t?e["format"](t,a):"-"};a["a"]=n},tjru:function(t,a,s){"use strict";s("pIFo");var e=function t(a){var s={0:"零",1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"七",8:"八",9:"九",10:"十"};if(a<10)return s[a];var e=[Math.floor(a/1e4),a%1e4],n=e[0],i=e[1],r=[Math.floor(i/1e3),i%1e3],c=r[0],o=r[1],l=[Math.floor(o/100),o%100],u=l[0],d=l[1],_=[Math.floor(d/10),d%10],p=_[0],h=_[1],v=(n>1e4?t(Math.floor(n/1e4))+"亿"+(n%1e4>1e3?"":"零")+t(n%1e4)+"万":t(n)+"万")+s[c]+"千"+s[u]+"百"+s[p]+"十"+s[h];return v.replace(/零万|零千|零百|零十/g,"零").replace(/^零+/,"").replace(/零+$/,"").replace(/零+/g,"零").replace("万万","亿").replace(/^一十/,"十")};a["a"]=e},uyV8:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return t.pending?s("div",[t._v("\n  Loading...\n")]):s("div",{staticClass:"container--proxy-details"},[s("BackButton"),s("div",{staticClass:"header"},[s("h2",{staticClass:"text--company"},[t._v(t._s(t.entity.company))]),s("span",{staticClass:"text--type"},[t._v(t._s(t.formatLevel(t.entity)))])]),s("div",{staticClass:"cards__panel"},[s("el-row",{staticClass:"cards__line",attrs:{gutter:50}},[s("el-col",{attrs:{span:12}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner w50"},[s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("总卡数")]),s("span",{staticClass:"card__number card__number--total"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].total||0))])]),s("span",{staticClass:"card__icon card__icon--total"})]),s("div",{staticClass:"graph__wrapper--status w50"})])]),s("el-col",{attrs:{span:6}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner"},[s("span",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("待激活的卡")]),s("span",{staticClass:"card__number card__number--inactive"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].inactive||0))])]),s("span",{staticClass:"card__icon card__icon--inactive"})])])]),s("el-col",{attrs:{span:6}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner"},[s("span",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("使用中的卡")]),s("span",{staticClass:"card__number card__number--using"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].using||0))])]),s("span",{staticClass:"card__icon card__icon--using"})])])])],1),s("el-row",{staticClass:"cards__line",attrs:{gutter:50}},[s("el-col",{attrs:{span:6}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner"},[s("span",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("停机的卡")]),s("span",{staticClass:"card__number card__number--stopped"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].stopped||0))])]),s("span",{staticClass:"card__icon card__icon--stopped"})])])]),s("el-col",{attrs:{span:6}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner"},[s("span",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("预约取消的卡")]),s("span",{staticClass:"card__number card__number--canceling"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].canceling||0))])]),s("span",{staticClass:"card__icon card__icon--canceling"})])])]),s("el-col",{attrs:{span:6}},[s("div",{staticClass:"card__panel"},[s("div",{staticClass:"panel__inner"},[s("span",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("挂失的卡")]),s("span",{staticClass:"card__number card__number--lost"},[t._v(t._s(t.counts[t.entity.id]&&t.counts[t.entity.id].lost||0))])]),s("span",{staticClass:"card__icon card__icon--lost"})])])])],1)],1),t.internal||t.user.id===t.entity.id?s("div",{staticClass:"subordinate__proxy"},[s("div",{class:["subordinate__op",t.opened?"is-active":""],on:{click:function(a){t.opened=!t.opened}}},[t._v("\n      查看旗下的代理商\n    ")]),s("div",{directives:[{name:"show",rawName:"v-show",value:t.subs.length&&t.opened,expression:"subs.length && opened"}],staticClass:"subordinate__list"},t._l(t.subs,function(a){return s("div",{key:a.id,staticClass:"subordinate__item"},[s("div",{staticClass:"subordinate__title"},[s("span",{staticClass:"text--company"},[t._v(t._s(a.company))]),s("span",{staticClass:"text--type"},[t._v(t._s(t.formatLevel(a)))]),s("router-link",{staticClass:"text__link",attrs:{to:t.$route.fullPath.replace(/proxy=(\d)+/,"proxy="+a.id)}},[t._v("查看详情")])],1),t.counts[a.id]?s("div",{staticClass:"subordinate__cards"},[s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--total"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("总卡数")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].total))])])]),s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--inactive"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("待激活的卡")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].inactive))])])]),s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--using"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("使用中的卡")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].using))])])]),s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--stopped"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("停机的卡")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].stopped))])])]),s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--canceling"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("预约取消的卡")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].canceling))])])]),s("div",{staticClass:"sub__card"},[s("i",{staticClass:"card__icon card__icon--lost"}),s("div",{staticClass:"card__content"},[s("span",{staticClass:"card__text"},[t._v("挂失的卡")]),s("span",{staticClass:"card__number"},[t._v(t._s(t.counts[a.id].lost))])])])]):t._e()])})),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.subs.length&&t.opened,expression:"!subs.length && opened"}],staticClass:"empty__notice"},[t._v("\n      暂无次级代理\n    ")])]):t._e(),s("div",{staticClass:"statistics__panel"},[s("div",{staticClass:"panel__header"},[s("span",{staticClass:"header__title"},[t._v("卡的流量情况")]),s("span",{staticClass:"text header__description"},[t._v("上月总量：")]),s("span",{staticClass:"text"},[t._v("移动：")]),s("span",{staticClass:"value"},[t._v(t._s(t.total.CMCC))]),s("span",{staticClass:"text"},[t._v("电信：")]),s("span",{staticClass:"value"},[t._v(t._s(t.total.CNET))]),s("span",{staticClass:"text"},[t._v("联通：")]),s("span",{staticClass:"value"},[t._v(t._s(t.total.UNICOM))]),s("el-date-picker",{staticClass:"date__input",attrs:{type:"month",placeholder:"选择日期"},on:{change:t.fetchMonthFlowValues},model:{value:t.date,callback:function(a){t.date=a},expression:"date"}})],1),t._m(0),t.internal||t.user.id===t.entity.id?s("div",{staticClass:"outer-link-setting"},[s("div",[s("div",{staticClass:"item item-name search-icon"},[t._v("外部查询")]),"ENABLE"===t.externalQueryEnum?s("div",{staticClass:"item item-status"},[t._v("已开启")]):t._e(),"DISABLE"===t.externalQueryEnum?s("div",{staticClass:"item item-status"},[t._v("已关闭")]):t._e(),"DISABLE"===t.externalQueryEnum?s("el-button",{staticClass:"item item-btn",attrs:{type:"text",disabled:!t.access.update},on:{click:function(a){t.updateExternalQuery("ENABLE")}}},[t._v("开启外部查询")]):t._e(),"ENABLE"===t.externalQueryEnum?s("el-button",{staticClass:"item item-btn",attrs:{type:"text",disabled:!t.access.update},on:{click:function(a){t.updateExternalQuery("DISABLE")}}},[t._v("关闭外部查询")]):t._e()],1),s("div",[s("div",{staticClass:"item item-name"},[t._v("二维码")]),s("div",{staticClass:"item item-status"},[t._v(t._s("ENABLE"===t.externalQueryEnum?"已生效":"已关闭"))]),s("a",{staticStyle:{color:"inherit"},attrs:{href:t.imgsrc,download:"二维码"},on:{click:t.checkhref}},["ENABLE"===t.externalQueryEnum?s("el-button",{staticClass:"item item-btn",attrs:{type:"text"}},[t._v("下载")]):t._e()],1)]),s("div",[s("div",{staticClass:"item item-name"},[t._v("网址")]),s("div",{staticClass:"item item-status"},[t._v(t._s("ENABLE"===t.externalQueryEnum?"已生效":"已关闭"))]),"ENABLE"===t.externalQueryEnum?s("el-button",{directives:[{name:"clipboard",rawName:"v-clipboard:copy",value:t.url,expression:"url",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"},{name:"clipboard",rawName:"v-clipboard:error",value:t.onError,expression:"onError",arg:"error"}],staticClass:"item item-btn",attrs:{type:"text"}},[t._v("复制")]):t._e()],1),s("div",[s("div",{staticClass:"item item-name"},[t._v("售后电话")]),t.inputshow?t._e():s("div",{staticClass:"item item-status"},[t._v(t._s(t.hotLine?t.hotLine:"不显示"))]),s("el-input",{directives:[{name:"show",rawName:"v-show",value:t.inputshow,expression:"inputshow"}],staticClass:"item item-status",model:{value:t.hotLine,callback:function(a){t.hotLine=a},expression:"hotLine"}}),t.inputshow?t._e():s("el-button",{staticClass:"item item-btn",attrs:{type:"text"},on:{click:function(a){t.inputshow=!t.inputshow}}},[t._v("编辑号码")]),t.inputshow?s("el-button",{staticClass:"item item-btn",attrs:{type:"text"},on:{click:t.updateHotline}},[t._v("确定")]):t._e()],1)]):t._e()])],1)},n=[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"panel__body"},[s("div",{staticClass:"graph__wrapper--flow"})])}],i=(s("rGqo"),s("yt8O"),s("HEwt"),s("iv4g")),r=s("oyJW"),c=s("yT7P"),o=s("Kw5r"),l=s("Fk5u"),u=s.n(l),d=s("TrUB"),_=s.n(d),p=s("0FX9"),h=s.n(p),v=s("Nlzp"),m=s("imai"),f=s("V4l9"),y=s("tjru"),C=s("QM0R");o["default"].use(_.a);var g={inactive:"#939090",using:"#54bce5",stopped:"#cecece",canceling:"#f7c94f",lost:"#91603f"},x={inactive:"待激活",using:"使用中",stopped:"停机",canceling:"预约取消",lost:"挂失"},b={0:"unknown",1:"inactive",2:"using",3:"stopped",4:"canceling",5:"lost"},w=function(t){return t.reduce(function(t,a){var s;return Object(c["a"])({},t,(s={},Object(r["a"])(s,b[a.category],a.count),Object(r["a"])(s,"total",t.total+a.count),s))},{total:0})},E={name:"",data:function(){return{pending:!0,externalQueryEnum:"",hotLine:"",url:"",entity:{},proxyId:"",subs:[],counts:{},total:{},imgsrc:"",opened:!1,inputshow:!1,date:""}},computed:{user:function(){return this.$store.getters.user},internal:function(){return"ADMIN"===this.user.roleBean.label},access:function(){var t=this.$store.getters.access,a=t.ADD_PROXY,s=t.UPDATE_PROXY;return{add:a,update:s}}},methods:{checkhref:function(t){"DISABLE"===this.externalQueryEnum&&t.preventDefault()},download:function(){window.open(this.imgsrc)},updateHotline:function(){var t=this;this.inputshow=!this.inputshow,v["a"].IProxyManager.updateHotline({proxyId:this.entity.id,hotLine:this.hotLine}).then(function(a){t.$message({type:"success",message:"编辑成功"}),t.hotLine=a}).catch(function(a){t.$message({type:"error",message:a.message||"编辑失败"})})},onCopy:function(t){this.$message({type:"success",message:"外部查询地址已复制成功"})},onError:function(t){alert("复制失败")},formatLevel:function(t){var a=this.internal;return a?Object(y["a"])(t.level)+"级代理":t.id===this.user.id?"代理商":"次级代理"},renderDailyFlowGraph:function(t,a){this.charts&&this.charts.flow&&this.charts.flow.dispose();var s,e=function(a){for(var s=a.reduce(function(t,a){return Object(c["a"])({},t,Object(r["a"])({},new Date(a.date).getDate(),a.count))},{}),e=[],n=0;n<t;n++)e[n]=s[n+1]||0;return e},n=Math.max.apply(Math,Object(i["a"])(Object(f["a"])(a.map(function(t){return t.content.map(function(t){return t.count})}))).concat([0])),o=Math.pow(2,20);n<o?(n=o,s=o/5):n=void 0;var l=Object(C["a"])(this.date,"yyyy-MM-"),d={title:{text:"日用量趋势图",textStyle:{align:"right",fontWeight:"normal",fontColor:"#666",fontSize:12,height:16},padding:[10,0,0,0],left:0},tooltip:{trigger:"axis",formatter:function(t,a,s){var e=t[0].axisValue,n=l+(e<10?"0"+e:e),i=t.map(function(t){return t.marker+t.seriesName+": "+(t.value/Math.pow(2,20)).toFixed(1)+"G"});return"".concat(n,"<br/>").concat(i.join("<br/>"))}},grid:{left:"1%",top:"10%",right:"1%",bottom:"3%",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:Array.from({length:t},function(t,a){return a+1})},yAxis:{type:"value",max:n,interval:s,axisLabel:{formatter:function(t){var a=(t/Math.pow(2,20)).toFixed(1);return"0.0"===a?"0(GB)":a}}},series:a.map(function(t){return Object(c["a"])({},t,{type:"line",data:e(t.content)})})},_=this.$el.querySelector(".graph__wrapper--flow"),p=u.a.init(_);p.setOption(d),this.charts.flow=p},renderStatusPieGraph:function(t){this.charts&&this.charts.status&&this.charts.status.dispose();var a=["inactive","using","stopped","canceling","lost"].map(function(a){return{value:t[a],name:x[a],label:a}}),s={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},series:[{name:"各状态卡数",type:"pie",radius:"70%",center:["50%","50%"],hoverOffset:5,label:{normal:{show:!1},emphasis:{show:!0}},data:a,itemStyle:{color:function(t){return g[t.data.label]},emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},e=this.$el.querySelector(".graph__wrapper--status"),n=u.a.init(e);n.setOption(s),this.charts.status=n},fetchSubProxies:function(){var t=this;v["a"].IProxyManager.getSecProxylist({proxyId:this.entity.id,deep:!1}).then(function(a){t.subs=a,Promise.all(a.map(function(t){return v["a"].IProxyManager.getCardCount({proxyId:t.id})})).then(function(s){s.forEach(function(s,e){o["default"].set(t.counts,a[e].id,w(s))})})})},fetchCardsCount:function(){var t=this;return v["a"].IProxyManager.getCardCount({proxyId:this.entity.id}).then(function(a){o["default"].set(t.counts,t.entity.id,w(a))}).catch(function(a){return t.$message({type:"error",message:a.message||"获取各状态卡数量失败"}),Promise.reject(a)})},fetchMonthTotalValue:function(){var t=this,a=new Date;a.setMonth(a.getMonth()-1);var s=function(t){return t.reduce(function(t,a){return Object(c["a"])({},t,Object(r["a"])({},a.label,a.flowMonth?(a.flowMonth/Math.pow(2,20)).toFixed(1)+"G":0))},{})};v["a"].IProxyManager.cardMonthFlow({proxyId:this.entity.id,month:+a}).then(function(a){t.total=s(a)}).catch(function(a){t.$message({type:"error",message:a.message||"获取上月总量失败"})})},updateExternalQuery:function(t){var a=this;v["a"].IProxyManager.updateExternalQuery({proxyId:this.entity.id,externalQueryEnum:t}).then(function(t){a.$message({type:"success",message:"操作成功"}),a.externalQueryEnum=t}).catch(function(t){a.$message({type:"error",message:t.message||"操作失败"})})},getExternalUrl:function(){var t=this;v["a"].IProxyManager.externalUrl({userId:this.$route.query.proxy}).then(function(a){h.a.toDataURL(a).then(function(a){t.imgsrc=a}).catch(function(t){console.error(t)}),t.url=a}).catch(function(a){t.$message({type:"error",message:a.message||"获取网址失败"})})},fetchMonthFlowValues:function(t){var a=this,s=new Date(t);return v["a"].IProxyManager.getFlowCountInMonth({proxyId:this.entity.id,month:+s}).then(function(t){a.renderDailyFlowGraph(Object(m["a"])(s),t)}).catch(function(t){a.$message({type:"error",message:t.message||"获取卡日用量趋势数据失败"})})},setup:function(){var t=this;this.pending=!0;var a=+this.$route.query.proxy;this.entity={},this.counts={},this.total={},this.opened=!1;var s=new Date;this.date=s,this.getExternalUrl(),v["a"].IProxyManager.getProxy({id:a}).then(function(a){t.externalQueryEnum=a.externalQuery,t.entity=a,t.hotLine=a.hotLine,t.pending=!1,t.fetchCardsCount().then(function(){t.renderStatusPieGraph(t.counts[t.entity.id])}),t.fetchMonthTotalValue(),t.fetchMonthFlowValues(s);var e=t.internal||t.user.id===t.entity.id;e&&t.fetchSubProxies()}).catch(function(a){t.$message({type:"error",message:a.message||"获取代理商详情失败"})}),this.charts||(this.charts={})}},watch:{"$route.query.proxy":function(t){this.setup()}},mounted:function(){this.setup()},beforeDestroy:function(){this.charts&&this.charts.status&&this.charts.status.dispose(),this.charts&&this.charts.flow&&this.charts.flow.dispose(),this.charts=null}},M=E,L=(s("PQvm"),s("KHd+")),I=Object(L["a"])(M,e,n,!1,null,"49c82f3f",null);a["default"]=I.exports}}]);