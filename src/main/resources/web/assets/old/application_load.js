$("#calendar").eventCalendar(opts);
	
/*$("#users").on("click", "ul li", function() {
	var l = $(this).offset().left + $(this).outerWidth();
	var list = $(this).parent().parent();
	var ls = $(this);
	$("#bubble").bubble($(this), {
		content: $("#editUser").html(),
		position: { top: -1, left: l },
		onBeforeShow: function() {
			$(this).css("position", "fixed").css("min-height", list.height()).css("width", "auto");
		},
		onShow: function() {
			$(this).find("#lbCol").css("background-color", ls.find(".color").css("background-color")).html(ls.find(".color").html());
			$(this).find("#lbTitle").html(ls.find(".name").html());
			$("<div class=\"overlay\"></div>").css({
				"height": ls.outerHeight()-2,
				"width": ls.outerWidth()-3,
			}).appendTo(ls);
			
			var b = $(this);
			$(this).find("#btnDelUser").click(function() {
				$.post(opts.calendar.delUser, {
					id: ls.attr("uid"),
				}, function() {
					$("#calendar").fullCalendar( "refetchEvents" );
					b.hide();
				});
			});
		}, 
		onHide: function() {
			ls.find(".overlay").remove();
		}
	});
}).on("click", ".footer", function() {
	var l = $(this).offset().left + $(this).outerWidth();
	var list = $(this).parent();
	$("#bubble").bubble($(this), {
		content: $("#addUser").html(),
		position: { top: -1, left: l },
		onBeforeShow: function() {
			$(this).css("position", "fixed").css("min-height", list.height()).css("width", "auto");
			if(l + $(this).outerWidth() > $(window).width()) {
				var left = $(window).width() - list.outerWidth() - $(this).width();
				$(this).css("left", left);
			}
		},
		onShow: function() {
			$(this).find("#lbColor").css({
				"width":"70px",
				"border":"1px solid green",
				"border-right":"20px solid green",
			}).colpick({
				layout:"hex", submit:0,
				onShow: function() {
					$("#"+$(this).data("colpickId")).css("z-index", 4);
				}, 
				onChange:function(hsb,hex,rgb,el,bySetColor) {
					$(el).css("border-color","#"+hex);
					if(!bySetColor) $(el).val(hex);
				}
			}).keyup(function(){
				$(this).colpickSetColor(this.value);
			});
			
			$(this).find("#lbRank").autocomplete({
				source: function(request, response) {
					$.getJSON(opts.calendar.searchRank, {
							q: request.term
						}, function(data) {
							var evs = $.map(data, function(item) {
								return {
									label: item.label,
									id: item.id,
									value: item.value,
								}
							});
							
							response(evs);
						});
				}, 
				select: function( event, ui ) {
					t = ui.item;
				}
			});
			
			$(this).find("#lbPosition").autocomplete({
				source: function(request, response) {
					$.getJSON(opts.calendar.searchPosition, {
							q: request.term
						}, function(data) {
							var evs = $.map(data, function(item) {
								return {
									label: item.label,
									id: item.id,
									value: item.value,
								}
							});
							
							response(evs);
						});
				}, 
				select: function( event, ui ) {
					t = ui.item;
				}
			});
			
			var b = $(this);
			$(this).find("#btnAddUser").bind("click", function() {
				$.post(opts.calendar.addUser, {
					fullname: b.find("#lbFullname").val(),
					color: b.find("#lbColor").val(),
					username: b.find("#lbUsername").val(),
					password: b.find("#lbPassword").val(),
					nip: b.find("#lbNip").val(),
					rank: b.find("#lbRank").val(),
					position: b.find("#lbPosition").val(),
				}, function() {
					$("#calendar").fullCalendar( "refetchEvents" );
					//refreshUserEvent();
					b.hide();
				});
			});
		},
		onHide: function() {
			$(this).css("width", "").css("position", "").css("min-height", "").css("width", "");
		}
	});
});

$("#events").on("click", "ul li", function() {
	var list = $(this).parent().parent();
	var ls = $(this);
	$("#bubble").bubble($(this), {
		content: $("#editEvent").html(),
		position: { top: -1, left: 0 },
		onBeforeShow: function() {
			$(this).css("position", "fixed").css("min-height", list.height()).css("width", "auto");
		},
		onShow: function() {
			$(this).find("#lbCol").css("background-color", ls.find(".color").css("background-color")).html(ls.find(".color").html());
			$(this).find("#lbTitle").html(ls.find(".name").html());
			$("<div class=\"overlay\"></div>").css({
				"height": ls.outerHeight()-2,
				"width": ls.outerWidth()-3,
			}).appendTo(ls);
			$(this).css("left", $(window).outerWidth() - $(ls).outerWidth() - $(this).outerWidth());
			
			var b = $(this);
			$(this).find("#btnDelEvent").click(function() {
				$.post(opts.calendar.delEvent, {
					id: ls.attr("eid"),
				}, function() {
					$("#calendar").fullCalendar( "refetchEvents" );
					b.hide();
				});
			});
			
			$(this).find("#lnPrintTL").attr("href", "/event/taskletter/" + ls.attr("eid") + "/pdf");
		}, 
		onHide: function() {
			ls.find(".overlay").remove();
		}
	});
}).on("click", ".footer", function() {
	var l = $(this).offset().left + $(this).outerWidth();
	var list = $(this).parent();
	$("#bubble").bubble($(this), {
		content: $("#addEvent").html(),
		position: { top: -1, left: l },
		onBeforeShow: function() {
			$(this).css("position", "fixed").css("min-height", list.height()).css("width", "auto");
		}, 
		onShow: function() {},
		onHide: function() {
			ls.find(".overlay").remove();
		}
	});
});*/