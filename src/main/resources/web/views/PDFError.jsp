<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>Error</title>
</head>
<%
	String msg = request.getParameter("error");
	String imgs = request.getParameter("images");
%>
<body>
	<div class='content'>
		<%= msg!=null ? msg : "" %>
		<br />
		<% if(imgs != null) {
				for(String img : request.getParameter("images").split(",")) { %>
			<br />
			<img src="<%= img %>" />
		<% }} %>
	</div>
</body>
</html>