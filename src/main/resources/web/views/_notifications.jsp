<%@page import="id.go.bps.calendar.utils.ColorUtil"%>
<%@page import="id.go.bps.calendar.models.AUser"%>
<%@page import="java.awt.Color"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<div class="notifications">
	<div style="position: relative;">
		<% 
			AUser user = (AUser) request.getSession().getAttribute("user");
			if(user == null) { 
		%>
			<div class="top login">Silahkan login</div>
		<% 
			} else { 
				Color color = Color.decode("#" + user.getColor());
				Color tColor = ColorUtil.darker(color, 0.3);
		%>
			<div class="top" style="background-color:rgba(<%= color.getRed() + "," + color.getGreen() + "," + color.getBlue() %>,.2); 
				color:rgb(<%= tColor.getRed() + "," + tColor.getGreen() + "," + tColor.getBlue() %>);">
				Selamat Datang <%=user.getFullname() %> 
				<span class="logout">Logout</span>
			</div>
		<% } %>
		<div style="position: absolute; width: 100%; top: 0px;">
				<div id="loading" style="display:none">loading...</div>
		</div>
	</div>
</div>