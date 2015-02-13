package id.go.bps.calendar.controllers;

import id.go.bps.calendar.models.ASetting;
import id.go.bps.calendar.models.AUser;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.Dao.CreateOrUpdateStatus;
import com.j256.ormlite.table.TableUtils;

@Controller
@DependsOn(value={"CUser"})
@RequestMapping("/setting")
public class CSetting implements InitializingBean {
	@Autowired private Dao<AUser, Integer> userDao;
	@Autowired private Dao<ASetting, Integer> settingDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public void list(HttpServletResponse resp) throws SQLException, IOException {
		resp.setContentType("application/json");
		
		final ASetting setting = settingDao.queryBuilder().queryForFirst();
		Map<Object, Object> jSetting = new HashMap<Object, Object>();
		jSetting.put("institution", setting==null ? "" : setting.getInstitution());
		jSetting.put("chief", new HashMap<Object, Object>() {
			private static final long serialVersionUID = 1L;
			{
				put("id", setting==null ? "" : setting.getChief().getId());
				put("name", setting==null ? "" : setting.getChief().getFullname());
			}
		});
		jSetting.put("address", setting==null ? "" : setting.getAddress());
		jSetting.put("phone", setting==null ? "" : setting.getPhone());
		jSetting.put("fax", setting==null ? "" : setting.getFax());
		jSetting.put("website", setting==null ? "" : setting.getWebsite());
		jSetting.put("email", setting==null ? "" : setting.getEmail());
		jSetting.put("tlNoFormat", setting==null ? "" : setting.getTlNoFormat());
		jSetting.put("capital", setting==null ? "" : setting.getCapital());
		
		resp.getWriter().print(JSON.toString(jSetting));
	}
	
	@RequestMapping(value="/save", method = RequestMethod.POST)
	public void save(@RequestParam String institution, @RequestParam int chief, @RequestParam String address, 
			@RequestParam String phone, @RequestParam String fax, @RequestParam String website, 
			@RequestParam String email, @RequestParam String tlNoFormat, @RequestParam String capital, 
			HttpServletResponse resp) throws IOException, SQLException {
		resp.setContentType("application/json");
		if(settingDao.countOf() > 0) {
			ASetting setting = settingDao.queryBuilder().queryForFirst();
			setting.setInstitution(institution);
			setting.setChief(userDao.queryForId(chief));
			setting.setAddress(address);
			setting.setPhone(phone);
			setting.setFax(fax);
			setting.setWebsite(website);
			setting.setEmail(email);
			setting.setTlNoFormat(tlNoFormat);
			setting.setCapital(capital);
			resp.getWriter().print(settingDao.update(setting) > 0 ? true : false);
		} else {
			ASetting setting = new ASetting();
			setting.setInstitution(institution);
			setting.setChief(userDao.queryForId(chief));
			setting.setAddress(address);
			setting.setPhone(phone);
			setting.setFax(fax);
			setting.setWebsite(website);
			setting.setEmail(email);
			setting.setTlNoFormat(tlNoFormat);
			setting.setCapital(capital);
			CreateOrUpdateStatus state = settingDao.createOrUpdate(setting);
			resp.getWriter().print(state.isCreated() || state.isUpdated());
		}
	}

	public void afterPropertiesSet() throws Exception {
		if(! settingDao.isTableExists()) TableUtils.createTable(settingDao.getConnectionSource(), settingDao.getDataClass());
	}
}
