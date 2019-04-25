export interface MenuBean {
  id: number
  name: string
  subMenu: Array<MenuBean>
  url: string
}

export interface PageBean<T> {
  content: Array<T>
  number: number
  size: number
  totalElements: number
  totalPages: number
}

export interface RoleBean {
  group: RoleGroup
  id: number
  label: RoleLabel
  name: string
}

export interface UserInfo {
  authAction: Array<string>
  createTime: Date
  email: string
  id: number
  lastLoginOn: Date
  loginName: string
  mobile: string
  name: string
  orgId: number
  password: string
  roleBean: RoleBean
  roleBeans: Array<RoleBean>
  userStatus: UserStatus
}

type RoleGroup = 'DISTRIBUTOR' | 'BROKER' | 'ADMIN'

type RoleLabel = 'ADMIN' | 'CLIENT'

type UserStatus = 'DELETE' | 'STOPPING' | 'NORMAL'

export interface ILoginService {
  getOaRedirectUrl (params: {}): Promise<string>
  logOff (params: {}): Promise<void>
  loginByClient (params: { userName: string, passWord: string, code: string }): Promise<LoginResult>
  loginByOA (params: { token: string }): Promise<LoginResult>
}

export interface IUserService {
  addOrgSubUser (params: { superOrg: number, loginName: string, name: string, mobile: string, email: string, roles: string, orgId: number }): Promise<number>
  addRole (params: { role: Array<MenuBean>, roleName: string, roleId: number }): Promise<boolean>
  addUser (params: { loginName: string, name: string, roleId: number }): Promise<number>
  delOrgSubUser (params: { superId: number, subId: number }): Promise<boolean>
  deleteManager (params: { loginName: string }): Promise<boolean>
  deleteRole (params: { roleId: number }): Promise<boolean>
  existLoginName (params: { loginName: string }): Promise<boolean>
  getAllMenuBeans (params: {}): Promise<Array<MenuBean>>
  getAllOaUserInfo (params: {}): Promise<ListUserResponse>
  getAllRole (params: {}): Promise<Array<RoleBean>>
  getAllUserInfo (params: {}): Promise<Array<UserInfo>>
  getAuthList (params: { roleId: number }): Promise<Array<MenuBean>>
  getCurrentUser (params: {}): Promise<UserInfo>
  getDeleteAuth (params: {}): Promise<Array<RoleBean>>
  getOperatePermissions (params: {}): Promise<Array<MenuBean>>
  getOrgLoginAccount (params: { admClientId: number }): Promise<UserInfo>
  getOrgRoles (params: { group: string }): Promise<Array<RoleBean>>
  getOrgSalers (params: { orgId: number }): Promise<Array<UserInfo>>
  getOrgSubUsers (params: { superId: number, page: number, size: number }): Promise<PageBean<UserInfo>>
  getOrgSubUsers (params: { superId: number, role: string, loginName: string, page: number, size: number }): Promise<PageBean<UserInfo>>
  getUser (params: { sessionId: string }): Promise<UserInfo>
  getUserByRoleAndStatus (params: { roleId: number, status: UserStatus, pageIndex: number, pageSize: number }): Promise<PageBean<UserInfo>>
  hasPower (params: { sessionId: string, action: string }): Promise<boolean>
  insertUser (params: { users: Array<UserInfo> }): Promise<boolean>
  resetPassword (params: { loginName: string }): Promise<void>
  updateDefaultPassword (params: { loginName: string, password: string }): Promise<LoginResult>
  updateOrgSubAdmBySuperLevel (params: { id: number, name: string, mobile: string, email: string }): Promise<UserInfo>
  updateOrgSubUser (params: { superId: number, id: number, name: string, mobile: string, email: string, roles: string }): Promise<UserInfo>
  updateUser (params: { userId: number, name: string, roleId: number }): Promise<boolean>
  updateUserStatus (params: { status: UserStatus, id: number }): Promise<boolean>
}

type LoginResult = 'FAIL_TO_CREATE_SESSION' | 'OK' | 'CHANGE_DEFUL_PASSWORD' | 'INVALID_VERIFY_CODE' | 'INVALID_PASSWORD' | 'ERROR_PASSWORD' | 'USER_DOES_NOT_EXISTS' | 'INVALID_BWUC_TOKEN' | 'INVALID_USER_STATUS' | 'INVALID_SESSION'

interface ListUserResponse {
  code: string
  message: string
  users: Array<{
    userId: string
    userName: string
    departmentName: string
    departmentCode: string
    jobposition: string
    state: string
    companyid: string
    companyname: string
  }>
}

export interface Services {
  ILoginService: ILoginService
  IUserService: IUserService
}
