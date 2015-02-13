package id.go.bps.calendar.config;

import id.go.bps.calendar.models.AEvent;
import id.go.bps.calendar.models.APosition;
import id.go.bps.calendar.models.ARank;
import id.go.bps.calendar.models.ASetting;
import id.go.bps.calendar.models.ATask;
import id.go.bps.calendar.models.AUnit;
import id.go.bps.calendar.models.AUser;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.jdbc.JdbcConnectionSource;
import com.j256.ormlite.spring.DaoFactory;

@Configuration
public class ModelConfig {
	@Autowired
	JdbcConnectionSource conn;
	
	@Bean(name = "rankDao")
	public Dao<ARank, Object> rankDao() throws SQLException {
		return DaoFactory.createDao(conn, ARank.class);
	}
	
	@Bean(name = "positionDao")
	public Dao<APosition, Object> positionDao() throws SQLException {
		return DaoFactory.createDao(conn, APosition.class);
	}
	
	@Bean(name = "userDao")
	public Dao<AUser, Object> userDao() throws SQLException {
		return DaoFactory.createDao(conn, AUser.class);
	}
	
	@Bean(name = "eventDao")
	public Dao<AEvent, Object> eventDao() throws SQLException {
		return DaoFactory.createDao(conn, AEvent.class);
	}
	
	@Bean(name = "unitDao")
	public Dao<AUnit, Object> unitDao() throws SQLException {
		return DaoFactory.createDao(conn, AUnit.class);
	}
	
	@Bean(name = "taskDao")
	public Dao<ATask, Object> taskDao() throws SQLException {
		return DaoFactory.createDao(conn, ATask.class);
	}
	
	@Bean(name = "settingDao")
	public Dao<ASetting, Object> settingDao() throws SQLException {
		return DaoFactory.createDao(conn, ASetting.class);
	}
}
