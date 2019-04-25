export interface OrganizationBean {
  abbrName: string
  accessUrl: string
  accountName: string
<<<<<<< HEAD
  adminClient: number
  apiPass: string
  bankName: string
  brokerBalance: string
=======
<<<<<<< HEAD
  adminClient: number
  apiPass: string
  appId: string
  bankName: string
  brokerBalance: number
>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
  cardDown: string
  cardHand: string
  cardUp: string
  companyName: string
<<<<<<< HEAD
  contact: string
  debitAccount: string
  distributorBalance: string
  email: string
  externalQuery: string
  frozenAmount: number
  generation: number
  hotLine: string
  id: number
  idCard: string
  isBroker: string
  isDistributor: string
=======
=======
  associateSale: string
  bankName: string
  cdDownPhotoUrl: string
  cdHandPhotoUrl: string
  cdUpPhotoUrl: string
  clientAdmin: string
>>>>>>> 063ec31a5fab29b3861343af1f418f9451421d9d
  contact: string
  createDate: Date
  debitAccount: string
<<<<<<< HEAD
  distributorBalance: number
=======
>>>>>>> 063ec31a5fab29b3861343af1f418f9451421d9d
  email: string
  fullName: string
  id: number
  idCard: string
<<<<<<< HEAD
>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
  licenceDown: string
  licenceUp: string
  logoAddress: string
  mobile: string
  orgCategory: string
  parentId: number
<<<<<<< HEAD
  resource: number
  shortName: string
  telephone: string
  userInfo: UserInfo
=======
  parentOrgId: number
  resource: number
=======
  isBroker: boolean
  isDistributor: boolean
  licenseUrl: string
  mobilePhone: string
  phone: string
>>>>>>> 063ec31a5fab29b3861343af1f418f9451421d9d
  shortName: string
}

export interface OrgRelation {
  isBroker: string
  isDistributor: string
  subOrg: OrganizationBean
}

type AssociateBrokerOperation = 'RECOVER' | 'CANCEL'

export interface BrokerOrderBean {
  amount: number
  distributorId: number
  distributorName: string
  salerName: string
}

export interface BrokerOrderListBean {
  brokerOrderBeans: Array<BrokerOrderBean>
  index: number
  totalElements: number
  totalPage: number
}

export interface BrokerOrderBean {
  amount: number
  distributorId: number
  distributorName: string
  salerName: string
}

export interface BrokerOrderListBean {
  brokerOrderBeans: Array<BrokerOrderBean>
  index: number
  totalElements: number
  totalPage: number
>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
}

export interface OrgRelation {
  isBroker: string
  isDistributor: string
  subOrg: OrganizationBean
}

type AssociateBrokerOperation = 'CANCEL' | 'RECOVER'

export interface CardCountBean {
  category: string
  count: number
  description: string
}

export interface CardCountSummary {
  countByOperator: OperatorCardCountSummary[]
  total: number
}

export interface CardDetailBean {
  activeTime: Date
  appendix: string
  cardNumber: string
  chargeTypeName: string
  groupName: string
  iccid: string
  id: number
  imei: string
  imsi: string
  localStatusName: string
  openTime: Date
  operatorName: string
  operatorStatusName: string
  orderPackages: Array<OrderPackageBean>
  ownerId: number
  ownnerName: string
  parentProxyName: string
  providerName: string
  remark: string
  rootProxyName: string
}

export interface CardFlowDetailBean {
  cardNumber: string
  dailyCount: FlowDailyCountBean[]
  exceed: number
  operatorName: string
  providerName: string
  proxyName: string
  remainder: number
  total: number
  used: number
  utilizationRate: number
}

type CardLocalStatus = 'ABANDON' | 'UNKONWN' | 'NORMAL'

type CardStoreStatus = 'DELIVERED' | 'ABANDON' | 'WAITING_TO_DELIVER'

export interface CardSummaryBean {
  account: string
  cardNumber: string
  cardStatusName: string
  deliverDate: Date
  enName: string
  iccid: string
  openDate: Date
  operatorName: string
  providerName: string
  putInDate: Date
}

type ChargeType = 'SINGLE_CARD' | 'FLOW_SHARED'

export interface ExportExcel {
  code: number
  fileUrl: string
  msg: string
}

type ExternalQueryEnum = 'ENABLE' | 'DISABLE'

export interface FlowDailyCountBean {
  count: number
  date: Date
}

export interface FlowPackageBean {
  id: number
  name: string
  packageType: number
  scope: number
  total: number
}

export interface GroupBean {
  groupId: number
  groupName: string
}

type Operator = 'CMCC' | 'CNET' | 'UNICOM'

export interface OperatorCardCountSummary {
  countInCategory: CardCountBean[]
  inStore: number
  label: string
  name: string
  total: number
}

export interface OperatorFlowDailyCountBean {
  content: FlowDailyCountBean[]
  label: string
  name: string
}

export interface OperatorFlowMonthCountBean {
  flowMonth: number
  label: string
  name: string
}

type OperatorStatus = 'STOPPED' | 'USING' | 'UNKNOWN' | 'WAITING_TO_ACTIVATE' | 'REPORTED_LOST' | 'APPOINT_TO_CANCEL_ACCOUNT'

type OrderCategoryEnum = 'PURCHASE' | 'HANDLE' | 'SETTLE' | 'CHANGE' | 'WITHDRAW' | 'DEPOSIT'

export interface OrderFormBean {
  amount: number
  completeTime: Date
  createTime: Date
  orderCategory: OrderCategoryEnum
  orderId: string
  orderStatus: OrderStatusEnum
  orgId: number
}

export interface OrderFormListBean {
  index: number
  orderFormBeans: Array<OrderFormBean>
  totalElements: number
  totalPage: number
}

export interface OrderPackageBean {
  orderTime: Date
  pack: FlowPackageBean
  remainder: number
  utilizationRate: number
}

export interface OrderRecordBean {
  cardNumber: string
  commitTime: Date
  description: string
  handleStatus: string
  operatorName: string
  orderTime: Date
  packageName: string
  sourcePlatform: string
  userName: string
}

<<<<<<< HEAD
=======
type OrderStatusEnum = 'PAID' | 'CHECKING' | 'PAYING' | 'CANCELED'

>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
export interface PackageResp {
  code: number
  msg: string
}

export interface PageBean<T> {
  content: Array<T>
  number: number
  size: number
  totalElements: number
  totalPages: number
}

type PrividerStatus = 'DISABLED' | 'ENABLED'

export interface ProviderBean {
  account: string
  alias: string
  apiAccessKey: string
  apiSecretKey: string
  apiUrl: string
  contactor: string
  createOn: Date
  enName: string
  id: number
  loginAccount: string
  loginPassword: string
  mobilePhone: string
  name: string
  operator: Operator
  status: PrividerStatus
}

type ProviderResult = 'OK' | 'INVALID_NAME_AND_BELONG'

export interface ProxyBean {
  account: string
  apiPwd: string
  cdDownPhotoUrl: string
  cdHandPhotoUrl: string
  cdUpPhotoUrl: string
  company: string
  contactor: string
  email: string
  externalQuery: ExternalQueryEnum
  hotLine: string
  id: number
  idCard: string
  level: number
  loginName: string
  mobilePhone: string
  name: string
  phone: string
  resourceName: string
  roleId: number
}

export interface QueryCondition {
  activeTime: Date
  cardNumberOrIccid: string
  localStatus: CardLocalStatus
  operator: Operator
  operatorStatus: OperatorStatus
  ownnerId: number
  providerId: number
  proxyId: number
  remark: string
}

export interface Resp {
  code: number
  info: Object
  msg: string
}

export interface SmsBatchInfo {
  batchId: string
  category: string
  content: string
  sendTime: Date
  successNum: number
  totalNum: number
}

export interface SmsReceiveRecord {
  clientName: string
  content: string
  msisdn: string
  operatorName: string
  receiveTime: Date
  supplierName: string
}

export interface SmsSendRecord {
  clientName: string
  msisdn: string
  operatorName: string
  sendTime: Date
  smsSendStatusDesc: string
  supplierName: string
}

export interface SmsTargetMsisdn {
  activeTime: Date
  msisdn: string
  openTime: Date
  operatorName: string
  operatorStatusDesc: string
}

type SendStatus = 'SUCCESS' | 'ERR_SOURCE' | 'ERR_MSG2LONG' | 'ERR_TARGET' | 'UNKNOWN' | 'ERR_OPID'

export interface SmsBatchInfoBean {
  smsBatchInfoList: PageBean<SmsBatchInfo>
}

export interface SmsReceiveRecordBean {
  smsReceiveRecordBeanList: PageBean<SmsReceiveRecord>
}

export interface SmsSendRecordBean {
  smsSendRecordList: PageBean<SmsSendRecord>
}

export interface SmsTargetMsisdnBean {
  batchId: string
  smsTargetMsisdnList: PageBean<SmsTargetMsisdn>
}

export interface TaskBean {
  description: string
  name: string
  runningStatusName: string
  statusName: string
}

export interface TaskResps {
  errorMsg: string
  fileLocation: string
  process: number
  taskIdentify: string
}

export interface IAccountManager {
  addAssociateSuperiorDistributor (params: { brokerId: number, distributorId: number, userId: number }): Promise<number>
<<<<<<< HEAD
=======
  addOrgCategory (params: { orgId: number, orgCategory: string }): Promise<number>
>>>>>>> 063ec31a5fab29b3861343af1f418f9451421d9d
  deposit (params: { orgId: number, depositAmount: number, certUrl: string }): Promise<number>
  getAvailableAssociateSales (params: { distributorId: number, brokerId: number }): Promise<UserInfo>
  getBankAccount (params: { orgId: number }): Promise<OrganizationBean>
  getOrg (params: { id: number }): Promise<OrganizationBean>
  getRefreshFrozenAmountStatus (params: { orgId: number }): Promise<number>
  listBrokerOrders (params: { brokerId: number, distributorId: number, index: number, pageSize: number }): Promise<BrokerOrderListBean>
  listBrokerOrdersInfo (params: { distributorId: number }): Promise<Array<BrokerOrderBean>>
  listOrdersByConditions (params: { distributorId: number, orderCategory: OrderCategoryEnum, createTimeStart: Date, createTimeEnd: Date, index: number, pageSize: number }): Promise<OrderFormListBean>
  refreshFrozenAmount (params: { orgId: number }): Promise<number>
  updateBankAccount (params: { org: OrganizationBean }): Promise<number>
  withdraw (params: { orgId: number, orgCategory: string, withdrawAmount: number, brokerOrder: BrokerOrderBean }): Promise<number>
}

export interface ICardFlowManager {
  excelDailyFlow (params: { proxyId: number, providerId: number, operator: Operator, month: Date, cardNumber: string }): Promise<ExportExcel>
  excelMonthFlow (params: { proxyId: number, providerId: number, operator: Operator, month: Date, cardNumber: string }): Promise<ExportExcel>
  listDailyCardFlowPage (params: { page: number, size: number }): Promise<PageBean<CardFlowDetailBean>>
  listDailyCardFlowPageOnCondition (params: { page: number, size: number, proxyId: number, providerId: number, operator: Operator, month: Date, cardNumber: string }): Promise<PageBean<CardFlowDetailBean>>
  listMonthCardFlowPage (params: { page: number, size: number }): Promise<PageBean<CardFlowDetailBean>>
  listMonthCardFlowPageOnCondition (params: { page: number, size: number, proxyId: number, providerId: number, operator: Operator, month: Date, cardNumber: string }): Promise<PageBean<CardFlowDetailBean>>
}

export interface ICardGroupManager {
  addGroup (params: { name: string }): Promise<boolean>
  deleteGroup (params: { id: number }): Promise<boolean>
  getGroupList (params: { id: number, page: number, size: number }): Promise<PageBean<GroupInfo>>
  getGroupsById (params: { id: number }): Promise<Array<GroupBean>>
  updateGroup (params: { id: number, name: string }): Promise<boolean>
}

export interface ICardManager {
  addFlowPackage (params: { cardId: number, packageId: number }): Promise<PackageResp>
  asignToProxy (params: { ids: number[], proxyId: number }): Promise<boolean>
  checkPackage (params: { cardId: number, packageId: number }): Promise<PackageResp>
  excelCards (params: { condition: QueryCondition }): Promise<ExportExcel>
  getCardDetailInfo (params: { cardId: number }): Promise<CardDetailBean>
  getSummary (params: {}): Promise<CardCountSummary>
  listDetailInPage (params: { page: number, size: number }): Promise<PageBean<CardDetailBean>>
  listDetailInPageByCondition (params: { page: number, size: number, condition: QueryCondition }): Promise<PageBean<CardDetailBean>>
  listFlowPackageByCardId (params: { id: number }): Promise<FlowPackageBean[]>
  moveToGroup (params: { ids: number[], groupId: number }): Promise<boolean>
  updateFlowPackage (params: { cardId: number, packageId: number }): Promise<PackageResp>
  updateRemark (params: { ids: number[], remark: string }): Promise<boolean>
}

export interface ICardStoreManager {
  deliver (params: { proxyId: number, chargeType: ChargeType, iccids: string[] }): Promise<boolean>
  deliverByFile (params: { proxyId: number, chargeType: ChargeType, fileUrl: string }): Promise<boolean>
  listPageInWareHouse (params: { page: number, size: number }): Promise<PageBean<CardSummaryBean>>
  listPageInWareHouseByCondition (params: { page: number, size: number, providerId: number, operator: Operator, cardStoreStatus: CardStoreStatus }): Promise<PageBean<CardSummaryBean>>
  putInByFile (params: { providerId: number, fileUrl: string }): Promise<boolean>
}

export interface IFlowPackageManager {
  list (params: { page: number, size: number }): Promise<PageBean<OrderRecordBean>>
  listByCondition (params: { page: number, size: number, operator: Operator, startDate: Date, endDate: Date, cardNumber: string }): Promise<PageBean<OrderRecordBean>>
}

export interface IHomeLogoManager {
  getLogoUrl (params: { url: string }): Promise<string>
}

export interface IInternalProxyManager {
}

export interface IOrganizationManager {
  addAssociateBroker (params: { currentOrgId: number, brokerId: number, userId: number }): Promise<number>
  addOrg (params: { superOrg: number, org: OrganizationBean, salerId: number }): Promise<number>
  addOrganizationSubUser (params: { loginName: string, name: string, mobile: string, email: string, roles: string }): Promise<boolean>
  delteOrganizationSubUser (params: { subId: number }): Promise<boolean>
<<<<<<< HEAD
=======
  existLoginName (params: { loginName: string }): Promise<boolean>
  existOrgShortName (params: { shortName: string }): Promise<boolean>
>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
  getAllSubOrgs (params: {}): Promise<Array<OrganizationBean>>
  getAvailableAssociateSales (params: { orgId: number, targetOrg: number }): Promise<Array<UserInfo>>
  getBrokers (params: { brokerId: number }): Promise<OrganizationBean>
  getOrg (params: { id: number }): Promise<OrganizationBean>
  getOrgRoles (params: { userId: number }): Promise<Array<RoleBean>>
  getOrganizationSubUsers (params: { role: string, loginName: string, page: number, size: number }): Promise<PageBean<UserInfo>>
  getSubOrg (params: { superId: number, subId: number }): Promise<OrgRelation>
  listOrgsByConditions (params: { superOrg: number, page: number, size: number }): Promise<PageBean<OrgRelation>>
  updateAssociateBroker (params: { currentOrgId: number, brokerId: number, operation: AssociateBrokerOperation }): Promise<number>
<<<<<<< HEAD
  updateOrg (params: { org: OrganizationBean }): Promise<number>
=======
  updateOrg (params: { org: OrganizationBean, salerId: number }): Promise<number>
>>>>>>> 67be142c3f3d57f58ebf14c8f0cdeff372517ad7
  updateOrganizationSubUser (params: { id: number, name: string, mobile: string, email: string, roles: string }): Promise<UserInfo>
}

export interface IProviderManager {
  add (params: { provider: ProviderBean }): Promise<ProviderResult>
  getProvider (params: { id: number }): Promise<ProviderBean>
  listBriefProviders (params: {}): Promise<ProviderBean[]>
  listProviders (params: { page: number, size: number }): Promise<PageBean<ProviderBean>>
  update (params: { provider: ProviderBean }): Promise<ProviderResult>
}

export interface IProxyManager {
  add (params: { proxy: ProxyBean }): Promise<void>
  cardMonthFlow (params: { proxyId: number, month: Date }): Promise<OperatorFlowMonthCountBean[]>
  externalUrl (params: { userId: number }): Promise<string>
  getAllRole (params: {}): Promise<Array<RoleBean>>
  getCardCount (params: { proxyId: number }): Promise<CardCountBean[]>
  getFlowCountInMonth (params: { proxyId: number, month: Date }): Promise<OperatorFlowDailyCountBean[]>
  getHomeFlowCountInMonth (params: { proxyId: number, month: Date }): Promise<OperatorFlowDailyCountBean[]>
  getOnlyFirstProxylist (params: { proxyId: number }): Promise<Array<ProxyBean>>
  getProxy (params: { id: number }): Promise<ProxyBean>
  getSecProxylist (params: { proxyId: number, deep: boolean }): Promise<Array<ProxyBean>>
  listBriefProxies (params: {}): Promise<ProxyBean[]>
  listProxies (params: { page: number, size: number }): Promise<PageBean<ProxyBean>>
  listProxiesByConditions (params: { page: number, size: number, companyName: string, mobilePhone: string }): Promise<PageBean<ProxyBean>>
  update (params: { proxy: ProxyBean }): Promise<void>
  updateExternalQuery (params: { proxyId: number, externalQueryEnum: ExternalQueryEnum }): Promise<ExternalQueryEnum>
  updateHotline (params: { proxyId: number, hotLine: string }): Promise<string>
}

export interface ISmsManager {
  cancelSmsSendReq (params: { batchId: string }): Promise<Resp>
  confirmSmsSendReq (params: { smsCategory: string, content: string, msisdns: string[], batchId: string }): Promise<Resp>
  importMsisdnsForSms (params: { msisdns: string[], fileUrl: string[], exact: boolean }): Promise<SmsTargetMsisdnBean>
  listSmsCardTempInfo (params: { page: number, size: number, batchId: string, operator: Operator, operatorStatus: OperatorStatus, startTimeOpen: Date, endTimeOpen: Date, startTimeActive: Date, endTimeActive: Date }): Promise<SmsTargetMsisdnBean>
  listSmsReceiveRecord (params: { page: number, size: number, supplierId: number, clientId: number, operator: Operator, startTime: Date, endTime: Date, msisdn: string }): Promise<SmsReceiveRecordBean>
  listSmsSendBatchInfo (params: { page: number, size: number, startTime: Date, endTime: Date }): Promise<SmsBatchInfoBean>
  listSmsSendRecord (params: { page: number, size: number, supplierId: number, clientId: number, operator: Operator, sendStatus: SendStatus, msisdn: string, batchId: string }): Promise<SmsSendRecordBean>
}

export interface ITaskManager {
  disable (params: { name: string }): Promise<boolean>
  enableJob (params: { name: string }): Promise<boolean>
  getTaskResult (params: { name: string }): Promise<TaskResps>
  list (params: { page: number, size: number }): Promise<PageBean<TaskBean>>
  runRightNow (params: { name: string }): Promise<boolean>
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

export interface GroupInfo {}

export interface RoleBean {}

export interface UserInfo {}

export interface Services {
  ITaskManager: ITaskManager
  ICardGroupManager: ICardGroupManager
  ICardStoreManager: ICardStoreManager
  IProviderManager: IProviderManager
  IAccountManager: IAccountManager
  IHomeLogoManager: IHomeLogoManager
  IFlowPackageManager: IFlowPackageManager
  IInternalProxyManager: IInternalProxyManager
  IProxyManager: IProxyManager
  ISmsManager: ISmsManager
  IOrganizationManager: IOrganizationManager
  ICardFlowManager: ICardFlowManager
  ICardManager: ICardManager
}
