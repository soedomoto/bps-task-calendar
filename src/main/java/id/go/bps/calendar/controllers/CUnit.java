package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.AUnit;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.Dao.CreateOrUpdateStatus;
import com.j256.ormlite.table.TableUtils;

@Controller
@RequestMapping("/unit")
public class CUnit implements InitializingBean {
	@Autowired private Dao<AUnit, Integer> unitDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp) throws IOException, SQLException {
		List<HashMap<Object, Object>> aUnits = new ArrayList<HashMap<Object, Object>>();
		List<AUnit> units = unitDao.queryForAll();
		for(final AUnit unit : units) {
			aUnits.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", unit.getId());
				put("name", unit.getName());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aUnits));
	}
	
	@RequestMapping(value="/search", method = RequestMethod.GET)
	public void search(@RequestParam String q, HttpServletResponse resp) throws SQLException, IOException {
		List<AUnit> positions = unitDao.queryBuilder().where().like("name", "%" + q + "%").query();
		List<HashMap<Object, Object>> aEvents = new ArrayList<HashMap<Object, Object>>();
		for(final AUnit position : positions) {
			aEvents.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", position.getId());
				put("value", position.getName());
				put("label", position.getName());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aEvents));
	}
	
	@RequestMapping(value="/addEdit", method = RequestMethod.POST)
	public void addEdit(@RequestParam(required=false) Integer id, @RequestParam String name, @RequestParam(defaultValue="false") boolean isUpdate, HttpServletResponse resp) throws IOException, SQLException {
		AUnit rank;
		if(!isUpdate) {
			rank = new AUnit();
			rank.setName(name);
		} else {
			rank = unitDao.queryForId(id);
			rank.setName(name);
		}
		
		CreateOrUpdateStatus res = unitDao.createOrUpdate(rank);
		
		resp.setContentType("application/json");
		resp.getWriter().print(res.isCreated() || res.isUpdated() ? true : false);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam int id, HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		resp.getWriter().print(unitDao.deleteById(id));
	}

	public void afterPropertiesSet() throws Exception {
		if(! unitDao.isTableExists()) TableUtils.createTable(unitDao.getConnectionSource(), unitDao.getDataClass());
	}
}
