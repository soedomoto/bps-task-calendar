package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.AEvent;
import id.go.bps.calendar.models.ASetting;
import id.go.bps.calendar.models.ATask;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.time.DateUtils;
import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.stmt.QueryBuilder;
import com.j256.ormlite.table.TableUtils;
import com.lowagie.text.DocumentException;

@Controller
@RequestMapping("/event")
public class CEvent implements InitializingBean {
	@Autowired private ServletContext context;
	@Autowired private Dao<ASetting, Integer> settingDao;
	@Autowired private Dao<AEvent, Integer> eventDao;
	@Autowired private Dao<ATask, Integer> taskDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp) throws IOException, SQLException {
		List<HashMap<Object, Object>> aEvents = new ArrayList<HashMap<Object, Object>>();
		List<AEvent> events = eventDao.queryForAll();
		for(final AEvent event : events) {
			aEvents.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", event.getId());
				put("title", event.getTitle());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aEvents));
	}
	
	@RequestMapping(value="/{id}", method = RequestMethod.GET)
	public void get(@PathVariable int id) {
		
	}
	
	@RequestMapping(value="/search", method = RequestMethod.GET)
	public void search(@RequestParam String q, HttpServletResponse resp) throws SQLException, IOException {
		List<AEvent> events = eventDao.queryBuilder().where().like("title", "%" + q + "%").query();
		List<HashMap<Object, Object>> aEvents = new ArrayList<HashMap<Object, Object>>();
		for(final AEvent event : events) {
			aEvents.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", event.getId());
				put("title", event.getTitle());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aEvents));
	}
	
	@RequestMapping(value="/add", method = RequestMethod.POST)
	public void add(@RequestParam String title, HttpServletResponse resp) throws IOException, SQLException {
		AEvent event = new AEvent();
		event.setTitle(title);
		
		resp.setContentType("application/json");
		resp.getWriter().print(eventDao.createIfNotExists(event)!=null ? true : false);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam int id, HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		resp.getWriter().print(eventDao.deleteById(id));
	}
	
	@RequestMapping(value="/taskletter/{id}", method = RequestMethod.GET)
	public String createTaskLetter(Model model, @PathVariable int id) throws SQLException {
		final AEvent event = eventDao.queryForId(id);
		List<ATask> tasks = taskDao.queryForMatching(new ATask() {{
			setEvent(event);
		}});
		
		if(tasks.size() > 0) {
			Calendar c = Calendar.getInstance();
			c.setTime(taskDao.queryBuilder().orderBy("start", true).queryForFirst().getStart());
			int firstYear = c.get(Calendar.YEAR);
			c.setTime(taskDao.queryBuilder().orderBy("start", false).queryForFirst().getStart());
			int endYear = c.get(Calendar.YEAR);
			
			Map<Integer, Integer> firstIdInYears = new HashMap<Integer, Integer>();
			for(int y=firstYear; y<=endYear; y++) {
				QueryBuilder<ATask, Integer> qb = taskDao.queryBuilder();
				qb.orderBy("id", true).where()
					.between("start", new GregorianCalendar(y, Calendar.JANUARY, 1).getTime(), 
						new GregorianCalendar(y, Calendar.DECEMBER, 31).getTime());
				
				ATask t = qb.queryForFirst();
				if(t!=null) firstIdInYears.put(y, t.getId());
			}
			
			for(ATask t : tasks) {
				int y = DateUtils.toCalendar(t.getStart()).get(Calendar.YEAR);
				int fId = firstIdInYears.get(y);
				t.setTaskNumber(t.getId() - fId + 1);
			}
		}
		
		model.addAttribute("tasks", tasks);
		model.addAttribute("setting", settingDao.queryBuilder().queryForFirst());
		
		return "TaskLetter";
	}
	
	@RequestMapping(value="/taskletter/{id}/pdf", method = RequestMethod.GET)
	public void createTaskLetterPdf(Model model, @PathVariable int id, HttpServletRequest req, HttpServletResponse resp) 
			throws IOException, DocumentException {
		String baseUrl = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath();
		
		ITextRenderer renderer = new ITextRenderer();
		renderer.setDocument(baseUrl + "/event/taskletter/" + id);
		renderer.layout();
        renderer.createPDF(resp.getOutputStream());
	}

	public void afterPropertiesSet() throws Exception {
		if(! eventDao.isTableExists()) TableUtils.createTable(eventDao.getConnectionSource(), eventDao.getDataClass());
	}
}
