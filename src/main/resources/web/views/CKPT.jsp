<%@page import="java.util.Locale"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Map"%>
<%@page import="id.go.bps.calendar.models.AUser"%>
<%@page import="id.go.bps.calendar.models.ATask"%>
<%@page import="java.util.List"%>
<%@page import="id.go.bps.calendar.models.ASetting"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<link rel="stylesheet" type="text/css" href="/assets/ckp.css" />
</head>
<body>
	<%
		AUser user = (AUser) request.getAttribute("user");
		ASetting setting = (ASetting) request.getAttribute("setting");
		Map<Object, Object> tasks = (Map<Object, Object>) request.getAttribute("tasks");
	%>
		
	<% if(setting == null) { %>
		<jsp:forward page="PDFError.jsp">
			<jsp:param value="Setting belum diisi" name="error"/>
		</jsp:forward>
	<% } %>
	
	<% if(user.getSupervisor() == null) { %>
		<jsp:forward page="PDFError.jsp">
			<jsp:param value="Supervisor belum diisi" name="error"/>
			<jsp:param value="/assets/docs/img/Edit User Detail.png" name="images"/>
		</jsp:forward>
	<% } %>
		
	<%	
		for(Object y : tasks.keySet()) {
			Map<Object, Object> mTasks = (Map<Object, Object>) tasks.get(y);
			for(Object m : mTasks.keySet()) {
				List<ATask> uTasks = (List<ATask>) mTasks.get(m);
				
				Calendar s = Calendar.getInstance();
				s.set(Calendar.YEAR, (Integer) y);
				s.set(Calendar.MONTH, (Integer) m);
				s.set(Calendar.DATE, 1);
				
				Calendar e = Calendar.getInstance();
				e.set(Calendar.YEAR, (Integer) y);
				e.set(Calendar.MONTH, (Integer) m);
				e.set(Calendar.DATE, e.getActualMaximum(Calendar.DATE));
				
				SimpleDateFormat sdf = new SimpleDateFormat("d MMMM yyyy", new Locale("id", "ID"));
				if(uTasks.size() > 0) {
	%>
	<div class="label">CKP-T</div>
	<div class='content'>
		<div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
			TARGET KINERJA PEGAWAI TAHUN <%= new SimpleDateFormat("yyyy", new Locale("id", "ID")).format(s.getTime()) %>
		</div>
		<div class="properties">
			<table border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td>Satuan Organisasi</td><td>:</td><td>BPS <%= setting.getInstitution() %></td>
				</tr>
				<tr>
					<td>Nama</td><td>:</td><td><%= user.getFullname() %></td>
				</tr>
				<tr>
					<td>Jabatan</td><td>:</td><td><%= user.getPosition().getName() %></td>
				</tr>
				<tr>
					<td>Periode</td><td>:</td><td><%= sdf.format(s.getTime()) %> - 
					<%= sdf.format(e.getTime()) %></td>
				</tr>
			</table>
		</div>
		<div class="task" style="margin-bottom: 20px;">
			<table border="0" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th style="width: 35px;">No</th>
						<th style="width: 300px;">Uraian Kegiatan</th>
						<th style="width: 100px;">Satuan</th>
						<th style="width: 100px;">Target Kuantitas</th>
						<th style="width: 100px;">Kode Butir Kegiatan</th>
						<th style="width: 100px;">Angka Kredit</th>
						<th>Keterangan</th>
					</tr>
					<tr style="font-size: 8pt;">
						<th>(1)</th>
						<th>(2)</th>
						<th>(3)</th>
						<th>(4)</th>
						<th>(5)</th>
						<th>(6)</th>
						<th>(7)</th>
					</tr>
				</thead>
				<tbody>
				<% 
					if(tasks.size() > 0) {
						int i = 1;
						for(ATask task : uTasks) {
				%>
					<tr>
						<td><%= i %></td>
						<td style="text-align: left; padding-left: 4px;"><%= task.getEvent().getTitle() %></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				<%
							i++;
						}
					}
				%>
					<tr>
						<td colspan="5" style="font-weight: bold">Jumlah</td>
						<td></td>
						<td style="background-color: rgb(128,128,128);"></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<div style="position: absolute; width: 200px; left: 100px; text-align: center;">
				Pegawai Yang Dinilai<br /><br /><br /><br /><br />
				<span style="line-height: 15px;">
					<span style="text-decoration: underline; font-weight: bold;"><%= user.getFullname() %></span><br />
					NIP. <%= user.getFormattedNip() %>
				</span>
			</div>
			<div style="position: absolute; width: 200px; right: 100px; text-align: center;">
				Pejabat Penilai<br /><br /><br /><br /><br />
				<span style="line-height: 15px;">
					<span style="text-decoration: underline; font-weight: bold;"><%= user.getSupervisor().getFullname() %></span><br />
					NIP. <%= user.getSupervisor().getFormattedNip() %>
				</span>
			</div>
		</div>
	</div>
	<%
				}
			}
		}
	%>
</body>
</html>