/**
 * 主线 -- 团队
 * Thread
 * @author      inaki
 * @version     $Id: thread_team.js 4964 2015-04-01 11:13:20Z tanghang $
 */

define(function() {
    return function(){
        var app = Ibos.app;

        // 团队成员管理、关注人员管理
        require([
            "threadDetail",
            "userSelect"
            ], function(threadModel){
            var TUserModel = Backbone.Model.extend({
                idAttribute: "uid"
            });
            var TUserCollection = Backbone.Collection.extend({
                model: TUserModel,

                getPrefixedUids: function(){
                    return _.map(this.pluck("uid"), function(v){
                        return "u_" + v;
                    });
                }
            });

            var ThreadUserListView = Backbone.View.extend({
                events: {
                    "click .o-th-plus": "showSelectBox"
                },

                key: "uid",

                initialize: function(){
                    var view = this;
                    var collection = this.collection;

                    this.listenTo(this.collection, "reset", this.render);

                    this.$selectBox = $("<div id='" + (this.$el.attr("id") || _.uniqueId("user_box")) + "'></div>")
                    .hide().insertAfter(this.$el);

                    this.selectBox = this.$selectBox.selectBox({
                        type: "user",
                        data: Ibos.data.get("user"),
                        values: collection.getPrefixedUids()
                    }).data("selectBox");

                    var addUids = [];
                    var removeUids = [];
                    var timer;

                    $(this.selectBox).on("slbchange", function(evt, evtData){
                        var uid = view.removeUserPrefix(evtData.id); // 去掉用户id 前缀

                        clearTimeout(timer)

                        if(evtData.checked) {
                            addUids.push(uid);
                            removeUids.splice(removeUids.indexOf(uid), 1);
                        } else {
                            removeUids.push(uid);
                            addUids.splice(addUids.indexOf(uid), 1);
                        }

                        timer = setTimeout(function() {
                            if(addUids.length) {
                                view.addUser(addUids.join(','));
                            }
                            if(removeUids.length){
                                view.removeUser(removeUids.join(','));
                            }
                            addUids = [];
                            removeUids = [];
                        }, 1000);
                    });

                    this.render();
                },

                addUserPrefix: function(str){
                    return str ? 
                        "u_" + (str.replace(/,/g, ",u_")) : 
                        "";
                },

                removeUserPrefix: function(str){
                    return str ?
                        ("," + str).replace(/,u_/g, ",").slice(1) :
                        "";
                },

                showSelectBox: function(){
                    this.$selectBox.zIndex(10000).show().position({
                        of: $(window)
                    });
                },

                hideSelectBox: function(){
                    this.$selectBox.hide();
                },

                addUser: function(uid){},

                removeUser: function(uid){}
            });

            var TMemberListView = ThreadUserListView.extend({

                template: _.template(document.getElementById("tpl_member_item").text),

                render: function(){
                    var view = this;
                    var html = "";

                    this.$el.children(":lt(-2)").remove();

                    $.each(this.collection.toJSON(), function(i, d){
                        html += view.template(d);
                    });

                    this.$el.prepend(html);
                },

                // 由于后端没有做 Rest 的架构，这里直接与后端交互
                // 成功后再同步回 Model
                addUser: function(uid){
                    var view = this;
                    var collection = this.collection;
                    var uids = collection.length ?
                        collection.pluck("uid").join(",") + "," + uid :
                        uid;

                    // var ajax = _.debounce(function() {
                    $.ajax({
                        url: app.url("thread/op/index") + "/id/" + U.getUrlParam().id + "&" + $.param({ op: "members", uids: uids }),
                        dataType: "json",
                        type: "put",
                        success: function(res){
                            if(res.isSuccess) {
                                Ui.tip(res.msg);
                                collection.reset(res.data);
                            } else {
                                Ui.tip(res.msg, "danger");
                            }
                        }
                    });
                },

                removeUser: function(uid){
                    var view = this;
                    var collection = this.collection;
                    var uids = collection.pluck("uid");
                    $.each(uid.split(','), function(i, u) {
                        var index = uids.indexOf(u);
                        if(index != -1) {
                            uids.splice(index, 1);
                        }
                    });

                    uids = uids.join(',')
                        
                    $.ajax({
                        url: app.url("thread/op/index") + "/id/" + U.getUrlParam().id + "&" + $.param({ op: "members", uids: uids }),
                        dataType: "json",
                        type: "put",
                        success: function(res){
                            if(res.isSuccess) {
                                Ui.tip(res.msg);
                                collection.reset(res.data);
                            } else {
                                Ui.tip(res.msg, "danger");
                            }
                        }
                    });
                }
            });

            var TFollowerListView = ThreadUserListView.extend({

                template: _.template(document.getElementById("tpl_follower_item").text),

                render: function(data){
                    var view = this;
                    var html = "";

                    this.$el.children(":lt(-1)").remove();

                    $.each(this.collection.toJSON(), function(i, d){
                        html += view.template(d);
                    });

                    this.$el.prepend(html);
                },

                // 由于后端没有做 Rest 的架构，这里直接与后端交互
                // 成功后再同步回 Model
                addUser: function(uid){
                    var view = this;
                    var collection = this.collection;
                    var uids = collection.length ?
                        collection.pluck("uid").join(",") + "," + uid :
                        uid;

                    $.ajax({
                        url: app.url("thread/op/index") + "/id/" + U.getUrlParam().id + "&" + $.param({ op: "addAttentions", uids: uids }),
                        dataType: "json",
                        type: "put",
                        success: function(res){
                            if(res.isSuccess) {
                                Ui.tip(res.msg);
                                collection.reset(res.data);
                            } else {
                                Ui.tip(res.msg, "danger");
                            }
                        }
                    });
                },

                removeUser: function(uid){
                    var view = this;
                    var collection = this.collection;
                    var uids = collection.pluck("uid");
                    $.each(uid.split(','), function(i, u) {
                        var index = uids.indexOf(u);
                        if(index != -1) {
                            uids.splice(index, 1);
                        }
                    });

                    uids = uids.join(',')
                        
                    $.ajax({
                        url: app.url("thread/op/index") + "/id/" + U.getUrlParam().id + "&" + $.param({ op: "addAttentions", uids: uids }),
                        dataType: "json",
                        type: "put",
                        success: function(res){
                            if(res.isSuccess) {
                                Ui.tip(res.msg);
                                collection.reset(res.data);
                            } else {
                                Ui.tip(res.msg, "danger");
                            }
                        }
                    });
                }
            });
        
            
            var memberCollection = new TUserCollection(Ibos.app.g("members"));
            var memberListView = new TMemberListView({
                el: "#thread_member_list",

                collection: memberCollection
            });
            // 添加、移除参与人员时，手动更新当前主线模型的参与人员属性
            memberCollection.on("reset", function(collection){
                threadModel.set("participantuid", collection.pluck("uid").join(","));
            });

            threadModel.on("change:participantuid", function(model, prop, options){
                var count = prop ? prop.split(",").length : 0;
                $('[data-node="memberCount"]').html(count);
            });

            // 关注人员列表
            var followerCollection = new TUserCollection(Ibos.app.g("followers"));
            var followerListView = new TFollowerListView({
                el: "#thread_follower_list",

                collection: followerCollection
            });

            followerCollection.on("reset", function(collection){
                $('[data-node="followerCount"]').html(collection.length);
            });

            Ibos.statics.load(Ibos.app.getStaticUrl("/js/src/call.js"))
            .done(function() {

                $("#call_meeting").click(function() {
                    var users = memberCollection.map(function(model) {
                        return "u_" + model.get("uid");
                    }).join(",");

                    Ibos.Call.connect([users], "meeting");
                })
            })
        });

        // 统计图表
        require([
            "echarts"
            ], function(echarts){
                // 共用图表主题 
                var theme = {
                    // color: [
                    //  "#fd917b","#b7da83","#ffaa4b","#ffce53","#51a4e6",
                    //  "#97abeb","#e86f71","#83a3c8","#748895","#81cdb6",
                    //  "#ff9456","#76b6fe","#e69ee3","#8ce0bf","#b0c780",
                    //  "#bd7f42","#7acb9e","#cfac5d","#71dbdb","#9282f1"
                    // ],
                    color: [
                        "#ffaa49", "#76b6fe", "#91ce31", "#e86f71", "#81cdb6"
                    ],
                    
                    // 图例
                    legend: {
                        x: 80,
                        itemGap: 80,
                        textStyle: {
                            fontFamily: "Microsoft Yahei, Arial, Verdana, sans-serif",
                            color: "#82939E"
                        }
                    },

                    // 提示框
                    // tooltip: {
                    //     backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
                    //     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    //         type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    //         lineStyle : {          // 直线指示器样式设置
                    //             color: '#008acd'
                    //         },
                    //         crossStyle: {
                    //             color: '#008acd'
                    //         },
                    //         shadowStyle : {                     // 阴影指示器样式设置
                    //             color: 'rgba(200,200,200,0.2)'
                    //         }
                    //     }
                    // },

                    // 网格
                    grid: {
                        x2: 2,
                        y: 30,
                        y2: 30
                    },

                    // 类目轴
                    categoryAxis: {
                        axisLine: {            // 坐标轴线
                            lineStyle: {color: "#83939E"}
                        },
                        axisLabel: {
                            textStyle: {color: "#82939E"}
                        }
                    },

                    // 数值型坐标轴默认参数
                    valueAxis: {
                        axisLine: {            // 坐标轴线
                            lineStyle: {color: "#83939E"},
                        },
                        axisLabel: {
                            textStyle: {color: "#82939E"}
                        }
                    },

                    // 柱形图默认参数
                    bar: {
                        barWidth: 30,
                        barGap: "30"
                    },

                    // 折线图默认参数
                    line: {
                        // smooth : true,
                        symbol: "emptyCircle",  // 拐点图形类型
                        symbolSize: 4           // 拐点图形大小
                    },
                    
                    textStyle: {
                        fontFamily: "Microsoft Yahei, Arial, Verdana, sans-serif",
                        color: "#82939E"
                    }
                }

                function setChartHeight(elem, datas){
                    $(elem).height(datas.length * 60 + 60);
                }

                // 项目任务统计图表数据
                var taskChart = Ibos.app.g('taskChart'),
                    names = taskChart.names,
                    unreaded = taskChart.unreaded,
                    going = taskChart.going,
                    finished = taskChart.finished,
                    overdue = taskChart.overdue;
                
                var max = _.max([].concat(unreaded, going, finished, overdue));
                var invertMap = function(arr){ return $.map(arr, function(v, i){
                    return max - v;
                }) }
                var taskChartData = {
                    legend: ["未读", "进行中","已完成", "已过期"],
                    yAxis: names,
                    series: [
                        // 未读
                        {
                            name: "未读",
                            data: unreaded
                        },
                        {
                            name: "未读",
                            data: invertMap(unreaded)
                        },

                        // 进行中
                        {
                            name: "进行中",
                            data: going
                        },
                        {
                            name: "进行中",
                            data: invertMap(going)
                        },

                        // 已完成
                        {
                            name: "已完成",
                            data: finished
                        },
                        {
                            name: "已完成",
                            data: invertMap(finished)
                        },

                        // 已过期
                        {
                            name: "已过期",
                            data: overdue
                        },
                        {
                            name: "已过期",
                            data: invertMap(overdue)
                        }
                    ]
                }
                
                setChartHeight(document.getElementById("thrd_task_chart"), taskChartData.yAxis);

                var placeHoledStyle = {
                    normal:{
                        borderColor:"rgba(0,0,0,0)",
                        color:"rgba(0,0,0,0)"
                    },
                    emphasis:{
                        borderColor:"rgba(0,0,0,0)",
                        color:"rgba(0,0,0,0)"
                    }
                };
                var dataStyle = { 
                    normal: {
                        label : {
                            show: true,
                            position: "inside",
                            formatter: "{c}"
                        }
                    }
                };

                // 项目任务统计图表
                echarts.init(document.getElementById("thrd_task_chart"), theme)
                .setOption({
                    tooltip : {
                        trigger: "axis",
                        axisPointer : {
                            type : "shadow"
                        },
                        formatter : "{b}<br/>{a0}:{c0}<br/>{a2}:{c2}<br/>{a4}:{c4}<br/>{a6}:{c6}"
                    },
                
                    legend: {
                        data: taskChartData.legend
                    },

                    xAxis : [
                        {
                            type : "value",
                            position: "top",
                            splitNumber: 4,
                            splitLine: {
                                lineStyle: {color: "#DADFE6"}
                            },
                            axisLabel: {show: false}
                        }
                    ],

                    yAxis : [
                        {
                            type : "category",
                            splitLine: {show: false},
                            splitArea: {
                                show:true,
                                areaStyle: {
                                    color: ["rgba(255,255,255,0.3)", "rgba(232,232,232,0.3)"]
                                }
                            },
                            axisLabel: {
                                margin: 20,
                                textStyle: {
                                    fontSize: 14
                                }
                            },
                            axisTick: {show: false},
                            data: taskChartData.yAxis
                        }
                    ],

                    series: $.map(taskChartData.series, function(data, i){
                        return $.extend({}, data, {
                            type:"bar",
                            stack: "任务总数",
                            itemStyle: i % 2 == 0 ? dataStyle : placeHoledStyle
                        });
                    })
                });
                
                // 工作进展情况图表数据
                var processChart = Ibos.app.g('processChart'),
                    chargeNames = processChart.names,
                    weeks = processChart.weeks,
                    series = processChart.series;
                var processData = {
                    legend: chargeNames,
                    xAxis: weeks,
                    series: series
                }

                // 工作进展情况图表
                echarts.init(document.getElementById("thrd_process_chart"), theme)
                .setOption({
                    tooltip : {
                        trigger: "axis",
                        formatter: function(v) {
                            var str = v[0][1] + '<br/>';

                            $.each(v, function(i, s) {
                                str += s[0] + " : " + s[2] + "%";
                                str += (i == v.length - 1) ? "" : "<br />";
                            });

                            return str;
                        }
                    },

                    legend: {
                        data: processData.legend
                    },

                    yAxis: [{
                        type: "value",
                        axisLabel: {
                            formatter: "{value}%",
                            textStyle: { fontSize: 14 },
                            margin: 20,
                        },
                        splitLine: { show: false },
                        splitArea: {
                            show:true,
                            areaStyle: {
                                color: ["rgba(255,255,255,0.3)", "rgba(232,232,232,0.3)"]
                            }
                        },
                        max: 100,
                        min: 0
                    }],

                    xAxis: [{
                        type: "category",
                        axisTick: { 
                            inside: true,
                            lineStyle: {
                                color: "#B2C0D1"
                            }
                        },
                        splitLine: { show: false },
                        data: processData.xAxis
                    }],

                    series: $.map(processData.series, function(data, i){
                        return $.extend({}, data, {
                            type:"line"
                        });
                    })
                });
            }
        );
    }
});