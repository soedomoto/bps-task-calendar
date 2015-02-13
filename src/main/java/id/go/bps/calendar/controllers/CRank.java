package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.ARank;

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
@RequestMapping("/rank")
public class CRank implements InitializingBean {
	@Autowired private Dao<ARank, String> rankDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp) throws IOException, SQLException {
		List<HashMap<Object, Object>> aRanks = new ArrayList<HashMap<Object, Object>>();
		List<ARank> ranks = rankDao.queryForAll();
		for(final ARank rank : ranks) {
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
		List<ARank> ranks = rankDao.queryBuilder().where().like("id", "%" + q + "%").or().like("name", "%" + q + "%").query();
		List<HashMap<Object, Object>> aEvents = new ArrayList<HashMap<Object, Object>>();
		for(final ARank rank : ranks) {
			aEvents.add(new HashMap<Object, Object>() {
				private static final long serialVersionUID = 1L;
			{
				put("id", rank.getId());
				put("value", rank.getName());
				put("label", "(" + rank.getId() + ") " + rank.getName());
			}});
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(JSON.toString(aEvents));
	}
	
	@RequestMapping(value="/addEdit", method = RequestMethod.POST)
	public void add(@RequestParam String id, @RequestParam String name, @RequestParam(defaultValue="false") boolean isUpdate, HttpServletResponse resp) throws IOException, SQLException {
		ARank rank;
		if(!isUpdate) {
			rank = new ARank();
			rank.setId(id);
			rank.setName(name);
		} else {
			rank = rankDao.queryForId(id);
			rank.setName(name);
		}
		
		CreateOrUpdateStatus res = rankDao.createOrUpdate(rank);
		
		resp.setContentType("application/json");
		resp.getWriter().print(res.isCreated() || res.isUpdated() ? true : false);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public void delete(@RequestParam String id, HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		resp.getWriter().print(rankDao.deleteById(id));
	}

	public void afterPropertiesSet() throws Exception {
		if(! rankDao.isTableExists()) TableUtils.createTable(rankDao.getConnectionSource(), rankDao.getDataClass());
	}

}
