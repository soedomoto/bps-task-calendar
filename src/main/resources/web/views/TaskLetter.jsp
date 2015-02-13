<%@page import="id.go.bps.calendar.models.ASetting"%>
<%@page import="java.util.List"%>
<%@page import="id.go.bps.calendar.models.ATask"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apache.commons.lang.time.DateUtils"%>
<%@page import="java.util.Locale"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1"%>
<%-- <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> --%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<link rel="stylesheet" type="text/css" href="/assets/taskletter.css" />
</head>

<%
	ASetting setting = (ASetting) request.getAttribute("setting");
	List<ATask> tasks = (List<ATask>) request.getAttribute("tasks");
%>

<% if(setting == null) { %>
	<jsp:forward page="PDFError.jsp">
		<jsp:param value="Setting belum diisi" name="error"/>
	</jsp:forward>
<% } %>

<body>
	<div class='header'>
		<img class="logo" src="/assets/bps.png" />
		<div class="title"><b><i>
			<span>BADAN PUSAT STATISTIK</span><br />
			<span><%= setting.getInstitution().toUpperCase() %></span>
		</i></b></div>
	</div>
    <div class='footer'>
    	<span><%= setting.getAddress() %>, Telp. <%= setting.getPhone() %>, Fax. <%= setting.getFax() %></span><br />
    	<span>Website: <%= setting.getWebsite() %>, email: <%= setting.getEmail() %></span>
    </div>
	
	<% 
		if(tasks.size() > 0) {
			for(ATask task : tasks) {
	%>
	    	<!-- Page 1 -->
		    <div class='content'>
		    	<div style="text-align: center; font-weight: bold; font-size: 120%; margin-bottom: 50px;">
					<span style="text-decoration: underline;">SURAT TUGAS</span><br />
					<span style="font-size: 80%;">NO : <%= task.getTaskNumber() %>/ST/<%= DateUtils.toCalendar(task.getStart()).get(Calendar.YEAR) %></span>
				</div>
				<div class="sp fs rel">
					Yang bertanda tangan di bawah ini
				</div>
				<div class="sp fs rel" style="text-align: center; font-weight: bold;">
					KEPALA BADAN PUSAT STATISTIK <%= setting.getInstitution().toUpperCase() %>
				</div>
				<div class="sp fs rel">
					Memberi tugas kepada
				</div>
				<div class="sp fs rel">
					<div style="width: 150px; float: left;">Nama / NIP</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<div>
						<%= task.getUser().getFullname() %>&nbsp;/&nbsp;<%= task.getUser().getFormattedNip() %>
					</div>
				</div>
				<div class="sp fs rel">
					<div style="width: 150px; float: left;">Pangkat / Gol Ruang</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<div>
					<% if(task.getUser().getRank() != null) { %>
						<%= task.getUser().getRank().getName() %>&nbsp;
						(<%= task.getUser().getRank().getId() %>)
					<% } else out.print("-"); %>
					</div>
				</div>
				<div class="sp fs rel">
					<div style="width: 150px; float: left;">Jabatan</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<div><%= task.getUser().getPosition().getName() %></div>
				</div>
				<div class="sp fs rel" style="vertical-align: text-top; top: -13px;">
					<div style="width: 150px; float: left;">Dasar</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<ol style="position: relative; left: 150px; width: 430px;">
						<li class="sp">Undang-Undang No.1 Tahun 2004, Tentang Perbendaharaan Negara</li>
						<li class="sp">Undang-Undang No.16 Tahun 1997, Tentang Statistik</li>
						<li class="sp">Peraturan Pemerintah No.51 Tahun 1999 Tentang Penyelenggaraan Statistik</li>
						<li class="sp">Keputusan Presiden RI No.42 Tahun 2002 Tentang Pelaksanaan Anggaran Pendapatan dan Belanja Negara</li>
					</ol>
				</div>
				<div class="sp fs rel">
					<div style="width: 150px; float: left;">Tujuan</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<div><%= task.getEvent().getTitle() %></div>
				</div>
				<div class="sp fs rel">
					<div style="width: 150px; float: left;">Waktu</div>
					<div style="width: 10px; padding-right: 10px; float: left;">:</div>
					<div><%= task.getDateString() %></div>
				</div>
				<div class="fs rel" style="width: 100%; margin-top: 40px;">
					<div style="position: absolute; width: 200px; right: 0px; text-align: center; line-height: 20px;">
						<%= setting.getCapital() %>, <%= new SimpleDateFormat("d MMMM yyyy", new Locale("id", "ID")).format(new Date()) %><br />
						Kepala<br /><br /><br /><br /><br />
						<span style="line-height: 15px;">
							<span style="text-decoration: underline; font-weight: bold;"><%= setting.getChief().getFullname() %></span><br />
							NIP. <%= setting.getChief().getFormattedNip() %>
						</span>
					</div>
				</div>
		    </div>
		    <!-- Page 2 -->
		    <div class='content'>
		    	<div style="text-align: center; font-weight: bold; font-size: 120%; margin-bottom: 50px;">
					<span style="text-decoration: underline;">LAMPIRAN SURAT TUGAS</span><br />
					<span style="font-size: 80%;">NO : <%= task.getTaskNumber() %>/ST/<%= DateUtils.toCalendar(task.getStart()).get(Calendar.YEAR) %></span>
				</div>
				<div class="fs rel">
					<table border="0" cellpadding="0" cellspacing="0" class="visum">
						<tr style="font-weight: bold;">
							<td style="width: 8%;">No.</td>
							<td style="width: 35%;">Tempat Yang Dikunjungi</td>
							<td style="width: 15%;">Nama dan Jabatan yang Mengetahui</td>
							<td style="width: 20%;">Tanggal Kunjungan</td>
							<td style="width: 22%;">Cap dan Tanda Tangan Mengetahui</td>
						</tr>
						<tr style="font-size: 8pt; font-weight: bold;">
							<td>(1)</td>
							<td>(2)</td>
							<td>(3)</td>
							<td>(4)</td>
							<td>(5)</td>
						</tr>
						<% for(int l=1; l<=task.getDaysBetween(); l++) { %>
						<tr style="height: 75px;">
							<td><%= l %></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<% } %>
					</table>
				</div>
				<div class="fs rel" style="width: 100%; margin-top: 40px;">
					<div style="position: absolute; width: 200px; right: 0px; text-align: center; line-height: 20px;">
						<%= setting.getCapital() %>, <%= new SimpleDateFormat("d MMMM yyyy", new Locale("id", "ID")).format(new Date()) %><br />
						Kepala<br /><br /><br /><br /><br />
						<span style="line-height: 15px;">
							<span style="text-decoration: underline; font-weight: bold;"><%= setting.getChief().getFullname() %></span><br />
							NIP. <%= setting.getChief().getFormattedNip() %>
						</span>
					</div>
				</div>
		    </div>
	<%
			}
		}
	%>
</body>
</html>