export const prefix = '/portal-usr'

export const urls = {
  ILoginService: {
    getOaRedirectUrl: '/RPCCCA93576719BED88278FDD707DDF5063',
    logOff: '/RPCE2E11FE16A6BF5C5D1EE7A23A72B8C0A',
    loginByClient: '/RPCF9272A530213F083F0B0EE394197420A',
    loginByOA: '/RPC685F853FA32332DA7E1398B5D77A3B1D'
  },
  IUserService: {
    addOrgSubUser: '/RPCDB1FDA303FAE0D9CD76F767444EF3A3C',
    addRole: '/RPC16EF5F33929430504C86D98433ED3A1B',
    addUser: '/RPC857912CCF9DCB671CED0833F94D44D37',
    delOrgSubUser: '/RPC75E48305DB6D25C569B92D9DC107B6F0',
    deleteManager: '/RPCB6430D3C3828EC966A4CE7990FBD3DE3',
    deleteRole: '/RPC04B8229AFC993998A130F9808B638512',
    existLoginName: '/RPCE9DA2FD24ABEB617F5D3C8A4ABB474A1',
    getAllMenuBeans: '/RPC37ADF50DD72AD8960484F99FB8FF3954',
    getAllOaUserInfo: '/RPC5631AC069892F9B9B3EB52824EFF869D',
    getAllRole: '/RPCC3D3A60E18FCBC129EFBCACB8DF42C33',
    getAllUserInfo: '/RPC6AE80227C8F388494E58AA8F93EF49ED',
    getAuthList: '/RPCC8B782A9CFC82BCEED2052E798CC5D82',
    getCurrentUser: '/RPC2EEC69CC59A212C8139C2BA57D8883BA',
    getDeleteAuth: '/RPC3253EBCEC74337BD35D0FD61E90CE4BB',
    getOperatePermissions: '/RPCC1427AE079504028E28A9C7663F81A97',
    getOrgLoginAccount: '/RPC320E3DF620CBEDAEA65E24ABB49FA200',
    getOrgRoles: '/RPC10537CBADA669E1696055151EBD44C88',
    getOrgSalers: '/RPC94D263CF0A946862CBBC9DD16B1FDC87',
    getOrgSubUsers: '/RPC8A9D477029B01F46FA5AA9DAC5DD508A',
    getUser: '/RPC531C6C332AF45E81ABA8C2395B22E448',
    getUserByRoleAndStatus: '/RPC339BDF200F2FAA3079657EEC9B670156',
    hasPower: '/RPC13ED1BDD282F4738FFD0E604523805FA',
    insertUser: '/RPCA2A9D54F29208E905C5EAF75A4D3CDF0',
    resetPassword: '/RPC2F45BD88381CB78CC2AA8F14B1E1AA26',
    updateDefaultPassword: '/RPC350C948F4DB533C4B1A73A7D110087E3',
    updateOrgSubAdmBySuperLevel: '/RPC3301F313577CD19718B83F9BF31FA094',
    updateOrgSubUser: '/RPCD3BA3415E0C635448F7F1E9CD8097956',
    updateUser: '/RPC45AB1AF18E6598CFD6D4B169173C2EF2',
    updateUserStatus: '/RPC347B622EE941E222979D4F397CCAA2B2'
  }
}

export default { prefix, urls }
