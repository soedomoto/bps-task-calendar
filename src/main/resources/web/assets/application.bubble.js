(function($) {
	$.fn.bubble = function(trigger, conf) {
		var self = this;
		var bubble = $(this);
		conf = $.extend(self, {
			position: null,
			size: null,
			children: [], 
			trigger: trigger,
			onBeforeShow: function(){},
			onShow: function(){},
			onBeforeHide: function(){},
			onHide: function(){},
		}, conf);
		
		$.extend(self, conf);
		$.extend(self, {
			show: function(event) {
				if(conf.position == null) {
					var left = trigger.offset().left + ((trigger.width() - bubble.outerWidth(true)) / 2);
					var top = trigger.parents("table").offset().top - bubble.outerHeight(true);
					var bottom = trigger.parents("table").offset().top + trigger.parents("table").outerHeight(true) + bubble.outerHeight(true);
					
					var isTopHidden = top - $(window).scrollTop() < 0 ? true : false;
					var isBottomHidden = bottom - $(window).scrollTop() < 0 ? true : false;
					if(isTopHidden) {
						if(!isBottomHidden) top = trigger.parents("table").offset().top + trigger.parents("table").outerHeight(true);
					}
				} else {
					var left = conf.position.left;
					var top = conf.position.top;
				}
				
				bubble.css("left",left).css("top",top);
				if(conf.size !== null) {
					if(conf.size.width !== null) bubble.width(conf.size.width);
					if(conf.size.height !== null) bubble.height(conf.size.height);
				}
				
				conf.onBeforeShow(self, conf);
				bubble.show();
				conf.onShow(self, conf);
				
				$(window).off("mousedown").mousedown(function(e) { 
					if(bubble.is(":visible")) {
						var clickEl = $(e.target).closest($(trigger.get(0))).andSelf().filter(function(){ 
							return this === trigger.get(0) 
						});
						var bubbleEl = $(e.target).closest($(bubble.get(0))).andSelf().filter(function(){ 
							return this === bubble.get(0) 
						});
						
						var focus = clickEl.length === 0 ? false : true;
						var bubbleCl = bubbleEl.length === 0 ? false : true;
						if(!focus && !bubbleCl) self.hide();
					}
				 });
			}, 
			hide: function(event) {
				conf.onBeforeHide(self, conf);
				bubble.hide();
				conf.onHide(self, conf);
			}
		});
		
		if(conf.content !== null) bubble.find("#cbContent").html(conf.content);
		
		if(bubble.is(":visible")) self.hide();
		else self.show();
		
		$(".cb-close").off("click").click(function() {
			self.hide();
		});
		 
		 return this;
	}
})(jQuery);