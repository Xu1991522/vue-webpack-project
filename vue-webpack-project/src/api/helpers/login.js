import latestSigninStorage from '../../local/latest-signin'

const login = () => {
  // eval hack for old origins
  // http://iot.combmobile.com/iot-client/
  // http://iot.combmobile.com/iot-system/
  const internal = !location.href.match(/iot-client/) && latestSigninStorage.pull().type === 'ADMIN'

  if (internal) {
    location.replace('./oa-login.html')
  } else {
    location.replace('./login.html')
  }
}

export default login
