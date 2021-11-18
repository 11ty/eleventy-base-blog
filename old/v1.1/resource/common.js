function counter(){
	var sPath = this.location.pathname;
	var sFile = getFilename(sPath);
	if(document.layers){
		parent.COUNTER.location.replace("http://www.geocities.com/rmassart/"+sFile);
	}
}

function getFilename(sPath){
	var sFileName = "";
	var iPos = -1;
	iPos = sPath.lastIndexOf("/");
	sFileName = sPath.substring(iPos+1,sPath.length);
	return sFileName;
}

var sName = "";
sName = getFilename(this.location.pathname);
sName = sName.substring(0,sName.indexOf("."));
if (top.location.href.indexOf("frameset.htm")==-1){
	top.location.href = "../frameset.htm?file="+sName;
}

