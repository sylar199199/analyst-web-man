// 引入i18n国际化插件
import {getStore} from "@/utils/mUtils";
import Vue from "vue";
import VueI18n from "vue-i18n";
import request from "@/utils/axios";

Vue.use(VueI18n);

export const i18n = new VueI18n({
  fallbackLocale: "cn"
});

function getI18nLanguage() {
  let storeLang = getStore("currentLanguage");
  if (storeLang) {
    //如果有store
    return storeLang === 1 ? "cn" : "tw";
  }
  return "cn";
}

function setI18nLanguage(lang) {
  i18n.locale = lang;
  request.defaults.headers.common["Accept-Language"] = lang;
  document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

// export function loadLanguageAsync(lang) {
//   if (i18n.locale !== lang) {
//     return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then(msgs => {
//       i18n.setLocaleMessage(lang, msgs.default);
//       return setI18nLanguage(lang);
//     });
//   }
//   return Promise.resolve(lang);
// }

export default i18n;
