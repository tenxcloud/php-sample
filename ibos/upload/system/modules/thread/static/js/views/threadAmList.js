/**
 * 主线 -- 任务列表视图基类
 * Thread
 * @author 		inaki
 * @version 	$Id: threadAmList.js 4315 2014-10-08 06:07:41Z gzzcs $
 */

define([
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmItem.js")
	], function(AmItemView){
	return Backbone.View.extend({
		// el: "#thread_assignment_list",

		initialize: function(){
			this.listenTo(this.collection, "filterByProps", this.renderByFilter);
		},

		template: $.noop,

		// 列表项对应的视图类
		itemView: AmItemView,
		
		groupKey: "id",

		desc: false,

		// 将模型分组并排序后返回
		getSortAndGroupData: function(models){
			var view = this;
			models = models || this.collection.models
			return _.sortBy(_.groupBy(models, function(m){
			 	// 将增加时间格式化对比
		 		return m.get(view.groupKey);
			}), function(ms, k){
				return view.desc ? -k : +k ;
			});
		},

		// 获取分类模板需要的数据
		getTmplData: function(model){
			return this.model.toJSON();
		},

		render: function(models){
			var view = this;
			// 清空内容
			this.$el.empty();

			models = this.getSortAndGroupData(models);
			
			// 重新生成节点
			$.each(models, function(i, ms){
				var _tmplData = view.getTmplData(ms[0]);
				var $category = $(view.template(_tmplData)).appendTo(view.$el);
				var $catagoryTbody = $category.find(".table tbody");

				ms = _.sortBy(ms, function(m){
					return  -m.get(m.idAttribute);
				});

				$.each(ms, function(j, m){
					var itemView = new view.itemView({ model: m });
					// itemView.render().$el.hide().appendTo($catagoryTbody).fadeIn();
					$catagoryTbody.append(itemView.render().el);
				});
			});
		},

		/**
		 * 按键值对过滤
		 * @filterBy
		 * @param  {Object} props 要求配备的键值对
		 * @return
		 */
		renderByFilter: function(props){
			if(!props) {
				this.render();
			} else {
				var matchesFunc = _.matches(props);
				var models = _.filter(this.collection.models, function(model){
					return matchesFunc(model.toJSON());
				});
				this.render(models);
			}
		}
	});
});