/**
 * 主线 -- 模型类
 * Thread
 * @author 		inaki
 * @version 	$Id: thread.js 4315 2014-10-08 06:07:41Z gzzcs $
 */

define([], function(){
	var app = Ibos.app;
	var l = Ibos.l;

	/**
	 * 模型类 -- 主线
	 * @class ThreadModel
	 * @constructor
	 * @extends {Backbone.Model}
	 */
	var ThreadModel = Backbone.Model.extend({
		urlRoot: app.url("thread/op/index"),

		idAttribute: "threadid",

		// @Debug: 由于目前后端接口还没统一，暂时使用此方法协调
		// 后端整理完成后删除此方法	
		url: function() {
		  var base =
		    _.result(this, 'urlRoot') ||
		    _.result(this.collection, 'url') ||
		    urlError();
		  if (this.isNew()) return base;
		  return base.replace(/([^\/])$/, '$1/') + "id/" + encodeURIComponent(this.id);
		},

		defaults: {
			subject: "",
			chargeuid: "",
			chargeAvatar: "",
			charge: "",
			description: "",
			totalCount: "0",
			finishCount: "0",
			time: "", // 主线周期（格式化）
			status: "0", // 状态， 0 进行中， 1 已结束
			memberCount: "0",
			feedCount: "0",
			timeleft: "0",
			isCharge: false, // 是否主办人
			isReaded: false, // 查看情况
			isAttention: false // 星标
		},

		parse: function(resp, options){
			if(options._parse){
				return resp.data;
			} else {
				return resp;
			}
		},

		// 由于在实际逻辑中，涉及到数据修改权限的判定。
		// 所以就算得到服务器响应也不代表操作成功
		// 这里由后端返回状态决定是更新视图还是执行回滚
		_success: function(callback){
			return function(model, resp, options){
				if(resp.isSuccess) {
					model.trigger("change", model, options);
				} else {
					model.set(model.previousAttributes(), { silent: true });
				}
				callback && callback(model, resp, options);
			};
		},

		validate: function (attrs, options) {
			// 主线名称不能为空
			if($.trim(attrs.subject) == "" ) {
	            return l("THREAD.INPUT_SUBJECT");  
			}

			// 如果设置负责人为必填项
			if(app.g("requireCharge") && !attrs.chargeuid) {
				return l("THREAD.SELECT_CHARGE");
			}
			// 如果设置结束时间为必填项
			if(app.g("requireFinishtime") && !attrs.endtime) {
				return l("THREAD.SELECT_ENDTIME");
			}
	    },

	    /**
	     * 星标关注, 取消星标关注
	     * @method star
	     * @return
	     */
	    star: function(){
	    	var isAttention = this.get("isAttention");
    		this.save({
    			isAttention: !isAttention
    		}, {
    			url: this.url() + "&op=attention",
    			silent: true,
    			success: this._success(),
    			_parse: true,
    			wait: true
    		});
	    },

	    /**
	     * 结束主线
	     * @method finish
	     * @return
	     */
	    finish: function(){
	    	this.save({}, {
	    		url: this.url() + "&op=end",
	    		silent: true,
	    		success: function(model, resp){
	    			if(resp.isSuccess){
	    				model.collection.customFetch();
	    			}
	    		},
	    		_parse: true,
	    		wait: true
	    	});
	    },

	    /**
	     * 重启主线
	     * @method restart
	     * @return
	     */
	    restart: function(){
	    	this.save({}, {
	    		url: this.url() + "&op=restart",
	    		silent: true,
	    		success: function(model, resp){
	    			if(resp.isSuccess){
	    				model.collection.customFetch();
	    			}
	    		},
	    		_parse: true,
	    		wait: true
	    	});
	    }

	});

	return ThreadModel;
});