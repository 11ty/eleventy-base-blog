this.onload = start;

//aBoulders = new Array();			//stores id of cells containing a boulder
//aBoulderEndPoints = new Array();	//stores id of cells where boulders are to be pushed to
var iRowsMax = 20;
var iCellsMax = 20;
var wall = "#000000";
var floor = "#cccccc";
var soko = "#ff0000";
var boulder = "#00ff00";
var boulderspot = "#0000ff";
var blank = "#ffffff";
var ns = (document.layers) ? true : false;
var ie = (document.getElementById) ? true : false;
var gbPull = false;
var giCurrentLevel = 1;

//Images
var imgFloor = new Image();
var imgSoko = new Image();
var imgBoulder = new Image();
var imgTarget = new Image();
var imgWall = new Image();
var imgBlank = new Image();

imgFloor.src = "re/floor.gif";
imgSoko.src = "re/soko.gif";
imgBoulder.src = "re/boulder.gif";
imgTarget.src = "re/target.gif";
imgWall.src = "re/wall.gif";
imgBlank.src = "re/blank.gif";

//0=wall,1=floor,2=sokoban,3=boulder,4=boulderspot
//_=new line
var aLevels = new Array();
aLevels[0] = "00000000000_00001000000_00011000110_00131111110_01112310110_00013000110_00011044110_00010040100_00111111000_00111110000_00111100000_00000000000_";
aLevels[1] = "000000000_000001410_000013410_000131110_001321000_013110000_044100000_011100000_000000000_";
aLevels[2] = "0000000000000000_0000000000001110_0000000000011110_0000000000013100_0000011000031300_0000011111313100_0000010013131300_0000114011313100_0000114011111100_0000010000000000_0444412110000000_0444411110000000_0011000000000000_0000000000000000_";
aLevels[3] = "0000000000000_0001111101120_0001313301110_0000311113310_0000113101110_0000001000000_0441443100000_0144111100000_0114400000000_0000000000000_";
aLevels[4] = "000000000000000_000111101111000_000131303131000_010313101313010_013114404411310_011344404443110_013144111441310_000000121000000_013144111441310_011344404443110_013114404411310_010313101313010_000131303131000_000111101111000_000000000000000_";
aLevels[5] = "000000000000000_000411434114000_000131131131000_000014434410000_000003030300000_000004313400000_000001121100000_000000010000000_000001313100000_000041131140000_000000141000000_000000000000000_";
aLevels[6] = "0000000000000000000_0000000000001111000_0000011000011001000_0001111000010111310_0113121444144113110_0131311001000111000_0001000111000000000_0011111100000000000_0011100000000000000_0000000000000000000_";
aLevels[7] = "0000000000000_0000011111000_0000010001100_0111111101100_0231114100310_0110111100140_0011001101310_0001100004340_0000111111110_0000000001100_0000000000000_";
aLevels[8] = "000000000_041411110_043414110_001000210_001131100_001331000_001131000_001100000_000000000_";
aLevels[9] = "000000000000000000_000000011110000000_000000012110000000_000000011111100000_011000044040300000_013131004441111110_011111444440331110_000000100300100000_000000113111100000_000000000100000000_000000001100000000_000000001100000000_000000001311110000_000000113131110000_000000103010000000_000000111110000000_000000000000000000_";


//OBJECTS
function grid(h,w){
	this.height = h;
	this.width = w;
	this.objectStoreRow = new Array();	//index 0 is always soko
	this.objectStoreCol = new Array();
	this.oRows = new Array(this.height);

	for (var i=0;i<this.height;i++){
		this.oRows[i] = new row(i,this.width);
	}
	this.detCellType = gridDetCellType;
	this.findSoko = gridFindSoko;
	this.set = gridSet;
	this.unset = gridUnset;
	this.moveSoko = gridMoveSoko;
	this.moveBoulder = gridMoveBoulder;
	this.checkValidMove = gridCheckValidMove;
	this.finished = gridFinished;
}

function row(r,w){
	if(document.getElementById){
		this.row = r;
		this.width = w;
		this.oCells = new Array(this.width);
		for (var i=0;i<this.width;i++){
			this.oCells[i] = new cell(this.row,i);
		}
	}
}

function cell(r,c){
	this.row = r;
	this.col = c;
	this.id = r+"_"+c;
	this.type;
	this.currentType;
	this.setType = cellSetType;
//	alert(this.id);
}

//METHODS
function cellSetType(type){
	this.type = type;
	this.currentType = type;
}

function gridDetCellType(r,c){
	return this.oRows[r].oCells[c].currentType;
}

function gridFindSoko(){
	for(var i=0;i<this.height;i++){
		for(var j=0;j<this.width;j++){
			if(this.oRows[i].oCells[j].currentType == 2)
				return i+"_"+j;
		}
	}
	return 0;
}

function gridCheckValidMove(iNewRow,iNewCol,iOldRow,iOldCol,bSoko){
	var iNewType;
	var iRowDiff = iNewRow - iOldRow;
	var iColDiff = iNewCol - iOldCol;
	if(((iRowDiff*iRowDiff==1)&&(iColDiff==0))||((iColDiff*iColDiff==1)&&(iRowDiff==0))){
		iNewType = this.detCellType(iNewRow,iNewCol);
		if((iNewType==1)||(iNewType==4)){
			return true;
		}
		if((iNewType==3)&&(bSoko)){
			return this.moveBoulder(iNewRow,iNewCol,iNewRow+iRowDiff,iNewCol+iColDiff);
		}
	}
	return false;
}

function gridSet(r,c,iType){
	this.oRows[r].oCells[c].currentType = iType;
	var sImg = imgBoulder.src;
	switch(iType){
		case 2:
			sImg = imgSoko.src;
			break;
		case 3:
			sImg = imgBoulder.src;
			break;
	}
	document.getElementById("i_"+c+"_"+r).src=sImg;

	//This is needed for IE6, because otherwise it doesnt display
	//the images correctly after a movement has occured!!!
	for (i=0;i<1000000;i++){
		i++;
	}
}

function gridUnset(r,c){
	var iOrigType =	this.oRows[r].oCells[c].type;
	this.oRows[r].oCells[c].currentType = iOrigType;
	var sImg = imgFloor.src;
	switch(iOrigType){
		case 0:
			sImg = imgWall.src;
			break;
		case 1:
			sImg = imgFloor.src;
			break;
		case 4:
			sImg = imgTarget.src;
			break;
	}
	document.getElementById("i_"+c+"_"+r).src=sImg;
	return;
}

function gridMoveSoko(r,c){
	var iPos;
	var iOldRow;
	var iOldCol;
	var bOkMove;
	var sSokoCoords = this.findSoko();
	if (sSokoCoords!='0'){
		iPos = sSokoCoords.indexOf("_");
		iOldRow = parseInt(sSokoCoords.substring(0,iPos));
		iOldCol = parseInt(sSokoCoords.substring(iPos+1,sSokoCoords.length));
	}
	else {
		iOldRow = -1;
		iOldCol = -1;
	}

	bOkMove = this.checkValidMove(r,c,iOldRow,iOldCol,true);
	if(bOkMove){
		if((iOldRow>-1)||(iOldCol>-1)){
			this.unset(iOldRow,iOldCol);
			this.set(r,c,2);
			return true;
		}
	}

	return false;
}

function gridMoveBoulder(r,c,iNewRow,iNewCol){
	var bOkMove;
	bOkMove = this.checkValidMove(iNewRow,iNewCol,r,c,false);
	if (bOkMove){
		this.unset(r,c);
		this.set(iNewRow,iNewCol,3);
		return true;
	}
	return false;
}

function gridFinished(){
	var bFinished = false;
	for(var i=0;i<this.height;i++){
		for(var j=0;j<this.width;j++){
			if(this.oRows[i].oCells[j].type == 4){
				if(this.oRows[i].oCells[j].currentType == 3){
					bFinished = true;
				}
				else{
					return false;
				}
			}
		}
	}
	return bFinished;
}

function moveSoko(oCell){
if(document.getElementById){
	var sId = oCell.id;
	var iType;
	var iCol;
	var iRow;
	var iPos1;
	var iPos2;
//	gbPull = window.event.ctrlKey;

	//determine cell setType()and coordinates
	iPos1 = sId.indexOf("_")
	iPos2 = sId.indexOf("_",iPos1+1)
	iCol = parseFloat(sId.substring(iPos1+1,iPos2));
	iRow = parseFloat(sId.substring(iPos2+1,sId.length));
	iType = oGrid.detCellType(iRow,iCol);

	if(oGrid.oRows[iRow]){
		if(oGrid.oRows[iRow].oCells[iCol]){
			if(iType!=0){
				oGrid.moveSoko(iRow,iCol);
			}

			//check finished
			if(oGrid.finished()){
				alert("Level Complete");
			}
		}
	}
}
}

function moveSokoGrid(sDir){
	var sSokoCoords = oGrid.findSoko();
	var iType;
	var iPos;
	var iRow;
	var iCol;
	if (sSokoCoords!='0'){
		iPos = sSokoCoords.indexOf("_");
		iRow = parseInt(sSokoCoords.substring(0,iPos));
		iCol = parseInt(sSokoCoords.substring(iPos+1,sSokoCoords.length));
	}
	else {
		alert("Can't find Soko!");
		return false;
	}

	switch(sDir){
		case 'u':
			iRow--;
			break;
		case 'l':
			iCol--;
			break;
		case 'r':
			iCol++;
			break;
		case 'd':
			iRow++;
			break;
	}

	iType = oGrid.detCellType(iRow,iCol);
	if(oGrid.oRows[iRow]){
		if(oGrid.oRows[iRow].oCells[iCol]){
			if(iType!=0){
				oGrid.moveSoko(iRow,iCol);
			}
			//check finished
			if(oGrid.finished()){
				alert("Level Complete");
			}
		}
	}
}

function initGrid(){
	var sImg;
	var i, j, iCellType
	for (i=0;i<oGrid.oRows.length;i++){
		for(j=0;j<oGrid.oRows[i].oCells.length;j++){
			iCellType= oGrid.oRows[i].oCells[j].currentType;
			switch(iCellType){
				case 0:
					if (ie) sImg = imgWall.src;
					break;
				case 1:
					if (ie) sImg = imgFloor.src;
					break;
				case 2:
					if (ie) sImg = imgSoko.src;
					break;
				case 3:
					if (ie) sImg = imgBoulder.src;
					break;
				case 4:
					if (ie) sImg = imgTarget.src;
					break;
				case 5:
					if (ie) sImg = imgBlank.src;
					break;
			}
			document.getElementById("i_"+j+"_"+i).src=sImg;
		}
	}
}

function start(){
	if(document.getElementById){
//		document.getElementById("nsonly").style.visibility="hidden";
//		document.getElementById("ieonly").style.visibility="visible";
		document.getElementById("total").value = aLevels.length;
		var sLoc = this.location.href;
		iIndex = 1;
		setUpLevel(iIndex);
	}
/*	else{
		document.layers.nsonly.visibility="visible";
		document.layers.ieonly.visibility="hidden";
	}*/
}

function setUpLevel(iIndex){
	iIndex = parseInt(iIndex);
	if(document.getElementById){
		if(iIndex<1){
			alert("You are already in the first level");
			return false;
		}
		if(iIndex>aLevels.length){
			alert("You are already in the last level");
			return false;
		}
		giCurrentLevel = iIndex;
		document.getElementById("level").value=(giCurrentLevel);
		var sColor;
		var sChar;
		var sLevel = aLevels[iIndex-1];
		var iCount = 0;
		var iRows = 0;
		var iCells = sLevel.indexOf("_")

		for(var i=0;i<sLevel.length;i++){
			sChar = sLevel.substring(i,i+1);
			if (sChar=="_"){
				iRows++;
			}
		}

		oGrid = new grid(iRows,iCells);
		for (i=0;i<iRowsMax;i++){
			for(var j=0;j<iCellsMax;j++){
				if((i<oGrid.oRows.length)&&(j<oGrid.oRows[i].oCells.length)){
					sChar = sLevel.substring(iCount,iCount+1)
					if(sChar=="_"){
						iCount++;
						sChar = sLevel.substring(iCount,iCount+1);
					}
					switch(sChar){
						case "0":
							oGrid.oRows[i].oCells[j].setType(0);
							break;
						case "1":
							oGrid.oRows[i].oCells[j].setType(1);
							break;
						case "2":
							oGrid.oRows[i].oCells[j].setType(1);
							oGrid.oRows[i].oCells[j].currentType = 2;
							break;
						case "3":
							oGrid.oRows[i].oCells[j].setType(1);
							oGrid.oRows[i].oCells[j].currentType = 3;
							break;
						case "4":
							oGrid.oRows[i].oCells[j].setType(4);
							break;
					}
					iCount++;
				}
				else{
					document.getElementById("i_"+j+"_"+i).src=imgBlank.src;
				}
		/*			if(iCount>=sLevel.length){
					i = oGrid.oRows.length;
					j = oGrid.oRows[i].oCells.length;
				}
	*/		}
		}
		initGrid();
	}
}