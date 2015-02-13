<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Employee Task Calendar</title>
	
	<link rel="stylesheet" type="text/css" href="/assets/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="/assets/fullcalendar.min.css" />
	<link rel="stylesheet" type="text/css" href="/assets/fullcalendar.print.css" media="print" />
	<link rel="stylesheet" type="text/css" href="/assets/jquery.tokeninput.facebook.css" />
	<link rel="stylesheet" type="text/css" href="/assets/colpick.css" />
	<link rel="stylesheet" type="text/css" href="/assets/application.css" />
	<link rel="stylesheet" type="text/css" href="/assets/glyphicons-halflings.css" />
	<link rel="stylesheet" type="text/css" href="/assets/pikaday/pikaday.css" />
	
	<script type="text/javascript" src="/assets/jquery.js"></script>
	<script type="text/javascript" src="/assets/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/assets/lib/moment.min.js"></script>
	<script type="text/javascript" src="/assets/fullcalendar.min.js"></script>
	<script type="text/javascript" src="/assets/jquery.tokeninput.js"></script>
	<script type="text/javascript" src="/assets/colpick.js"></script>
	<script type="text/javascript" src="/assets/pikaday/pikaday.js"></script>
	<script type="text/javascript" src="/assets/pikaday/pikaday.jquery.js"></script>
	<!-- <script type="text/javascript" src="/assets/jquery.tablesorter.min.js"> -->
	
	<script type="text/javascript">
		var opts = ${opts}
	</script>
	
	<link rel="stylesheet" type="text/css" href="/assets/application.css" />
	<script type="text/javascript" src="/assets/application.js"></script>
	<script type="text/javascript" src="/assets/application.bubble.js"></script>
	<script type="text/javascript" src="/assets/application.eventcalendar.js"></script>
</head>
<body>
	<div id="calendar"></div>
	
	<jsp:include page="_notifications.jsp"></jsp:include>
	
	<div id="bubble" class="bubble-event fc" style="display:none;">
		<div id="cbContent" style="padding: 16px 28px; position: relative;"></div>
		<div class="cb-close"></div>
	</div>
	<div id="list" class="bubble-event fc" style="display:none;">
		<div id="cbContent" style="padding: 16px 28px; position: relative;"></div>
		<div class="cb-close"></div>
	</div>
	
	<div class="pane side left">
		<jsp:include page="_users.jsp"></jsp:include>
	</div>
	<div class="pane side right">
		<jsp:include page="_events.jsp"></jsp:include>
		<jsp:include page="_settings.jsp"></jsp:include>
	</div>
	
	<jsp:include page="_ranks.jsp"></jsp:include>
	<jsp:include page="_positions.jsp"></jsp:include>
	<jsp:include page="_tasks.jsp"></jsp:include>
</body>