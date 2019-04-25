<template>
  <div @click="menuparameter.show = false" class="cardmanage--useage-pane">
    <div class="bottom">
      <el-button size="small" type="primary" style="position:absolute;top:0;right:160px;z-index:99;" @click="turnrouter" v-if="user.roleBean.label !== 'ADMIN'&&access.groupshow">分组管理</el-button>
      <el-button size="small" type="primary" style="position:absolute;top:0;right:10px;z-index:99;" @click="excelCards">导出搜索结果</el-button>
      <el-row style="line-height:36px;" :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入卡号、ICCID"  v-model="condition.cardNumberOrIccid">
            <el-button slot="append" @click="listDetailInPageByCondition">搜索</el-button>
          </el-input>
          </el-col>
        <el-col :span="2"><el-button style="border:1px solid #038ae3;color:#038ae3;" @click="choosesearchtype">高级搜索<i :class="[selectionshow?'el-icon-arrow-up':'el-icon-arrow-down','el-icon--right']" style="margin:0 -10px 0 10px;"></i></el-button></el-col>
      </el-row>
      <el-row v-if="selectionshow" style="margin-top:15px;">
        <el-col :span="24">
          <el-row>
            <el-col :span="7" v-if="user.roleBean.label === 'ADMIN'">
              <span class="labe-text" style="margin-left:14px;">供应商</span>
              <el-select placeholder="请选择" filterable v-model="condition.providerId" class="el-se-long">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in suppliers"
                  :key="index"
                  :label="item.name+'('+item.enName+')'+'-'+item.account"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="labe-text" style="margin-left:14px;">运营商</span>
              <el-select placeholder="请选择" v-model="condition.operator" class="el-se">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in operators"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="labe-text">运营状态</span>
              <el-select placeholder="请选择" v-model="condition.operatorStatus" class="el-se">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in operatorstatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="labe-text">本地状态</span>
              <el-select placeholder="请选择" v-model="condition.localStatus" class="el-se">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in localstatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;">
            <el-col :span="7" v-if="user.roleBean.label === 'ADMIN'">
              <span class="labe-text">根代理商</span>
              <el-select placeholder="请选择" filterable  v-model="condition.proxyId" class="el-se-long" :disabled="condition.ownnerId!==''">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in proxybeans"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="labe-text">卡拥有者</span>
              <el-select placeholder="请选择" filterable v-model="condition.ownnerId" class="el-se" :disabled="condition.proxyId!==''">
                <el-option
                  :label="'全部'"
                  :value="''">
                </el-option>
                <el-option
                  v-for="(item,index) in proxybeans"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="labe-text">激活时间</span>
              <el-date-picker
                v-model="condition.activeTime"
                type="date"
                :editable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"  class="el-se">
              </el-date-picker>
            </el-col>
            <el-col :span="7">
              <span class="labe-text">备注内容</span><el-input placeholder="请输入备注" style="width:43%" v-model="condition.remark"></el-input>
              <el-button type="primary" @click="listDetailInPageByCondition" style="margin-left:10px;">搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div style="margin-top:5px;" v-if="ids.length">
        <div style="line-height:36px;display:inline-block;font-size:14px;">已选择{{ids.length}}条</div>
        <el-dropdown  style="width:100px;margin-left:10px;">
            <el-button type="primary">
              移动到<i class="el-icon-arrow-down el-icon--right"  style="margin-left:15px;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><div @click="moveToGroup('',false)">无</div></el-dropdown-item>
              <el-dropdown-item v-for="(el,index) in groups" :key="index"><div @click="moveToGroup(el.groupId,false)">{{el.groupName}}</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown style="width:100px;margin-left:10px;">
            <el-button type="primary">
              分配给代理<i class="el-icon-arrow-down el-icon--right" style="margin-left:15px;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(el,index) in proxybeans" :key="index"><div @click="asignToProxy(el.id,el.name,false)">{{el.name}}</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary"  @click="showremarkpop(false)" style="width:100px;margin-left:35px;">
              添加备注
            </el-button>
      </div>
      <Contextmenu :menuparameter="menuparameter" @selectedchanged="selectedchanged"></Contextmenu>
      <el-table
        border
        ref="pagebean"
        :data="pagebean"
        v-loading="loading"
        tooltip-effect="dark"
        :max-height="clientHeight"
        style="width: 100%;margin-top:5px;"
        @header-contextmenu="headerclick"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          v-if="user.roleBean.label !== 'ADMIN'"
          width="55">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed
          v-if="menuparameter.selected.indexOf('操作')>-1"
          width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom-start">
              <el-button class="el-dropdown-link" type="text" :style="{color:user.roleBean.label === 'ADMIN'?'#038ae3':scope.row.ownerId === user.id && access.append?'#038ae3':'#EEEEEE'}" :disabled="user.roleBean.label === 'ADMIN'?false:scope.row.ownerId === user.id && access.append?false:true">操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="(scope.row.operatorName === '中国移动'|| scope.row.operatorName === '中国电信'||scope.row.operatorName === '中国联通')&&user.roleBean.label !== 'ADMIN'">移动分组到
                  <el-dropdown placement="right-start" class="innerdrop">
                    <div class="el-dropdown-link"><i class="el-icon-caret-right" ></i></div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><div @click="moveToGroup('',true,scope.row.id)">无</div></el-dropdown-item>
                      <el-dropdown-item v-for="(el,index) in groups" :key="index"><div @click="moveToGroup(el.groupId,true,scope.row.id)">{{el.groupName}}</div></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-dropdown-item>
                <el-dropdown-item v-if="user.roleBean.label !== 'ADMIN'"><div @click="showremarkpop(true,scope.row.id)">备注名称</div></el-dropdown-item>
                <el-dropdown-item v-if="access.append"><div @click="showupdateflowpop(scope.row.id)">更改资费计划</div></el-dropdown-item>
                <el-dropdown-item v-if="access.append"><div @click="showaddpackagepop(scope.row.id)">叠加流量</div></el-dropdown-item>
                <el-dropdown-item v-if="(scope.row.operatorName === '中国移动' || scope.row.operatorName === '中国联通' || scope.row.operatorName === '中国电信')&&user.roleBean.label !== 'ADMIN'">移动代理到
                  <el-dropdown placement="right-start" class="innerdrop">
                  <div class="el-dropdown-link"><i class="el-icon-caret-right" ></i></div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(el,index) in proxybeans" :key="index"><div @click="asignToProxy(el.id,el.name,true,scope.row.id)">{{el.name}}</div></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </template>
        </el-table-column>
        <el-table-column
          label="卡号"
          :min-width="pagebean.every((el)=>el.cardNumber===''||el.cardNumber===null)?'60':'180'">
          <template slot-scope="scope">
            {{scope.row.cardNumber === ''||scope.row.cardNumber === null?'-':scope.row.cardNumber}}
          </template>
        </el-table-column>
        <el-table-column
          label="ICCID"
          v-if="menuparameter.selected.indexOf('ICCID')>-1"
          :width="getmaxlength(row => row.iccid || '-','iccid')">
          <template slot-scope="scope">
            {{scope.row.iccid === ''||scope.row.iccid === null?'-':scope.row.iccid}}
          </template>
        </el-table-column>
        <el-table-column
          label="IMSI"
          v-if="menuparameter.selected.indexOf('IMSI')>-1"
          :width="getmaxlength(row => row.imsi || '-','imsi')">
          <template slot-scope="scope">
            {{scope.row.imsi === ''||scope.row.imsi === null?'-':scope.row.imsi}}
          </template>
        </el-table-column>
        <el-table-column
          label="IMEI"
          v-if="menuparameter.selected.indexOf('IMEI')>-1"
        :width="getmaxlength(row => row.imei || '-','imsi')">
          <template slot-scope="scope">
            {{scope.row.imei === ''||scope.row.imei === null?'-':scope.row.imei}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="运营商"
          v-if="menuparameter.selected.indexOf('运营商')>-1"
          width="80">
        </el-table-column>
        <el-table-column
          prop="providerName"
          label="供应商"
          v-if="user.roleBean.label === 'ADMIN'&&menuparameter.selected.indexOf('供应商')>-1"
          width="80">
        </el-table-column>
        <el-table-column
          label="根代理/上级代理"
          v-if="user.roleBean.label === 'ADMIN'&&menuparameter.selected.indexOf('根代理/上级代理')>-1"
          :width="getmaxlength(row => row.rootProxyName + '/' + row.parentProxyName,'根代理/上级代理')">
          <template slot-scope="{ row }">
            {{ row.rootProxyName + '/' + row.parentProxyName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ownnerName"
          label="实际拥有者"
          v-if="menuparameter.selected.indexOf('实际拥有者')>-1"
          width="100">
        </el-table-column>
        <el-table-column
          prop="chargeTypeName"
          label="计费类型"
          v-if="menuparameter.selected.indexOf('计费类型')>-1"
          width="80">
        </el-table-column>
        <el-table-column
          label="本地状态"
          v-if="menuparameter.selected.indexOf('本地状态')>-1"
          width="80">
          <template slot-scope="scope">
            {{scope.row.localStatusName === ''||scope.row.localStatusName === null?'-':scope.row.localStatusName}}
          </template>
        </el-table-column>
        <el-table-column
          label="运营状态"
          v-if="menuparameter.selected.indexOf('运营状态')>-1"
          width="80">
          <template slot-scope="scope">
            {{scope.row.operatorStatusName === ''||scope.row.operatorStatusName === null?'-':scope.row.operatorStatusName}}
          </template>
        </el-table-column>
        <el-table-column
          label="开卡时间"
          v-if="menuparameter.selected.indexOf('开卡时间')>-1"
          :width="pagebean.every((el)=>el.openTime===''||el.openTime===null)?'80':'155'">
          <template slot-scope="scope">
            <span>{{ scope.row.openTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="激活时间"
          v-if="menuparameter.selected.indexOf('激活时间')>-1"
          :width="pagebean.every((el)=>el.activeTime===''||el.activeTime===null)?'80':'155'">
          <template slot-scope="scope">
            <span>{{ scope.row.activeTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          v-if="menuparameter.selected.indexOf('备注')>-1"
          :width="getmaxlength(row => row.remark || '-','remark')">
          <template slot-scope="scope">
            {{scope.row.remark === ''||scope.row.remark === null?'-':scope.row.remark}}
          </template>
        </el-table-column>
        <el-table-column
          label="分组"
          v-if="menuparameter.selected.indexOf('分组')>-1"
          :width="getmaxlength(row => row.groupName || '-','分组')">
          <template slot-scope="{ row }">
            {{ row.groupName || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="详细信息"
          v-if="menuparameter.selected.indexOf('详细信息')>-1"
          width="80">
          <template slot-scope="scope"><div class="operate-text" @click="getCardDetailInfo(scope.row.id)">查看</div></template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.pageIndex"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.recCount">
      </el-pagination>
    </div>

    <el-dialog
      title="编辑备注名称"
      :close-on-click-modal="false"
      :visible.sync="remarkpop"
      width="30%"
    >
      <div class="content">
        备注:<el-input v-model="remark" placeholder="请输入0-20个字符，留空表示删除备注" style="width:340px;margin-left:15px;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkpop = false">取消</el-button>
        <el-button class="confirm-button" @click="updateRemark">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="叠加流量"
      :close-on-click-modal="false"
      :visible.sync="addpackagepop"
      width="30%"
    >
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="5">套餐类型:</el-col>
          <el-col :span="18"><el-select v-model="packageType" placeholder="请选择" @change="filterpackageType" style="width:100%">
              <el-option
                  v-for="(item,index) in types"
                  :key="index"
                  :label="item.name"
                  :value="item.packageType">
              </el-option>
          </el-select></el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top:10px;">
          <el-col :span="5">套餐名称:</el-col>
          <el-col :span="18"><el-select v-model="packageId" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in flowpackagebean"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addpackagepop = false;">取消</el-button>
        <el-button class="confirm-button" @click="addFlowPackage">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="更改资费计划"
      :close-on-click-modal="false"
      :visible.sync="updateflowpop"
      width="30%"
    >
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="5">套餐类型:</el-col>
          <el-col :span="18"><el-select v-model="packageType" placeholder="请选择" @change="filterpackageType" style="width:100%">
              <el-option
                  v-for="(item,index) in types"
                  :key="index"
                  :label="item.name"
                  :value="item.packageType">
              </el-option>
          </el-select></el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top:10px;">
          <el-col :span="5">套餐名称:</el-col>
          <el-col :span="18"><el-select v-model="packageId" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in flowpackagebean"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateflowpop = false;">取消</el-button>
        <el-button class="confirm-button" @click="updateFlowPackage">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="(popinfo.cardNumber ? '卡号 ' + popinfo.cardNumber : 'ICCID ' + popinfo.iccid) + ' 详情'"
      :close-on-click-modal="false"
      :visible.sync="infopop"
      :width="clientWidth"
    >
      <div class="content">
        <el-row>
          <el-col :span="7">ICCID:{{popinfo.iccid}} </el-col>
          <el-col :span="7">IMSI:{{popinfo.imsi || '-'}}</el-col>
          <el-col :span="7">IMEI:{{popinfo.imei || '-'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">状态信息:</el-col>
          <el-col :span="21">{{popinfo.operatorStatusName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">运营商:</el-col>
          <el-col :span="21">{{popinfo.operatorName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">开卡时间:</el-col>
          <el-col :span="21">{{popinfo.openTime | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">激活时间:</el-col>
          <el-col :span="21">{{popinfo.activeTime | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">其他信息:</el-col>
          <el-col :span="21"><pre>{{popinfo.appendix | html}}</pre></el-col>
        </el-row>
        <el-row>
          <el-col :span="3">套餐总量: </el-col>
          <el-col :span="21">{{allmount}}KB<span v-if="access.rectify" style="color:#1EA185;cursor:pointer;margin-left:5px;" @click="fixedrowshow = !fixedrowshow">校正</span></el-col>
        </el-row>
        <el-row v-if="access.append&&fixedrowshow" gutter="10">
          <el-col :span="3">确认添加:</el-col>
          <el-col :span="11">
            <el-select v-model="packageId" placeholder="请选择" @change="showtotal" style="width:100%">
              <el-option
                v-for="item in flowpackagebean"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3"><el-input
            v-model="totalmount"
            :disabled="true">
          </el-input>
          </el-col>
          <el-col :span="3">
            <el-button class="confirm-button" style="width:100%;margin-left:10px;" @click="checkPackage">确认</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">订购套餐:</el-col>
          <el-col :span="20">
            <el-table
              :data="popinfo.orderPackages"
              style="width: 100%;margin-top:10px;">
              <el-table-column
                prop="pack.name"
                label="套餐名称"
                min-width="3">
              </el-table-column>
              <el-table-column
                label="生效时间"
                min-width="3">
                <template slot-scope="scope">
                  <span>{{ scope.row.orderTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="套餐总量"
                min-width="2">
                <template slot-scope="scope">
                  <span>{{ Number(scope.row.total) * 1024 | conver}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="套餐剩余量"
                min-width="2">
                <template slot-scope="scope">
                  <span>{{ Number(scope.row.remainder) * 1024 | conver}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="utilizationRate"
                label="套餐使用率"
                min-width="2">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="confirm-button"  @click="infopop = false;">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'
import taskRunner from '../common/task/task'
import time from '../../filters/time'

const html = (value) => {
  return value ? value.replace(/&nbsp;/g, ' ').replace(/<br(\/?)>/g, '\n') : '-'
}
const conver = (limit) => {
  var size = ''
  if (limit < 0.1 * 1024) {
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  var sizestr = size + ''
  var len = sizestr.indexOf('.')
  var dec = sizestr.substr(len + 1, 2)
  if (dec === '00') {
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
  }
  return sizestr
}
export default {
  name: '',
  data () {
    return {
      fixedrowshow: false,
      user: {}, // 用户
      loading: true, // 表格加载
      selectionshow: false, // 全部选项展开
      infopop: false, // 查看详情弹出层
      addpackagepop: false, // 添加套餐弹出层
      remarkpop: false, // 备注出层
      updateflowpop: false, // 更改资费计划弹出层
      operators: [
        { value: 'CMCC', label: '中国移动' },
        { value: 'UNICOM', label: '中国联通' },
        { value: 'CNET', label: '中国电信' }
      ], // 三大运营商
      suppliers: [], // 供应商
      localstatus: [
        { value: 'ABANDON', label: '废弃' },
        { value: 'NORMAL', label: '正常' }
      ], // 本地状态
      operatorstatus: [
        { value: 'STOPPED', label: '停机' },
        { value: 'USING', label: '正使用中' },
        { value: 'WAITING_TO_ACTIVATE', label: '待激活' },
        { value: 'REPORTED_LOST', label: '挂失' },
        { value: 'APPOINT_TO_CANCEL_ACCOUNT', label: '预约销户' }
      ], // 运营商状态
      types: [
        { packageType: 1, name: '月包' },
        { packageType: 2, name: '季包' },
        { packageType: 3, name: '半年包' },
        { packageType: 4, name: '年包' },
        { packageType: 5, name: '叠加包' }
      ], // 套餐类型
      proxybeans: [], // 代理商和运营商
      CardCountSummary: {}, // 卡数数据包
      popinfo: {}, // 弹出层数据包
      flowpackagebean: [], // 流量包们
      condition: {
        operatorStatus: '',
        remark: '',
        activeTime: '',
        proxyId: '',
        providerId: '',
        localStatus: '',
        ownnerId: '',
        operator: '',
        cardNumberOrIccid: ''
      }, // 查询条件
      pagebean: [], // 表格数据
      totalmount: '', // 套餐总流量
      cardId: '', // 卡id
      singleid: '', // 单独处理的卡id
      single: false, // 是否单独备注
      packageId: '', // 套餐id
      ids: [], // 移动分组卡ID们
      remark: '', // 备注
      clientHeight: 0, // 高度
      clientWidth: 0, // 宽度
      allmount: 0, // 套餐总量校正
      filteredtypes: [], // 筛选过的套餐类型
      packageType: '', // 筛选的套餐值
      multipleSelection: [],
      options: [
        { value: 1, label: '1' }
      ],
      input: '',
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      }, // 分页
      menuparameter: {} // 右键菜单参数
    }
  },
  computed: {
    access () {
      const {
        APPEND_PACKAGE,
        RECTIFY_FLOW,
        UPDATE_GROUP
      } = this.$store.getters.access

      return {
        append: APPEND_PACKAGE,
        rectify: RECTIFY_FLOW,
        groupshow: UPDATE_GROUP
      }
    }
  },
  created () {
    this.user = this.$store.getters.user
    if (this.user.roleBean.label === 'ADMIN') {
      this.menuparameter = {
        show: false,
        position: {},
        list: ['操作', 'ICCID', 'IMEI', 'IMSI', '供应商', '根代理/上级代理', '运营商', '实际拥有者', '计费类型', '本地状态', '运营状态', '开卡时间', '激活时间', '备注', '分组', '详细信息'],
        selected: ['操作', 'ICCID', 'IMEI', 'IMSI', '供应商', '根代理/上级代理', '运营商', '实际拥有者', '计费类型', '本地状态', '运营状态', '开卡时间', '激活时间', '备注', '分组', '详细信息']
      } // 右键菜单参数
    } else {
      this.menuparameter = {
        show: false,
        position: {},
        list: ['操作', 'ICCID', 'IMEI', 'IMSI', '运营商', '实际拥有者', '计费类型', '本地状态', '运营状态', '开卡时间', '激活时间', '备注', '分组', '详细信息'],
        selected: ['操作', 'ICCID', 'IMEI', 'IMSI', '运营商', '实际拥有者', '计费类型', '本地状态', '运营状态', '开卡时间', '激活时间', '备注', '分组', '详细信息']
      } // 右键菜单参数
    }
    this.clientHeight = document.body.clientHeight >= 794 ? 550 : 280
    this.clientWidth = document.body.clientWidth > 1600 ? '45%' : '70%'
    if (this.access.groupshow) {
      this.getGroupsById()
    }
    this.getSummary()
    this.listDetailInPage()
    this.listBriefProviders()
    this.listBriefProxies()
  },
  methods: {
    getmaxlength (transform, title) {
      let max = 0

      this.pagebean.forEach(el => {
        const realStr = transform(el)

        const temp = realStr.replace(/[^0-9a-zA-Z]/g, '--').length

        max = temp > max ? temp : max
      })

      if (title && max < title.replace(/[^0-9a-zA-Z]/g, '--').length) {
        max = title.replace(/[^0-9a-zA-Z]/g, '--').length
      }

      return max * 8 + 21
    },
    getGroupsById () {
      // 分组们
      api.ICardGroupManager.getGroupsById({
        id: this.user.id
      }).then(res => {
        this.groups = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    getSummary () {
      // 获取卡数量
      api.ICardManager.getSummary({
      }).then(res => {
        this.CardCountSummary = res.countByOperator.reduce((acc, x) => ({ ...acc, [x.label]: x.inStore }), {})
        this.CardCountSummary.total = res.total
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    listDetailInPage () {
      // 列出卡管理里的分页卡详情
      api.ICardManager.listDetailInPage({
        page: this.pager.pageIndex - 1,
        size: this.pager.pageSize
      }).then(res => {
        this.loading = false
        this.pagebean = res.content
        this.pager.pageIndex = res.number + 1
        this.pager.pageSize = res.size
        this.pager.recCount = res.totalElements
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    listBriefProviders () {
      // 获取供应商下拉
      api.IProviderManager.listBriefProviders({
      }).then(res => {
        this.suppliers = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    listBriefProxies () {
      // 获取代理简略信息列表
      api.IProxyManager.listBriefProxies({
      }).then(res => {
        this.proxybeans = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    listDetailInPageByCondition () {
      var b = Object.assign({}, this.condition)
      Object.keys(b).forEach(function (key) {
        if (b[key] === '') {
          b[key] = null
        }
      })
      api.ICardManager.listDetailInPageByCondition({
        page: this.pager.pageIndex - 1,
        size: this.pager.pageSize,
        condition: b
      }).then(res => {
        this.loading = false
        this.pagebean = res.content
        this.pager.pageIndex = res.number + 1
        this.pager.pageSize = res.size
        this.pager.recCount = res.totalElements
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    getCardDetailInfo (id) {
      // 弹出层信息
      this.cardId = id
      this.fixedrowshow = false
      this.packageId = ''
      this.totalmount = ''
      api.ICardManager.getCardDetailInfo({
        cardId: id
      }).then(res => {
        this.popinfo = res
        this.allmount = res.orderPackages.reduce((total, current) => total + Number(current.pack.total), 0)
        this.listFlowPackageByCardId(id)
        this.infopop = true
      })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    fixedmount () {
      // 校正总流量和
      api.ICardManager.getCardDetailInfo({
        cardId: this.cardId
      }).then(res => {
        if (res) {
          this.popinfo = res
          this.allmount = res.orderPackages.reduce((total, current) => total + Number(current.pack.total), 0)
        } else {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    listFlowPackageByCardId (id) {
      // 列出指定卡能够订购叠加的套餐
      api.ICardManager.listFlowPackageByCardId({
        id: id
      }).then(res => {
        this.flowpackagebean = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    showtotal (value) {
      // 显示对应的套餐总流量
      this.totalmount = this.flowpackagebean.find((obj) => obj.id === value).total
    },
    updateFlowPackage () {
      // 更改资费计划
      if (this.cardId === '' || this.packageId === '') {
        this.$message({
          message: '请选择套餐类型和套餐名称',
          type: 'warning'
        })
      } else {
        api.ICardManager.updateFlowPackage({
          cardId: this.cardId,
          packageId: this.packageId
        }).then(res => {
          if (Number(res.code) === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.updateflowpop = false
            this.listDetailInPageByCondition()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
    },
    checkPackage () {
      // 校正套餐
      if (this.packageId === '') {
        this.$message({
          message: '请选择添加套餐',
          type: 'warning'
        })
      } else {
        api.ICardManager.checkPackage({
          cardId: this.cardId,
          packageId: this.packageId
        }).then(res => {
          if (Number(res.code) === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.listDetailInPageByCondition()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
    },
    addFlowPackage () {
      // 给指定卡叠加套餐
      if (this.packageId === '') {
        this.$message({
          message: '请选择添加套餐',
          type: 'warning'
        })
      } else {
        api.ICardManager.addFlowPackage({
          cardId: this.cardId,
          packageId: this.packageId
        }).then(res => {
          this.fixedmount()
          if (Number(res.code) === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.addpackagepop = false
            this.listDetailInPageByCondition()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
    },
    showremarkpop (single, singleid) {
      this.remark = ''
      this.single = single
      this.singleid = single ? singleid : ''
      this.remarkpop = true
    },
    showaddpackagepop (singleid) {
      this.cardId = singleid
      this.addpackagepop = true
      this.packageId = ''
      this.packageType = ''
      this.listFlowPackageByCardId(singleid)
    },
    showupdateflowpop (singleid) {
      this.cardId = singleid
      this.packageId = ''
      this.packageType = ''
      this.updateflowpop = true
      this.listFlowPackageByCardId(singleid)
    },
    moveToGroup (groupId, single, singleid) {
      // 移动一堆卡到指定分组
      this.singleid = single ? singleid : ''
      api.ICardManager.moveToGroup({
        ids: single ? [this.singleid] : this.ids.map(x => (x.id)),
        groupId: groupId === '' ? null : groupId
      }).then(res => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.listDetailInPageByCondition()
        } else {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    asignToProxy (proxyId, name, single, singleid) {
      // 分配卡到指定代理
      this.singleid = single ? singleid : ''
      this.$msgbox({
        title: '提示',
        message: <div>您确定要把该卡分配给[ {name} ]吗?<br />分配后您将无权再对该卡进行操作且操作不可逆!</div>,
        showCancelButton: true
      }).then(action => {
        api.ICardManager.asignToProxy({
          ids: single ? [this.singleid] : this.ids.map(x => (x.id)),
          proxyId: proxyId
        }).then(res => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.listDetailInPageByCondition()
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        })
      }).catch(x => x)
    },
    updateRemark () {
      // 修改备注
      if (this.remark.length > 20) {
        this.$message({
          message: '备注为0-20个字符，请重新输入',
          type: 'warning'
        })
      } else {
        api.ICardManager.updateRemark({
          ids: this.single ? [this.singleid] : this.ids.map(x => (x.id)),
          remark: this.remark
        }).then(res => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.remarkpop = false
            this.listDetailInPageByCondition()
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
    },
    excelCards () {
      // 导出搜索记录
      var b = Object.assign({}, this.condition)
      Object.keys(b).forEach(function (key) {
        if (b[key] === '') {
          b[key] = null
        }
      })
      api.ICardManager.excelCards({
        condition: b
      })
        .then(res => {
          if (!res.fileUrl) {
            return Promise.reject(Error(res.message))
          }

          this.$message({
            type: 'success',
            message: '文件下载任务已开启，文件生成后将提醒您下载'
          })

          taskRunner.add(res.fileUrl)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '文件生成失败'
          })
        })
    },
    choosesearchtype () {
      this.selectionshow = !this.selectionshow
    },
    turnrouter () {
      this.$router.push({
        path: '/cardManage/cardDivide',
        query: {
          title: '卡分组管理'
        }
      })
    },
    filterpackageType () {
      this.filteredtypes = this.flowpackagebean.filter((obj) => obj.packageType === this.packageType)
    },
    handleSelectionChange (val) {
      var temp = []
      this.pagebean.forEach((el, index) => { if (el.ownerId !== this.user.id) { temp.push(this.pagebean[index]) } })
      temp.forEach(row => {
        this.$refs.pagebean.toggleRowSelection(row, false)
      })
      this.ids = val.filter((obj) => obj.ownerId === this.user.id)
    },
    selectedchanged (val) {
      this.menuparameter.selected = val
    },
    headerclick (column, event) {
      this.menuparameter.position.clientX = event.clientX
      this.menuparameter.position.clientY = event.clientY
      this.menuparameter.show = true
      event.preventDefault()
    },
    handleCurrentChange (val) {
      this.pager.pageIndex = val
      this.listDetailInPageByCondition()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.listDetailInPageByCondition()
    }
  },
  filters: {
    time,
    html,
    conver
  }
}
</script>
<style lang="scss">
.cardmanage--useage-pane {
  .el-input-group__append {
    background: #038ae3 !important;
    color: #fff !important;
    border: 1px solid #038ae3;
  }
}
</style>

<style scoped>
.top {
  width: 100%;
  position: relative;
  height: 80px;
  top: -10px;
}
.middle {
  height: 10px;
  background: #e7ebed;
  margin: 0 -15px;
}
.bottom {
  width: 100%;
  position: relative;
  padding-bottom:15px;
}
.totalcard {
  position: absolute;
  left: 22px;
  top: 13px;
  height: 16px;
  width: 16px;
  background: url('./../../assets/total-icon.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.totalcard-text {
  position: absolute;
  left: 45px;
  top: 10px;
  color: #6a6a6a;
  font-size: 16px;
}
.totalcard-num {
  position: absolute;
  left: 22px;
  top: 40px;
  color: #6a6a6a;
  font-size: 20px;
  color: #151515;
}
.totalcard-num .unit {
  font-size: 15px;
  margin-left: 5px;
}
.middle-line {
  position: absolute;
  left: 240px;
  top: 20px;
  height: 40px;
  border: 1px solid #d8d8d8;
}
.waitout {
  position: absolute;
  left: 350px;
  top: 13px;
  width: 100px;
  height: 16px;
  width: 16px;
  background: url('./../../assets/stock-icon.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.waitout-text {
  position: absolute;
  left: 373px;
  top: 10px;
  color: #6a6a6a;
  font-size: 16px;
}
.num-container {
  position: absolute;
  top: 40px;
  left: 350px;
}
.waitout-unicom {
  font-size: 20px;
  color: #151515;
  background: url('./../../assets/unicom.png') no-repeat 100% 50%;
  background-size: 23px 23px;
  display: inline-block;
  padding-right: 30px;
}
.waitout-cmcc {
  font-size: 20px;
  color: #151515;
  background: url('./../../assets/cmcc.png') no-repeat 100% 50%;
  background-size: 23px 23px;
  margin-left: 40px;
  display: inline-block;
  padding-right: 30px;
}
.waitout-cnet {
  font-size: 20px;
  color: #151515;
  background: url('./../../assets/cnet.png') no-repeat 100% 50%;
  background-size: 23px 23px;
  margin-left: 40px;
  display: inline-block;
  padding-right: 30px;
}
.labe-text {
  float: left;
  line-height: 38px;
  margin-right: 10px;
  font-size: 14px;
}
.el-se {
  width: 60% !important;
}
.el-se-long {
  width: 70% !important;
}
.filtmanagebutton {
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translate(0, -50%);
}
.operate-text {
  cursor: pointer;
  color: #038ae3;
}
.content {
  margin: -20px 0 0 20px;
  width: 100%;
}
.content .el-row {
  line-height: 36px;
}
.el-dropdown {
  height: 0 !important;
}
.el-dropdown-menu__item {
  position: relative;
}
.innerdrop {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  text-align: right;
}
.innerdrop .el-icon-caret-right {
  padding-left: 5px;
}
</style>
