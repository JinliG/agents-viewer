<h1 align="center" style="border-bottom:unset">

  <a href="https://github.com/JinliG/agents-viewer/releases">

​    <img src="https://github.com/JinliG/agents-viewer/blob/master/public/assets/512x512.png?raw=true" width="150" height="150" alt="banner" /><br>

  </a>

</h1>

</br>


## Agents-Viewer

agents-viewer 是一个基于 Coze API 服务的 AI Agent 客户端工具，支持 Chrome 插件 & Web 两种部署方式。


https://github.com/user-attachments/assets/39bbec15-b7e2-4d6c-a2ca-09262fded74b



## 核心功能

- 浏览器插件 网页划词、翻译、续写、全局翻译，支持自定义划词提示词
- 完善的 markdown 格式渲染
- 通过在 Coze 上搭建 Agent，然后快速接入到客户端提供服务



## 启动

**下载依赖**

`yarn install`

**配置环境变量**

```.env
# coze
VITE_COZE_API_KEY=""      # coze api 服务 key
VITE_COZE_SPACE_ID=""     # 工作空间 id
VITE_COZE_GLOBAL_BOT=""   # 默认的 bot id（用来为翻译与划词等插件功能提供支持）

# CMS 服务配置（暂时无用，可以留空）
VITE_CMS_BASE=""
VITE_GOOGLE_WEB_CLIENT_ID=""
VITE_GOOGLE_WEB_CLIENT_SECRET=""
VITE_AUTH_CRX_REDIRECT_URL=""

```



**开发**

插件

`yarn build.crx & yarn dev.crx`

Web

`yarn dev`  或者 `yarn.pwa`

> 没有区别其实，yarn.pwa 只是多了一个 PWA 的入口



## 其他

- 由于 CSP 限制，少部分功能（如朗读）在一些网站上可能是不可用的。



## TODO

- [ ] 支持直接接入服务或者本地 Ollama 模型
- [ ] 支持 mermaid 渲染
- [ ] 移除用户 Auth 和 CMS 相关逻辑，变回一个纯粹的客户端应用
