(function($) { 
	$.fn.eventCalendar = function(params) {
		var cal = this;
		var defaultOpt = {
			events: params.calendar.eventsUrl,
			loading: function(bool) {
				if (bool) $("#loading").show();
				else $("#loading").hide();
			},
			dayClick: function(date, jsEvent, view) {
				var calDay = $(this);
				$("#bubble").bubble(calDay, {
					content: $("#addTask").html(),
					onBeforeShow: function() {
						calDay.addClass("highlight");
						$(this).find("#lbWhen").html(date.format("ddd, D MMMM"));
					},
					onShow: function() {
						var taskDlg = $(this);
						var bound = {
							left : $(cal).offset().left,
							right : $(cal).offset().left + $(cal).outerWidth()
						};
						
						if($(taskDlg).offset().left + $(taskDlg).outerWidth() > bound.right) {
							$(this).css("left", bound.right - $(taskDlg).outerWidth());
						}
						if($(taskDlg).offset().left < bound.left) {
							$(this).css("left", bound.left);
						}
						
						$.extend(taskDlg, {
							refresh: function() {
								$.get(opts.calendar.allUnit, {}, function(units) {
									$(taskDlg).find("#lbTargetUnit option").remove();
									$("<option value=\"-1\">- Pilih Unit -</option>")
										.appendTo($(taskDlg).find("#lbTargetUnit"));
									$.each(units, function(i, unit) {
										$("<option value=\""+ unit.id +"\">"+ unit.name +"</option>")
											.appendTo($(taskDlg).find("#lbTargetUnit"));
									});
								});
							}
						})
						
						var t;
						$(this).find("#lbWho").tokenInput(params.calendar.searchUser, {theme: "facebook"});
						$(".token-input-dropdown-facebook").css("z-index",5);
						$(this).find("#lbWhat").autocomplete({
							source: function(request, response) {
								$.getJSON(params.calendar.searchEvent, {
										q: request.term
									}, function(data) {
										var evs = $.map(data, function(item) {
											return {
												label: item.title,
												id: item.id,
												value: item.title,
											}
										});
										
										response(evs);
									});
							}, 
							select: function( event, ui ) {
								t = ui.item;
							}
						});
						
						$(this).find("#browseTRUnit").click(function() {
							var btn = $(this);
							$("#list").bubble(btn, {
								position : {top: 0, left: 0},
								content: $("#listTRUnit").html(),
								onBeforeShow: function() {},
								onShow: function() {
									var dlg = $(this);
									$.extend(dlg, {
										refresh: function() {
											dlg.find(".tablesorter tbody").empty();
											$.get(opts.calendar.allUnit, {}, function(ranks) {
												$.each(ranks, function(i, unit) {
													$("<tr uid=\""+ unit.id +"\"><td><span>"+ (i+1) +"</span></td><td><span>" +
															unit.name + "</span>" +
														"<div class=\"action\">" +
															"<div id=\"edit\">Edit</div>" + 
															"<div id=\"delete\">Delete</div>" + 
														"</div>" + 
													"</td</tr>").appendTo(dlg.find(".tablesorter tbody"));
												});
											});
											
											$(dlg).css({
												top: ($(window).innerHeight() - $(dlg).outerHeight()) / 2,
												left: ($(window).innerWidth() - $(dlg).outerWidth()) / 2,
											});
										}
									})
									
									dlg.refresh();
									
									var idUnit = null;
									$(this).on("mouseenter", "tr", function() {
										$(this).addClass("hover");
									}).on("mouseleave", "tr", function() {
										$(this).removeClass("hover");
									}).on("click", "tr .action #delete", function() {
										var id = $(this).parents("tr").attr("uid");
										$.post(opts.calendar.deleteUnit, {
											id: id,
										}, function() {
											dlg.refresh();
										});
									}).on("click", "tr .action #edit", function() {
										var tr = $(this).parents("tr");
										var tds = tr.find("td span");
										dlg.find("#name").val($(tds[1]).html()).focus();
										idUnit = tr.attr("uid");
									});
									//$(".tablesorter").tablesorter();
									
									$(this).find(".button").click(function() {
										$.post(opts.calendar.addUnit, {
											id: idUnit == null ? "" : idUnit,
											name: dlg.find("#name").val(),
											isUpdate: (idUnit != null) ? true : false,
										}, function() {
											dlg.find("#name").val('');
											idUnit = null;
											dlg.refresh();
										});
									});
								}, 
								onHide: function() {
									taskDlg.refresh();
								}
							});
						});
						
						$(this).find("#btnaddTask").bind("click", function() {
							var d = taskDlg.data();
							var r = taskDlg.find("#lbWhere").val();
							var tgt = taskDlg.find("#lbTarget").val();
							var tgtU = taskDlg.find("#lbTargetUnit option").filter(":selected").val();
							var users = $(taskDlg).find("#lbWho").tokenInput("get");
							var uids = [];
							for(u=0;u<users.length;u++) uids.push(users[u].id);
							
							var par = {
								event_id: t.id,
								where: r,
								start: d.format("YYYY-MM-DD HH:mm:ss"),
								users: uids,
							}
							
							if(tgt != "") par["target"] = tgt;
							if(tgtU != null) par["unit"] = tgtU;
							
							$.post(params.calendar.addUrl, par, function(data) {
								cal.fullCalendar( "refetchEvents" );
								taskDlg.hide();
							})
						});
						
						taskDlg.refresh();
					}, 
					onHide: function() {
						calDay.removeClass("highlight");
					}
				}).data(date);
			}, eventClick: function(event, jsEvent, view) {
				//console.log(event);
				var calDay = $(this);
				$("#bubble").bubble($(this), {
					content: $("#editTask").html(),
					onBeforeShow: function() {
						calDay.addClass("highlight");
					},
					onShow: function() {
						var taskDlg = $(this);
						$.extend(taskDlg, {
							refresh: function() {
								$.get(opts.calendar.allUnit, {}, function(units) {
									$(taskDlg).find("#lbTargetUnit option").remove();
									$("<option value=\"-1\">- Pilih Unit -</option>")
										.appendTo($(taskDlg).find("#lbTargetUnit"));
									$.each(units, function(i, unit) {
										$("<option value=\""+ unit.id +"\">"+ unit.name +"</option>")
											.appendTo($(taskDlg).find("#lbTargetUnit"));
									});
									
									$(taskDlg).find("#lbTargetUnit option").filter(function(){
										return $(this).val() == event.unit;
								    }).prop('selected', true);
								});
							}
						});
						
						$(this).find("#browseTRUnit").click(function() {
							var btn = $(this);
							$("#list").bubble(btn, {
								position : {top: 0, left: 0},
								content: $("#listTRUnit").html(),
								onBeforeShow: function() {},
								onShow: function() {
									var dlg = $(this);
									$.extend(dlg, {
										refresh: function() {
											dlg.find(".tablesorter tbody").empty();
											$.get(opts.calendar.allUnit, {}, function(ranks) {
												$.each(ranks, function(i, unit) {
													$("<tr uid=\""+ unit.id +"\"><td><span>"+ (i+1) +"</span></td><td><span>" +
															unit.name + "</span>" +
														"<div class=\"action\">" +
															"<div id=\"edit\">Edit</div>" + 
															"<div id=\"delete\">Delete</div>" + 
														"</div>" + 
													"</td</tr>").appendTo(dlg.find(".tablesorter tbody"));
												});
											});
											
											$(dlg).css({
												top: ($(window).innerHeight() - $(dlg).outerHeight()) / 2,
												left: ($(window).innerWidth() - $(dlg).outerWidth()) / 2,
											});
										}
									})
									
									dlg.refresh();
									
									var idUnit = null;
									$(this).on("mouseenter", "tr", function() {
										$(this).addClass("hover");
									}).on("mouseleave", "tr", function() {
										$(this).removeClass("hover");
									}).on("click", "tr .action #delete", function() {
										var id = $(this).parents("tr").attr("uid");
										$.post(opts.calendar.deleteUnit, {
											id: id,
										}, function() {
											dlg.refresh();
										});
									}).on("click", "tr .action #edit", function() {
										var tr = $(this).parents("tr");
										var tds = tr.find("td span");
										dlg.find("#name").val($(tds[1]).html()).focus();
										idUnit = tr.attr("uid");
									});
									//$(".tablesorter").tablesorter();
									
									$(this).find(".button").click(function() {
										$.post(opts.calendar.addUnit, {
											id: idUnit == null ? "" : idUnit,
											name: dlg.find("#name").val(),
											isUpdate: (idUnit != null) ? true : false,
										}, function() {
											dlg.find("#name").val('');
											idUnit = null;
											dlg.refresh();
										});
									});
								}, 
								onHide: function() {
									taskDlg.refresh();
								}
							});
						});
						
						taskDlg.refresh();
						
						$(this).find("#lbWhere").html(event.where);
						$(this).find("#lbWhat").html(event.title);
						$(this).find("#lbWhen").html(event.start.format("ddd, D MMMM") + 
							(event.end == null ? "" : " - " + event.end.format("ddd, D MMMM")));
						$(this).find("#lbWho").html(event.fullname);
						$(this).find("#lbTarget").val(event.target);
						$(this).find("#lbRealization").val(event.realization);
						
						$(this).find("#btnSaveTask").bind("click", function() {
							var tgt = taskDlg.find("#lbTarget").val();
							var rlz = taskDlg.find("#lbRealization").val();
							var tgtU = taskDlg.find("#lbTargetUnit option").filter(":selected").val();
							
							var par = {
								id: event.id,
							}
							
							if(tgt != "") par["target"] = tgt;
							if(rlz != "") par["realization"] = rlz;
							if(tgtU != null) par["unit"] = tgtU;
							
							$.post(params.calendar.editUrl, par, function(data) {
								cal.fullCalendar( "refetchEvents" );
								taskDlg.hide();
							})
						});
						
						$(this).find("#btnDeleteTask").bind("click", function() {
							$.post(params.calendar.deleteUrl, {
								id: event.id,
							}, function(data) {
								cal.fullCalendar( "refetchEvents" );
								taskDlg.hide();
							})
						});
					}, 
					onHide: function() {
						calDay.removeClass("highlight");
					}
				});
			}, eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
				if(!event.editable) return false;
				$.post(params.calendar.moveUrl, {
					eventId:event.id,
					start: event.start.format("YYYY-MM-DD HH:mm:ss"),
					end: event.end ? event.end.format("YYYY-MM-DD HH:mm:ss") : null,
				});
				return false;
			}, eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
				if(!event.editable) return false;
				$.post(params.calendar.resizeUrl, {
					eventId:event.id,
					start: event.start.format("YYYY-MM-DD HH:mm:ss"),
					end: event.end.format("YYYY-MM-DD HH:mm:ss"),
				});
				return false;
			}, eventRender: function(event, element, view) {
				$($(element).get(0)).css("background-color", "#"+event.color).css("border-color", "#"+event.color);
				
			}, eventAfterAllRender: function(view) {
				refreshUserEvent();
			}
		}
		
		params.calendar = $.extend(true, defaultOpt, params.calendar);
		var fc = $(this).fullCalendar(params.calendar);
		return $.extend($(this), fc);
	}
})(jQuery);

function refreshUserEvent() {
	$.get(opts.calendar.allUser, {}, function(users) {
		//users = $.parseJSON(users);
		$("#users ul").empty();
		$.each(users, function(i, user) {
			$("<li uid=\""+ user.id +"\"><div class=\"color\" style=\"background-color:"+ 
			"#"+user.color +"\">"+ user.fullname.substring(0, 1) +"</div><div title=\""+ user.fullname +
			"\" class=\"name\">"+ user.fullname +"</div></li>").data(user).appendTo($("#users ul"));
			//console.log(user);
		});
	});
	
	$.get(opts.calendar.allEvent, {}, function(events) {
		//events = $.parseJSON(events);
		$("#events ul").empty();
		$.each(events, function(i, event) {
			$("<li eid=\""+ event.id +"\"><div class=\"color\" style=\"background-color:"+ 
			"#"+ ((1<<24)*Math.random()|0).toString(16) +"\">"+ event.title.substring(0, 1) +"</div><div title=\""+ 
			event.title +"\" class=\"name\">"+ event.title +"</div></li>").data(event).appendTo($("#events ul"));
		});
	});
}