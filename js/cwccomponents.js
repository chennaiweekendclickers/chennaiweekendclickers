//Global variable declarations.
var nextreq = 1;
var nextpage = 0;
var req = null;

var cwc = {

//Common template iterations starts
templateIteration : function(nameOfObj,itrObj,parentId,tempId)
{
	if(typeof itrObj == "string" && itrObj.toLowerCase() == "empty"){
		return;
	}
	var ifregex = new RegExp(/if(\([^<]+).+?[^>]+>([^<]+)+/);
	var arrayBrackregx =  new RegExp(/(\[[a-zA-Z_.]+\])/);
	var condValRegex =  new RegExp(/(<[a-zA-Z0-9.]+>)/);
	for(j=0;j<Object.keys(itrObj).length;j++)
	{
		var singleObj = itrObj[Object.keys(itrObj)[j]];
		if(typeof singleObj == "string")
		{
			singleObj = JSON.parse(singleObj);
		}
		/*split pattern regex:: (\{\{[a-zA-Z.]+\}\})*/
		var node = document.getElementById(tempId).innerHTML;
		var spLists = node.split("{{"+nameOfObj+".");
		for(i=0;i<spLists.length;i++)
		{
			if(spLists[i].includes("}}"))
			{
				var key = "{{"+nameOfObj+"."+spLists[i].split("}}")[0]+"}}";
				var val = "";
				if(spLists[i].split("}}")[0].includes("(")){
					val = singleObj[spLists[i].split("}}")[0].replace(/[()]/g,"")];
					console.log("val::::",val);
					val = new Date(parseInt(val)).toDateString();
				}else{
					val = singleObj[spLists[i].split("}}")[0]];
				}
				node = node.replace(key,val);
			}
		}
		if(node.includes("<%if"))
		{
			var ifNodes = node.split("<%");
			for(f=0;f<ifNodes.length;f++)
			{
				var noElseIf = true;
				if(ifNodes[f].includes("if("))
				{
					var condNode = ifNodes[f].split("%>")[0].trim();
					var condts = condNode.split("{");
					if(condNode.includes("else if")){
						noElseIf = false;
					}
					for(c=0;c<condts.length;c++)
					{
						if(arrayBrackregx.test(condts[c]))
						{
							var condKey = condts[c].split(arrayBrackregx)[1];
							var key = condKey.replace("[","").replace("]","").split(".")[1];
							var conVal = singleObj[key];
							if(condts[c].includes("}")){
								condts[c] = condts[c].split("}")[1];
							}
							var macthVal = condts[c].match(condValRegex)[0].replace("<","").replace(">","").trim();
							var ifTagVal = condts[c + 1].split("}")[0];
//							var elseTagVal = condts[c + 2].split("}")[0];
						}
						if(ifregex.test(condts[c]))
						{
							var condtOpr = condts[c].split(" ")[1];
							if(condtOpr == "==" && (conVal == macthVal)){node = node.replace("<%"+condNode+"%>",ifTagVal.trim());}
							else if(condtOpr == "!=" && conVal != macthVal){node = node.replace("<%"+condNode+"%>",ifTagVal.trim());}
							else if(condtOpr == ">" && conVal > macthVal){node=node.replace("<%"+condNode+"%>",ifTagVal.trim());}
							else if(condtOpr == "<" && conVal < macthVal){node=node.replace("<%"+condNode+"%>",ifTagVal.trim());}
							else if(condtOpr == ">=" && conVal >= macthVal){node=node.replace("<%"+condNode+"%>",ifTagVal.trim());}
							else if(condtOpr == "<=" && conVal <= macthVal){node=node.replace("<%"+condNode+"%>",ifTagVal.trim());}
//							else if(noElseIf){node=node.replace("<%"+condNode+"%>",elseTagVal.trim());}
						}
					}
				}
			}
		}
		var div = document.createElement("div");
		div.innerHTML = node;

		if(!document.getElementById(parentId).contains(div.children[0])){
			document.getElementById(parentId).appendChild(div.children[0]);
		}
	}
},
//Template iterations ends.

//show
show : function(eleId){
  var eleNode = document.querySelector(eleId);
  if(eleNode != null)
  {
    eleNode.style.display = "block";
  }
},
//show ends.

//hide
hide : function(eleId){
  var eleNode = document.querySelector(eleId);
  if(eleNode != null)
  {
    eleNode.style.display = "none";
  }
},
//hide ends.

//show and hide
showAndHide : function(eleId){
  var eleNode = document.querySelector(eleId);
  if(eleNode != null)
  {
    var sty = eleNode.style.display;
    if(sty == null || sty == "none"){
      eleNode.style.display = "block";
    }else{
      eleNode.style.display = "none";
    }
  }
},
//show and hide ends.

//remove element starts
removeEle : function(eleId){
  var eleNode = document.querySelector(eleId);
  if(eleNode != null){
    eleNode.remove();
  }
},
//remove element ends.

//Add class starts
addClass : function(eleId,clsName){
  var eleNode = document.querySelector(eleId);
  if(eleNode != null){
    eleNode.className += " "+clsName;
  }
},
//Add class ends.

//remove class starts
removeClass : function(eleId,clsName){
  var eleNodes = document.querySelectorAll(eleId);
  if(eleNodes != null && eleNodes != undefined && eleNodes.length > 0)
  {
    for(var i=0;i<eleNodes.length;i++)
    {
      eleNodes.classList.remove(clsName);
    }
  }
},
//remove class ends.

//Get more data when page riched bottom
moreData : function(uri,page,start,loadEleId,params,callback)
{
	req = null;
	if(uri != null && uri != "" && uri != undefined && uri != "null")
	{
		$(loadEleId).unbind("click");
		$(loadEleId).click(function()
		{
			page = parseInt(page);
			if(req ==  null)
			{
				req = $.get(uri+"&page="+page,params,function(response)
				{
					if(callback!=undefined && callback!=="" && typeof(callback)=="function")
					{
						callback(response);
						$(loadEleId).scrollTop(0);
						if(uri.includes("getPhotos")){
							nextreq = response.photos.photo.length;
						}else if(uri.includes("discuss")){ //No I18N
							nextreq = response.topics.topic;
						}
						if(response.stat.toLowerCase() == "ok")
						{
							if(nextreq >= 20)
							{
								page++;
								nextpage = page;
							}
						}
					}
				});
			}
			else
			{
				if(nextreq >= 20)
				{
					req = $.get(uri+"&page="+nextpage,params,function(response)
					{
						if(callback!=undefined && callback!=="" && typeof(callback)=="function")
						{
							callback(response);
							var scrTop = document.querySelector(loadEleId).scrollTop;
							var hei = document.querySelector(loadEleId).clientHeight;
							document.querySelector(loadEleId).scrollTop = scrTop - hei + 100;

//						$(loadEleId).scrollTop(10600);
							if(uri.includes("getPhotos")){
								nextreq = response.photos.photo.length;
							}else if(uri.includes("discuss")){ //No I18N
								nextreq = response.topics.topic;
							}
							if(response.stat.toLowerCase() == "ok")
							{
								req.abort();
								if(nextreq >= 20)
								{
									nextpage++;
								}
							}
						}
					});
				}
			}
		});
	}
	else
	{
		$(loadEleId).unbind("click");
		nextpage = 0;
		nextreq = 0;
	}
},
//Get more data from page riched bottom ends.

//common request trigger Starts
sendReq : function(uri,reqtype,params,callback)
{
	if((reqtype != null && uri != null && callback != null) && (reqtype != "" && uri != "" && callback != ""))
	{
		$.ajax({type:reqtype,url:uri,data:params,success:function(response)
			{
				if(callback!=undefined && callback!=="" && typeof(callback)=="function")
				{
					var data;
					try
					{
						data = JSON.parse(response)
					}
					catch(e)
					{
						data = response;
					}
					callback(data);
				}
				return response;
			},
			error:function(errRes)
			{
				return false;
			}
		});
	}
	return "empty"; //NO I18N
},
//common request trigger ends.

//Gallery page load iterations starts
homeGalleryLoader : function(res)
{
		if(res.stat == "ok")
		{
			var photos = res.photos.photo;
			cwc.templateIteration("photo",photos,"gallery-mainContainer","galleryTemp");
		}
},
//Gallery page load iterations ends.

//Full view gallery loader function starts
galleryLoader : function(res)
{
		if(res.stat == "ok")
		{
			var photos = res.photos.photo;
			cwc.templateIteration("photo",photos,"galTabMainCont","galleryTemp");
			if(Object.keys(photos).length >= 20){
					var uri = "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=93ea6dcf26a117a857f809036b0a8602&group_id=1217703@N22&nojsoncallback=1&format=json&per_page=20";
					cwc.moreData(uri,2,1,"#loadMoreImg",null,function(response){cwc.templateIteration("photo",response.photos.photo,"galTabMainCont","galleryTemp")});
			}
		}
},
//Full view gallery loader function ends.

//Descussions template iterations starts
discussionLoader : function(res)
{
		if(res.stat == "ok")
		{
			var discussObj = res.topics.topic;
			for(var i=0;i<Object.keys(discussObj).length;i++)
			{
					var discObj = discussObj[i];
					if(discObj.is_sticky == "1")
					{
						var stikyTemp = document.getElementById("stickyNoteTemp").innerHTML;
						stikyTemp = stikyTemp.replace(/{{subjectMes}}/,discObj.subject);
						stikyTemp = stikyTemp.replace(/{{author}}/,discObj.authorname);
						var div = document.createElement("div");
						div.innerHTML = stikyTemp;
						document.getElementById("stickyMainCont").appendChild(div.children[0]);
					}
			}
		}
}
//Descussions template iterations ends.

}
