package id.go.bps.calendar.models;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="rank")
public class ARank {
	//	Example : III/a
	@DatabaseField(id=true)
	String id;
	//	Example	: Penata Muda
	@DatabaseField(canBeNull=false)
	String name;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
