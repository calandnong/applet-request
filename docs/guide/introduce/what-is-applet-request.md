# 什么是AppletRequest？
applet-request 是一套小程序框架下的请求解决方案。

## 简介

applet-request 是一套小程序框架下的请求解决方案。

它包含了一些针对不同请求api的封装的请求库，并为这些请求库提供了一致的中间件、拦截器、全局配置等功能的体验。

当这些功能不满足你的需求、或者你想定制化时，也可以基于 @applet-request/core 快速封装一个实现你需求的请求库。

## 功能支持
- 基于 Promise 对象实现，支持请求和响应拦截
- 支持多个全局配置实例
- 支持文件上传/下载
- 支持自定义参数
- 支持自定义请求适配器
- 支持多拦截器
- 支持请求取消
- `Typescript` 支持
- 洋葱机制的 `use` 中间件机制支持
- `timeout` 支持
- 统一的`错误处理`方式

它包含了一些针对不同请求api的封装的请求库，并为这些请求库提供了一致的中间件、拦截器、全局配置等功能的体验。

## 设计目标
1、提供原生小程序场景以及uniapp场景下的多种请求api的统一使用封装，核心逻辑内容抽离为request-core做到与单一api无关，并提供拦截器、自定义全局配置、url参数对象、请求取消等能力。

2、提供请求底层的抽象适配类，并提供常用api的实现，如：uni.request、uni.downloadFile、uni.uploadFile、wx.request、wx.downloadFile、wx.uploadFile的实现，如果后续有更多其他的api需要接入，则可第三方人员开发对应的adaptor即可。

