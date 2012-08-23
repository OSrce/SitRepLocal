//Login.js class

define( [
	"dojo/_base/declare",
	"dojo",
	"dojox",
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
  "dojox/mobile/deviceTheme",
  "dojox/mobile/compat",
  "dojo/hash",
  "dojox/io/xhrScriptPlugin",
  "dojo/data/ItemFileReadStore",
  "dojox/mobile/RoundRectDataList",
  "dijit/form/DataList",
  "dojox/mobile/ComboBox",
  "dojox/mobile/ToolBarButton",
  "dijit/layout/ContentPane",
  "dijit/form/Form",
  "dojox/mobile/TextBox",
  "dojox/mobile/Button",
  "dojox/mobile/RoundRectCategory",
  "dojox/widget/Standby",
  "dojox/mobile/TabBar",
  "dojox/mobile/TabBarButton",
  "dojox/mobile/RoundRectDataList",
  "dojox/mobile/RoundRectList",
	"dojox/mobile/TextBox",
	"dojox/mobile/CheckBox",
	"dojox/mobile/ScrollableView",
  "dojox/mobile/TabBar",
  "dijit/Dialog",
  "dojox/widget/Standby",
  "dijit/form/MultiSelect",
], function(declare, dojo, dojox) {
	return declare( [], {

		constructor: function() {
			console.log("Login contructor called!");
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

			//Change what's shown based on the number of servers found
			if(this.myservers.length == 0) {
				this.myservers = [{ "url":"demo.sitrep.org", "city":"New York", "username":"SitRepDemo","password":"SRDemo115" }]
			}
 
		 this.currentservernum=0; //currentservernum is the server that is selected in the select box on the login page
		 this.clickedservernum=0; //the server that is clicked in the edit menu
		 this.deletepressed=0; //indicates if the delete button has been clicked

			this.uiSetup();
			dojo.addOnUnload(this.saveToLocalStorage);
		},
		uiSetup: function() {

			if(this.myservers.length>0) {
					dojo.setAttr(dojo.byId("userbox"),"value", this.myservers[0].username);
					dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[0].password);
			}
			
			var srdLogin = this;
			this.theSelect = dojo.create("select", { id:"selectbox" ,onchange:function(e) { this.selectserver(this.theSelect.selectedIndex) }.bind(this)  } , dojo.byId("serverListLocation1")  );
			
			this.theSelect2 = dojo.create("select", { id:"selectbox2" ,onchange:function(e) { this.selectserver(this.theSelect2.selectedIndex) }.bind(this)  } , dojo.byId("serverListLocation2")  );
			for ( i=0;i<this.myservers.length;i++)
			{
				dojo.create("option", { innerHTML:this.myservers[i].url }, this.theSelect);
				dojo.create("option", { innerHTML:this.myservers[i].url }, this.theSelect2);
			}

		},
		saveToLocalStorage: function() {
			localStorage.myservers_count = this.myservers.length;
			for(var i in this.myservers) {
				localStorage["myservers_"+i]= dojo.toJson(this.myservers[i]);
				console.log("LocalStorage : myservers_"+i+" VALUE="+dojo.toJson(this.myservers[i]) );
			}
			return;
		},
		updateUserandPass: function(index) {

			console.log("updateUserandPass Called:"+index);
			this.currentservernum=index;
			if( ! index>=0){
	   		dojo.setAttr(dojo.byId("userbox"),"value","");
				dojo.setAttr(dojo.byId("passbox"),"value","");			
				return;
			}
	   	dojo.setAttr(dojo.byId("userbox"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[index].password);	
		},

		//BEGIN connectToServer
		connectToServer: function() {
			document.getElementById("loginfeedback").innerHTML="";
	    var standby = new dojox.widget.Standby({ 
        target: "root_view" 
 		   }); 
	    document.body.appendChild(standby.domNode); 
	    standby.startup(); 

			standby.show(); 
			var serverBaseUrl = "https://"+this.myservers[this.currentservernum].url;
			var serverUrl = serverBaseUrl+"/login/index/embeddedlogin";
			var theData = { "username": this.myservers[this.currentservernum].username, "password":this.myservers[this.currentservernum].password };

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
		//END connectToServer

		//BEGIN selectserver
		selectserver: function(index)
		{
			console.log("Select Server Called: "+index);	
			document.getElementById("loginfeedback").innerHTML="";
			this.currentservernum=index;
			if(! (index >= 0) ){
	   		dojo.setAttr(dojo.byId("userbox"),"value","");
				dojo.setAttr(dojo.byId("passbox"),"value","");			
	
				dojo.setAttr(dojo.byId("editservername"), "value", "");
				dojo.setAttr(dojo.byId("editusername"), "value", "");
				dojo.setAttr(dojo.byId("editpassword"),"value","");
				dojo.setAttr(dojo.byId("editcity"),"value","");
				return;
			}
	   	dojo.setAttr(dojo.byId("userbox"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[index].password);	

			dojo.setAttr(dojo.byId("editservername"),"value",this.myservers[index].url);
			dojo.setAttr(dojo.byId("editusername"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("editpassword"),"value",this.myservers[index].password);
			dojo.setAttr(dojo.byId("editcity"),"value",this.myservers[index].city);
		
			dojo.setAttr(dojo.byId("confirmtext"),"innerHTML", "server " + index + " is ");
			this.deactivatesave();
			
		},
		//END selectserver
		//BEGIN addToSelectBox 
		addToSelectBox : function (a){
	//Add to select box on root_view
		var select = document.getElementById("selectbox");
		var select2 = document.getElementById("selectbox2");
		var opt = document.createElement("option");
    	opt.innerText = this.myservers[a].url;
    	select.appendChild(opt);	
    	select2.appendChild(opt);	
		},

		//BEGIN addServer
		addServer :	function (){
	//this gets called twice if you use "onclick=" instead of data-dojo-props="onClick:function(){...}"
		//if(deletepressed==1){deleteserverprep();}

		this.myservers.push({ "url":"edit.sitrep.org", "city":"Anytown", "username":"","password":""});
		var thisservernum=this.myservers.length - 1;

		var opt = document.createElement("option");
   	opt.innerHTML = this.myservers[thisservernum].url;
   	dojo.byId("selectbox").appendChild(opt);
   	dojo.byId("selectbox").selectedIndex=thisservernum;

   	dojo.byId("selectbox2").appendChild(opt);
  	dojo.byId("selectbox2").selectedIndex=thisservernum;

//		this.addToSelectBox(thisservernum);
		
		this.selectserver(thisservernum);
		this.saveserver();
		},
		//END addServer

		//BEGIN deleteserverprep
		deleteserverprep :function () {
			document.getElementById("confirmtext").innerHTML="Are you sure you want to delete " + this.myservers[this.currentservernum].url + "?";
			myDialog.show();
			return;
		},
		//END deleteserver

		//BEGIN deleteserver
		deleteserver : function() {	
			//Take items out of array
			this.myservers.splice(this.currentservernum,1);
			
			dojo.byId("selectbox").remove(this.currentservernum);

			if(srdLocalType == "mobile" ) {
				this.deleteserverprep();
				this.theSelect2.destroyRecursive();
				this.theSelect2 = new dojox.mobile.RoundRectList(); 
				this.theSelect2.placeAt(dojo.byId("serverListLocation2") );	

				for ( i=0;i<this.myservers.length;i++) {
					var theListItem = new dojox.mobile.ListItem( {
						label: this.myservers[i].url,
						class: "mbListItem",
						value: i,
						srdLogin: this,
						id: "list2_itemnum_" + i,
						"clickable": "true",
						onClick: function() {
							if( this.srdLogin.deletepressed==0 ) {
								this.srdLogin.selectserver( this.value );
							} else {
								this.srdLogin.currentservernum = this.value;
								this.srdLogin.deleteserver();
							}
						}
					});
					theListItem.set("icon", "mblDomButtonRedCircleMinus");
//					theListItem.iconNode.style.display = "inline";
//					theListItem.rightIconNode.style.display = "none";
					this.theSelect2.addChild(theListItem);
				}
			} else {
				dojo.byId("selectbox2").remove(this.currentservernum);
			}	
	this.currentservernum=document.getElementById("selectbox").selectedIndex;
//	this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
//	this.selectserver(document.getElementById("selectbox").selectedIndex);
	

	
	},
	//END DELETE SERVER

	saveserver: 	function()
		{
			
		//Add to myservers
		this.myservers[this.currentservernum].url=document.getElementById("editservername").value	
		this.myservers[this.currentservernum].city=document.getElementById("editcity").value
		this.myservers[this.currentservernum].username=document.getElementById("editusername").value
		this.myservers[this.currentservernum].password=document.getElementById("editpassword").value

		//Write this to localStorage....
		this.saveToLocalStorage();

		//Change in edit servers
		//dijit.byId('servernum' + clickedservernum).set("label",myservers[clickedservernum].url);
		dojo.byId("selectbox").options[this.currentservernum].innerHTML=this.myservers[this.currentservernum].url;
		//document.getElementById("serverlist").options[document.getElementById("selectbox").selectedIndex].innerHTML=myservers[document.getElementById("selectbox").selectedIndex].url;
		

		if ( srdLocalType == "mobile" ) {
			dijit.byId('list2_itemnum_' + this.currentservernum).set("label", this.myservers[this.currentservernum].url);
		} else {		
			//Change on login page
			dojo.byId("selectbox2").options[this.currentservernum].innerHTML=this.myservers[this.currentservernum].url;
//		this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
	
			this.deactivatesave();
		}

		}, //End of saveserver
	


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
	




 
