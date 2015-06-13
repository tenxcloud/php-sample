/**
 * 主线 -- 动态
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_feed.js 4385 2014-10-16 10:54:30Z gzzcs $
 */

define([
	"threadDetail"
	], function(publishBox, threadModel) {

	var app = Ibos.app;

	return function(){
		require( [
			"atwho",
			"emotion",
			Ibos.app.getAssetUrl("message", "/js/comment.js")
			], function(){

			var cmt = Comment.init($("#thrd_feed_comment"), Ibos.app.g("threadFeedParam"));

			$("#thrd_add_comment").on("click", function(evt) {
				var $elem = $(this),
					params = $elem.data("param");
				cmt.addcomment($elem, params, evt);
			});

			$('#comment_emotion').ibosEmotion({
				target: $('#commentBox')
			});
		});
	};
});
