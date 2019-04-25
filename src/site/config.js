window.prefix = '/portal-usr'

window.usrConfig = {
  prefix: '/portal-usr',
  urls: {
    ILoginService: {
      loginByClient: '/RPCF9272A530213F083F0B0EE394197420A',
      getOaRedirectUrl: '/RPCCCA93576719BED88278FDD707DDF5063',
      loginByOA: '/RPC685F853FA32332DA7E1398B5D77A3B1D'
    },
    IUserService: {
      getCurrentUser: '/RPC2EEC69CC59A212C8139C2BA57D8883BA',
      updateDefaultPassword: '/RPC350C948F4DB533C4B1A73A7D110087E3'
    }
  }
}

window.srvConfig = {
  prefix: '/portal-srv',
  urls: {
    IHomeLogoManager: {
      getLogoUrl: '/RPC23F09547277BB98A07D1D3B843C37676'
    }
  }
}
