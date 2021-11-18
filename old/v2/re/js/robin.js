//The following five functions handle the menu functionality
function toggleMenu(el,vis){
	obj = document.getElementById(el);
	obj.style.visibility = vis;
}

function mOverDiv(obj){
	obj.style.backgroundColor="#FF9900";	
	obj.style.color="#000000";
}

function mOutDiv(obj){
	obj.style.backgroundColor="#000000";
	obj.style.color="#FF9900";
}

function mOverA(obj){
	obj.style.backgroundColor="#FF9900";	
	obj.style.color="#000000";
}

function mOutA(obj){
	obj.style.backgroundColor="#000000";
	obj.style.color="#FF9900";
}

//Only really used in prep_2.htm
function loadShort(sName)
{
	window.open(sName,'STORY','height=300,width=500,scrollbars=1');
}

var wThumb;
function loadThumb(sThumb){
	if (wThumb){
		if(!wThumb.closed){
			wThumb.close();
		}
	}
	wThumb = window.open("re/pictures/"+sThumb,"photos","screenX=100,screenY=100,innerHeight=500,innerWidth=500,scrollbars=yes");
}

function loadPage(sPage){
	window.open(sPage);
}

function loadPageSize(sPage,sHeight,sWidth){
	window.open(sPage,"new","screenX=100,screenY=100,innerHeight="+sHeight+",innerWidth="+sWidth+",scrollbars=yes");
}

