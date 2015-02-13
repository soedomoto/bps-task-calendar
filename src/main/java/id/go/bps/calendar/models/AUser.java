package id.go.bps.calendar.models;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="user")
public class AUser {
	@DatabaseField(generatedId=true)
	Integer id;
	@DatabaseField(canBeNull=true)
	String username;
	@DatabaseField(canBeNull=true)
	String password;
	@DatabaseField(canBeNull=false)
	String fullname;
	@DatabaseField(canBeNull=true)
	String nip;
	@DatabaseField(canBeNull=false)
	String color;
	@DatabaseField(canBeNull=true, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="varchar references rank(id) on delete cascade")
	ARank rank;
	@DatabaseField(canBeNull=false, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="integer references position(id) on delete cascade")
	APosition position;
	@DatabaseField(canBeNull=true, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true)
	AUser supervisor;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getFullname() {
		return fullname;
	}
	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getNip() {
		return nip;
	}
	public String getFormattedNip() {
		if(nip == null) return "-";
		
		String plainNip = nip.replace(" ", "");
		return plainNip.substring(0, 8) + " " + plainNip.substring(8, 14) + " " + 
				plainNip.substring(14, 15) + " " + plainNip.substring(15);
	}
	public void setNip(String nip) {
		this.nip = nip;
	}
	public ARank getRank() {
		return rank;
	}
	public void setRank(ARank rank) {
		this.rank = rank;
	}
	public APosition getPosition() {
		return position;
	}
	public void setPosition(APosition position) {
		this.position = position;
	}
	public AUser getSupervisor() {
		return supervisor;
	}
	public void setSupervisor(AUser supervisor) {
		this.supervisor = supervisor;
	}
}
