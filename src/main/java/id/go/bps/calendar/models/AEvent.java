package id.go.bps.calendar.models;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="event")
public class AEvent {
	@DatabaseField(generatedId=true)
	int id;
	@DatabaseField(canBeNull=false)
	String title;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
}
