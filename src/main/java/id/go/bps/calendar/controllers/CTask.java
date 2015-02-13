package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.AEvent;
import id.go.bps.calendar.models.ATask;
import id.go.bps.calendar.models.AUnit;
import id.go.bps.calendar.models.AUser;
import id.go.bps.calendar.utils.ColorUtil;

import java.awt.Color;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.j256.ormlite.dao.BaseDaoImpl;
import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.Dao.CreateOrUpdateStatus;
import com.j256.ormlite.table.TableInfo;
import com.j256.ormlite.table.TableUtils;

@Controller("taskController")
@DependsOn(value={"CUser","CEvent","CUnit"})
@RequestMapping("/task")
public class CTask implements InitializingBean {
	@Autowired private ServletContext context;
	@Autowired private Dao<ATask, Integer> taskDao;
	@Autowired private Dao<AUser, Integer> userDao;
	@Autowired private Dao<AEvent, Integer> eventDao;
	@Autowired private Dao<AUnit, Integer> unitDao;
	
	private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp, HttpSession session) throws IOException, SQLException {
		final AUser aUser = (AUser) session.getAttribute("user");
		
		List<Map<String, Object>> aTasks = new ArrayList<Map<String, Object>>();
		for(ATask task : taskDao.queryForAll()) {
			Map<String, Object> aTask = new HashMap<String, Object>();
			aTask.put("eId", task.getEvent().getId());
			aTask.put("user_id", task.getUser().getId());
			aTask.put("id", task.getId());
			aTask.put("start", simpleDateFormat.format(task.getStart()));
			aTask.put("end", task.getEnd()==null ? null : simpleDateFormat.format(task.getEnd()));
			aTask.put("allDay", task.isAllDay());
			aTask.put("where", task.getWhere());
			aTask.put("editable", task.isEditable());
			aTask.put("title", task.getEvent().getTitle());
			aTask.put("fullname", task.getUser().getFullname());
			aTask.put("target", task.getTarget()==null?"" : task.getTarget());
			aTask.put("realization", task.getRealization()==null ? "" : task.getRealization());
			aTask.put("unit", task.getUnit()==null ? -1 : task.getUnit().getId());
			
			if(aUser != null) {
				if(task.getUser().getId() == aUser.getId()) {
					aTask.put("color", task.getUser().getColor());
				} else {
					aTask.put("color", ColorUtil.encode(new Color(188, 188, 188)));
				}
			} else {
				aTask.put("color", task.getUser().getColor());
			}
			
			aTasks.add(aTask);
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aTasks));
	}
	
	@RequestMapping(value="/add", method = RequestMethod.POST)
	public void add(@RequestParam int event_id, @RequestParam String where, @RequestParam String start, 
			@RequestParam(value = "users[]") Integer[] users, @RequestParam(required=false) Integer target, 
			@RequestParam(required=false) Integer realization, @RequestParam(required=false) Integer unit, 
			HttpServletResponse resp) throws SQLException, IOException, ParseException {
		boolean allSuccess = true;
		for(int uid : users) {
			ATask task = new ATask();
			task.setAllDay(true);		// default
			task.setEditable(true);		// default
			task.setEnd(null);			// default
			task.setStart(simpleDateFormat.parse(start));
			task.setWhere(where);
			task.setUser(userDao.queryForId(uid));
			task.setEvent(eventDao.queryForId(event_id));
			if(target != null) task.setTarget(target);
			if(realization != null) task.setRealization(realization);
			if(unit != null) task.setUnit(unitDao.queryForId(unit));
			
			CreateOrUpdateStatus res = taskDao.createOrUpdate(task);
			allSuccess = allSuccess && (res.isCreated() || res.isUpdated());
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(allSuccess);
	}
	
	@RequestMapping(value="/edit", method = RequestMethod.POST)
	public void edit(@RequestParam int id, @RequestParam(required=false) Integer event_id, @RequestParam(required=false) String start, 
			@RequestParam(required=false) String end, @RequestParam(required=false) Boolean allDay, 
			@RequestParam(required=false) Boolean editable, @RequestParam(required=false) String where, 
			@RequestParam(required=false) Integer user, @RequestParam(required=false) Integer target, 
			@RequestParam(required=false) Integer realization, @RequestParam(required=false) Integer unit, 
			HttpServletResponse resp) throws SQLException, IOException, ParseException {
		ATask task = taskDao.queryForId(id);
		if(event_id != null) task.setEvent(eventDao.queryForId(event_id));
		if(start != null) task.setStart(simpleDateFormat.parse(start));
		if(end != null) task.setEnd(simpleDateFormat.parse(end));
		if(allDay != null) task.setAllDay(allDay);
		if(editable != null) task.setEditable(editable);
		if(where != null) task.setWhere(where);
		if(user != null) task.setUser(userDao.queryForId(user));
		if(target != null) task.setTarget(target);
		if(realization != null) task.setRealization(realization);
		if(unit != null) task.setUnit(unitDao.queryForId(unit));
		
		CreateOrUpdateStatus res = taskDao.createOrUpdate(task);
		
		resp.setContentType("application/json");
		resp.getWriter().print(res.isCreated() || res.isUpdated());
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam int id, HttpServletResponse resp) throws SQLException, IOException {
		resp.setContentType("application/json");
		resp.getWriter().print(taskDao.deleteById(id));
	}
	
	@RequestMapping(value="/move", method = RequestMethod.POST)
	public void move(@RequestParam String start, @RequestParam String end, @RequestParam int eventId, 
			HttpServletResponse resp) throws SQLException, ParseException, IOException {
		moveResize(start, end, eventId, resp);
	}
	
	@RequestMapping(value="/resize", method = RequestMethod.POST)
	public void moveResize(@RequestParam String start, @RequestParam String end, @RequestParam int eventId, 
			HttpServletResponse resp) throws SQLException, ParseException, IOException {
		ATask task = taskDao.queryForId(eventId);
		task.setStart(start==null || start.equalsIgnoreCase("null") ? null : simpleDateFormat.parse(start));
		task.setEnd(end==null || end.equalsIgnoreCase("null") ? null : simpleDateFormat.parse(end));
		
		CreateOrUpdateStatus res = taskDao.createOrUpdate(task);
		resp.setContentType("application/json");
		resp.getWriter().print(res.isCreated() || res.isUpdated());
	}

	public void afterPropertiesSet() throws Exception {
		if(! taskDao.isTableExists()) TableUtils.createTable(taskDao.getConnectionSource(), taskDao.getDataClass());
		else {
			TableInfo<ATask, Integer> info = ((BaseDaoImpl<ATask, Integer>) taskDao).getTableInfo();
			taskDao.executeRaw("ALTER TABLE " + info.getTableName() + " ADD IF NOT EXISTS target INTEGER DEFAULT NULL");
			taskDao.executeRaw("ALTER TABLE " + info.getTableName() + " ADD IF NOT EXISTS realization INTEGER DEFAULT NULL");
			taskDao.executeRaw("ALTER TABLE " + info.getTableName() + " ADD IF NOT EXISTS unit_id INTEGER DEFAULT NULL");
		}
	}
}
