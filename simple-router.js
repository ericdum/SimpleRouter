/**
 * Simple Router
 *
 * Copyright 2013, Eric Dum 代立晨
 * http://mujiang.info/
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}!$.support.boxModel&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

/**
 *
 * 定义了三个全局变量：controller, request, router
 *
 * Usage: #!action/params1/params2/params3...:key=value:key2=value...
 *
 */
(function(){
    if( window.router || window.request || window.controller ) return;

    var controller = {
        index: function(){},
        beforeFilter: function(){},
        afterFilter: function(){},
        noFound: function(){}
    };
    
    var request = {
        hash   : "",
        action : "", //action名
        params : [],
        querys : {},
        reset: function(){
            this.hash   = "";
            this.action = "";
            this.params = [];
            this.querys = {};
        },
        init: function( hash ){
            this.reset();
            this.hash = hash.replace('#!', '');
            var parsed = this.hash.match(/^\/?([^:]*)?(:.+)?$/i);
            if(parsed[1]){
                this.params = parsed[1].split('/');
                this.action = this.params.shift();
            }else{
                this.action = 'index';
            }
            if(parsed[2]){
                $.each(parsed[2].split(':'), function(i,v){ 
                    v = v.split('=');
                    if(v[0]){
                        request.querys[v[0]] = v[1];
                    }
                })
            }
        }
    };

    var router = (function() {

        return {
            action: function(){}, //action函数

            rules: {},

            open : function( hash ){
                request.init(hash);

                if ( typeof this.rules[request.action] === "function" ) {
                    this.action = this.rules[request.action];

                } else if ( typeof this.rules[request.action] == "string" &&
                    typeof controller[this.rules[request.action]] === "function" ) {
                    this.action = controller[this.rules[request.action]];

                } else if ( typeof controller[request.action] === "function" ){
                    this.action = controller[request.action];

                } else {
                    this.action = controller.noFound;
                }
                this.do_action();
            },

            do_action: function (){
                controller.beforeFilter(request.action, request.params);
                this.action.apply(this, request.params);
                controller.afterFilter(request.action, request.params);
            }
        };
        
    })();


    $(window).hashchange(function(event){
        router.open(location.hash);
    });

    $(function(){$(window).hashchange()});

    window.router = router;
    window.request = request;
    window.controller = controller;
})();

