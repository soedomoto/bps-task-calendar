package id.go.bps.calendar;

import id.go.bps.calendar.utils.ClasspathUtil;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class TaskCalendarApplication {
	//private static final Logger log = LoggerFactory.getLogger(TCServer.class);
	
	private int port;
	private Server server;

	public TaskCalendarApplication(int port) {
		File cd = new File(System.getProperty("user.dir") + File.separator + "conf");
		
		ClasspathUtil cpU;
		try {
			cpU = new ClasspathUtil();
			cpU.addDirectoryClasspath(cd, false);
		} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | MalformedURLException e1) {
			e1.printStackTrace();
		}
		
		try {
			this.port = port;
			
			server = new Server(this.port);
	        
	        //	View Directory
	        String viewDir = TaskCalendarApplication.class.getClassLoader().getResource("web").toExternalForm();
	        
	        AnnotationConfigWebApplicationContext mvcContext = new AnnotationConfigWebApplicationContext();
	        mvcContext.setConfigLocation("id.go.bps.calendar.config");
	        mvcContext.getEnvironment().setDefaultProfiles("dev");
	        
	        ServletHolder mvcServletHolder = new ServletHolder("mvcDispatcher", new DispatcherServlet(mvcContext));
	        //mvcServletHolder.setInitParameter("contextConfigLocation", viewDir + "/web-context.xml");
	        //mvcServletHolder.setInitParameter("contextConfigLocation", "id.go.bps.calendar.config");

	        ServletHolder jspServletHolder = new ServletHolder("jspServlet", new org.apache.jasper.servlet.JspServlet());

	        // session has to be set, otherwise Jasper won't work
	        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
	        context.setClassLoader(new URLClassLoader(new URL[0], this.getClass().getClassLoader()));
	        context.setAttribute("org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern",".*/[^/]*taglibs.*\\.jar$");
	        context.addServlet(jspServletHolder, "*.jsp");
	        context.addServlet(mvcServletHolder, "/");
	        //context.setBaseResource();;
	        context.setResourceBase(viewDir);
	        
			server.setHandler(context);			
			//	Start Server
			server.start();
			server.join();
		} catch(Exception e) {
			e.printStackTrace();
			//log.error(e.getMessage(), e);
		}
	}
	
	public static void main(String[] args) {
		System.setProperty("-Dorg.apache.jasper.compiler.disablejsr199", "true");
		
		new TaskCalendarApplication(args.length == 0 ? 80 : Integer.parseInt(args[0]));
	}
}
