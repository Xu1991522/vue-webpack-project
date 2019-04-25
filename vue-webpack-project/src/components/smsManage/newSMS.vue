<template>
  <div>
      <BackButton></BackButton>
      <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="form__div">
        <el-form-item label="短信类型：">
          <el-radio v-model="form.smsType" label="short">短内容</el-radio>
        </el-form-item>
        <el-form-item label="短信内容：" prop="content">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入短信内容"
            v-model="form.content"
            :debounce="300"
            @input="handleContentInput"
            style="width:600px"
          >
          </el-input>
          <span class="limits-span" v-if="false">还可输入<b>{{ form.limit - toCharSize(form.content) }}</b>个字符</span>
        </el-form-item>
        <el-form-item label="添加号码：">
          <el-radio-group v-model="importType">
            <el-radio v-for="item in importTypes" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <div v-if="importType === 'EXACT_IMPORT'">
            <el-input v-model="searchedNumbers" placeholder="多个号码，用英文逗号隔开" style="width:400px;"></el-input>
            <el-button
              type="primary"
              size="small"
              @click="importCardsByCardNumbers"
              style="margin:4px 0 0 15px;"
            >添加</el-button>
          </div>
          <div v-else-if="importType === 'BATCH_IMPORT'" style="height:auto;">
            <el-upload
              action="/portal-srv/upload/cardsFile"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-progress="handleUploadProgress"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              style="float: left"
            >
              <el-input :disabled="true" :value="file.name" style="width: 300px;" placeholder="仅支持上传单个Excel文件">
              </el-input>
              <el-button class="confirm-button" style="margin-left:15px;">+上传文件</el-button>
            </el-upload>
            <a class="download" target="_black" href="./download/card__temp.xlsx" style="margin:4px 0 0 15px;float:left">下载模板</a>
          </div>
          <div class="clear"></div>
          <div class="table__div">
            <el-table
              border
              :data="panel.cards"
              v-loading="loading"
              tooltip-effect="dark"
              empty-text="暂无数据">
              <el-table-column
                prop="msisdn"
                label="卡号"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="operatorName"
                label="运营商"
                width="160"
              ></el-table-column>
              <el-table-column
                prop="operatorStatusDesc"
                label="运营状态"
                width="160"
              ></el-table-column>
              <el-table-column
                label="开卡时间"
              >
                <template slot-scope="scope">
                  {{ scope.row.openTime | time('yyyy-MM-dd HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column
                label="激活时间"
              >
                <template slot-scope="scope">
                  {{ scope.row.activeTime | time('yyyy-MM-dd HH:mm:ss') }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-sizes="[10, 20, 30, 40,50]"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="panel.pager.index"
              :page-size="panel.pager.size"
              :total="panel.pager.count">
            </el-pagination>

            <div class="clear"></div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="confirm-button" @click="send" style="margin-right:18px">发送</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import Vue from 'vue'

  import api from '../../api'

  import toCharSize from '../../helpers/to-char-size'

  import time from '../../filters/time'

  // case: abc -> 3
  // case 中文 -> 4
  // case 中文abc -> (2 + 3) * 2 = 10
  const calcRemantChars = (limit, content) => {
    const l = toCharSize(content)

    // no zh chars
    if (l === content.length) {
      return Math.floor((limit - l) / 2)
    }

    return Math.floor(limit / 2 - content.length)
  }

  export default {
    name: '',
    data () {
      // char
      // 120 en chars
      // 60 zh en mixed chars
      const limit = 120

      return {
        loading: false,

        form: {
          smsType: 'short',
          content: '',
          limit
        },

        searchedNumbers: '',
        numbersPanel: {
          batchId: '',
          cards: [],
          pager: {
            index: 1,
            size: 10,
            count: 0
          }
        },

        filesPanel: {
          batchId: '',
          cards: [],
          pager: {
            index: 1,
            size: 10,
            count: 0
          }
        },

        rules: {
          content: [
            { required: true, message: '请输入短信内容', trigger: 'blur' }
          ]
        },

        importType: 'EXACT_IMPORT',
        importTypes: [
          { value: 'EXACT_IMPORT', label: '确认添加' },
          { value: 'BATCH_IMPORT', label: '文件添加' }
        ],

        // single file required
        file: {
          name: '',
          progress: '',
          url: ''
        },

        smsTargetMsisdnData: []
      }
    },

    computed: {
      toCharSize () {
        return toCharSize
      },
      remnant () {
        const l = calcRemantChars(this.form.limit, this.form.content)

        if (l < 0) {
          return 0
        }

        return l
      },
      panel () {
        return this.importType === 'EXACT_IMPORT' ? this.numbersPanel : this.filesPanel
      }
    },

    methods: {
      handleContentInput (val) {
        const limit = this.form.limit

        if (calcRemantChars(limit, val) < 0) {
          const l = val.length
          let i = this.form.limit / 2

          // use nextTick to update
          // otherwise, the input value would't be updated
          Vue.nextTick(() => {
            while (i < l) {
              if (calcRemantChars(limit, val.slice(0, i + 1)) < 0) {
                break
              }

              i++
            }

            this.form.content = val.slice(0, i)
          })
        }
      },
      importCardsByCardNumbers () {
        const input = this.searchedNumbers.trim()

        if (!input) {
          return this.$message({
            type: 'error',
            message: '请输入查询号码'
          })
        }

        // case 1, 2, 3
        const numbers = input.split(/\s*,\s*/).map(x => x.trim())

        // remove old batch id imported by numbers
        ;(this.numbersPanel.batchId
          ? api.ISmsManager.cancelSmsSendReq({ batchId: this.numbersPanel.batchId }).catch(x => x)
          : Promise.resolve()
        )
          .then(() => api.ISmsManager.importMsisdnsForSms({ msisdns: numbers, exact: true }))
          .then(res => {
            this.numbersPanel.batchId = res.batchId

            this.fetchImportedCards(1, this.numbersPanel.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '发送号码查询失败'
            })
          })
      },
      importCardsByFiles () {
        if (!this.file.name) {
          return this.$message({
            type: 'error',
            message: '请先上传文件'
          })
        }

        const uploading = !this.file.url

        if (uploading) {
          return this.$message({
            type: 'error',
            message: '请等待所有文件上传完成'
          })
        }

        // remove old batch id imported by file
        (this.filesPanel.batchId
          ? api.ISmsManager.cancelSmsSendReq({ batchId: this.filesPanel.batchId }).catch(x => x)
          : Promise.resolve()
        )
          .then(() => api.ISmsManager.importMsisdnsForSms({ fileUrl: [this.file.url], exact: false }))
          .then(res => {
            this.filesPanel.batchId = res.batchId

            this.fetchImportedCards(1, this.filesPanel.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '发送号码查询失败'
            })
          })
      },

      send () {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }

          const panel = this.importType === 'EXACT_IMPORT' ? this.numbersPanel : this.filesPanel

          if (!panel.batchId || !panel.pager.count) {
            return this.$message({
              type: 'error',
              message: '请添加号码'
            })
          }

          api.ISmsManager.listSmsCardTempInfo({ batchId: panel.batchId, page: 0, size: panel.pager.count })
            .then(res => {
              const params = {
                smsCategory: this.form.smsType,
                content: this.form.content,
                msisdns: res.smsTargetMsisdnList.content.map(x => x.msisdn),
                batchId: panel.batchId
              }

              return api.ISmsManager.confirmSmsSendReq(params)
            })
            .then(res => {
              if (res.code === 1000) {
                return
              }

              return Promise.reject(Error(res.msg))
            })
            .then(() => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })

              this.$router.back()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message || '发送失败'
              })
            })
        })
      },
      cancel () {
        // just go back, don't need to re fetch batch list
        this.$router.back()
      },

      handleBeforeUpload (file) {
        this.file = {
          name: file.name,
          progress: 0,
          url: ''
        }

        return true
      },
      handleUploadProgress (e, file) {
        if (e.lengthComputable) {
          this.file.progress = e.percent
        }
      },
      handleUploadSuccess (res, file) {
        this.file.url = res

        // auto import cards by file
        this.importCardsByFiles()
      },
      handleUploadError (err, file) {
        this.$message({
          type: 'error',
          message: err.message || '文件' + file.name + '上传失败'
        })

        // reset file
        this.file = {
          name: file.name,
          progress: 0,
          url: ''
        }
      },

      fetchImportedCards (page, size) {
        this.loading = true

        const panel = this.importType === 'EXACT_IMPORT' ? this.numbersPanel : this.filesPanel

        api.ISmsManager.listSmsCardTempInfo({ batchId: panel.batchId, page: page - 1, size: size || panel.pager.size })
          .then(({ smsTargetMsisdnList: res }) => {
            panel.cards = res.content

            panel.pager = {
              index: res.number + 1,
              size: res.size,
              count: res.totalElements
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '号码查询失败'
            })
          })
          .then(() => {
            this.loading = false
          })
      },
      handleCurrentChange (val) {
        this.fetchImportedCards(val)
      },
      handleSizeChange (val) {
        this.listSmsCardTempInfo(1, val)
      }
    },
    beforeDestroy () {
      // ignore error
      if (this.numbersPanel.batchId && this.numbersPanel.pager.count) {
        api.ISmsManager.cancelSmsSendReq({ batchId: this.numbersPanel.batchId }).catch(x => x)
      }

      if (this.filesPanel.batchId && this.filesPanel.pager.count) {
        api.ISmsManager.cancelSmsSendReq({ batchId: this.filesPanel.batchId }).catch(x => x)
      }
    },
    filters: {
      time
    }
  }
</script>

<style lang="scss" scoped>
  .input__label {
    float: left;
    margin: 0 10px 0 5px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }
  .input__span {
    margin: 0 10px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }
  .form__div {
    padding-top: 10px;
  }
  .download {
    display: inline-block;
    color: #038ae3;
    cursor: pointer;
    text-decoration: underline;
  }
  .clear {
    clear: both;
  }
  .table__div {
    border: 1px solid #dfdfdf;
    padding: 30px 30px 0;
    margin-top: 15px;
    min-height: 220px;
  }
  .search__div {
    margin-bottom: 15px;
    min-height: 40px;
  }

  .limits-span {
    position: absolute;
    bottom: 5px;
    left: 470px;
    font-size: 12px;
    color: #606266;

    &.error, b {
      color: #f56c6c;
    }
  }
</style>
