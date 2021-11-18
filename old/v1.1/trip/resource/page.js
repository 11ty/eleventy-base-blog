var strImagesPath = "../common/graphics/";
//tab images
leftTab_norm_img = new Image();	leftTab_norm_img.src = strImagesPath + "tabLeft_norm.gif";
leftTab_sel_img = new Image();	leftTab_sel_img.src = strImagesPath + "tabLeft_sel.gif";
rightTab_norm_img = new Image();rightTab_norm_img.src = strImagesPath + "tabRight_norm.gif";
rightTab_sel_img = new Image();	rightTab_sel_img.src = strImagesPath + "tabRight_sel.gif";

function setTab(iNr)
{
	for (i=0;i<iTabCount;i++){
		var sColor = "#808080";
		var sImg = "norm";
		var sState= "hidden";
		if (i==iNr-1){
			sColor = "#02329A";
			sImg = "sel";
			sState = "visible";
		}

		if (document.layers)  //NS
		{
//			eval("this.document.leftTab"+(i)+".src=leftTab_"+sImg+"_img.src;");
//			eval("this.document.rightTab"+(i)+".src=rightTab_"+sImg+"_img.src;");
			eval("this.document.layers.text"+i+".visibility=sState;");
		}
		else if (document.all)	//IE
		{
			// set tab ends to correct colour
//			eval("this.document.all.leftTab"+(i)+".src=leftTab_"+sImg+"_img.src;");
//			eval("this.document.all.rightTab"+(i)+".src=rightTab_"+sImg+"_img.src;");
			// set cell background colours to right colour
//			eval("this.document.all['tabcell"+(i)+"'].style.backgroundColor=sColor;");
			eval("this.document.all.text"+i+".style.visibility=sState;");
		}	
	}
}

function openLink(sLink){
	window.open(sLink,"win1");
}
