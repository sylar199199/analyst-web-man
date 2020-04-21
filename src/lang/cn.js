const messages = {
  // layout
  layout: {
    intro: "汇课堂 是深圳顽石公司旗下专注外汇教育的学习平台",
    searchCourse: "搜索课程",
    watchTo: "观看至 第",
    noData: "暂无数据",
    loginout: "退出登录",
    loginRegister: "登录/注册",
    huidouRemaing: "汇豆余额：",
    huidouPay: "汇豆充值",
    myStudy: "我的学习",
    userMenuList: [
      {
        title: "已购课程",
        name: "buyCourse",
        icon: "purchased"
      },
      {
        title: "我的收藏",
        name: "myCollection",
        icon: "favorite2"
      },
      {
        title: "我的汇豆",
        name: "buyBeans",
        icon: "huidou"
      },
      {
        title: "我的订单",
        name: "myOrder",
        icon: "order"
      },
      {
        title: "历史记录",
        name: "historyRecord",
        icon: "recording"
      },
      {
        title: "设置",
        name: "personalData",
        icon: "setting"
      }
    ]
  },
  // common
  commons: {
    determineBtn: "确定",
    confirmBtn: "确认",
    cancelBtn: "取消",
    edit: "编辑",
    KnowledgePoint: "个知识点",
    noRelateContent: "暂无相关内容",
    tips: "本商品为虚拟商品，购买后不支持退换、转让，请谅解",
    video: "视频",
    read: "阅读",
    lookMore: "查看更多",
    videoOff: "该视频已下架",
    articleOff: "该文章已下架",
    big: "小学",
    middle: "中学",
    small: "大学",
    huidou: "汇豆",
    balance: "余额",
    menuList: [
      {
        label: "文章",
        value: 0
      },
      {
        label: "视频",
        value: 1
      }
    ],
    backToTop: "返回顶部"
  },
  index: {
    historicalRecord: "历史记录"
  },
  //设置
  setting: {
    avatar: "头像",
    nickName: "昵称",
    intro: "自我介绍",
    changeAvatar: "更换头像",
    changeLanguage: "更改语言",
    language: "语言",
    phoneNumberBind: "手机号绑定",
    phoneBind: "手机绑定",
    thirdAccountBind: "第三方账号绑定",
    weixin: "微信",
    QQ: "QQ",
    weibo: "微博",
    replaceBtn: "更换",
    bindBtn: "绑定",
    unBindBtn: "未绑定",
    untie: "解绑",
    verifyByThirdAccount: "通过第三方账号验证",
    huiliao: "汇聊",
    sureToUntie: "确认解除绑定吗？"
  },
  // 消息
  myInformation: {
    lookLink: "查看链接",
    cancelReply: "取消回复",
    reply: "回复",
    menuList: [
      {
        label: "系统消息",
        value: 0
      },
      {
        label: "回复我的",
        value: 1
      }
    ]
  },
  // 我的订单
  myOrder: {
    orderPayTime: "下单时间",
    orderNumber: "订单号",
    orderDetail: "订单详情",
    goHome: "回到首页",
    repay: "继续支付",
    course: "课",
    totalPrice: "总价",
    needPay: "需付",
    toPay: "去支付",
    goodsName: "商品名称",
    orderState: "订单状态",
    buyer: "购买者",
    buyerPhone: "购买者手机",
    buyerEmail: "购买者邮箱",
    goodsPrice: "商品价格",
    huidouPayment: "汇豆支付",
    zhifubaoPayment: "支付宝",
    cashPayment: "支付金额",
    createTime: "订单创建时间",
    bugCourseStudy: "购买课程开始学习",
    shareForFree: "分享得汇豆",
    bugOriginPrice: "原价购买",
    orderInfo: "订单信息",
    myHuidou: "我的汇豆",
    rechargeBeans: "汇豆充值",
    purchaseInfo: "购买信息",
    courseInfo: "商品名",
    price: "价格",
    actuallyPay: "实付",
    limitedTimeOffer: "限时特惠",
    payWay: "支付方式",
    payCash: "需支付金额",
    payHuidou: "需支付汇豆",
    confirmPayment: "确认支付",
    tipsHuidou: "汇豆已转入个人账户中",
    tipsPrev: "订单已放入已购课程中",
    tips: "若对此订单有疑问点击右下角问题反馈",
    loadingTips: "订单已生成，等待支付结果中 如对此订单有疑问点击右下角问题反馈",
    lookCourse: "查看课程",
    feedback: "问题反馈",
    actualPay: "实付金额",
    payTip: "请在24小时内完成支付",
    payByWeixin: "微信扫码支付",
    menuList: [
      {
        label: "全部订单",
        value: 1
      },
      {
        label: "待支付",
        value: 2
      },
      {
        label: "已完成",
        value: 3
      },
      {
        label: "交易关闭",
        value: 4
      }
    ],
    durationOpt: [
      {
        value: 1,
        label: "全部订单"
      },
      {
        value: 2,
        label: "最近半年"
      },
      {
        value: 3,
        label: "最近一个月"
      },
      {
        value: 4,
        label: "最近一周"
      }
    ]
  },
  // 我的汇豆
  myHuidou: {
    accountBalance: "账户余额",
    orderNumber: "订单号",
    goodsName: "商品名称",
    transactionHour: "交易时间",
    revenueandExpenditure: "收支",
    transactionWay: "交易方式",
    menuList: [
      {
        label: "全部记录",
        value: 0
      },
      {
        label: "消费记录",
        value: 1
      },
      {
        label: "充值记录",
        value: 2
      }
    ]
  },
  // 我的收藏
  myCollection: {
    edit: "编辑",
    cancelFavor: "取消收藏",
    confirmCancelFavor: "确认取消收藏",
    sureToCancelFavor: "是否确认取消收藏此",
    conentcoubnt: "条内容？"
  },
  // 已购课程
  buyCourse: {
    selectAll: "全选"
  },
  // 购买汇豆buyBeans
  buyBeans: {
    rechargeBeans: "汇豆充值",
    description: "充值如遇到问题，请在反馈中选择【付费相关】提交相应说明，工作人员看到后会尽快联系您解决问题",
    huidou: "汇豆",
    buyNow: "立即购买",
    huidouBill: "汇豆账单",
    transactionType: "交易类型",
    transactionHour: "交易时间",
    revenueandExpenditure: "收支",
    orderNumber: "订单号",
    menuList: [
      {
        label: "汇豆充值",
        value: 0
      },
      {
        label: "汇豆账单",
        value: 1
      }
    ],
    durationOpt: [
      {
        value: 1,
        label: "全部时间"
      },
      {
        value: 2,
        label: "最近半年"
      },
      {
        value: 3,
        label: "最近一个月"
      },
      {
        value: 4,
        label: "最近一周"
      }
    ]
  },
  // 视频
  video: {
    tableContent: "目录",
    purchase: "购买",
    relatedSuggestion: "相关推荐",
    courseComment: "课程评论",
    lookMoreComment: "查看更多评论",
    saySomeWord: "我也来说两句...",
    allComments: "全部评论",
    comments: "评论",
    hot: "热门",
    reply: "回复",
    delete: "删除",
    cancelReply: "取消回复",
    noComments: "暂无评论",
    expand: "展开",
    course: "课",
    videoTitle: "视频标题",
    videoUnavailable: "此视频暂无法播放，请稍后再试",
    playVideo: "播放视频",
    reload: "重新加载",
    networkAnomaly: "网络异常，请重新加载"
  },
  // 搜索
  search: {
    result: "结果",
    sorryMsg: "抱歉！没有找到与",
    relateContent: "相关的內容。",
    courseCount: "门",
    relateCourse: "相关的课程",
    displayMore: "显示更多"
  },
  // 帮助
  help: {
    feedback: "意见反馈",
    questionType: "问题类型",
    chooseType: "(选择你遇到的问题类型)",
    addPics: "添加相关图片",
    mostPics: "(最多4张)",
    addMoreMsg: "请输入具体信息"
  },
  // 404页面
  errorPage: {
    ErrorTips: "抱歉，你访问的页面不存在。",
    returnHomePage: "返回首页"
  },

  // 文章
  article: {
    purchase: "购买",
    articleDirectory: "文章目录",
    chapter: "章节",
    moreChapter: "更多章节",
    nextPage: "下一章节",
    tableContent: "目录",
    primaryChapter: "小学篇",
    middleChapter: "中学篇",
    universityChapter: "大学篇",
    articleTitle: "文章标题",
    introduction: "简介",
    purchaseAll: "购买阅读全文"
  },
  // 账户
  account: {
    huiketang: "汇课堂",
    goHuiketang: "学外汇，上汇课堂！",
    accountSecret: "汇聊老用户？点这里账密登录",
    loginAndRegister: "点这里手机验证码登录/注册",
    thirdLogin: "其他第三方登录",
    loginHuiketang: "登录汇课堂",
    code: "手机验证码",
    loginByaccountSecret: "账密登录",
    loginByHuiliao: "汇聊老用户在此登录",
    createAccount: "未注册用户将自动创建帐号",
    loginRegister: "登录/注册",
    agree: "注册登录即代表您已同意",
    userProtocol: "《汇课堂用户协议》",
    privacyProtocol: "《汇课堂隐私协议》",
    phone: "请输入手机号",
    password: "请输入密码",
    codeInput: "请输入验证码",
    login: "登录",
    forgetPassqord: "忘记密码？",
    goHuiliao: "前往汇聊找回",
    getCode: "获取验证码",
    remaining: "剩余",
    level: "等级说明",
    upgradeLevel: "提升等级",
    downLoad: "扫码下载汇课堂APP",
    consolidate: "在汇课堂APP中进行试题练习，巩固已学外汇知识，提升自己的等级！",
    accountSafety: "账号安全",
    bindMibile: "绑定手机号",
    bindMibileTip: "绑定手机号完成注册",
    finishRegister: "完成注册"
  },
  // 页码
  pagination: {
    lastPage: "上一页",
    nextPage: "下一页"
  },
  // share
  share: {
    invite: "分享邀好友，免费学课程",
    rule: "分享得汇豆规则",
    QRCode: "微信扫二维码分享",
    copy: "复制",
    ruleDescription: "规则说明:",
    firstRule: "1.请使用参与活动的手机号登录汇课堂app,登录后权益自动到账",
    secondRule: "2.分享此链接给好友，每有一个用户注册或者登录，就赠送分享者100汇豆，每次分享获取汇豆上限为100",
    thirdRule: "3.每个汇课堂用户仅能从一次分享中通过注册或登录的方式得到一次汇豆",
    fourthRule: "4.活动时间：长期有效",
    getHuidou: "登录后才能获取汇豆",
    huiketangTitle: "领汇豆, 学外汇"
  },

  // 个人中心
  personCenter: {
    userMenuList: {
      buyCourse: "已购课程",
      myCollection: "我的收藏",
      buyBeans: "我的汇豆",
      myOrder: "我的订单",
      myInformation: "消息",
      historyRecord: "历史记录",
      setting: "设置"
    },

    settingMenuList: [
      {
        title: "个人资料",
        name: "personalData"
      },
      {
        title: "账号安全",
        name: "accountSecurity"
      },
      {
        title: "地区与语言",
        name: "language"
      },
      {
        title: "用户协议",
        name: "userAgreement"
      },
      {
        title: "隐私协议",
        name: "privacyAgreement"
      }
    ]
  }
};

export default messages;
