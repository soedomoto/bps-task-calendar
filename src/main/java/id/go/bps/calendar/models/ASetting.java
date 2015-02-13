package id.go.bps.calendar.models;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName="setting")
public class ASetting {
	@DatabaseField(generatedId=true)
	int id;
	@DatabaseField
	String institution; 
	@DatabaseField(canBeNull=true, foreign=true, foreignAutoCreate=true, foreignAutoRefresh=true, 
			columnDefinition="varchar references user(id) on delete cascade")
	AUser chief;
	@DatabaseField
	String address; 
	@DatabaseField
	String phone; 
	@DatabaseField
	String fax; 
	@DatabaseField
	String website; 
	@DatabaseField
	String email; 
	@DatabaseField
	String tlNoFormat; 
	@DatabaseField
	String capital;
	
	public String getInstitution() {
		return institution;
	}
	public void setInstitution(String institution) {
		this.institution = institution;
	}
	public AUser getChief() {
		return chief;
	}
	public void setChief(AUser chief) {
		this.chief = chief;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getFax() {
		return fax;
	}
	public void setFax(String fax) {
		this.fax = fax;
	}
	public String getWebsite() {
		return website;
	}
	public void setWebsite(String website) {
		this.website = website;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTlNoFormat() {
		return tlNoFormat;
	}
	public void setTlNoFormat(String tlNoFormat) {
		this.tlNoFormat = tlNoFormat;
	}
	public String getCapital() {
		return capital;
	}
	public void setCapital(String capital) {
		this.capital = capital;
	}
}
