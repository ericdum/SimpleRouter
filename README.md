SimpleRouter
============

一个简单的router，根据#!action/param1/param2....:key1=value:key2=value....这样的链接交给controller处理来无刷跳转页面。

##鸣谢
感谢[jQuery hashchange](https://github.com/cowboy/jquery-hashchange)项目让某些浏览器支持了onhashchange事件

##为什么做这个

现在经常遇到做一个小站同时页面跳转要是通过js控制的，并且还要支持通过url直接访问二级页面如：domain.com/#!about-me要直接访问到about-me页面。

以前每个项目都单独写个简单的路由，这次又遇到这个问题，干脆就写一个简单、好扩展的，以后直接引入就行了。

##依赖
1. jquery
2. hashchange(直接包入了本项目js) - 浏览器兼容方案

##使用方法
1. 引入simple-router.js
2. 编写controller及其他特殊路由规则router.rules
3. 使用`<a href="#!action/...">action</a>`
4. 空hash调用controller.index

##window.router
----
###router.rules
是一系列action和处理函数为键值对的对象。处理函数可以为函数也可以是字符串，如果是字符串，router将到controller里面去查找同名的函数。

	router.rules = {
		page1 : function(){ 
			//url#!page1 
		},
		page2 : 'back'
	}
	controller.back = function(){
		//url#!page2
	}
	
###router.action
当前action的处理函数

##window.request
----
###request.hash
完整的hash字符串（删除了#!）
###request.action
当前的action名称，如果不存在，则为index
###request.params
当前请求的参数列表（被依次传入action）
###request.querys
类似于http get请求的get数组

##window.controller
----

###controller.index
根action
###controller.noFound
未找到任何匹配的action时调用
###controller.beforeFilter
调用任何action之前调用
###controller.afterFilter
调用任何action之后调用