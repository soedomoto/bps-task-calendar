package id.go.bps.calendar.models;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.apache.commons.lang.time.DateUtils;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="task")
public class ATask {
	@DatabaseField(generatedId=true)
	int id;
	@DatabaseField(canBeNull=false, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="integer references event(id) on delete cascade")
	AEvent event;
	@DatabaseField(canBeNull=false)
	Date start;
	@DatabaseField(canBeNull=true)
	Date end;
	@DatabaseField(canBeNull=false)
	boolean allDay;
	@DatabaseField(canBeNull=false)
	boolean editable;
	@DatabaseField(canBeNull=false)
	String where;
	@DatabaseField(canBeNull=false, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="integer references user(id) on delete cascade")
	AUser user;
	@DatabaseField(canBeNull=true)
	Integer target;
	@DatabaseField(canBeNull=true)
	Integer realization;
	@DatabaseField(canBeNull=true, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="integer references unit(id) on delete cascade")
	AUnit unit;
	
	//	Non database field
	int taskNumber;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTaskNumber() {
		return taskNumber;
	}
	public void setTaskNumber(int taskNumber) {
		this.taskNumber = taskNumber;
	}
	public AEvent getEvent() {
		return event;
	}
	public void setEvent(AEvent event) {
		this.event = event;
	}
	public Date getStart() {
		return start;
	}
	public void setStart(Date start) {
		this.start = start;
	}
	public Date getEnd() {
		return end;
	}
	public void setEnd(Date end) {
		this.end = end;
	}
	public boolean isAllDay() {
		return allDay;
	}
	public void setAllDay(boolean allDay) {
		this.allDay = allDay;
	}
	public boolean isEditable() {
		return editable;
	}
	public void setEditable(boolean editable) {
		this.editable = editable;
	}
	public String getWhere() {
		return where;
	}
	public void setWhere(String where) {
		this.where = where;
	}
	public AUser getUser() {
		return user;
	}
	public void setUser(AUser user) {
		this.user = user;
	}
	public Integer getTarget() {
		return target;
	}
	public void setTarget(Integer target) {
		this.target = target;
	}
	public Integer getRealization() {
		return realization;
	}
	public void setRealization(Integer realization) {
		this.realization = realization;
	}
	public AUnit getUnit() {
		return unit;
	}
	public void setUnit(AUnit unit) {
		this.unit = unit;
	}
	public String getDateString() {
		Calendar s = Calendar.getInstance();
		Calendar e = Calendar.getInstance();
		
		s.setTime(start);
		if(end != null) {
			e.setTime(DateUtils.addSeconds(end, -1));
		} else {
			e.setTime(start);
		}
		
		boolean isSameMonth = s.get(Calendar.MONTH) == e.get(Calendar.MONTH);
		boolean isSameYear = s.get(Calendar.YEAR) == e.get(Calendar.YEAR);
		
		Locale id = new Locale("id", "ID");	
		
		String str = "";
		if(! DateUtils.isSameDay(s, e)) {
			if (isSameMonth && isSameYear) {
				str += (new SimpleDateFormat("d", id)).format(s.getTime());
			} else if (isSameYear) {
				str += (new SimpleDateFormat("d MMMM", id)).format(s.getTime());
			} else {
				str += (new SimpleDateFormat("d MMMM yyyy", id)).format(s.getTime());
			}
			str += " - ";
		}
		str += (new SimpleDateFormat("d MMMM yyyy", id)).format(e.getTime());
		
		return str;
	}
	public int getDaysBetween() {
		Calendar s = DateUtils.toCalendar(start);
		Calendar e = end != null ? DateUtils.toCalendar(end) : DateUtils.toCalendar(start);
		
		if(DateUtils.isSameDay(s, e)) {
			return 1;
		} else {
			return (int) ((e.getTimeInMillis() - s.getTimeInMillis()) / (1000*60*60*24));
		}
	}
}
