webpackJsonp([1],{0:function(l,n,u){l.exports=u("yxKH")},xqsl:function(l,n){function u(l){return Promise.resolve().then(function(){throw new Error("Cannot find module '"+l+"'.")})}u.keys=function(){return[]},u.resolve=u,l.exports=u,u.id="xqsl"},yxKH:function(l,n,u){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=u("/oeL"),t=function(){return function(){}}(),i=function(){return function(){this.title="app"}}(),o=u("qbdv"),r=u("bm2B"),s=u("Jsyr"),a=u("kH4A"),_=u("GZB0"),c=u("GROE"),p=u("5q5V"),g=function(){function l(l,n){this._renderer=l,this._elementRef=n,this.onChange=function(l){},this.onTouched=function(){},this.validator=this.generateAsyncValidator()}return l.prototype.writeValue=function(l){this._renderer.setProperty(this._elementRef.nativeElement,"value",null)},l.prototype.registerOnChange=function(l){this.onChange=this.onChangeGenerator(l)},l.prototype.registerOnTouched=function(l){},l.prototype.setDisabledState=function(l){this._renderer.setProperty(this._elementRef.nativeElement,"disabled",l)},l.prototype.validate=function(l){return this.validator(l)},l.prototype.generateAsyncValidator=function(){var l=this;return function(n){if(!n.value||!n.value.length||n.disabled)return Object(_.a)({});for(var u={},e=[],t=function(n){if(l.size&&l.size<n.size&&(n.errors.fileSize=!0,u.fileSize=!0),n.isImg&&(l.maxWidth||l.maxHeight)&&e.push(n.imgLoadReplay.pipe(Object(c.b)(1),Object(c.a)(function(e){return l.maxWidth&&n.imgWidth>l.maxWidth&&(n.errors.imageWidth=!0,u.imageWidth=!0),l.maxHeight&&n.imgHeight>l.maxHeight&&(n.errors.imageHeight=!0,u.imageHeight=!0),e}))),!l.allowedExt&&!l.allowedTypes)return"continue";var t=l.generateRegExp(l.allowedExt),i=l.generateRegExp(l.allowedTypes);t&&!t.test(n.name)&&(n.errors.fileExt=!0,u.fileExt=!0),i&&!i.test(n.type)&&(n.errors.fileType=!0,u.fileType=!0)},i=0,o=n.value;i<o.length;i++){t(o[i])}return e.length?s.a.apply(void 0,e).pipe(Object(c.a)(function(){return u})):Object(_.a)(u)}},l.prototype.onChangeGenerator=function(l){var n=this;return function(u){for(var e=[],t=0,i=u;t<i.length;t++){var o=i[t];if(n.withMeta&&FileReader){var r=new FileReader;n.generateFileMeta(o,r)}o.errors={},e.push(o)}l(e)}},l.prototype.generateRegExp=function(l){return l?l instanceof RegExp?new RegExp(l):"string"==typeof l?new RegExp(l,"ig"):l instanceof Array?new RegExp("("+l.join("|")+")","ig"):null:null},l.prototype.generateFileMeta=function(l,n){l.type.match(/text.*/)?l.textLoadReplay=this.setText(l,n):l.type.match(/image.*/)&&(l.imgLoadReplay=this.setImage(l,n))},l.prototype.setImage=function(l,n){l.isImg=!0;var u=new Image,e=Object(a.a)(u,"load").pipe(Object(c.b)(1),Object(c.a)(function(n){return l.imgHeight=u.height,l.imgWidth=u.width,n})),t=Object(a.a)(n,"load").pipe(Object(c.b)(1),Object(c.a)(function(e){return l.imgSrc=n.result,u.src=n.result,e})),i=new p.a(1);return Object(s.a)(e,t).subscribe(i),n.readAsDataURL(l),i},l.prototype.setText=function(l,n){var u=new p.a(1);return Object(a.a)(n,"load").pipe(Object(c.b)(1),Object(c.a)(function(u){return l.textContent=n.result,[u]})).subscribe(u),n.readAsText(l),u},l}();g.decorators=[{type:e.j,args:[{selector:"input[type=file][formControl],input[type=file][formControlName],input[type=file][ngModel]",providers:[{provide:r.k,useExisting:Object(e.W)(function(){return g}),multi:!0},{provide:r.j,useExisting:Object(e.W)(function(){return g}),multi:!0}]}]}],g.ctorParameters=function(){return[{type:e.H},{type:e.k}]},g.propDecorators={allowedExt:[{type:e.t}],allowedTypes:[{type:e.t}],size:[{type:e.t}],withMeta:[{type:e.t}],maxHeight:[{type:e.t}],maxWidth:[{type:e.t}],onChange:[{type:e.o,args:["change",["$event.target.files"]]}],onTouched:[{type:e.o,args:["blur"]}]};var d=function(){function l(l){this._fb=l,this.fileList=[],this.allowedFileTypes="(text|jpe?g)",this.allowedFileExt="(.txt|.jpe?g)",this.withMeta=!0,this.size=5e4,this.maxWidth=480,this.maxHeight=360,this.form=l.group({file:[""]}),this.fileControl=this.form.get("file")}return l.prototype.ngOnInit=function(){var l=this;this.checkbox=new r.f(this.withMeta),this.fileControl.valueChanges.subscribe(function(n){console.log("%c-----FILE LIST CHANGED-----","background-color: #008351; color: #fff"),console.log(n),l.fileList=n||[]}),this.checkbox.valueChanges.subscribe(function(n){l.removeFiles(),l.withMeta=n})},l.prototype.removeFiles=function(){this.fileControl.setValue([])},l.prototype.disableFileControl=function(){this.fileControl.disable()},l.prototype.enableFileControl=function(){this.fileControl.enable()},l.prototype.updateSize=function(l){this.size=l},l.prototype.updateTypes=function(l){this.allowedFileTypes=l},l.prototype.updateExt=function(l){this.allowedFileExt=l},l.prototype.updateDimensions=function(l,n){this.maxWidth=l,this.maxHeight=n},l.prototype.updateValues=function(l,n,u,e,t){this.updateSize(l),this.updateDimensions(n,u),this.updateTypes(e),this.updateExt(t),this.removeFiles()},l.prototype.changed=function(l){console.log(l)},l.ctorParameters=function(){return[{type:r.e}]},l}(),f=[['body[_ngcontent-%COMP%]{font-size:14px}img[_ngcontent-%COMP%]{top:50%;max-width:100%;max-height:100%;position:relative;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);left:50%;border-radius:2px}p[_ngcontent-%COMP%]{overflow:auto}input[type=file][_ngcontent-%COMP%]:disabled + .custom-file-label[_ngcontent-%COMP%]{background-color:#d5d5d5;border-color:#d5d5d5}input[type=checkbox][_ngcontent-%COMP%]{display:none}input[type=checkbox][_ngcontent-%COMP%] + label[_ngcontent-%COMP%]:before{font-family:FontAwesome;display:inline-block;content:"\\F096";letter-spacing:10px}input[type=checkbox][_ngcontent-%COMP%]:checked + label[_ngcontent-%COMP%]:before{content:"\\F046";letter-spacing:8px}.row[_ngcontent-%COMP%]{margin-top:15px;margin-bottom:15px}.file-contents[_ngcontent-%COMP%]{height:150px;overflow:auto}.file-container[_ngcontent-%COMP%]{margin:15px auto;box-shadow:1px 1px 5px 1px #d5d5d5;padding:3px;max-height:400px}.error-container[_ngcontent-%COMP%], .info-container[_ngcontent-%COMP%]{font-size:.9rem}']],h=e._6({encapsulation:0,styles:f,data:{}});function m(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"button",[["class","btn btn-warning"]],null,[[null,"click"]],function(l,n,u){var e=!0,t=l.component;"click"===n&&(e=!1!==t.disableFileControl()&&e);return e},null,null)),(l()(),e._25(-1,null,["Disable"]))],null,null)}function x(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"button",[["class","btn btn-success"]],null,[[null,"click"]],function(l,n,u){var e=!0,t=l.component;"click"===n&&(e=!1!==t.enableFileControl()&&e);return e},null,null)),(l()(),e._25(-1,null,["Enable"]))],null,null)}function v(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"span",[["class","text-info"]],null,null,null,null,null)),(l()(),e._25(-1,null,["(requires file meta)"]))],null,null)}function b(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"span",[["class","text-info"]],null,null,null,null,null)),(l()(),e._25(-1,null,["(requires file meta)"]))],null,null)}function y(l){return e._26(0,[(l()(),e._9(0,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),e._9(1,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e._25(2,null,["","x","px"]))],null,function(l,n){l(n,2,0,n.parent.context.$implicit.imgWidth,n.parent.context.$implicit.imgHeight)})}function C(l){return e._26(0,[(l()(),e._9(0,0,null,null,0,"img",[],[[8,"src",4]],null,null,null,null))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.imgSrc)})}function w(l){return e._26(0,[(l()(),e._9(0,0,null,null,0,"p",[],[[8,"innerHTML",1]],null,null,null,null))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.textContent)})}function O(l){return e._26(0,[(l()(),e._9(0,0,null,null,55,null,null,null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(2,0,null,null,52,"div",[["class","col-sm-6 col-md-4 col-lg-3"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(4,0,null,null,49,"div",[["class","file-container"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(6,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),e._9(7,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e._25(8,null,["",""])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(10,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),e._9(11,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e._25(12,null,[""," bytes"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._3(16777216,null,null,1,null,y)),e._7(15,16384,null,0,o.e,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(17,0,null,null,26,"div",[["class","error-container"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(19,0,null,null,3,"div",[],null,null,null,null,null)),e._7(20,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(21,{"text-danger":0}),(l()(),e._25(-1,null,["File type not allowed"])),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(24,0,null,null,3,"div",[],null,null,null,null,null)),e._7(25,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(26,{"text-danger":0}),(l()(),e._25(-1,null,["File extension not allowed"])),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(29,0,null,null,3,"div",[],null,null,null,null,null)),e._7(30,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(31,{"text-danger":0}),(l()(),e._25(-1,null,["File is too large"])),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(34,0,null,null,3,"div",[],null,null,null,null,null)),e._7(35,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(36,{"text-danger":0}),(l()(),e._25(-1,null,["Image too wide"])),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(39,0,null,null,3,"div",[],null,null,null,null,null)),e._7(40,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(41,{"text-danger":0}),(l()(),e._25(-1,null,["Image too tall"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(45,0,null,null,7,"div",[["class","file-contents"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._3(16777216,null,null,1,null,C)),e._7(48,16384,null,0,o.e,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(l()(),e._25(-1,null,["\n            "])),(l()(),e._3(16777216,null,null,1,null,w)),e._7(51,16384,null,0,o.e,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "]))],function(l,n){l(n,15,0,n.context.$implicit.isImg),l(n,20,0,l(n,21,0,n.context.$implicit.errors.fileType)),l(n,25,0,l(n,26,0,n.context.$implicit.errors.fileExt)),l(n,30,0,l(n,31,0,n.context.$implicit.errors.fileSize)),l(n,35,0,l(n,36,0,n.context.$implicit.errors.imageWidth)),l(n,40,0,l(n,41,0,n.context.$implicit.errors.imageHeight)),l(n,48,0,n.context.$implicit.imgSrc),l(n,51,0,n.context.$implicit.textContent)},function(l,n){l(n,8,0,n.context.$implicit.name),l(n,12,0,n.context.$implicit.size)})}function k(l){return e._26(0,[(l()(),e._9(0,0,null,null,259,"div",[["class","container"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n  "])),(l()(),e._9(2,0,null,null,13,"div",[["class","row"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n    "])),(l()(),e._9(4,0,null,null,10,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(6,0,null,null,1,"h1",[],null,null,null,null,null)),(l()(),e._25(-1,null,["FileInputAccessor demo"])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(9,0,null,null,4,"p",[],null,null,null,null,null)),(l()(),e._25(-1,null,["Repo is "])),(l()(),e._9(11,0,null,null,1,"a",[["href","https://github.com/jwelker110/angular-file-input-accessor"]],null,null,null,null,null)),(l()(),e._25(-1,null,["here"])),(l()(),e._25(-1,null,[". Files\n        are logged to the console.\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n  "])),(l()(),e._25(-1,null,["\n\n  "])),(l()(),e._9(17,0,null,null,78,"div",[["class","row"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n    "])),(l()(),e._9(19,0,null,null,5,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(22,0,null,null,1,"p",[],null,null,null,null,null)),(l()(),e._25(-1,null,["Choose one or more files. They will not be uploaded. Form errors will appear in red."])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._9(26,0,null,null,19,"div",[["class","form-group col-sm-6"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],function(l,n,u){var t=!0;"submit"===n&&(t=!1!==e._21(l,27).onSubmit(u)&&t);"reset"===n&&(t=!1!==e._21(l,27).onReset()&&t);return t},null,null)),e._7(27,540672,null,0,r.h,[[8,null],[8,null]],{form:[0,"form"]},null),e._23(2048,null,r.c,null,[r.h]),e._7(29,16384,null,0,r.n,[r.c],null,null),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(31,0,null,null,13,"div",[["class","custom-file"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(33,0,null,null,7,"input",[["class","custom-file-input"],["id","file"],["multiple",""],["name","file"],["type","file"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"change"]],function(l,n,u){var t=!0;"input"===n&&(t=!1!==e._21(l,34)._handleInput(u.target.value)&&t);"blur"===n&&(t=!1!==e._21(l,34).onTouched()&&t);"compositionstart"===n&&(t=!1!==e._21(l,34)._compositionStart()&&t);"compositionend"===n&&(t=!1!==e._21(l,34)._compositionEnd(u.target.value)&&t);"change"===n&&(t=!1!==e._21(l,35).onChange(u.target.files)&&t);"blur"===n&&(t=!1!==e._21(l,35).onTouched()&&t);return t},null,null)),e._7(34,16384,null,0,r.d,[e.H,e.k,[2,r.a]],null,null),e._7(35,16384,null,0,g,[e.H,e.k],{allowedExt:[0,"allowedExt"],allowedTypes:[1,"allowedTypes"],size:[2,"size"],withMeta:[3,"withMeta"],maxHeight:[4,"maxHeight"],maxWidth:[5,"maxWidth"]},null),e._23(1024,null,r.j,function(l){return[l]},[g]),e._23(1024,null,r.k,function(l,n){return[l,n]},[r.d,g]),e._7(38,540672,null,0,r.g,[[8,null],[2,r.j],[2,r.k]],{form:[0,"form"]},null),e._23(2048,null,r.l,null,[r.g]),e._7(40,16384,null,0,r.m,[r.l],null,null),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(42,0,null,null,1,"label",[["class","custom-file-label"],["for","file"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Choose File"])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(47,0,null,null,11,"div",[["class","col-sm-6"]],null,null,null,null,null)),e._7(48,16384,null,0,o.h,[],{ngSwitch:[0,"ngSwitch"]},null),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(50,0,null,null,1,"button",[["class","btn btn-primary"]],null,[[null,"click"]],function(l,n,u){var e=!0,t=l.component;"click"===n&&(e=!1!==t.removeFiles()&&e);return e},null,null)),(l()(),e._25(-1,null,["Clear files"])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._3(16777216,null,null,1,null,m)),e._7(54,278528,null,0,o.i,[e.R,e.O,o.h],{ngSwitchCase:[0,"ngSwitchCase"]},null),(l()(),e._25(-1,null,["\n      "])),(l()(),e._3(16777216,null,null,1,null,x)),e._7(57,278528,null,0,o.i,[e.R,e.O,o.h],{ngSwitchCase:[0,"ngSwitchCase"]},null),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(60,0,null,null,6,"div",[["class","col-12 info-container"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(62,0,null,null,3,"div",[],null,null,null,null,null)),e._7(63,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(64,{"text-info":0}),(l()(),e._25(-1,null,["Form is pending"])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(68,0,null,null,26,"div",[["class","col-12 error-container"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(70,0,null,null,3,"div",[],null,null,null,null,null)),e._7(71,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(72,{"text-danger":0}),(l()(),e._25(-1,null,["File type not allowed."])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(75,0,null,null,3,"div",[],null,null,null,null,null)),e._7(76,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(77,{"text-danger":0}),(l()(),e._25(-1,null,["File extension not allowed."])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(80,0,null,null,3,"div",[],null,null,null,null,null)),e._7(81,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(82,{"text-danger":0}),(l()(),e._25(-1,null,["File size exceeds maximum."])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(85,0,null,null,3,"div",[],null,null,null,null,null)),e._7(86,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(87,{"text-danger":0}),(l()(),e._25(-1,null,["Image too wide."])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(90,0,null,null,3,"div",[],null,null,null,null,null)),e._7(91,278528,null,0,o.c,[e.u,e.v,e.k,e.G],{ngClass:[0,"ngClass"]},null),e._22(92,{"text-danger":0}),(l()(),e._25(-1,null,["Image too tall."])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n  "])),(l()(),e._25(-1,null,["\n\n  "])),(l()(),e._9(97,0,null,null,155,"div",[["class","row"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(99,0,null,null,14,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(101,0,null,null,11,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(103,0,null,null,5,"input",[["id","withMeta"],["type","checkbox"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"change"],[null,"blur"]],function(l,n,u){var t=!0;"change"===n&&(t=!1!==e._21(l,104).onChange(u.target.checked)&&t);"blur"===n&&(t=!1!==e._21(l,104).onTouched()&&t);return t},null,null)),e._7(104,16384,null,0,r.b,[e.H,e.k],null,null),e._23(1024,null,r.k,function(l){return[l]},[r.b]),e._7(106,540672,null,0,r.g,[[8,null],[8,null],[2,r.k]],{form:[0,"form"]},null),e._23(2048,null,r.l,null,[r.g]),e._7(108,16384,null,0,r.m,[r.l],null,null),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(110,0,null,null,1,"label",[["for","withMeta"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Add file meta"])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._9(115,0,null,null,0,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(117,0,null,null,18,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(119,0,null,null,15,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(121,0,null,null,1,"label",[["class","col-form-label"],["for","size"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Max file size"])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(124,0,null,null,9,"div",[["class","input-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(126,0,[["sizeInput",1]],null,0,"input",[["class","form-control"],["id","size"],["step","1000"],["type","number"]],[[8,"value",0]],null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(128,0,null,null,4,"div",[["class","input-group-append"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(130,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["bytes"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._9(137,0,null,null,0,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(139,0,null,null,51,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(141,0,null,null,23,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(143,0,null,null,3,"label",[["class","col-form-label"],["for","width"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Max image width "])),(l()(),e._3(16777216,null,null,1,null,v)),e._7(146,16384,null,0,o.e,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(148,0,null,null,15,"div",[["class","input-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(150,0,null,null,4,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(152,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._9(153,0,null,null,0,"span",[["class","fa fa-arrows-h"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(156,0,[["widthInput",1]],null,0,"input",[["class","form-control"],["id","width"],["type","number"]],[[8,"disabled",0],[8,"value",0]],null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(158,0,null,null,4,"div",[["class","input-group-append"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(160,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["px"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n\n      "])),(l()(),e._9(166,0,null,null,23,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(168,0,null,null,3,"label",[["class","col-form-label"],["for","height"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Max image height "])),(l()(),e._3(16777216,null,null,1,null,b)),e._7(171,16384,null,0,o.e,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(173,0,null,null,15,"div",[["class","input-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(175,0,null,null,4,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(177,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._9(178,0,null,null,0,"span",[["class","fa fa-arrows-v"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(181,0,[["heightInput",1]],null,0,"input",[["class","form-control"],["id","height"],["type","number"]],[[8,"disabled",0],[8,"value",0]],null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(183,0,null,null,4,"div",[["class","input-group-append"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(185,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["px"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(192,0,null,null,53,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(194,0,null,null,24,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(196,0,null,null,4,"label",[["class","col-form-label"],["for","typeRegEx"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Allowed File "])),(l()(),e._9(198,0,null,null,1,"em",[],null,null,null,null,null)),(l()(),e._25(-1,null,["type"])),(l()(),e._25(-1,null,[" regex"])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(202,0,null,null,15,"div",[["class","input-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(204,0,null,null,4,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(206,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["/"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(210,0,[["typeRegExInput",1]],null,0,"input",[["class","form-control"],["id","typeRegEx"],["placeholder","ex. (text|jpe?g)"],["type","text"]],[[8,"value",0]],null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(212,0,null,null,4,"div",[["class","input-group-append"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(214,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["/"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n\n      "])),(l()(),e._9(220,0,null,null,24,"div",[["class","form-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(222,0,null,null,4,"label",[["class","col-form-label"],["for","extRegEx"]],null,null,null,null,null)),(l()(),e._25(-1,null,["Allowed File "])),(l()(),e._9(224,0,null,null,1,"em",[],null,null,null,null,null)),(l()(),e._25(-1,null,["extension"])),(l()(),e._25(-1,null,[" regex"])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._9(228,0,null,null,15,"div",[["class","input-group"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(230,0,null,null,4,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(232,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["/"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(236,0,[["extRegExInput",1]],null,0,"input",[["class","form-control"],["id","extRegEx"],["placeholder","ex. (.txt|.jpe?g)"],["type","text"]],[[8,"value",0]],null,null,null,null)),(l()(),e._25(-1,null,["\n          "])),(l()(),e._9(238,0,null,null,4,"div",[["class","input-group-append"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n            "])),(l()(),e._9(240,0,null,null,1,"span",[["class","input-group-text"]],null,null,null,null,null)),(l()(),e._25(-1,null,["/"])),(l()(),e._25(-1,null,["\n          "])),(l()(),e._25(-1,null,["\n        "])),(l()(),e._25(-1,null,["\n      "])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n    "])),(l()(),e._9(247,0,null,null,4,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n      "])),(l()(),e._9(249,0,null,null,1,"button",[["class","btn btn-primary"]],null,[[null,"click"]],function(l,n,u){var t=!0,i=l.component;"click"===n&&(t=!1!==i.updateValues(e._21(l,126).value,e._21(l,156).value,e._21(l,181).value,e._21(l,210).value,e._21(l,236).value)&&t);return t},null,null)),(l()(),e._25(-1,null,["Update Validation"])),(l()(),e._25(-1,null,["\n    "])),(l()(),e._25(-1,null,["\n\n  "])),(l()(),e._25(-1,null,["\n\n  "])),(l()(),e._9(254,0,null,null,4,"div",[["class","row"]],null,null,null,null,null)),(l()(),e._25(-1,null,["\n    "])),(l()(),e._3(16777216,null,null,1,null,O)),e._7(257,802816,null,0,o.d,[e.R,e.O,e.u],{ngForOf:[0,"ngForOf"]},null),(l()(),e._25(-1,null,["\n  "])),(l()(),e._25(-1,null,["\n"])),(l()(),e._25(-1,null,["\n"]))],function(l,n){var u=n.component;l(n,27,0,u.form),l(n,35,0,u.allowedFileExt,u.allowedFileTypes,u.size,u.withMeta,u.maxHeight,u.maxWidth),l(n,38,0,u.form.get("file")),l(n,48,0,u.form.get("file").disabled);l(n,54,0,!1);l(n,57,0,!0),l(n,63,0,l(n,64,0,u.form.pending)),l(n,71,0,l(n,72,0,u.form.get("file").hasError("fileType"))),l(n,76,0,l(n,77,0,u.form.get("file").hasError("fileExt"))),l(n,81,0,l(n,82,0,u.form.get("file").hasError("fileSize"))),l(n,86,0,l(n,87,0,u.form.get("file").hasError("imageWidth"))),l(n,91,0,l(n,92,0,u.form.get("file").hasError("imageHeight"))),l(n,106,0,u.checkbox),l(n,146,0,!u.withMeta),l(n,171,0,!u.withMeta),l(n,257,0,u.fileList)},function(l,n){var u=n.component;l(n,26,0,e._21(n,29).ngClassUntouched,e._21(n,29).ngClassTouched,e._21(n,29).ngClassPristine,e._21(n,29).ngClassDirty,e._21(n,29).ngClassValid,e._21(n,29).ngClassInvalid,e._21(n,29).ngClassPending),l(n,33,0,e._21(n,40).ngClassUntouched,e._21(n,40).ngClassTouched,e._21(n,40).ngClassPristine,e._21(n,40).ngClassDirty,e._21(n,40).ngClassValid,e._21(n,40).ngClassInvalid,e._21(n,40).ngClassPending),l(n,103,0,e._21(n,108).ngClassUntouched,e._21(n,108).ngClassTouched,e._21(n,108).ngClassPristine,e._21(n,108).ngClassDirty,e._21(n,108).ngClassValid,e._21(n,108).ngClassInvalid,e._21(n,108).ngClassPending),l(n,126,0,u.size),l(n,156,0,!u.withMeta,u.maxWidth),l(n,181,0,!u.withMeta,u.maxHeight),l(n,210,0,u.allowedFileTypes),l(n,236,0,u.allowedFileExt)})}e._4("app-file-form",d,function(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"app-file-form",[],null,null,null,k,h)),e._7(1,114688,null,0,d,[r.e],null,null)],function(l,n){l(n,1,0)},null)},{},{},[]);var E=[[""]],F=e._6({encapsulation:0,styles:E,data:{}});function M(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"app-file-form",[],null,null,null,k,h)),e._7(1,114688,null,0,d,[r.e],null,null),(l()(),e._25(-1,null,["\n\n"]))],function(l,n){l(n,1,0)},null)}var I=e._4("app-root",i,function(l){return e._26(0,[(l()(),e._9(0,0,null,null,1,"app-root",[],null,null,null,M,F)),e._7(1,49152,null,0,i,[],null,null)],null,null)},{},{},[]),R=u("fc+i"),j=function(){return function(){}}();j.decorators=[{type:e.x,args:[{declarations:[g],imports:[r.i,r.o],exports:[g,r.i,r.o]}]}],j.ctorParameters=function(){return[]};var P=e._5(t,[i],function(l){return e._19([e._20(512,e.i,e._1,[[8,[I]],[3,e.i],e.y]),e._20(5120,e.w,e._18,[[3,e.w]]),e._20(4608,o.g,o.f,[e.w]),e._20(4608,e.h,e.h,[]),e._20(5120,e.a,e._10,[]),e._20(5120,e.u,e._15,[]),e._20(5120,e.v,e._16,[]),e._20(4608,R.b,R.s,[o.b]),e._20(6144,e.K,null,[R.b]),e._20(4608,R.e,R.f,[]),e._20(5120,R.c,function(l,n,u,e){return[new R.k(l),new R.o(n),new R.n(u,e)]},[o.b,o.b,o.b,R.e]),e._20(4608,R.d,R.d,[R.c,e.A]),e._20(135680,R.m,R.m,[o.b]),e._20(4608,R.l,R.l,[R.d,R.m]),e._20(6144,e.I,null,[R.l]),e._20(6144,R.p,null,[R.m]),e._20(4608,e.P,e.P,[e.A]),e._20(4608,R.g,R.g,[o.b]),e._20(4608,R.i,R.i,[o.b]),e._20(4608,r.q,r.q,[]),e._20(4608,r.e,r.e,[]),e._20(512,o.a,o.a,[]),e._20(1024,e.l,R.q,[]),e._20(1024,e.b,function(l,n){return[R.r(l,n)]},[[2,R.h],[2,e.z]]),e._20(512,e.c,e.c,[[2,e.b]]),e._20(131584,e._8,e._8,[e.A,e._2,e.s,e.l,e.i,e.c]),e._20(2048,e.e,null,[e._8]),e._20(512,e.d,e.d,[e.e]),e._20(512,R.a,R.a,[[3,R.a]]),e._20(512,r.p,r.p,[]),e._20(512,r.i,r.i,[]),e._20(512,r.o,r.o,[]),e._20(512,j,j,[]),e._20(512,t,t,[])])});Object(e.V)(),Object(R.j)().bootstrapModuleFactory(P).catch(function(l){return console.log(l)})}},[0]);