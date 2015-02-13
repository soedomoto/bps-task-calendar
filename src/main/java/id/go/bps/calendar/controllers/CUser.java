package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.APosition;
import id.go.bps.calendar.models.ARank;
import id.go.bps.calendar.models.ASetting;
import id.go.bps.calendar.models.ATask;
import id.go.bps.calendar.models.AUser;
import id.go.bps.calendar.utils.ColorUtil;

import java.awt.Color;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.time.DateUtils;
import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.j256.ormlite.dao.BaseDaoImpl;
import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.Dao.CreateOrUpdateStatus;
import com.j256.ormlite.stmt.QueryBuilder;
import com.j256.ormlite.stmt.Where;
import com.j256.ormlite.table.TableInfo;
import com.j256.ormlite.table.TableUtils;
import com.lowagie.text.DocumentException;

@Controller
@DependsOn(value={"CRank","CPosition"})
@RequestMapping("/user")
public class CUser implements InitializingBean {
	@Autowired private ServletContext context;
	@Autowired private Dao<ASetting, Integer> settingDao;
	@Autowired private Dao<ATask, Integer> taskDao;
	@Autowired private Dao<AUser, Integer> userDao;
	@Autowired private Dao<APosition, Integer> positionDao;
	@Autowired private Dao<ARank, String> rankDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp, HttpSession session) throws IOException, SQLException {
		final AUser aUser = (AUser) session.getAttribute("user");
		
		List<HashMap<Object, Object>> aUsers = new ArrayList<HashMap<Object, Object>>();
		List<AUser> users = userDao.queryForAll();
		for(final AUser user : users) {
			aUsers.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
				Map<Object, Object> thus = this;
			{
				put("id", user.getId());
				put("fullname", user.getFullname());
				
				if(aUser != null) {
					if(user.getId() == aUser.getId()) {
						thus.put("color", user.getColor());
					} else {
						thus.put("color", ColorUtil.encode(new Color(188, 188, 188)));
					}
				} else {
					thus.put("color", user.getColor());
				}
				
				//put("color", aUser!=null ? ColorUtil.encode(new Color(188, 188, 188)) : user.getColor());
				put("nip", user.getNip());
				put("rank", new HashMap<Object, Object>() {
					private static final long serialVersionUID = 1L;
					{
						put("id", user.getRank()==null? "" : user.getRank().getId());
						put("name", user.getRank()==null? "" : user.getRank().getName());
					}
				});
				put("position", new HashMap<Object, Object>() {
					private static final long serialVersionUID = 1L;
					{
						put("id", user.getPosition()==null? "" : user.getPosition().getId());
						put("name", user.getPosition()==null? "" : user.getPosition().getName());
					}
				});
				put("supervisor", new HashMap<Object, Object>() {
					private static final long serialVersionUID = 1L;
					{
						put("id", user.getSupervisor()==null? "" : user.getSupervisor().getId());
						put("fullname", user.getSupervisor()==null? "" : user.getSupervisor().getFullname());
					}
				});
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aUsers));
	}
	
	@RequestMapping(value="/{id}", method = RequestMethod.GET)
	public void get(@PathVariable int id) {
		
	}
	
	@RequestMapping(value="/search", method = RequestMethod.GET)
	public void search(@RequestParam String q, HttpServletResponse resp) throws SQLException, IOException {
		List<AUser> users = userDao.queryBuilder().where().like("fullname", "%" + q + "%").query();
		List<HashMap<Object, Object>> aUsers = new ArrayList<HashMap<Object, Object>>();
		for(final AUser user : users) {
			aUsers.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", user.getId());
				put("name", user.getFullname());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aUsers));
	}
	
	@RequestMapping(value="/addEdit", method = RequestMethod.POST)
	public void addEdit(@RequestParam(required=false) String username, @RequestParam(required=false) String password, 
			@RequestParam String fullname, @RequestParam String color, @RequestParam(required=false) String nip, 
			@RequestParam(required=false) String rank, @RequestParam int position, @RequestParam(required=false) Integer supervisor, 
			@RequestParam(required=false) Integer id, HttpServletResponse resp) 
			throws SQLException, IOException {
		AUser user;
		if(id == null) {
			user = new AUser();
		} else {
			user = userDao.queryForId(id);
		}
		
		if(username != null) user.setUsername(username);
		if(password != null) user.setPassword(password);
		user.setFullname(fullname);
		user.setColor(color);
		if(nip != null) user.setNip(nip);
		if(rank != null) user.setRank(rankDao.queryForId(rank));
		if(supervisor != null) user.setSupervisor(userDao.queryForId(supervisor));
		user.setPosition(positionDao.queryForId(position));
		
		CreateOrUpdateStatus stat = userDao.createOrUpdate(user);
		
		resp.setContentType("application/json");
		resp.getWriter().print(stat.isCreated() || stat.isUpdated() ? true : false);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam int id, HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		resp.getWriter().print(userDao.deleteById(id));
	}
	
	@RequestMapping(value="/login", method = RequestMethod.POST)
	public void login(@RequestParam String username, @RequestParam String password, HttpServletResponse resp, 
			HttpSession session) throws SQLException, IOException {
		AUser user = userDao.queryBuilder().where().eq("username", username).queryForFirst();
		session.setAttribute("user", user);
		
		resp.setContentType("application/json");
		resp.getWriter().print(user==null ? false : true);
	}
	
	@RequestMapping(value="/logout", method = RequestMethod.POST)
	public void logout(HttpServletResponse resp, HttpSession session) throws IOException {
		session.setAttribute("user", null);
		
		resp.setContentType("application/json");
		resp.getWriter().print(session.getAttribute("user")==null ? true : false);
	}
	
	@RequestMapping(value="/taskletter/{id}", method = RequestMethod.GET)
	public String createTaskLetter(Model model, @PathVariable int id) throws SQLException {
		final AUser user = userDao.queryForId(id);
		List<ATask> tasks = taskDao.queryForMatching(new ATask() {{
			setUser(user);
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
				Integer fId = firstIdInYears.get(y);
				t.setTaskNumber(t.getId() - (fId==null?0:fId) + 1);
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
		renderer.setDocument(baseUrl + "/user/taskletter/" + id);
		renderer.layout();
        renderer.createPDF(resp.getOutputStream());
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/ckpt/{id}", method = RequestMethod.GET)
	public String createCkpt(Model model, @PathVariable int id) throws SQLException {
		Integer firstYear = null, endYear = null;
		if(taskDao.countOf() > 0) {
			Calendar c = Calendar.getInstance();
			c.setTime(taskDao.queryBuilder().orderBy("start", true).queryForFirst().getStart());
			firstYear = c.get(Calendar.YEAR);
			c.setTime(taskDao.queryBuilder().orderBy("start", false).queryForFirst().getStart());
			endYear = c.get(Calendar.YEAR);
		}
		if(firstYear == null) firstYear = Calendar.getInstance().get(Calendar.YEAR);
		if(endYear == null) endYear = firstYear;
		
		final Map<Object, Object> aTasks = new HashMap<Object, Object>();
		final AUser user = userDao.queryForId(id);
		for(int y = firstYear; y <= endYear; y++) {
			final Map<Object, Object> mTasks = new HashMap<Object, Object>();
			for(int m = Calendar.JANUARY; m <= Calendar.DECEMBER; m++) {
				Calendar cal = Calendar.getInstance();
				cal.set(Calendar.YEAR, y);
				cal.set(Calendar.MONTH, m);
				cal.set(Calendar.DATE, 1);
				Date f = cal.getTime();
				cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
				Date l = cal.getTime();
				
				QueryBuilder<ATask, Integer> qb = taskDao.queryBuilder();
				Where<ATask, Integer> where = qb.where();				
				where.or(
					where.eq("user_id", user).and().isNotNull("end").and().between("end", f, l), 
					where.eq("user_id", user).and().isNull("end").and().between("start", f, l)
				);
				
				mTasks.put(m, qb.query());
			}
			aTasks.put(y, mTasks);
		}
		
		model.addAttribute("tasks", aTasks);
		model.addAttribute("user", user);
		model.addAttribute("setting", settingDao.queryBuilder().queryForFirst());
		
		return "CKPT";
	}
	
	@RequestMapping(value="/ckpt/{id}/pdf", method = RequestMethod.GET)
	public void createCkptPdf(Model model, @PathVariable int id, HttpServletRequest req, HttpServletResponse resp) 
			throws IOException, DocumentException {
		String baseUrl = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath();
		
		ITextRenderer renderer = new ITextRenderer();
		renderer.setDocument(baseUrl + "/user/ckpt/" + id);
		renderer.layout();
        renderer.createPDF(resp.getOutputStream());
	}

	public void afterPropertiesSet() throws Exception {
		if(! userDao.isTableExists()) TableUtils.createTable(userDao.getConnectionSource(), userDao.getDataClass());
		else {
			TableInfo<AUser, Integer> info = ((BaseDaoImpl<AUser, Integer>) userDao).getTableInfo();
			userDao.executeRaw("ALTER TABLE " + info.getTableName() + " ADD IF NOT EXISTS supervisor_id INTEGER DEFAULT NULL");
		}
	}
}
