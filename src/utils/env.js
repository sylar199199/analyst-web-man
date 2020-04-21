const appUrl = process.env.VUE_APP_URL; // development和production环境是不同的
const languageArr = [
  {value: "zh_CN", text: "简体中文"},
  {value: "en_US", text: "美式英语"},
  {value: "ms_MY", text: "马来西亚语"},
  {value: "th_TH", text: "泰国语"},
  {value: "zh_TH", text: "繁体中文"},
  {value: "vn_VN", text: "越南语"},
  {value: "zh_SG", text: "新加坡华语"}
];
const dealtStateList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "未审核"
  },
  {
    value: 2,
    label: "待审核"
  },
  {
    value: 3,
    label: "已审核"
  },
  {
    value: 5,
    label: "疑似违规(已发布待审核)"
  }
];

const applyTypeList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "学历认证"
  },
  {
    value: 2,
    label: "证书认证"
  }
];
const articleStateList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "已发布"
  },
  {
    value: 2,
    label: "已下架"
  }
];
const articleStateListInContent = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "已发布"
  },
  {
    value: 2,
    label: "已下架"
  }
];

const articleType = [
  {
    value: 0,
    label: "全部文章"
  },
  {
    value: 1,
    label: "交易观点"
  },
  {
    value: 2,
    label: "教学分析"
  }
];
const viewPointStatus = [
  "全部",
  "说明",
  "交易活跃",
  "交易取消",
  "交易结束：达到目标",
  "交易结束：手动关闭",
  "交易结束：已止损"
];
const replyContent = [
  {
    label: "点赞数正序",
    value: 1
  },
  {
    label: "点赞数倒序",
    value: 2
  },
  {
    label: "时间正序",
    value: 3
  },
  {
    label: "时间倒序",
    value: 4
  }
];
const contentSort = [
  {
    value: 1,
    label: "按阅读量"
  },
  {
    value: 2,
    label: "按点赞数"
  },
  {
    value: 3,
    label: "按收藏量"
  },
  {
    value: 4,
    label: "按评论量"
  },
  {
    value: 5,
    label: "按更新时间"
  },
  {
    value: 6,
    label: "按分享量"
  },
  {
    value: 7,
    label: "按投诉量"
  }
];
const recommendList = [
  {
    value: 0,
    label: "全部推荐"
  },
  {
    value: 1,
    label: "不推荐"
  },
  {
    value: 2,
    label: "推荐"
  }
];
const clientStatusText = ["全部", "IOS", "安卓", "wpc", "web", "server", "EAPC", "内容账户"];
const dealtStatusList = [
  {
    value: -1,
    label: "全部"
  },
  {
    value: 0,
    label: "未处理"
  },
  {
    value: 1,
    label: "已处理"
  }
];
const reportTypeList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "文章"
  },
  {
    value: 2,
    label: "用户"
  },
  {
    value: 3,
    label: "评论"
  },
  {
    value: 4,
    label: "回复"
  }
];
const commentType = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "未审核"
  },
  {
    value: 3,
    label: "已删除"
  },
  {
    value: 4,
    label: "已通过"
  },
  {
    value: 5,
    label: "疑似违规"
  }
];
const timeRankList = [
  {
    value: 1,
    label: "时间倒序"
  },
  {
    value: 2,
    label: "时间正序"
  }
];
const sexText = ["全部", "男", "女"];
const userTypeText = {
  1: "普通用户",
  2: "禁言用户"
};
const authenticateTypeText = ["全部", "领域专家", "签约分析师", "学历认证", "证书认证"];
const educationText = ["", "博士", "博士在读", "硕士", "硕士在读", "本科", "本科在读", "其他"];
const transactionTimeText = ["完全没有", "不到一年", "在一年到三年之间", "三年以上"];
const trophyTypeText = ["", "日榜冠军", "周榜冠军", "月榜冠军", "总榜冠军"];
const tagTypeList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "币种标签"
  },
  {
    value: 2,
    label: "技术分析标签"
  },
  {
    value: 3,
    label: "周期标签"
  },
  {
    value: 4,
    label: "策略标签"
  }
];

const menuList = [
  {name: "guidePageManger", text: "引导页管理", icon: "el-icon-user"},
  {name: "accountMangerList", text: "用户管理", icon: "el-icon-user"},
  {name: "tagManager", text: "标签管理", icon: "el-icon-user"},
  {name: "contentManager", text: "内容管理", icon: "el-icon-user"},
  {name: "commentManger", text: "评论管理", icon: "el-icon-user"},
  {name: "reportManger", text: "举报管理", icon: "el-icon-user"},
  {name: "messageManger", text: "消息推送", icon: "el-icon-user"},
  {name: "certifyManger", text: "认证管理", icon: "el-icon-user"},
  {name: "searchWordManager", text: "搜索管理", icon: "el-icon-user"},
  {name: "contentAccountManager", text: "内容账户管理", icon: "el-icon-user"},
  {name: "", text: "内容发布管理", icon: "el-icon-user"},
  {name: "downloadManager", text: "应用下载管理", icon: "el-icon-user"},
  {name: "userAgreementManger", text: "用户协议管理", icon: "el-icon-user"},
  {name: "qualificationAuditManager", text: "认证资格审核管理", icon: "el-icon-user"},
  {name: "helpCenter", text: "换榜审核管理", icon: "el-icon-user"},
  {name: "sensitiveManger", text: "敏感词管理", icon: "el-icon-user"},
  {name: "feedbackManager", text: "反馈管理", icon: "el-icon-user"},
  {name: "technicalManger", text: "技术分析说明管理", icon: "el-icon-user"},
  {name: "FAQManger", text: "FAQ管理", icon: "el-icon-user"}
];

const viewsAuditType = [
  {
    value: 0,
    label: "未审核"
  },
  {
    value: 1,
    label: "通过"
  },
  {
    value: 3,
    label: "删除"
  }
];
const neditorConfig = {
  serverUrl: "/api/web/upload/ueditor",
  autoHeightEnabled: false,
  initialFrameHeight: 300,
  initialFrameWidth: "100%"
};
const strategyTags = [
  {
    value: 1,
    label: "做多"
  },
  {
    value: 2,
    label: "做空"
  },
  {
    value: 3,
    label: "中立"
  }
];
const cycleTime = [
  {
    value: 1,
    label: "M1"
  },
  {
    value: 2,
    label: "M5"
  },
  {
    value: 3,
    label: "M15"
  },
  {
    value: 4,
    label: "M30"
  },
  {
    value: 5,
    label: "H1"
  },
  {
    value: 6,
    label: "H4"
  },
  {
    value: 7,
    label: "D1"
  },
  {
    value: 8,
    label: "W1"
  },
  {
    value: 9,
    label: "MN"
  }
];
const langList = [
  {
    locale: "zh_CN",
    label: "认证名称",
    authenticateName: ""
  },
  {
    locale: "zh_TW",
    label: "繁体中文",
    authenticateName: ""
  },
  {
    locale: "en_US",
    label: "美式英语",
    authenticateName: ""
  },
  {
    locale: "ms_MY",
    label: "马来西亚语",
    authenticateName: ""
  },
  {
    locale: "th_TH",
    label: "泰国语",
    authenticateName: ""
  },
  {
    locale: "vi_VN",
    label: "越南语",
    authenticateName: ""
  }
];
const vertifyNameList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "领域认证"
  },
  {
    value: 2,
    label: "官方认证"
  }
];
const messageStatusList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "未发送"
  },
  {
    value: 2,
    label: "已发送"
  }
];
const pushObjectList = [
  {
    value: 0,
    label: "所有人"
  },
  {
    value: 1,
    label: "指定品种圈"
  },
  {
    value: 2,
    label: "指定用户"
  }
];
const commentArticleStatusList = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "已发布"
  },
  {
    value: 2,
    label: "下架中"
  },
  {
    value: 3,
    label: "已删除"
  }
];
const firstLevelCommentstatus = [
  {
    value: 0,
    label: "全部"
  },
  {
    value: 1,
    label: "已发布"
  },
  {
    value: 3,
    label: "已删除"
  }
];
const sensitiveAuditList = [
  {
    value: 1,
    label: "疑似违规"
  },
  {
    value: 2,
    label: "正常"
  }
];
const faqRankTimeList = [
  {
    value: 1,
    label: "点击次数倒序"
  },
  {
    value: 2,
    label: "点击次数正序"
  }
];
const pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};
// 去除emoji表情
const ranges = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|\u3030/gi;
const translateLanageList = [
  {
    value: "zh-CN",
    name: "简体中文"
  },
  {
    value: "zh-TW",
    name: "繁体中文"
  },
  {
    value: "en",
    name: "美式英文"
  },
  {
    value: "ms",
    name: "马来西亚语"
  },
  {
    value: "th",
    name: "泰国语"
  },
  {
    value: "vi",
    name: "越南语"
  }
];
const regionList = {
  CN: "中国大陆",
  HK: "中国香港",
  TW: "中国台湾",
  SGP: "新加坡",
  MYS: "马来西亚",
  THA: "泰国",
  VNM: "越南",
  PHL: "菲律宾",
  OTHER: "其他"
};
export {
  appUrl,
  languageArr,
  dealtStateList,
  articleStateList,
  applyTypeList,
  articleType,
  contentSort,
  recommendList,
  clientStatusText,
  dealtStatusList,
  reportTypeList,
  commentType,
  timeRankList,
  sexText,
  userTypeText,
  authenticateTypeText,
  tagTypeList,
  menuList,
  viewsAuditType,
  neditorConfig,
  strategyTags,
  cycleTime,
  articleStateListInContent,
  langList,
  vertifyNameList,
  messageStatusList,
  pushObjectList,
  commentArticleStatusList,
  faqRankTimeList,
  pickerOptions,
  trophyTypeText,
  educationText,
  transactionTimeText,
  translateLanageList,
  ranges,
  regionList,
  replyContent,
  viewPointStatus,
  firstLevelCommentstatus,
  sensitiveAuditList
};
