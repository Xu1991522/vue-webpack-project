import { Notification } from 'element-ui'

import api from '../../../api'

import { downloadByOpenWindow as downloadopen } from '../../../helpers/download'

const data = {
  taskNames: [],
  timeout: null
}

const run = () => {
  const names = [...data.taskNames]

  Promise.all(names.map(name => api.ITaskManager.getTaskResult({ name })))
    .then(arr => {
      // case: before respose return, new task was added in
      if (names.length !== data.taskNames.length) {
        return names
      }

      const unfinished = {}

      // { process: -1, taskIdentify: "U8qBNILIXwNInan6qNOV", fileLocation: null, errorMsg: "\\opt\\aeshare\\U8qBNILIXwNInan6qNOV.xlsx (系统找不到指定的路径。)" }

      /*
      taskIdentify 任务标识 String
      process 任务进度，0-运行中，1-成功，-1-失败 Integer
      errorMsg 错误信息，process为-1时有 String
      fileLocation 文件存储位置，只有process为1时有 String
      */

      arr.forEach((x, i) => {
        if (x.process === 1) {
          downloadopen('/portal-srv/downLoadFile?fileUrl=' + x.fileLocation)
        } else if (x.process === -1) {
          Notification({
            type: 'error',
            message: '文件下载任务(' + x.taskIdentify + ')失败: ' + x.errorMsg
          })
        } else if (x.process === null || x.process === 0) {
          unfinished[names[i]] = 1
        } else {
          Notification({
            type: 'error',
            message: '未知的文件下载任务状态: ' + x.process
          })
        }
      })

      return names.filter(x => unfinished[x])
    })
    .catch(x => names)
    .then(rest => {
      if (names.length !== data.taskNames.length) {
        return
      }

      if (rest.length) {
        data.taskNames = rest

        data.timeout = setTimeout(run, 5000)
      }
    })
}

const add = taskName => {
  data.taskNames.push(taskName)

  if (data.timeout) {
    clearTimeout(data.timeout)
  }

  run()
}

const remove = taskName => {
  data.taskNames = data.taskNames.filter(x => x !== taskName)
}

const taskRunner = {
  add,
  remove
}

export default taskRunner
