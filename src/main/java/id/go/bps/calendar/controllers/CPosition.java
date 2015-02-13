package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.APosition;

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
@RequestMapping("/position")
public class CPosition implements InitializingBean {
	@Autowired private Dao<APosition, Integer> positionDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp) throws IOException, SQLException {
		List<HashMap<Object, Object>> aRanks = new ArrayList<HashMap<Object, Object>>();
		List<APosition> ranks = positionDao.queryForAll();
		for(final APosition rank : ranks) {
			aRanks.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", rank.getId());
				put("name", rank.getName());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aRanks));
	}
	
	@RequestMapping(value="/search", method = RequestMethod.GET)
	public void search(@RequestParam String q, HttpServletResponse resp) throws SQLException, IOException {
		List<APosition> positions = positionDao.queryBuilder().where().like("name", "%" + q + "%").query();
		List<HashMap<Object, Object>> aEvents = new ArrayList<HashMap<Object, Object>>();
		for(final APosition position : positions) {
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
		APosition rank;
		if(!isUpdate) {
			rank = new APosition();
			rank.setName(name);
		} else {
			rank = positionDao.queryForId(id);
			rank.setName(name);
		}
		
		CreateOrUpdateStatus res = positionDao.createOrUpdate(rank);
		
		resp.setContentType("application/json");
		resp.getWriter().print(res.isCreated() || res.isUpdated() ? true : false);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam int id, HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		resp.getWriter().print(positionDao.deleteById(id));
	}

	public void afterPropertiesSet() throws Exception {
		if(! positionDao.isTableExists()) TableUtils.createTable(positionDao.getConnectionSource(), positionDao.getDataClass());
	}

}
