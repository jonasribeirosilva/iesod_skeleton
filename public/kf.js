var kf={version:'1.1',sizeObj:function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key))size++;}
return size;},maskNFSE:function(value){var valor=unmask(value);if(valor.length>=5){var ano=valor.substring(0,4);var numNFse=parseInt(valor.substring(4,15));return ano+'/'+numNFse;}else{return value;}},unmaskNFSE:function(value){var valor=unmask(value);if(valor.length>=5){var ano=valor.substring(0,4);var numNFse=''+valor.substring(4,15);var pad="00000000000";numNFse=pad.substring(0,pad.length-numNFse.length)+numNFse;return ano+numNFse;}else{return value;}},unmask:function(value,onlyNumber){if(typeof onlyNumber=='undefined'||!onlyNumber){var regExp=new RegExp('([0-9a-zA-Z]+)','g');}else{var regExp=new RegExp('([0-9]+)','g');}
value=value+'';valueArray=value.match(regExp);if(valueArray!=null){value=valueArray.join('');}else{value='';}
return value;},mask:function(value,mask,onlyNumber,limited){if(typeof onlyNumber=='undefined'||!onlyNumber)
var onlyNumber=false;if(typeof limited=='undefined'||!limited)
var limited=false;value=kf.unmask(value,onlyNumber);if(typeof mask=='function'){return mask(value,limited);}
var regExp=new RegExp('([9]+)','g');mask1Array=mask.match(regExp);if(mask1Array!=null){mask1=mask1Array.join('');}else{mask1='';}
mask1Array=mask1.split("");maskArray=mask.split("");valueArray=value.split("");var i1=0;var ret='';$.each(maskArray,function(indice,digitoMask){if(typeof valueArray[i1]!='undefined'){if(digitoMask=='9'){if(typeof valueArray[i1]!='undefined'){ret=ret+valueArray[i1];i1=parseInt(i1+1);}}else{ret=ret+digitoMask;}}});if(!limited&&mask1Array.length<valueArray.length){ret=ret+value.substring(mask1Array.length);}
return ret;},maskCPF:function(value){return kf.mask(value,'999.999.999-99',true,true);},maskCNPJ:function(value){return kf.mask(value,'99.999.999/9999-99',true,true);},maskCPFCNPJ:function(value){value=kf.unmask(value,true);if(value.length<=11){return kf.mask(value,'999.999.999-99',true,true);}else{return kf.mask(value,'99.999.999/9999-99',true,true);}},maskTel:function(value){if(value[0]=='+'){value='+'+kf.unmask(value);}else{value=kf.unmask(value);}
var regExp=new RegExp('^((([0][38][0]{2})([0-9]{3})([0-9]{4}))|((([0][0]|[+])([1-9]+))?([0]?[0-9]{2})?([0-9]{4,5})([0-9]{4})))(.*)');var result=value.match(regExp);var saida='';if(result!=null){if(typeof result[1]!='undefined'&&typeof result[2]!='undefined'){var PrefEspecial=result[3];var NUM_A=result[4];var NUM_B=result[5];if(typeof result[13]!='undefined')
NUM_B=NUM_B+result[13]
saida=PrefEspecial+' '+NUM_A+' '+NUM_B;}else if(typeof result[6]!='undefined'){var DDI=result[9];var DDD=result[10];var NUM_A=result[11];var NUM_B=result[12];if(typeof result[13]!='undefined')
NUM_B=NUM_B+result[13]
if(typeof DDI!='undefined'){saida=saida+'+'+DDI;}else{}
if(typeof DDD!='undefined'){saida=saida+' ('+DDD+') ';}else{}
saida=saida+NUM_A+'-'+NUM_B;}}else{saida=value;}
return saida;},maskfield:function(field,mask,onlyNumber,limited){var obj=$(field);var value=obj.val();if(typeof mask=='undefined'&&typeof(obj.attr('data-mask'))!='undefined'){obj.val(mask(value,obj.attr('data-mask')));}else if(typeof mask!='undefined'){if(typeof mask=='function'){obj.val(mask(value));}else{obj.val(kf.mask(value,mask,onlyNumber,limited));}}
obj.keyup(function(event){kc=event.keyCode;var mascarar=false;mascarar=((kc>=65&&kc<=90)||(kc>=96&&kc<=105)||(kc>=48&&kc<=57)||(kc>=189&&kc<=194)||(kc>=109&&kc<=111)||(kc>=219&&kc<=222));if(!mascarar){$.each([13,186,187,194,106,107,229,8],function(indice,kc1){if(kc==kc1){mascarar=true;}});}
if(mascarar){value=$(this).val();if(typeof mask=='undefined'&&typeof($(this).attr('data-mask'))!='undefined'){value=mask(value,$(this).attr('data-mask'));}else if(typeof mask!='undefined'){if(typeof mask=='function'){value=mask(value);}else{value=kf.mask(value,mask,onlyNumber,limited);}}
$(this).val(value);}
return false;});},maskByExpression:function(expression,value){if(typeof value=='undefined'||value==null){var value='';}
if(typeof expression=='undefined'||expression=='<Value>'||expression==null){return value;}
var regExp=new RegExp('(^[a-zA-Z][0-9a-zA-Z_.]+)\\((.*)\\)$|(^.*$)');var regs=expression.match(regExp);if(typeof regs[3]!='undefined'){return regs[3].replace("<Value>",value);}
var ret="";switch(regs[1]){case'date':ret=regs[2].replace(/<Value>/g,value);ret=kf.datetime.dbTobr(ret,false);break;case'datetime':ret=regs[2].replace(/<Value>/g,value);ret=kf.datetime.dbTobr(ret,true);break;case'nil':ret='&nbsp;';break;case'tel':ret=regs[2].replace(/<Value>/g,value);ret=kf.maskTel(ret);break;case'nfse':ret=regs[2].replace(/<Value>/g,value);ret=kf.maskNFSE(ret);break;case'cpf':ret=regs[2].replace(/<Value>/g,value);ret=kf.maskCPF(ret);break;case'cnpj':ret=regs[2].replace(/<Value>/g,value);ret=kf.maskCNPJ(ret);break;case'cpfcnpj':ret=regs[2].replace(/<Value>/g,value);ret=kf.maskCPFCNPJ(ret);break;case'mask':ret=kf.mask(value,regs[2]);break;case'unmask':ret=kf.unmask(value);break;case'nohtml':valor=value.replace(/<.*?>/g,'');ret=kf.maskByExpression(regs[2],valor);break;case'nobr':ret="<nobr>"+kf.maskByExpression(regs[2],value)+"</nobr>";break;case'classcss':var regExp=new RegExp('^(.*),(.*)$');var r1=regs[2].match(regExp);if(typeof r1=='undefined'||r1==null){ret=kf.maskByExpression(regs[2],value);}else{ret='<span class="'+r1[1]+'">'+kf.maskByExpression(r1[2],value)+"</span>";}
break;case'eval':ret=regs[2].replace(/<Value>/g,value);ret=eval(ret);break;case'number':var regExp=new RegExp('^(.*),(.*)$');var r1=regs[2].match(regExp);if(typeof r1=='undefined'||r1==null){numero=regs[2].replace(/<Value>/g,value);dec=0;}else{if(typeof r1[1]!='undefined'&&typeof r1[2]!='undefined'){if(r1[2]==''){numero=r1[1].replace(/<Value>/g,value);dec=0;}else{numero=r1[1].replace(/<Value>/g,value);dec=r1[2];}}else{numero=r1[1].replace(/<Value>/g,value);dec=0;}}
ret=kf.formatNumber(numero,dec,'',',');break;case'percento':var regExp=new RegExp('^(.*),(.*)$');var r1=regs[2].match(regExp);if(typeof r1=='undefined'||r1==null){numero=regs[2].replace(/<Value>/g,value);dec=0;}else{if(typeof r1[1]!='undefined'&&typeof r1[2]!='undefined'){if(r1[2]==''){numero=r1[1].replace(/<Value>/g,value);dec=0;}else{numero=r1[1].replace(/<Value>/g,value);dec=r1[2];}}else{numero=r1[1].replace(/<Value>/g,value);dec=0;}}
ret=kf.formatNumber(numero,dec,'',',')+'%';break;case'money':ret=regs[2].replace(/<Value>/g,value);ret=kf.formatMoney(ret);break;case'switch':var regExp=new RegExp('^\\{(.*)\\},\\{(.*)\\},(.*)$');var regs1=regs[2].match(regExp);if(regs1==null){return value;}
var options=regs1[1].split(',');var acoes=regs1[2].split(',');var v=value.split(':');if(typeof v[1]!='undefined'){v[1]=kf.maskByExpression(regs1[3],v[1]);}else{v[1]=kf.maskByExpression(regs1[3],v[0]);}
optionEncontrada=false;$.each(options,function(i,o){if(v[0].toLowerCase()==o.toLowerCase()|((typeof v[1]!='undefined')&&v[1].toLowerCase()==o.toLowerCase())){ret=kf.maskByExpression(acoes[i],v[1]);optionEncontrada=true;}});if(optionEncontrada==false){ret=v[1];}
break;default:ret=kf.maskByExpression(regs[2],value);break;}
return ret;},datetime:{dbTobr:function(value,returnTime){var regExp=new RegExp('(([0-9]{4})-([0-9]{1,2})-([0-9]{1,2}))[ |T]([0-9]{2}:[0-9]{2}:[0-9]{2})|(([0-9]{4})-([0-9]{1,2})-([0-9]{1,2}))');var regs1=value.match(regExp);if(regs1==null){return value;}
if(typeof returnTime=='undefined'){var returnTime=true;}
if(typeof regs1[1]!='undefined'){var ret=regs1[4]+'/'+regs1[3]+'/'+regs1[2];if(returnTime)
ret=ret+' '+regs1[5];return ret;}
if(typeof regs1[6]!='undefined'){var ret=regs1[9]+'/'+regs1[8]+'/'+regs1[7];if(returnTime)
ret=ret+' 00:00:00';return ret;}else{return value;}},brTodb:function(value,returnTime,separador){var regExp=new RegExp('(([0-9]{1,2})/([0-9]{1,2})/([0-9]{4}))[ |T]([0-9]{2}:[0-9]{2}:[0-9]{2})|(([0-9]{1,2})/([0-9]{1,2})/([0-9]{4}))');var regs1=value.match(regExp);if(regs1==null){return value;}
if(typeof returnTime=='undefined'){var returnTime=true;}
if(typeof separador=='undefined'){var separador=' ';}
if(typeof regs1[1]!='undefined'){var ret=regs1[4]+'-'+regs1[3]+'-'+regs1[2];if(returnTime)
ret=ret+separador+regs1[5];return ret;}
if(typeof regs1[6]!='undefined'){var ret=regs1[9]+'-'+regs1[8]+'-'+regs1[7];if(returnTime)
ret=ret+separador+'00:00:00';return ret;}else{return value;}},toObject:function(value,returnNow){var regExp=new RegExp('(([0-9]{1,2})/([0-9]{1,2})/([0-9]{4}))([ ]([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))?|(([0-9]{4})-([0-9]{1,2})-([0-9]{1,2}))([ ]([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))?');var regs1=value.match(regExp);var ret={day:null,month:null,year:null,dayWeek:null,hour:null,minute:null,second:null,dateBR:null,dateUS:null,time:null};if(typeof returnNow!='undefined'&&returnNow==true){var d=new Date();var ret1={day:d.getDate(),month:d.getMonth()+1,year:d.getFullYear(),dayWeek:d.getDay(),hour:d.getHours(),minute:d.getMinutes(),second:d.getSeconds(),dateBR:null,dateUS:null,time:null};if(ret1.day!=null&&ret1.day<10)
ret1.day='0'+ret1.day;if(ret1.month!=null&&ret1.month<10)
ret1.month='0'+ret1.month;if(ret1.hour!=null&&ret1.hour<10)
ret1.hour='0'+ret1.hour;if(ret1.minute!=null&&ret1.minute<10)
ret1.hour='0'+ret1.minute;if(ret1.second!=null&&ret1.second<10)
ret1.hour='0'+ret1.second;ret1.dateBR=ret1.day+'/'+ret1.month+'/'+ret1.year;ret1.dateUS=ret1.year+'-'+ret1.month+'-'+ret1.day;ret1.time=ret1.hour+':'+ret1.minute+':'+ret1.second;}else{ret1=ret;}
if(regs1==null){return ret1;}
if(typeof regs1[1]!='undefined'){ret.day=regs1[2];ret.month=regs1[3];ret.year=regs1[4];if(typeof regs1[5]!='undefined'){ret.hour=regs1[6];ret.minute=regs1[7];ret.second=regs1[8];ret.time=regs1[5];}}else if(typeof regs1[9]!='undefined'){ret.year=regs1[10];ret.month=regs1[11];ret.day=regs1[12];if(typeof regs1[13]!='undefined'){ret.hour=regs1[14];ret.minute=regs1[15];ret.second=regs1[16];ret.time=regs1[13];}}
if(parseInt(ret.year)==0||parseInt(ret.month)==0||parseInt(ret.day)==0){var d=new Date();}else{var d=new Date(ret.year,ret.month,ret.day,ret.hour,ret.minute,ret.second,0);}
ret.day=d.getDate();ret.month=d.getMonth();ret.year=d.getFullYear();ret.dayWeek=d.getDay();ret.hour=d.getHours();ret.minute=d.getMinutes();ret.second=d.getSeconds();ret.dateBR=null;ret.dateUS=null;ret.time=null
if(ret.day!=null&&ret.day<10)
ret.day='0'+ret.day;if(ret.month!=null&&ret.month<10)
ret.month='0'+ret.month;if(ret.hour!=null&&ret.hour<10)
ret.hour='0'+ret.hour;if(ret.minute!=null&&ret.minute<10)
ret.minute='0'+ret.minute;if(ret.second!=null&&ret.second<10)
ret.second='0'+ret.second;ret.dateBR=ret.day+'/'+ret.month+'/'+ret.year;ret.dateUS=ret.year+'-'+ret.month+'-'+ret.day;ret.time=ret.hour+':'+ret.minute+':'+ret.second;return ret;},diffDays:function(date1,date2){if(typeof date1=='string'){date1=new Date(date1);}else if(typeof date1=='undefined'){date1=new Date();}
if(typeof date2=='string'){date2=new Date(date2);}else if(typeof date2=='undefined'){date2=new Date();}
let utc1=Date.UTC(date1.getFullYear(),date1.getMonth(),date1.getDate());let utc2=Date.UTC(date2.getFullYear(),date2.getMonth(),date2.getDate());let ms=1000*60*60*24;return Math.floor((utc2-utc1)/ms);}},numberToFloat:function(value){value=kf.formatNumber(value,10,'','.');if(value=='')
value=0;return parseFloat(value);},formatNumber:function(value,dec,sepMil,sepDec){value=value+'';if(typeof sepMil=='undefined'){var sepMil='.';}
if(typeof sepDec=='undefined'){var sepDec=',';}
value=value.replace(/[a-zA-Z _$]/g,'');value=value.replace(/\./g,',');var retValue=value.match(new RegExp('(.*)[,]([0-9]+)$'))
if(typeof retValue!='undefined'&&retValue!=null){value=retValue[1].replace(/\,/g,'');value=value+','+retValue[2];}
var regExp=new RegExp('^([0-9]+)[,]([0-9]{0,'+dec+'}).*$');var reg2=value.match(regExp);if(typeof reg2=='undefined'||reg2==null){return value;}else{if(typeof reg2[1]!='undefined'&&typeof reg2[2]!='undefined'){var valInt=reg2[1];if(sepMil!=''){for(var i=0;i<parseInt(valInt.length/3);i++){valInt=valInt.replace(/([0-9]+)([0-9]{3})/,'$1'+sepMil+'$2');}}
if(reg2[2]==''){return valInt;}else{return valInt+sepDec+reg2[2];}}else{return value;}}},formatMoney:function(value,simbolMoney,dirSimbol,dec,sepMil,sepDec){if(typeof simbolMoney=='undefined')
var simbolMoney='$';if(typeof dirSimbol=='undefined')
var dirSimbol=0;if(typeof dec=='undefined')
var dec=2;if(typeof sepMil=='undefined')
var sepMil='';if(typeof sepDec=='undefined')
var sepDec=',';value=kf.formatNumber(value,dec,sepMil,sepDec);if(dirSimbol==0){value=simbolMoney+' '+value;}else{value=value+' '+simbolMoney;}
return value;},roundNumber:function(value,dec,typeRound){if(typeof dec=='undefined')
var dec=0;if(typeof typeRound=='undefined')
var typeRound=0;value=kf.numberRealToFloat(value);var multP=Math.pow(10,dec);value=value*multP;var modi=value%1;value=value-modi;if(typeRound!=2&&((typeRound==1&&modi>0)||modi>=0.5)){value=value+1;}
return(value/multP);},validaCPF:function(cpf){cpf=kf.unmask(cpf);if(cpf.length!=11)return false;var nonNumbers=/\D/;if(nonNumbers.test(cpf))return false;if(cpf=="00000000000"||cpf=="11111111111"||cpf=="22222222222"||cpf=="33333333333"||cpf=="44444444444"||cpf=="55555555555"||cpf=="66666666666"||cpf=="77777777777"||cpf=="88888888888"||cpf=="99999999999")
return false;var a=[];var b=new Number;var c=11;for(var i=0;i<11;i++){a[i]=cpf.charAt(i);if(i<9)b+=(a[i]* --c);}
if((x=b%11)<2){a[9]=0;}else{a[9]=11-x;}
b=0;c=11;for(var y=0;y<10;y++)b+=(a[y]*c--);if((x=b%11)<2){a[10]=0;}else{a[10]=11-x;}
if((cpf.charAt(9)!=a[9])||(cpf.charAt(10)!=a[10]))return false;return true;},validaCNPJ:function(cnpj){cnpj=kf.unmask(cnpj);if(cnpj.length!=14)return false;var nonNumbers=/\D/;if(nonNumbers.test(cnpj))return false;if(cnpj=="00000000000000"||cnpj=="11111111111111"||cnpj=="22222222222222"||cnpj=="33333333333333"||cnpj=="44444444444444"||cnpj=="55555555555555"||cnpj=="66666666666666"||cnpj=="77777777777777"||cnpj=="88888888888888"||cnpj=="99999999999999")
return false;var numeroAtual=new Number;var d1=new Number;var d2=new Number;for(var i=0;i<12;i++){numeroAtual=cnpj.charAt(11-i);d1+=numeroAtual*((i<8)?(i+2):(i-6));d2+=numeroAtual*((i<7)?(i+3):(i-5));}
d1=11-(d1%11);if(d1>=10)d1=0;d2+=d1*2;d2=11-(d2%11);if(d2>=10)d2=0;return((cnpj.charAt(12)==d1)&&(d2==cnpj.charAt(13)));},validaCpfCnpj:function(cpfcnpj){valor=kf.unmask(cpfcnpj);if(valor.length<=11){if(kf.validaCPF(valor))
return{'value':valor,'text':kf.mask(valor,'999.999.999-99'),'type':'CPF','valid':true};return{'value':valor,'text':kf.mask(valor,'999.999.999-99'),'type':'CPF','valid':false};}else{if(kf.validaCNPJ(valor))
return{'value':valor,'text':kf.mask(valor,'99.999.999/9999-99'),'type':'CNPJ','valid':true};return{'value':valor,'text':kf.mask(valor,'99.999.999/9999-99'),'type':'CNPJ','valid':false};}},isFieldRequired:function(field){return(typeof $(field).attr('required')!="undefined");},isFieldValid:function(field,skipOpcional){if(typeof skipOpcional!='undefined'&&skipOpcional){if(!$(field).isFieldRequired())return true;}
if(typeof $(field).attr('pattern')=='undefined'){var patternDoCampo=new RegExp('(.+)');}else{var patternDoCampo=new RegExp($(field).attr('pattern'));}
var valor=$(field).val();if(!(patternDoCampo.test(valor))){return false;}else{return true;}},formValid:function(elmForm){var formulario=$(elmForm);var idForm=$(elmForm).attr('id');var campos=$('#'+idForm+' input');var logError=[];$.each(campos,function(indice,campo){if(!kf.isFieldValid(campo,true)){$(campo).css('borderColor','#F00');logError.push($(campo).attr('id'));}else{$(campo).css('borderColor','initial');}});return logError;},dataToForm:function(elmForm,data,parentObject){var obj=$(elmForm);switch(typeof data){case'object':$.each(data,function(index,dataA){if(typeof parentObject=='undefined'){parentA=index;}else{parentA=parentObject;if(typeof index=='string'){parentA+="["+index+"]";}else{parentA+="[]";}}
kf.dataToForm(elmForm,dataA,parentA);});break;case'function':break;case'undefined':break;default:if(typeof parentObject!='undefined'){var nomeField='';var i=document.createElement('input');i.setAttribute('type','hidden');i.setAttribute('name',parentObject);i.setAttribute('value',data);elmForm.appendChild(i);}
break;}},rollElementToId:function(theElement,idRoll,ms){if(typeof ms=='undefined'){var ms=500;}
$(theElement).animate({scrollTop:$('#'+idRoll).offset().top},ms);},rollToId:function(idRoll,ms){if(typeof ms=='undefined'){var ms=500;}
$('html, body').animate({scrollTop:$('#'+idRoll).offset().top},ms);},rollToElement:function(theElement,ms,inElement){if(typeof ms=='undefined'){var ms=500;}
if(typeof inElement=='undefined'){var inElement='html, body';var position=$(theElement).offset();}else{var position=$(theElement).position();}
$(inElement).animate({scrollTop:position.top},ms);},rollToTop:function(ms,inElement){if(typeof ms=='undefined'){var ms=500;}
if(typeof inElement=='undefined'){var inElement='html, body';}
$(inElement).animate({scrollTop:0},ms);},queryCEP:function(value,fncSuccess,fncFailed){value=kf.unmask(value)+'';if(value.length>=8){if(typeof fncSuccess!='function'){var fncSuccess=function(data){console.log(data);};}
if(typeof fncFailed!='function'){var fncFailed=function(xhr,ajaxOptions,thrownError){console.log(thrownError);};}
$.ajax({url:'http://api.postmon.com.br/v1/cep/'+value,dataType:'JSON',type:'GET',success:fncSuccess,error:fncFailed});}},ajaxJSON:function(url,data,options){if(typeof options=="undefined"){var options={};}
if(typeof options.method=="undefined"){options['method']='POST';}
if(typeof options.fncSuccess!="function"){options['fncSuccess']=function(data){console.log(data);};}
if(typeof options.fncError!="function"){options['fncError']=function(data){console.log(data);};}
if(typeof options.fncFailed!="function"){options['fncFailed']=function(xhr,ajaxOptions,thrownError){console.log(xhr.status,xhr.statusText,thrownError);};}
return $.ajax({url:url,dataType:'json',type:options.method,data:data,success:function(data){if(data.status){options.fncSuccess(data);}else{options.fncError(data);}},error:options.fncFailed});},ajaxJSONForm:function(idForm,options){var objForm=$('#'+idForm);if(typeof options=="undefined"){var options={};}
if(typeof options.method=="undefined"){options['method']=$(this).attr('method');}
if(typeof options.idProgressBar=="undefined"){options['idProgressBar']=null;}
if(typeof options.optionsProgressBar=="undefined"){options['optionsProgressBar']={'current':0,'max':100,'showText':true,'viewOnlyPercent':true,'style':'progress-bar-success','open':true};}
if(typeof options.fncSuccess!="function"){options['fncSuccess']=function(data){console.log(data);};}
if(typeof options.fncProgress!="function"){options['fncProgress']=function(options,percentLoaded,loaded,total){if(percentLoaded==null){if(options.idProgressBar!=null){$('#'+options.idProgressBar).html('Aguarde...');}}else{if(options.idProgressBar==null){options['optionsProgressBar'].current=percentLoaded;$.progbar(options['optionsProgressBar']);if(percentLoaded==100)
$.progbar('close');}else{if(typeof options['progressBar']=='undefined'||options['progressBar']==null){$('#'+options.idProgressBar).html('');options['optionsProgressBar'].current=percentLoaded;options['progressBar']=new progressbar($('#'+options.idProgressBar),options['optionsProgressBar']);options['progressBar'].open();}else{options['progressBar'].setCurrent(percentLoaded);}
if(percentLoaded==100){$('#'+options.idProgressBar).html('<span class="text-success">Concluído!</span>');}}}};}
if(typeof options.fncError!="function"){options['fncError']=function(dataReturn){jsdialog.setSettings({title:'Error','text':dataReturn.strError,type:'danger',extend:false,onClose:function(){},buttons:{}}).open();};}
if(typeof options.fncFailed!="function"){options['fncFailed']=function(xhr,ajaxOptions,thrownError){if(xhr.status==200){return true;}
jsdialog.setSettings({title:'Error de comunicação','text':'('+xhr.status+') '+xhr.statusText,type:'danger',extend:false,onClose:function(){},buttons:{}}).open();};}
options['url']=(typeof objForm.attr('action')=='undefined')?"#":objForm.attr('action');options['enctype']=(typeof objForm.attr('enctype')=='undefined')?'multipart/form-data':objForm.attr('enctype');var dataSend=new FormData(document.getElementById(idForm));var inRequest=true;if(typeof options.fncXHR!="function"&&typeof options.sendFile!="undefined"&&options.sendFile){options.enctype='application/x-www-form-urlencoded';options['method']="POST";options['fncXHR']=function(){var xhr=new window.XMLHttpRequest();if(inRequest){xhr.upload.addEventListener('progress',function(evt){if(evt.lengthComputable){var percentComplete=evt.loaded/evt.total;var perc=parseInt(percentComplete*100);options['fncProgress'](options,perc,evt.loaded,evt.total);}else{options['fncProgress'](options,null);}},false);}else{$.progbar('close');}
return xhr;};}else{options['fncXHR']=function(){var xhr=new window.XMLHttpRequest();return xhr;};}
return $.ajax({type:options.method,dataType:'JSON',enctype:options.enctype,processData:false,contentType:false,url:options.url,data:dataSend,xhr:options.fncXHR,success:function(data){inRequest=false;options['fncProgress'](options,100);if(data.status){options.fncSuccess(data);}else{options.fncError(data);}},error:options.fncFailed});}};class progressbar{constructor(theElement,settings){if(typeof theElement=='undefined')
var theElement=null;this.theElement=theElement;if(typeof settings=='undefined')
var settings={};this.settings={'title':"",'current':0,'max':100,'showText':true,'viewOnlyPercent':false,'open':true,'style':'progress-bar-success','isOpen':false};$.extend(this.settings,settings);this.events={onSetCurrent:{},onOpen:{},onClose:{}};if(this.settings.open)
this.open();}
open(){this.settings.open=true;this.create();$.each(this.events.onOpen,function(index,fnc){if(typeof fnc=='function')
fnc(current);});}
close(){this.settings.open=false;this.settings.isOpen=false;$.each(this.events.onClose,function(index,fnc){if(typeof fnc=='function')
fnc(current);});}
setSettings(settings){$.extend(this.settings,settings);}
setCurrent(current){console.log(current);this.onSetCurrent(current);}
addEvent(tEvent,fnc){let i=kf.sizeObj(this.events[tEvent]);this.events[tEvent][i]=fnc;}
onSetCurrent(current){if(typeof current=='undefined')
var current=this.settings.current;this.settings.current=current;$.each(this.events.onSetCurrent,function(index,fnc){if(typeof fnc=='function')
fnc(current);});this.create();}
create(){let vProg=parseInt(this.settings.current*100/this.settings.max);var html='';html=html+'<div class="progress">';html=html+'<div class="progress-bar '+this.settings.style+'"';html=html+' role="progressbar"';html=html+' aria-valuenow="'+vProg+'"';html=html+' aria-valuemin="0"';html=html+' aria-valuemax="100"';html=html+' style="width: '+vProg+'%"';html=html+'><span data-id="text">';var textProgress="";if(this.settings.showText){if(this.settings.viewOnlyPercent){textProgress=textProgress+vProg+'%';}else{textProgress=textProgress+this.settings.current+' de '+this.settings.max+' ('+vProg+'%)';}
html=html+textProgress;}
html=html+'</span></div>';html=html+'</div>';if(this.theElement!=null){if($(this.theElement).children(".progress").size()==0||$(this.theElement).children(".progress").css('display')=='none')
this.settings.isOpen=false;}else{this.settings.isOpen=($('#jsdialog').size()>0)&&($('#jsdialog').css('display')!='none');}
if(this.settings.open){if(!this.settings.isOpen){this.settings.isOpen=true;if(this.theElement!=null){$(this.theElement).hide();$(this.theElement).html(html);$(this.theElement).show(400);}else{jsdialog.setSettings({title:this.settings.title,text:"<div id=\"dvProgressModal\">"+html+"</div>",type:'error'}).open();}}else{if(this.theElement!=null){var objProgBar=$(this.theElement).children('.progress').children('.progress-bar');objProgBar.attr('aria-valuenow',vProg);objProgBar.css({width:vProg+'%'});$(objProgBar).children('span[data-id=text]').text(textProgress);}else{var objProgBar=$('#dvProgressModal').children('.progress').children('.progress-bar');objProgBar.attr('aria-valuenow',vProg);objProgBar.css({width:vProg+'%'});$(objProgBar).children('span[data-id=text]').text(textProgress);}}}else{if(this.theElement!=null){$(this.theElement).hide();$(this.theElement).html('');}else{jsdialog.close();}}}}
var Forms={forms:{},createForm:function(idForm,fields){if(typeof idForm=='undefined')
var idForm='default';if(typeof fields=='undefined')
var fields={};if(typeof Forms.forms[idForm]!='undefined')
return true;Forms.forms[idForm]={idForm:idForm,fields:fields,validarField:function(idField){return Forms.validarField(idForm,idField);},getData:function(){return Forms.getData(idForm);},validar:function(){return Forms.validar(idForm);},addField:function(idField,required,fncValida){return Forms.addField(idForm,idField,required,fncValida);}};return true;},addField:function(idForm,idField,required,fncValida){if(typeof idForm=='undefined')
var idForm='default';if(typeof idField=='undefined')
return false;if(typeof required=='undefined')
var required=false;if(typeof fncValida=='undefined')
var fncValida=null;if(typeof Forms.forms[idForm]=='undefined')
Forms.createForm(idForm);Forms.forms[idForm].fields[idField]={idField:idField,fncValida:fncValida,required:required};},validarField:function(idForm,idField){if(typeof idForm=='undefined')
var idForm='default';if(typeof idField=='undefined')
return true;if(typeof Forms.forms[idForm]=='undefined'||typeof Forms.forms[idForm].fields[idField]=='undefined'||!Forms.forms[idForm].fields[idField].required)
return true;if(!kf.isFieldValid("#field_"+idField))
return false;if(typeof Forms.forms[idForm].fields[idField].fncValida=='function'&&!Forms.forms[idForm].fields[idField].fncValida($("#field_"+idField).val()))
return false;return true;},getData:function(idForm){if(typeof idForm=='undefined')
var idForm='default';if(typeof Forms.forms[idForm]=='undefined')
return{};var data={};$.each(Forms.forms[idForm].fields,function(idField,field){var fName=$("#field_"+idField).attr('name');if(typeof fName!='undefined'){var isArrayField=(fName.substr(-2)=='[]');if(isArrayField){fName=fName.substr(0,fName.length-2);}
var fValue=$("#field_"+idField).val();var fType=$("#field_"+idField).attr('data-type');if(typeof fType=='undefined'){var fType='text';}
switch(fType){case'fMoney':case'fNumber':case'number':fValue=$.numberBRToFloat(fValue);break;case'fCep':case'fTel':case'fCpfcnpj':case'fCidade':case'fCFOP':case'fSelecionaentidade':fValue=fValue.replace(/[^0-9]/g,'');break;default:break;}
if(isArrayField){if(typeof data[fName]!='object'){data[fName]=[fValue];}else{data[fName].push(fValue);}}else{data[fName]=fValue;}}});return data;},validar:function(idForm){if(typeof idForm=='undefined')
var idForm='default';if(typeof Forms.forms[idForm]=='undefined')
return true;var invalidFields=[];$.each(Forms.forms[idForm].fields,function(idField,field){if(!Forms.validarField(idForm,idField)){$('#alert_'+idField).html('<i class="fa fa-exclamation-triangle"></i> Campo obrigatório.').show(400);invalidFields.push(idField);}else{$('#alert_'+idField).html('').hide(400);}});if(invalidFields.length==0){return true;}else{return invalidFields;}}};var fFiles={};class fFileClass{constructor(idForm,idField,fieldName,nameTmp,accept,image,singleFile){if(typeof idForm=='undefined')
var idForm="default";if(typeof idField=='undefined')
console.error("idField undefined");if(typeof fieldName=='undefined')
console.error("fieldName undefined");if(typeof nameTmp=='undefined')
var nameTmp=null;if(typeof accept=='undefined')
var accept=null;if(typeof image=='undefined')
var image=false;if(typeof singleFile=='undefined')
var singleFile=true;this.idField=idField;this.idForm=idForm;this.fieldName=fieldName;this.accept=accept;this.image=image;this.singleFile=singleFile;this.nameTmp=nameTmp;this.xhr=null;this.lastItem=-1;this.actionFormTmp=null;}
setActionFormTmp(actionFormTmp){this.actionFormTmp=actionFormTmp;}
clear(item){if(this.singleFile){if(this.xhr!=null){this.xhr.abort();this.xhr=null;}
$('#'+this.idField).val('');$('#fieldBtnLabel_'+this.fieldName+'').html('Nenhum arquivo selecionado');$('#dvProgBar_'+this.fieldName).html('');if(this.image){$('#dvImage_'+this.fieldName+' > img').attr('src',$('#dvImage_'+this.fieldName+' > img').attr('data-srcdefault'));}
$('#fFileFormFile_'+this.idField+'').remove();}else{var itemMax=0;if(typeof item=='undefined'){item=0;itemMax=this.lastItem;}else{itemMax=item;}
for(var i=item;i<=itemMax;i++){if(typeof this.xhr[item]=='undefined'&&this.xhr[item]!=null){this.xhr[item].abort();this.xhr[item]=null;}
console.log('LIMPAR O ITEM '+item);}}}
openImage(title,description){$('#dvImage_'+this.fieldName+' > img').showImage(title,description,'50');}
upload(fncAfterSuccess){if(typeof fncAfterSuccess!='function')
var fncAfterSuccess=function(data){console.log(data);};if($('#fFileFormFile_'+this.idField+'').size()==0){var htmlForm='<form id="fFileFormFile_'+this.idField+'" enctype="multipart/form-data" method="post"';if(this.actionFormTmp!=null)
htmlForm+=' action="'+this.actionFormTmp+'"';htmlForm+='>';htmlForm+='<input type="hidden" value="'+this.idForm+'" name="idForm" />';htmlForm+='<input type="hidden" value="'+this.fieldName+'" name="fieldName" />';htmlForm+='<input type="hidden" value="yes" name="fFileUpload" />';htmlForm+='<div style="display:none;">';htmlForm+='<input type="file" data-id="'+this.idField+'" name="file"';if(typeof accept=='string')
htmlForm+=' accept="'+accept+'"';htmlForm+=' />';htmlForm+='</div>';htmlForm+='</form>';$('body').append(htmlForm);}
$('#fFileFormFile_'+this.idField+' input:file').unbind('change');$('#fFileFormFile_'+this.idField+' input:file').change(function(){var idField=$(this).attr('data-id');let fieldInfo=fFiles[idField];if(fieldInfo.singleFile){$('#fieldBtnLabel_'+fieldInfo.fieldName+'').html('<i class="fa fa-refresh fa-spin"></i> Enviando...');if(fFiles[idField].xhr!=null){fFiles[idField].xhr.abort();fFiles[idField].xhr=null;}
$('#'+idField).val('');fFiles[idField].xhr=kf.ajaxJSONForm('fFileFormFile_'+idField,{sendFile:true,idProgressBar:'dvProgBar_'+fieldInfo.fieldName,fncSuccess:function(response){var dataResponse=response.data;fFiles[idField].xhr=null;fFiles[idField].nameTmp=dataResponse.nameTmp;fFiles[idField].fileName=dataResponse.fileName;$('#'+dataResponse.idField).val(dataResponse.nameTmp+'/'+dataResponse.fileName);$('#fieldBtnLabel_'+fieldInfo.fieldName+'').html('<span class="text-success"><strong class="fa fa-check"></strong> '+dataResponse.fileName+'</span>');$('#fFileFormFileInput_'+idField).val('');if(fieldInfo.image){$('#dvImage_'+fieldInfo.fieldName+' > img').attr('src','?fFileGetImageTmp=1&nameFileTemp='+dataResponse.nameTmp+'&idForm='+dataResponse.idForm+'&fieldName='+dataResponse.fieldName+'#'+new Date().getTime());}
fncAfterSuccess(dataResponse);},fncError:function(dataResponse){fFiles[idField].clear();$('#fieldBtnLabel_'+fieldInfo.fieldName+'').html('<span class="text-danger"><strong class="fa fa-times"></strong> Erro ao enviar</span>');},fncFailed:function(xhr,ajaxOptions,thrownError){if(ajaxOptions!='abort'){fFiles[idField].clear();$('#fieldBtnLabel_'+fieldInfo.fieldName+'').html('<span class="text-danger"><strong class="fa fa-times"></strong> Erro ao enviar</span>');}}});}else{fFiles[idField].lastItem++;let item=fieldInfo.lastItem;if(fFiles[idField].xhr==null){fFiles[idField].xhr=[];}
fFiles[idField].xhr[item]=null;console.log('Adicionar ITEM '+item);}
return false;});$('#fFileFormFile_'+this.idField+' input:file').click();}}
function fFile(idForm,idField,fieldName,nameTmp,accept,image,singleFile){fFiles[idField]=new fFileClass(idForm,idField,fieldName,nameTmp,accept,image,singleFile);}
var fCidade={selectUF:function(elemBtng,elemFieldUF,value,label){$(elemBtng).children('.labelBtng').text(label);$(elemFieldUF).val(value);}};class downloadAjaxFile{constructor(urlDownload,dataSend,method,dataBase64,compress){this.urlDownload=urlDownload;if(typeof dataSend=='undefined')
this.dataSend={};else
this.dataSend=dataSend;this.dataSend['output']='xml';if(typeof dataBase64=='undefined')
this.dataSend['dataBase64']='true';else
this.dataSend['dataBase64']=dataBase64;if(typeof compress=='undefined')
this.dataSend['compress']='true';else
this.dataSend['compress']=compress;if(typeof method=='undefined')
this.method=method;else
this.method='POST';this.fncProgress=function(percentComplete,loaded,total){console.log(percentComplete,loaded,total);};}
setFncProgress(fncProgress){this.fncProgress=fncProgress;}
static fncSuccess(response){if(response.data!=null){window.URL=window.URL||window.webkitURL;var blob=new Blob([response.data],{type:response.dataContentType});var a=document.createElement('a');a.href=window.URL.createObjectURL(blob);a.download=response.filename;a.textContent='Download file!';a.target='_blank';a.class='hidden';a.click();}}
static fncError(response){console.error(response.strError);}
static fncFail(xhr,ajaxOptions,thrownError){console.error(thrownError,xhr);}
doDownload(fncSuccess,fncError,fncFail){if(typeof fncSuccess!='function')
fncSuccess=function(response){};if(typeof fncError!='function')
fncError=downloadAjaxFile.fncError;if(typeof fncFail!='function')
fncFail=downloadAjaxFile.fncFail;var fncProgress=this.fncProgress;var fncXHR=function(){var xhr=new window.XMLHttpRequest();xhr.addEventListener("progress",function(oEvent){if(oEvent.lengthComputable){var percentComplete=oEvent.loaded/oEvent.total;var perc=parseInt(percentComplete*100);fncProgress(perc,oEvent.loaded,oEvent.total);}else{fncProgress(null);}},false);return xhr;};$.ajax({url:this.urlDownload,dataType:'xml',type:this.method,data:this.dataSend,xhr:fncXHR,success:function(response){let r={status:$(response).find('status').text(),strError:$(response).find('strError').text(),filename:$(response).find('filename').text(),compress:$(response).find('compress').text(),dataBase64:$(response).find('dataBase64').text(),dataContentType:$(response).find('dataContentType').text(),data:$(response).find('data').text()};if(r.status=='true'||r.status==1){r.status=true;if(r.compress=='true'||r.compress==1){r.data=LZString.decompressFromBase64(r.data);r.dataBase64='false';}
if(r.dataBase64=='true'||r.dataBase64==1)
r.data=window.atob(r.data);}else{r.status=false;r.dataContentType='text/plain';r.data=null;}
if(r.status){downloadAjaxFile.fncSuccess(r);fncSuccess(r);}else{fncError(r);}},error:function(xhr,ajaxOptions,thrownError){console.error(thrownError);if(xhr.status==200){return true;}else{return fncFail(xhr,ajaxOptions,thrownError);}}});}}
class fSearch{constructor(prefixID,fieldName,settings){this.settings={'url':"#",'numMaxResult':6,'numMinHistory':2,'iconHistory':'<i class="fa fa-clock-o text-primary"></i>','textBeforeQuery':'<i class="fa fa-refresh fa-spin"></i> Consultando...','isOpen':false};if(typeof prefixID=='undefined')
this.prefixID='field';else
this.prefixID=prefixID;this.fieldName=fieldName;if(typeof settings!='undefined')
this.setSettings(settings);let idLabel=this.prefixID+"Label_"+this.fieldName;var este=this;$('#'+idLabel).on('focus',function(){este.query();$('#dvbs_'+este.fieldName).addClass('active');});$('#'+idLabel).on('keyup',function(){este.query();$('#dvbs_'+este.fieldName).addClass('active');});$('#'+idLabel).on('blur',function(){este.settings.isOpen=false;setTimeout(function(){$('#dvbs_'+este.fieldName).removeClass('active');},500);});this.cache={};}
setSettings(settings){$.extend(this.settings,settings);}
select(value,label){$('#'+this.prefixID+"Label_"+this.fieldName).val(label);$('#'+this.prefixID+"_"+this.fieldName).val(value);this.settings.isOpen=false;$('#dvbs_'+this.fieldName).removeClass('active');}
query(force){if(typeof force=='undefined')
var force=false;this.settings.isOpen=true;var q=$('#'+this.prefixID+"Label_"+this.fieldName).val();var este=this;if(q.length%3==0){var dataSend={fSearch:'yes',prefixId:this.prefixID,fieldName:this.fieldName,q:q};var html='<div style="padding: 15px;text-align:center;">'+this.settings.textBeforeQuery+'</div>';$('#dvbs_'+this.fieldName).html(html);kf.ajaxJSON(this.settings.url,dataSend,{fncSuccess:function(r){console.log(r.data);var numResults=kf.sizeObj(r.data.results);var numHistorico=kf.sizeObj(r.data.historico);var m=0;var n=0;if(numResults>=este.numMaxResult-este.numMinHistory){m=este.numMinHistory;n=este.numMaxResult-este.numMinHistory;}else{m=este.numMaxResult-numResults;n=numResults;}
var html='';var i=0;while(i<m){html+='<div class="boxsearch-item" onClick="fSearch_'+este.fieldName+'.select(\''+r.data.historico[i].valor+'\',\''+r.data.historico[i].label+'\');">';html+='<div class="boxsearch-item-icon"><i class="fa fa-clock-o"></i></div>';html+='<div class="boxsearch-item-text">'+r.data.historico[i].label+'</div>';html+='<div class="boxsearch-item-value">'+r.data.historico[i].valor+'</div>';html+='</div>';i++;}
i=0;while(i<n){html+='<div class="boxsearch-item" onClick="fSearch_'+este.fieldName+'.select(\''+r.data.results[i].valor+'\',\''+r.data.results[i].label+'\');">';html+='<div class="boxsearch-item-icon"></div>';html+='<div class="boxsearch-item-text">'+r.data.results[i].label+'</div>';html+='<div class="boxsearch-item-value">'+r.data.results[i].valor+'</div>';html+='</div>';i++;}
$('#dvbs_'+este.fieldName).html(html);},fncError:function(data){var html='<div class="text-danger" style="padding: 15px;"><i class="fa fa-times"></i> '+data.strError+'</div>';$('#dvbs_'+este.fieldName).html(html);},fncFailed:function(xhr,ajaxOptions,thrownError){var html='<div class="text-danger" style="padding: 15px;"><i class="fa fa-times"></i> '+thrownError+'</div>';$('#dvbs_'+este.fieldName).html(html);}});}}}
function switchSetValue(id,value){var status=false;$('[data-idfield='+id+']').each(function(){if($(this).attr('data-valor')==value&&($(this).attr('data-unselect')==0||!$(this).hasClass('active'))){$(this).removeClass('btn-default').addClass('btn-primary active');status=true;$('#'+id).val(value);}else{$(this).removeClass('btn-primary active').addClass('btn-default');}});if(status)
$('#'+id).val(value).change();else
$('#'+id).val('').change();}