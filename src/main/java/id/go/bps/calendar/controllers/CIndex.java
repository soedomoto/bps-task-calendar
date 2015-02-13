package id.go.bps.calendar.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class CIndex {
	@Autowired private ServletContext context;
	
	@RequestMapping(method = RequestMethod.GET)
	public String index(Model model, HttpServletRequest req, HttpServletResponse resp) {
		final Map<Object, Object> opts = new HashMap<Object, Object>();
		opts.put("editable", true);
		opts.put("selectable", false);
		opts.put("theme", false);
		opts.put("themeName", "redmond");
		opts.put("firstDay", 1);
		opts.put("timeFormat", "H(:mm)");
		opts.put("header", new HashMap<Object, Object>() {
			private static final long serialVersionUID = 1L;
		{
			put("left", "prev,next today");
			put("center", "title");
			put("right", "month");
		}});
		opts.put("defaultView", "month");
		opts.put("buttonText", new HashMap<Object, Object>() {
			private static final long serialVersionUID = 1L;
		{
			put("today", "today");
			put("month", "month");
			put("week", "week");
			put("day", "day");
		}});
		opts.put("monthNames", new String[] {
				"Januari", "Februari", "Maret", 
				"April", "Mei", "Juni", "Juli", 
				"Agustus", "September", "Oktober", 
				"November", "Desember"
		});
		opts.put("monthNamesShort", new String[] {
				"Jan", "Feb", "Mar", "Apr", 
				"Mei", "Jun", "Jul", "Ags", "Sep", 
				"Okt", "Nov", "Des"
		});
		opts.put("dayNames", new String[] {
				"Minggu", "Senin", "Selasa", 
				"Rabu", "Kamis", "Jumat", "Sabtu"
		});
		opts.put("dayNamesShort", new String[] {
				"Minggu", "Senin", "Selasa", 
				"Rabu", "Kamis", "Jumat", "Sabtu"
		});
		opts.put("allDayText", "Sepanjang Hari");
		opts.put("axisFormat", "HH(:mm)");
		opts.put("slotMinutes", 30);
		opts.put("firstHour", "8");
		opts.put("minTime", "7:30");
		opts.put("maxTime", "21:00");
		opts.put("cronPeriod", 60);
		opts.put("eventsUrl", "/task");
		opts.put("addUrl", "/task/add");
		opts.put("editUrl", "/task/edit");
		opts.put("deleteUrl", "/task/delete");
		opts.put("moveUrl", "/task/move");
		opts.put("resizeUrl", "/task/resize");
		opts.put("addUser", "/user/addEdit");
		opts.put("editUser", "/user/addEdit");
		opts.put("delUser", "/user/delete");
		opts.put("getUser", "/user");
		opts.put("login", "/user/login");
		opts.put("logout", "/user/logout");
		opts.put("allUser", "/user");
		opts.put("searchUser", "/user/search");
		opts.put("addEvent", "/event/add");
		opts.put("delEvent", "/event/delete");
		opts.put("allEvent", "/event");
		opts.put("searchEvent", "/event/search");
		opts.put("allRank", "/rank");
		opts.put("searchRank", "/rank/search");
		opts.put("addRank", "/rank/addEdit");
		opts.put("editRank", "/rank/addEdit");
		opts.put("deleteRank", "/rank/delete");
		opts.put("allPosition", "/position");
		opts.put("searchPosition", "/position/search");
		opts.put("addPosition", "/position/addEdit");
		opts.put("editPosition", "/position/addEdit");
		opts.put("deletePosition", "/position/delete");
		opts.put("allSetting", "/setting");
		opts.put("saveSetting", "/setting/save");
		opts.put("allUnit", "/unit");
		opts.put("addUnit", "/unit/addEdit");
		opts.put("editUnit", "/unit/addEdit");
		opts.put("deleteUnit", "/unit/delete");
		
		String strOpts = JSON.toString(new HashMap<Object, Object>() {
			private static final long serialVersionUID = 1L;
		{
			put("baseUrl", "/");
			put("calendar", opts);
		}});
		
		model.addAttribute("opts", strOpts);
		
		return "Index";
	}
	
}
