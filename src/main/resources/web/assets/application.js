jQuery(function($) {
	$(document).on("mouseenter", ".fc-button", function() {
		$(this).addClass("fc-state-hover");
	}).on("mouseleave", ".fc-button", function() {
		$(this).removeClass("fc-state-hover");
	});

	$(document).on("mouseenter", ".button", function() {
		$(this).addClass("hover");
	}).on("mouseleave", ".button", function() {
		$(this).removeClass("hover");
	});

	$(document).on("click", ".list .header", function() {
		var ul = $(this).parent().find("ul,.ul");
		if(ul.is(":hidden")) $(ul).slideDown();
		else $(ul).slideUp();
	});

	$(document).on("click", ".collapsible .button", function() {
		var thus = $(this);
		var ul = $(this).parent().find(".content");
		if(ul.is(":hidden")) {
			$(ul).slideDown(function() {
				thus.find("span").attr("class", "icon-chevron-up");
			});
		} else {
			$(ul).slideUp(function() {
				thus.find("span").attr("class", "icon-chevron-down");
			});
		}
	});

	$(document).on("click", ".overflowmenu", function() {
		var menu = $(this).find(".menu");
		if(menu.attr("position") == "right") {
			menu.css("left", -1-menu.outerWidth()+$(this).outerWidth());
		} else if(menu.attr("position") == "left") {
			menu.css("left", -1);
		}
		
		if(menu.is(":hidden")) $(menu).show();
		else $(menu).hide();
	});
	
	
	//	Onload
	$(document).ready(function() {
		$("#calendar").eventCalendar(opts);
		
		$("#users").on("click", "ul li", function() {
			var l = $(this).offset().left + $(this).outerWidth();
			var list = $(this).parent().parent();
			var ls = $(this);
			$("#bubble").bubble(ls, {
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
					
					var user = ls.data();
					//console.log(user);
					$(this).find("#lbFullname").val(user.fullname);
					$(this).find("#lbColor").val(user.color);
					$(this).find("#lbPosition").val(user.position.name);
					$(this).find("#lbSupervisor").val(user.supervisor.fullname);
					$(this).find("#lbNip").val(user.nip);
					$(this).find("#lbRank").val(user.rank.name);
					
					var lbColor = $(this).find("#lbColor");
					lbColor.css({
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
						$(this).colpickSetColor(lbColor.value);
					});
					
					var supervisor = user.supervisor;
					$(this).find("#lbSupervisor").autocomplete({
						source: function(request, response) {
							$.getJSON(opts.calendar.searchUser, {
									q: request.term
								}, function(data) {
									var evs = $.map(data, function(item) {
										return {
											label: item.name,
											id: item.id,
											value: item.name,
										}
									});
									
									response(evs);
								});
						}, 
						select: function( event, ui ) {
							supervisor = ui.item;
						}
					});
					
					var rank = user.rank;
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
							rank = ui.item;
						}
					});
					
					var position = user.position;
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
							position = ui.item;
						}
					});
					
					var b = $(this);
					$(this).find("#btnUpdateUser").bind("click", function() {
						var params = {
							id: user.id,
							fullname: b.find("#lbFullname").val(),
							color: b.find("#lbColor").val(),
							position: position.id,
							supervisor: supervisor.id,
						};
						if(b.find("#lbNip").val() != "") params["nip"] = b.find("#lbNip").val();
						if(rank != null) params["rank"] = rank.id;
						
						$.post(opts.calendar.editUser, params, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							//refreshUserEvent();
							b.hide();
						});
					});
					
					$(this).find("#btnDelUser").click(function() {
						$.post(opts.calendar.delUser, {
							id: ls.attr("uid"),
						}, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							b.hide();
						});
					});
					
					$(this).find("#lnPrintTL").attr("href", "/user/taskletter/" + ls.attr("uid") + "/pdf");
					$(this).find("#lnPrintCKPT").attr("href", "/user/ckpt/" + ls.attr("uid") + "/pdf");
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
					
					var supervisor;
					$(this).find("#lbSupervisor").autocomplete({
						source: function(request, response) {
							$.getJSON(opts.calendar.searchUser, {
									q: request.term
								}, function(data) {
									var evs = $.map(data, function(item) {
										return {
											label: item.name,
											id: item.id,
											value: item.name,
										}
									});
									
									response(evs);
								});
						}, 
						select: function( event, ui ) {
							supervisor = ui.item;
						}
					});
					
					var rank;
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
							rank = ui.item;
						}
					});
					
					$(this).find("#browseRank").click(function() {
						var btn = $(this);
						$("#list").bubble(btn, {
							position : {top: 0, left: 0},
							content: $("#listRanks").html(),
							onBeforeShow: function() {},
							onShow: function() {
								var dlg = $(this);
								$.extend(dlg, {
									refresh: function() {
										$(".tablesorter tbody").empty();
										$.get(opts.calendar.allRank, {}, function(ranks) {
											$.each(ranks, function(i, rank) {
												$("<tr rid=\""+ rank.id +"\"><td><span>"+ rank.id +"</span></td><td><span>" +
													rank.name + "</span>" +
													"<div class=\"action\">" +
														"<div id=\"edit\">Edit</div>" + 
														"<div id=\"delete\">Delete</div>" + 
													"</div>" + 
												"</td</tr>").appendTo($(".tablesorter tbody"));
											});
										});
										
										$(dlg).css({
											top: ($(window).innerHeight() - $(dlg).outerHeight()) / 2,
											left: ($(window).innerWidth() - $(dlg).outerWidth()) / 2,
										});
									}
								})
								
								dlg.refresh();
								
								var idRank = null;
								$(this).on("mouseenter", "tr", function() {
									$(this).addClass("hover");
								}).on("mouseleave", "tr", function() {
									$(this).removeClass("hover");
								}).on("click", "tr .action #delete", function() {
									var id = $(this).parents("tr").attr("rid");
									$.post(opts.calendar.deleteRank, {
										id: id,
									}, function() {
										dlg.refresh();
									});
								}).on("click", "tr .action #edit", function() {
									var tr = $(this).parents("tr");
									var tds = tr.find("td span");
									dlg.find("#id").val($(tds[0]).html()).attr('disabled', true);
									dlg.find("#name").val($(tds[1]).html()).focus();
									idRank = $(tds[0]).html();
								});
								//$(".tablesorter").tablesorter();
								
								$(this).find(".button").click(function() {
									$.post(opts.calendar.addRank, {
										id: dlg.find("#id").val(),
										name: dlg.find("#name").val(),
										isUpdate: (idRank != null) ? true : false,
									}, function() {
										dlg.find("#id").val('').attr('disabled', false);
										dlg.find("#name").val('');
										idRank = null;
										dlg.refresh();
									});
								});
							}, 
							onHide: function() {}
						});
					});
					
					var position;
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
							position = ui.item;
						}
					});
					
					$(this).find("#browsePosition").click(function() {
						var btn = $(this);
						$("#list").bubble(btn, {
							position : {top: 0, left: 0},
							content: $("#listPositions").html(),
							onBeforeShow: function() {},
							onShow: function() {
								var dlg = $(this);
								$.extend(dlg, {
									refresh: function() {
										$(".tablesorter tbody").empty();
										$.get(opts.calendar.allPosition, {}, function(ranks) {
											$.each(ranks, function(i, rank) {
												$("<tr pid=\""+ rank.id +"\"><td><span>"+ (i+1) +"</span></td><td><span>" +
													rank.name + "</span>" +
													"<div class=\"action\">" +
														"<div id=\"edit\">Edit</div>" + 
														"<div id=\"delete\">Delete</div>" + 
													"</div>" + 
												"</td</tr>").appendTo($(".tablesorter tbody"));
											});
										});
										
										$(dlg).css({
											top: ($(window).innerHeight() - $(dlg).outerHeight()) / 2,
											left: ($(window).innerWidth() - $(dlg).outerWidth()) / 2,
										});
									}
								})
								
								dlg.refresh();
								
								var idPosition = null;
								$(this).on("mouseenter", "tr", function() {
									$(this).addClass("hover");
								}).on("mouseleave", "tr", function() {
									$(this).removeClass("hover");
								}).on("click", "tr .action #delete", function() {
									var id = $(this).parents("tr").attr("pid");
									$.post(opts.calendar.deletePosition, {
										id: id,
									}, function() {
										dlg.refresh();
									});
								}).on("click", "tr .action #edit", function() {
									var tr = $(this).parents("tr");
									var tds = tr.find("td span");
									dlg.find("#name").val($(tds[1]).html()).focus();
									idPosition = tr.attr("pid");
								});
								//$(".tablesorter").tablesorter();
								
								$(this).find(".button").click(function() {
									$.post(opts.calendar.addPosition, {
										id: idPosition == null ? "" : idPosition,
										name: dlg.find("#name").val(),
										isUpdate: (idPosition != null) ? true : false,
									}, function() {
										dlg.find("#name").val('');
										idPosition = null;
										dlg.refresh();
									});
								});
							}, 
							onHide: function() {}
						});
					});
					
					var b = $(this);
					$(this).find("#btnAddUser").bind("click", function() {
						var params = {
							fullname: b.find("#lbFullname").val(),
							color: b.find("#lbColor").val(),
							position: position.id,
						};
						if(b.find("#lbUsername").val() != "") params["username"] = b.find("#lbUsername").val();
						if(b.find("#lbPassword").val() != "") params["password"] = b.find("#lbPassword").val();
						if(b.find("#lbNip").val() != "") params["nip"] = b.find("#lbNip").val();
						if(supervisor != null) params["supervisor"] = supervisor.id;
						if(rank != null) params["rank"] = rank.id;
						
						$.post(opts.calendar.addUser, params, function() {
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
			$("#bubble").bubble(ls, {
				content: $("#editEvent").html(),
				position: { top: -1, left: 0 },
				onBeforeShow: function() {
					$(this).css("position", "fixed").css("min-height", list.height()).css("width", "auto");
				},
				onShow: function(self, conf) {
					$(this).find("#lbCol").css("background-color", ls.find(".color").css("background-color")).html(ls.find(".color").html());
					$(this).find("#lbTitle").html(ls.find(".name").html());
					$("<div class=\"overlay\"></div>").css({
						"height": ls.outerHeight()-2,
						"width": ls.outerWidth()-3,
					}).appendTo(ls);
					$(this).css("left", $(window).outerWidth() - $(ls).outerWidth() - $(this).outerWidth());
					
					var dlg = $(this);
					/*$(this).on("click", ".collapsible .button", function() {
						console.log(self.trigger.parents())
						setTimeout(function() { 
							$(dlg).animate({left: $(window).outerWidth() - $(ls).outerWidth() - $(dlg).outerWidth()}, 
								"slow");
						}, 500)
					});*/
					
					/*var dp = dlg.find("#lbEventStart").pikaday({
						container: dlg.find("#calContainer")[0],
				        firstDay: 1,
				        onOpen: function() {
				        	
				        }, 
				        minDate: new Date('2000-01-01'),
				        maxDate: new Date('2020-12-31'),
				        yearRange: [2000,2020]
				    });
				    dp.pikaday('show');
				    //console.log($(dp.data("pikaday").el).children().get(0));
				    conf.children.push($($(dp.data("pikaday").el).children().get(0)));*/
					
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
					if(l + $(this).outerWidth() > $(window).width()) {
						var left = $(window).width() - list.outerWidth() - $(this).width();
						$(this).css("left", left);
					}
				}, 
				onShow: function() {
					var b = $(this);
					$(this).find("#btnAddEvent").bind("click", function() {
						$.post(opts.calendar.addEvent, {
							title: b.find("#lbTitle").val(),
						}, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							//refreshUserEvent();
							b.hide();
						});
					});
				},
				onHide: function() {
					ls.find(".overlay").remove();
				}
			});
		});
		
		$(".notifications").on("click", ".login", function() {
			var btn = $(this);
			$("#list").bubble(btn, {
				position : {top: 0, left: 0},
				content: $("#loginUser").html(),
				onBeforeShow: function() {},
				onShow: function() {
					var dlg = $(this);					
					dlg.find("#btnLogin").click(function() {
						$.post(opts.calendar.login, {
							username: dlg.find("#lbWho").val(),
							password: dlg.find("#lbPass").val(),
						}, function(success) {
							if(success) {
								dlg.find("#status").html("Login sukses. Halaman akan di-reload!").show();
								setTimeout( function() { location.reload(); }, 1000);
							}
						});
					});
					
					$(this).css({
						top: ($(window).innerHeight() - $(this).outerHeight()) / 2,
						left: ($(window).innerWidth() - $(this).outerWidth()) / 2,
					});
				}, 
				onHide: function() {}
			});
		}).on("click", ".logout", function() {
			$.post(opts.calendar.logout, {}, function(success) {
				if(success) {
					location.reload();
				}
			});
		});
		
		var chief = {};
		$("#settings").ready(function() {
			var dlg = $(this);
			$.get(opts.calendar.allSetting, {}, function(setting) {
				dlg.find("#lbInstitution").val(setting.institution);
				dlg.find("#lbChief").val(setting.chief.name);
				chief.id = setting.chief.id;
				dlg.find("#lbAddress").val(setting.address);
				dlg.find("#lbPhone").val(setting.phone);
				dlg.find("#lbFax").val(setting.fax);
				dlg.find("#lbWebsite").val(setting.website);
				dlg.find("#lbEmail").val(setting.email);
				dlg.find("#lbTlNoFormat").val(setting.tlNoFormat);
				dlg.find("#lbCapital").val(setting.capital);
			});
			
			$(this).find("#lbChief").autocomplete({
				source: function(request, response) {
					$.getJSON(opts.calendar.searchUser, {
							q: request.term
						}, function(data) {
							var evs = $.map(data, function(item) {
								return {
									label: item.name,
									id: item.id,
									value: item.name,
								}
							});
							
							response(evs);
						});
				}, 
				select: function( event, ui ) {
					chief = ui.item;
				}
			});
		}).on("click", "#btnSaveSetting", function() {
			var dlg = $("#settings");
			$.post(opts.calendar.saveSetting, {
				institution: dlg.find("#lbInstitution").val(),
				chief: chief.id,
				address: dlg.find("#lbAddress").val(),
				phone: dlg.find("#lbPhone").val(),
				fax: dlg.find("#lbFax").val(),
				website: dlg.find("#lbWebsite").val(),
				email: dlg.find("#lbEmail").val(),
				tlNoFormat: dlg.find("#lbTlNoFormat").val(),
				capital: dlg.find("#lbCapital").val(),
			}, function() {
				
			}).done(function() {
				dlg.find("#status").show().html("Tersimpan").delay(3000).hide("slow");
			}).fail(function() {
				dlg.find("#status").show().html("Gagal Tersimpan").delay(3000).hide("slow");
			});
		});
	});
});