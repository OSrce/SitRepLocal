//login_desktop.js class

define( [
	"dojo/_base/declare",
//	"dojo/dom-construct",
	"dojo",
  "dijit/dijit",
  "dojo/parser",
  "dijit/TitlePane",
  "dijit/Toolbar",
  "dijit/form/Button",
  "dojox/form/CheckedMultiSelect",
  "dojox/io/xhrScriptPlugin",
  "dojo/data/ItemFileReadStore",
  "dojox/data/CsvStore",
  "dijit/MenuBar",
  "dijit/PopupMenuBarItem",
  "dijit/MenuItem",
  "dijit/Menu",
  "dijit/form/SimpleTextarea",
  "dijit/form/TextBox",
  "dijit/form/CheckBox",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dojox/mobile/RoundRectCategory",
  "dojox/mobile/RoundRectDataList",
  "dojox/mobile",
  "dojox/mobile/TabBar",
  "dijit/Dialog",
  "dojox/widget/Standby",
  "dijit/form/MultiSelect",
], function(declare, dojo) {
	return declare( [], {
		
		constructor: function() {

			//CHECK FILE HERE TO GET SERVER INFO FOR THE VERY FIRST TIME WE RUN.

			var i;
			this.myservers = new Array();

			var myservers_count = 0;

			if ( localStorage.myservers_count != null) {
				myservers_count = localStorage.myservers_count;
				for(var i=0;i<myservers_count; i++) {
					if(localStorage["myservers_"+i] != null) {
						this.myservers[i] = dojo.fromJson( localStorage["myservers_"+i] );
						console.log("TEST5="+localStorage["myservers_"+i]);
					}
				}
			}


			var serversfound=this.myservers.length;

			//serversfound=0;
			//Change what's shown based on the number of servers found
			if(serversfound==0) {

				this.myservers = [{ "url":"demo.sitrep.org", "city":"New York", "username":"SitRepDemo","password":"SRDemo115" }]
				serversfound=1;
				//document.write('<input type="text" data-dojo-type="dijit.form.TextBox" value="demo.sitrep.org"><' + '/input>');
				//document.getElementById("selectserver").innerHTML="Server:";
	

			}

			if(serversfound>0) {
					dojo.setAttr(dojo.byId("userbox"),"value", this.myservers[0].username);
					dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[0].password);
			}

			this.getServerList();


	 
		 var currentservernum=0; //currentservernum is the server that is selected in the select box on the login page
		 var clickedservernum=0; //the server that is clicked in the edit menu
		 var deletepressed=0; //indicates if the delete button has been clicked


		
//		document.write('<select id="serverlist" size=10 width=40 onchange="clickserver(this.selectedIndex)">');
			var theSelect = dojo.create("select", { id:"selectbox" ,onchange: this.updateUserandPass(this.selectedIndex)  } , dojo.byId("serverlist2")  );
			for ( i=0;i<this.myservers.length;i++)
			{
				dojo.create("option", { innerHTML:this.myservers[i].url }, theSelect);
			}

//		makeserverlist();	
//		dojo.ready(function(){clickserver(0); document.getElementById("serverlist").selectedIndex=0;});	
//		document.write("<" + "/select>");
//		document.write("<" + "/td><" + "/tr>");

			dojo.addOnUnload(this.saveToLocalStorage);
			
		},
		getServerList: function() {
			var theSelect = dojo.create("select", { id:"selectbox" ,onchange: this.updateUserandPass(this.selectedIndex)  } , dojo.byId("serverlist")  );
			for ( i=0;i<this.myservers.length;i++)
			{
				dojo.create("option", { innerHTML:this.myservers[i].url }, theSelect);
			}
//			document.write("<" + "/select>");
		
			document.getElementById("selectserver").innerHTML="Select server:";

			this.updateUserandPass(dojo.getAttr(dojo.byId("selectbox"),"selectedIndex"));
		},

		saveToLocalStorage: function() {
			localStorage.myservers_count = this.myservers.length;
			for(var i in this.myservers) {
				localStorage["myservers_"+i]= dojo.toJson(this.myservers[i]);
				console.log("LocalStorage : myservers_"+i+" VALUE="+dojo.toJson(myservers[i]) );
			}
			return;
		},
		updateUserandPass: function(index) {
			if(index<0){
	   		dojo.setAttr(dojo.byId("userbox"),"value","");
				dojo.setAttr(dojo.byId("passbox"),"value","");			
				return;
			}
			currentservernum=index;
//	   	dojo.setAttr(dojo.byId("userbox"),"value",this.myservers[index].username);
//			dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[index].password);	
		},
		connectToServer: function() {
			document.getElementById("loginfeedback").innerHTML="";
	    var standby = new dojox.widget.Standby({ 
        target: "root_view" 
 		   }); 
	    document.body.appendChild(standby.domNode); 
	    standby.startup(); 

			standby.show(); 

	/////PUT SOME CODE TO CONNECT TO ACTUALLY CONNECT TO SERVER
	// VARS we care about :
	
//		console.log("TEST TEST SERVER NUM:"+currentservernum);	
//		console.log("TEST TEST SERVER URL:"+myservers[currentservernum].url);	
//		console.log("TEST TEST USER:"+myservers[currentservernum].username);	
//		console.log("TEST TEST PASS:"+myservers[currentservernum].password);	
	
		var serverBaseUrl = "https://"+this.myservers[currentservernum].url;
		var serverUrl = serverBaseUrl+"/login/index/embeddedlogin";
		var theData = { "username": this.myservers[currentservernum].username, "password":this.myservers[currentservernum].password };

		var xhrArgs = {
		url: serverUrl,
		timeout: 4000,
		postData: dojo.toJson(theData),
		handleAs: 'json',
		headers: { 'Content-Type' : 'application/json' },
		load: function(data) {
			console.log("Finished auth request");

			standby.hide(); 
			if(data != null && data.authenticated != null && data.authorized != null) {
				if(data.authenticated == true && data.authorized == true) {
					console.log("auth="+data.authenticated);
					console.log("author="+data.authorized);
					// USER HAS SUCCESFULLY AUTH REDIRCT TO THE HOME PAGE.
					window.location.href = serverBaseUrl+"/home";

				} else if(data.authenticated != true){
						document.getElementById("loginfeedback").innerHTML="Invalid username or password!";
				} else if(data.authorized != true){
				
						document.getElementById("loginfeedback").innerHTML="This user is not authorized to connect to this server!";
					
					}
			} else {
				document.getElementById("loginfeedback").innerHTML="Error: could not connect to server!";
			}
	
		},
		error: function(theError) {
			console.log("An unexpected error occured! Error"+theError);
			standby.hide(); 
		
		}
		};
		var deferred = dojo.xhrPost(xhrArgs);


		},
		clickserver: function(a)
		{
			
			
			if(a<0){
					document.getElementById("editservername").value="";
					document.getElementById("editusername").value="";
					document.getElementById("editpassword").value="";
					document.getElementById("editcity").value="";
					return;
			}
		document.getElementById("confirmtext").innerHTML= "server " + a + " is ";
		document.getElementById("editservername").value=this.myservers[a].url;
		document.getElementById("editusername").value=this.myservers[a].username;
		document.getElementById("editpassword").value=this.myservers[a].password;
		document.getElementById("editcity").value=this.myservers[a].city;
		
		 
		// currentservernum=a;
		clickedservernum=a;
		deactivatesave();
		//var w = dijit.byId('server_view');
		//w.performTransition('server_data_view',1,"slide",null);	
			
		}, //End of clickserver

		addToSelectBox : function (a){
	//Add to select box on root_view
		var select = document.getElementById("selectbox");
		var opt = document.createElement("option");
    	opt.innerText = this.myservers[a].url;
    	select.appendChild(opt);	
		},

		addServer :	function (num){
	//this gets called twice if you use "onclick=" instead of data-dojo-props="onClick:function(){...}"
		//if(deletepressed==1){deleteserverprep();}

		this.myservers.push({ "url":"edit.sitrep.org", "city":"Anytown", "username":"","password":""});
		var thisservernum=this.myservers.length - 1;

		
		var opt = document.createElement("option");
    	opt.innerHTML = this.myservers[thisservernum].url;
    	document.getElementById("serverlist").appendChild(opt);
    	document.getElementById("serverlist").selectedIndex=thisservernum;

		//and this    			onclick: "clickserver(" + thisservernum + ")",
		addToSelectBox(thisservernum);
		
		clickserver(thisservernum);
		saveserver();
		},
		deleteserverprep :function (){

			document.getElementById("confirmtext").innerHTML="Are you sure you want to delete " + this.myservers[document.getElementById("serverlist").selectedIndex].url + "?";
	
			//document.getElementById("ok").focus();
			myDialog.show();
	
			return;
		},
		deleteserver : function(a) {


	//deleteserverprep();
	//remove from myservers
	//myDialog.hide();

	
	//Take items out of array
	this.myservers.splice(a,1);

	
	//remake Server List
	//makeserverlist();
	document.getElementById("serverlist").options.length = this.myservers.length;
	for ( i=0;i<this.myservers.length;i++)
	{
		document.getElementById("serverlist").options[i].innerHTML=this.myservers[i].url;
	}
	
	//remove from login page
	//
	//$("#selectBox option[value='option1']").removeChild();
	//select = document.getElementById("selectbox");
	//remove from 

	document.getElementById("selectbox").options.length = this.myservers.length;
	for ( i=0;i<this.myservers.length;i++)
	{
		document.getElementById("selectbox").options[i].innerHTML=this.myservers[i].url;
	}
	
	if(document.getElementById("serverlist").selectedIndex==-1){
		document.getElementById("serverlist").selectedIndex=this.myservers.length-1;
		document.getElementById("selectbox").selectedIndex=this.myservers.length-1;
	}
	currentservernum=document.getElementById("selectbox").selectedIndex;
	this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
	clickserver(document.getElementById("serverlist").selectedIndex);
	

	
	},
	//END DELETE SERVER

	saverserver: 	function()
		{
			
		//Add to myservers
		this.myservers[clickedservernum].url=document.getElementById("editservername").value	
		this.myservers[clickedservernum].city=document.getElementById("editcity").value
		this.myservers[clickedservernum].username=document.getElementById("editusername").value
		this.myservers[clickedservernum].password=document.getElementById("editpassword").value

		//Write this to localStorage....
		this.saveToLocalStorage();

		//Change in edit servers
		//dijit.byId('servernum' + clickedservernum).set("label",myservers[clickedservernum].url);
		document.getElementById("serverlist").options[clickedservernum].innerHTML=myservers[clickedservernum].url;
		//document.getElementById("serverlist").options[document.getElementById("selectbox").selectedIndex].innerHTML=myservers[document.getElementById("selectbox").selectedIndex].url;
		
		
		//Change on login page
		document.getElementById("selectbox").options[clickedservernum].innerHTML=myservers[clickedservernum].url;
		this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
	
		deactivatesave();
		}, //End of saveserver
	


		makeserverlist:	function(){
			for ( i=0;i<myservers.length;i++)
			{
				document.write('<option>' + myservers[i].url + '<'+ '/option>');
			}

    },
	 
	 	activatesave : function(){
	 		document.getElementById("savetext").innerHTML="  Click Save to save changes.";
	 		dijit.byId("savebutton").setAttribute("disabled",false);
	 		//	"Updated " + new Date());
				
	 	},
	 
		deactivatesave : function(){
	 		dijit.byId("savebutton").setAttribute("disabled",true);	
	 		document.getElementById("savetext").innerHTML="";
	 	} 
	 
		

	});

});
	




 
