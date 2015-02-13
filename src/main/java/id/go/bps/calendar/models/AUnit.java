package id.go.bps.calendar.models;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="unit")
public class AUnit {
	@DatabaseField(generatedId=true)
	int id;
	//	Example	: Hari, Kegiatan, Lembar, Publikasi
	@DatabaseField(canBeNull=false)
	String name;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
