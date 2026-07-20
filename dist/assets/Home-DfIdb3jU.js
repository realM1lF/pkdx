import{c as Xm,r as Ze,j as N,T as Nt,a as El,g as Ym,u as Id,b as qm,d as Ud,m as st,L as Tl,S as ja,e as Fi,M as Fd,A as ir,s as vr,f as $m,h as Km,i as Zm,k as Lc,l as Vf,n as Wf,P as Od,o as Jm,p as jm,q as Qm,t as eg,v as tg,w as Ul,x as ng,y as ig,G as rg,z as Xf,B as sg}from"./index-B6Tpxn9l.js";import{C as ag}from"./chevron-down-KWrIsVtY.js";import{S as Wo,u as Bd}from"./StatBar-QS9_iL-E.js";import{A as og}from"./arrow-left-DqQfrKh-.js";import{A as lg}from"./arrow-right-C7_yWc2n.js";import{a as Ku}from"./index-CFdFYbX9.js";import{L as cg}from"./lock-Bd5FKQ4z.js";const ug=[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]],fg=Xm("dices",ug);function qi(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function kd(r,e){r.prototype=Object.create(e.prototype),r.prototype.constructor=r,r.__proto__=e}var ei={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},za={duration:.5,overwrite:!1,delay:0},Zu,hn,Dt,hi=1e8,Tt=1/hi,Nc=Math.PI*2,hg=Nc/4,dg=0,zd=Math.sqrt,pg=Math.cos,mg=Math.sin,cn=function(e){return typeof e=="string"},zt=function(e){return typeof e=="function"},rr=function(e){return typeof e=="number"},Ju=function(e){return typeof e>"u"},zi=function(e){return typeof e=="object"},Fn=function(e){return e!==!1},ju=function(){return typeof window<"u"},ro=function(e){return zt(e)||cn(e)},Gd=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},yn=Array.isArray,gg=/random\([^)]+\)/g,_g=/,\s*/g,Yf=/(?:-?\.?\d|\.)+/gi,Hd=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Fs=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Fl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Vd=/[+-]=-?[.\d]+/,xg=/[^,'"\[\]\s]+/gi,vg=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,It,Ri,Ic,Qu,ni={},al={},Wd,Xd=function(e){return(al=Zs(e,ni))&&Hn},ef=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},Ga=function(e,t){return!t&&console.warn(e)},Yd=function(e,t){return e&&(ni[e]=t)&&al&&(al[e]=t)||ni},Ha=function(){return 0},Sg={suppressEvents:!0,isStart:!0,kill:!1},Xo={suppressEvents:!0,kill:!1},Mg={suppressEvents:!0},tf={},wr=[],Uc={},qd,$n={},Ol={},qf=30,Yo=[],nf="",rf=function(e){var t=e[0],n,i;if(zi(t)||zt(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(i=Yo.length;i--&&!Yo[i].targetTest(t););n=Yo[i]}for(i=e.length;i--;)e[i]&&(e[i]._gsap||(e[i]._gsap=new mp(e[i],n)))||e.splice(i,1);return e},jr=function(e){return e._gsap||rf(di(e))[0]._gsap},$d=function(e,t,n){return(n=e[t])&&zt(n)?e[t]():Ju(n)&&e.getAttribute&&e.getAttribute(t)||n},On=function(e,t){return(e=e.split(",")).forEach(t)||e},Wt=function(e){return Math.round(e*1e5)/1e5||0},Lt=function(e){return Math.round(e*1e7)/1e7||0},ks=function(e,t){var n=t.charAt(0),i=parseFloat(t.substr(2));return e=parseFloat(e),n==="+"?e+i:n==="-"?e-i:n==="*"?e*i:e/i},yg=function(e,t){for(var n=t.length,i=0;e.indexOf(t[i])<0&&++i<n;);return i<n},ol=function(){var e=wr.length,t=wr.slice(0),n,i;for(Uc={},wr.length=0,n=0;n<e;n++)i=t[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},sf=function(e){return!!(e._initted||e._startAt||e.add)},Kd=function(e,t,n,i){wr.length&&!hn&&ol(),e.render(t,n,!!(hn&&t<0&&sf(e))),wr.length&&!hn&&ol()},Zd=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(xg).length<2?t:cn(e)?e.trim():e},Jd=function(e){return e},ii=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},bg=function(e){return function(t,n){for(var i in n)i in t||i==="duration"&&e||i==="ease"||(t[i]=n[i])}},Zs=function(e,t){for(var n in t)e[n]=t[n];return e},$f=function r(e,t){for(var n in t)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(e[n]=zi(t[n])?r(e[n]||(e[n]={}),t[n]):t[n]);return e},ll=function(e,t){var n={},i;for(i in e)i in t||(n[i]=e[i]);return n},wa=function(e){var t=e.parent||It,n=e.keyframes?bg(yn(e.keyframes)):ii;if(Fn(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},Eg=function(e,t){for(var n=e.length,i=n===t.length;i&&n--&&e[n]===t[n];);return n<0},jd=function(e,t,n,i,s){var a=e[i],o;if(s)for(o=t[s];a&&a[s]>o;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[i]=t,t._prev=a,t.parent=t._dp=e,t},Al=function(e,t,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=t._prev,a=t._next;s?s._next=a:e[n]===t&&(e[n]=a),a?a._prev=s:e[i]===t&&(e[i]=s),t._next=t._prev=t.parent=null},Pr=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Qr=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},Tg=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Fc=function(e,t,n,i){return e._startAt&&(hn?e._startAt.revert(Xo):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,i))},Ag=function r(e){return!e||e._ts&&r(e.parent)},Kf=function(e){return e._repeat?Js(e._tTime,e=e.duration()+e._rDelay)*e:0},Js=function(e,t){var n=Math.floor(e=Lt(e/t));return e&&n===e?n-1:n},cl=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},wl=function(e){return e._end=Lt(e._start+(e._tDur/Math.abs(e._ts||e._rts||Tt)||0))},Rl=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=Lt(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),wl(e),n._dirty||Qr(n,e)),e},Qd=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=cl(e.rawTime(),t),(!t._dur||Qa(0,t.totalDuration(),n)-t._tTime>Tt)&&t.render(n,!0)),Qr(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-Tt}},Di=function(e,t,n,i){return t.parent&&Pr(t),t._start=Lt((rr(n)?n:n||e!==It?oi(e,n,t):e._time)+t._delay),t._end=Lt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),jd(e,t,"_first","_last",e._sort?"_start":0),Oc(t)||(e._recent=t),i||Qd(e,t),e._ts<0&&Rl(e,e._tTime),e},ep=function(e,t){return(ni.ScrollTrigger||ef("scrollTrigger",t))&&ni.ScrollTrigger.create(t,e)},tp=function(e,t,n,i,s){if(of(e,t,s),!e._initted)return 1;if(!n&&e._pt&&!hn&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&qd!==Zn.frame)return wr.push(e),e._lazy=[s,i],1},wg=function r(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||r(t))},Oc=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Rg=function(e,t,n,i){var s=e.ratio,a=t<0||!t&&(!e._start&&wg(e)&&!(!e._initted&&Oc(e))||(e._ts<0||e._dp._ts<0)&&!Oc(e))?0:1,o=e._rDelay,l=0,c,u,d;if(o&&e._repeat&&(l=Qa(0,e._tDur,t),u=Js(l,o),e._yoyo&&u&1&&(a=1-a),u!==Js(e._tTime,o)&&(s=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==s||hn||i||e._zTime===Tt||!t&&e._zTime){if(!e._initted&&tp(e,t,i,n,l))return;for(d=e._zTime,e._zTime=t||(n?Tt:0),n||(n=t&&!d),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&Fc(e,t,n,!0),e._onUpdate&&!n&&jn(e,"onUpdate"),l&&e._repeat&&!n&&e.parent&&jn(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&Pr(e,1),!n&&!hn&&(jn(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Cg=function(e,t,n){var i;if(n>t)for(i=e._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>t)return i;i=i._next}else for(i=e._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<t)return i;i=i._prev}},js=function(e,t,n,i){var s=e._repeat,a=Lt(t)||0,o=e._tTime/e._tDur;return o&&!i&&(e._time*=a/e._dur),e._dur=a,e._tDur=s?s<0?1e10:Lt(a*(s+1)+e._rDelay*s):a,o>0&&!i&&Rl(e,e._tTime=e._tDur*o),e.parent&&wl(e),n||Qr(e.parent,e),e},Zf=function(e){return e instanceof Un?Qr(e):js(e,e._dur)},Pg={_start:0,endTime:Ha,totalDuration:Ha},oi=function r(e,t,n){var i=e.labels,s=e._recent||Pg,a=e.duration()>=hi?s.endTime(!1):e._dur,o,l,c;return cn(t)&&(isNaN(t)||t in i)?(l=t.charAt(0),c=t.substr(-1)==="%",o=t.indexOf("="),l==="<"||l===">"?(o>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(o<0?s:n).totalDuration()/100:1)):o<0?(t in i||(i[t]=a),i[t]):(l=parseFloat(t.charAt(o-1)+t.substr(o+1)),c&&n&&(l=l/100*(yn(n)?n[0]:n).totalDuration()),o>1?r(e,t.substr(0,o-1),n)+l:a+l)):t==null?a:+t},Ra=function(e,t,n){var i=rr(t[1]),s=(i?2:1)+(e<2?0:1),a=t[s],o,l;if(i&&(a.duration=t[1]),a.parent=n,e){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Fn(l.vars.inherit)&&l.parent;a.immediateRender=Fn(o.immediateRender),e<2?a.runBackwards=1:a.startAt=t[s-1]}return new Jt(t[0],a,t[s+1])},Ur=function(e,t){return e||e===0?t(e):t},Qa=function(e,t,n){return n<e?e:n>t?t:n},vn=function(e,t){return!cn(e)||!(t=vg.exec(e))?"":t[1]},Dg=function(e,t,n){return Ur(n,function(i){return Qa(e,t,i)})},Bc=[].slice,np=function(e,t){return e&&zi(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&zi(e[0]))&&!e.nodeType&&e!==Ri},Lg=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(i){var s;return cn(i)&&!t||np(i,1)?(s=n).push.apply(s,di(i)):n.push(i)})||n},di=function(e,t,n){return Dt&&!t&&Dt.selector?Dt.selector(e):cn(e)&&!n&&(Ic||!Qs())?Bc.call((t||Qu).querySelectorAll(e),0):yn(e)?Lg(e,n):np(e)?Bc.call(e,0):e?[e]:[]},kc=function(e){return e=di(e)[0]||Ga("Invalid scope")||{},function(t){var n=e.current||e.nativeElement||e;return di(t,n.querySelectorAll?n:n===e?Ga("Invalid scope")||Qu.createElement("div"):e)}},ip=function(e){return e.sort(function(){return .5-Math.random()})},rp=function(e){if(zt(e))return e;var t=zi(e)?e:{each:e},n=es(t.ease),i=t.from||0,s=parseFloat(t.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=t.axis,u=i,d=i;return cn(i)?u=d={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(u=i[0],d=i[1]),function(f,h,g){var _=(g||t).length,p=a[_],m,b,w,S,T,A,E,v,y;if(!p){if(y=t.grid==="auto"?0:(t.grid||[1,hi])[1],!y){for(E=-hi;E<(E=g[y++].getBoundingClientRect().left)&&y<_;);y<_&&y--}for(p=a[_]=[],m=l?Math.min(y,_)*u-.5:i%y,b=y===hi?0:l?_*d/y-.5:i/y|0,E=0,v=hi,A=0;A<_;A++)w=A%y-m,S=b-(A/y|0),p[A]=T=c?Math.abs(c==="y"?S:w):zd(w*w+S*S),T>E&&(E=T),T<v&&(v=T);i==="random"&&ip(p),p.max=E-v,p.min=v,p.v=_=(parseFloat(t.amount)||parseFloat(t.each)*(y>_?_-1:c?c==="y"?_/y:y:Math.max(y,_/y))||0)*(i==="edges"?-1:1),p.b=_<0?s-_:s,p.u=vn(t.amount||t.each)||0,n=n&&_<0?Xg(n):n}return _=(p[f]-p.min)/p.max||0,Lt(p.b+(n?n(_):_)*p.v)+p.u}},zc=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(n){var i=Lt(Math.round(parseFloat(n)/e)*e*t);return(i-i%1)/t+(rr(n)?0:vn(n))}},sp=function(e,t){var n=yn(e),i,s;return!n&&zi(e)&&(i=n=e.radius||hi,e.values?(e=di(e.values),(s=!rr(e[0]))&&(i*=i)):e=zc(e.increment)),Ur(t,n?zt(e)?function(a){return s=e(a),Math.abs(s-a)<=i?s:a}:function(a){for(var o=parseFloat(s?a.x:a),l=parseFloat(s?a.y:0),c=hi,u=0,d=e.length,f,h;d--;)s?(f=e[d].x-o,h=e[d].y-l,f=f*f+h*h):f=Math.abs(e[d]-o),f<c&&(c=f,u=d);return u=!i||c<=i?e[u]:a,s||u===a||rr(a)?u:u+vn(a)}:zc(e))},ap=function(e,t,n,i){return Ur(yn(e)?!t:n===!0?!!(n=0):!i,function(){return yn(e)?e[~~(Math.random()*e.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*i)/i})},Ng=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(i){return t.reduce(function(s,a){return a(s)},i)}},Ig=function(e,t){return function(n){return e(parseFloat(n))+(t||vn(n))}},Ug=function(e,t,n){return lp(e,t,0,1,n)},op=function(e,t,n){return Ur(n,function(i){return e[~~t(i)]})},Fg=function r(e,t,n){var i=t-e;return yn(e)?op(e,r(0,e.length),t):Ur(n,function(s){return(i+(s-e)%i)%i+e})},Og=function r(e,t,n){var i=t-e,s=i*2;return yn(e)?op(e,r(0,e.length-1),t):Ur(n,function(a){return a=(s+(a-e)%s)%s||0,e+(a>i?s-a:a)})},Va=function(e){return e.replace(gg,function(t){var n=t.indexOf("[")+1,i=t.substring(n||7,n?t.indexOf("]"):t.length-1).split(_g);return ap(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},lp=function(e,t,n,i,s){var a=t-e,o=i-n;return Ur(s,function(l){return n+((l-e)/a*o||0)})},Bg=function r(e,t,n,i){var s=isNaN(e+t)?0:function(h){return(1-h)*e+h*t};if(!s){var a=cn(e),o={},l,c,u,d,f;if(n===!0&&(i=1)&&(n=null),a)e={p:e},t={p:t};else if(yn(e)&&!yn(t)){for(u=[],d=e.length,f=d-2,c=1;c<d;c++)u.push(r(e[c-1],e[c]));d--,s=function(g){g*=d;var _=Math.min(f,~~g);return u[_](g-_)},n=t}else i||(e=Zs(yn(e)?[]:{},e));if(!u){for(l in t)af.call(o,e,l,"get",t[l]);s=function(g){return uf(g,o)||(a?e.p:e)}}}return Ur(n,s)},Jf=function(e,t,n){var i=e.labels,s=hi,a,o,l;for(a in i)o=i[a]-t,o<0==!!n&&o&&s>(o=Math.abs(o))&&(l=a,s=o);return l},jn=function(e,t,n){var i=e.vars,s=i[t],a=Dt,o=e._ctx,l,c,u;if(s)return l=i[t+"Params"],c=i.callbackScope||e,n&&wr.length&&ol(),o&&(Dt=o),u=l?s.apply(c,l):s.call(c),Dt=a,u},xa=function(e){return Pr(e),e.scrollTrigger&&e.scrollTrigger.kill(!!hn),e.progress()<1&&jn(e,"onInterrupt"),e},Os,cp=[],up=function(e){if(e)if(e=!e.name&&e.default||e,ju()||e.headless){var t=e.name,n=zt(e),i=t&&!n&&e.init?function(){this._props=[]}:e,s={init:Ha,render:uf,add:af,kill:t_,modifier:e_,rawVars:0},a={targetTest:0,get:0,getSetter:cf,aliases:{},register:0};if(Qs(),e!==i){if($n[t])return;ii(i,ii(ll(e,s),a)),Zs(i.prototype,Zs(s,ll(e,a))),$n[i.prop=t]=i,e.targetTest&&(Yo.push(i),tf[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Yd(t,i),e.register&&e.register(Hn,i,Bn)}else cp.push(e)},Et=255,va={aqua:[0,Et,Et],lime:[0,Et,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Et],navy:[0,0,128],white:[Et,Et,Et],olive:[128,128,0],yellow:[Et,Et,0],orange:[Et,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Et,0,0],pink:[Et,192,203],cyan:[0,Et,Et],transparent:[Et,Et,Et,0]},Bl=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*Et+.5|0},fp=function(e,t,n){var i=e?rr(e)?[e>>16,e>>8&Et,e&Et]:0:va.black,s,a,o,l,c,u,d,f,h,g;if(!i){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),va[e])i=va[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),a=e.charAt(2),o=e.charAt(3),e="#"+s+s+a+a+o+o+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return i=parseInt(e.substr(1,6),16),[i>>16,i>>8&Et,i&Et,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),i=[e>>16,e>>8&Et,e&Et]}else if(e.substr(0,3)==="hsl"){if(i=g=e.match(Yf),!t)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,a=u<=.5?u*(c+1):u+c-u*c,s=u*2-a,i.length>3&&(i[3]*=1),i[0]=Bl(l+1/3,s,a),i[1]=Bl(l,s,a),i[2]=Bl(l-1/3,s,a);else if(~e.indexOf("="))return i=e.match(Hd),n&&i.length<4&&(i[3]=1),i}else i=e.match(Yf)||va.transparent;i=i.map(Number)}return t&&!g&&(s=i[0]/Et,a=i[1]/Et,o=i[2]/Et,d=Math.max(s,a,o),f=Math.min(s,a,o),u=(d+f)/2,d===f?l=c=0:(h=d-f,c=u>.5?h/(2-d-f):h/(d+f),l=d===s?(a-o)/h+(a<o?6:0):d===a?(o-s)/h+2:(s-a)/h+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},hp=function(e){var t=[],n=[],i=-1;return e.split(Rr).forEach(function(s){var a=s.match(Fs)||[];t.push.apply(t,a),n.push(i+=a.length+1)}),t.c=n,t},jf=function(e,t,n){var i="",s=(e+i).match(Rr),a=t?"hsla(":"rgba(",o=0,l,c,u,d;if(!s)return e;if(s=s.map(function(f){return(f=fp(f,t,1))&&a+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),n&&(u=hp(e),l=n.c,l.join(i)!==u.c.join(i)))for(c=e.replace(Rr,"1").split(Fs),d=c.length-1;o<d;o++)i+=c[o]+(~l.indexOf(o)?s.shift()||a+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=e.split(Rr),d=c.length-1;o<d;o++)i+=c[o]+s[o];return i+c[d]},Rr=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in va)r+="|"+e+"\\b";return new RegExp(r+")","gi")})(),kg=/hsl[a]?\(/,dp=function(e){var t=e.join(" "),n;if(Rr.lastIndex=0,Rr.test(t))return n=kg.test(t),e[1]=jf(e[1],n),e[0]=jf(e[0],n,hp(e[1])),!0},Wa,Zn=(function(){var r=Date.now,e=500,t=33,n=r(),i=n,s=1e3/240,a=s,o=[],l,c,u,d,f,h,g=function _(p){var m=r()-i,b=p===!0,w,S,T,A;if((m>e||m<0)&&(n+=m-t),i+=m,T=i-n,w=T-a,(w>0||b)&&(A=++d.frame,f=T-d.time*1e3,d.time=T=T/1e3,a+=w+(w>=s?4:s-w),S=1),b||(l=c(_)),S)for(h=0;h<o.length;h++)o[h](T,f,A,p)};return d={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(p){return f/(1e3/(p||60))},wake:function(){Wd&&(!Ic&&ju()&&(Ri=Ic=window,Qu=Ri.document||{},ni.gsap=Hn,(Ri.gsapVersions||(Ri.gsapVersions=[])).push(Hn.version),Xd(al||Ri.GreenSockGlobals||!Ri.gsap&&Ri||{}),cp.forEach(up)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=u||function(p){return setTimeout(p,a-d.time*1e3+1|0)},Wa=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),Wa=0,c=Ha},lagSmoothing:function(p,m){e=p||1/0,t=Math.min(m||33,e)},fps:function(p){s=1e3/(p||240),a=d.time*1e3+s},add:function(p,m,b){var w=m?function(S,T,A,E){p(S,T,A,E),d.remove(w)}:p;return d.remove(p),o[b?"unshift":"push"](w),Qs(),w},remove:function(p,m){~(m=o.indexOf(p))&&o.splice(m,1)&&h>=m&&h--},_listeners:o},d})(),Qs=function(){return!Wa&&Zn.wake()},ct={},zg=/^[\d.\-M][\d.\-,\s]/,Gg=/["']/g,Hg=function(e){for(var t={},n=e.substr(1,e.length-3).split(":"),i=n[0],s=1,a=n.length,o,l,c;s<a;s++)l=n[s],o=s!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),t[i]=isNaN(c)?c.replace(Gg,"").trim():+c,i=l.substr(o+1).trim();return t},Vg=function(e){var t=e.indexOf("(")+1,n=e.indexOf(")"),i=e.indexOf("(",t);return e.substring(t,~i&&i<n?e.indexOf(")",n+1):n)},Wg=function(e){var t=(e+"").split("("),n=ct[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf("{")?[Hg(t[1])]:Vg(e).split(",").map(Zd)):ct._CE&&zg.test(e)?ct._CE("",e):n},Xg=function(e){return function(t){return 1-e(1-t)}},es=function(e,t){return e&&(zt(e)?e:ct[e]||Wg(e))||t},fs=function(e,t,n,i){n===void 0&&(n=function(l){return 1-t(1-l)}),i===void 0&&(i=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:n,easeInOut:i},a;return On(e,function(o){ct[o]=ni[o]=s,ct[a=o.toLowerCase()]=n;for(var l in s)ct[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ct[o+"."+l]=s[l]}),s},pp=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},kl=function r(e,t,n){var i=t>=1?t:1,s=(n||(e?.3:.45))/(t<1?t:1),a=s/Nc*(Math.asin(1/i)||0),o=function(u){return u===1?1:i*Math.pow(2,-10*u)*mg((u-a)*s)+1},l=e==="out"?o:e==="in"?function(c){return 1-o(1-c)}:pp(o);return s=Nc/s,l.config=function(c,u){return r(e,c,u)},l},zl=function r(e,t){t===void 0&&(t=1.70158);var n=function(a){return a?--a*a*((t+1)*a+t)+1:0},i=e==="out"?n:e==="in"?function(s){return 1-n(1-s)}:pp(n);return i.config=function(s){return r(e,s)},i};On("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,e){var t=e<5?e+1:e;fs(r+",Power"+(t-1),e?function(n){return Math.pow(n,t)}:function(n){return n},function(n){return 1-Math.pow(1-n,t)},function(n){return n<.5?Math.pow(n*2,t)/2:1-Math.pow((1-n)*2,t)/2})});ct.Linear.easeNone=ct.none=ct.Linear.easeIn;fs("Elastic",kl("in"),kl("out"),kl());(function(r,e){var t=1/e,n=2*t,i=2.5*t,s=function(o){return o<t?r*o*o:o<n?r*Math.pow(o-1.5/e,2)+.75:o<i?r*(o-=2.25/e)*o+.9375:r*Math.pow(o-2.625/e,2)+.984375};fs("Bounce",function(a){return 1-s(1-a)},s)})(7.5625,2.75);fs("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});fs("Circ",function(r){return-(zd(1-r*r)-1)});fs("Sine",function(r){return r===1?1:-pg(r*hg)+1});fs("Back",zl("in"),zl("out"),zl());ct.SteppedEase=ct.steps=ni.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,i=e+(t?0:1),s=t?1:0,a=1-Tt;return function(o){return((i*Qa(0,a,o)|0)+s)*n}}};za.ease=ct["quad.out"];On("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return nf+=r+","+r+"Params,"});var mp=function(e,t){this.id=dg++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:$d,this.set=t?t.getSetter:cf},Xa=(function(){function r(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,js(this,+t.duration,1,1),this.data=t.data,Dt&&(this._ctx=Dt,Dt.data.push(this)),Wa||Zn.wake()}var e=r.prototype;return e.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},e.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},e.totalDuration=function(n){return arguments.length?(this._dirty=0,js(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(n,i){if(Qs(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Rl(this,n),!s._dp||s.parent||Qd(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Di(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Tt||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Kd(this,n,i)),this},e.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+Kf(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},e.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+Kf(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?Js(this._tTime,s)+1:1},e.timeScale=function(n,i){if(!arguments.length)return this._rts===-Tt?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?cl(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Tt?0:this._rts,this.totalTime(Qa(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),wl(this),Tg(this)},e.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Qs(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Tt&&(this._tTime-=Tt)))),this):this._ps},e.startTime=function(n){if(arguments.length){this._start=Lt(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&Di(i,this,this._start-this._delay),this}return this._start},e.endTime=function(n){return this._start+(Fn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?cl(i.rawTime(n),this):this._tTime:this._tTime},e.revert=function(n){n===void 0&&(n=Mg);var i=hn;return hn=n,sf(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),hn=i,this},e.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},e.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,Zf(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,Zf(this),i?this.time(i):this}return this._rDelay},e.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},e.seek=function(n,i){return this.totalTime(oi(this,n),Fn(i))},e.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Fn(i)),this._dur||(this._zTime=-Tt),this},e.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},e.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},e.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Tt:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-Tt,this},e.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-Tt)},e.eventCallback=function(n,i,s){var a=this.vars;return arguments.length>1?(i?(a[n]=i,s&&(a[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},e.then=function(n){var i=this,s=i._prom;return new Promise(function(a){var o=zt(n)?n:Jd,l=function(){var u=i.then;i.then=null,s&&s(),zt(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=u),a(o),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},e.kill=function(){xa(this)},r})();ii(Xa.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Tt,_prom:0,_ps:!1,_rts:1});var Un=(function(r){kd(e,r);function e(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Fn(n.sortChildren),It&&Di(n.parent||It,qi(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&ep(qi(s),n.scrollTrigger),s}var t=e.prototype;return t.to=function(i,s,a){return Ra(0,arguments,this),this},t.from=function(i,s,a){return Ra(1,arguments,this),this},t.fromTo=function(i,s,a,o){return Ra(2,arguments,this),this},t.set=function(i,s,a){return s.duration=0,s.parent=this,wa(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Jt(i,s,oi(this,a),1),this},t.call=function(i,s,a){return Di(this,Jt.delayedCall(0,i,s),a)},t.staggerTo=function(i,s,a,o,l,c,u){return a.duration=s,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=u,a.parent=this,new Jt(i,a,oi(this,l)),this},t.staggerFrom=function(i,s,a,o,l,c,u){return a.runBackwards=1,wa(a).immediateRender=Fn(a.immediateRender),this.staggerTo(i,s,a,o,l,c,u)},t.staggerFromTo=function(i,s,a,o,l,c,u,d){return o.startAt=a,wa(o).immediateRender=Fn(o.immediateRender),this.staggerTo(i,s,o,l,c,u,d)},t.render=function(i,s,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:Lt(i),d=this._zTime<0!=i<0&&(this._initted||!c),f,h,g,_,p,m,b,w,S,T,A,E;if(this!==It&&u>l&&i>=0&&(u=l),u!==this._tTime||a||d){if(o!==this._time&&c&&(u+=this._time-o,i+=this._time-o),f=u,S=this._start,w=this._ts,m=!w,d&&(c||(o=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(A=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,s,a);if(f=Lt(u%p),u===l?(_=this._repeat,f=c):(T=Lt(u/p),_=~~T,_&&_===T&&(f=c,_--),f>c&&(f=c)),T=Js(this._tTime,p),!o&&this._tTime&&T!==_&&this._tTime-T*p-this._dur<=0&&(T=_),A&&_&1&&(f=c-f,E=1),_!==T&&!this._lock){var v=A&&T&1,y=v===(A&&_&1);if(_<T&&(v=!v),o=v?0:u%c?c:u,this._lock=1,this.render(o||(E?0:Lt(_*p)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&jn(this,"onRepeat"),this.vars.repeatRefresh&&!E&&(this.invalidate()._lock=1,T=_),o&&o!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,y&&(this._lock=2,o=v?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!E&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(b=Cg(this,Lt(o),Lt(f)),b&&(u-=f-(f=b._start))),this._tTime=u,this._time=f,this._act=!!w,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&u&&c&&!s&&!T&&(jn(this,"onStart"),this._tTime!==u))return this;if(f>=o&&i>=0)for(h=this._first;h;){if(g=h._next,(h._act||f>=h._start)&&h._ts&&b!==h){if(h.parent!==this)return this.render(i,s,a);if(h.render(h._ts>0?(f-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(f-h._start)*h._ts,s,a),f!==this._time||!this._ts&&!m){b=0,g&&(u+=this._zTime=-Tt);break}}h=g}else{h=this._last;for(var R=i<0?i:f;h;){if(g=h._prev,(h._act||R<=h._end)&&h._ts&&b!==h){if(h.parent!==this)return this.render(i,s,a);if(h.render(h._ts>0?(R-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(R-h._start)*h._ts,s,a||hn&&sf(h)),f!==this._time||!this._ts&&!m){b=0,g&&(u+=this._zTime=R?-Tt:Tt);break}}h=g}}if(b&&!s&&(this.pause(),b.render(f>=o?0:-Tt)._zTime=f>=o?1:-1,this._ts))return this._start=S,wl(this),this.render(i,s,a);this._onUpdate&&!s&&jn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&o)&&(S===this._start||Math.abs(w)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Pr(this,1),!s&&!(i<0&&!o)&&(u||o||!l)&&(jn(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(i,s){var a=this;if(rr(s)||(s=oi(this,s,i)),!(i instanceof Xa)){if(yn(i))return i.forEach(function(o){return a.add(o,s)}),this;if(cn(i))return this.addLabel(i,s);if(zt(i))i=Jt.delayedCall(0,i);else return this}return this!==i?Di(this,i,s):this},t.getChildren=function(i,s,a,o){i===void 0&&(i=!0),s===void 0&&(s=!0),a===void 0&&(a=!0),o===void 0&&(o=-hi);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof Jt?s&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,a)))),c=c._next;return l},t.getById=function(i){for(var s=this.getChildren(1,1,1),a=s.length;a--;)if(s[a].vars.id===i)return s[a]},t.remove=function(i){return cn(i)?this.removeLabel(i):zt(i)?this.killTweensOf(i):(i.parent===this&&Al(this,i),i===this._recent&&(this._recent=this._last),Qr(this))},t.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Lt(Zn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},t.addLabel=function(i,s){return this.labels[i]=oi(this,s),this},t.removeLabel=function(i){return delete this.labels[i],this},t.addPause=function(i,s,a){var o=Jt.delayedCall(0,s||Ha,a);return o.data="isPause",this._hasPause=1,Di(this,o,oi(this,i))},t.removePause=function(i){var s=this._first;for(i=oi(this,i);s;)s._start===i&&s.data==="isPause"&&Pr(s),s=s._next},t.killTweensOf=function(i,s,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)Mr!==o[l]&&o[l].kill(i,s);return this},t.getTweensOf=function(i,s){for(var a=[],o=di(i),l=this._first,c=rr(s),u;l;)l instanceof Jt?yg(l._targets,o)&&(c?(!Mr||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&a.push(l):(u=l.getTweensOf(o,s)).length&&a.push.apply(a,u),l=l._next;return a},t.tweenTo=function(i,s){s=s||{};var a=this,o=oi(a,i),l=s,c=l.startAt,u=l.onStart,d=l.onStartParams,f=l.immediateRender,h,g=Jt.to(a,ii({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||Tt,onStart:function(){if(a.pause(),!h){var p=s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==p&&js(g,p,0,1).render(g._time,!0,!0),h=1}u&&u.apply(g,d||[])}},s));return f?g.render(0):g},t.tweenFromTo=function(i,s,a){return this.tweenTo(s,ii({startAt:{time:oi(this,i)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(i){return i===void 0&&(i=this._time),Jf(this,oi(this,i))},t.previousLabel=function(i){return i===void 0&&(i=this._time),Jf(this,oi(this,i),1)},t.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Tt)},t.shiftChildren=function(i,s,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=Lt(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(s)for(c in l)l[c]>=a&&(l[c]+=i);return Qr(this)},t.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},t.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,a;s;)a=s._next,this.remove(s),s=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),Qr(this)},t.totalDuration=function(i){var s=0,a=this,o=a._last,l=hi,c,u,d;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(d=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),u=o._start,u>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Di(a,o,u-o._delay,1)._lock=0):l=u,u<0&&o._ts&&(s-=u,(!d&&!a._dp||d&&d.smoothChildTiming)&&(a._start+=Lt(u/a._ts),a._time-=u,a._tTime-=u),a.shiftChildren(-u,!1,-1/0),l=0),o._end>s&&o._ts&&(s=o._end),o=c;js(a,a===It&&a._time>s?a._time:s,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(i){if(It._ts&&(Kd(It,cl(i,It)),qd=Zn.frame),Zn.frame>=qf){qf+=ei.autoSleep||120;var s=It._first;if((!s||!s._ts)&&ei.autoSleep&&Zn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||Zn.sleep()}}},e})(Xa);ii(Un.prototype,{_lock:0,_hasPause:0,_forcing:0});var Yg=function(e,t,n,i,s,a,o){var l=new Bn(this._pt,e,t,0,1,Mp,null,s),c=0,u=0,d,f,h,g,_,p,m,b;for(l.b=n,l.e=i,n+="",i+="",(m=~i.indexOf("random("))&&(i=Va(i)),a&&(b=[n,i],a(b,e,t),n=b[0],i=b[1]),f=n.match(Fl)||[];d=Fl.exec(i);)g=d[0],_=i.substring(c,d.index),h?h=(h+1)%5:_.substr(-5)==="rgba("&&(h=1),g!==f[u++]&&(p=parseFloat(f[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:p,c:g.charAt(1)==="="?ks(p,g)-p:parseFloat(g)-p,m:h&&h<4?Math.round:0},c=Fl.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(Vd.test(i)||m)&&(l.e=0),this._pt=l,l},af=function(e,t,n,i,s,a,o,l,c,u){zt(i)&&(i=i(s||0,e,a));var d=e[t],f=n!=="get"?n:zt(d)?c?e[t.indexOf("set")||!zt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():d,h=zt(d)?c?Jg:vp:lf,g;if(cn(i)&&(~i.indexOf("random(")&&(i=Va(i)),i.charAt(1)==="="&&(g=ks(f,i)+(vn(f)||0),(g||g===0)&&(i=g))),!u||f!==i||Gc)return!isNaN(f*i)&&i!==""?(g=new Bn(this._pt,e,t,+f||0,i-(f||0),typeof d=="boolean"?Qg:Sp,0,h),c&&(g.fp=c),o&&g.modifier(o,this,e),this._pt=g):(!d&&!(t in e)&&ef(t,i),Yg.call(this,e,t,f,i,h,l||ei.stringFilter,c))},qg=function(e,t,n,i,s){if(zt(e)&&(e=Ca(e,s,t,n,i)),!zi(e)||e.style&&e.nodeType||yn(e)||Gd(e))return cn(e)?Ca(e,s,t,n,i):e;var a={},o;for(o in e)a[o]=Ca(e[o],s,t,n,i);return a},gp=function(e,t,n,i,s,a){var o,l,c,u;if($n[e]&&(o=new $n[e]).init(s,o.rawVars?t[e]:qg(t[e],i,s,a,n),n,i,a)!==!1&&(n._pt=l=new Bn(n._pt,s,e,0,1,o.render,o,0,o.priority),n!==Os))for(c=n._ptLookup[n._targets.indexOf(s)],u=o._props.length;u--;)c[o._props[u]]=l;return o},Mr,Gc,of=function r(e,t,n){var i=e.vars,s=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,d=i.yoyoEase,f=i.keyframes,h=i.autoRevert,g=e._dur,_=e._startAt,p=e._targets,m=e.parent,b=m&&m.data==="nested"?m.vars.targets:p,w=e._overwrite==="auto"&&!Zu,S=e.timeline,T=i.easeReverse||d,A,E,v,y,R,D,L,z,H,F,G,O,K;if(S&&(!f||!s)&&(s="none"),e._ease=es(s,za.ease),e._rEase=T&&(es(T)||e._ease),e._from=!S&&!!i.runBackwards,e._from&&(e.ratio=1),!S||f&&!i.stagger){if(z=p[0]?jr(p[0]).harness:0,O=z&&i[z.prop],A=ll(i,tf),_&&(_._zTime<0&&_.progress(1),t<0&&u&&o&&!h?_.render(-1,!0):_.revert(u&&g?Xo:Sg),_._lazy=0),a){if(Pr(e._startAt=Jt.set(p,ii({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!_&&Fn(l),startAt:null,delay:0,onUpdate:c&&function(){return jn(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(hn||!o&&!h)&&e._startAt.revert(Xo),o&&g&&t<=0&&n<=0){t&&(e._zTime=t);return}}else if(u&&g&&!_){if(t&&(o=!1),v=ii({overwrite:!1,data:"isFromStart",lazy:o&&!_&&Fn(l),immediateRender:o,stagger:0,parent:m},A),O&&(v[z.prop]=O),Pr(e._startAt=Jt.set(p,v)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(hn?e._startAt.revert(Xo):e._startAt.render(-1,!0)),e._zTime=t,!o)r(e._startAt,Tt,Tt);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&Fn(l)||l&&!g,E=0;E<p.length;E++){if(R=p[E],L=R._gsap||rf(p)[E]._gsap,e._ptLookup[E]=F={},Uc[L.id]&&wr.length&&ol(),G=b===p?E:b.indexOf(R),z&&(H=new z).init(R,O||A,e,G,b)!==!1&&(e._pt=y=new Bn(e._pt,R,H.name,0,1,H.render,H,0,H.priority),H._props.forEach(function(te){F[te]=y}),H.priority&&(D=1)),!z||O)for(v in A)$n[v]&&(H=gp(v,A,e,G,R,b))?H.priority&&(D=1):F[v]=y=af.call(e,R,v,"get",A[v],G,b,0,i.stringFilter);e._op&&e._op[E]&&e.kill(R,e._op[E]),w&&e._pt&&(Mr=e,It.killTweensOf(R,F,e.globalTime(t)),K=!e.parent,Mr=0),e._pt&&l&&(Uc[L.id]=1)}D&&yp(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!K,f&&t<=0&&S.render(hi,!0,!0)},$g=function(e,t,n,i,s,a,o,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,d,f,h;if(!c)for(c=e._ptCache[t]=[],f=e._ptLookup,h=e._targets.length;h--;){if(u=f[h][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return Gc=1,e.vars[t]="+=0",of(e,o),Gc=0,l?Ga(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(h=c.length;h--;)d=c[h],u=d._pt||d,u.s=(i||i===0)&&!s?i:u.s+(i||0)+a*u.c,u.c=n-u.s,d.e&&(d.e=Wt(n)+vn(d.e)),d.b&&(d.b=u.s+vn(d.b))},Kg=function(e,t){var n=e[0]?jr(e[0]).harness:0,i=n&&n.aliases,s,a,o,l;if(!i)return t;s=Zs({},t);for(a in i)if(a in s)for(l=i[a].split(","),o=l.length;o--;)s[l[o]]=s[a];return s},Zg=function(e,t,n,i){var s=t.ease||i||"power1.inOut",a,o;if(yn(t))o=n[e]||(n[e]=[]),t.forEach(function(l,c){return o.push({t:c/(t.length-1)*100,v:l,e:s})});else for(a in t)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(e),v:t[a],e:s})},Ca=function(e,t,n,i,s){return zt(e)?e.call(t,n,i,s):cn(e)&&~e.indexOf("random(")?Va(e):e},_p=nf+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",xp={};On(_p+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return xp[r]=1});var Jt=(function(r){kd(e,r);function e(n,i,s,a){var o;typeof i=="number"&&(s.duration=i,i=s,s=null),o=r.call(this,a?i:wa(i))||this;var l=o.vars,c=l.duration,u=l.delay,d=l.immediateRender,f=l.stagger,h=l.overwrite,g=l.keyframes,_=l.defaults,p=l.scrollTrigger,m=i.parent||It,b=(yn(n)||Gd(n)?rr(n[0]):"length"in i)?[n]:di(n),w,S,T,A,E,v,y,R;if(o._targets=b.length?rf(b):Ga("GSAP target "+n+" not found. https://gsap.com",!ei.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=h,g||f||ro(c)||ro(u)){i=o.vars;var D=i.easeReverse||i.yoyoEase;if(w=o.timeline=new Un({data:"nested",defaults:_||{},targets:m&&m.data==="nested"?m.vars.targets:b}),w.kill(),w.parent=w._dp=qi(o),w._start=0,f||ro(c)||ro(u)){if(A=b.length,y=f&&rp(f),zi(f))for(E in f)~_p.indexOf(E)&&(R||(R={}),R[E]=f[E]);for(S=0;S<A;S++)T=ll(i,xp),T.stagger=0,D&&(T.easeReverse=D),R&&Zs(T,R),v=b[S],T.duration=+Ca(c,qi(o),S,v,b),T.delay=(+Ca(u,qi(o),S,v,b)||0)-o._delay,!f&&A===1&&T.delay&&(o._delay=u=T.delay,o._start+=u,T.delay=0),w.to(v,T,y?y(S,v,b):0),w._ease=ct.none;w.duration()?c=u=0:o.timeline=0}else if(g){wa(ii(w.vars.defaults,{ease:"none"})),w._ease=es(g.ease||i.ease||"none");var L=0,z,H,F;if(yn(g))g.forEach(function(G){return w.to(b,G,">")}),w.duration();else{T={};for(E in g)E==="ease"||E==="easeEach"||Zg(E,g[E],T,g.easeEach);for(E in T)for(z=T[E].sort(function(G,O){return G.t-O.t}),L=0,S=0;S<z.length;S++)H=z[S],F={ease:H.e,duration:(H.t-(S?z[S-1].t:0))/100*c},F[E]=H.v,w.to(b,F,L),L+=F.duration;w.duration()<c&&w.to({},{duration:c-w.duration()})}}c||o.duration(c=w.duration())}else o.timeline=0;return h===!0&&!Zu&&(Mr=qi(o),It.killTweensOf(b),Mr=0),Di(m,qi(o),s),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(d||!c&&!g&&o._start===Lt(m._time)&&Fn(d)&&Ag(qi(o))&&m.data!=="nested")&&(o._tTime=-Tt,o.render(Math.max(0,-u)||0)),p&&ep(qi(o),p),o}var t=e.prototype;return t.render=function(i,s,a){var o=this._time,l=this._tDur,c=this._dur,u=i<0,d=i>l-Tt&&!u?l:i<Tt?0:i,f,h,g,_,p,m,b,w;if(!c)Rg(this,i,s,a);else if(d!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=d,w=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+i,s,a);if(f=Lt(d%_),d===l?(g=this._repeat,f=c):(p=Lt(d/_),g=~~p,g&&g===p?(f=c,g--):f>c&&(f=c)),m=this._yoyo&&g&1,m&&(f=c-f),p=Js(this._tTime,_),f===o&&!a&&this._initted&&g===p)return this._tTime=d,this;g!==p&&this.vars.repeatRefresh&&!m&&!this._lock&&f!==_&&this._initted&&(this._lock=a=1,this.render(Lt(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(tp(this,u?i:f,a,s,d))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==p))return this;if(c!==this._dur)return this.render(i,s,a)}if(this._rEase){var S=f<o;if(S!==this._inv){var T=S?o:c-o;this._inv=S,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=T?(S?-1:1)/T:0,this._invScale=S?-this.ratio:1-this.ratio,this._invEase=S?this._rEase:this._ease}this.ratio=b=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=b=this._ease(f/c);if(this._from&&(this.ratio=b=1-b),this._tTime=d,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&d&&!s&&!p&&(jn(this,"onStart"),this._tTime!==d))return this;for(h=this._pt;h;)h.r(b,h.d),h=h._next;w&&w.render(i<0?i:w._dur*w._ease(f/this._dur),s,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(u&&Fc(this,i,s,a),jn(this,"onUpdate")),this._repeat&&g!==p&&this.vars.onRepeat&&!s&&this.parent&&jn(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(u&&!this._onUpdate&&Fc(this,i,!0,!0),(i||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&Pr(this,1),!s&&!(u&&!o)&&(d||o||m)&&(jn(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},t.resetTo=function(i,s,a,o,l){Wa||Zn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||of(this,c),u=this._ease(c/this._dur),$g(this,i,s,a,o,u,c,l)?this.resetTo(i,s,a,o,1):(Rl(this,0),this.parent||jd(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?xa(this):this.scrollTrigger&&this.scrollTrigger.kill(!!hn),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,Mr&&Mr.vars.overwrite!==!0)._first||xa(this),this.parent&&a!==this.timeline.totalDuration()&&js(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?di(i):o,c=this._ptLookup,u=this._pt,d,f,h,g,_,p,m;if((!s||s==="all")&&Eg(o,l))return s==="all"&&(this._pt=0),xa(this);for(d=this._op=this._op||[],s!=="all"&&(cn(s)&&(_={},On(s,function(b){return _[b]=1}),s=_),s=Kg(o,s)),m=o.length;m--;)if(~l.indexOf(o[m])){f=c[m],s==="all"?(d[m]=s,g=f,h={}):(h=d[m]=d[m]||{},g=s);for(_ in g)p=f&&f[_],p&&((!("kill"in p.d)||p.d.kill(_)===!0)&&Al(this,p,"_pt"),delete f[_]),h!=="all"&&(h[_]=1)}return this._initted&&!this._pt&&u&&xa(this),this},e.to=function(i,s){return new e(i,s,arguments[2])},e.from=function(i,s){return Ra(1,arguments)},e.delayedCall=function(i,s,a,o){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},e.fromTo=function(i,s,a){return Ra(2,arguments)},e.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(i,s)},e.killTweensOf=function(i,s,a){return It.killTweensOf(i,s,a)},e})(Xa);ii(Jt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});On("staggerTo,staggerFrom,staggerFromTo",function(r){Jt[r]=function(){var e=new Un,t=Bc.call(arguments,0);return t.splice(r==="staggerFromTo"?5:4,0,0),e[r].apply(e,t)}});var lf=function(e,t,n){return e[t]=n},vp=function(e,t,n){return e[t](n)},Jg=function(e,t,n,i){return e[t](i.fp,n)},jg=function(e,t,n){return e.setAttribute(t,n)},cf=function(e,t){return zt(e[t])?vp:Ju(e[t])&&e.setAttribute?jg:lf},Sp=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},Qg=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Mp=function(e,t){var n=t._pt,i="";if(!e&&t.b)i=t.b;else if(e===1&&t.e)i=t.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+i,n=n._next;i+=t.c}t.set(t.t,t.p,i,t)},uf=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},e_=function(e,t,n,i){for(var s=this._pt,a;s;)a=s._next,s.p===i&&s.modifier(e,t,n),s=a},t_=function(e){for(var t=this._pt,n,i;t;)i=t._next,t.p===e&&!t.op||t.op===e?Al(this,t,"_pt"):t.dep||(n=1),t=i;return!n},n_=function(e,t,n,i){i.mSet(e,t,i.m.call(i.tween,n,i.mt),i)},yp=function(e){for(var t=e._pt,n,i,s,a;t;){for(n=t._next,i=s;i&&i.pr>t.pr;)i=i._next;(t._prev=i?i._prev:a)?t._prev._next=t:s=t,(t._next=i)?i._prev=t:a=t,t=n}e._pt=s},Bn=(function(){function r(t,n,i,s,a,o,l,c,u){this.t=n,this.s=s,this.c=a,this.p=i,this.r=o||Sp,this.d=l||this,this.set=c||lf,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=r.prototype;return e.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=n_,this.m=n,this.mt=s,this.tween=i},r})();On(nf+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return tf[r]=1});ni.TweenMax=ni.TweenLite=Jt;ni.TimelineLite=ni.TimelineMax=Un;It=new Un({sortChildren:!1,defaults:za,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ei.stringFilter=dp;var ts=[],qo={},i_=[],Qf=0,r_=0,Gl=function(e){return(qo[e]||i_).map(function(t){return t()})},Hc=function(){var e=Date.now(),t=[];e-Qf>2&&(Gl("matchMediaInit"),ts.forEach(function(n){var i=n.queries,s=n.conditions,a,o,l,c;for(o in i)a=Ri.matchMedia(i[o]).matches,a&&(l=1),a!==s[o]&&(s[o]=a,c=1);c&&(n.revert(),l&&t.push(n))}),Gl("matchMediaRevert"),t.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),Qf=e,Gl("matchMedia"))},bp=(function(){function r(t,n){this.selector=n&&kc(n),this.data=[],this._r=[],this.isReverted=!1,this.id=r_++,t&&this.add(t)}var e=r.prototype;return e.add=function(n,i,s){zt(n)&&(s=i,i=n,n=zt);var a=this,o=function(){var c=Dt,u=a.selector,d;return c&&c!==a&&c.data.push(a),s&&(a.selector=kc(s)),Dt=a,d=i.apply(a,arguments),zt(d)&&a._r.push(d),Dt=c,a.selector=u,a.isReverted=!1,d};return a.last=o,n===zt?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},e.ignore=function(n){var i=Dt;Dt=null,n(this),Dt=i},e.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof Jt&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(n,i){var s=this;if(n?(function(){for(var o=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return o.splice(o.indexOf(u),1)}));for(o.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,d){return d.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Un?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Jt)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i)for(var a=ts.length;a--;)ts[a].id===this.id&&ts.splice(a,1)},e.revert=function(n){this.kill(n||{})},r})(),s_=(function(){function r(t){this.contexts=[],this.scope=t,Dt&&Dt.data.push(this)}var e=r.prototype;return e.add=function(n,i,s){zi(n)||(n={matches:n});var a=new bp(0,s||this.scope),o=a.conditions={},l,c,u;Dt&&!a.selector&&(a.selector=Dt.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?u=1:(l=Ri.matchMedia(n[c]),l&&(ts.indexOf(a)<0&&ts.push(a),(o[c]=l.matches)&&(u=1),l.addListener?l.addListener(Hc):l.addEventListener("change",Hc)));return u&&i(a,function(d){return a.add(null,d)}),this},e.revert=function(n){this.kill(n||{})},e.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),ul={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(i){return up(i)})},timeline:function(e){return new Un(e)},getTweensOf:function(e,t){return It.getTweensOf(e,t)},getProperty:function(e,t,n,i){cn(e)&&(e=di(e)[0]);var s=jr(e||{}).get,a=n?Jd:Zd;return n==="native"&&(n=""),e&&(t?a(($n[t]&&$n[t].get||s)(e,t,n,i)):function(o,l,c){return a(($n[o]&&$n[o].get||s)(e,o,l,c))})},quickSetter:function(e,t,n){if(e=di(e),e.length>1){var i=e.map(function(u){return Hn.quickSetter(u,t,n)}),s=i.length;return function(u){for(var d=s;d--;)i[d](u)}}e=e[0]||{};var a=$n[t],o=jr(e),l=o.harness&&(o.harness.aliases||{})[t]||t,c=a?function(u){var d=new a;Os._pt=0,d.init(e,n?u+n:u,Os,0,[e]),d.render(1,d),Os._pt&&uf(1,Os)}:o.set(e,l);return a?c:function(u){return c(e,l,n?u+n:u,o,1)}},quickTo:function(e,t,n){var i,s=Hn.to(e,ii((i={},i[t]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,u){return s.resetTo(t,l,c,u)};return a.tween=s,a},isTweening:function(e){return It.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=es(e.ease,za.ease)),$f(za,e||{})},config:function(e){return $f(ei,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,i=e.plugins,s=e.defaults,a=e.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!$n[o]&&!ni[o]&&Ga(t+" effect requires "+o+" plugin.")}),Ol[t]=function(o,l,c){return n(di(o),ii(l||{},s),c)},a&&(Un.prototype[t]=function(o,l,c){return this.add(Ol[t](o,zi(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){ct[e]=es(t)},parseEase:function(e,t){return arguments.length?es(e,t):ct},getById:function(e){return It.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new Un(e),i,s;for(n.smoothChildTiming=Fn(e.smoothChildTiming),It.remove(n),n._dp=0,n._time=n._tTime=It._time,i=It._first;i;)s=i._next,(t||!(!i._dur&&i instanceof Jt&&i.vars.onComplete===i._targets[0]))&&Di(n,i,i._start-i._delay),i=s;return Di(It,n,0),n},context:function(e,t){return e?new bp(e,t):Dt},matchMedia:function(e){return new s_(e)},matchMediaRefresh:function(){return ts.forEach(function(e){var t=e.conditions,n,i;for(i in t)t[i]&&(t[i]=!1,n=1);n&&e.revert()})||Hc()},addEventListener:function(e,t){var n=qo[e]||(qo[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=qo[e],i=n&&n.indexOf(t);i>=0&&n.splice(i,1)},utils:{wrap:Fg,wrapYoyo:Og,distribute:rp,random:ap,snap:sp,normalize:Ug,getUnit:vn,clamp:Dg,splitColor:fp,toArray:di,selector:kc,mapRange:lp,pipe:Ng,unitize:Ig,interpolate:Bg,shuffle:ip},install:Xd,effects:Ol,ticker:Zn,updateRoot:Un.updateRoot,plugins:$n,globalTimeline:It,core:{PropTween:Bn,globals:Yd,Tween:Jt,Timeline:Un,Animation:Xa,getCache:jr,_removeLinkedListItem:Al,reverting:function(){return hn},context:function(e){return e&&Dt&&(Dt.data.push(e),e._ctx=Dt),Dt},suppressOverwrites:function(e){return Zu=e}}};On("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return ul[r]=Jt[r]});Zn.add(Un.updateRoot);Os=ul.to({},{duration:0});var a_=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},o_=function(e,t){var n=e._targets,i,s,a;for(i in t)for(s=n.length;s--;)a=e._ptLookup[s][i],a&&(a=a.d)&&(a._pt&&(a=a_(a,i)),a&&a.modifier&&a.modifier(t[i],e,n[s],i))},Hl=function(e,t){return{name:e,headless:1,rawVars:1,init:function(i,s,a){a._onInit=function(o){var l,c;if(cn(s)&&(l={},On(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}o_(o,s)}}}},Hn=ul.registerPlugin({name:"attr",init:function(e,t,n,i,s){var a,o,l;this.tween=n;for(a in t)l=e.getAttribute(a)||"",o=this.add(e,"setAttribute",(l||0)+"",t[a],i,s,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(e,t){for(var n=t._pt;n;)hn?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:"endArray",headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},Hl("roundProps",zc),Hl("modifiers"),Hl("snap",sp))||ul;Jt.version=Un.version=Hn.version="3.15.0";Wd=1;ju()&&Qs();ct.Power0;ct.Power1;ct.Power2;ct.Power3;ct.Power4;ct.Linear;ct.Quad;ct.Cubic;ct.Quart;ct.Quint;ct.Strong;ct.Elastic;ct.Back;ct.SteppedEase;ct.Bounce;ct.Sine;ct.Expo;ct.Circ;var eh,yr,zs,ff,$r,th,hf,l_=function(){return typeof window<"u"},sr={},Hr=180/Math.PI,Gs=Math.PI/180,gs=Math.atan2,nh=1e8,df=/([A-Z])/g,c_=/(left|right|width|margin|padding|x)/i,u_=/[\s,\(]\S/,Li={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Vc=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},f_=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},h_=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},d_=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},p_=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},Ep=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Tp=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},m_=function(e,t,n){return e.style[t]=n},g_=function(e,t,n){return e.style.setProperty(t,n)},__=function(e,t,n){return e._gsap[t]=n},x_=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},v_=function(e,t,n,i,s){var a=e._gsap;a.scaleX=a.scaleY=n,a.renderTransform(s,a)},S_=function(e,t,n,i,s){var a=e._gsap;a[t]=n,a.renderTransform(s,a)},Ut="transform",kn=Ut+"Origin",M_=function r(e,t){var n=this,i=this.target,s=i.style,a=i._gsap;if(e in sr&&s){if(this.tfm=this.tfm||{},e!=="transform")e=Li[e]||e,~e.indexOf(",")?e.split(",").forEach(function(o){return n.tfm[o]=$i(i,o)}):this.tfm[e]=a.x?a[e]:$i(i,e),e===kn&&(this.tfm.zOrigin=a.zOrigin);else return Li.transform.split(",").forEach(function(o){return r.call(n,o,t)});if(this.props.indexOf(Ut)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(kn,t,"")),e=Ut}(s||t)&&this.props.push(e,t,s[e])},Ap=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},y_=function(){var e=this.props,t=this.target,n=t.style,i=t._gsap,s,a;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?n[e[s]]=e[s+2]:n.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(df,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=hf(),(!s||!s.isStart)&&!n[Ut]&&(Ap(n),i.zOrigin&&n[kn]&&(n[kn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},wp=function(e,t){var n={target:e,props:[],revert:y_,save:M_};return e._gsap||Hn.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(i){return n.save(i)}),n},Rp,Wc=function(e,t){var n=yr.createElementNS?yr.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):yr.createElement(e);return n&&n.style?n:yr.createElement(e)},Qn=function r(e,t,n){var i=getComputedStyle(e);return i[t]||i.getPropertyValue(t.replace(df,"-$1").toLowerCase())||i.getPropertyValue(t)||!n&&r(e,ea(t)||t,1)||""},ih="O,Moz,ms,Ms,Webkit".split(","),ea=function(e,t,n){var i=t||$r,s=i.style,a=5;if(e in s&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(ih[a]+e in s););return a<0?null:(a===3?"ms":a>=0?ih[a]:"")+e},Xc=function(){l_()&&window.document&&(eh=window,yr=eh.document,zs=yr.documentElement,$r=Wc("div")||{style:{}},Wc("div"),Ut=ea(Ut),kn=Ut+"Origin",$r.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Rp=!!ea("perspective"),hf=Hn.core.reverting,ff=1)},rh=function(e){var t=e.ownerSVGElement,n=Wc("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=e.cloneNode(!0),s;i.style.display="block",n.appendChild(i),zs.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),zs.removeChild(n),s},sh=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},Cp=function(e){var t,n;try{t=e.getBBox()}catch{t=rh(e),n=1}return t&&(t.width||t.height)||n||(t=rh(e)),t&&!t.width&&!t.x&&!t.y?{x:+sh(e,["x","cx","x1"])||0,y:+sh(e,["y","cy","y1"])||0,width:0,height:0}:t},Pp=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Cp(e))},Dr=function(e,t){if(t){var n=e.style,i;t in sr&&t!==kn&&(t=Ut),n.removeProperty?(i=t.substr(0,2),(i==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),n.removeProperty(i==="--"?t:t.replace(df,"-$1").toLowerCase())):n.removeAttribute(t)}},br=function(e,t,n,i,s,a){var o=new Bn(e._pt,t,n,0,1,a?Tp:Ep);return e._pt=o,o.b=i,o.e=s,e._props.push(n),o},ah={deg:1,rad:1,turn:1},b_={grid:1,flex:1},Lr=function r(e,t,n,i){var s=parseFloat(n)||0,a=(n+"").trim().substr((s+"").length)||"px",o=$r.style,l=c_.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),d=100,f=i==="px",h=i==="%",g,_,p,m;if(i===a||!s||ah[i]||ah[a])return s;if(a!=="px"&&!f&&(s=r(e,t,n,"px")),m=e.getCTM&&Pp(e),(h||a==="%")&&(sr[t]||~t.indexOf("adius")))return g=m?e.getBBox()[l?"width":"height"]:e[u],Wt(h?s/g*d:s/100*g);if(o[l?"width":"height"]=d+(f?a:i),_=i!=="rem"&&~t.indexOf("adius")||i==="em"&&e.appendChild&&!c?e:e.parentNode,m&&(_=(e.ownerSVGElement||{}).parentNode),(!_||_===yr||!_.appendChild)&&(_=yr.body),p=_._gsap,p&&h&&p.width&&l&&p.time===Zn.time&&!p.uncache)return Wt(s/p.width*d);if(h&&(t==="height"||t==="width")){var b=e.style[t];e.style[t]=d+i,g=e[u],b?e.style[t]=b:Dr(e,t)}else(h||a==="%")&&!b_[Qn(_,"display")]&&(o.position=Qn(e,"position")),_===e&&(o.position="static"),_.appendChild($r),g=$r[u],_.removeChild($r),o.position="absolute";return l&&h&&(p=jr(_),p.time=Zn.time,p.width=_[u]),Wt(f?g*s/d:g&&s?d/g*s:0)},$i=function(e,t,n,i){var s;return ff||Xc(),t in Li&&t!=="transform"&&(t=Li[t],~t.indexOf(",")&&(t=t.split(",")[0])),sr[t]&&t!=="transform"?(s=qa(e,i),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:hl(Qn(e,kn))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=fl[t]&&fl[t](e,t,n)||Qn(e,t)||$d(e,t)||(t==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Lr(e,t,s,n)+n:s},E_=function(e,t,n,i){if(!n||n==="none"){var s=ea(t,e,1),a=s&&Qn(e,s,1);a&&a!==n?(t=s,n=a):t==="borderColor"&&(n=Qn(e,"borderTopColor"))}var o=new Bn(this._pt,e.style,t,0,1,Mp),l=0,c=0,u,d,f,h,g,_,p,m,b,w,S,T;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Qn(e,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=e.style[t],e.style[t]=i,i=Qn(e,t)||i,_?e.style[t]=_:Dr(e,t)),u=[n,i],dp(u),n=u[0],i=u[1],f=n.match(Fs)||[],T=i.match(Fs)||[],T.length){for(;d=Fs.exec(i);)p=d[0],b=i.substring(l,d.index),g?g=(g+1)%5:(b.substr(-5)==="rgba("||b.substr(-5)==="hsla(")&&(g=1),p!==(_=f[c++]||"")&&(h=parseFloat(_)||0,S=_.substr((h+"").length),p.charAt(1)==="="&&(p=ks(h,p)+S),m=parseFloat(p),w=p.substr((m+"").length),l=Fs.lastIndex-w.length,w||(w=w||ei.units[t]||S,l===i.length&&(i+=w,o.e+=w)),S!==w&&(h=Lr(e,t,_,w)||0),o._pt={_next:o._pt,p:b||c===1?b:",",s:h,c:m-h,m:g&&g<4||t==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=t==="display"&&i==="none"?Tp:Ep;return Vd.test(i)&&(o.e=0),this._pt=o,o},oh={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},T_=function(e){var t=e.split(" "),n=t[0],i=t[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(e=n,n=i,i=e),t[0]=oh[n]||n,t[1]=oh[i]||i,t.join(" ")},A_=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,i=n.style,s=t.u,a=n._gsap,o,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)o=s[c],sr[o]&&(l=1,o=o==="transformOrigin"?kn:Ut),Dr(n,o);l&&(Dr(n,Ut),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",qa(n,1),a.uncache=1,Ap(i)))}},fl={clearProps:function(e,t,n,i,s){if(s.data!=="isFromStart"){var a=e._pt=new Bn(e._pt,t,n,0,0,A_);return a.u=i,a.pr=-10,a.tween=s,e._props.push(n),1}}},Ya=[1,0,0,1,0,0],Dp={},Lp=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},lh=function(e){var t=Qn(e,Ut);return Lp(t)?Ya:t.substr(7).match(Hd).map(Wt)},pf=function(e,t){var n=e._gsap||jr(e),i=e.style,s=lh(e),a,o,l,c;return n.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Ya:s):(s===Ya&&!e.offsetParent&&e!==zs&&!n.svg&&(l=i.display,i.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,o=e.nextElementSibling,zs.appendChild(e)),s=lh(e),l?i.display=l:Dr(e,"display"),c&&(o?a.insertBefore(e,o):a?a.appendChild(e):zs.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Yc=function(e,t,n,i,s,a){var o=e._gsap,l=s||pf(e,!0),c=o.xOrigin||0,u=o.yOrigin||0,d=o.xOffset||0,f=o.yOffset||0,h=l[0],g=l[1],_=l[2],p=l[3],m=l[4],b=l[5],w=t.split(" "),S=parseFloat(w[0])||0,T=parseFloat(w[1])||0,A,E,v,y;n?l!==Ya&&(E=h*p-g*_)&&(v=S*(p/E)+T*(-_/E)+(_*b-p*m)/E,y=S*(-g/E)+T*(h/E)-(h*b-g*m)/E,S=v,T=y):(A=Cp(e),S=A.x+(~w[0].indexOf("%")?S/100*A.width:S),T=A.y+(~(w[1]||w[0]).indexOf("%")?T/100*A.height:T)),i||i!==!1&&o.smooth?(m=S-c,b=T-u,o.xOffset=d+(m*h+b*_)-m,o.yOffset=f+(m*g+b*p)-b):o.xOffset=o.yOffset=0,o.xOrigin=S,o.yOrigin=T,o.smooth=!!i,o.origin=t,o.originIsAbsolute=!!n,e.style[kn]="0px 0px",a&&(br(a,o,"xOrigin",c,S),br(a,o,"yOrigin",u,T),br(a,o,"xOffset",d,o.xOffset),br(a,o,"yOffset",f,o.yOffset)),e.setAttribute("data-svg-origin",S+" "+T)},qa=function(e,t){var n=e._gsap||new mp(e);if("x"in n&&!t&&!n.uncache)return n;var i=e.style,s=n.scaleX<0,a="px",o="deg",l=getComputedStyle(e),c=Qn(e,kn)||"0",u,d,f,h,g,_,p,m,b,w,S,T,A,E,v,y,R,D,L,z,H,F,G,O,K,te,P,ae,de,Ve,Xe,Be;return u=d=f=_=p=m=b=w=S=0,h=g=1,n.svg=!!(e.getCTM&&Pp(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Ut]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Ut]!=="none"?l[Ut]:"")),i.scale=i.rotate=i.translate="none"),E=pf(e,n.svg),n.svg&&(n.uncache?(K=e.getBBox(),c=n.xOrigin-K.x+"px "+(n.yOrigin-K.y)+"px",O=""):O=!t&&e.getAttribute("data-svg-origin"),Yc(e,O||c,!!O||n.originIsAbsolute,n.smooth!==!1,E)),T=n.xOrigin||0,A=n.yOrigin||0,E!==Ya&&(D=E[0],L=E[1],z=E[2],H=E[3],u=F=E[4],d=G=E[5],E.length===6?(h=Math.sqrt(D*D+L*L),g=Math.sqrt(H*H+z*z),_=D||L?gs(L,D)*Hr:0,b=z||H?gs(z,H)*Hr+_:0,b&&(g*=Math.abs(Math.cos(b*Gs))),n.svg&&(u-=T-(T*D+A*z),d-=A-(T*L+A*H))):(Be=E[6],Ve=E[7],P=E[8],ae=E[9],de=E[10],Xe=E[11],u=E[12],d=E[13],f=E[14],v=gs(Be,de),p=v*Hr,v&&(y=Math.cos(-v),R=Math.sin(-v),O=F*y+P*R,K=G*y+ae*R,te=Be*y+de*R,P=F*-R+P*y,ae=G*-R+ae*y,de=Be*-R+de*y,Xe=Ve*-R+Xe*y,F=O,G=K,Be=te),v=gs(-z,de),m=v*Hr,v&&(y=Math.cos(-v),R=Math.sin(-v),O=D*y-P*R,K=L*y-ae*R,te=z*y-de*R,Xe=H*R+Xe*y,D=O,L=K,z=te),v=gs(L,D),_=v*Hr,v&&(y=Math.cos(v),R=Math.sin(v),O=D*y+L*R,K=F*y+G*R,L=L*y-D*R,G=G*y-F*R,D=O,F=K),p&&Math.abs(p)+Math.abs(_)>359.9&&(p=_=0,m=180-m),h=Wt(Math.sqrt(D*D+L*L+z*z)),g=Wt(Math.sqrt(G*G+Be*Be)),v=gs(F,G),b=Math.abs(v)>2e-4?v*Hr:0,S=Xe?1/(Xe<0?-Xe:Xe):0),n.svg&&(O=e.getAttribute("transform"),n.forceCSS=e.setAttribute("transform","")||!Lp(Qn(e,Ut)),O&&e.setAttribute("transform",O))),Math.abs(b)>90&&Math.abs(b)<270&&(s?(h*=-1,b+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,b+=b<=0?180:-180)),t=t||n.uncache,n.x=u-((n.xPercent=u&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+a,n.y=d-((n.yPercent=d&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-d)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+a,n.z=f+a,n.scaleX=Wt(h),n.scaleY=Wt(g),n.rotation=Wt(_)+o,n.rotationX=Wt(p)+o,n.rotationY=Wt(m)+o,n.skewX=b+o,n.skewY=w+o,n.transformPerspective=S+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!t&&n.zOrigin||0)&&(i[kn]=hl(c)),n.xOffset=n.yOffset=0,n.force3D=ei.force3D,n.renderTransform=n.svg?R_:Rp?Np:w_,n.uncache=0,n},hl=function(e){return(e=e.split(" "))[0]+" "+e[1]},Vl=function(e,t,n){var i=vn(t);return Wt(parseFloat(t)+parseFloat(Lr(e,"x",n+"px",i)))+i},w_=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,Np(e,t)},Fr="0deg",la="0px",Or=") ",Np=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,u=n.rotationY,d=n.rotationX,f=n.skewX,h=n.skewY,g=n.scaleX,_=n.scaleY,p=n.transformPerspective,m=n.force3D,b=n.target,w=n.zOrigin,S="",T=m==="auto"&&e&&e!==1||m===!0;if(w&&(d!==Fr||u!==Fr)){var A=parseFloat(u)*Gs,E=Math.sin(A),v=Math.cos(A),y;A=parseFloat(d)*Gs,y=Math.cos(A),a=Vl(b,a,E*y*-w),o=Vl(b,o,-Math.sin(A)*-w),l=Vl(b,l,v*y*-w+w)}p!==la&&(S+="perspective("+p+Or),(i||s)&&(S+="translate("+i+"%, "+s+"%) "),(T||a!==la||o!==la||l!==la)&&(S+=l!==la||T?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+Or),c!==Fr&&(S+="rotate("+c+Or),u!==Fr&&(S+="rotateY("+u+Or),d!==Fr&&(S+="rotateX("+d+Or),(f!==Fr||h!==Fr)&&(S+="skew("+f+", "+h+Or),(g!==1||_!==1)&&(S+="scale("+g+", "+_+Or),b.style[Ut]=S||"translate(0, 0)"},R_=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,u=n.skewY,d=n.scaleX,f=n.scaleY,h=n.target,g=n.xOrigin,_=n.yOrigin,p=n.xOffset,m=n.yOffset,b=n.forceCSS,w=parseFloat(a),S=parseFloat(o),T,A,E,v,y;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=Gs,c*=Gs,T=Math.cos(l)*d,A=Math.sin(l)*d,E=Math.sin(l-c)*-f,v=Math.cos(l-c)*f,c&&(u*=Gs,y=Math.tan(c-u),y=Math.sqrt(1+y*y),E*=y,v*=y,u&&(y=Math.tan(u),y=Math.sqrt(1+y*y),T*=y,A*=y)),T=Wt(T),A=Wt(A),E=Wt(E),v=Wt(v)):(T=d,v=f,A=E=0),(w&&!~(a+"").indexOf("px")||S&&!~(o+"").indexOf("px"))&&(w=Lr(h,"x",a,"px"),S=Lr(h,"y",o,"px")),(g||_||p||m)&&(w=Wt(w+g-(g*T+_*E)+p),S=Wt(S+_-(g*A+_*v)+m)),(i||s)&&(y=h.getBBox(),w=Wt(w+i/100*y.width),S=Wt(S+s/100*y.height)),y="matrix("+T+","+A+","+E+","+v+","+w+","+S+")",h.setAttribute("transform",y),b&&(h.style[Ut]=y)},C_=function(e,t,n,i,s){var a=360,o=cn(s),l=parseFloat(s)*(o&&~s.indexOf("rad")?Hr:1),c=l-i,u=i+c+"deg",d,f;return o&&(d=s.split("_")[1],d==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),d==="cw"&&c<0?c=(c+a*nh)%a-~~(c/a)*a:d==="ccw"&&c>0&&(c=(c-a*nh)%a-~~(c/a)*a)),e._pt=f=new Bn(e._pt,t,n,i,c,f_),f.e=u,f.u="deg",e._props.push(n),f},ch=function(e,t){for(var n in t)e[n]=t[n];return e},P_=function(e,t,n){var i=ch({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,u,d,f,h,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[Ut]=t,o=qa(n,1),Dr(n,Ut),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Ut],a[Ut]=t,o=qa(n,1),a[Ut]=c);for(l in sr)c=i[l],u=o[l],c!==u&&s.indexOf(l)<0&&(h=vn(c),g=vn(u),d=h!==g?Lr(n,l,c,g):parseFloat(c),f=parseFloat(u),e._pt=new Bn(e._pt,o,l,d,f-d,Vc),e._pt.u=g||0,e._props.push(l));ch(o,i)};On("padding,margin,Width,Radius",function(r,e){var t="Top",n="Right",i="Bottom",s="Left",a=(e<3?[t,n,i,s]:[t+s,t+n,i+n,i+s]).map(function(o){return e<2?r+o:"border"+o+r});fl[e>1?"border"+r:r]=function(o,l,c,u,d){var f,h;if(arguments.length<4)return f=a.map(function(g){return $i(o,g,c)}),h=f.join(" "),h.split(f[0]).length===5?f[0]:h;f=(u+"").split(" "),h={},a.forEach(function(g,_){return h[g]=f[_]=f[_]||f[(_-1)/2|0]}),o.init(l,h,d)}});var Ip={name:"css",register:Xc,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,i,s){var a=this._props,o=e.style,l=n.vars.startAt,c,u,d,f,h,g,_,p,m,b,w,S,T,A,E,v,y;ff||Xc(),this.styles=this.styles||wp(e),v=this.styles.props,this.tween=n;for(_ in t)if(_!=="autoRound"&&(u=t[_],!($n[_]&&gp(_,t,n,i,e,s)))){if(h=typeof u,g=fl[_],h==="function"&&(u=u.call(n,i,e,s),h=typeof u),h==="string"&&~u.indexOf("random(")&&(u=Va(u)),g)g(this,e,_,u,n)&&(E=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(_)+"").trim(),u+="",Rr.lastIndex=0,Rr.test(c)||(p=vn(c),m=vn(u),m?p!==m&&(c=Lr(e,_,c,m)+m):p&&(u+=p)),this.add(o,"setProperty",c,u,i,s,0,0,_),a.push(_),v.push(_,0,o[_]);else if(h!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,e,s):l[_],cn(c)&&~c.indexOf("random(")&&(c=Va(c)),vn(c+"")||c==="auto"||(c+=ei.units[_]||vn($i(e,_))||""),(c+"").charAt(1)==="="&&(c=$i(e,_))):c=$i(e,_),f=parseFloat(c),b=h==="string"&&u.charAt(1)==="="&&u.substr(0,2),b&&(u=u.substr(2)),d=parseFloat(u),_ in Li&&(_==="autoAlpha"&&(f===1&&$i(e,"visibility")==="hidden"&&d&&(f=0),v.push("visibility",0,o.visibility),br(this,o,"visibility",f?"inherit":"hidden",d?"inherit":"hidden",!d)),_!=="scale"&&_!=="transform"&&(_=Li[_],~_.indexOf(",")&&(_=_.split(",")[0]))),w=_ in sr,w){if(this.styles.save(_),y=u,h==="string"&&u.substring(0,6)==="var(--"){if(u=Qn(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var R=e.style.perspective;e.style.perspective=u,u=Qn(e,"perspective"),R?e.style.perspective=R:Dr(e,"perspective")}d=parseFloat(u)}if(S||(T=e._gsap,T.renderTransform&&!t.parseTransform||qa(e,t.parseTransform),A=t.smoothOrigin!==!1&&T.smooth,S=this._pt=new Bn(this._pt,o,Ut,0,1,T.renderTransform,T,0,-1),S.dep=1),_==="scale")this._pt=new Bn(this._pt,T,"scaleY",T.scaleY,(b?ks(T.scaleY,b+d):d)-T.scaleY||0,Vc),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){v.push(kn,0,o[kn]),u=T_(u),T.svg?Yc(e,u,0,A,0,this):(m=parseFloat(u.split(" ")[2])||0,m!==T.zOrigin&&br(this,T,"zOrigin",T.zOrigin,m),br(this,o,_,hl(c),hl(u)));continue}else if(_==="svgOrigin"){Yc(e,u,1,A,0,this);continue}else if(_ in Dp){C_(this,T,_,f,b?ks(f,b+u):u);continue}else if(_==="smoothOrigin"){br(this,T,"smooth",T.smooth,u);continue}else if(_==="force3D"){T[_]=u;continue}else if(_==="transform"){P_(this,u,e);continue}}else _ in o||(_=ea(_)||_);if(w||(d||d===0)&&(f||f===0)&&!u_.test(u)&&_ in o)p=(c+"").substr((f+"").length),d||(d=0),m=vn(u)||(_ in ei.units?ei.units[_]:p),p!==m&&(f=Lr(e,_,c,m)),this._pt=new Bn(this._pt,w?T:o,_,f,(b?ks(f,b+d):d)-f,!w&&(m==="px"||_==="zIndex")&&t.autoRound!==!1?p_:Vc),this._pt.u=m||0,w&&y!==u?(this._pt.b=c,this._pt.e=y,this._pt.r=d_):p!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=h_);else if(_ in o)E_.call(this,e,_,c,b?b+u:u);else if(_ in e)this.add(e,_,c||e[_],b?b+u:u,i,s);else if(_!=="parseTransform"){ef(_,u);continue}w||(_ in o?v.push(_,0,o[_]):typeof e[_]=="function"?v.push(_,2,e[_]()):v.push(_,1,c||e[_])),a.push(_)}}E&&yp(this)},render:function(e,t){if(t.tween._time||!hf())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:$i,aliases:Li,getSetter:function(e,t,n){var i=Li[t];return i&&i.indexOf(",")<0&&(t=i),t in sr&&t!==kn&&(e._gsap.x||$i(e,"x"))?n&&th===n?t==="scale"?x_:__:(th=n||{})&&(t==="scale"?v_:S_):e.style&&!Ju(e.style[t])?m_:~t.indexOf("-")?g_:cf(e,t)},core:{_removeProperty:Dr,_getMatrix:pf}};Hn.utils.checkPrefix=ea;Hn.core.getStyleSaver=wp;(function(r,e,t,n){var i=On(r+","+e+","+t,function(s){sr[s]=1});On(e,function(s){ei.units[s]="deg",Dp[s]=1}),Li[i[13]]=r+","+e,On(n,function(s){var a=s.split(":");Li[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");On("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){ei.units[r]="px"});Hn.registerPlugin(Ip);var Hs=Hn.registerPlugin(Ip)||Hn;Hs.core.Tween;function D_(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function L_(r,e,t){return e&&D_(r.prototype,e),r}var un,$o,Jn,Er,Tr,Vs,Up,Vr,Ws,Fp,Ji,xi,Op,Bp=function(){return un||typeof window<"u"&&(un=window.gsap)&&un.registerPlugin&&un},kp=1,Bs=[],nt=[],Oi=[],Pa=Date.now,qc=function(e,t){return t},N_=function(){var e=Ws.core,t=e.bridge||{},n=e._scrollers,i=e._proxies;n.push.apply(n,nt),i.push.apply(i,Oi),nt=n,Oi=i,qc=function(a,o){return t[a](o)}},Cr=function(e,t){return~Oi.indexOf(e)&&Oi[Oi.indexOf(e)+1][t]},Da=function(e){return!!~Fp.indexOf(e)},An=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:i!==!1,capture:!!s})},Tn=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},so="scrollLeft",ao="scrollTop",$c=function(){return Ji&&Ji.isPressed||nt.cache++},dl=function(e,t){var n=function i(s){if(s||s===0){kp&&(Jn.history.scrollRestoration="manual");var a=Ji&&Ji.isPressed;s=i.v=Math.round(s)||(Ji&&Ji.iOS?1:0),e(s),i.cacheID=nt.cache,a&&qc("ss",s)}else(t||nt.cache!==i.cacheID||qc("ref"))&&(i.cacheID=nt.cache,i.v=e());return i.v+i.offset};return n.offset=0,e&&n},Dn={s:so,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:dl(function(r){return arguments.length?Jn.scrollTo(r,en.sc()):Jn.pageXOffset||Er[so]||Tr[so]||Vs[so]||0})},en={s:ao,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:Dn,sc:dl(function(r){return arguments.length?Jn.scrollTo(Dn.sc(),r):Jn.pageYOffset||Er[ao]||Tr[ao]||Vs[ao]||0})},In=function(e,t){return(t&&t._ctx&&t._ctx.selector||un.utils.toArray)(e)[0]||(typeof e=="string"&&un.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},I_=function(e,t){for(var n=t.length;n--;)if(t[n]===e||t[n].contains(e))return!0;return!1},Nr=function(e,t){var n=t.s,i=t.sc;Da(e)&&(e=Er.scrollingElement||Tr);var s=nt.indexOf(e),a=i===en.sc?1:2;!~s&&(s=nt.push(e)-1),nt[s+a]||An(e,"scroll",$c);var o=nt[s+a],l=o||(nt[s+a]=dl(Cr(e,n),!0)||(Da(e)?i:dl(function(c){return arguments.length?e[n]=c:e[n]})));return l.target=e,o||(l.smooth=un.getProperty(e,"scrollBehavior")==="smooth"),l},Kc=function(e,t,n){var i=e,s=e,a=Pa(),o=a,l=t||50,c=Math.max(500,l*3),u=function(g,_){var p=Pa();_||p-a>l?(s=i,i=g,o=a,a=p):n?i+=g:i=s+(g-s)/(p-o)*(a-o)},d=function(){s=i=n?0:i,o=a=0},f=function(g){var _=o,p=s,m=Pa();return(g||g===0)&&g!==i&&u(g),a===o||m-o>c?0:(i+(n?p:-p))/((n?m:a)-_)*1e3};return{update:u,reset:d,getVelocity:f}},ca=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},uh=function(e){var t=Math.max.apply(Math,e),n=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(n)?t:n},zp=function(){Ws=un.core.globals().ScrollTrigger,Ws&&Ws.core&&N_()},Gp=function(e){return un=e||Bp(),!$o&&un&&typeof document<"u"&&document.body&&(Jn=window,Er=document,Tr=Er.documentElement,Vs=Er.body,Fp=[Jn,Er,Tr,Vs],un.utils.clamp,Op=un.core.context||function(){},Vr="onpointerenter"in Vs?"pointer":"mouse",Up=Xt.isTouch=Jn.matchMedia&&Jn.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Jn||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,xi=Xt.eventTypes=("ontouchstart"in Tr?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Tr?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return kp=0},500),$o=1),Ws||zp(),$o};Dn.op=en;nt.cache=0;var Xt=(function(){function r(t){this.init(t)}var e=r.prototype;return e.init=function(n){$o||Gp(un)||console.warn("Please gsap.registerPlugin(Observer)"),Ws||zp();var i=n.tolerance,s=n.dragMinimum,a=n.type,o=n.target,l=n.lineHeight,c=n.debounce,u=n.preventDefault,d=n.onStop,f=n.onStopDelay,h=n.ignore,g=n.wheelSpeed,_=n.event,p=n.onDragStart,m=n.onDragEnd,b=n.onDrag,w=n.onPress,S=n.onRelease,T=n.onRight,A=n.onLeft,E=n.onUp,v=n.onDown,y=n.onChangeX,R=n.onChangeY,D=n.onChange,L=n.onToggleX,z=n.onToggleY,H=n.onHover,F=n.onHoverEnd,G=n.onMove,O=n.ignoreCheck,K=n.isNormalizer,te=n.onGestureStart,P=n.onGestureEnd,ae=n.onWheel,de=n.onEnable,Ve=n.onDisable,Xe=n.onClick,Be=n.scrollSpeed,J=n.capture,le=n.allowClicks,re=n.lockAxis,Re=n.onLockAxis;this.target=o=In(o)||Tr,this.vars=n,h&&(h=un.utils.toArray(h)),i=i||1e-9,s=s||0,g=g||1,Be=Be||1,a=a||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Jn.getComputedStyle(Vs).lineHeight)||22);var Oe,Te,rt,be,ke,We,Ge,Y=this,ut=0,vt=0,At=n.passive||!u&&n.passive!==!1,Ye=Nr(o,Dn),mt=Nr(o,en),U=Ye(),Ft=mt(),ze=~a.indexOf("touch")&&!~a.indexOf("pointer")&&xi[0]==="pointerdown",C=Da(o),x=o.ownerDocument||Er,k=[0,0,0],W=[0,0,0],Z=0,fe=function(){return Z=Pa()},ce=function(ie,Ue){return(Y.event=ie)&&h&&I_(ie.target,h)||Ue&&ze&&ie.pointerType!=="touch"||O&&O(ie,Ue)},j=function(){Y._vx.reset(),Y._vy.reset(),Te.pause(),d&&d(Y)},Q=function(){var ie=Y.deltaX=uh(k),Ue=Y.deltaY=uh(W),oe=Math.abs(ie)>=i,Fe=Math.abs(Ue)>=i;D&&(oe||Fe)&&D(Y,ie,Ue,k,W),oe&&(T&&Y.deltaX>0&&T(Y),A&&Y.deltaX<0&&A(Y),y&&y(Y),L&&Y.deltaX<0!=ut<0&&L(Y),ut=Y.deltaX,k[0]=k[1]=k[2]=0),Fe&&(v&&Y.deltaY>0&&v(Y),E&&Y.deltaY<0&&E(Y),R&&R(Y),z&&Y.deltaY<0!=vt<0&&z(Y),vt=Y.deltaY,W[0]=W[1]=W[2]=0),(be||rt)&&(G&&G(Y),rt&&(p&&rt===1&&p(Y),b&&b(Y),rt=0),be=!1),We&&!(We=!1)&&Re&&Re(Y),ke&&(ae(Y),ke=!1),Oe=0},me=function(ie,Ue,oe){k[oe]+=ie,W[oe]+=Ue,Y._vx.update(ie),Y._vy.update(Ue),c?Oe||(Oe=requestAnimationFrame(Q)):Q()},we=function(ie,Ue){re&&!Ge&&(Y.axis=Ge=Math.abs(ie)>Math.abs(Ue)?"x":"y",We=!0),Ge!=="y"&&(k[2]+=ie,Y._vx.update(ie,!0)),Ge!=="x"&&(W[2]+=Ue,Y._vy.update(Ue,!0)),c?Oe||(Oe=requestAnimationFrame(Q)):Q()},ge=function(ie){if(!ce(ie,1)){ie=ca(ie,u);var Ue=ie.clientX,oe=ie.clientY,Fe=Ue-Y.x,Ce=oe-Y.y,qe=Y.isDragging;Y.x=Ue,Y.y=oe,(qe||(Fe||Ce)&&(Math.abs(Y.startX-Ue)>=s||Math.abs(Y.startY-oe)>=s))&&(rt||(rt=qe?2:1),qe||(Y.isDragging=!0),we(Fe,Ce))}},pe=Y.onPress=function(se){ce(se,1)||se&&se.button||(Y.axis=Ge=null,Te.pause(),Y.isPressed=!0,se=ca(se),ut=vt=0,Y.startX=Y.x=se.clientX,Y.startY=Y.y=se.clientY,Y._vx.reset(),Y._vy.reset(),An(K?o:x,xi[1],ge,At,!0),Y.deltaX=Y.deltaY=0,w&&w(Y))},ue=Y.onRelease=function(se){if(!ce(se,1)){Tn(K?o:x,xi[1],ge,!0);var ie=!isNaN(Y.y-Y.startY),Ue=Y.isDragging,oe=Ue&&(Math.abs(Y.x-Y.startX)>3||Math.abs(Y.y-Y.startY)>3),Fe=ca(se);!oe&&ie&&(Y._vx.reset(),Y._vy.reset(),u&&le&&un.delayedCall(.08,function(){if(Pa()-Z>300&&!se.defaultPrevented){if(se.target.click)se.target.click();else if(x.createEvent){var Ce=x.createEvent("MouseEvents");Ce.initMouseEvent("click",!0,!0,Jn,1,Fe.screenX,Fe.screenY,Fe.clientX,Fe.clientY,!1,!1,!1,!1,0,null),se.target.dispatchEvent(Ce)}}})),Y.isDragging=Y.isGesturing=Y.isPressed=!1,d&&Ue&&!K&&Te.restart(!0),rt&&Q(),m&&Ue&&m(Y),S&&S(Y,oe)}},De=function(ie){return ie.touches&&ie.touches.length>1&&(Y.isGesturing=!0)&&te(ie,Y.isDragging)},Ie=function(){return(Y.isGesturing=!1)||P(Y)},I=function(ie){if(!ce(ie)){var Ue=Ye(),oe=mt();me((Ue-U)*Be,(oe-Ft)*Be,1),U=Ue,Ft=oe,d&&Te.restart(!0)}},he=function(ie){if(!ce(ie)){ie=ca(ie,u),ae&&(ke=!0);var Ue=(ie.deltaMode===1?l:ie.deltaMode===2?Jn.innerHeight:1)*g;me(ie.deltaX*Ue,ie.deltaY*Ue,0),d&&!K&&Te.restart(!0)}},ee=function(ie){if(!ce(ie)){var Ue=ie.clientX,oe=ie.clientY,Fe=Ue-Y.x,Ce=oe-Y.y;Y.x=Ue,Y.y=oe,be=!0,d&&Te.restart(!0),(Fe||Ce)&&we(Fe,Ce)}},_e=function(ie){Y.event=ie,H(Y)},xe=function(ie){Y.event=ie,F(Y)},ne=function(ie){return ce(ie)||ca(ie,u)&&Xe(Y)};Te=Y._dc=un.delayedCall(f||.25,j).pause(),Y.deltaX=Y.deltaY=0,Y._vx=Kc(0,50,!0),Y._vy=Kc(0,50,!0),Y.scrollX=Ye,Y.scrollY=mt,Y.isDragging=Y.isGesturing=Y.isPressed=!1,Op(this),Y.enable=function(se){return Y.isEnabled||(An(C?x:o,"scroll",$c),a.indexOf("scroll")>=0&&An(C?x:o,"scroll",I,At,J),a.indexOf("wheel")>=0&&An(o,"wheel",he,At,J),(a.indexOf("touch")>=0&&Up||a.indexOf("pointer")>=0)&&(An(o,xi[0],pe,At,J),An(x,xi[2],ue),An(x,xi[3],ue),le&&An(o,"click",fe,!0,!0),Xe&&An(o,"click",ne),te&&An(x,"gesturestart",De),P&&An(x,"gestureend",Ie),H&&An(o,Vr+"enter",_e),F&&An(o,Vr+"leave",xe),G&&An(o,Vr+"move",ee)),Y.isEnabled=!0,Y.isDragging=Y.isGesturing=Y.isPressed=be=rt=!1,Y._vx.reset(),Y._vy.reset(),U=Ye(),Ft=mt(),se&&se.type&&pe(se),de&&de(Y)),Y},Y.disable=function(){Y.isEnabled&&(Bs.filter(function(se){return se!==Y&&Da(se.target)}).length||Tn(C?x:o,"scroll",$c),Y.isPressed&&(Y._vx.reset(),Y._vy.reset(),Tn(K?o:x,xi[1],ge,!0)),Tn(C?x:o,"scroll",I,J),Tn(o,"wheel",he,J),Tn(o,xi[0],pe,J),Tn(x,xi[2],ue),Tn(x,xi[3],ue),Tn(o,"click",fe,!0),Tn(o,"click",ne),Tn(x,"gesturestart",De),Tn(x,"gestureend",Ie),Tn(o,Vr+"enter",_e),Tn(o,Vr+"leave",xe),Tn(o,Vr+"move",ee),Y.isEnabled=Y.isPressed=Y.isDragging=!1,Ve&&Ve(Y))},Y.kill=Y.revert=function(){Y.disable();var se=Bs.indexOf(Y);se>=0&&Bs.splice(se,1),Ji===Y&&(Ji=0)},Bs.push(Y),K&&Da(o)&&(Ji=Y),Y.enable(_)},L_(r,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),r})();Xt.version="3.15.0";Xt.create=function(r){return new Xt(r)};Xt.register=Gp;Xt.getAll=function(){return Bs.slice()};Xt.getById=function(r){return Bs.filter(function(e){return e.vars.id===r})[0]};Bp()&&un.registerPlugin(Xt);var Ae,Is,tt,_t,Kn,gt,mf,pl,$a,La,Sa,oo,_n,Cl,Zc,Cn,fh,hh,Us,Hp,Wl,Vp,Rn,Jc,Wp,Xp,xr,jc,gf,Xs,_f,Na,Qc,Xl,lo=1,xn=Date.now,Yl=xn(),pi=0,Ma=0,dh=function(e,t,n){var i=qn(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return n["_"+t+"Clamp"]=i,i?e.substr(6,e.length-7):e},ph=function(e,t){return t&&(!qn(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},U_=function r(){return Ma&&requestAnimationFrame(r)},mh=function(){return Cl=1},gh=function(){return Cl=0},Ci=function(e){return e},ya=function(e){return Math.round(e*1e5)/1e5||0},Yp=function(){return typeof window<"u"},qp=function(){return Ae||Yp()&&(Ae=window.gsap)&&Ae.registerPlugin&&Ae},ss=function(e){return!!~mf.indexOf(e)},$p=function(e){return(e==="Height"?_f:tt["inner"+e])||Kn["client"+e]||gt["client"+e]},Kp=function(e){return Cr(e,"getBoundingClientRect")||(ss(e)?function(){return Qo.width=tt.innerWidth,Qo.height=_f,Qo}:function(){return Ki(e)})},F_=function(e,t,n){var i=n.d,s=n.d2,a=n.a;return(a=Cr(e,"getBoundingClientRect"))?function(){return a()[i]}:function(){return(t?$p(s):e["client"+s])||0}},O_=function(e,t){return!t||~Oi.indexOf(e)?Kp(e):function(){return Qo}},Ni=function(e,t){var n=t.s,i=t.d2,s=t.d,a=t.a;return Math.max(0,(n="scroll"+i)&&(a=Cr(e,n))?a()-Kp(e)()[s]:ss(e)?(Kn[n]||gt[n])-$p(i):e[n]-e["offset"+i])},co=function(e,t){for(var n=0;n<Us.length;n+=3)(!t||~t.indexOf(Us[n+1]))&&e(Us[n],Us[n+1],Us[n+2])},qn=function(e){return typeof e=="string"},Sn=function(e){return typeof e=="function"},ba=function(e){return typeof e=="number"},Wr=function(e){return typeof e=="object"},ua=function(e,t,n){return e&&e.progress(t?0:1)&&n&&e.pause()},_s=function(e,t,n){if(e.enabled){var i=e._ctx?e._ctx.add(function(){return t(e,n)}):t(e,n);i&&i.totalTime&&(e.callbackAnimation=i)}},xs=Math.abs,Zp="left",Jp="top",xf="right",vf="bottom",ns="width",is="height",Ia="Right",Ua="Left",Fa="Top",Oa="Bottom",Zt="padding",ci="margin",ta="Width",Sf="Height",Qt="px",ui=function(e){return tt.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},B_=function(e){var t=ui(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},_h=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Ki=function(e,t){var n=t&&ui(e)[Zc]!=="matrix(1, 0, 0, 1, 0, 0)"&&Ae.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},ml=function(e,t){var n=t.d2;return e["offset"+n]||e["client"+n]||0},jp=function(e){var t=[],n=e.labels,i=e.duration(),s;for(s in n)t.push(n[s]/i);return t},k_=function(e){return function(t){return Ae.utils.snap(jp(e),t)}},Mf=function(e){var t=Ae.utils.snap(e),n=Array.isArray(e)&&e.slice(0).sort(function(i,s){return i-s});return n?function(i,s,a){a===void 0&&(a=.001);var o;if(!s)return t(i);if(s>0){for(i-=a,o=0;o<n.length;o++)if(n[o]>=i)return n[o];return n[o-1]}else for(o=n.length,i+=a;o--;)if(n[o]<=i)return n[o];return n[0]}:function(i,s,a){a===void 0&&(a=.001);var o=t(i);return!s||Math.abs(o-i)<a||o-i<0==s<0?o:t(s<0?i-e:i+e)}},z_=function(e){return function(t,n){return Mf(jp(e))(t,n.direction)}},uo=function(e,t,n,i){return n.split(",").forEach(function(s){return e(t,s,i)})},ln=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:!i,capture:!!s})},on=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},fo=function(e,t,n){n=n&&n.wheelHandler,n&&(e(t,"wheel",n),e(t,"touchmove",n))},xh={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},ho={toggleActions:"play",anticipatePin:0},gl={top:0,left:0,center:.5,bottom:1,right:1},Ko=function(e,t){if(qn(e)){var n=e.indexOf("="),i=~n?+(e.charAt(n-1)+1)*parseFloat(e.substr(n+1)):0;~n&&(e.indexOf("%")>n&&(i*=t/100),e=e.substr(0,n-1)),e=i+(e in gl?gl[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},po=function(e,t,n,i,s,a,o,l){var c=s.startColor,u=s.endColor,d=s.fontSize,f=s.indent,h=s.fontWeight,g=_t.createElement("div"),_=ss(n)||Cr(n,"pinType")==="fixed",p=e.indexOf("scroller")!==-1,m=_?gt:n.tagName==="IFRAME"?n.contentDocument.body:n,b=e.indexOf("start")!==-1,w=b?c:u,S="border-color:"+w+";font-size:"+d+";color:"+w+";font-weight:"+h+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return S+="position:"+((p||l)&&_?"fixed;":"absolute;"),(p||l||!_)&&(S+=(i===en?xf:vf)+":"+(a+parseFloat(f))+"px;"),o&&(S+="box-sizing:border-box;text-align:left;width:"+o.offsetWidth+"px;"),g._isStart=b,g.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),g.style.cssText=S,g.innerText=t||t===0?e+"-"+t:e,m.children[0]?m.insertBefore(g,m.children[0]):m.appendChild(g),g._offset=g["offset"+i.op.d2],Zo(g,0,i,b),g},Zo=function(e,t,n,i){var s={display:"block"},a=n[i?"os2":"p2"],o=n[i?"p2":"os2"];e._isFlipped=i,s[n.a+"Percent"]=i?-100:0,s[n.a]=i?"1px":0,s["border"+a+ta]=1,s["border"+o+ta]=0,s[n.p]=t+"px",Ae.set(e,s)},Qe=[],eu={},Ka,vh=function(){return xn()-pi>34&&(Ka||(Ka=requestAnimationFrame(Qi)))},vs=function(){(!Rn||!Rn.isPressed||Rn.startX>gt.clientWidth)&&(nt.cache++,Rn?Ka||(Ka=requestAnimationFrame(Qi)):Qi(),pi||os("scrollStart"),pi=xn())},ql=function(){Xp=tt.innerWidth,Wp=tt.innerHeight},Ea=function(e){nt.cache++,(e===!0||!_n&&!Vp&&!_t.fullscreenElement&&!_t.webkitFullscreenElement&&(!Jc||Xp!==tt.innerWidth||Math.abs(tt.innerHeight-Wp)>tt.innerHeight*.25))&&pl.restart(!0)},as={},G_=[],Qp=function r(){return on(it,"scrollEnd",r)||Kr(!0)},os=function(e){return as[e]&&as[e].map(function(t){return t()})||G_},Yn=[],em=function(e){for(var t=0;t<Yn.length;t+=5)(!e||Yn[t+4]&&Yn[t+4].query===e)&&(Yn[t].style.cssText=Yn[t+1],Yn[t].getBBox&&Yn[t].setAttribute("transform",Yn[t+2]||""),Yn[t+3].uncache=1)},tm=function(){return nt.forEach(function(e){return Sn(e)&&++e.cacheID&&(e.rec=e())})},yf=function(e,t){var n;for(Cn=0;Cn<Qe.length;Cn++)n=Qe[Cn],n&&(!t||n._ctx===t)&&(e?n.kill(1):n.revert(!0,!0));Na=!0,t&&em(t),t||os("revert")},nm=function(e,t){nt.cache++,(t||!Pn)&&nt.forEach(function(n){return Sn(n)&&n.cacheID++&&(n.rec=0)}),qn(e)&&(tt.history.scrollRestoration=gf=e)},Pn,rs=0,Sh,H_=function(){if(Sh!==rs){var e=Sh=rs;requestAnimationFrame(function(){return e===rs&&Kr(!0)})}},im=function(){gt.appendChild(Xs),_f=!Rn&&Xs.offsetHeight||tt.innerHeight,gt.removeChild(Xs)},Mh=function(e){return $a(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},Kr=function(e,t){if(Kn=_t.documentElement,gt=_t.body,mf=[tt,_t,Kn,gt],pi&&!e&&!Na){ln(it,"scrollEnd",Qp);return}im(),Pn=it.isRefreshing=!0,Na||tm();var n=os("refreshInit");Hp&&it.sort(),t||yf(),nt.forEach(function(i){Sn(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),Qe.slice(0).forEach(function(i){return i.refresh()}),Na=!1,Qe.forEach(function(i){if(i._subPinOffset&&i.pin){var s=i.vars.horizontal?"offsetWidth":"offsetHeight",a=i.pin[s];i.revert(!0,1),i.adjustPinSpacing(i.pin[s]-a),i.refresh()}}),Qc=1,Mh(!0),Qe.forEach(function(i){var s=Ni(i.scroller,i._dir),a=i.vars.end==="max"||i._endClamp&&i.end>s,o=i._startClamp&&i.start>=s;(a||o)&&i.setPositions(o?s-1:i.start,a?Math.max(o?s:i.start+1,s):i.end,!0)}),Mh(!1),Qc=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),nt.forEach(function(i){Sn(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),nm(gf,1),pl.pause(),rs++,Pn=2,Qi(2),Qe.forEach(function(i){return Sn(i.vars.onRefresh)&&i.vars.onRefresh(i)}),Pn=it.isRefreshing=!1,os("refresh")},tu=0,Jo=1,Ba,Qi=function(e){if(e===2||!Pn&&!Na){it.isUpdating=!0,Ba&&Ba.update(0);var t=Qe.length,n=xn(),i=n-Yl>=50,s=t&&Qe[0].scroll();if(Jo=tu>s?-1:1,Pn||(tu=s),i&&(pi&&!Cl&&n-pi>200&&(pi=0,os("scrollEnd")),Sa=Yl,Yl=n),Jo<0){for(Cn=t;Cn-- >0;)Qe[Cn]&&Qe[Cn].update(0,i);Jo=1}else for(Cn=0;Cn<t;Cn++)Qe[Cn]&&Qe[Cn].update(0,i);it.isUpdating=!1}Ka=0},nu=[Zp,Jp,vf,xf,ci+Oa,ci+Ia,ci+Fa,ci+Ua,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],jo=nu.concat([ns,is,"boxSizing","max"+ta,"max"+Sf,"position",ci,Zt,Zt+Fa,Zt+Ia,Zt+Oa,Zt+Ua]),V_=function(e,t,n){Ys(n);var i=e._gsap;if(i.spacerIsNative)Ys(i.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},$l=function(e,t,n,i){if(!e._gsap.swappedIn){for(var s=nu.length,a=t.style,o=e.style,l;s--;)l=nu[s],a[l]=n[l];a.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(a.display="inline-block"),o[vf]=o[xf]="auto",a.flexBasis=n.flexBasis||"auto",a.overflow="visible",a.boxSizing="border-box",a[ns]=ml(e,Dn)+Qt,a[is]=ml(e,en)+Qt,a[Zt]=o[ci]=o[Jp]=o[Zp]="0",Ys(i),o[ns]=o["max"+ta]=n[ns],o[is]=o["max"+Sf]=n[is],o[Zt]=n[Zt],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},W_=/([A-Z])/g,Ys=function(e){if(e){var t=e.t.style,n=e.length,i=0,s,a;for((e.t._gsap||Ae.core.getCache(e.t)).uncache=1;i<n;i+=2)a=e[i+1],s=e[i],a?t[s]=a:t[s]&&t.removeProperty(s.replace(W_,"-$1").toLowerCase())}},mo=function(e){for(var t=jo.length,n=e.style,i=[],s=0;s<t;s++)i.push(jo[s],n[jo[s]]);return i.t=e,i},X_=function(e,t,n){for(var i=[],s=e.length,a=n?8:0,o;a<s;a+=2)o=e[a],i.push(o,o in t?t[o]:e[a+1]);return i.t=e.t,i},Qo={left:0,top:0},yh=function(e,t,n,i,s,a,o,l,c,u,d,f,h,g){Sn(e)&&(e=e(l)),qn(e)&&e.substr(0,3)==="max"&&(e=f+(e.charAt(4)==="="?Ko("0"+e.substr(3),n):0));var _=h?h.time():0,p,m,b;if(h&&h.seek(0),isNaN(e)||(e=+e),ba(e))h&&(e=Ae.utils.mapRange(h.scrollTrigger.start,h.scrollTrigger.end,0,f,e)),o&&Zo(o,n,i,!0);else{Sn(t)&&(t=t(l));var w=(e||"0").split(" "),S,T,A,E;b=In(t,l)||gt,S=Ki(b)||{},(!S||!S.left&&!S.top)&&ui(b).display==="none"&&(E=b.style.display,b.style.display="block",S=Ki(b),E?b.style.display=E:b.style.removeProperty("display")),T=Ko(w[0],S[i.d]),A=Ko(w[1]||"0",n),e=S[i.p]-c[i.p]-u+T+s-A,o&&Zo(o,A,i,n-A<20||o._isStart&&A>20),n-=n-A}if(g&&(l[g]=e||-.001,e<0&&(e=0)),a){var v=e+n,y=a._isStart;p="scroll"+i.d2,Zo(a,v,i,y&&v>20||!y&&(d?Math.max(gt[p],Kn[p]):a.parentNode[p])<=v+1),d&&(c=Ki(o),d&&(a.style[i.op.p]=c[i.op.p]-i.op.m-a._offset+Qt))}return h&&b&&(p=Ki(b),h.seek(f),m=Ki(b),h._caScrollDist=p[i.p]-m[i.p],e=e/h._caScrollDist*f),h&&h.seek(_),h?e:Math.round(e)},Y_=/(webkit|moz|length|cssText|inset)/i,bh=function(e,t,n,i){if(e.parentNode!==t){var s=e.style,a,o;if(t===gt){e._stOrig=s.cssText,o=ui(e);for(a in o)!+a&&!Y_.test(a)&&o[a]&&typeof s[a]=="string"&&a!=="0"&&(s[a]=o[a]);s.top=n,s.left=i}else s.cssText=e._stOrig;Ae.core.getCache(e).uncache=1,t.appendChild(e)}},rm=function(e,t,n){var i=t,s=i;return function(a){var o=Math.round(e());return o!==i&&o!==s&&Math.abs(o-i)>3&&Math.abs(o-s)>3&&(a=o,n&&n()),s=i,i=Math.round(a),i}},go=function(e,t,n){var i={};i[t.p]="+="+n,Ae.set(e,i)},Eh=function(e,t){var n=Nr(e,t),i="_scroll"+t.p2,s=function a(o,l,c,u,d){var f=a.tween,h=l.onComplete,g={};c=c||n();var _=rm(n,c,function(){f.kill(),a.tween=0});return d=u&&d||0,u=u||o-c,f&&f.kill(),l[i]=o,l.inherit=!1,l.modifiers=g,g[i]=function(){return _(c+u*f.ratio+d*f.ratio*f.ratio)},l.onUpdate=function(){nt.cache++,a.tween&&Qi()},l.onComplete=function(){a.tween=0,h&&h.call(f)},f=a.tween=Ae.to(e,l),f};return e[i]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},ln(e,"wheel",n.wheelHandler),it.isTouch&&ln(e,"touchmove",n.wheelHandler),s},it=(function(){function r(t,n){Is||r.register(Ae)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),jc(this),this.init(t,n)}var e=r.prototype;return e.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ma){this.update=this.refresh=this.kill=Ci;return}n=_h(qn(n)||ba(n)||n.nodeType?{trigger:n}:n,ho);var s=n,a=s.onUpdate,o=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,d=s.scrub,f=s.trigger,h=s.pin,g=s.pinSpacing,_=s.invalidateOnRefresh,p=s.anticipatePin,m=s.onScrubComplete,b=s.onSnapComplete,w=s.once,S=s.snap,T=s.pinReparent,A=s.pinSpacer,E=s.containerAnimation,v=s.fastScrollEnd,y=s.preventOverlaps,R=n.horizontal||n.containerAnimation&&n.horizontal!==!1?Dn:en,D=!d&&d!==0,L=In(n.scroller||tt),z=Ae.core.getCache(L),H=ss(L),F=("pinType"in n?n.pinType:Cr(L,"pinType")||H&&"fixed")==="fixed",G=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],O=D&&n.toggleActions.split(" "),K="markers"in n?n.markers:ho.markers,te=H?0:parseFloat(ui(L)["border"+R.p2+ta])||0,P=this,ae=n.onRefreshInit&&function(){return n.onRefreshInit(P)},de=F_(L,H,R),Ve=O_(L,H),Xe=0,Be=0,J=0,le=Nr(L,R),re,Re,Oe,Te,rt,be,ke,We,Ge,Y,ut,vt,At,Ye,mt,U,Ft,ze,C,x,k,W,Z,fe,ce,j,Q,me,we,ge,pe,ue,De,Ie,I,he,ee,_e,xe;if(P._startClamp=P._endClamp=!1,P._dir=R,p*=45,P.scroller=L,P.scroll=E?E.time.bind(E):le,Te=le(),P.vars=n,i=i||n.animation,"refreshPriority"in n&&(Hp=1,n.refreshPriority===-9999&&(Ba=P)),z.tweenScroll=z.tweenScroll||{top:Eh(L,en),left:Eh(L,Dn)},P.tweenTo=re=z.tweenScroll[R.p],P.scrubDuration=function(oe){De=ba(oe)&&oe,De?ue?ue.duration(oe):ue=Ae.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:De,paused:!0,onComplete:function(){return m&&m(P)}}):(ue&&ue.progress(1).kill(),ue=0)},i&&(i.vars.lazy=!1,i._initted&&!P.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),P.animation=i.pause(),i.scrollTrigger=P,P.scrubDuration(d),ge=0,l||(l=i.vars.id)),S&&((!Wr(S)||S.push)&&(S={snapTo:S}),"scrollBehavior"in gt.style&&Ae.set(H?[gt,Kn]:L,{scrollBehavior:"auto"}),nt.forEach(function(oe){return Sn(oe)&&oe.target===(H?_t.scrollingElement||Kn:L)&&(oe.smooth=!1)}),Oe=Sn(S.snapTo)?S.snapTo:S.snapTo==="labels"?k_(i):S.snapTo==="labelsDirectional"?z_(i):S.directional!==!1?function(oe,Fe){return Mf(S.snapTo)(oe,xn()-Be<500?0:Fe.direction)}:Ae.utils.snap(S.snapTo),Ie=S.duration||{min:.1,max:2},Ie=Wr(Ie)?La(Ie.min,Ie.max):La(Ie,Ie),I=Ae.delayedCall(S.delay||De/2||.1,function(){var oe=le(),Fe=xn()-Be<500,Ce=re.tween;if((Fe||Math.abs(P.getVelocity())<10)&&!Ce&&!Cl&&Xe!==oe){var qe=(oe-be)/Ye,qt=i&&!D?i.totalProgress():qe,et=Fe?0:(qt-pe)/(xn()-Sa)*1e3||0,Ct=Ae.utils.clamp(-qe,1-qe,xs(et/2)*et/.185),rn=qe+(S.inertia===!1?0:Ct),Pt,Mt,at=S,bn=at.onStart,wt=at.onInterrupt,dn=at.onComplete;if(Pt=Oe(rn,P),ba(Pt)||(Pt=rn),Mt=Math.max(0,Math.round(be+Pt*Ye)),oe<=ke&&oe>=be&&Mt!==oe){if(Ce&&!Ce._initted&&Ce.data<=xs(Mt-oe))return;S.inertia===!1&&(Ct=Pt-qe),re(Mt,{duration:Ie(xs(Math.max(xs(rn-qt),xs(Pt-qt))*.185/et/.05||0)),ease:S.ease||"power3",data:xs(Mt-oe),onInterrupt:function(){return I.restart(!0)&&wt&&_s(P,wt)},onComplete:function(){P.update(),Xe=le(),i&&!D&&(ue?ue.resetTo("totalProgress",Pt,i._tTime/i._tDur):i.progress(Pt)),ge=pe=i&&!D?i.totalProgress():P.progress,b&&b(P),dn&&_s(P,dn)}},oe,Ct*Ye,Mt-oe-Ct*Ye),bn&&_s(P,bn,re.tween)}}else P.isActive&&Xe!==oe&&I.restart(!0)}).pause()),l&&(eu[l]=P),f=P.trigger=In(f||h!==!0&&h),xe=f&&f._gsap&&f._gsap.stRevert,xe&&(xe=xe(P)),h=h===!0?f:In(h),qn(o)&&(o={targets:f,className:o}),h&&(g===!1||g===ci||(g=!g&&h.parentNode&&h.parentNode.style&&ui(h.parentNode).display==="flex"?!1:Zt),P.pin=h,Re=Ae.core.getCache(h),Re.spacer?mt=Re.pinState:(A&&(A=In(A),A&&!A.nodeType&&(A=A.current||A.nativeElement),Re.spacerIsNative=!!A,A&&(Re.spacerState=mo(A))),Re.spacer=ze=A||_t.createElement("div"),ze.classList.add("pin-spacer"),l&&ze.classList.add("pin-spacer-"+l),Re.pinState=mt=mo(h)),n.force3D!==!1&&Ae.set(h,{force3D:!0}),P.spacer=ze=Re.spacer,we=ui(h),fe=we[g+R.os2],x=Ae.getProperty(h),k=Ae.quickSetter(h,R.a,Qt),$l(h,ze,we),Ft=mo(h)),K){vt=Wr(K)?_h(K,xh):xh,Y=po("scroller-start",l,L,R,vt,0),ut=po("scroller-end",l,L,R,vt,0,Y),C=Y["offset"+R.op.d2];var ne=In(Cr(L,"content")||L);We=this.markerStart=po("start",l,ne,R,vt,C,0,E),Ge=this.markerEnd=po("end",l,ne,R,vt,C,0,E),E&&(_e=Ae.quickSetter([We,Ge],R.a,Qt)),!F&&!(Oi.length&&Cr(L,"fixedMarkers")===!0)&&(B_(H?gt:L),Ae.set([Y,ut],{force3D:!0}),j=Ae.quickSetter(Y,R.a,Qt),me=Ae.quickSetter(ut,R.a,Qt))}if(E){var se=E.vars.onUpdate,ie=E.vars.onUpdateParams;E.eventCallback("onUpdate",function(){P.update(0,0,1),se&&se.apply(E,ie||[])})}if(P.previous=function(){return Qe[Qe.indexOf(P)-1]},P.next=function(){return Qe[Qe.indexOf(P)+1]},P.revert=function(oe,Fe){if(!Fe)return P.kill(!0);var Ce=oe!==!1||!P.enabled,qe=_n;Ce!==P.isReverted&&(Ce&&(he=Math.max(le(),P.scroll.rec||0),J=P.progress,ee=i&&i.progress()),We&&[We,Ge,Y,ut].forEach(function(qt){return qt.style.display=Ce?"none":"block"}),Ce&&(_n=P,P.update(Ce)),h&&(!T||!P.isActive)&&(Ce?V_(h,ze,mt):$l(h,ze,ui(h),ce)),Ce||P.update(Ce),_n=qe,P.isReverted=Ce)},P.refresh=function(oe,Fe,Ce,qe){if(!((_n||!P.enabled)&&!Fe)){if(h&&oe&&pi){ln(r,"scrollEnd",Qp);return}!Pn&&ae&&ae(P),_n=P,re.tween&&!Ce&&(re.tween.kill(),re.tween=0),ue&&ue.pause(),_&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(Se){return Se.vars.immediateRender&&Se.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),P.isReverted||P.revert(!0,!0),P._subPinOffset=!1;var qt=de(),et=Ve(),Ct=E?E.duration():Ni(L,R),rn=Ye<=.01||!Ye,Pt=0,Mt=qe||0,at=Wr(Ce)?Ce.end:n.end,bn=n.endTrigger||f,wt=Wr(Ce)?Ce.start:n.start||(n.start===0||!f?0:h?"0 0":"0 100%"),dn=P.pinnedContainer=n.pinnedContainer&&In(n.pinnedContainer,P),En=f&&Math.max(0,Qe.indexOf(P))||0,$t=En,Ot,jt,Ei,ds,sn,Gt,ri,M,B,$,V,X,ve;for(K&&Wr(Ce)&&(X=Ae.getProperty(Y,R.p),ve=Ae.getProperty(ut,R.p));$t-- >0;)Gt=Qe[$t],Gt.end||Gt.refresh(0,1)||(_n=P),ri=Gt.pin,ri&&(ri===f||ri===h||ri===dn)&&!Gt.isReverted&&($||($=[]),$.unshift(Gt),Gt.revert(!0,!0)),Gt!==Qe[$t]&&(En--,$t--);for(Sn(wt)&&(wt=wt(P)),wt=dh(wt,"start",P),be=yh(wt,f,qt,R,le(),We,Y,P,et,te,F,Ct,E,P._startClamp&&"_startClamp")||(h?-.001:0),Sn(at)&&(at=at(P)),qn(at)&&!at.indexOf("+=")&&(~at.indexOf(" ")?at=(qn(wt)?wt.split(" ")[0]:"")+at:(Pt=Ko(at.substr(2),qt),at=qn(wt)?wt:(E?Ae.utils.mapRange(0,E.duration(),E.scrollTrigger.start,E.scrollTrigger.end,be):be)+Pt,bn=f)),at=dh(at,"end",P),ke=Math.max(be,yh(at||(bn?"100% 0":Ct),bn,qt,R,le()+Pt,Ge,ut,P,et,te,F,Ct,E,P._endClamp&&"_endClamp"))||-.001,Pt=0,$t=En;$t--;)Gt=Qe[$t]||{},ri=Gt.pin,ri&&Gt.start-Gt._pinPush<=be&&!E&&Gt.end>0&&(Ot=Gt.end-(P._startClamp?Math.max(0,Gt.start):Gt.start),(ri===f&&Gt.start-Gt._pinPush<be||ri===dn)&&isNaN(wt)&&(Pt+=Ot*(1-Gt.progress)),ri===h&&(Mt+=Ot));if(be+=Pt,ke+=Pt,P._startClamp&&(P._startClamp+=Pt),P._endClamp&&!Pn&&(P._endClamp=ke||-.001,ke=Math.min(ke,Ni(L,R))),Ye=ke-be||(be-=.01)&&.001,rn&&(J=Ae.utils.clamp(0,1,Ae.utils.normalize(be,ke,he))),P._pinPush=Mt,We&&Pt&&(Ot={},Ot[R.a]="+="+Pt,dn&&(Ot[R.p]="-="+le()),Ae.set([We,Ge],Ot)),h&&!(Qc&&P.end>=Ni(L,R)))Ot=ui(h),ds=R===en,Ei=le(),W=parseFloat(x(R.a))+Mt,!Ct&&ke>1&&(V=(H?_t.scrollingElement||Kn:L).style,V={style:V,value:V["overflow"+R.a.toUpperCase()]},H&&ui(gt)["overflow"+R.a.toUpperCase()]!=="scroll"&&(V.style["overflow"+R.a.toUpperCase()]="scroll")),$l(h,ze,Ot),Ft=mo(h),jt=Ki(h,!0),M=F&&Nr(L,ds?Dn:en)(),g?(ce=[g+R.os2,Ye+Mt+Qt],ce.t=ze,$t=g===Zt?ml(h,R)+Ye+Mt:0,$t&&(ce.push(R.d,$t+Qt),ze.style.flexBasis!=="auto"&&(ze.style.flexBasis=$t+Qt)),Ys(ce),dn&&Qe.forEach(function(Se){Se.pin===dn&&Se.vars.pinSpacing!==!1&&(Se._subPinOffset=!0)}),F&&le(he)):($t=ml(h,R),$t&&ze.style.flexBasis!=="auto"&&(ze.style.flexBasis=$t+Qt)),F&&(sn={top:jt.top+(ds?Ei-be:M)+Qt,left:jt.left+(ds?M:Ei-be)+Qt,boxSizing:"border-box",position:"fixed"},sn[ns]=sn["max"+ta]=Math.ceil(jt.width)+Qt,sn[is]=sn["max"+Sf]=Math.ceil(jt.height)+Qt,sn[ci]=sn[ci+Fa]=sn[ci+Ia]=sn[ci+Oa]=sn[ci+Ua]="0",sn[Zt]=Ot[Zt],sn[Zt+Fa]=Ot[Zt+Fa],sn[Zt+Ia]=Ot[Zt+Ia],sn[Zt+Oa]=Ot[Zt+Oa],sn[Zt+Ua]=Ot[Zt+Ua],U=X_(mt,sn,T),Pn&&le(0)),i?(B=i._initted,Wl(1),i.render(i.duration(),!0,!0),Z=x(R.a)-W+Ye+Mt,Q=Math.abs(Ye-Z)>1,F&&Q&&U.splice(U.length-2,2),i.render(0,!0,!0),B||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),Wl(0)):Z=Ye,V&&(V.value?V.style["overflow"+R.a.toUpperCase()]=V.value:V.style.removeProperty("overflow-"+R.a));else if(f&&le()&&!E)for(jt=f.parentNode;jt&&jt!==gt;)jt._pinOffset&&(be-=jt._pinOffset,ke-=jt._pinOffset),jt=jt.parentNode;$&&$.forEach(function(Se){return Se.revert(!1,!0)}),P.start=be,P.end=ke,Te=rt=Pn?he:le(),!E&&!Pn&&(Te<he&&le(he),P.scroll.rec=0),P.revert(!1,!0),Be=xn(),I&&(Xe=-1,I.restart(!0)),_n=0,i&&D&&(i._initted||ee)&&i.progress()!==ee&&i.progress(ee||0,!0).render(i.time(),!0,!0),(rn||J!==P.progress||E||_||i&&!i._initted)&&(i&&!D&&(i._initted||J||i.vars.immediateRender!==!1)&&i.totalProgress(E&&be<-.001&&!J?Ae.utils.normalize(be,ke,0):J,!0),P.progress=rn||(Te-be)/Ye===J?0:J),h&&g&&(ze._pinOffset=Math.round(P.progress*Z)),ue&&ue.invalidate(),isNaN(X)||(X-=Ae.getProperty(Y,R.p),ve-=Ae.getProperty(ut,R.p),go(Y,R,X),go(We,R,X-(qe||0)),go(ut,R,ve),go(Ge,R,ve-(qe||0))),rn&&!Pn&&P.update(),u&&!Pn&&!At&&(At=!0,u(P),At=!1)}},P.getVelocity=function(){return(le()-rt)/(xn()-Sa)*1e3||0},P.endAnimation=function(){ua(P.callbackAnimation),i&&(ue?ue.progress(1):i.paused()?D||ua(i,P.direction<0,1):ua(i,i.reversed()))},P.labelToScroll=function(oe){return i&&i.labels&&(be||P.refresh()||be)+i.labels[oe]/i.duration()*Ye||0},P.getTrailing=function(oe){var Fe=Qe.indexOf(P),Ce=P.direction>0?Qe.slice(0,Fe).reverse():Qe.slice(Fe+1);return(qn(oe)?Ce.filter(function(qe){return qe.vars.preventOverlaps===oe}):Ce).filter(function(qe){return P.direction>0?qe.end<=be:qe.start>=ke})},P.update=function(oe,Fe,Ce){if(!(E&&!Ce&&!oe)){var qe=Pn===!0?he:P.scroll(),qt=oe?0:(qe-be)/Ye,et=qt<0?0:qt>1?1:qt||0,Ct=P.progress,rn,Pt,Mt,at,bn,wt,dn,En;if(Fe&&(rt=Te,Te=E?le():qe,S&&(pe=ge,ge=i&&!D?i.totalProgress():et)),p&&h&&!_n&&!lo&&pi&&(!et&&be<qe+(qe-rt)/(xn()-Sa)*p?et=1e-4:et===1&&ke>qe+(qe-rt)/(xn()-Sa)*p&&(et=.9999)),et!==Ct&&P.enabled){if(rn=P.isActive=!!et&&et<1,Pt=!!Ct&&Ct<1,wt=rn!==Pt,bn=wt||!!et!=!!Ct,P.direction=et>Ct?1:-1,P.progress=et,bn&&!_n&&(Mt=et&&!Ct?0:et===1?1:Ct===1?2:3,D&&(at=!wt&&O[Mt+1]!=="none"&&O[Mt+1]||O[Mt],En=i&&(at==="complete"||at==="reset"||at in i))),y&&(wt||En)&&(En||d||!i)&&(Sn(y)?y(P):P.getTrailing(y).forEach(function(Ei){return Ei.endAnimation()})),D||(ue&&!_n&&!lo?(ue._dp._time-ue._start!==ue._time&&ue.render(ue._dp._time-ue._start),ue.resetTo?ue.resetTo("totalProgress",et,i._tTime/i._tDur):(ue.vars.totalProgress=et,ue.invalidate().restart())):i&&i.totalProgress(et,!!(_n&&(Be||oe)))),h){if(oe&&g&&(ze.style[g+R.os2]=fe),!F)k(ya(W+Z*et));else if(bn){if(dn=!oe&&et>Ct&&ke+1>qe&&qe+1>=Ni(L,R),T)if(!oe&&(rn||dn)){var $t=Ki(h,!0),Ot=qe-be;bh(h,gt,$t.top+(R===en?Ot:0)+Qt,$t.left+(R===en?0:Ot)+Qt)}else bh(h,ze);Ys(rn||dn?U:Ft),Q&&et<1&&rn||k(W+(et===1&&!dn?Z:0))}}S&&!re.tween&&!_n&&!lo&&I.restart(!0),o&&(wt||w&&et&&(et<1||!Xl))&&$a(o.targets).forEach(function(Ei){return Ei.classList[rn||w?"add":"remove"](o.className)}),a&&!D&&!oe&&a(P),bn&&!_n?(D&&(En&&(at==="complete"?i.pause().totalProgress(1):at==="reset"?i.restart(!0).pause():at==="restart"?i.restart(!0):i[at]()),a&&a(P)),(wt||!Xl)&&(c&&wt&&_s(P,c),G[Mt]&&_s(P,G[Mt]),w&&(et===1?P.kill(!1,1):G[Mt]=0),wt||(Mt=et===1?1:3,G[Mt]&&_s(P,G[Mt]))),v&&!rn&&Math.abs(P.getVelocity())>(ba(v)?v:2500)&&(ua(P.callbackAnimation),ue?ue.progress(1):ua(i,at==="reverse"?1:!et,1))):D&&a&&!_n&&a(P)}if(me){var jt=E?qe/E.duration()*(E._caScrollDist||0):qe;j(jt+(Y._isFlipped?1:0)),me(jt)}_e&&_e(-qe/E.duration()*(E._caScrollDist||0))}},P.enable=function(oe,Fe){P.enabled||(P.enabled=!0,ln(L,"resize",Ea),H||ln(L,"scroll",vs),ae&&ln(r,"refreshInit",ae),oe!==!1&&(P.progress=J=0,Te=rt=Xe=le()),Fe!==!1&&P.refresh())},P.getTween=function(oe){return oe&&re?re.tween:ue},P.setPositions=function(oe,Fe,Ce,qe){if(E){var qt=E.scrollTrigger,et=E.duration(),Ct=qt.end-qt.start;oe=qt.start+Ct*oe/et,Fe=qt.start+Ct*Fe/et}P.refresh(!1,!1,{start:ph(oe,Ce&&!!P._startClamp),end:ph(Fe,Ce&&!!P._endClamp)},qe),P.update()},P.adjustPinSpacing=function(oe){if(ce&&oe){var Fe=ce.indexOf(R.d)+1;ce[Fe]=parseFloat(ce[Fe])+oe+Qt,ce[1]=parseFloat(ce[1])+oe+Qt,Ys(ce)}},P.disable=function(oe,Fe){if(oe!==!1&&P.revert(!0,!0),P.enabled&&(P.enabled=P.isActive=!1,Fe||ue&&ue.pause(),he=0,Re&&(Re.uncache=1),ae&&on(r,"refreshInit",ae),I&&(I.pause(),re.tween&&re.tween.kill()&&(re.tween=0)),!H)){for(var Ce=Qe.length;Ce--;)if(Qe[Ce].scroller===L&&Qe[Ce]!==P)return;on(L,"resize",Ea),H||on(L,"scroll",vs)}},P.kill=function(oe,Fe){P.disable(oe,Fe),ue&&!Fe&&ue.kill(),l&&delete eu[l];var Ce=Qe.indexOf(P);Ce>=0&&Qe.splice(Ce,1),Ce===Cn&&Jo>0&&Cn--,Ce=0,Qe.forEach(function(qe){return qe.scroller===P.scroller&&(Ce=1)}),Ce||Pn||(P.scroll.rec=0),i&&(i.scrollTrigger=null,oe&&i.revert({kill:!1}),Fe||i.kill()),We&&[We,Ge,Y,ut].forEach(function(qe){return qe.parentNode&&qe.parentNode.removeChild(qe)}),Ba===P&&(Ba=0),h&&(Re&&(Re.uncache=1),Ce=0,Qe.forEach(function(qe){return qe.pin===h&&Ce++}),Ce||(Re.spacer=0)),n.onKill&&n.onKill(P)},Qe.push(P),P.enable(!1,!1),xe&&xe(P),i&&i.add&&!Ye){var Ue=P.update;P.update=function(){P.update=Ue,nt.cache++,be||ke||P.refresh()},Ae.delayedCall(.01,P.update),Ye=.01,be=ke=0}else P.refresh();h&&H_()},r.register=function(n){return Is||(Ae=n||qp(),Yp()&&window.document&&r.enable(),Is=Ma),Is},r.defaults=function(n){if(n)for(var i in n)ho[i]=n[i];return ho},r.disable=function(n,i){Ma=0,Qe.forEach(function(a){return a[i?"kill":"disable"](n)}),on(tt,"wheel",vs),on(_t,"scroll",vs),clearInterval(oo),on(_t,"touchcancel",Ci),on(gt,"touchstart",Ci),uo(on,_t,"pointerdown,touchstart,mousedown",mh),uo(on,_t,"pointerup,touchend,mouseup",gh),pl.kill(),co(on);for(var s=0;s<nt.length;s+=3)fo(on,nt[s],nt[s+1]),fo(on,nt[s],nt[s+2])},r.enable=function(){if(tt=window,_t=document,Kn=_t.documentElement,gt=_t.body,Ae){if($a=Ae.utils.toArray,La=Ae.utils.clamp,jc=Ae.core.context||Ci,Wl=Ae.core.suppressOverwrites||Ci,gf=tt.history.scrollRestoration||"auto",tu=tt.pageYOffset||0,Ae.core.globals("ScrollTrigger",r),gt){Ma=1,Xs=document.createElement("div"),Xs.style.height="100vh",Xs.style.position="absolute",im(),U_(),Xt.register(Ae),r.isTouch=Xt.isTouch,xr=Xt.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Jc=Xt.isTouch===1,ln(tt,"wheel",vs),mf=[tt,_t,Kn,gt],Ae.matchMedia?(r.matchMedia=function(u){var d=Ae.matchMedia(),f;for(f in u)d.add(f,u[f]);return d},Ae.addEventListener("matchMediaInit",function(){tm(),yf()}),Ae.addEventListener("matchMediaRevert",function(){return em()}),Ae.addEventListener("matchMedia",function(){Kr(0,1),os("matchMedia")}),Ae.matchMedia().add("(orientation: portrait)",function(){return ql(),ql})):console.warn("Requires GSAP 3.11.0 or later"),ql(),ln(_t,"scroll",vs);var n=gt.hasAttribute("style"),i=gt.style,s=i.borderTopStyle,a=Ae.core.Animation.prototype,o,l;for(a.revert||Object.defineProperty(a,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",o=Ki(gt),en.m=Math.round(o.top+en.sc())||0,Dn.m=Math.round(o.left+Dn.sc())||0,s?i.borderTopStyle=s:i.removeProperty("border-top-style"),n||(gt.setAttribute("style",""),gt.removeAttribute("style")),oo=setInterval(vh,250),Ae.delayedCall(.5,function(){return lo=0}),ln(_t,"touchcancel",Ci),ln(gt,"touchstart",Ci),uo(ln,_t,"pointerdown,touchstart,mousedown",mh),uo(ln,_t,"pointerup,touchend,mouseup",gh),Zc=Ae.utils.checkPrefix("transform"),jo.push(Zc),Is=xn(),pl=Ae.delayedCall(.2,Kr).pause(),Us=[_t,"visibilitychange",function(){var u=tt.innerWidth,d=tt.innerHeight;_t.hidden?(fh=u,hh=d):(fh!==u||hh!==d)&&Ea()},_t,"DOMContentLoaded",Kr,tt,"load",Kr,tt,"resize",Ea],co(ln),Qe.forEach(function(u){return u.enable(0,1)}),l=0;l<nt.length;l+=3)fo(on,nt[l],nt[l+1]),fo(on,nt[l],nt[l+2])}else if(_t){var c=function u(){r.enable(),_t.removeEventListener("DOMContentLoaded",u)};_t.addEventListener("DOMContentLoaded",c)}}},r.config=function(n){"limitCallbacks"in n&&(Xl=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(oo)||(oo=i)&&setInterval(vh,i),"ignoreMobileResize"in n&&(Jc=r.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(co(on)||co(ln,n.autoRefreshEvents||"none"),Vp=(n.autoRefreshEvents+"").indexOf("resize")===-1)},r.scrollerProxy=function(n,i){var s=In(n),a=nt.indexOf(s),o=ss(s);~a&&nt.splice(a,o?6:2),i&&(o?Oi.unshift(tt,i,gt,i,Kn,i):Oi.unshift(s,i))},r.clearMatchMedia=function(n){Qe.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},r.isInViewport=function(n,i,s){var a=(qn(n)?In(n):n).getBoundingClientRect(),o=a[s?ns:is]*i||0;return s?a.right-o>0&&a.left+o<tt.innerWidth:a.bottom-o>0&&a.top+o<tt.innerHeight},r.positionInViewport=function(n,i,s){qn(n)&&(n=In(n));var a=n.getBoundingClientRect(),o=a[s?ns:is],l=i==null?o/2:i in gl?gl[i]*o:~i.indexOf("%")?parseFloat(i)*o/100:parseFloat(i)||0;return s?(a.left+l)/tt.innerWidth:(a.top+l)/tt.innerHeight},r.killAll=function(n){if(Qe.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var i=as.killAll||[];as={},i.forEach(function(s){return s()})}},r})();it.version="3.15.0";it.saveStyles=function(r){return r?$a(r).forEach(function(e){if(e&&e.style){var t=Yn.indexOf(e);t>=0&&Yn.splice(t,5),Yn.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),Ae.core.getCache(e),jc())}}):Yn};it.revert=function(r,e){return yf(!r,e)};it.create=function(r,e){return new it(r,e)};it.refresh=function(r){return r?Ea(!0):(Is||it.register())&&Kr(!0)};it.update=function(r){return++nt.cache&&Qi(r===!0?2:0)};it.clearScrollMemory=nm;it.maxScroll=function(r,e){return Ni(r,e?Dn:en)};it.getScrollFunc=function(r,e){return Nr(In(r),e?Dn:en)};it.getById=function(r){return eu[r]};it.getAll=function(){return Qe.filter(function(r){return r.vars.id!=="ScrollSmoother"})};it.isScrolling=function(){return!!pi};it.snapDirectional=Mf;it.addEventListener=function(r,e){var t=as[r]||(as[r]=[]);~t.indexOf(e)||t.push(e)};it.removeEventListener=function(r,e){var t=as[r],n=t&&t.indexOf(e);n>=0&&t.splice(n,1)};it.batch=function(r,e){var t=[],n={},i=e.interval||.016,s=e.batchMax||1e9,a=function(c,u){var d=[],f=[],h=Ae.delayedCall(i,function(){u(d,f),d=[],f=[]}).pause();return function(g){d.length||h.restart(!0),d.push(g.trigger),f.push(g),s<=d.length&&h.progress(1)}},o;for(o in e)n[o]=o.substr(0,2)==="on"&&Sn(e[o])&&o!=="onRefreshInit"?a(o,e[o]):e[o];return Sn(s)&&(s=s(),ln(it,"refresh",function(){return s=e.batchMax()})),$a(r).forEach(function(l){var c={};for(o in n)c[o]=n[o];c.trigger=l,t.push(it.create(c))}),t};var Th=function(e,t,n,i){return t>i?e(i):t<0&&e(0),n>i?(i-t)/(n-t):n<0?t/(t-n):1},Kl=function r(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(Xt.isTouch?" pinch-zoom":""):"none",e===Kn&&r(gt,t)},_o={auto:1,scroll:1},q_=function(e){var t=e.event,n=e.target,i=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,a=s._gsap||Ae.core.getCache(s),o=xn(),l;if(!a._isScrollT||o-a._isScrollT>2e3){for(;s&&s!==gt&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(_o[(l=ui(s)).overflowY]||_o[l.overflowX]));)s=s.parentNode;a._isScroll=s&&s!==n&&!ss(s)&&(_o[(l=ui(s)).overflowY]||_o[l.overflowX]),a._isScrollT=o}(a._isScroll||i==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},sm=function(e,t,n,i){return Xt.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:i=i&&q_,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&ln(_t,Xt.eventTypes[0],wh,!1,!0)},onDisable:function(){return on(_t,Xt.eventTypes[0],wh,!0)}})},$_=/(input|label|select|textarea)/i,Ah,wh=function(e){var t=$_.test(e.target.tagName);(t||Ah)&&(e._gsapAllow=!0,Ah=t)},K_=function(e){Wr(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,n=t.normalizeScrollX,i=t.momentum,s=t.allowNestedScroll,a=t.onRelease,o,l,c=In(e.target)||Kn,u=Ae.core.globals().ScrollSmoother,d=u&&u.get(),f=xr&&(e.content&&In(e.content)||d&&e.content!==!1&&!d.smooth()&&d.content()),h=Nr(c,en),g=Nr(c,Dn),_=1,p=(Xt.isTouch&&tt.visualViewport?tt.visualViewport.scale*tt.visualViewport.width:tt.outerWidth)/tt.innerWidth,m=0,b=Sn(i)?function(){return i(o)}:function(){return i||2.8},w,S,T=sm(c,e.type,!0,s),A=function(){return S=!1},E=Ci,v=Ci,y=function(){l=Ni(c,en),v=La(xr?1:0,l),n&&(E=La(0,Ni(c,Dn))),w=rs},R=function(){f._gsap.y=ya(parseFloat(f._gsap.y)+h.offset)+"px",f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(f._gsap.y)+", 0, 1)",h.offset=h.cacheID=0},D=function(){if(S){requestAnimationFrame(A);var K=ya(o.deltaY/2),te=v(h.v-K);if(f&&te!==h.v+h.offset){h.offset=te-h.v;var P=ya((parseFloat(f&&f._gsap.y)||0)-h.offset);f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+P+", 0, 1)",f._gsap.y=P+"px",h.cacheID=nt.cache,Qi()}return!0}h.offset&&R(),S=!0},L,z,H,F,G=function(){y(),L.isActive()&&L.vars.scrollY>l&&(h()>l?L.progress(1)&&h(l):L.resetTo("scrollY",l))};return f&&Ae.set(f,{y:"+=0"}),e.ignoreCheck=function(O){return xr&&O.type==="touchmove"&&D()||_>1.05&&O.type!=="touchstart"||o.isGesturing||O.touches&&O.touches.length>1},e.onPress=function(){S=!1;var O=_;_=ya((tt.visualViewport&&tt.visualViewport.scale||1)/p),L.pause(),O!==_&&Kl(c,_>1.01?!0:n?!1:"x"),z=g(),H=h(),y(),w=rs},e.onRelease=e.onGestureStart=function(O,K){if(h.offset&&R(),!K)F.restart(!0);else{nt.cache++;var te=b(),P,ae;n&&(P=g(),ae=P+te*.05*-O.velocityX/.227,te*=Th(g,P,ae,Ni(c,Dn)),L.vars.scrollX=E(ae)),P=h(),ae=P+te*.05*-O.velocityY/.227,te*=Th(h,P,ae,Ni(c,en)),L.vars.scrollY=v(ae),L.invalidate().duration(te).play(.01),(xr&&L.vars.scrollY>=l||P>=l-1)&&Ae.to({},{onUpdate:G,duration:te})}a&&a(O)},e.onWheel=function(){L._ts&&L.pause(),xn()-m>1e3&&(w=0,m=xn())},e.onChange=function(O,K,te,P,ae){if(rs!==w&&y(),K&&n&&g(E(P[2]===K?z+(O.startX-O.x):g()+K-P[1])),te){h.offset&&R();var de=ae[2]===te,Ve=de?H+O.startY-O.y:h()+te-ae[1],Xe=v(Ve);de&&Ve!==Xe&&(H+=Xe-Ve),h(Xe)}(te||K)&&Qi()},e.onEnable=function(){Kl(c,n?!1:"x"),it.addEventListener("refresh",G),ln(tt,"resize",G),h.smooth&&(h.target.style.scrollBehavior="auto",h.smooth=g.smooth=!1),T.enable()},e.onDisable=function(){Kl(c,!0),on(tt,"resize",G),it.removeEventListener("refresh",G),T.kill()},e.lockAxis=e.lockAxis!==!1,o=new Xt(e),o.iOS=xr,xr&&!h()&&h(1),xr&&Ae.ticker.add(Ci),F=o._dc,L=Ae.to(o,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:rm(h,h(),function(){return L.pause()})},onUpdate:Qi,onComplete:F.vars.onComplete}),o};it.sort=function(r){if(Sn(r))return Qe.sort(r);var e=tt.pageYOffset||0;return it.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+tt.innerHeight}),Qe.sort(r||function(t,n){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};it.observe=function(r){return new Xt(r)};it.normalizeScroll=function(r){if(typeof r>"u")return Rn;if(r===!0&&Rn)return Rn.enable();if(r===!1){Rn&&Rn.kill(),Rn=r;return}var e=r instanceof Xt?r:K_(r);return Rn&&Rn.target===e.target&&Rn.kill(),ss(e.target)&&(Rn=e),e};it.core={_getVelocityProp:Kc,_inputObserver:sm,_scrollers:nt,_proxies:Oi,bridge:{ss:function(){pi||os("scrollStart"),pi=xn()},ref:function(){return _n}}};qp()&&Ae.registerPlugin(it);let Rh=typeof document<"u"?Ze.useLayoutEffect:Ze.useEffect,Ch=r=>r&&!Array.isArray(r)&&typeof r=="object",xo=[],Z_={},am=Hs;const bf=(r,e=xo)=>{let t=Z_;Ch(r)?(t=r,r=null,e="dependencies"in t?t.dependencies:xo):Ch(e)&&(t=e,e="dependencies"in t?t.dependencies:xo),r&&typeof r!="function"&&console.warn("First parameter must be a function or config object");const{scope:n,revertOnUpdate:i}=t,s=Ze.useRef(!1),a=Ze.useRef(am.context(()=>{},n)),o=Ze.useRef(c=>a.current.add(null,c)),l=e&&e.length&&!i;return l&&Rh(()=>(s.current=!0,()=>a.current.revert()),xo),Rh(()=>{if(r&&a.current.add(r,n),!l||!s.current)return()=>a.current.revert()},e),{context:a.current,contextSafe:o.current}};bf.register=r=>{am=r};bf.headless=!0;Hs.registerPlugin(it);const J_=[{type:"fire",size:72,pos:{left:"6%",top:"22%"},opacity:.12,dur:7,rate:.6},{type:"water",size:84,pos:{right:"8%",top:"18%"},opacity:.1,dur:8.4,rate:.8},{type:"electric",size:56,pos:{left:"12%",bottom:"18%"},opacity:.14,dur:6.2,rate:.5},{type:"grass",size:64,pos:{right:"14%",bottom:"24%"},opacity:.09,dur:9,rate:.7},{type:"psychic",size:48,pos:{left:"28%",top:"12%"},opacity:.1,dur:6.8,rate:.55},{type:"dragon",size:96,pos:{right:"30%",top:"9%"},opacity:.08,dur:8.8,rate:.9},{type:"fairy",size:56,pos:{left:"44%",bottom:"8%"},opacity:.12,dur:7.6,rate:.65}];function j_(){const r=Ze.useRef(null);return bf(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||window.matchMedia("(pointer: coarse)").matches)return;const e=r.current?.closest("section");if(!e)return;const t=Ym(),n=()=>it.update();return t?.on("scroll",n),Hs.to('[data-layer="nebula"]',{yPercent:18,ease:"none",scrollTrigger:{trigger:e,start:"top top",end:"bottom top",scrub:1}}),Hs.utils.toArray("[data-glyph]").forEach(i=>{const s=Number(i.dataset.rate??.5);Hs.to(i,{y:-s*180,ease:"none",scrollTrigger:{trigger:e,start:"top top",end:"bottom top",scrub:1}})}),()=>t?.off("scroll",n)},{scope:r}),N.jsxs("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:59:5",ref:r,className:"absolute inset-0","aria-hidden":!0,children:[N.jsxs("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:61:7","data-layer":"nebula",className:"absolute -inset-y-24 inset-x-0",children:[N.jsx("img",{"code-path":"src/pages/home/HeroBackdrop.tsx:62:9",src:"/hero-nebula.png",alt:"",className:"h-full w-full object-cover"}),N.jsx("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:63:9",className:"absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void"})]}),J_.map(e=>N.jsx("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:67:9","data-glyph":!0,"data-rate":e.rate,className:"absolute",style:{...e.pos,opacity:e.opacity,color:Nt[e.type].base},children:N.jsx(El,{"code-path":"src/pages/home/HeroBackdrop.tsx:74:11",type:e.type,size:e.size,style:{animation:`floaty ${e.dur}s ease-in-out infinite`}})},e.type))]})}const Ef="185",Q_=0,Ph=1,e0=2,el=1,t0=2,Ta=3,Ir=0,zn=1,Zi=2,er=0,qs=1,iu=2,Dh=3,Lh=4,n0=5,Yr=100,i0=101,r0=102,s0=103,a0=104,o0=200,l0=201,c0=202,u0=203,ru=204,su=205,f0=206,h0=207,d0=208,p0=209,m0=210,g0=211,_0=212,x0=213,v0=214,au=0,ou=1,lu=2,na=3,cu=4,uu=5,fu=6,hu=7,om=0,S0=1,M0=2,Bi=0,lm=1,cm=2,um=3,fm=4,hm=5,dm=6,pm=7,mm=300,ls=301,ia=302,Zl=303,Jl=304,Pl=306,du=1e3,ji=1001,pu=1002,fn=1003,y0=1004,vo=1005,Mn=1006,jl=1007,Zr=1008,fi=1009,gm=1010,_m=1011,Za=1012,Tf=1013,Gi=1014,Ii=1015,ar=1016,Af=1017,wf=1018,Ja=1020,xm=35902,vm=35899,Sm=1021,Mm=1022,Mi=1023,or=1026,Jr=1027,ym=1028,Rf=1029,cs=1030,Cf=1031,Pf=1033,tl=33776,nl=33777,il=33778,rl=33779,mu=35840,gu=35841,_u=35842,xu=35843,vu=36196,Su=37492,Mu=37496,yu=37488,bu=37489,_l=37490,Eu=37491,Tu=37808,Au=37809,wu=37810,Ru=37811,Cu=37812,Pu=37813,Du=37814,Lu=37815,Nu=37816,Iu=37817,Uu=37818,Fu=37819,Ou=37820,Bu=37821,ku=36492,zu=36494,Gu=36495,Hu=36283,Vu=36284,xl=36285,Wu=36286,b0=3200,Nh=0,E0=1,Sr="",li="srgb",vl="srgb-linear",Sl="linear",xt="srgb",Ss=7680,Ih=519,T0=512,A0=513,w0=514,Df=515,R0=516,C0=517,Lf=518,P0=519,Uh=35044,Fh="300 es",Ui=2e3,Ml=2001;function D0(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function yl(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function L0(){const r=yl("canvas");return r.style.display="block",r}const Oh={};function Bh(...r){const e="THREE."+r.shift();console.log(e,...r)}function bm(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function He(...r){r=bm(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function ht(...r){r=bm(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function $s(...r){const e=r.join(" ");e in Oh||(Oh[e]=!0,He(...r))}function N0(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const I0={[au]:ou,[lu]:fu,[cu]:hu,[na]:uu,[ou]:au,[fu]:lu,[hu]:cu,[uu]:na};class hs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ql=Math.PI/180,Xu=180/Math.PI;function eo(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(mn[r&255]+mn[r>>8&255]+mn[r>>16&255]+mn[r>>24&255]+"-"+mn[e&255]+mn[e>>8&255]+"-"+mn[e>>16&15|64]+mn[e>>24&255]+"-"+mn[t&63|128]+mn[t>>8&255]+"-"+mn[t>>16&255]+mn[t>>24&255]+mn[n&255]+mn[n>>8&255]+mn[n>>16&255]+mn[n>>24&255]).toLowerCase()}function lt(r,e,t){return Math.max(e,Math.min(t,r))}function U0(r,e){return(r%e+e)%e}function ec(r,e,t){return(1-t)*r+t*e}function fa(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Nn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Of=class Of{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Of.prototype.isVector2=!0;let pt=Of;class aa{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3],f=s[a+0],h=s[a+1],g=s[a+2],_=s[a+3];if(d!==_||l!==f||c!==h||u!==g){let p=l*f+c*h+u*g+d*_;p<0&&(f=-f,h=-h,g=-g,_=-_,p=-p);let m=1-o;if(p<.9995){const b=Math.acos(p),w=Math.sin(b);m=Math.sin(m*b)/w,o=Math.sin(o*b)/w,l=l*m+f*o,c=c*m+h*o,u=u*m+g*o,d=d*m+_*o}else{l=l*m+f*o,c=c*m+h*o,u=u*m+g*o,d=d*m+_*o;const b=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=b,c*=b,u*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=s[a],f=s[a+1],h=s[a+2],g=s[a+3];return e[t]=o*g+u*d+l*h-c*f,e[t+1]=l*g+u*f+c*d-o*h,e[t+2]=c*g+u*h+o*f-l*d,e[t+3]=u*g-o*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),d=o(s/2),f=l(n/2),h=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"YXZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"ZXY":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"ZYX":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"YZX":this._x=f*u*d+c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d-f*h*g;break;case"XZY":this._x=f*u*d-c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d+f*h*g;break;default:He("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(s-c)*h,this._z=(a-i)*h}else if(n>o&&n>d){const h=2*Math.sqrt(1+n-o-d);this._w=(u-l)/h,this._x=.25*h,this._y=(i+a)/h,this._z=(s+c)/h}else if(o>d){const h=2*Math.sqrt(1+o-n-d);this._w=(s-c)/h,this._x=(i+a)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-n-o);this._w=(a-i)/h,this._x=(s+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(lt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-s*l,this._y=i*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Bf=class Bf{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-s*i),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-s*d,this.z=i+l*d+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return tc.copy(this).projectOnVector(e),this.sub(tc)}reflect(e){return this.sub(tc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Bf.prototype.isVector3=!0;let q=Bf;const tc=new q,kh=new aa,kf=class kf{constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],h=n[5],g=n[8],_=i[0],p=i[3],m=i[6],b=i[1],w=i[4],S=i[7],T=i[2],A=i[5],E=i[8];return s[0]=a*_+o*b+l*T,s[3]=a*p+o*w+l*A,s[6]=a*m+o*S+l*E,s[1]=c*_+u*b+d*T,s[4]=c*p+u*w+d*A,s[7]=c*m+u*S+d*E,s[2]=f*_+h*b+g*T,s[5]=f*p+h*w+g*A,s[8]=f*m+h*S+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*s,h=c*s-a*l,g=t*d+n*f+i*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-u*n)*_,e[2]=(o*n-i*a)*_,e[3]=f*_,e[4]=(u*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=h*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return $s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(nc.makeScale(e,t)),this}rotate(e){return $s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(nc.makeRotation(-e)),this}translate(e,t){return $s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(nc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};kf.prototype.isMatrix3=!0;let $e=kf;const nc=new $e,zh=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gh=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function F0(){const r={enabled:!0,workingColorSpace:vl,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===xt&&(i.r=tr(i.r),i.g=tr(i.g),i.b=tr(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xt&&(i.r=Ks(i.r),i.g=Ks(i.g),i.b=Ks(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Sr?Sl:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return $s("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return $s("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[vl]:{primaries:e,whitePoint:n,transfer:Sl,toXYZ:zh,fromXYZ:Gh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:zh,fromXYZ:Gh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),r}const ot=F0();function tr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ks(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ms;class O0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ms===void 0&&(Ms=yl("canvas")),Ms.width=e.width,Ms.height=e.height;const i=Ms.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ms}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=yl("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=tr(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(tr(t[n]/255)*255):t[n]=tr(t[n]);return{data:t,width:e.width,height:e.height}}else return He("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let B0=0;class Nf{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=eo(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(ic(i[a].image)):s.push(ic(i[a]))}else s=ic(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function ic(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?O0.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(He("Texture: Unable to serialize Texture."),{})}let k0=0;const rc=new q;class Ln extends hs{constructor(e=Ln.DEFAULT_IMAGE,t=Ln.DEFAULT_MAPPING,n=ji,i=ji,s=Mn,a=Zr,o=Mi,l=fi,c=Ln.DEFAULT_ANISOTROPY,u=Sr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=eo(),this.name="",this.source=new Nf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(rc).x}get height(){return this.source.getSize(rc).y}get depth(){return this.source.getSize(rc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){He(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case du:e.x=e.x-Math.floor(e.x);break;case ji:e.x=e.x<0?0:1;break;case pu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case du:e.y=e.y-Math.floor(e.y);break;case ji:e.y=e.y<0?0:1;break;case pu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=mm;Ln.DEFAULT_ANISOTROPY=1;const zf=class zf{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+h+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,S=(h+1)/2,T=(m+1)/2,A=(u+f)/4,E=(d+_)/4,v=(g+p)/4;return w>S&&w>T?w<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(w),i=A/n,s=E/n):S>T?S<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(S),n=A/i,s=v/i):T<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(T),n=E/s,i=v/s),this.set(n,i,s,t),this}let b=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(d-_)/b,this.z=(f-u)/b,this.w=Math.acos((c+h+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this.w=lt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this.w=lt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};zf.prototype.isVector4=!0;let kt=zf;class z0 extends hs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new kt(0,0,e,t),this.scissorTest=!1,this.viewport=new kt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},s=new Ln(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Mn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Nf(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends z0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Em extends Ln{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class G0 extends Ln{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const bl=class bl{constructor(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p)}set(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=f,m[3]=h,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new bl().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/ys.setFromMatrixColumn(e,0).length(),s=1/ys.setFromMatrixColumn(e,1).length(),a=1/ys.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+h*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,h=l*d,g=c*u,_=c*d;t[0]=f+_*o,t[4]=g*o-h,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,h=l*d,g=c*u,_=c*d;t[0]=f-_*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*u,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=g*c-h,t[8]=f*c+_,t[1]=l*d,t[5]=_*c+f,t[9]=h*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,h=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-f*d,t[8]=g*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=h*d+g,t[10]=f-_*d}else if(e.order==="XZY"){const f=a*l,h=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+_,t[5]=a*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*u,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(H0,e,V0)}lookAt(e,t,n){const i=this.elements;return Wn.subVectors(e,t),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),hr.crossVectors(n,Wn),hr.lengthSq()===0&&(Math.abs(n.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),hr.crossVectors(n,Wn)),hr.normalize(),So.crossVectors(Wn,hr),i[0]=hr.x,i[4]=So.x,i[8]=Wn.x,i[1]=hr.y,i[5]=So.y,i[9]=Wn.y,i[2]=hr.z,i[6]=So.z,i[10]=Wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],h=n[13],g=n[2],_=n[6],p=n[10],m=n[14],b=n[3],w=n[7],S=n[11],T=n[15],A=i[0],E=i[4],v=i[8],y=i[12],R=i[1],D=i[5],L=i[9],z=i[13],H=i[2],F=i[6],G=i[10],O=i[14],K=i[3],te=i[7],P=i[11],ae=i[15];return s[0]=a*A+o*R+l*H+c*K,s[4]=a*E+o*D+l*F+c*te,s[8]=a*v+o*L+l*G+c*P,s[12]=a*y+o*z+l*O+c*ae,s[1]=u*A+d*R+f*H+h*K,s[5]=u*E+d*D+f*F+h*te,s[9]=u*v+d*L+f*G+h*P,s[13]=u*y+d*z+f*O+h*ae,s[2]=g*A+_*R+p*H+m*K,s[6]=g*E+_*D+p*F+m*te,s[10]=g*v+_*L+p*G+m*P,s[14]=g*y+_*z+p*O+m*ae,s[3]=b*A+w*R+S*H+T*K,s[7]=b*E+w*D+S*F+T*te,s[11]=b*v+w*L+S*G+T*P,s[15]=b*y+w*z+S*O+T*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],g=e[3],_=e[7],p=e[11],m=e[15],b=l*h-c*f,w=o*h-c*d,S=o*f-l*d,T=a*h-c*u,A=a*f-l*u,E=a*d-o*u;return t*(_*b-p*w+m*S)-n*(g*b-p*T+m*A)+i*(g*w-_*T+m*E)-s*(g*S-_*A+p*E)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],g=e[12],_=e[13],p=e[14],m=e[15],b=t*o-n*a,w=t*l-i*a,S=t*c-s*a,T=n*l-i*o,A=n*c-s*o,E=i*c-s*l,v=u*_-d*g,y=u*p-f*g,R=u*m-h*g,D=d*p-f*_,L=d*m-h*_,z=f*m-h*p,H=b*z-w*L+S*D+T*R-A*y+E*v;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/H;return e[0]=(o*z-l*L+c*D)*F,e[1]=(i*L-n*z-s*D)*F,e[2]=(_*E-p*A+m*T)*F,e[3]=(f*A-d*E-h*T)*F,e[4]=(l*R-a*z-c*y)*F,e[5]=(t*z-i*R+s*y)*F,e[6]=(p*S-g*E-m*w)*F,e[7]=(u*E-f*S+h*w)*F,e[8]=(a*L-o*R+c*v)*F,e[9]=(n*R-t*L-s*v)*F,e[10]=(g*A-_*S+m*b)*F,e[11]=(d*S-u*A-h*b)*F,e[12]=(o*y-a*D-l*v)*F,e[13]=(t*D-n*y+i*v)*F,e[14]=(_*w-g*T-p*b)*F,e[15]=(u*T-d*w+f*b)*F,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,d=o+o,f=s*c,h=s*u,g=s*d,_=a*u,p=a*d,m=o*d,b=l*c,w=l*u,S=l*d,T=n.x,A=n.y,E=n.z;return i[0]=(1-(_+m))*T,i[1]=(h+S)*T,i[2]=(g-w)*T,i[3]=0,i[4]=(h-S)*A,i[5]=(1-(f+m))*A,i[6]=(p+b)*A,i[7]=0,i[8]=(g+w)*E,i[9]=(p-b)*E,i[10]=(1-(f+_))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=ys.set(i[0],i[1],i[2]).length();const o=ys.set(i[4],i[5],i[6]).length(),l=ys.set(i[8],i[9],i[10]).length();s<0&&(a=-a),mi.copy(this);const c=1/a,u=1/o,d=1/l;return mi.elements[0]*=c,mi.elements[1]*=c,mi.elements[2]*=c,mi.elements[4]*=u,mi.elements[5]*=u,mi.elements[6]*=u,mi.elements[8]*=d,mi.elements[9]*=d,mi.elements[10]*=d,t.setFromRotationMatrix(mi),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=Ui,l=!1){const c=this.elements,u=2*s/(t-e),d=2*s/(n-i),f=(t+e)/(t-e),h=(n+i)/(n-i);let g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===Ui)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Ml)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=Ui,l=!1){const c=this.elements,u=2/(t-e),d=2/(n-i),f=-(t+e)/(t-e),h=-(n+i)/(n-i);let g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===Ui)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Ml)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};bl.prototype.isMatrix4=!0;let Yt=bl;const ys=new q,mi=new Yt,H0=new q(0,0,0),V0=new q(1,1,1),hr=new q,So=new q,Wn=new q,Hh=new Yt,Vh=new aa;class us{constructor(e=0,t=0,n=0,i=us.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],d=i[2],f=i[6],h=i[10];switch(t){case"XYZ":this._y=Math.asin(lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-lt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(lt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-lt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(lt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:He("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vh.setFromEuler(this),this.setFromQuaternion(Vh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}us.DEFAULT_ORDER="XYZ";class Tm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let W0=0;const Wh=new q,bs=new aa,Hi=new Yt,Mo=new q,ha=new q,X0=new q,Y0=new aa,Xh=new q(1,0,0),Yh=new q(0,1,0),qh=new q(0,0,1),$h={type:"added"},q0={type:"removed"},Es={type:"childadded",child:null},sc={type:"childremoved",child:null};class Gn extends hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:W0++}),this.uuid=eo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Gn.DEFAULT_UP.clone();const e=new q,t=new us,n=new aa,i=new q(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Yt},normalMatrix:{value:new $e}}),this.matrix=new Yt,this.matrixWorld=new Yt,this.matrixAutoUpdate=Gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Tm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return bs.setFromAxisAngle(e,t),this.quaternion.multiply(bs),this}rotateOnWorldAxis(e,t){return bs.setFromAxisAngle(e,t),this.quaternion.premultiply(bs),this}rotateX(e){return this.rotateOnAxis(Xh,e)}rotateY(e){return this.rotateOnAxis(Yh,e)}rotateZ(e){return this.rotateOnAxis(qh,e)}translateOnAxis(e,t){return Wh.copy(e).applyQuaternion(this.quaternion),this.position.add(Wh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xh,e)}translateY(e){return this.translateOnAxis(Yh,e)}translateZ(e){return this.translateOnAxis(qh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mo.copy(e):Mo.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ha.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(ha,Mo,this.up):Hi.lookAt(Mo,ha,this.up),this.quaternion.setFromRotationMatrix(Hi),i&&(Hi.extractRotation(i.matrixWorld),bs.setFromRotationMatrix(Hi),this.quaternion.premultiply(bs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ht("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($h),Es.child=e,this.dispatchEvent(Es),Es.child=null):ht("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(q0),sc.child=e,this.dispatchEvent(sc),sc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($h),Es.child=e,this.dispatchEvent(Es),Es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,e,X0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,Y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Gn.DEFAULT_UP=new q(0,1,0);Gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class yo extends Gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $0={type:"move"};class ac{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,g=.005;c.inputState.pinching&&f>h+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new yo;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Am={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},dr={h:0,s:0,l:0},bo={h:0,s:0,l:0};function oc(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class dt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=li){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ot.workingColorSpace){if(e=U0(e,1),t=lt(t,0,1),n=lt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=oc(a,s,e+1/3),this.g=oc(a,s,e),this.b=oc(a,s,e-1/3)}return ot.colorSpaceToWorking(this,i),this}setStyle(e,t=li){function n(s){s!==void 0&&parseFloat(s)<1&&He("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:He("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);He("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=li){const n=Am[e.toLowerCase()];return n!==void 0?this.setHex(n,t):He("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}copyLinearToSRGB(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=li){return ot.workingToColorSpace(gn.copy(this),e),Math.round(lt(gn.r*255,0,255))*65536+Math.round(lt(gn.g*255,0,255))*256+Math.round(lt(gn.b*255,0,255))}getHexString(e=li){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(gn.copy(this),t);const n=gn.r,i=gn.g,s=gn.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(gn.copy(this),t),e.r=gn.r,e.g=gn.g,e.b=gn.b,e}getStyle(e=li){ot.workingToColorSpace(gn.copy(this),e);const t=gn.r,n=gn.g,i=gn.b;return e!==li?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(dr),this.setHSL(dr.h+e,dr.s+t,dr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(dr),e.getHSL(bo);const n=ec(dr.h,bo.h,t),i=ec(dr.s,bo.s,t),s=ec(dr.l,bo.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const gn=new dt;dt.NAMES=Am;class K0 extends Gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new us,this.environmentIntensity=1,this.environmentRotation=new us,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const gi=new q,Vi=new q,lc=new q,Wi=new q,Ts=new q,As=new q,Kh=new q,cc=new q,uc=new q,fc=new q,hc=new kt,dc=new kt,pc=new kt;class Si{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),gi.subVectors(e,t),i.cross(gi);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){gi.subVectors(i,t),Vi.subVectors(n,t),lc.subVectors(e,t);const a=gi.dot(gi),o=gi.dot(Vi),l=gi.dot(lc),c=Vi.dot(Vi),u=Vi.dot(lc),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,h=(c*l-o*u)*f,g=(a*u-o*l)*f;return s.set(1-h-g,g,h)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Wi)===null?!1:Wi.x>=0&&Wi.y>=0&&Wi.x+Wi.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Wi.x),l.addScaledVector(a,Wi.y),l.addScaledVector(o,Wi.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return hc.setScalar(0),dc.setScalar(0),pc.setScalar(0),hc.fromBufferAttribute(e,t),dc.fromBufferAttribute(e,n),pc.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(hc,s.x),a.addScaledVector(dc,s.y),a.addScaledVector(pc,s.z),a}static isFrontFacing(e,t,n,i){return gi.subVectors(n,t),Vi.subVectors(e,t),gi.cross(Vi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),Vi.subVectors(this.a,this.b),gi.cross(Vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Si.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Si.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Si.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Si.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Si.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Ts.subVectors(i,n),As.subVectors(s,n),cc.subVectors(e,n);const l=Ts.dot(cc),c=As.dot(cc);if(l<=0&&c<=0)return t.copy(n);uc.subVectors(e,i);const u=Ts.dot(uc),d=As.dot(uc);if(u>=0&&d<=u)return t.copy(i);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ts,a);fc.subVectors(e,s);const h=Ts.dot(fc),g=As.dot(fc);if(g>=0&&h<=g)return t.copy(s);const _=h*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(As,o);const p=u*g-h*d;if(p<=0&&d-u>=0&&h-g>=0)return Kh.subVectors(s,i),o=(d-u)/(d-u+(h-g)),t.copy(i).addScaledVector(Kh,o);const m=1/(p+_+f);return a=_*m,o=f*m,t.copy(n).addScaledVector(Ts,a).addScaledVector(As,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class to{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(_i.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(_i.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=_i.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,_i):_i.fromBufferAttribute(s,a),_i.applyMatrix4(e.matrixWorld),this.expandByPoint(_i);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Eo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Eo.copy(n.boundingBox)),Eo.applyMatrix4(e.matrixWorld),this.union(Eo)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,_i),_i.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(da),To.subVectors(this.max,da),ws.subVectors(e.a,da),Rs.subVectors(e.b,da),Cs.subVectors(e.c,da),pr.subVectors(Rs,ws),mr.subVectors(Cs,Rs),Br.subVectors(ws,Cs);let t=[0,-pr.z,pr.y,0,-mr.z,mr.y,0,-Br.z,Br.y,pr.z,0,-pr.x,mr.z,0,-mr.x,Br.z,0,-Br.x,-pr.y,pr.x,0,-mr.y,mr.x,0,-Br.y,Br.x,0];return!mc(t,ws,Rs,Cs,To)||(t=[1,0,0,0,1,0,0,0,1],!mc(t,ws,Rs,Cs,To))?!1:(Ao.crossVectors(pr,mr),t=[Ao.x,Ao.y,Ao.z],mc(t,ws,Rs,Cs,To))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,_i).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(_i).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xi=[new q,new q,new q,new q,new q,new q,new q,new q],_i=new q,Eo=new to,ws=new q,Rs=new q,Cs=new q,pr=new q,mr=new q,Br=new q,da=new q,To=new q,Ao=new q,kr=new q;function mc(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){kr.fromArray(r,s);const o=i.x*Math.abs(kr.x)+i.y*Math.abs(kr.y)+i.z*Math.abs(kr.z),l=e.dot(kr),c=t.dot(kr),u=n.dot(kr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Kt=new q,wo=new pt;let Z0=0;class ti extends hs{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Z0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Uh,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wo.fromBufferAttribute(this,t),wo.applyMatrix3(e),this.setXY(t,wo.x,wo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix3(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=fa(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=fa(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=fa(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=fa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=fa(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nn(t,this.array),n=Nn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Nn(t,this.array),n=Nn(n,this.array),i=Nn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Nn(t,this.array),n=Nn(n,this.array),i=Nn(i,this.array),s=Nn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Uh&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class wm extends ti{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Rm extends ti{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nr extends ti{constructor(e,t,n){super(new Float32Array(e),t,n)}}const J0=new to,pa=new q,gc=new q;class Dl{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):J0.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;pa.subVectors(e,this.center);const t=pa.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(pa,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(pa.copy(e.center).add(gc)),this.expandByPoint(pa.copy(e.center).sub(gc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let j0=0;const ai=new Yt,_c=new Gn,Ps=new q,Xn=new to,ma=new to,an=new q;class bi extends hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=eo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(D0(e)?Rm:wm)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new $e().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,n){return ai.makeTranslation(e,t,n),this.applyMatrix4(ai),this}scale(e,t,n){return ai.makeScale(e,t,n),this.applyMatrix4(ai),this}lookAt(e){return _c.lookAt(e),_c.updateMatrix(),this.applyMatrix4(_c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ps).negate(),this.translate(Ps.x,Ps.y,Ps.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new nr(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&He("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new to);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Xn.setFromBufferAttribute(s),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,Xn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,Xn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(Xn.min),this.boundingBox.expandByPoint(Xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){const n=this.boundingSphere.center;if(Xn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];ma.setFromBufferAttribute(o),this.morphTargetsRelative?(an.addVectors(Xn.min,ma.min),Xn.expandByPoint(an),an.addVectors(Xn.max,ma.max),Xn.expandByPoint(an)):(Xn.expandByPoint(ma.min),Xn.expandByPoint(ma.max))}Xn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)an.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(an));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)an.fromBufferAttribute(o,c),l&&(Ps.fromBufferAttribute(e,c),an.add(Ps)),i=Math.max(i,n.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ti(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new q,l[v]=new q;const c=new q,u=new q,d=new q,f=new pt,h=new pt,g=new pt,_=new q,p=new q;function m(v,y,R){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,R),f.fromBufferAttribute(s,v),h.fromBufferAttribute(s,y),g.fromBufferAttribute(s,R),u.sub(c),d.sub(c),h.sub(f),g.sub(f);const D=1/(h.x*g.y-g.x*h.y);isFinite(D)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(D),p.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(D),o[v].add(_),o[y].add(_),o[R].add(_),l[v].add(p),l[y].add(p),l[R].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let v=0,y=b.length;v<y;++v){const R=b[v],D=R.start,L=R.count;for(let z=D,H=D+L;z<H;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const w=new q,S=new q,T=new q,A=new q;function E(v){T.fromBufferAttribute(i,v),A.copy(T);const y=o[v];w.copy(y),w.sub(T.multiplyScalar(T.dot(y))).normalize(),S.crossVectors(A,y);const D=S.dot(l[v])<0?-1:1;a.setXYZW(v,w.x,w.y,w.z,D)}for(let v=0,y=b.length;v<y;++v){const R=b[v],D=R.start,L=R.count;for(let z=D,H=D+L;z<H;z+=3)E(e.getX(z+0)),E(e.getX(z+1)),E(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ti(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);const i=new q,s=new q,a=new q,o=new q,l=new q,c=new q,u=new q,d=new q;if(e)for(let f=0,h=e.count;f<h;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),u.subVectors(a,s),d.subVectors(i,s),u.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,h=t.count;f<h;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(i,s),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)an.fromBufferAttribute(e,t),an.normalize(),e.setXYZ(t,an.x,an.y,an.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u);let h=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?h=l[_]*o.data.stride+o.offset:h=l[_]*u;for(let m=0;m<u;m++)f[g++]=c[h++]}return new ti(f,u,d)}if(this.index===null)return He("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bi,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,d=c.length;u<d;u++){const f=c[u],h=e(f,n);l.push(h)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(i[l]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Q0=0;class no extends hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=eo(),this.name="",this.type="Material",this.blending=qs,this.side=Ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ru,this.blendDst=su,this.blendEquation=Yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dt(0,0,0),this.blendAlpha=0,this.depthFunc=na,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ih,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ss,this.stencilZFail=Ss,this.stencilZPass=Ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){He(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qs&&(n.blending=this.blending),this.side!==Ir&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ru&&(n.blendSrc=this.blendSrc),this.blendDst!==su&&(n.blendDst=this.blendDst),this.blendEquation!==Yr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==na&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ih&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ss&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ss&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ss&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new dt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new pt().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new pt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Yi=new q,xc=new q,Ro=new q,gr=new q,vc=new q,Co=new q,Sc=new q;class Cm{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yi.copy(this.origin).addScaledVector(this.direction,t),Yi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){xc.copy(e).add(t).multiplyScalar(.5),Ro.copy(t).sub(e).normalize(),gr.copy(this.origin).sub(xc);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Ro),o=gr.dot(this.direction),l=-gr.dot(Ro),c=gr.lengthSq(),u=Math.abs(1-a*a);let d,f,h,g;if(u>0)if(d=a*l-o,f=a*o-l,g=s*u,d>=0)if(f>=-g)if(f<=g){const _=1/u;d*=_,f*=_,h=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-s,-l),s),h=f*(f+2*l)+c):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(xc).addScaledVector(Ro,f),h}intersectSphere(e,t){Yi.subVectors(e.center,this.origin);const n=Yi.dot(this.direction),i=Yi.dot(Yi)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Yi)!==null}intersectTriangle(e,t,n,i,s){vc.subVectors(t,e),Co.subVectors(n,e),Sc.crossVectors(vc,Co);let a=this.direction.dot(Sc),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;gr.subVectors(this.origin,e);const l=o*this.direction.dot(Co.crossVectors(gr,Co));if(l<0)return null;const c=o*this.direction.dot(vc.cross(gr));if(c<0||l+c>a)return null;const u=-o*gr.dot(Sc);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pm extends no{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new us,this.combine=om,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zh=new Yt,zr=new Cm,Po=new Dl,Jh=new q,Do=new q,Lo=new q,No=new q,Mc=new q,Io=new q,jh=new q,Uo=new q;class lr extends Gn{constructor(e=new bi,t=new Pm){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Io.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],d=s[l];u!==0&&(Mc.fromBufferAttribute(d,e),a?Io.addScaledVector(Mc,u):Io.addScaledVector(Mc.sub(t),u))}t.add(Io)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Po.copy(n.boundingSphere),Po.applyMatrix4(s),zr.copy(e.ray).recast(e.near),!(Po.containsPoint(zr.origin)===!1&&(zr.intersectSphere(Po,Jh)===null||zr.origin.distanceToSquared(Jh)>(e.far-e.near)**2))&&(Zh.copy(s).invert(),zr.copy(e.ray).applyMatrix4(Zh),!(n.boundingBox!==null&&zr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,zr)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],b=Math.max(p.start,h.start),w=Math.min(o.count,Math.min(p.start+p.count,h.start+h.count));for(let S=b,T=w;S<T;S+=3){const A=o.getX(S),E=o.getX(S+1),v=o.getX(S+2);i=Fo(this,m,e,n,c,u,d,A,E,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const b=o.getX(p),w=o.getX(p+1),S=o.getX(p+2);i=Fo(this,a,e,n,c,u,d,b,w,S),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],b=Math.max(p.start,h.start),w=Math.min(l.count,Math.min(p.start+p.count,h.start+h.count));for(let S=b,T=w;S<T;S+=3){const A=S,E=S+1,v=S+2;i=Fo(this,m,e,n,c,u,d,A,E,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),_=Math.min(l.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const b=p,w=p+1,S=p+2;i=Fo(this,a,e,n,c,u,d,b,w,S),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function ex(r,e,t,n,i,s,a,o){let l;if(e.side===zn?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===Ir,o),l===null)return null;Uo.copy(o),Uo.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Uo);return c<t.near||c>t.far?null:{distance:c,point:Uo.clone(),object:r}}function Fo(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,Do),r.getVertexPosition(l,Lo),r.getVertexPosition(c,No);const u=ex(r,e,t,n,Do,Lo,No,jh);if(u){const d=new q;Si.getBarycoord(jh,Do,Lo,No,d),i&&(u.uv=Si.getInterpolatedAttribute(i,o,l,c,d,new pt)),s&&(u.uv1=Si.getInterpolatedAttribute(s,o,l,c,d,new pt)),a&&(u.normal=Si.getInterpolatedAttribute(a,o,l,c,d,new q),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new q,materialIndex:0};Si.getNormal(Do,Lo,No,f.normal),u.face=f,u.barycoord=d}return u}class tx extends Ln{constructor(e=null,t=1,n=1,i,s,a,o,l,c=fn,u=fn,d,f){super(null,a,o,l,c,u,i,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const yc=new q,nx=new q,ix=new $e;class Xr{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=yc.subVectors(n,t).cross(nx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(yc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||ix.getNormalMatrix(e),i=this.coplanarPoint(yc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gr=new Dl,rx=new pt(.5,.5),Oo=new q;class Dm{constructor(e=new Xr,t=new Xr,n=new Xr,i=new Xr,s=new Xr,a=new Xr){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ui,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],d=s[5],f=s[6],h=s[7],g=s[8],_=s[9],p=s[10],m=s[11],b=s[12],w=s[13],S=s[14],T=s[15];if(i[0].setComponents(c-a,h-u,m-g,T-b).normalize(),i[1].setComponents(c+a,h+u,m+g,T+b).normalize(),i[2].setComponents(c+o,h+d,m+_,T+w).normalize(),i[3].setComponents(c-o,h-d,m-_,T-w).normalize(),n)i[4].setComponents(l,f,p,S).normalize(),i[5].setComponents(c-l,h-f,m-p,T-S).normalize();else if(i[4].setComponents(c-l,h-f,m-p,T-S).normalize(),t===Ui)i[5].setComponents(c+l,h+f,m+p,T+S).normalize();else if(t===Ml)i[5].setComponents(l,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gr)}intersectsSprite(e){Gr.center.set(0,0,0);const t=rx.distanceTo(e.center);return Gr.radius=.7071067811865476+t,Gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gr)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Oo.x=i.normal.x>0?e.max.x:e.min.x,Oo.y=i.normal.y>0?e.max.y:e.min.y,Oo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Oo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class sx extends no{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Qh=new Yt,Yu=new Cm,Bo=new Dl,ko=new q;class ax extends Gn{constructor(e=new bi,t=new sx){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Bo.copy(n.boundingSphere),Bo.applyMatrix4(i),Bo.radius+=s,e.ray.intersectsSphere(Bo)===!1)return;Qh.copy(i).invert(),Yu.copy(e.ray).applyMatrix4(Qh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),h=Math.min(c.count,a.start+a.count);for(let g=f,_=h;g<_;g++){const p=c.getX(g);ko.fromBufferAttribute(d,p),ed(ko,p,l,i,e,t,this)}}else{const f=Math.max(0,a.start),h=Math.min(d.count,a.start+a.count);for(let g=f,_=h;g<_;g++)ko.fromBufferAttribute(d,g),ed(ko,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ed(r,e,t,n,i,s,a){const o=Yu.distanceSqToPoint(r);if(o<t){const l=new q;Yu.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Lm extends Ln{constructor(e=[],t=ls,n,i,s,a,o,l,c,u){super(e,t,n,i,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ra extends Ln{constructor(e,t,n=Gi,i,s,a,o=fn,l=fn,c,u=or,d=1){if(u!==or&&u!==Jr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,i,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Nf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ox extends ra{constructor(e,t=Gi,n=ls,i,s,a=fn,o=fn,l,c=or){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Nm extends Ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class io extends bi{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],d=[];let f=0,h=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new nr(c,3)),this.setAttribute("normal",new nr(u,3)),this.setAttribute("uv",new nr(d,2));function g(_,p,m,b,w,S,T,A,E,v,y){const R=S/E,D=T/v,L=S/2,z=T/2,H=A/2,F=E+1,G=v+1;let O=0,K=0;const te=new q;for(let P=0;P<G;P++){const ae=P*D-z;for(let de=0;de<F;de++){const Ve=de*R-L;te[_]=Ve*b,te[p]=ae*w,te[m]=H,c.push(te.x,te.y,te.z),te[_]=0,te[p]=0,te[m]=A>0?1:-1,u.push(te.x,te.y,te.z),d.push(de/E),d.push(1-P/v),O+=1}}for(let P=0;P<v;P++)for(let ae=0;ae<E;ae++){const de=f+ae+F*P,Ve=f+ae+F*(P+1),Xe=f+(ae+1)+F*(P+1),Be=f+(ae+1)+F*P;l.push(de,Ve,Be),l.push(Ve,Xe,Be),K+=6}o.addGroup(h,K,y),h+=K,f+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new io(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ll extends bi{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,d=e/o,f=t/l,h=[],g=[],_=[],p=[];for(let m=0;m<u;m++){const b=m*f-a;for(let w=0;w<c;w++){const S=w*d-s;g.push(S,-b,0),_.push(0,0,1),p.push(w/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<o;b++){const w=b+c*m,S=b+c*(m+1),T=b+1+c*(m+1),A=b+1+c*m;h.push(w,S,A),h.push(S,T,A)}this.setIndex(h),this.setAttribute("position",new nr(g,3)),this.setAttribute("normal",new nr(_,3)),this.setAttribute("uv",new nr(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ll(e.width,e.height,e.widthSegments,e.heightSegments)}}function sa(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if(td(i))i.isRenderTargetTexture?(He("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(td(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function wn(r){const e={};for(let t=0;t<r.length;t++){const n=sa(r[t]);for(const i in n)e[i]=n[i]}return e}function td(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function lx(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Im(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const cx={clone:sa,merge:wn};var ux=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yi extends no{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ux,this.fragmentShader=fx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=sa(e.uniforms),this.uniformsGroups=lx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new dt().setHex(i.value);break;case"v2":this.uniforms[n].value=new pt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new q().fromArray(i.value);break;case"v4":this.uniforms[n].value=new kt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new $e().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Yt().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class hx extends yi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class dx extends no{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=b0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class px extends no{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const zo=new q,Go=new aa,Ai=new q;class Um extends Gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Yt,this.projectionMatrix=new Yt,this.projectionMatrixInverse=new Yt,this.coordinateSystem=Ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(zo,Go,Ai),Ai.x===1&&Ai.y===1&&Ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zo,Go,Ai.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(zo,Go,Ai),Ai.x===1&&Ai.y===1&&Ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zo,Go,Ai.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const _r=new q,nd=new pt,id=new pt;class vi extends Um{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ql*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xu*2*Math.atan(Math.tan(Ql*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){_r.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_r.x,_r.y).multiplyScalar(-e/_r.z),_r.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_r.x,_r.y).multiplyScalar(-e/_r.z)}getViewSize(e,t){return this.getViewBounds(e,nd,id),t.subVectors(id,nd)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ql*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class If extends Um{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ds=-90,Ls=1;class mx extends Gn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new vi(Ds,Ls,e,t);i.layers=this.layers,this.add(i);const s=new vi(Ds,Ls,e,t);s.layers=this.layers,this.add(s);const a=new vi(Ds,Ls,e,t);a.layers=this.layers,this.add(a);const o=new vi(Ds,Ls,e,t);o.layers=this.layers,this.add(o);const l=new vi(Ds,Ls,e,t);l.layers=this.layers,this.add(l);const c=new vi(Ds,Ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Ui)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ml)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class gx extends vi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Gf=class Gf{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};Gf.prototype.isMatrix2=!0;let rd=Gf;function sd(r,e,t,n){const i=_x(n);switch(t){case Sm:return r*e;case ym:return r*e/i.components*i.byteLength;case Rf:return r*e/i.components*i.byteLength;case cs:return r*e*2/i.components*i.byteLength;case Cf:return r*e*2/i.components*i.byteLength;case Mm:return r*e*3/i.components*i.byteLength;case Mi:return r*e*4/i.components*i.byteLength;case Pf:return r*e*4/i.components*i.byteLength;case tl:case nl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case il:case rl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case gu:case xu:return Math.max(r,16)*Math.max(e,8)/4;case mu:case _u:return Math.max(r,8)*Math.max(e,8)/2;case vu:case Su:case yu:case bu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Mu:case _l:case Eu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Tu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Au:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case wu:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Ru:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Cu:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Pu:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Du:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Lu:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Nu:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Iu:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Uu:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Fu:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Ou:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Bu:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case ku:case zu:case Gu:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Hu:case Vu:return Math.ceil(r/4)*Math.ceil(e/4)*8;case xl:case Wu:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _x(r){switch(r){case fi:case gm:return{byteLength:1,components:1};case Za:case _m:case ar:return{byteLength:2,components:1};case Af:case wf:return{byteLength:2,components:4};case Gi:case Tf:case Ii:return{byteLength:4,components:1};case xm:case vm:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ef}}));typeof window<"u"&&(window.__THREE__?He("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ef);function Fm(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function xx(r){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=r.HALF_FLOAT:h=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=r.SHORT;else if(c instanceof Uint32Array)h=r.UNSIGNED_INT;else if(c instanceof Int32Array)h=r.INT;else if(c instanceof Int8Array)h=r.BYTE;else if(c instanceof Uint8Array)h=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,u);else{d.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<d.length;h++){const g=d[f],_=d[h];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let h=0,g=d.length;h<g;h++){const _=d[h];r.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var vx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Mx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ex=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ax=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Rx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Px=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Nx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ix=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ux=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ox=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,kx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Gx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Hx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Wx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Xx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$x=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,jx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Qx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ev=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,iv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,av=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ov=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,fv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,hv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_v=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,vv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mv=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,yv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ev=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Av=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Cv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Dv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Iv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Fv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ov=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Bv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Hv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$v=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Kv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,eS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,nS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,aS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,oS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,dS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_S=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,SS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ES=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,AS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,RS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,CS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,PS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,LS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,NS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,IS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,US=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,BS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,GS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,WS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$S=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,KS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ZS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,JS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:vx,alphahash_pars_fragment:Sx,alphamap_fragment:Mx,alphamap_pars_fragment:yx,alphatest_fragment:bx,alphatest_pars_fragment:Ex,aomap_fragment:Tx,aomap_pars_fragment:Ax,batching_pars_vertex:wx,batching_vertex:Rx,begin_vertex:Cx,beginnormal_vertex:Px,bsdfs:Dx,iridescence_fragment:Lx,bumpmap_pars_fragment:Nx,clipping_planes_fragment:Ix,clipping_planes_pars_fragment:Ux,clipping_planes_pars_vertex:Fx,clipping_planes_vertex:Ox,color_fragment:Bx,color_pars_fragment:kx,color_pars_vertex:zx,color_vertex:Gx,common:Hx,cube_uv_reflection_fragment:Vx,defaultnormal_vertex:Wx,displacementmap_pars_vertex:Xx,displacementmap_vertex:Yx,emissivemap_fragment:qx,emissivemap_pars_fragment:$x,colorspace_fragment:Kx,colorspace_pars_fragment:Zx,envmap_fragment:Jx,envmap_common_pars_fragment:jx,envmap_pars_fragment:Qx,envmap_pars_vertex:ev,envmap_physical_pars_fragment:fv,envmap_vertex:tv,fog_vertex:nv,fog_pars_vertex:iv,fog_fragment:rv,fog_pars_fragment:sv,gradientmap_pars_fragment:av,lightmap_pars_fragment:ov,lights_lambert_fragment:lv,lights_lambert_pars_fragment:cv,lights_pars_begin:uv,lights_toon_fragment:hv,lights_toon_pars_fragment:dv,lights_phong_fragment:pv,lights_phong_pars_fragment:mv,lights_physical_fragment:gv,lights_physical_pars_fragment:_v,lights_fragment_begin:xv,lights_fragment_maps:vv,lights_fragment_end:Sv,lightprobes_pars_fragment:Mv,logdepthbuf_fragment:yv,logdepthbuf_pars_fragment:bv,logdepthbuf_pars_vertex:Ev,logdepthbuf_vertex:Tv,map_fragment:Av,map_pars_fragment:wv,map_particle_fragment:Rv,map_particle_pars_fragment:Cv,metalnessmap_fragment:Pv,metalnessmap_pars_fragment:Dv,morphinstance_vertex:Lv,morphcolor_vertex:Nv,morphnormal_vertex:Iv,morphtarget_pars_vertex:Uv,morphtarget_vertex:Fv,normal_fragment_begin:Ov,normal_fragment_maps:Bv,normal_pars_fragment:kv,normal_pars_vertex:zv,normal_vertex:Gv,normalmap_pars_fragment:Hv,clearcoat_normal_fragment_begin:Vv,clearcoat_normal_fragment_maps:Wv,clearcoat_pars_fragment:Xv,iridescence_pars_fragment:Yv,opaque_fragment:qv,packing:$v,premultiplied_alpha_fragment:Kv,project_vertex:Zv,dithering_fragment:Jv,dithering_pars_fragment:jv,roughnessmap_fragment:Qv,roughnessmap_pars_fragment:eS,shadowmap_pars_fragment:tS,shadowmap_pars_vertex:nS,shadowmap_vertex:iS,shadowmask_pars_fragment:rS,skinbase_vertex:sS,skinning_pars_vertex:aS,skinning_vertex:oS,skinnormal_vertex:lS,specularmap_fragment:cS,specularmap_pars_fragment:uS,tonemapping_fragment:fS,tonemapping_pars_fragment:hS,transmission_fragment:dS,transmission_pars_fragment:pS,uv_pars_fragment:mS,uv_pars_vertex:gS,uv_vertex:_S,worldpos_vertex:xS,background_vert:vS,background_frag:SS,backgroundCube_vert:MS,backgroundCube_frag:yS,cube_vert:bS,cube_frag:ES,depth_vert:TS,depth_frag:AS,distance_vert:wS,distance_frag:RS,equirect_vert:CS,equirect_frag:PS,linedashed_vert:DS,linedashed_frag:LS,meshbasic_vert:NS,meshbasic_frag:IS,meshlambert_vert:US,meshlambert_frag:FS,meshmatcap_vert:OS,meshmatcap_frag:BS,meshnormal_vert:kS,meshnormal_frag:zS,meshphong_vert:GS,meshphong_frag:HS,meshphysical_vert:VS,meshphysical_frag:WS,meshtoon_vert:XS,meshtoon_frag:YS,points_vert:qS,points_frag:$S,shadow_vert:KS,shadow_frag:ZS,sprite_vert:JS,sprite_frag:jS},Me={common:{diffuse:{value:new dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new q},probesMax:{value:new q},probesResolution:{value:new q}},points:{diffuse:{value:new dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new dt(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Pi={basic:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},envMapIntensity:{value:1}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},specular:{value:new dt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:wn([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:wn([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new dt(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:wn([Me.points,Me.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:wn([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:wn([Me.common,Me.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:wn([Me.sprite,Me.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distance:{uniforms:wn([Me.common,Me.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distance_vert,fragmentShader:Je.distance_frag},shadow:{uniforms:wn([Me.lights,Me.fog,{color:{value:new dt(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};Pi.physical={uniforms:wn([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new dt(0)},specularColor:{value:new dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};const Ho={r:0,b:0,g:0},QS=new Yt,Om=new $e;Om.set(-1,0,0,0,1,0,0,0,1);function eM(r,e,t,n,i,s){const a=new dt(0);let o=i===!0?0:1,l,c,u=null,d=0,f=null;function h(b){let w=b.isScene===!0?b.background:null;if(w&&w.isTexture){const S=b.backgroundBlurriness>0;w=e.get(w,S)}return w}function g(b){let w=!1;const S=h(b);S===null?p(a,o):S&&S.isColor&&(p(S,1),w=!0);const T=r.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,s):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(b,w){const S=h(w);S&&(S.isCubeTexture||S.mapping===Pl)?(c===void 0&&(c=new lr(new io(1,1,1),new yi({name:"BackgroundCubeMaterial",uniforms:sa(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(QS.makeRotationFromEuler(w.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Om),c.material.toneMapped=ot.getTransfer(S.colorSpace)!==xt,(u!==S||d!==S.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,u=S,d=S.version,f=r.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new lr(new Ll(2,2),new yi({name:"BackgroundMaterial",uniforms:sa(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:Ir,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ot.getTransfer(S.colorSpace)!==xt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,f=r.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,w){b.getRGB(Ho,Im(r)),t.buffers.color.setClear(Ho.r,Ho.g,Ho.b,w,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,w=1){a.set(b),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,p(a,o)},render:g,addToRenderList:_,dispose:m}}function tM(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(D,L,z,H,F){let G=!1;const O=d(D,H,z,L);s!==O&&(s=O,c(s.object)),G=h(D,H,z,F),G&&g(D,H,z,F),F!==null&&e.update(F,r.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,S(D,L,z,H),F!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return r.createVertexArray()}function c(D){return r.bindVertexArray(D)}function u(D){return r.deleteVertexArray(D)}function d(D,L,z,H){const F=H.wireframe===!0;let G=n[L.id];G===void 0&&(G={},n[L.id]=G);const O=D.isInstancedMesh===!0?D.id:0;let K=G[O];K===void 0&&(K={},G[O]=K);let te=K[z.id];te===void 0&&(te={},K[z.id]=te);let P=te[F];return P===void 0&&(P=f(l()),te[F]=P),P}function f(D){const L=[],z=[],H=[];for(let F=0;F<t;F++)L[F]=0,z[F]=0,H[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:H,object:D,attributes:{},index:null}}function h(D,L,z,H){const F=s.attributes,G=L.attributes;let O=0;const K=z.getAttributes();for(const te in K)if(K[te].location>=0){const ae=F[te];let de=G[te];if(de===void 0&&(te==="instanceMatrix"&&D.instanceMatrix&&(de=D.instanceMatrix),te==="instanceColor"&&D.instanceColor&&(de=D.instanceColor)),ae===void 0||ae.attribute!==de||de&&ae.data!==de.data)return!0;O++}return s.attributesNum!==O||s.index!==H}function g(D,L,z,H){const F={},G=L.attributes;let O=0;const K=z.getAttributes();for(const te in K)if(K[te].location>=0){let ae=G[te];ae===void 0&&(te==="instanceMatrix"&&D.instanceMatrix&&(ae=D.instanceMatrix),te==="instanceColor"&&D.instanceColor&&(ae=D.instanceColor));const de={};de.attribute=ae,ae&&ae.data&&(de.data=ae.data),F[te]=de,O++}s.attributes=F,s.attributesNum=O,s.index=H}function _(){const D=s.newAttributes;for(let L=0,z=D.length;L<z;L++)D[L]=0}function p(D){m(D,0)}function m(D,L){const z=s.newAttributes,H=s.enabledAttributes,F=s.attributeDivisors;z[D]=1,H[D]===0&&(r.enableVertexAttribArray(D),H[D]=1),F[D]!==L&&(r.vertexAttribDivisor(D,L),F[D]=L)}function b(){const D=s.newAttributes,L=s.enabledAttributes;for(let z=0,H=L.length;z<H;z++)L[z]!==D[z]&&(r.disableVertexAttribArray(z),L[z]=0)}function w(D,L,z,H,F,G,O){O===!0?r.vertexAttribIPointer(D,L,z,F,G):r.vertexAttribPointer(D,L,z,H,F,G)}function S(D,L,z,H){_();const F=H.attributes,G=z.getAttributes(),O=L.defaultAttributeValues;for(const K in G){const te=G[K];if(te.location>=0){let P=F[K];if(P===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(P=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(P=D.instanceColor)),P!==void 0){const ae=P.normalized,de=P.itemSize,Ve=e.get(P);if(Ve===void 0)continue;const Xe=Ve.buffer,Be=Ve.type,J=Ve.bytesPerElement,le=Be===r.INT||Be===r.UNSIGNED_INT||P.gpuType===Tf;if(P.isInterleavedBufferAttribute){const re=P.data,Re=re.stride,Oe=P.offset;if(re.isInstancedInterleavedBuffer){for(let Te=0;Te<te.locationSize;Te++)m(te.location+Te,re.meshPerAttribute);D.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Te=0;Te<te.locationSize;Te++)p(te.location+Te);r.bindBuffer(r.ARRAY_BUFFER,Xe);for(let Te=0;Te<te.locationSize;Te++)w(te.location+Te,de/te.locationSize,Be,ae,Re*J,(Oe+de/te.locationSize*Te)*J,le)}else{if(P.isInstancedBufferAttribute){for(let re=0;re<te.locationSize;re++)m(te.location+re,P.meshPerAttribute);D.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=P.meshPerAttribute*P.count)}else for(let re=0;re<te.locationSize;re++)p(te.location+re);r.bindBuffer(r.ARRAY_BUFFER,Xe);for(let re=0;re<te.locationSize;re++)w(te.location+re,de/te.locationSize,Be,ae,de*J,de/te.locationSize*re*J,le)}}else if(O!==void 0){const ae=O[K];if(ae!==void 0)switch(ae.length){case 2:r.vertexAttrib2fv(te.location,ae);break;case 3:r.vertexAttrib3fv(te.location,ae);break;case 4:r.vertexAttrib4fv(te.location,ae);break;default:r.vertexAttrib1fv(te.location,ae)}}}}b()}function T(){y();for(const D in n){const L=n[D];for(const z in L){const H=L[z];for(const F in H){const G=H[F];for(const O in G)u(G[O].object),delete G[O];delete H[F]}}delete n[D]}}function A(D){if(n[D.id]===void 0)return;const L=n[D.id];for(const z in L){const H=L[z];for(const F in H){const G=H[F];for(const O in G)u(G[O].object),delete G[O];delete H[F]}}delete n[D.id]}function E(D){for(const L in n){const z=n[L];for(const H in z){const F=z[H];if(F[D.id]===void 0)continue;const G=F[D.id];for(const O in G)u(G[O].object),delete G[O];delete F[D.id]}}}function v(D){for(const L in n){const z=n[L],H=D.isInstancedMesh===!0?D.id:0,F=z[H];if(F!==void 0){for(const G in F){const O=F[G];for(const K in O)u(O[K].object),delete O[K];delete F[G]}delete z[H],Object.keys(z).length===0&&delete n[L]}}}function y(){R(),a=!0,s!==i&&(s=i,c(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:y,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfObject:v,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:p,disableUnusedAttributes:b}}function nM(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(r.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let f=0;for(let h=0;h<u;h++)f+=c[h];t.update(f,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function iM(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(E){return!(E!==Mi&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const v=E===ar&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==fi&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ii&&!v)}function l(E){if(E==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(He("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&He("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),b=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),S=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),T=r.getParameter(r.MAX_SAMPLES),A=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:b,maxVaryings:w,maxFragmentUniforms:S,maxSamples:T,samples:A}}function rM(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Xr,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||n!==0||i;return i=f,n=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=r.get(d);if(!i||g===null||g.length===0||s&&!p)s?u(null):c();else{const b=s?0:n,w=b*4;let S=m.clippingState||null;l.value=S,S=u(g,f,w,h);for(let T=0;T!==w;++T)S[T]=t[T];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,h,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=h+_*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,S=h;w!==_;++w,S+=4)a.copy(d[w]).applyMatrix4(b,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}const Ar=4,ad=[.125,.215,.35,.446,.526,.582],qr=20,sM=256,ga=new If,od=new dt;let bc=null,Ec=0,Tc=0,Ac=!1;const aM=new q;class ld{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=aM}=s;bc=this._renderer.getRenderTarget(),Ec=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ud(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bc,Ec,Tc),this._renderer.xr.enabled=Ac,e.scissorTest=!1,Ns(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ls||e.mapping===ia?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bc=this._renderer.getRenderTarget(),Ec=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:ar,format:Mi,colorSpace:vl,depthBuffer:!1},i=cd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cd(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=oM(s)),this._blurMaterial=cM(s,e,t),this._ggxMaterial=lM(s,e,t)}return i}_compileMaterial(e){const t=new lr(new bi,e);this._renderer.compile(t,ga)}_sceneToCubeUV(e,t,n,i,s){const l=new vi(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(od),d.toneMapping=Bi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new lr(new io,new Pm({name:"PMREM.Background",side:zn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,p=_.material;let m=!1;const b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,m=!0):(p.color.copy(od),m=!0);for(let w=0;w<6;w++){const S=w%3;S===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[w],s.y,s.z)):S===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[w]));const T=this._cubeSize;Ns(i,S*T,w>2?T:0,T,T),d.setRenderTarget(i),m&&d.render(_,l),d.render(e,l)}d.toneMapping=h,d.autoClear=f,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===ls||e.mapping===ia;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=fd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ud());const s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Ns(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ga)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=0+c*1.25,h=d*f,{_lodMax:g}=this,_=this._sizeLods[n],p=3*_*(n>g-Ar?n-g+Ar:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=g-t,Ns(s,p,m,3*_,2*_),i.setRenderTarget(s),i.render(o,ga),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,Ns(e,p,m,3*_,2*_),i.setRenderTarget(e),i.render(o,ga)}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ht("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[i];d.material=c;const f=c.uniforms,h=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*qr-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):qr;p>qr&&He(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${qr}`);const m=[];let b=0;for(let E=0;E<qr;++E){const v=E/_,y=Math.exp(-v*v/2);m.push(y),E===0?b+=y:E<p&&(b+=2*y)}for(let E=0;E<m.length;E++)m[E]=m[E]/b;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-n;const S=this._sizeLods[i],T=3*S*(i>w-Ar?i-w+Ar:0),A=4*(this._cubeSize-S);Ns(t,T,A,3*S,2*S),l.setRenderTarget(t),l.render(d,ga)}}function oM(r){const e=[],t=[],n=[];let i=r;const s=r-Ar+1+ad.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>r-Ar?l=ad[a-r+Ar-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,_=3,p=2,m=1,b=new Float32Array(_*g*h),w=new Float32Array(p*g*h),S=new Float32Array(m*g*h);for(let A=0;A<h;A++){const E=A%3*2/3-1,v=A>2?0:-1,y=[E,v,0,E+2/3,v,0,E+2/3,v+1,0,E,v,0,E+2/3,v+1,0,E,v+1,0];b.set(y,_*g*A),w.set(f,p*g*A);const R=[A,A,A,A,A,A];S.set(R,m*g*A)}const T=new bi;T.setAttribute("position",new ti(b,_)),T.setAttribute("uv",new ti(w,p)),T.setAttribute("faceIndex",new ti(S,m)),n.push(new lr(T,null)),i>Ar&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function cd(r,e,t){const n=new ki(r,e,t);return n.texture.mapping=Pl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ns(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function lM(r,e,t){return new yi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:sM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Nl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function cM(r,e,t){const n=new Float32Array(qr),i=new q(0,1,0);return new yi({name:"SphericalGaussianBlur",defines:{n:qr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function ud(){return new yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function fd(){return new yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function Nl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Bm extends ki{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Lm(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new io(5,5,5),s=new yi({name:"CubemapFromEquirect",uniforms:sa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zn,blending:er});s.uniforms.tEquirect.value=t;const a=new lr(i,s),o=t.minFilter;return t.minFilter===Zr&&(t.minFilter=Mn),new mx(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}function uM(r){let e=new WeakMap,t=new WeakMap,n=null;function i(f,h=!1){return f==null?null:h?a(f):s(f)}function s(f){if(f&&f.isTexture){const h=f.mapping;if(h===Zl||h===Jl)if(e.has(f)){const g=e.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const _=new Bm(g.height);return _.fromEquirectangularTexture(r,f),e.set(f,_),f.addEventListener("dispose",c),o(_.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const h=f.mapping,g=h===Zl||h===Jl,_=h===ls||h===ia;if(g||_){let p=t.get(f);const m=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return n===null&&(n=new ld(r)),p=g?n.fromEquirectangular(f,p):n.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{const b=f.image;return g&&b&&b.height>0||_&&b&&l(b)?(n===null&&(n=new ld(r)),p=g?n.fromEquirectangular(f):n.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,h){return h===Zl?f.mapping=ls:h===Jl&&(f.mapping=ia),f}function l(f){let h=0;const g=6;for(let _=0;_<g;_++)f[_]!==void 0&&h++;return h===g}function c(f){const h=f.target;h.removeEventListener("dispose",c);const g=e.get(h);g!==void 0&&(e.delete(h),g.dispose())}function u(f){const h=f.target;h.removeEventListener("dispose",u);const g=t.get(h);g!==void 0&&(t.delete(h),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function fM(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&$s("WebGLRenderer: "+n+" extension not supported."),i}}}function hM(r,e,t,n){const i={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const h in f)e.update(f[h],r.ARRAY_BUFFER)}function c(d){const f=[],h=d.index,g=d.attributes.position;let _=0;if(g===void 0)return;if(h!==null){const b=h.array;_=h.version;for(let w=0,S=b.length;w<S;w+=3){const T=b[w+0],A=b[w+1],E=b[w+2];f.push(T,A,A,E,E,T)}}else{const b=g.array;_=g.version;for(let w=0,S=b.length/3-1;w<S;w+=3){const T=w+0,A=w+1,E=w+2;f.push(T,A,A,E,E,T)}}const p=new(g.count>=65535?Rm:wm)(f,1);p.version=_;const m=s.get(d);m&&e.remove(m),s.set(d,p)}function u(d){const f=s.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function dM(r,e,t){let n;function i(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,f){r.drawElements(n,f,s,d*a),t.update(f,n,1)}function c(d,f,h){h!==0&&(r.drawElementsInstanced(n,f,s,d*a,h),t.update(f,n,h))}function u(d,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,h);let _=0;for(let p=0;p<h;p++)_+=f[p];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function pM(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:ht("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function mM(r,e,t){const n=new WeakMap,i=new kt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let y=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();const h=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let w=0;h===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let S=o.attributes.position.count*w,T=1;S>e.maxTextureSize&&(T=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const A=new Float32Array(S*T*4*d),E=new Em(A,S,T,d);E.type=Ii,E.needsUpdate=!0;const v=w*4;for(let R=0;R<d;R++){const D=p[R],L=m[R],z=b[R],H=S*T*4*R;for(let F=0;F<D.count;F++){const G=F*v;h===!0&&(i.fromBufferAttribute(D,F),A[H+G+0]=i.x,A[H+G+1]=i.y,A[H+G+2]=i.z,A[H+G+3]=0),g===!0&&(i.fromBufferAttribute(L,F),A[H+G+4]=i.x,A[H+G+5]=i.y,A[H+G+6]=i.z,A[H+G+7]=0),_===!0&&(i.fromBufferAttribute(z,F),A[H+G+8]=i.x,A[H+G+9]=i.y,A[H+G+10]=i.z,A[H+G+11]=z.itemSize===4?i.w:1)}}f={count:d,texture:E,size:new pt(S,T)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let h=0;for(let _=0;_<c.length;_++)h+=c[_];const g=o.morphTargetsRelative?1:1-h;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function gM(r,e,t,n,i){let s=new WeakMap;function a(c){const u=i.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==u&&(h.update(),s.set(h,u))}return f}function o(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const _M={[lm]:"LINEAR_TONE_MAPPING",[cm]:"REINHARD_TONE_MAPPING",[um]:"CINEON_TONE_MAPPING",[fm]:"ACES_FILMIC_TONE_MAPPING",[dm]:"AGX_TONE_MAPPING",[pm]:"NEUTRAL_TONE_MAPPING",[hm]:"CUSTOM_TONE_MAPPING"};function xM(r,e,t,n,i,s){const a=new ki(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,depthTexture:i?new ra(e,t):void 0}),o=new ki(e,t,{type:ar,depthBuffer:!1,stencilBuffer:!1}),l=new bi;l.setAttribute("position",new nr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new nr([0,2,0,0,2,0],2));const c=new hx({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new lr(l,c),d=new If(-1,1,1,-1,0,1);let f=null,h=null,g=!1,_,p=null,m=[],b=!1;this.setSize=function(w,S){a.setSize(w,S),o.setSize(w,S);for(let T=0;T<m.length;T++){const A=m[T];A.setSize&&A.setSize(w,S)}},this.setEffects=function(w){m=w,b=m.length>0&&m[0].isRenderPass===!0;const S=a.width,T=a.height;for(let A=0;A<m.length;A++){const E=m[A];E.setSize&&E.setSize(S,T)}},this.begin=function(w,S){if(g||w.toneMapping===Bi&&m.length===0)return!1;if(p=S,S!==null){const T=S.width,A=S.height;(a.width!==T||a.height!==A)&&this.setSize(T,A)}return b===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=Bi,!0},this.hasRenderPass=function(){return b},this.end=function(w,S){w.toneMapping=_,g=!0;let T=a,A=o;for(let E=0;E<m.length;E++){const v=m[E];if(v.enabled!==!1&&(v.render(w,A,T,S),v.needsSwap!==!1)){const y=T;T=A,A=y}}if(f!==w.outputColorSpace||h!==w.toneMapping){f=w.outputColorSpace,h=w.toneMapping,c.defines={},ot.getTransfer(f)===xt&&(c.defines.SRGB_TRANSFER="");const E=_M[h];E&&(c.defines[E]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=T.texture,w.setRenderTarget(p),w.render(u,d),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const km=new Ln,qu=new ra(1,1),zm=new Em,Gm=new G0,Hm=new Lm,hd=[],dd=[],pd=new Float32Array(16),md=new Float32Array(9),gd=new Float32Array(4);function oa(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=hd[i];if(s===void 0&&(s=new Float32Array(i),hd[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function tn(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function nn(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Il(r,e){let t=dd[e];t===void 0&&(t=new Int32Array(e),dd[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function vM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function SM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2fv(this.addr,e),nn(t,e)}}function MM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;r.uniform3fv(this.addr,e),nn(t,e)}}function yM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4fv(this.addr,e),nn(t,e)}}function bM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;gd.set(n),r.uniformMatrix2fv(this.addr,!1,gd),nn(t,n)}}function EM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;md.set(n),r.uniformMatrix3fv(this.addr,!1,md),nn(t,n)}}function TM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;pd.set(n),r.uniformMatrix4fv(this.addr,!1,pd),nn(t,n)}}function AM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function wM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2iv(this.addr,e),nn(t,e)}}function RM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;r.uniform3iv(this.addr,e),nn(t,e)}}function CM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4iv(this.addr,e),nn(t,e)}}function PM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function DM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2uiv(this.addr,e),nn(t,e)}}function LM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;r.uniform3uiv(this.addr,e),nn(t,e)}}function NM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4uiv(this.addr,e),nn(t,e)}}function IM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(qu.compareFunction=t.isReversedDepthBuffer()?Lf:Df,s=qu):s=km,t.setTexture2D(e||s,i)}function UM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Gm,i)}function FM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Hm,i)}function OM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||zm,i)}function BM(r){switch(r){case 5126:return vM;case 35664:return SM;case 35665:return MM;case 35666:return yM;case 35674:return bM;case 35675:return EM;case 35676:return TM;case 5124:case 35670:return AM;case 35667:case 35671:return wM;case 35668:case 35672:return RM;case 35669:case 35673:return CM;case 5125:return PM;case 36294:return DM;case 36295:return LM;case 36296:return NM;case 35678:case 36198:case 36298:case 36306:case 35682:return IM;case 35679:case 36299:case 36307:return UM;case 35680:case 36300:case 36308:case 36293:return FM;case 36289:case 36303:case 36311:case 36292:return OM}}function kM(r,e){r.uniform1fv(this.addr,e)}function zM(r,e){const t=oa(e,this.size,2);r.uniform2fv(this.addr,t)}function GM(r,e){const t=oa(e,this.size,3);r.uniform3fv(this.addr,t)}function HM(r,e){const t=oa(e,this.size,4);r.uniform4fv(this.addr,t)}function VM(r,e){const t=oa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function WM(r,e){const t=oa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function XM(r,e){const t=oa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function YM(r,e){r.uniform1iv(this.addr,e)}function qM(r,e){r.uniform2iv(this.addr,e)}function $M(r,e){r.uniform3iv(this.addr,e)}function KM(r,e){r.uniform4iv(this.addr,e)}function ZM(r,e){r.uniform1uiv(this.addr,e)}function JM(r,e){r.uniform2uiv(this.addr,e)}function jM(r,e){r.uniform3uiv(this.addr,e)}function QM(r,e){r.uniform4uiv(this.addr,e)}function ey(r,e,t){const n=this.cache,i=e.length,s=Il(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=qu:a=km;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function ty(r,e,t){const n=this.cache,i=e.length,s=Il(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Gm,s[a])}function ny(r,e,t){const n=this.cache,i=e.length,s=Il(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Hm,s[a])}function iy(r,e,t){const n=this.cache,i=e.length,s=Il(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||zm,s[a])}function ry(r){switch(r){case 5126:return kM;case 35664:return zM;case 35665:return GM;case 35666:return HM;case 35674:return VM;case 35675:return WM;case 35676:return XM;case 5124:case 35670:return YM;case 35667:case 35671:return qM;case 35668:case 35672:return $M;case 35669:case 35673:return KM;case 5125:return ZM;case 36294:return JM;case 36295:return jM;case 36296:return QM;case 35678:case 36198:case 36298:case 36306:case 35682:return ey;case 35679:case 36299:case 36307:return ty;case 35680:case 36300:case 36308:case 36293:return ny;case 36289:case 36303:case 36311:case 36292:return iy}}class sy{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=BM(t.type)}}class ay{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ry(t.type)}}class oy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const wc=/(\w+)(\])?(\[|\.)?/g;function _d(r,e){r.seq.push(e),r.map[e.id]=e}function ly(r,e,t){const n=r.name,i=n.length;for(wc.lastIndex=0;;){const s=wc.exec(n),a=wc.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){_d(t,c===void 0?new sy(o,r,e):new ay(o,r,e));break}else{let d=t.map[o];d===void 0&&(d=new oy(o),_d(t,d)),t=d}}}class sl{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ly(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function xd(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const cy=37297;let uy=0;function fy(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const vd=new $e;function hy(r){ot._getMatrix(vd,ot.workingColorSpace,r);const e=`mat3( ${vd.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(r)){case Sl:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Sd(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+fy(r.getShaderSource(e),o)}else return s}function dy(r,e){const t=hy(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const py={[lm]:"Linear",[cm]:"Reinhard",[um]:"Cineon",[fm]:"ACESFilmic",[dm]:"AgX",[pm]:"Neutral",[hm]:"Custom"};function my(r,e){const t=py[e];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Vo=new q;function gy(){ot.getLuminanceCoefficients(Vo);const r=Vo.x.toFixed(4),e=Vo.y.toFixed(4),t=Vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _y(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Aa).join(`
`)}function xy(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function vy(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Aa(r){return r!==""}function Md(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function yd(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Sy=/^[ \t]*#include +<([\w\d./]+)>/gm;function $u(r){return r.replace(Sy,yy)}const My=new Map;function yy(r,e){let t=Je[e];if(t===void 0){const n=My.get(e);if(n!==void 0)t=Je[n],He('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return $u(t)}const by=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bd(r){return r.replace(by,Ey)}function Ey(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Ed(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ty={[el]:"SHADOWMAP_TYPE_PCF",[Ta]:"SHADOWMAP_TYPE_VSM"};function Ay(r){return Ty[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const wy={[ls]:"ENVMAP_TYPE_CUBE",[ia]:"ENVMAP_TYPE_CUBE",[Pl]:"ENVMAP_TYPE_CUBE_UV"};function Ry(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":wy[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const Cy={[ia]:"ENVMAP_MODE_REFRACTION"};function Py(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":Cy[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Dy={[om]:"ENVMAP_BLENDING_MULTIPLY",[S0]:"ENVMAP_BLENDING_MIX",[M0]:"ENVMAP_BLENDING_ADD"};function Ly(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":Dy[r.combine]||"ENVMAP_BLENDING_NONE"}function Ny(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Iy(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Ay(t),c=Ry(t),u=Py(t),d=Ly(t),f=Ny(t),h=_y(t),g=xy(s),_=i.createProgram();let p,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Aa).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Aa).join(`
`),m.length>0&&(m+=`
`)):(p=[Ed(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Aa).join(`
`),m=[Ed(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bi?"#define TONE_MAPPING":"",t.toneMapping!==Bi?Je.tonemapping_pars_fragment:"",t.toneMapping!==Bi?my("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,dy("linearToOutputTexel",t.outputColorSpace),gy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Aa).join(`
`)),a=$u(a),a=Md(a,t),a=yd(a,t),o=$u(o),o=Md(o,t),o=yd(o,t),a=bd(a),o=bd(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Fh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=b+p+a,S=b+m+o,T=xd(i,i.VERTEX_SHADER,w),A=xd(i,i.FRAGMENT_SHADER,S);i.attachShader(_,T),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function E(D){if(r.debug.checkShaderErrors){const L=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(T)||"",H=i.getShaderInfoLog(A)||"",F=L.trim(),G=z.trim(),O=H.trim();let K=!0,te=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(K=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,T,A);else{const P=Sd(i,T,"vertex"),ae=Sd(i,A,"fragment");ht("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+F+`
`+P+`
`+ae)}else F!==""?He("WebGLProgram: Program Info Log:",F):(G===""||O==="")&&(te=!1);te&&(D.diagnostics={runnable:K,programLog:F,vertexShader:{log:G,prefix:p},fragmentShader:{log:O,prefix:m}})}i.deleteShader(T),i.deleteShader(A),v=new sl(i,_),y=vy(i,_)}let v;this.getUniforms=function(){return v===void 0&&E(this),v};let y;this.getAttributes=function(){return y===void 0&&E(this),y};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(_,cy)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=uy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=A,this}let Uy=0;class Fy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Oy(e),t.set(e,n)),n}}class Oy{constructor(e){this.id=Uy++,this.code=e,this.usedTimes=0}}function By(r){return r===cs||r===_l||r===xl}function ky(r,e,t,n,i,s){const a=new Tm,o=new Fy,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer;let f=n.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,y,R,D,L,z){const H=D.fog,F=L.geometry,G=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,O=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,K=e.get(v.envMap||G,O),te=K&&K.mapping===Pl?K.image.height:null,P=h[v.type];v.precision!==null&&(f=n.getMaxPrecision(v.precision),f!==v.precision&&He("WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const ae=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,de=ae!==void 0?ae.length:0;let Ve=0;F.morphAttributes.position!==void 0&&(Ve=1),F.morphAttributes.normal!==void 0&&(Ve=2),F.morphAttributes.color!==void 0&&(Ve=3);let Xe,Be,J,le;if(P){const ie=Pi[P];Xe=ie.vertexShader,Be=ie.fragmentShader}else{Xe=v.vertexShader,Be=v.fragmentShader;const ie=o.getVertexShaderStage(v),Ue=o.getFragmentShaderStage(v);o.update(v,ie,Ue),J=ie.id,le=Ue.id}const re=r.getRenderTarget(),Re=r.state.buffers.depth.getReversed(),Oe=L.isInstancedMesh===!0,Te=L.isBatchedMesh===!0,rt=!!v.map,be=!!v.matcap,ke=!!K,We=!!v.aoMap,Ge=!!v.lightMap,Y=!!v.bumpMap&&v.wireframe===!1,ut=!!v.normalMap,vt=!!v.displacementMap,At=!!v.emissiveMap,Ye=!!v.metalnessMap,mt=!!v.roughnessMap,U=v.anisotropy>0,Ft=v.clearcoat>0,ze=v.dispersion>0,C=v.iridescence>0,x=v.sheen>0,k=v.transmission>0,W=U&&!!v.anisotropyMap,Z=Ft&&!!v.clearcoatMap,fe=Ft&&!!v.clearcoatNormalMap,ce=Ft&&!!v.clearcoatRoughnessMap,j=C&&!!v.iridescenceMap,Q=C&&!!v.iridescenceThicknessMap,me=x&&!!v.sheenColorMap,we=x&&!!v.sheenRoughnessMap,ge=!!v.specularMap,pe=!!v.specularColorMap,ue=!!v.specularIntensityMap,De=k&&!!v.transmissionMap,Ie=k&&!!v.thicknessMap,I=!!v.gradientMap,he=!!v.alphaMap,ee=v.alphaTest>0,_e=!!v.alphaHash,xe=!!v.extensions;let ne=Bi;v.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ne=r.toneMapping);const se={shaderID:P,shaderType:v.type,shaderName:v.name,vertexShader:Xe,fragmentShader:Be,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:le,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Te,batchingColor:Te&&L._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&L.instanceColor!==null,instancingMorph:Oe&&L.morphTexture!==null,outputColorSpace:re===null?r.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:rt,matcap:be,envMap:ke,envMapMode:ke&&K.mapping,envMapCubeUVHeight:te,aoMap:We,lightMap:Ge,bumpMap:Y,normalMap:ut,displacementMap:vt,emissiveMap:At,normalMapObjectSpace:ut&&v.normalMapType===E0,normalMapTangentSpace:ut&&v.normalMapType===Nh,packedNormalMap:ut&&v.normalMapType===Nh&&By(v.normalMap.format),metalnessMap:Ye,roughnessMap:mt,anisotropy:U,anisotropyMap:W,clearcoat:Ft,clearcoatMap:Z,clearcoatNormalMap:fe,clearcoatRoughnessMap:ce,dispersion:ze,iridescence:C,iridescenceMap:j,iridescenceThicknessMap:Q,sheen:x,sheenColorMap:me,sheenRoughnessMap:we,specularMap:ge,specularColorMap:pe,specularIntensityMap:ue,transmission:k,transmissionMap:De,thicknessMap:Ie,gradientMap:I,opaque:v.transparent===!1&&v.blending===qs&&v.alphaToCoverage===!1,alphaMap:he,alphaTest:ee,alphaHash:_e,combine:v.combine,mapUv:rt&&g(v.map.channel),aoMapUv:We&&g(v.aoMap.channel),lightMapUv:Ge&&g(v.lightMap.channel),bumpMapUv:Y&&g(v.bumpMap.channel),normalMapUv:ut&&g(v.normalMap.channel),displacementMapUv:vt&&g(v.displacementMap.channel),emissiveMapUv:At&&g(v.emissiveMap.channel),metalnessMapUv:Ye&&g(v.metalnessMap.channel),roughnessMapUv:mt&&g(v.roughnessMap.channel),anisotropyMapUv:W&&g(v.anisotropyMap.channel),clearcoatMapUv:Z&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:fe&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:we&&g(v.sheenRoughnessMap.channel),specularMapUv:ge&&g(v.specularMap.channel),specularColorMapUv:pe&&g(v.specularColorMap.channel),specularIntensityMapUv:ue&&g(v.specularIntensityMap.channel),transmissionMapUv:De&&g(v.transmissionMap.channel),thicknessMapUv:Ie&&g(v.thicknessMap.channel),alphaMapUv:he&&g(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ut||U),vertexNormals:!!F.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(rt||he),fog:!!H,useFog:v.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||F.attributes.normal===void 0&&ut===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Re,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:Ve,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:ne,decodeVideoTexture:rt&&v.map.isVideoTexture===!0&&ot.getTransfer(v.map.colorSpace)===xt,decodeVideoTextureEmissive:At&&v.emissiveMap.isVideoTexture===!0&&ot.getTransfer(v.emissiveMap.colorSpace)===xt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Zi,flipSided:v.side===zn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:xe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&v.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function p(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const R in v.defines)y.push(R),y.push(v.defines[R]);return v.isRawShaderMaterial===!1&&(m(y,v),b(y,v),y.push(r.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function m(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function b(v,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function w(v){const y=h[v.type];let R;if(y){const D=Pi[y];R=cx.clone(D.uniforms)}else R=v.uniforms;return R}function S(v,y){let R=u.get(y);return R!==void 0?++R.usedTimes:(R=new Iy(r,y,v,i),c.push(R),u.set(y,R)),R}function T(v){if(--v.usedTimes===0){const y=c.indexOf(v);c[y]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function A(v){o.remove(v)}function E(){o.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:w,acquireProgram:S,releaseProgram:T,releaseShaderCache:A,programs:c,dispose:E}}function zy(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function Gy(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Td(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Ad(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function o(f,h,g,_,p,m){let b=r[e];return b===void 0?(b={id:f.id,object:f,geometry:h,material:g,materialVariant:a(f),groupOrder:_,renderOrder:f.renderOrder,z:p,group:m},r[e]=b):(b.id=f.id,b.object=f,b.geometry=h,b.material=g,b.materialVariant=a(f),b.groupOrder=_,b.renderOrder=f.renderOrder,b.z=p,b.group=m),e++,b}function l(f,h,g,_,p,m){const b=o(f,h,g,_,p,m);g.transmission>0?n.push(b):g.transparent===!0?i.push(b):t.push(b)}function c(f,h,g,_,p,m){const b=o(f,h,g,_,p,m);g.transmission>0?n.unshift(b):g.transparent===!0?i.unshift(b):t.unshift(b)}function u(f,h,g){t.length>1&&t.sort(f||Gy),n.length>1&&n.sort(h||Td),i.length>1&&i.sort(h||Td),g&&(t.reverse(),n.reverse(),i.reverse())}function d(){for(let f=e,h=r.length;f<h;f++){const g=r[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:d,sort:u}}function Hy(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Ad,r.set(n,[a])):i>=s.length?(a=new Ad,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function Vy(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new q,color:new dt};break;case"SpotLight":t={position:new q,direction:new q,color:new dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new dt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new dt,groundColor:new dt};break;case"RectAreaLight":t={color:new dt,position:new q,halfWidth:new q,halfHeight:new q};break}return r[e.id]=t,t}}}function Wy(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Xy=0;function Yy(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qy(r){const e=new Vy,t=Wy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new q);const i=new q,s=new Yt,a=new Yt;function o(c){let u=0,d=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let h=0,g=0,_=0,p=0,m=0,b=0,w=0,S=0,T=0,A=0,E=0;c.sort(Yy);for(let y=0,R=c.length;y<R;y++){const D=c[y],L=D.color,z=D.intensity,H=D.distance;let F=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===cs?F=D.shadow.map.texture:F=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=L.r*z,d+=L.g*z,f+=L.b*z;else if(D.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(D.sh.coefficients[G],z);E++}else if(D.isDirectionalLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const O=D.shadow,K=t.get(D);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,n.directionalShadow[h]=K,n.directionalShadowMap[h]=F,n.directionalShadowMatrix[h]=D.shadow.matrix,b++}n.directional[h]=G,h++}else if(D.isSpotLight){const G=e.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(L).multiplyScalar(z),G.distance=H,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,n.spot[_]=G;const O=D.shadow;if(D.map&&(n.spotLightMap[T]=D.map,T++,O.updateMatrices(D),D.castShadow&&A++),n.spotLightMatrix[_]=O.matrix,D.castShadow){const K=t.get(D);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,n.spotShadow[_]=K,n.spotShadowMap[_]=F,S++}_++}else if(D.isRectAreaLight){const G=e.get(D);G.color.copy(L).multiplyScalar(z),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),n.rectArea[p]=G,p++}else if(D.isPointLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){const O=D.shadow,K=t.get(D);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,K.shadowCameraNear=O.camera.near,K.shadowCameraFar=O.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=D.shadow.matrix,w++}n.point[g]=G,g++}else if(D.isHemisphereLight){const G=e.get(D);G.skyColor.copy(D.color).multiplyScalar(z),G.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[m]=G,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Me.LTC_FLOAT_1,n.rectAreaLTC2=Me.LTC_FLOAT_2):(n.rectAreaLTC1=Me.LTC_HALF_1,n.rectAreaLTC2=Me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const v=n.hash;(v.directionalLength!==h||v.pointLength!==g||v.spotLength!==_||v.rectAreaLength!==p||v.hemiLength!==m||v.numDirectionalShadows!==b||v.numPointShadows!==w||v.numSpotShadows!==S||v.numSpotMaps!==T||v.numLightProbes!==E)&&(n.directional.length=h,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=S+T-A,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=E,v.directionalLength=h,v.pointLength=g,v.spotLength=_,v.rectAreaLength=p,v.hemiLength=m,v.numDirectionalShadows=b,v.numPointShadows=w,v.numSpotShadows=S,v.numSpotMaps=T,v.numLightProbes=E,n.version=Xy++)}function l(c,u){let d=0,f=0,h=0,g=0,_=0;const p=u.matrixWorldInverse;for(let m=0,b=c.length;m<b;m++){const w=c[m];if(w.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),d++}else if(w.isSpotLight){const S=n.spot[h];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),h++}else if(w.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),a.identity(),s.copy(w.matrixWorld),s.premultiply(p),a.extractRotation(s),S.halfWidth.set(w.width*.5,0,0),S.halfHeight.set(0,w.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),f++}else if(w.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(w.matrixWorld),S.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:n}}function wd(r){const e=new qy(r),t=[],n=[],i=[];function s(f){d.camera=f,t.length=0,n.length=0,i.length=0}function a(f){t.push(f)}function o(f){n.push(f)}function l(f){i.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function $y(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new wd(r),e.set(i,[o])):s>=a.length?(o=new wd(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Ky=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Jy=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],jy=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],Rd=new Yt,_a=new q,Rc=new q;function Qy(r,e,t){let n=new Dm;const i=new pt,s=new pt,a=new kt,o=new dx,l=new px,c={},u=t.maxTextureSize,d={[Ir]:zn,[zn]:Ir,[Zi]:Zi},f=new yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:Ky,fragmentShader:Zy}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const g=new bi;g.setAttribute("position",new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new lr(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=el;let m=this.type;this.render=function(A,E,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;this.type===t0&&(He("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=el);const y=r.getRenderTarget(),R=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),L=r.state;L.setBlending(er),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const z=m!==this.type;z&&E.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(F=>F.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,F=A.length;H<F;H++){const G=A[H],O=G.shadow;if(O===void 0){He("WebGLShadowMap:",G,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const K=O.getFrameExtents();i.multiply(K),s.copy(O.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/K.x),i.x=s.x*K.x,O.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/K.y),i.y=s.y*K.y,O.mapSize.y=s.y));const te=r.state.buffers.depth.getReversed();if(O.camera._reversedDepth=te,O.map===null||z===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ta){if(G.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new ki(i.x,i.y,{format:cs,type:ar,minFilter:Mn,magFilter:Mn,generateMipmaps:!1}),O.map.texture.name=G.name+".shadowMap",O.map.depthTexture=new ra(i.x,i.y,Ii),O.map.depthTexture.name=G.name+".shadowMapDepth",O.map.depthTexture.format=or,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=fn,O.map.depthTexture.magFilter=fn}else G.isPointLight?(O.map=new Bm(i.x),O.map.depthTexture=new ox(i.x,Gi)):(O.map=new ki(i.x,i.y),O.map.depthTexture=new ra(i.x,i.y,Gi)),O.map.depthTexture.name=G.name+".shadowMap",O.map.depthTexture.format=or,this.type===el?(O.map.depthTexture.compareFunction=te?Lf:Df,O.map.depthTexture.minFilter=Mn,O.map.depthTexture.magFilter=Mn):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=fn,O.map.depthTexture.magFilter=fn);O.camera.updateProjectionMatrix()}const P=O.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<P;ae++){if(O.map.isWebGLCubeRenderTarget)r.setRenderTarget(O.map,ae),r.clear();else{ae===0&&(r.setRenderTarget(O.map),r.clear());const de=O.getViewport(ae);a.set(s.x*de.x,s.y*de.y,s.x*de.z,s.y*de.w),L.viewport(a)}if(G.isPointLight){const de=O.camera,Ve=O.matrix,Xe=G.distance||de.far;Xe!==de.far&&(de.far=Xe,de.updateProjectionMatrix()),_a.setFromMatrixPosition(G.matrixWorld),de.position.copy(_a),Rc.copy(de.position),Rc.add(Jy[ae]),de.up.copy(jy[ae]),de.lookAt(Rc),de.updateMatrixWorld(),Ve.makeTranslation(-_a.x,-_a.y,-_a.z),Rd.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Rd,de.coordinateSystem,de.reversedDepth)}else O.updateMatrices(G);n=O.getFrustum(),S(E,v,O.camera,G,this.type)}O.isPointLightShadow!==!0&&this.type===Ta&&b(O,v),O.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(y,R,D)};function b(A,E){const v=e.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,h.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ki(i.x,i.y,{format:cs,type:ar})),f.uniforms.shadow_pass.value=A.map.depthTexture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(E,null,v,f,_,null),h.uniforms.shadow_pass.value=A.mapPass.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(E,null,v,h,_,null)}function w(A,E,v,y){let R=null;const D=v.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)R=D;else if(R=v.isPointLight===!0?l:o,r.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const L=R.uuid,z=E.uuid;let H=c[L];H===void 0&&(H={},c[L]=H);let F=H[z];F===void 0&&(F=R.clone(),H[z]=F,E.addEventListener("dispose",T)),R=F}if(R.visible=E.visible,R.wireframe=E.wireframe,y===Ta?R.side=E.shadowSide!==null?E.shadowSide:E.side:R.side=E.shadowSide!==null?E.shadowSide:d[E.side],R.alphaMap=E.alphaMap,R.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,R.map=E.map,R.clipShadows=E.clipShadows,R.clippingPlanes=E.clippingPlanes,R.clipIntersection=E.clipIntersection,R.displacementMap=E.displacementMap,R.displacementScale=E.displacementScale,R.displacementBias=E.displacementBias,R.wireframeLinewidth=E.wireframeLinewidth,R.linewidth=E.linewidth,v.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const L=r.properties.get(R);L.light=v}return R}function S(A,E,v,y,R){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&R===Ta)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,A.matrixWorld);const z=e.update(A),H=A.material;if(Array.isArray(H)){const F=z.groups;for(let G=0,O=F.length;G<O;G++){const K=F[G],te=H[K.materialIndex];if(te&&te.visible){const P=w(A,te,y,R);A.onBeforeShadow(r,A,E,v,z,P,K),r.renderBufferDirect(v,null,z,P,A,K),A.onAfterShadow(r,A,E,v,z,P,K)}}}else if(H.visible){const F=w(A,H,y,R);A.onBeforeShadow(r,A,E,v,z,F,null),r.renderBufferDirect(v,null,z,F,A,null),A.onAfterShadow(r,A,E,v,z,F,null)}}const L=A.children;for(let z=0,H=L.length;z<H;z++)S(L[z],E,v,y,R)}function T(A){A.target.removeEventListener("dispose",T);for(const v in c){const y=c[v],R=A.target.uuid;R in y&&(y[R].dispose(),delete y[R])}}}function eb(r,e){function t(){let I=!1;const he=new kt;let ee=null;const _e=new kt(0,0,0,0);return{setMask:function(xe){ee!==xe&&!I&&(r.colorMask(xe,xe,xe,xe),ee=xe)},setLocked:function(xe){I=xe},setClear:function(xe,ne,se,ie,Ue){Ue===!0&&(xe*=ie,ne*=ie,se*=ie),he.set(xe,ne,se,ie),_e.equals(he)===!1&&(r.clearColor(xe,ne,se,ie),_e.copy(he))},reset:function(){I=!1,ee=null,_e.set(-1,0,0,0)}}}function n(){let I=!1,he=!1,ee=null,_e=null,xe=null;return{setReversed:function(ne){if(he!==ne){const se=e.get("EXT_clip_control");ne?se.clipControlEXT(se.LOWER_LEFT_EXT,se.ZERO_TO_ONE_EXT):se.clipControlEXT(se.LOWER_LEFT_EXT,se.NEGATIVE_ONE_TO_ONE_EXT),he=ne;const ie=xe;xe=null,this.setClear(ie)}},getReversed:function(){return he},setTest:function(ne){ne?re(r.DEPTH_TEST):Re(r.DEPTH_TEST)},setMask:function(ne){ee!==ne&&!I&&(r.depthMask(ne),ee=ne)},setFunc:function(ne){if(he&&(ne=I0[ne]),_e!==ne){switch(ne){case au:r.depthFunc(r.NEVER);break;case ou:r.depthFunc(r.ALWAYS);break;case lu:r.depthFunc(r.LESS);break;case na:r.depthFunc(r.LEQUAL);break;case cu:r.depthFunc(r.EQUAL);break;case uu:r.depthFunc(r.GEQUAL);break;case fu:r.depthFunc(r.GREATER);break;case hu:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}_e=ne}},setLocked:function(ne){I=ne},setClear:function(ne){xe!==ne&&(xe=ne,he&&(ne=1-ne),r.clearDepth(ne))},reset:function(){I=!1,ee=null,_e=null,xe=null,he=!1}}}function i(){let I=!1,he=null,ee=null,_e=null,xe=null,ne=null,se=null,ie=null,Ue=null;return{setTest:function(oe){I||(oe?re(r.STENCIL_TEST):Re(r.STENCIL_TEST))},setMask:function(oe){he!==oe&&!I&&(r.stencilMask(oe),he=oe)},setFunc:function(oe,Fe,Ce){(ee!==oe||_e!==Fe||xe!==Ce)&&(r.stencilFunc(oe,Fe,Ce),ee=oe,_e=Fe,xe=Ce)},setOp:function(oe,Fe,Ce){(ne!==oe||se!==Fe||ie!==Ce)&&(r.stencilOp(oe,Fe,Ce),ne=oe,se=Fe,ie=Ce)},setLocked:function(oe){I=oe},setClear:function(oe){Ue!==oe&&(r.clearStencil(oe),Ue=oe)},reset:function(){I=!1,he=null,ee=null,_e=null,xe=null,ne=null,se=null,ie=null,Ue=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},d={},f={},h=new WeakMap,g=[],_=null,p=!1,m=null,b=null,w=null,S=null,T=null,A=null,E=null,v=new dt(0,0,0),y=0,R=!1,D=null,L=null,z=null,H=null,F=null;const G=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,K=0;const te=r.getParameter(r.VERSION);te.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(te)[1]),O=K>=1):te.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),O=K>=2);let P=null,ae={};const de=r.getParameter(r.SCISSOR_BOX),Ve=r.getParameter(r.VIEWPORT),Xe=new kt().fromArray(de),Be=new kt().fromArray(Ve);function J(I,he,ee,_e){const xe=new Uint8Array(4),ne=r.createTexture();r.bindTexture(I,ne),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let se=0;se<ee;se++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(he,0,r.RGBA,1,1,_e,0,r.RGBA,r.UNSIGNED_BYTE,xe):r.texImage2D(he+se,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,xe);return ne}const le={};le[r.TEXTURE_2D]=J(r.TEXTURE_2D,r.TEXTURE_2D,1),le[r.TEXTURE_CUBE_MAP]=J(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[r.TEXTURE_2D_ARRAY]=J(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),le[r.TEXTURE_3D]=J(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(r.DEPTH_TEST),a.setFunc(na),Y(!1),ut(Ph),re(r.CULL_FACE),We(er);function re(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function Re(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function Oe(I,he){return f[I]!==he?(r.bindFramebuffer(I,he),f[I]=he,I===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=he),I===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=he),!0):!1}function Te(I,he){let ee=g,_e=!1;if(I){ee=h.get(he),ee===void 0&&(ee=[],h.set(he,ee));const xe=I.textures;if(ee.length!==xe.length||ee[0]!==r.COLOR_ATTACHMENT0){for(let ne=0,se=xe.length;ne<se;ne++)ee[ne]=r.COLOR_ATTACHMENT0+ne;ee.length=xe.length,_e=!0}}else ee[0]!==r.BACK&&(ee[0]=r.BACK,_e=!0);_e&&r.drawBuffers(ee)}function rt(I){return _!==I?(r.useProgram(I),_=I,!0):!1}const be={[Yr]:r.FUNC_ADD,[i0]:r.FUNC_SUBTRACT,[r0]:r.FUNC_REVERSE_SUBTRACT};be[s0]=r.MIN,be[a0]=r.MAX;const ke={[o0]:r.ZERO,[l0]:r.ONE,[c0]:r.SRC_COLOR,[ru]:r.SRC_ALPHA,[m0]:r.SRC_ALPHA_SATURATE,[d0]:r.DST_COLOR,[f0]:r.DST_ALPHA,[u0]:r.ONE_MINUS_SRC_COLOR,[su]:r.ONE_MINUS_SRC_ALPHA,[p0]:r.ONE_MINUS_DST_COLOR,[h0]:r.ONE_MINUS_DST_ALPHA,[g0]:r.CONSTANT_COLOR,[_0]:r.ONE_MINUS_CONSTANT_COLOR,[x0]:r.CONSTANT_ALPHA,[v0]:r.ONE_MINUS_CONSTANT_ALPHA};function We(I,he,ee,_e,xe,ne,se,ie,Ue,oe){if(I===er){p===!0&&(Re(r.BLEND),p=!1);return}if(p===!1&&(re(r.BLEND),p=!0),I!==n0){if(I!==m||oe!==R){if((b!==Yr||T!==Yr)&&(r.blendEquation(r.FUNC_ADD),b=Yr,T=Yr),oe)switch(I){case qs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case iu:r.blendFunc(r.ONE,r.ONE);break;case Dh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Lh:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:ht("WebGLState: Invalid blending: ",I);break}else switch(I){case qs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case iu:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Dh:ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lh:ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ht("WebGLState: Invalid blending: ",I);break}w=null,S=null,A=null,E=null,v.set(0,0,0),y=0,m=I,R=oe}return}xe=xe||he,ne=ne||ee,se=se||_e,(he!==b||xe!==T)&&(r.blendEquationSeparate(be[he],be[xe]),b=he,T=xe),(ee!==w||_e!==S||ne!==A||se!==E)&&(r.blendFuncSeparate(ke[ee],ke[_e],ke[ne],ke[se]),w=ee,S=_e,A=ne,E=se),(ie.equals(v)===!1||Ue!==y)&&(r.blendColor(ie.r,ie.g,ie.b,Ue),v.copy(ie),y=Ue),m=I,R=!1}function Ge(I,he){I.side===Zi?Re(r.CULL_FACE):re(r.CULL_FACE);let ee=I.side===zn;he&&(ee=!ee),Y(ee),I.blending===qs&&I.transparent===!1?We(er):We(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const _e=I.stencilWrite;o.setTest(_e),_e&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),At(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):Re(r.SAMPLE_ALPHA_TO_COVERAGE)}function Y(I){D!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),D=I)}function ut(I){I!==Q_?(re(r.CULL_FACE),I!==L&&(I===Ph?r.cullFace(r.BACK):I===e0?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Re(r.CULL_FACE),L=I}function vt(I){I!==z&&(O&&r.lineWidth(I),z=I)}function At(I,he,ee){I?(re(r.POLYGON_OFFSET_FILL),(H!==he||F!==ee)&&(H=he,F=ee,a.getReversed()&&(he=-he),r.polygonOffset(he,ee))):Re(r.POLYGON_OFFSET_FILL)}function Ye(I){I?re(r.SCISSOR_TEST):Re(r.SCISSOR_TEST)}function mt(I){I===void 0&&(I=r.TEXTURE0+G-1),P!==I&&(r.activeTexture(I),P=I)}function U(I,he,ee){ee===void 0&&(P===null?ee=r.TEXTURE0+G-1:ee=P);let _e=ae[ee];_e===void 0&&(_e={type:void 0,texture:void 0},ae[ee]=_e),(_e.type!==I||_e.texture!==he)&&(P!==ee&&(r.activeTexture(ee),P=ee),r.bindTexture(I,he||le[I]),_e.type=I,_e.texture=he)}function Ft(){const I=ae[P];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function ze(){try{r.compressedTexImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function C(){try{r.compressedTexImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function x(){try{r.texSubImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function k(){try{r.texSubImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function W(){try{r.compressedTexSubImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function Z(){try{r.compressedTexSubImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function fe(){try{r.texStorage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function ce(){try{r.texStorage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function j(){try{r.texImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function Q(){try{r.texImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function me(I){return d[I]!==void 0?d[I]:r.getParameter(I)}function we(I,he){d[I]!==he&&(r.pixelStorei(I,he),d[I]=he)}function ge(I){Xe.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),Xe.copy(I))}function pe(I){Be.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),Be.copy(I))}function ue(I,he){let ee=c.get(he);ee===void 0&&(ee=new WeakMap,c.set(he,ee));let _e=ee.get(I);_e===void 0&&(_e=r.getUniformBlockIndex(he,I.name),ee.set(I,_e))}function De(I,he){const _e=c.get(he).get(I);l.get(he)!==_e&&(r.uniformBlockBinding(he,_e,I.__bindingPointIndex),l.set(he,_e))}function Ie(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),u={},d={},P=null,ae={},f={},h=new WeakMap,g=[],_=null,p=!1,m=null,b=null,w=null,S=null,T=null,A=null,E=null,v=new dt(0,0,0),y=0,R=!1,D=null,L=null,z=null,H=null,F=null,Xe.set(0,0,r.canvas.width,r.canvas.height),Be.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:re,disable:Re,bindFramebuffer:Oe,drawBuffers:Te,useProgram:rt,setBlending:We,setMaterial:Ge,setFlipSided:Y,setCullFace:ut,setLineWidth:vt,setPolygonOffset:At,setScissorTest:Ye,activeTexture:mt,bindTexture:U,unbindTexture:Ft,compressedTexImage2D:ze,compressedTexImage3D:C,texImage2D:j,texImage3D:Q,pixelStorei:we,getParameter:me,updateUBOMapping:ue,uniformBlockBinding:De,texStorage2D:fe,texStorage3D:ce,texSubImage2D:x,texSubImage3D:k,compressedTexSubImage2D:W,compressedTexSubImage3D:Z,scissor:ge,viewport:pe,reset:Ie}}function tb(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pt,u=new WeakMap,d=new Set;let f;const h=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,x){return g?new OffscreenCanvas(C,x):yl("canvas")}function p(C,x,k){let W=1;const Z=ze(C);if((Z.width>k||Z.height>k)&&(W=k/Math.max(Z.width,Z.height)),W<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const fe=Math.floor(W*Z.width),ce=Math.floor(W*Z.height);f===void 0&&(f=_(fe,ce));const j=x?_(fe,ce):f;return j.width=fe,j.height=ce,j.getContext("2d").drawImage(C,0,0,fe,ce),He("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+fe+"x"+ce+")."),j}else return"data"in C&&He("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),C;return C}function m(C){return C.generateMipmaps}function b(C){r.generateMipmap(C)}function w(C){return C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?r.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(C,x,k,W,Z,fe=!1){if(C!==null){if(r[C]!==void 0)return r[C];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ce;W&&(ce=e.get("EXT_texture_norm16"),ce||He("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=x;if(x===r.RED&&(k===r.FLOAT&&(j=r.R32F),k===r.HALF_FLOAT&&(j=r.R16F),k===r.UNSIGNED_BYTE&&(j=r.R8),k===r.UNSIGNED_SHORT&&ce&&(j=ce.R16_EXT),k===r.SHORT&&ce&&(j=ce.R16_SNORM_EXT)),x===r.RED_INTEGER&&(k===r.UNSIGNED_BYTE&&(j=r.R8UI),k===r.UNSIGNED_SHORT&&(j=r.R16UI),k===r.UNSIGNED_INT&&(j=r.R32UI),k===r.BYTE&&(j=r.R8I),k===r.SHORT&&(j=r.R16I),k===r.INT&&(j=r.R32I)),x===r.RG&&(k===r.FLOAT&&(j=r.RG32F),k===r.HALF_FLOAT&&(j=r.RG16F),k===r.UNSIGNED_BYTE&&(j=r.RG8),k===r.UNSIGNED_SHORT&&ce&&(j=ce.RG16_EXT),k===r.SHORT&&ce&&(j=ce.RG16_SNORM_EXT)),x===r.RG_INTEGER&&(k===r.UNSIGNED_BYTE&&(j=r.RG8UI),k===r.UNSIGNED_SHORT&&(j=r.RG16UI),k===r.UNSIGNED_INT&&(j=r.RG32UI),k===r.BYTE&&(j=r.RG8I),k===r.SHORT&&(j=r.RG16I),k===r.INT&&(j=r.RG32I)),x===r.RGB_INTEGER&&(k===r.UNSIGNED_BYTE&&(j=r.RGB8UI),k===r.UNSIGNED_SHORT&&(j=r.RGB16UI),k===r.UNSIGNED_INT&&(j=r.RGB32UI),k===r.BYTE&&(j=r.RGB8I),k===r.SHORT&&(j=r.RGB16I),k===r.INT&&(j=r.RGB32I)),x===r.RGBA_INTEGER&&(k===r.UNSIGNED_BYTE&&(j=r.RGBA8UI),k===r.UNSIGNED_SHORT&&(j=r.RGBA16UI),k===r.UNSIGNED_INT&&(j=r.RGBA32UI),k===r.BYTE&&(j=r.RGBA8I),k===r.SHORT&&(j=r.RGBA16I),k===r.INT&&(j=r.RGBA32I)),x===r.RGB&&(k===r.UNSIGNED_SHORT&&ce&&(j=ce.RGB16_EXT),k===r.SHORT&&ce&&(j=ce.RGB16_SNORM_EXT),k===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),k===r.UNSIGNED_INT_10F_11F_11F_REV&&(j=r.R11F_G11F_B10F)),x===r.RGBA){const Q=fe?Sl:ot.getTransfer(Z);k===r.FLOAT&&(j=r.RGBA32F),k===r.HALF_FLOAT&&(j=r.RGBA16F),k===r.UNSIGNED_BYTE&&(j=Q===xt?r.SRGB8_ALPHA8:r.RGBA8),k===r.UNSIGNED_SHORT&&ce&&(j=ce.RGBA16_EXT),k===r.SHORT&&ce&&(j=ce.RGBA16_SNORM_EXT),k===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),k===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function T(C,x){let k;return C?x===null||x===Gi||x===Ja?k=r.DEPTH24_STENCIL8:x===Ii?k=r.DEPTH32F_STENCIL8:x===Za&&(k=r.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Gi||x===Ja?k=r.DEPTH_COMPONENT24:x===Ii?k=r.DEPTH_COMPONENT32F:x===Za&&(k=r.DEPTH_COMPONENT16),k}function A(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==fn&&C.minFilter!==Mn?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function E(C){const x=C.target;x.removeEventListener("dispose",E),y(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function v(C){const x=C.target;x.removeEventListener("dispose",v),D(x)}function y(C){const x=n.get(C);if(x.__webglInit===void 0)return;const k=C.source,W=h.get(k);if(W){const Z=W[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&R(C),Object.keys(W).length===0&&h.delete(k)}n.remove(C)}function R(C){const x=n.get(C);r.deleteTexture(x.__webglTexture);const k=C.source,W=h.get(k);delete W[x.__cacheKey],a.memory.textures--}function D(C){const x=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let Z=0;Z<x.__webglFramebuffer[W].length;Z++)r.deleteFramebuffer(x.__webglFramebuffer[W][Z]);else r.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)r.deleteFramebuffer(x.__webglFramebuffer[W]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const k=C.textures;for(let W=0,Z=k.length;W<Z;W++){const fe=n.get(k[W]);fe.__webglTexture&&(r.deleteTexture(fe.__webglTexture),a.memory.textures--),n.remove(k[W])}n.remove(C)}let L=0;function z(){L=0}function H(){return L}function F(C){L=C}function G(){const C=L;return C>=i.maxTextures&&He("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),L+=1,C}function O(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function K(C,x){const k=n.get(C);if(C.isVideoTexture&&U(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){const W=C.image;if(W===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{Re(k,C,x);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,k.__webglTexture,r.TEXTURE0+x)}function te(C,x){const k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Re(k,C,x);return}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,k.__webglTexture,r.TEXTURE0+x)}function P(C,x){const k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Re(k,C,x);return}t.bindTexture(r.TEXTURE_3D,k.__webglTexture,r.TEXTURE0+x)}function ae(C,x){const k=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&k.__version!==C.version){Oe(k,C,x);return}t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+x)}const de={[du]:r.REPEAT,[ji]:r.CLAMP_TO_EDGE,[pu]:r.MIRRORED_REPEAT},Ve={[fn]:r.NEAREST,[y0]:r.NEAREST_MIPMAP_NEAREST,[vo]:r.NEAREST_MIPMAP_LINEAR,[Mn]:r.LINEAR,[jl]:r.LINEAR_MIPMAP_NEAREST,[Zr]:r.LINEAR_MIPMAP_LINEAR},Xe={[T0]:r.NEVER,[P0]:r.ALWAYS,[A0]:r.LESS,[Df]:r.LEQUAL,[w0]:r.EQUAL,[Lf]:r.GEQUAL,[R0]:r.GREATER,[C0]:r.NOTEQUAL};function Be(C,x){if(x.type===Ii&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Mn||x.magFilter===jl||x.magFilter===vo||x.magFilter===Zr||x.minFilter===Mn||x.minFilter===jl||x.minFilter===vo||x.minFilter===Zr)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(C,r.TEXTURE_WRAP_S,de[x.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,de[x.wrapT]),(C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY)&&r.texParameteri(C,r.TEXTURE_WRAP_R,de[x.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,Ve[x.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,Ve[x.minFilter]),x.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,Xe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===fn||x.minFilter!==vo&&x.minFilter!==Zr||x.type===Ii&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");r.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function J(C,x){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",E));const W=x.source;let Z=h.get(W);Z===void 0&&(Z={},h.set(W,Z));const fe=O(x);if(fe!==C.__cacheKey){Z[fe]===void 0&&(Z[fe]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,k=!0),Z[fe].usedTimes++;const ce=Z[C.__cacheKey];ce!==void 0&&(Z[C.__cacheKey].usedTimes--,ce.usedTimes===0&&R(x)),C.__cacheKey=fe,C.__webglTexture=Z[fe].texture}return k}function le(C,x,k){return Math.floor(Math.floor(C/k)/x)}function re(C,x,k,W){const fe=C.updateRanges;if(fe.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,x.width,x.height,k,W,x.data);else{fe.sort((we,ge)=>we.start-ge.start);let ce=0;for(let we=1;we<fe.length;we++){const ge=fe[ce],pe=fe[we],ue=ge.start+ge.count,De=le(pe.start,x.width,4),Ie=le(ge.start,x.width,4);pe.start<=ue+1&&De===Ie&&le(pe.start+pe.count-1,x.width,4)===De?ge.count=Math.max(ge.count,pe.start+pe.count-ge.start):(++ce,fe[ce]=pe)}fe.length=ce+1;const j=t.getParameter(r.UNPACK_ROW_LENGTH),Q=t.getParameter(r.UNPACK_SKIP_PIXELS),me=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,x.width);for(let we=0,ge=fe.length;we<ge;we++){const pe=fe[we],ue=Math.floor(pe.start/4),De=Math.ceil(pe.count/4),Ie=ue%x.width,I=Math.floor(ue/x.width),he=De,ee=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,Ie),t.pixelStorei(r.UNPACK_SKIP_ROWS,I),t.texSubImage2D(r.TEXTURE_2D,0,Ie,I,he,ee,k,W,x.data)}C.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,j),t.pixelStorei(r.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(r.UNPACK_SKIP_ROWS,me)}}function Re(C,x,k){let W=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=r.TEXTURE_3D);const Z=J(C,x),fe=x.source;t.bindTexture(W,C.__webglTexture,r.TEXTURE0+k);const ce=n.get(fe);if(fe.version!==ce.__version||Z===!0){if(t.activeTexture(r.TEXTURE0+k),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const ee=ot.getPrimaries(ot.workingColorSpace),_e=x.colorSpace===Sr?null:ot.getPrimaries(x.colorSpace),xe=x.colorSpace===Sr||ee===_e?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=p(x.image,!1,i.maxTextureSize);Q=Ft(x,Q);const me=s.convert(x.format,x.colorSpace),we=s.convert(x.type);let ge=S(x.internalFormat,me,we,x.normalized,x.colorSpace,x.isVideoTexture);Be(W,x);let pe;const ue=x.mipmaps,De=x.isVideoTexture!==!0,Ie=ce.__version===void 0||Z===!0,I=fe.dataReady,he=A(x,Q);if(x.isDepthTexture)ge=T(x.format===Jr,x.type),Ie&&(De?t.texStorage2D(r.TEXTURE_2D,1,ge,Q.width,Q.height):t.texImage2D(r.TEXTURE_2D,0,ge,Q.width,Q.height,0,me,we,null));else if(x.isDataTexture)if(ue.length>0){De&&Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,ue[0].width,ue[0].height);for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,we,pe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,me,we,pe.data);x.generateMipmaps=!1}else De?(Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,Q.width,Q.height),I&&re(x,Q,me,we)):t.texImage2D(r.TEXTURE_2D,0,ge,Q.width,Q.height,0,me,we,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&Ie&&t.texStorage3D(r.TEXTURE_2D_ARRAY,he,ge,ue[0].width,ue[0].height,Q.depth);for(let ee=0,_e=ue.length;ee<_e;ee++)if(pe=ue[ee],x.format!==Mi)if(me!==null)if(De){if(I)if(x.layerUpdates.size>0){const xe=sd(pe.width,pe.height,x.format,x.type);for(const ne of x.layerUpdates){const se=pe.data.subarray(ne*xe/pe.data.BYTES_PER_ELEMENT,(ne+1)*xe/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,ne,pe.width,pe.height,1,me,se)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,pe.width,pe.height,Q.depth,me,pe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ee,ge,pe.width,pe.height,Q.depth,0,pe.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?I&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,pe.width,pe.height,Q.depth,me,we,pe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ee,ge,pe.width,pe.height,Q.depth,0,me,we,pe.data)}else{De&&Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,ue[0].width,ue[0].height);for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],x.format!==Mi?me!==null?De?I&&t.compressedTexSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,pe.data):t.compressedTexImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,pe.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,we,pe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,me,we,pe.data)}else if(x.isDataArrayTexture)if(De){if(Ie&&t.texStorage3D(r.TEXTURE_2D_ARRAY,he,ge,Q.width,Q.height,Q.depth),I)if(x.layerUpdates.size>0){const ee=sd(Q.width,Q.height,x.format,x.type);for(const _e of x.layerUpdates){const xe=Q.data.subarray(_e*ee/Q.data.BYTES_PER_ELEMENT,(_e+1)*ee/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,_e,Q.width,Q.height,1,me,we,xe)}x.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,me,we,Q.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ge,Q.width,Q.height,Q.depth,0,me,we,Q.data);else if(x.isData3DTexture)De?(Ie&&t.texStorage3D(r.TEXTURE_3D,he,ge,Q.width,Q.height,Q.depth),I&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,me,we,Q.data)):t.texImage3D(r.TEXTURE_3D,0,ge,Q.width,Q.height,Q.depth,0,me,we,Q.data);else if(x.isFramebufferTexture){if(Ie)if(De)t.texStorage2D(r.TEXTURE_2D,he,ge,Q.width,Q.height);else{let ee=Q.width,_e=Q.height;for(let xe=0;xe<he;xe++)t.texImage2D(r.TEXTURE_2D,xe,ge,ee,_e,0,me,we,null),ee>>=1,_e>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in r){const ee=r.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),Q.parentNode!==ee){ee.appendChild(Q),d.add(x),ee.onpaint=_e=>{const xe=_e.changedElements;for(const ne of d)xe.includes(ne.image)&&(ne.needsUpdate=!0)},ee.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,Q);else{const xe=r.RGBA,ne=r.RGBA,se=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,xe,ne,se,Q)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(ue.length>0){if(De&&Ie){const ee=ze(ue[0]);t.texStorage2D(r.TEXTURE_2D,he,ge,ee.width,ee.height)}for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,me,we,pe):t.texImage2D(r.TEXTURE_2D,ee,ge,me,we,pe);x.generateMipmaps=!1}else if(De){if(Ie){const ee=ze(Q);t.texStorage2D(r.TEXTURE_2D,he,ge,ee.width,ee.height)}I&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,me,we,Q)}else t.texImage2D(r.TEXTURE_2D,0,ge,me,we,Q);m(x)&&b(W),ce.__version=fe.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Oe(C,x,k){if(x.image.length!==6)return;const W=J(C,x),Z=x.source;t.bindTexture(r.TEXTURE_CUBE_MAP,C.__webglTexture,r.TEXTURE0+k);const fe=n.get(Z);if(Z.version!==fe.__version||W===!0){t.activeTexture(r.TEXTURE0+k);const ce=ot.getPrimaries(ot.workingColorSpace),j=x.colorSpace===Sr?null:ot.getPrimaries(x.colorSpace),Q=x.colorSpace===Sr||ce===j?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const me=x.isCompressedTexture||x.image[0].isCompressedTexture,we=x.image[0]&&x.image[0].isDataTexture,ge=[];for(let ne=0;ne<6;ne++)!me&&!we?ge[ne]=p(x.image[ne],!0,i.maxCubemapSize):ge[ne]=we?x.image[ne].image:x.image[ne],ge[ne]=Ft(x,ge[ne]);const pe=ge[0],ue=s.convert(x.format,x.colorSpace),De=s.convert(x.type),Ie=S(x.internalFormat,ue,De,x.normalized,x.colorSpace),I=x.isVideoTexture!==!0,he=fe.__version===void 0||W===!0,ee=Z.dataReady;let _e=A(x,pe);Be(r.TEXTURE_CUBE_MAP,x);let xe;if(me){I&&he&&t.texStorage2D(r.TEXTURE_CUBE_MAP,_e,Ie,pe.width,pe.height);for(let ne=0;ne<6;ne++){xe=ge[ne].mipmaps;for(let se=0;se<xe.length;se++){const ie=xe[se];x.format!==Mi?ue!==null?I?ee&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,0,0,ie.width,ie.height,ue,ie.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,Ie,ie.width,ie.height,0,ie.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,0,0,ie.width,ie.height,ue,De,ie.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,Ie,ie.width,ie.height,0,ue,De,ie.data)}}}else{if(xe=x.mipmaps,I&&he){xe.length>0&&_e++;const ne=ze(ge[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,_e,Ie,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(we){I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ge[ne].width,ge[ne].height,ue,De,ge[ne].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ie,ge[ne].width,ge[ne].height,0,ue,De,ge[ne].data);for(let se=0;se<xe.length;se++){const Ue=xe[se].image[ne].image;I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,0,0,Ue.width,Ue.height,ue,De,Ue.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,Ie,Ue.width,Ue.height,0,ue,De,Ue.data)}}else{I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ue,De,ge[ne]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ie,ue,De,ge[ne]);for(let se=0;se<xe.length;se++){const ie=xe[se];I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,0,0,ue,De,ie.image[ne]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,Ie,ue,De,ie.image[ne])}}}m(x)&&b(r.TEXTURE_CUBE_MAP),fe.__version=Z.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Te(C,x,k,W,Z,fe){const ce=s.convert(k.format,k.colorSpace),j=s.convert(k.type),Q=S(k.internalFormat,ce,j,k.normalized,k.colorSpace),me=n.get(x),we=n.get(k);if(we.__renderTarget=x,!me.__hasExternalTextures){const ge=Math.max(1,x.width>>fe),pe=Math.max(1,x.height>>fe);Z===r.TEXTURE_3D||Z===r.TEXTURE_2D_ARRAY?t.texImage3D(Z,fe,Q,ge,pe,x.depth,0,ce,j,null):t.texImage2D(Z,fe,Q,ge,pe,0,ce,j,null)}t.bindFramebuffer(r.FRAMEBUFFER,C),mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,W,Z,we.__webglTexture,0,Ye(x)):(Z===r.TEXTURE_2D||Z>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,W,Z,we.__webglTexture,fe),t.bindFramebuffer(r.FRAMEBUFFER,null)}function rt(C,x,k){if(r.bindRenderbuffer(r.RENDERBUFFER,C),x.depthBuffer){const W=x.depthTexture,Z=W&&W.isDepthTexture?W.type:null,fe=T(x.stencilBuffer,Z),ce=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;mt(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ye(x),fe,x.width,x.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ye(x),fe,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,fe,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ce,r.RENDERBUFFER,C)}else{const W=x.textures;for(let Z=0;Z<W.length;Z++){const fe=W[Z],ce=s.convert(fe.format,fe.colorSpace),j=s.convert(fe.type),Q=S(fe.internalFormat,ce,j,fe.normalized,fe.colorSpace);mt(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ye(x),Q,x.width,x.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ye(x),Q,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,Q,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function be(C,x,k){const W=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=n.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",E)),Z.__webglTexture===void 0){Z.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture),Be(r.TEXTURE_CUBE_MAP,x.depthTexture);const me=s.convert(x.depthTexture.format),we=s.convert(x.depthTexture.type);let ge;x.depthTexture.format===or?ge=r.DEPTH_COMPONENT24:x.depthTexture.format===Jr&&(ge=r.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ge,x.width,x.height,0,me,we,null)}}else K(x.depthTexture,0);const fe=Z.__webglTexture,ce=Ye(x),j=W?r.TEXTURE_CUBE_MAP_POSITIVE_X+k:r.TEXTURE_2D,Q=x.depthTexture.format===Jr?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(x.depthTexture.format===or)mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Q,j,fe,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,Q,j,fe,0);else if(x.depthTexture.format===Jr)mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Q,j,fe,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,Q,j,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(C){const x=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const W=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",Z)};W.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=W}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(k)for(let W=0;W<6;W++)be(x.__webglFramebuffer[W],C,W);else{const W=C.texture.mipmaps;W&&W.length>0?be(x.__webglFramebuffer[0],C,0):be(x.__webglFramebuffer,C,0)}else if(k){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=r.createRenderbuffer(),rt(x.__webglDepthbuffer[W],C,!1);else{const Z=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=x.__webglDepthbuffer[W];r.bindRenderbuffer(r.RENDERBUFFER,fe),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,fe)}}else{const W=C.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),rt(x.__webglDepthbuffer,C,!1);else{const Z=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,fe),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,fe)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function We(C,x,k){const W=n.get(C);x!==void 0&&Te(W.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),k!==void 0&&ke(C)}function Ge(C){const x=C.texture,k=n.get(C),W=n.get(x);C.addEventListener("dispose",v);const Z=C.textures,fe=C.isWebGLCubeRenderTarget===!0,ce=Z.length>1;if(ce||(W.__webglTexture===void 0&&(W.__webglTexture=r.createTexture()),W.__version=x.version,a.memory.textures++),fe){k.__webglFramebuffer=[];for(let j=0;j<6;j++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[j]=[];for(let Q=0;Q<x.mipmaps.length;Q++)k.__webglFramebuffer[j][Q]=r.createFramebuffer()}else k.__webglFramebuffer[j]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let j=0;j<x.mipmaps.length;j++)k.__webglFramebuffer[j]=r.createFramebuffer()}else k.__webglFramebuffer=r.createFramebuffer();if(ce)for(let j=0,Q=Z.length;j<Q;j++){const me=n.get(Z[j]);me.__webglTexture===void 0&&(me.__webglTexture=r.createTexture(),a.memory.textures++)}if(C.samples>0&&mt(C)===!1){k.__webglMultisampledFramebuffer=r.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let j=0;j<Z.length;j++){const Q=Z[j];k.__webglColorRenderbuffer[j]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,k.__webglColorRenderbuffer[j]);const me=s.convert(Q.format,Q.colorSpace),we=s.convert(Q.type),ge=S(Q.internalFormat,me,we,Q.normalized,Q.colorSpace,C.isXRRenderTarget===!0),pe=Ye(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,pe,ge,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+j,r.RENDERBUFFER,k.__webglColorRenderbuffer[j])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=r.createRenderbuffer(),rt(k.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(fe){t.bindTexture(r.TEXTURE_CUBE_MAP,W.__webglTexture),Be(r.TEXTURE_CUBE_MAP,x);for(let j=0;j<6;j++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)Te(k.__webglFramebuffer[j][Q],C,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Q);else Te(k.__webglFramebuffer[j],C,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);m(x)&&b(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let j=0,Q=Z.length;j<Q;j++){const me=Z[j],we=n.get(me);let ge=r.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ge=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ge,we.__webglTexture),Be(ge,me),Te(k.__webglFramebuffer,C,me,r.COLOR_ATTACHMENT0+j,ge,0),m(me)&&b(ge)}t.unbindTexture()}else{let j=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(j,W.__webglTexture),Be(j,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)Te(k.__webglFramebuffer[Q],C,x,r.COLOR_ATTACHMENT0,j,Q);else Te(k.__webglFramebuffer,C,x,r.COLOR_ATTACHMENT0,j,0);m(x)&&b(j),t.unbindTexture()}C.depthBuffer&&ke(C)}function Y(C){const x=C.textures;for(let k=0,W=x.length;k<W;k++){const Z=x[k];if(m(Z)){const fe=w(C),ce=n.get(Z).__webglTexture;t.bindTexture(fe,ce),b(fe),t.unbindTexture()}}}const ut=[],vt=[];function At(C){if(C.samples>0){if(mt(C)===!1){const x=C.textures,k=C.width,W=C.height;let Z=r.COLOR_BUFFER_BIT;const fe=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=n.get(C),j=x.length>1;if(j)for(let me=0;me<x.length;me++)t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const Q=C.texture.mipmaps;Q&&Q.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let me=0;me<x.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Z|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Z|=r.STENCIL_BUFFER_BIT)),j){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);const we=n.get(x[me]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,we,0)}r.blitFramebuffer(0,0,k,W,0,0,k,W,Z,r.NEAREST),l===!0&&(ut.length=0,vt.length=0,ut.push(r.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ut.push(fe),vt.push(fe),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,vt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),j)for(let me=0;me<x.length;me++){t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);const we=n.get(x[me]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.TEXTURE_2D,we,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const x=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function Ye(C){return Math.min(i.maxSamples,C.samples)}function mt(C){const x=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function U(C){const x=a.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function Ft(C,x){const k=C.colorSpace,W=C.format,Z=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==vl&&k!==Sr&&(ot.getTransfer(k)===xt?(W!==Mi||Z!==fi)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ht("WebGLTextures: Unsupported texture color space:",k)),x}function ze(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=z,this.getTextureUnits=H,this.setTextureUnits=F,this.setTexture2D=K,this.setTexture2DArray=te,this.setTexture3D=P,this.setTextureCube=ae,this.rebindTextures=We,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=Y,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function nb(r,e){function t(n,i=Sr){let s;const a=ot.getTransfer(i);if(n===fi)return r.UNSIGNED_BYTE;if(n===Af)return r.UNSIGNED_SHORT_4_4_4_4;if(n===wf)return r.UNSIGNED_SHORT_5_5_5_1;if(n===xm)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===vm)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===gm)return r.BYTE;if(n===_m)return r.SHORT;if(n===Za)return r.UNSIGNED_SHORT;if(n===Tf)return r.INT;if(n===Gi)return r.UNSIGNED_INT;if(n===Ii)return r.FLOAT;if(n===ar)return r.HALF_FLOAT;if(n===Sm)return r.ALPHA;if(n===Mm)return r.RGB;if(n===Mi)return r.RGBA;if(n===or)return r.DEPTH_COMPONENT;if(n===Jr)return r.DEPTH_STENCIL;if(n===ym)return r.RED;if(n===Rf)return r.RED_INTEGER;if(n===cs)return r.RG;if(n===Cf)return r.RG_INTEGER;if(n===Pf)return r.RGBA_INTEGER;if(n===tl||n===nl||n===il||n===rl)if(a===xt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===tl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===nl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===il)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===rl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===tl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===nl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===il)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===rl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===mu||n===gu||n===_u||n===xu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===mu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_u)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===vu||n===Su||n===Mu||n===yu||n===bu||n===_l||n===Eu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===vu||n===Su)return a===xt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Mu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===yu)return s.COMPRESSED_R11_EAC;if(n===bu)return s.COMPRESSED_SIGNED_R11_EAC;if(n===_l)return s.COMPRESSED_RG11_EAC;if(n===Eu)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Tu||n===Au||n===wu||n===Ru||n===Cu||n===Pu||n===Du||n===Lu||n===Nu||n===Iu||n===Uu||n===Fu||n===Ou||n===Bu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Tu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Au)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===wu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ru)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Cu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Du)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Lu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Nu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Iu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Uu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ou)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ku||n===zu||n===Gu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===ku)return a===xt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===zu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Gu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hu||n===Vu||n===xl||n===Wu)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Hu)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Vu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===xl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ja?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const ib=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Nm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new yi({vertexShader:ib,fragmentShader:rb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new lr(new Ll(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ab extends hs{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,g=null;const _=typeof XRWebGLBinding<"u",p=new sb,m={},b=t.getContextAttributes();let w=null,S=null;const T=[],A=[],E=new pt;let v=null;const y=new vi;y.viewport=new kt;const R=new vi;R.viewport=new kt;const D=[y,R],L=new gx;let z=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let le=T[J];return le===void 0&&(le=new ac,T[J]=le),le.getTargetRaySpace()},this.getControllerGrip=function(J){let le=T[J];return le===void 0&&(le=new ac,T[J]=le),le.getGripSpace()},this.getHand=function(J){let le=T[J];return le===void 0&&(le=new ac,T[J]=le),le.getHandSpace()};function F(J){const le=A.indexOf(J.inputSource);if(le===-1)return;const re=T[le];re!==void 0&&(re.update(J.inputSource,J.frame,c||a),re.dispatchEvent({type:J.type,data:J.inputSource}))}function G(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",G),i.removeEventListener("inputsourceschange",O);for(let J=0;J<T.length;J++){const le=A[J];le!==null&&(A[J]=null,T[J].disconnect(le))}z=null,H=null,p.reset();for(const J in m)delete m[J];e.setRenderTarget(w),h=null,f=null,d=null,i=null,S=null,Be.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",G),i.addEventListener("inputsourceschange",O),b.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(E),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,Re=null,Oe=null;b.depth&&(Oe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=b.stencil?Jr:or,Re=b.stencil?Ja:Gi);const Te={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(Te),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new ki(f.textureWidth,f.textureHeight,{format:Mi,type:fi,depthTexture:new ra(f.textureWidth,f.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const re={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new ki(h.framebufferWidth,h.framebufferHeight,{format:Mi,type:fi,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Be.setContext(i),Be.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function O(J){for(let le=0;le<J.removed.length;le++){const re=J.removed[le],Re=A.indexOf(re);Re>=0&&(A[Re]=null,T[Re].disconnect(re))}for(let le=0;le<J.added.length;le++){const re=J.added[le];let Re=A.indexOf(re);if(Re===-1){for(let Te=0;Te<T.length;Te++)if(Te>=A.length){A.push(re),Re=Te;break}else if(A[Te]===null){A[Te]=re,Re=Te;break}if(Re===-1)break}const Oe=T[Re];Oe&&Oe.connect(re)}}const K=new q,te=new q;function P(J,le,re){K.setFromMatrixPosition(le.matrixWorld),te.setFromMatrixPosition(re.matrixWorld);const Re=K.distanceTo(te),Oe=le.projectionMatrix.elements,Te=re.projectionMatrix.elements,rt=Oe[14]/(Oe[10]-1),be=Oe[14]/(Oe[10]+1),ke=(Oe[9]+1)/Oe[5],We=(Oe[9]-1)/Oe[5],Ge=(Oe[8]-1)/Oe[0],Y=(Te[8]+1)/Te[0],ut=rt*Ge,vt=rt*Y,At=Re/(-Ge+Y),Ye=At*-Ge;if(le.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ye),J.translateZ(At),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Oe[10]===-1)J.projectionMatrix.copy(le.projectionMatrix),J.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const mt=rt+At,U=be+At,Ft=ut-Ye,ze=vt+(Re-Ye),C=ke*be/U*mt,x=We*be/U*mt;J.projectionMatrix.makePerspective(Ft,ze,C,x,mt,U),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ae(J,le){le===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(le.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let le=J.near,re=J.far;p.texture!==null&&(p.depthNear>0&&(le=p.depthNear),p.depthFar>0&&(re=p.depthFar)),L.near=R.near=y.near=le,L.far=R.far=y.far=re,(z!==L.near||H!==L.far)&&(i.updateRenderState({depthNear:L.near,depthFar:L.far}),z=L.near,H=L.far),L.layers.mask=J.layers.mask|6,y.layers.mask=L.layers.mask&-5,R.layers.mask=L.layers.mask&-3;const Re=J.parent,Oe=L.cameras;ae(L,Re);for(let Te=0;Te<Oe.length;Te++)ae(Oe[Te],Re);Oe.length===2?P(L,y,R):L.projectionMatrix.copy(y.projectionMatrix),de(J,L,Re)};function de(J,le,re){re===null?J.matrix.copy(le.matrixWorld):(J.matrix.copy(re.matrixWorld),J.matrix.invert(),J.matrix.multiply(le.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(le.projectionMatrix),J.projectionMatrixInverse.copy(le.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Xu*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(J){l=J,f!==null&&(f.fixedFoveation=J),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(L)},this.getCameraTexture=function(J){return m[J]};let Ve=null;function Xe(J,le){if(u=le.getViewerPose(c||a),g=le,u!==null){const re=u.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let Re=!1;re.length!==L.cameras.length&&(L.cameras.length=0,Re=!0);for(let be=0;be<re.length;be++){const ke=re[be];let We=null;if(h!==null)We=h.getViewport(ke);else{const Y=d.getViewSubImage(f,ke);We=Y.viewport,be===0&&(e.setRenderTargetTextures(S,Y.colorTexture,Y.depthStencilTexture),e.setRenderTarget(S))}let Ge=D[be];Ge===void 0&&(Ge=new vi,Ge.layers.enable(be),Ge.viewport=new kt,D[be]=Ge),Ge.matrix.fromArray(ke.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(ke.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(We.x,We.y,We.width,We.height),be===0&&(L.matrix.copy(Ge.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Re===!0&&L.cameras.push(Ge)}const Oe=i.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const be=d.getDepthInformation(re[0]);be&&be.isValid&&be.texture&&p.init(be,i.renderState)}if(Oe&&Oe.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let be=0;be<re.length;be++){const ke=re[be].camera;if(ke){let We=m[ke];We||(We=new Nm,m[ke]=We);const Ge=d.getCameraImage(ke);We.sourceTexture=Ge}}}}for(let re=0;re<T.length;re++){const Re=A[re],Oe=T[re];Re!==null&&Oe!==void 0&&Oe.update(Re,le,c||a)}Ve&&Ve(J,le),le.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:le}),g=null}const Be=new Fm;Be.setAnimationLoop(Xe),this.setAnimationLoop=function(J){Ve=J},this.dispose=function(){}}}const ob=new Yt,Vm=new $e;Vm.set(-1,0,0,0,1,0,0,0,1);function lb(r,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Im(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,b,w,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),f(p,m),m.isMeshPhysicalMaterial&&h(p,m,S)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),_(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,b,w):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===zn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===zn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const b=e.get(m),w=b.envMap,S=b.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(ob.makeRotationFromEuler(S)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Vm),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function h(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===zn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const b=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function cb(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,T){const A=T.program;n.uniformBlockBinding(S,A)}function c(S,T){let A=i[S.id];A===void 0&&(p(S),A=u(S),i[S.id]=A,S.addEventListener("dispose",b));const E=T.program;n.updateUBOMapping(S,E);const v=e.render.frame;s[S.id]!==v&&(f(S),s[S.id]=v)}function u(S){const T=d();S.__bindingPointIndex=T;const A=r.createBuffer(),E=S.__size,v=S.usage;return r.bindBuffer(r.UNIFORM_BUFFER,A),r.bufferData(r.UNIFORM_BUFFER,E,v),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,T,A),A}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const T=i[S.id],A=S.uniforms,E=S.__cache;r.bindBuffer(r.UNIFORM_BUFFER,T);for(let v=0,y=A.length;v<y;v++){const R=A[v];if(Array.isArray(R))for(let D=0,L=R.length;D<L;D++)h(R[D],v,D,E);else h(R,v,0,E)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function h(S,T,A,E){if(_(S,T,A,E)===!0){const v=S.__offset,y=S.value;if(Array.isArray(y)){let R=0;for(let D=0;D<y.length;D++){const L=y[D],z=m(L);g(L,S.__data,R),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(y,S.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,v,S.__data)}}function g(S,T,A){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,A)}function _(S,T,A,E){const v=S.value,y=T+"_"+A;if(E[y]===void 0)return typeof v=="number"||typeof v=="boolean"?E[y]=v:ArrayBuffer.isView(v)?E[y]=v.slice():E[y]=v.clone(),!0;{const R=E[y];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return E[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(R.equals(v)===!1)return R.copy(v),!0}}return!1}function p(S){const T=S.uniforms;let A=0;const E=16;for(let y=0,R=T.length;y<R;y++){const D=Array.isArray(T[y])?T[y]:[T[y]];for(let L=0,z=D.length;L<z;L++){const H=D[L],F=Array.isArray(H.value)?H.value:[H.value];for(let G=0,O=F.length;G<O;G++){const K=F[G],te=m(K),P=A%E,ae=P%te.boundary,de=P+ae;A+=ae,de!==0&&E-de<te.storage&&(A+=E-de),H.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=A,A+=te.storage}}}const v=A%E;return v>0&&(A+=E-v),S.__size=A,S.__cache={},this}function m(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):He("WebGLRenderer: Unsupported uniform value type.",S),T}function b(S){const T=S.target;T.removeEventListener("dispose",b);const A=a.indexOf(T.__bindingPointIndex);a.splice(A,1),r.deleteBuffer(i[T.id]),delete i[T.id],delete s[T.id]}function w(){for(const S in i)r.deleteBuffer(i[S]);a=[],i={},s={}}return{bind:l,update:c,dispose:w}}const ub=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let wi=null;function fb(){return wi===null&&(wi=new tx(ub,16,16,cs,ar),wi.name="DFG_LUT",wi.minFilter=Mn,wi.magFilter=Mn,wi.wrapS=ji,wi.wrapT=ji,wi.generateMipmaps=!1,wi.needsUpdate=!0),wi}class hb{constructor(e={}){const{canvas:t=L0(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:h=fi}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=h,p=new Set([Pf,Cf,Rf]),m=new Set([fi,Gi,Za,Ja,Af,wf]),b=new Uint32Array(4),w=new Int32Array(4),S=new q;let T=null,A=null;const E=[],v=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let D=!1,L=null,z=null,H=null,F=null;this._outputColorSpace=li;let G=0,O=0,K=null,te=-1,P=null;const ae=new kt,de=new kt;let Ve=null;const Xe=new dt(0);let Be=0,J=t.width,le=t.height,re=1,Re=null,Oe=null;const Te=new kt(0,0,J,le),rt=new kt(0,0,J,le);let be=!1;const ke=new Dm;let We=!1,Ge=!1;const Y=new Yt,ut=new q,vt=new kt,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function mt(){return K===null?re:1}let U=n;function Ft(M,B){return t.getContext(M,B)}try{const M={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ef}`),t.addEventListener("webglcontextlost",Ue,!1),t.addEventListener("webglcontextrestored",oe,!1),t.addEventListener("webglcontextcreationerror",Fe,!1),U===null){const B="webgl2";if(U=Ft(B,M),U===null)throw Ft(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw ht("WebGLRenderer: "+M.message),M}let ze,C,x,k,W,Z,fe,ce,j,Q,me,we,ge,pe,ue,De,Ie,I,he,ee,_e,xe,ne;function se(){ze=new fM(U),ze.init(),_e=new nb(U,ze),C=new iM(U,ze,e,_e),x=new eb(U,ze),C.reversedDepthBuffer&&f&&x.buffers.depth.setReversed(!0),z=U.createFramebuffer(),H=U.createFramebuffer(),F=U.createFramebuffer(),k=new pM(U),W=new zy,Z=new tb(U,ze,x,W,C,_e,k),fe=new uM(R),ce=new xx(U),xe=new tM(U,ce),j=new hM(U,ce,k,xe),Q=new gM(U,j,ce,xe,k),I=new mM(U,C,Z),ue=new rM(W),me=new ky(R,fe,ze,C,xe,ue),we=new lb(R,W),ge=new Hy,pe=new $y(ze),Ie=new eM(R,fe,x,Q,g,l),De=new Qy(R,Q,C),ne=new cb(U,k,C,x),he=new nM(U,ze,k),ee=new dM(U,ze,k),k.programs=me.programs,R.capabilities=C,R.extensions=ze,R.properties=W,R.renderLists=ge,R.shadowMap=De,R.state=x,R.info=k}se(),_!==fi&&(y=new xM(_,t.width,t.height,o,i,s));const ie=new ab(R,U);this.xr=ie,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const M=ze.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=ze.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(M){M!==void 0&&(re=M,this.setSize(J,le,!1))},this.getSize=function(M){return M.set(J,le)},this.setSize=function(M,B,$=!0){if(ie.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}J=M,le=B,t.width=Math.floor(M*re),t.height=Math.floor(B*re),$===!0&&(t.style.width=M+"px",t.style.height=B+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,M,B)},this.getDrawingBufferSize=function(M){return M.set(J*re,le*re).floor()},this.setDrawingBufferSize=function(M,B,$){J=M,le=B,re=$,t.width=Math.floor(M*$),t.height=Math.floor(B*$),this.setViewport(0,0,M,B)},this.setEffects=function(M){if(_===fi){ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let B=0;B<M.length;B++)if(M[B].isOutputPass===!0){He("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ae)},this.getViewport=function(M){return M.copy(Te)},this.setViewport=function(M,B,$,V){M.isVector4?Te.set(M.x,M.y,M.z,M.w):Te.set(M,B,$,V),x.viewport(ae.copy(Te).multiplyScalar(re).round())},this.getScissor=function(M){return M.copy(rt)},this.setScissor=function(M,B,$,V){M.isVector4?rt.set(M.x,M.y,M.z,M.w):rt.set(M,B,$,V),x.scissor(de.copy(rt).multiplyScalar(re).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(M){x.setScissorTest(be=M)},this.setOpaqueSort=function(M){Re=M},this.setTransparentSort=function(M){Oe=M},this.getClearColor=function(M){return M.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor(...arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha(...arguments)},this.clear=function(M=!0,B=!0,$=!0){let V=0;if(M){let X=!1;if(K!==null){const ve=K.texture.format;X=p.has(ve)}if(X){const ve=K.texture.type,Se=m.has(ve),ye=Ie.getClearColor(),Pe=Ie.getClearAlpha(),Le=ye.r,Ke=ye.g,je=ye.b;Se?(b[0]=Le,b[1]=Ke,b[2]=je,b[3]=Pe,U.clearBufferuiv(U.COLOR,0,b)):(w[0]=Le,w[1]=Ke,w[2]=je,w[3]=Pe,U.clearBufferiv(U.COLOR,0,w))}else V|=U.COLOR_BUFFER_BIT}B&&(V|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(V|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&U.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),L=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Ue,!1),t.removeEventListener("webglcontextrestored",oe,!1),t.removeEventListener("webglcontextcreationerror",Fe,!1),Ie.dispose(),ge.dispose(),pe.dispose(),W.dispose(),fe.dispose(),Q.dispose(),xe.dispose(),ne.dispose(),me.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",Pt),ie.removeEventListener("sessionend",Mt),at.stop()};function Ue(M){M.preventDefault(),Bh("WebGLRenderer: Context Lost."),D=!0}function oe(){Bh("WebGLRenderer: Context Restored."),D=!1;const M=k.autoReset,B=De.enabled,$=De.autoUpdate,V=De.needsUpdate,X=De.type;se(),k.autoReset=M,De.enabled=B,De.autoUpdate=$,De.needsUpdate=V,De.type=X}function Fe(M){ht("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ce(M){const B=M.target;B.removeEventListener("dispose",Ce),qe(B)}function qe(M){qt(M),W.remove(M)}function qt(M){const B=W.get(M).programs;B!==void 0&&(B.forEach(function($){me.releaseProgram($)}),M.isShaderMaterial&&me.releaseShaderCache(M))}this.renderBufferDirect=function(M,B,$,V,X,ve){B===null&&(B=At);const Se=X.isMesh&&X.matrixWorld.determinantAffine()<0,ye=sn(M,B,$,V,X);x.setMaterial(V,Se);let Pe=$.index,Le=1;if(V.wireframe===!0){if(Pe=j.getWireframeAttribute($),Pe===void 0)return;Le=2}const Ke=$.drawRange,je=$.attributes.position;let Ne=Ke.start*Le,St=(Ke.start+Ke.count)*Le;ve!==null&&(Ne=Math.max(Ne,ve.start*Le),St=Math.min(St,(ve.start+ve.count)*Le)),Pe!==null?(Ne=Math.max(Ne,0),St=Math.min(St,Pe.count)):je!=null&&(Ne=Math.max(Ne,0),St=Math.min(St,je.count));const Ht=St-Ne;if(Ht<0||Ht===1/0)return;xe.setup(X,V,ye,$,Pe);let Bt,yt=he;if(Pe!==null&&(Bt=ce.get(Pe),yt=ee,yt.setIndex(Bt)),X.isMesh)V.wireframe===!0?(x.setLineWidth(V.wireframeLinewidth*mt()),yt.setMode(U.LINES)):yt.setMode(U.TRIANGLES);else if(X.isLine){let pn=V.linewidth;pn===void 0&&(pn=1),x.setLineWidth(pn*mt()),X.isLineSegments?yt.setMode(U.LINES):X.isLineLoop?yt.setMode(U.LINE_LOOP):yt.setMode(U.LINE_STRIP)}else X.isPoints?yt.setMode(U.POINTS):X.isSprite&&yt.setMode(U.TRIANGLES);if(X.isBatchedMesh)if(ze.get("WEBGL_multi_draw"))yt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const pn=X._multiDrawStarts,Ee=X._multiDrawCounts,Vn=X._multiDrawCount,ft=Pe?ce.get(Pe).bytesPerElement:1,si=W.get(V).currentProgram.getUniforms();for(let Ti=0;Ti<Vn;Ti++)si.setValue(U,"_gl_DrawID",Ti),yt.render(pn[Ti]/ft,Ee[Ti])}else if(X.isInstancedMesh)yt.renderInstances(Ne,Ht,X.count);else if($.isInstancedBufferGeometry){const pn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ee=Math.min($.instanceCount,pn);yt.renderInstances(Ne,Ht,Ee)}else yt.render(Ne,Ht)};function et(M,B,$){M.transparent===!0&&M.side===Zi&&M.forceSinglePass===!1?(M.side=zn,M.needsUpdate=!0,Ot(M,B,$),M.side=Ir,M.needsUpdate=!0,Ot(M,B,$),M.side=Zi):Ot(M,B,$)}this.compile=function(M,B,$=null){$===null&&($=M),A=pe.get($),A.init(B),v.push(A),$.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(A.pushLight(X),X.castShadow&&A.pushShadow(X))}),M!==$&&M.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(A.pushLight(X),X.castShadow&&A.pushShadow(X))}),A.setupLights();const V=new Set;return M.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const ve=X.material;if(ve)if(Array.isArray(ve))for(let Se=0;Se<ve.length;Se++){const ye=ve[Se];et(ye,$,X),V.add(ye)}else et(ve,$,X),V.add(ve)}),A=v.pop(),V},this.compileAsync=function(M,B,$=null){const V=this.compile(M,B,$);return new Promise(X=>{function ve(){if(V.forEach(function(Se){W.get(Se).currentProgram.isReady()&&V.delete(Se)}),V.size===0){X(M);return}setTimeout(ve,10)}ze.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let Ct=null;function rn(M){Ct&&Ct(M)}function Pt(){at.stop()}function Mt(){at.start()}const at=new Fm;at.setAnimationLoop(rn),typeof self<"u"&&at.setContext(self),this.setAnimationLoop=function(M){Ct=M,ie.setAnimationLoop(M),M===null?at.stop():at.start()},ie.addEventListener("sessionstart",Pt),ie.addEventListener("sessionend",Mt),this.render=function(M,B){if(B!==void 0&&B.isCamera!==!0){ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;L!==null&&L.renderStart(M,B);const $=ie.enabled===!0&&ie.isPresenting===!0,V=y!==null&&(K===null||$)&&y.begin(R,K);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(B),B=ie.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,B,K),A=pe.get(M,v.length),A.init(B),A.state.textureUnits=Z.getTextureUnits(),v.push(A),Y.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ke.setFromProjectionMatrix(Y,Ui,B.reversedDepth),Ge=this.localClippingEnabled,We=ue.init(this.clippingPlanes,Ge),T=ge.get(M,E.length),T.init(),E.push(T),ie.enabled===!0&&ie.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&bn(Se,B,-1/0,R.sortObjects)}bn(M,B,0,R.sortObjects),T.finish(),R.sortObjects===!0&&T.sort(Re,Oe,B.reversedDepth),Ye=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,Ye&&Ie.addToRenderList(T,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),We===!0&&ue.beginShadows();const X=A.state.shadowsArray;if(De.render(X,M,B),We===!0&&ue.endShadows(),(V&&y.hasRenderPass())===!1){const Se=T.opaque,ye=T.transmissive;if(A.setupLights(),B.isArrayCamera){const Pe=B.cameras;if(ye.length>0)for(let Le=0,Ke=Pe.length;Le<Ke;Le++){const je=Pe[Le];dn(Se,ye,M,je)}Ye&&Ie.render(M);for(let Le=0,Ke=Pe.length;Le<Ke;Le++){const je=Pe[Le];wt(T,M,je,je.viewport)}}else ye.length>0&&dn(Se,ye,M,B),Ye&&Ie.render(M),wt(T,M,B)}K!==null&&O===0&&(Z.updateMultisampleRenderTarget(K),Z.updateRenderTargetMipmap(K)),V&&y.end(R),M.isScene===!0&&M.onAfterRender(R,M,B),xe.resetDefaultState(),te=-1,P=null,v.pop(),v.length>0?(A=v[v.length-1],Z.setTextureUnits(A.state.textureUnits),We===!0&&ue.setGlobalState(R.clippingPlanes,A.state.camera)):A=null,E.pop(),E.length>0?T=E[E.length-1]:T=null,L!==null&&L.renderEnd()};function bn(M,B,$,V){if(M.visible===!1)return;if(M.layers.test(B.layers)){if(M.isGroup)$=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(B);else if(M.isLightProbeGrid)A.pushLightProbeGrid(M);else if(M.isLight)A.pushLight(M),M.castShadow&&A.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||ke.intersectsSprite(M)){V&&vt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Y);const Se=Q.update(M),ye=M.material;ye.visible&&T.push(M,Se,ye,$,vt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||ke.intersectsObject(M))){const Se=Q.update(M),ye=M.material;if(V&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),vt.copy(M.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),vt.copy(Se.boundingSphere.center)),vt.applyMatrix4(M.matrixWorld).applyMatrix4(Y)),Array.isArray(ye)){const Pe=Se.groups;for(let Le=0,Ke=Pe.length;Le<Ke;Le++){const je=Pe[Le],Ne=ye[je.materialIndex];Ne&&Ne.visible&&T.push(M,Se,Ne,$,vt.z,je)}}else ye.visible&&T.push(M,Se,ye,$,vt.z,null)}}const ve=M.children;for(let Se=0,ye=ve.length;Se<ye;Se++)bn(ve[Se],B,$,V)}function wt(M,B,$,V){const{opaque:X,transmissive:ve,transparent:Se}=M;A.setupLightsView($),We===!0&&ue.setGlobalState(R.clippingPlanes,$),V&&x.viewport(ae.copy(V)),X.length>0&&En(X,B,$),ve.length>0&&En(ve,B,$),Se.length>0&&En(Se,B,$),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function dn(M,B,$,V){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[V.id]===void 0){const Ne=ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[V.id]=new ki(1,1,{generateMipmaps:!0,type:Ne?ar:fi,minFilter:Zr,samples:Math.max(4,C.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace})}const ve=A.state.transmissionRenderTarget[V.id],Se=V.viewport||ae;ve.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const ye=R.getRenderTarget(),Pe=R.getActiveCubeFace(),Le=R.getActiveMipmapLevel();R.setRenderTarget(ve),R.getClearColor(Xe),Be=R.getClearAlpha(),Be<1&&R.setClearColor(16777215,.5),R.clear(),Ye&&Ie.render($);const Ke=R.toneMapping;R.toneMapping=Bi;const je=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),A.setupLightsView(V),We===!0&&ue.setGlobalState(R.clippingPlanes,V),En(M,$,V),Z.updateMultisampleRenderTarget(ve),Z.updateRenderTargetMipmap(ve),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let St=0,Ht=B.length;St<Ht;St++){const Bt=B[St],{object:yt,geometry:pn,material:Ee,group:Vn}=Bt;if(Ee.side===Zi&&yt.layers.test(V.layers)){const ft=Ee.side;Ee.side=zn,Ee.needsUpdate=!0,$t(yt,$,V,pn,Ee,Vn),Ee.side=ft,Ee.needsUpdate=!0,Ne=!0}}Ne===!0&&(Z.updateMultisampleRenderTarget(ve),Z.updateRenderTargetMipmap(ve))}R.setRenderTarget(ye,Pe,Le),R.setClearColor(Xe,Be),je!==void 0&&(V.viewport=je),R.toneMapping=Ke}function En(M,B,$){const V=B.isScene===!0?B.overrideMaterial:null;for(let X=0,ve=M.length;X<ve;X++){const Se=M[X],{object:ye,geometry:Pe,group:Le}=Se;let Ke=Se.material;Ke.allowOverride===!0&&V!==null&&(Ke=V),ye.layers.test($.layers)&&$t(ye,B,$,Pe,Ke,Le)}}function $t(M,B,$,V,X,ve){M.onBeforeRender(R,B,$,V,X,ve),M.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),X.onBeforeRender(R,B,$,V,M,ve),X.transparent===!0&&X.side===Zi&&X.forceSinglePass===!1?(X.side=zn,X.needsUpdate=!0,R.renderBufferDirect($,B,V,X,M,ve),X.side=Ir,X.needsUpdate=!0,R.renderBufferDirect($,B,V,X,M,ve),X.side=Zi):R.renderBufferDirect($,B,V,X,M,ve),M.onAfterRender(R,B,$,V,X,ve)}function Ot(M,B,$){B.isScene!==!0&&(B=At);const V=W.get(M),X=A.state.lights,ve=A.state.shadowsArray,Se=X.state.version,ye=me.getParameters(M,X.state,ve,B,$,A.state.lightProbeGridArray),Pe=me.getProgramCacheKey(ye);let Le=V.programs;V.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?B.environment:null,V.fog=B.fog;const Ke=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;V.envMap=fe.get(M.envMap||V.environment,Ke),V.envMapRotation=V.environment!==null&&M.envMap===null?B.environmentRotation:M.envMapRotation,Le===void 0&&(M.addEventListener("dispose",Ce),Le=new Map,V.programs=Le);let je=Le.get(Pe);if(je!==void 0){if(V.currentProgram===je&&V.lightsStateVersion===Se)return Ei(M,ye),je}else ye.uniforms=me.getUniforms(M),L!==null&&M.isNodeMaterial&&L.build(M,$,ye),M.onBeforeCompile(ye,R),je=me.acquireProgram(ye,Pe),Le.set(Pe,je),V.uniforms=ye.uniforms;const Ne=V.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ne.clippingPlanes=ue.uniform),Ei(M,ye),V.needsLights=ri(M),V.lightsStateVersion=Se,V.needsLights&&(Ne.ambientLightColor.value=X.state.ambient,Ne.lightProbe.value=X.state.probe,Ne.directionalLights.value=X.state.directional,Ne.directionalLightShadows.value=X.state.directionalShadow,Ne.spotLights.value=X.state.spot,Ne.spotLightShadows.value=X.state.spotShadow,Ne.rectAreaLights.value=X.state.rectArea,Ne.ltc_1.value=X.state.rectAreaLTC1,Ne.ltc_2.value=X.state.rectAreaLTC2,Ne.pointLights.value=X.state.point,Ne.pointLightShadows.value=X.state.pointShadow,Ne.hemisphereLights.value=X.state.hemi,Ne.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ne.spotLightMatrix.value=X.state.spotLightMatrix,Ne.spotLightMap.value=X.state.spotLightMap,Ne.pointShadowMatrix.value=X.state.pointShadowMatrix),V.lightProbeGrid=A.state.lightProbeGridArray.length>0,V.currentProgram=je,V.uniformsList=null,je}function jt(M){if(M.uniformsList===null){const B=M.currentProgram.getUniforms();M.uniformsList=sl.seqWithValue(B.seq,M.uniforms)}return M.uniformsList}function Ei(M,B){const $=W.get(M);$.outputColorSpace=B.outputColorSpace,$.batching=B.batching,$.batchingColor=B.batchingColor,$.instancing=B.instancing,$.instancingColor=B.instancingColor,$.instancingMorph=B.instancingMorph,$.skinning=B.skinning,$.morphTargets=B.morphTargets,$.morphNormals=B.morphNormals,$.morphColors=B.morphColors,$.morphTargetsCount=B.morphTargetsCount,$.numClippingPlanes=B.numClippingPlanes,$.numIntersection=B.numClipIntersection,$.vertexAlphas=B.vertexAlphas,$.vertexTangents=B.vertexTangents,$.toneMapping=B.toneMapping}function ds(M,B){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;S.setFromMatrixPosition(B.matrixWorld);for(let $=0,V=M.length;$<V;$++){const X=M[$];if(X.texture!==null&&X.boundingBox.containsPoint(S))return X}return null}function sn(M,B,$,V,X){B.isScene!==!0&&(B=At),Z.resetTextureUnits();const ve=B.fog,Se=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?B.environment:null,ye=K===null?R.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ot.workingColorSpace,Pe=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Le=fe.get(V.envMap||Se,Pe),Ke=V.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,je=!!$.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ne=!!$.morphAttributes.position,St=!!$.morphAttributes.normal,Ht=!!$.morphAttributes.color;let Bt=Bi;V.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Bt=R.toneMapping);const yt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,pn=yt!==void 0?yt.length:0,Ee=W.get(V),Vn=A.state.lights;if(We===!0&&(Ge===!0||M!==P)){const Rt=M===P&&V.id===te;ue.setState(V,M,Rt)}let ft=!1;V.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==Vn.state.version||Ee.outputColorSpace!==ye||X.isBatchedMesh&&Ee.batching===!1||!X.isBatchedMesh&&Ee.batching===!0||X.isBatchedMesh&&Ee.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ee.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ee.instancing===!1||!X.isInstancedMesh&&Ee.instancing===!0||X.isSkinnedMesh&&Ee.skinning===!1||!X.isSkinnedMesh&&Ee.skinning===!0||X.isInstancedMesh&&Ee.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ee.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ee.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ee.instancingMorph===!1&&X.morphTexture!==null||Ee.envMap!==Le||V.fog===!0&&Ee.fog!==ve||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==ue.numPlanes||Ee.numIntersection!==ue.numIntersection)||Ee.vertexAlphas!==Ke||Ee.vertexTangents!==je||Ee.morphTargets!==Ne||Ee.morphNormals!==St||Ee.morphColors!==Ht||Ee.toneMapping!==Bt||Ee.morphTargetsCount!==pn||!!Ee.lightProbeGrid!=A.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Ee.__version=V.version);let si=Ee.currentProgram;ft===!0&&(si=Ot(V,B,X),L&&V.isNodeMaterial&&L.onUpdateProgram(V,si,Ee));let Ti=!1,cr=!1,ps=!1;const bt=si.getUniforms(),Vt=Ee.uniforms;if(x.useProgram(si.program)&&(Ti=!0,cr=!0,ps=!0),V.id!==te&&(te=V.id,cr=!0),Ee.needsLights){const Rt=ds(A.state.lightProbeGridArray,X);Ee.lightProbeGrid!==Rt&&(Ee.lightProbeGrid=Rt,cr=!0)}if(Ti||P!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),bt.setValue(U,"projectionMatrix",M.projectionMatrix),bt.setValue(U,"viewMatrix",M.matrixWorldInverse);const fr=bt.map.cameraPosition;fr!==void 0&&fr.setValue(U,ut.setFromMatrixPosition(M.matrixWorld)),C.logarithmicDepthBuffer&&bt.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&bt.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),P!==M&&(P=M,cr=!0,ps=!0)}if(Ee.needsLights&&(Vn.state.directionalShadowMap.length>0&&bt.setValue(U,"directionalShadowMap",Vn.state.directionalShadowMap,Z),Vn.state.spotShadowMap.length>0&&bt.setValue(U,"spotShadowMap",Vn.state.spotShadowMap,Z),Vn.state.pointShadowMap.length>0&&bt.setValue(U,"pointShadowMap",Vn.state.pointShadowMap,Z)),X.isSkinnedMesh){bt.setOptional(U,X,"bindMatrix"),bt.setOptional(U,X,"bindMatrixInverse");const Rt=X.skeleton;Rt&&(Rt.boneTexture===null&&Rt.computeBoneTexture(),bt.setValue(U,"boneTexture",Rt.boneTexture,Z))}X.isBatchedMesh&&(bt.setOptional(U,X,"batchingTexture"),bt.setValue(U,"batchingTexture",X._matricesTexture,Z),bt.setOptional(U,X,"batchingIdTexture"),bt.setValue(U,"batchingIdTexture",X._indirectTexture,Z),bt.setOptional(U,X,"batchingColorTexture"),X._colorsTexture!==null&&bt.setValue(U,"batchingColorTexture",X._colorsTexture,Z));const ur=$.morphAttributes;if((ur.position!==void 0||ur.normal!==void 0||ur.color!==void 0)&&I.update(X,$,si),(cr||Ee.receiveShadow!==X.receiveShadow)&&(Ee.receiveShadow=X.receiveShadow,bt.setValue(U,"receiveShadow",X.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&B.environment!==null&&(Vt.envMapIntensity.value=B.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=fb()),cr){if(bt.setValue(U,"toneMappingExposure",R.toneMappingExposure),Ee.needsLights&&Gt(Vt,ps),ve&&V.fog===!0&&we.refreshFogUniforms(Vt,ve),we.refreshMaterialUniforms(Vt,V,re,le,A.state.transmissionRenderTarget[M.id]),Ee.needsLights&&Ee.lightProbeGrid){const Rt=Ee.lightProbeGrid;Vt.probesSH.value=Rt.texture,Vt.probesMin.value.copy(Rt.boundingBox.min),Vt.probesMax.value.copy(Rt.boundingBox.max),Vt.probesResolution.value.copy(Rt.resolution)}sl.upload(U,jt(Ee),Vt,Z)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(sl.upload(U,jt(Ee),Vt,Z),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&bt.setValue(U,"center",X.center),bt.setValue(U,"modelViewMatrix",X.modelViewMatrix),bt.setValue(U,"normalMatrix",X.normalMatrix),bt.setValue(U,"modelMatrix",X.matrixWorld),V.uniformsGroups!==void 0){const Rt=V.uniformsGroups;for(let fr=0,ms=Rt.length;fr<ms;fr++){const Hf=Rt[fr];ne.update(Hf,si),ne.bind(Hf,si)}}return si}function Gt(M,B){M.ambientLightColor.needsUpdate=B,M.lightProbe.needsUpdate=B,M.directionalLights.needsUpdate=B,M.directionalLightShadows.needsUpdate=B,M.pointLights.needsUpdate=B,M.pointLightShadows.needsUpdate=B,M.spotLights.needsUpdate=B,M.spotLightShadows.needsUpdate=B,M.rectAreaLights.needsUpdate=B,M.hemisphereLights.needsUpdate=B}function ri(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(M,B,$){const V=W.get(M);V.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),W.get(M.texture).__webglTexture=B,W.get(M.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:$,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,B){const $=W.get(M);$.__webglFramebuffer=B,$.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(M,B=0,$=0){K=M,G=B,O=$;let V=null,X=!1,ve=!1;if(M){const ye=W.get(M);if(ye.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(U.FRAMEBUFFER,ye.__webglFramebuffer),ae.copy(M.viewport),de.copy(M.scissor),Ve=M.scissorTest,x.viewport(ae),x.scissor(de),x.setScissorTest(Ve),te=-1;return}else if(ye.__webglFramebuffer===void 0)Z.setupRenderTarget(M);else if(ye.__hasExternalTextures)Z.rebindTextures(M,W.get(M.texture).__webglTexture,W.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Ke=M.depthTexture;if(ye.__boundDepthTexture!==Ke){if(Ke!==null&&W.has(Ke)&&(M.width!==Ke.image.width||M.height!==Ke.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(M)}}const Pe=M.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(ve=!0);const Le=W.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Le[B])?V=Le[B][$]:V=Le[B],X=!0):M.samples>0&&Z.useMultisampledRTT(M)===!1?V=W.get(M).__webglMultisampledFramebuffer:Array.isArray(Le)?V=Le[$]:V=Le,ae.copy(M.viewport),de.copy(M.scissor),Ve=M.scissorTest}else ae.copy(Te).multiplyScalar(re).floor(),de.copy(rt).multiplyScalar(re).floor(),Ve=be;if($!==0&&(V=z),x.bindFramebuffer(U.FRAMEBUFFER,V)&&x.drawBuffers(M,V),x.viewport(ae),x.scissor(de),x.setScissorTest(Ve),X){const ye=W.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,ye.__webglTexture,$)}else if(ve){const ye=B;for(let Pe=0;Pe<M.textures.length;Pe++){const Le=W.get(M.textures[Pe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Pe,Le.__webglTexture,$,ye)}}else if(M!==null&&$!==0){const ye=W.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ye.__webglTexture,$)}te=-1},this.readRenderTargetPixels=function(M,B,$,V,X,ve,Se,ye=0){if(!(M&&M.isWebGLRenderTarget)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Pe=Pe[Se]),Pe){x.bindFramebuffer(U.FRAMEBUFFER,Pe);try{const Le=M.textures[ye],Ke=Le.format,je=Le.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ye),!C.textureFormatReadable(Ke)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(je)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=M.width-V&&$>=0&&$<=M.height-X&&U.readPixels(B,$,V,X,_e.convert(Ke),_e.convert(je),ve)}finally{const Le=K!==null?W.get(K).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(M,B,$,V,X,ve,Se,ye=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Pe=Pe[Se]),Pe)if(B>=0&&B<=M.width-V&&$>=0&&$<=M.height-X){x.bindFramebuffer(U.FRAMEBUFFER,Pe);const Le=M.textures[ye],Ke=Le.format,je=Le.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ye),!C.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ne),U.bufferData(U.PIXEL_PACK_BUFFER,ve.byteLength,U.STREAM_READ),U.readPixels(B,$,V,X,_e.convert(Ke),_e.convert(je),0);const St=K!==null?W.get(K).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,St);const Ht=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await N0(U,Ht,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ne),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ve),U.deleteBuffer(Ne),U.deleteSync(Ht),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,B=null,$=0){const V=Math.pow(2,-$),X=Math.floor(M.image.width*V),ve=Math.floor(M.image.height*V),Se=B!==null?B.x:0,ye=B!==null?B.y:0;Z.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,$,0,0,Se,ye,X,ve),x.unbindTexture()},this.copyTextureToTexture=function(M,B,$=null,V=null,X=0,ve=0){let Se,ye,Pe,Le,Ke,je,Ne,St,Ht;const Bt=M.isCompressedTexture?M.mipmaps[ve]:M.image;if($!==null)Se=$.max.x-$.min.x,ye=$.max.y-$.min.y,Pe=$.isBox3?$.max.z-$.min.z:1,Le=$.min.x,Ke=$.min.y,je=$.isBox3?$.min.z:0;else{const Vt=Math.pow(2,-X);Se=Math.floor(Bt.width*Vt),ye=Math.floor(Bt.height*Vt),M.isDataArrayTexture?Pe=Bt.depth:M.isData3DTexture?Pe=Math.floor(Bt.depth*Vt):Pe=1,Le=0,Ke=0,je=0}V!==null?(Ne=V.x,St=V.y,Ht=V.z):(Ne=0,St=0,Ht=0);const yt=_e.convert(B.format),pn=_e.convert(B.type);let Ee;B.isData3DTexture?(Z.setTexture3D(B,0),Ee=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Z.setTexture2DArray(B,0),Ee=U.TEXTURE_2D_ARRAY):(Z.setTexture2D(B,0),Ee=U.TEXTURE_2D),x.activeTexture(U.TEXTURE0),x.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),x.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),x.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);const Vn=x.getParameter(U.UNPACK_ROW_LENGTH),ft=x.getParameter(U.UNPACK_IMAGE_HEIGHT),si=x.getParameter(U.UNPACK_SKIP_PIXELS),Ti=x.getParameter(U.UNPACK_SKIP_ROWS),cr=x.getParameter(U.UNPACK_SKIP_IMAGES);x.pixelStorei(U.UNPACK_ROW_LENGTH,Bt.width),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Bt.height),x.pixelStorei(U.UNPACK_SKIP_PIXELS,Le),x.pixelStorei(U.UNPACK_SKIP_ROWS,Ke),x.pixelStorei(U.UNPACK_SKIP_IMAGES,je);const ps=M.isDataArrayTexture||M.isData3DTexture,bt=B.isDataArrayTexture||B.isData3DTexture;if(M.isDepthTexture){const Vt=W.get(M),ur=W.get(B),Rt=W.get(Vt.__renderTarget),fr=W.get(ur.__renderTarget);x.bindFramebuffer(U.READ_FRAMEBUFFER,Rt.__webglFramebuffer),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,fr.__webglFramebuffer);for(let ms=0;ms<Pe;ms++)ps&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(M).__webglTexture,X,je+ms),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(B).__webglTexture,ve,Ht+ms)),U.blitFramebuffer(Le,Ke,Se,ye,Ne,St,Se,ye,U.DEPTH_BUFFER_BIT,U.NEAREST);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(X!==0||M.isRenderTargetTexture||W.has(M)){const Vt=W.get(M),ur=W.get(B);x.bindFramebuffer(U.READ_FRAMEBUFFER,H),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,F);for(let Rt=0;Rt<Pe;Rt++)ps?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Vt.__webglTexture,X,je+Rt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Vt.__webglTexture,X),bt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ur.__webglTexture,ve,Ht+Rt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ur.__webglTexture,ve),X!==0?U.blitFramebuffer(Le,Ke,Se,ye,Ne,St,Se,ye,U.COLOR_BUFFER_BIT,U.NEAREST):bt?U.copyTexSubImage3D(Ee,ve,Ne,St,Ht+Rt,Le,Ke,Se,ye):U.copyTexSubImage2D(Ee,ve,Ne,St,Le,Ke,Se,ye);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else bt?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(Ee,ve,Ne,St,Ht,Se,ye,Pe,yt,pn,Bt.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(Ee,ve,Ne,St,Ht,Se,ye,Pe,yt,Bt.data):U.texSubImage3D(Ee,ve,Ne,St,Ht,Se,ye,Pe,yt,pn,Bt):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ve,Ne,St,Se,ye,yt,pn,Bt.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ve,Ne,St,Bt.width,Bt.height,yt,Bt.data):U.texSubImage2D(U.TEXTURE_2D,ve,Ne,St,Se,ye,yt,pn,Bt);x.pixelStorei(U.UNPACK_ROW_LENGTH,Vn),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ft),x.pixelStorei(U.UNPACK_SKIP_PIXELS,si),x.pixelStorei(U.UNPACK_SKIP_ROWS,Ti),x.pixelStorei(U.UNPACK_SKIP_IMAGES,cr),ve===0&&B.generateMipmaps&&U.generateMipmap(Ee),x.unbindTexture()},this.initRenderTarget=function(M){W.get(M).__webglFramebuffer===void 0&&Z.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Z.setTextureCube(M,0):M.isData3DTexture?Z.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Z.setTexture2DArray(M,0):Z.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){G=0,O=0,K=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}const db=new dt("#A8B0C4"),pb=["#FF7A45","#45C8FF","#FFD60A"].map(r=>new dt(r)),mb=`
attribute float aSize;
attribute vec4 aColor;
varying vec4 vColor;
uniform float uPixelRatio;
void main() {
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio;
}
`,gb=`
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;function _b({className:r}){const e=Ze.useRef(null);return Ze.useEffect(()=>{const t=e.current;if(!t)return;const n=t.parentElement;if(!n)return;const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=window.matchMedia("(pointer: coarse)").matches?117:350,o=new hb({canvas:t,alpha:!0,antialias:!1});o.setClearColor(0,0);const l=new K0,c=new If(-1,1,1,-1,-10,10),u=new bi,d=new Float32Array(a*3),f=new Float32Array(a),h=new Float32Array(a*4),g=[];let _=n.clientWidth,p=n.clientHeight;for(let z=0;z<a;z++){let H=db,F=.3;Math.random()>.6&&(H=pb[Math.floor(Math.random()*3)],F=.5),h[z*4]=H.r,h[z*4+1]=H.g,h[z*4+2]=H.b,h[z*4+3]=F,f[z]=1+Math.random()*2,g.push({bx:(Math.random()-.5)*_,by:(Math.random()-.5)*p,vy:2+Math.random()*4,phase:Math.random()*Math.PI*2,swayAmp:4+Math.random()*8,dx:0,dy:0})}u.setAttribute("position",new ti(d,3)),u.setAttribute("aSize",new ti(f,1)),u.setAttribute("aColor",new ti(h,4));const m=new yi({vertexShader:mb,fragmentShader:gb,transparent:!0,depthWrite:!1,blending:iu,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}}),b=new ax(u,m);l.add(b);const w=()=>{_=n.clientWidth,p=n.clientHeight,o.setSize(_,p,!1),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.left=-_/2,c.right=_/2,c.top=p/2,c.bottom=-p/2,c.updateProjectionMatrix()};w();const S={x:-9999,y:-9999},T=z=>{const H=t.getBoundingClientRect();S.x=z.clientX-H.left-_/2,S.y=-(z.clientY-H.top-p/2)},A=()=>{S.x=-9999,S.y=-9999};n.addEventListener("pointermove",T,{passive:!0}),n.addEventListener("pointerleave",A,{passive:!0});const E=new ResizeObserver(w);E.observe(n);let v=0,y=!0;const R=120,D=z=>{if(v=requestAnimationFrame(D),!y)return;const H=z/1e3;for(let F=0;F<a;F++){const G=g[F],O=G.bx+Math.sin(H*.4+G.phase)*G.swayAmp+G.dx,te=((G.by+H*G.vy+p/2)%(p+40)+p+40)%(p+40)-p/2-20+G.dy,P=O-S.x,ae=te-S.y,de=Math.hypot(P,ae);if(de<R&&de>.01){const Ve=(R-de)/R*1.6;G.dx+=P/de*Ve,G.dy+=ae/de*Ve}G.dx*=.95,G.dy*=.95,d[F*3]=O,d[F*3+1]=te,d[F*3+2]=0}u.attributes.position.needsUpdate=!0,o.render(l,c)},L=new IntersectionObserver(([z])=>{y=z.isIntersecting});if(L.observe(n),i){for(let z=0;z<a;z++)d[z*3]=g[z].bx,d[z*3+1]=g[z].by,d[z*3+2]=0;u.attributes.position.needsUpdate=!0,o.render(l,c)}else v=requestAnimationFrame(D);return()=>{cancelAnimationFrame(v),L.disconnect(),E.disconnect(),n.removeEventListener("pointermove",T),n.removeEventListener("pointerleave",A),u.dispose(),m.dispose(),o.dispose()}},[]),N.jsx("canvas",{"code-path":"src/pages/home/ParticleField.tsx:199:5",ref:e,className:r,style:{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"},"aria-hidden":!0})}const xb=Ze.memo(_b),ka=[.16,1,.3,1],Cd=[{id:6,name:"Charizard",type:"fire"},{id:3,name:"Venusaur",type:"grass"},{id:9,name:"Blastoise",type:"water"}],Wm=[{id:1,name:"Bulbasaur"},{id:4,name:"Charmander"},{id:7,name:"Squirtle"}];function Pd({text:r,started:e,baseDelay:t=0,gradient:n=!1}){return N.jsx("span",{"code-path":"src/pages/home/Hero.tsx:40:5","aria-label":r,className:"inline-block",children:Array.from(r).map((i,s)=>N.jsx("span",{"code-path":"src/pages/home/Hero.tsx:42:9","aria-hidden":!0,className:"inline-block overflow-hidden align-bottom",children:N.jsx(st.span,{"code-path":"src/pages/home/Hero.tsx:43:11",className:Fi("inline-block will-change-transform",n&&"text-gradient-alive"),initial:{y:60,rotate:6,opacity:0},animate:e?{y:0,rotate:0,opacity:1}:{},transition:{duration:.7,delay:t+s*.022,ease:ka},children:i===" "?" ":i})},s))})}function vb({started:r}){const[e,t]=Ze.useState(0);Ze.useEffect(()=>{if(!r||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=window.setInterval(()=>t(a=>(a+1)%Cd.length),6e3);return()=>window.clearInterval(s)},[r]);const n=Cd[e],i=Nt[n.type].rgb;return N.jsxs(st.div,{"code-path":"src/pages/home/Hero.tsx:71:5",className:"relative mx-auto h-[300px] w-[300px] lg:h-[480px] lg:w-[480px]",initial:{scale:.8,opacity:0},animate:r?{scale:1,opacity:1}:{},transition:{type:"spring",stiffness:180,damping:22,delay:.5},children:[N.jsx(ir,{"code-path":"src/pages/home/Hero.tsx:78:7",mode:"sync",children:N.jsx(st.div,{"code-path":"src/pages/home/Hero.tsx:79:9",className:"type-aura animate-breathe",style:{background:`radial-gradient(circle at 50% 55%, rgba(${i},0.38) 0%, rgba(${i},0.12) 42%, transparent 70%)`},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.6}},n.type)}),N.jsx("div",{"code-path":"src/pages/home/Hero.tsx:93:7",className:"absolute bottom-[9%] left-1/2 h-7 w-[62%] -translate-x-1/2 animate-breathe rounded-[50%] border border-gold/50",style:{boxShadow:"0 0 24px rgba(246,201,69,0.25), inset 0 0 18px rgba(246,201,69,0.12)"}}),N.jsx(ir,{"code-path":"src/pages/home/Hero.tsx:99:7",mode:"sync",children:N.jsx(st.img,{"code-path":"src/pages/home/Hero.tsx:100:9",src:vr.artwork(n.id),alt:`${n.name} — official artwork`,draggable:!1,className:"absolute inset-0 m-auto h-[88%] w-[88%] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0},transition:{duration:.6,ease:ka}},n.id)}),N.jsx("div",{"code-path":"src/pages/home/Hero.tsx:114:7",className:"absolute inset-0 hidden animate-spin-slow lg:block","aria-hidden":!0,children:Wm.map((s,a)=>N.jsx("div",{"code-path":"src/pages/home/Hero.tsx:116:11",className:"absolute left-1/2 top-1/2",style:{transform:`rotate(${a*120}deg) translateX(212px)`},children:N.jsx("div",{"code-path":"src/pages/home/Hero.tsx:121:13",className:"animate-spin-rev",children:N.jsx("div",{"code-path":"src/pages/home/Hero.tsx:122:15",style:{transform:`rotate(${-a*120}deg)`},children:N.jsx(st.div,{"code-path":"src/pages/home/Hero.tsx:123:17",initial:{scale:0},animate:r?{scale:1}:{},transition:{type:"spring",stiffness:420,damping:30,delay:.9+a*.12},children:N.jsx(ja,{"code-path":"src/pages/home/Hero.tsx:128:19",id:s.id,name:s.name,era:"gen5",skeleton:!1,className:"-ml-12 -mt-12 h-24 w-24"})})})})},s.id))})]})}function Sb({started:r}){const e=Id(),t=Ze.useRef(null),[n,i]=Ze.useState(!1),{scrollYProgress:s}=qm({target:t,offset:["start start","end start"]}),a=Ud(s,[0,.6],[0,48]),o=()=>{if(n)return;i(!0);const l=1+Math.floor(Math.random()*Fd);window.setTimeout(()=>e(`/pokemon/${l}`),500)};return N.jsxs("section",{"code-path":"src/pages/home/Hero.tsx:160:5",ref:t,className:"relative -mt-16 flex min-h-[100svh] items-center overflow-hidden",children:[N.jsx(j_,{"code-path":"src/pages/home/Hero.tsx:161:7"}),N.jsx(xb,{"code-path":"src/pages/home/Hero.tsx:162:7"}),N.jsxs(st.div,{"code-path":"src/pages/home/Hero.tsx:164:7",style:{y:a},className:"relative z-10 mx-auto grid w-full max-w-content gap-10 px-4 pb-24 pt-28 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-16",children:[N.jsxs("div",{"code-path":"src/pages/home/Hero.tsx:169:9",className:"lg:col-span-7",children:[N.jsx(st.p,{"code-path":"src/pages/home/Hero.tsx:170:11",className:"pixel-label text-[11px] text-gold",initial:{opacity:0,letterSpacing:"0.3em"},animate:r?{opacity:1,letterSpacing:"0.08em"}:{},transition:{duration:.4},children:"POKÉDEX 2.0 // PHASE 01 — CORE DEX"}),N.jsxs("h1",{"code-path":"src/pages/home/Hero.tsx:179:11",className:"mt-6 font-display text-[clamp(48px,8vw,96px)] font-black uppercase leading-[1.02] tracking-[0.01em]",children:[N.jsx(Pd,{"code-path":"src/pages/home/Hero.tsx:180:13",text:"EVERY POKÉMON.",started:r,baseDelay:.15}),N.jsx("br",{"code-path":"src/pages/home/Hero.tsx:181:13"}),N.jsx(Pd,{"code-path":"src/pages/home/Hero.tsx:182:13",text:"ALIVE.",started:r,baseDelay:.45,gradient:!0})]}),N.jsx(st.p,{"code-path":"src/pages/home/Hero.tsx:185:11",className:"mt-6 max-w-[56ch] font-sans text-lg leading-[1.6] text-tx-secondary",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.7,ease:ka},children:"An interactive, breathing companion for trainers. Browse 1,025 Pokémon across nine generations — watch stats come alive, trace evolution chains, and time-travel through every sprite era from 1996 to today."}),N.jsxs(st.div,{"code-path":"src/pages/home/Hero.tsx:196:11",className:"mt-8 flex flex-wrap items-center gap-4",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.79,ease:ka},children:[N.jsxs(Tl,{"code-path":"src/pages/home/Hero.tsx:202:13",to:"/pokedex",className:"group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-glow-gold active:scale-[0.97]",children:[N.jsx("span",{"code-path":"src/pages/home/Hero.tsx:206:15",className:"absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full"}),N.jsx("span",{"code-path":"src/pages/home/Hero.tsx:207:15",className:"relative",children:"Open the Pokédex"})]}),N.jsxs("button",{"code-path":"src/pages/home/Hero.tsx:209:13",type:"button",onClick:o,className:"inline-flex items-center gap-2 rounded-md border border-hairline2 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]",children:[N.jsx(st.span,{"code-path":"src/pages/home/Hero.tsx:214:15",animate:n?{rotate:360}:{rotate:0},transition:{duration:.5,ease:"easeInOut"},className:"inline-flex",children:N.jsx(fg,{"code-path":"src/pages/home/Hero.tsx:219:17",size:18,strokeWidth:1.75})}),"Surprise me"]})]}),N.jsx(st.p,{"code-path":"src/pages/home/Hero.tsx:225:11",className:"pixel-label mt-8 text-[9px] text-tx-muted",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.88,ease:ka},children:"1,025 POKÉMON · 18 TYPES · 9 GENERATIONS"})]}),N.jsxs("div",{"code-path":"src/pages/home/Hero.tsx:236:9",className:"lg:col-span-5",children:[N.jsx(vb,{"code-path":"src/pages/home/Hero.tsx:237:11",started:r}),N.jsx(st.div,{"code-path":"src/pages/home/Hero.tsx:239:11",className:"mt-4 flex items-center justify-center gap-6 lg:hidden",initial:{opacity:0},animate:r?{opacity:1}:{},transition:{delay:1,duration:.5},children:Wm.map(l=>N.jsx(ja,{"code-path":"src/pages/home/Hero.tsx:246:15",id:l.id,name:l.name,era:"gen5",skeleton:!1,className:"h-16 w-16"},l.id))})]})]}),N.jsxs(st.a,{"code-path":"src/pages/home/Hero.tsx:253:7",href:"#search-gateway",className:"absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-tx-muted transition-colors hover:text-gold",initial:{opacity:0},animate:r?{opacity:1}:{},transition:{delay:1.3,duration:.5},"aria-label":"Scroll to search",children:[N.jsx("span",{"code-path":"src/pages/home/Hero.tsx:261:9",className:"pixel-label text-[9px]",children:"SCROLL"}),N.jsx(ag,{"code-path":"src/pages/home/Hero.tsx:262:9",size:20,strokeWidth:1.75,className:"animate-cue-bounce"})]})]})}function Uf({children:r,className:e,delay:t=0,y:n=40}){return N.jsx(st.div,{"code-path":"src/pages/home/Reveal.tsx:15:5",className:e,initial:{opacity:0,y:n,filter:"blur(8px)"},whileInView:{opacity:1,y:0,filter:"blur(0px)"},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.6,delay:t,ease:[.16,1,.3,1]},children:r})}const Mb=["fire","water","grass","electric","psychic","dragon","ghost","fairy"];function yb(){return N.jsxs("section",{"code-path":"src/pages/home/SearchGateway.tsx:15:5",id:"search-gateway",className:"relative bg-abyss py-24",children:[N.jsx("div",{"code-path":"src/pages/home/SearchGateway.tsx:16:7",className:"absolute inset-x-0 top-0 h-px",style:{background:"linear-gradient(90deg, transparent, rgba(255,122,69,0.3), rgba(69,200,255,0.3), rgba(255,214,10,0.3), transparent)"}}),N.jsxs(Uf,{"code-path":"src/pages/home/SearchGateway.tsx:23:7",className:"mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-4",children:[N.jsx("span",{"code-path":"src/pages/home/SearchGateway.tsx:24:9",className:"pixel-label text-[10px] text-gold",children:"DIRECT ACCESS"}),N.jsx("h2",{"code-path":"src/pages/home/SearchGateway.tsx:25:9",className:"text-center font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:"Find your Pokémon"}),N.jsx($m,{"code-path":"src/pages/home/SearchGateway.tsx:29:9",variant:"inline",className:"w-full"}),N.jsxs("div",{"code-path":"src/pages/home/SearchGateway.tsx:31:9",className:"flex flex-wrap items-center justify-center gap-2",children:[N.jsx("span",{"code-path":"src/pages/home/SearchGateway.tsx:32:11",className:"pixel-label mr-1 text-[9px] text-tx-muted",children:"POPULAR:"}),Mb.map((r,e)=>N.jsx(st.div,{"code-path":"src/pages/home/SearchGateway.tsx:34:13",initial:{scale:.8,opacity:0},whileInView:{scale:1,opacity:1},viewport:{once:!0,margin:"-10% 0px"},transition:{type:"spring",stiffness:420,damping:30,delay:.15+e*.04},children:N.jsxs(Tl,{"code-path":"src/pages/home/SearchGateway.tsx:41:15",to:`/pokedex?type=${r}`,"data-type":r,className:"inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface2 px-3 py-1.5 font-sans text-xs font-semibold capitalize text-tx-secondary transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-[rgba(var(--t),0.8)] hover:bg-[rgba(var(--t),0.18)] hover:text-[rgb(var(--t))] hover:shadow-[0_0_16px_rgba(var(--t),0.35)]",style:{"--t":Nt[r].rgb},children:[N.jsx(El,{"code-path":"src/pages/home/SearchGateway.tsx:47:17",type:r,size:16}),r]})},r))]})]})]})}const Cc=[.16,1,.3,1];function bb(){const r=new Date;return Math.floor((r.getTime()-new Date(r.getFullYear(),0,0).getTime())/864e5)}function Eb(r){return(bb()+r)*137%Fd+1}function Tb({burstKey:r}){const e=Ze.useMemo(()=>Array.from({length:8},(t,n)=>{const i=n/8*Math.PI*2+Math.random()*.5,s=60+Math.random()*60;return{x:Math.cos(i)*s,y:Math.sin(i)*s}}),[r]);return r===0?null:N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:48:5",className:"pointer-events-none absolute inset-0 z-20","aria-hidden":!0,children:e.map((t,n)=>N.jsx(st.img,{"code-path":"src/pages/home/Spotlight.tsx:50:9",src:"/sparkle.svg",alt:"",className:"absolute left-1/2 top-1/2 h-4 w-4",initial:{x:0,y:0,scale:0,opacity:1},animate:{x:t.x,y:t.y,scale:[0,1,0],opacity:[1,1,0]},transition:{duration:.7,delay:n*.03,ease:"easeOut"}},n))},r)}function Ab(){const[r,e]=Ze.useState(0),t=Eb(r),[n,i]=Ze.useState(null),[s,a]=Ze.useState(null),[o,l]=Ze.useState(!1),[c,u]=Ze.useState(0),[d,f]=Ze.useState(t);d!==t&&(f(t),i(null),a(null),l(!1)),Ze.useEffect(()=>{let R=!0;return Promise.all([Km(t),Zm(t)]).then(([D,L])=>{R&&(i(D),a(L))}).catch(()=>{}),()=>{R=!1}},[t]);const h=Ze.useRef(null),g=Lc(0),_=Lc(0),p=Vf(g,{stiffness:180,damping:22}),m=Vf(_,{stiffness:180,damping:22}),[b,w]=Ze.useState({x:50,y:50,o:0}),S=R=>{const D=h.current?.getBoundingClientRect();if(!D)return;const L=(R.clientX-D.left)/D.width,z=(R.clientY-D.top)/D.height;_.set((L-.5)*8),g.set(-(z-.5)*8),w({x:L*100,y:z*100,o:1})},T=()=>{g.set(0),_.set(0),w(R=>({...R,o:0}))},A=(n?.types??[]).sort((R,D)=>R.slot-D.slot).map(R=>R.type.name),E=A[0]??"normal",v=A[1]??E,y=s?.is_legendary||s?.is_mythical;return N.jsx("section",{"code-path":"src/pages/home/Spotlight.tsx:126:5",className:"mx-auto max-w-content px-4 py-24 md:px-8",children:N.jsxs(st.div,{"code-path":"src/pages/home/Spotlight.tsx:127:7",initial:{clipPath:"inset(12% 8% 12% 8% round 24px)",opacity:.4},whileInView:{clipPath:"inset(0% 0% 0% 0% round 24px)",opacity:1},viewport:{once:!0,margin:"-25% 0px"},transition:{duration:.9,ease:Cc},className:Fi("relative overflow-hidden rounded-xl border border-hairline bg-surface1",y&&"legendary-ring"),children:[N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:138:9","aria-hidden":!0,className:"absolute inset-0 transition-[background] duration-700",style:{background:`radial-gradient(640px 420px at 18% 30%, rgba(${Nt[E].rgb},0.18), transparent 70%), radial-gradient(560px 400px at 85% 75%, rgba(${Nt[v].rgb},0.14), transparent 70%)`}}),N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:145:9",className:"grain-overlay absolute inset-0"}),N.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:147:9",className:"relative grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-6",children:[N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:149:11",className:"lg:col-span-5",children:N.jsxs(st.div,{"code-path":"src/pages/home/Spotlight.tsx:150:13",ref:h,onPointerMove:S,onPointerLeave:T,className:"relative mx-auto aspect-square w-full max-w-[400px]",initial:{x:-40,opacity:0,filter:"blur(12px)"},whileInView:{x:0,opacity:1,filter:"blur(0px)"},viewport:{once:!0,margin:"-25% 0px"},transition:{duration:.7,ease:Cc},style:{perspective:800},children:[N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:161:15",className:"type-aura animate-breathe",style:{background:`radial-gradient(circle at 50% 55%, rgba(${Nt[E].rgb},0.38) 0%, rgba(${Nt[E].rgb},0.12) 42%, transparent 70%)`}}),N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:167:15",className:"absolute bottom-[8%] left-1/2 h-6 w-[58%] -translate-x-1/2 animate-breathe rounded-[50%] border border-gold/40"}),N.jsx(ir,{"code-path":"src/pages/home/Spotlight.tsx:168:15",mode:"sync",children:N.jsxs(st.div,{"code-path":"src/pages/home/Spotlight.tsx:169:17",className:"absolute inset-0",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},style:{rotateX:p,rotateY:m},children:[n&&N.jsx("img",{"code-path":"src/pages/home/Spotlight.tsx:179:21",src:o?vr.artworkShiny(t):vr.artwork(t),alt:`${Wf(n.name)} — official artwork${o?" (shiny)":""}`,draggable:!1,className:"h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"}),!n&&N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:187:21",className:"grid h-full w-full place-items-center",children:N.jsx(Od,{"code-path":"src/pages/home/Spotlight.tsx:188:23",variant:"inline"})})]},t+String(o))}),N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:194:15","aria-hidden":!0,className:"pointer-events-none absolute inset-0 transition-opacity duration-300",style:{opacity:b.o,background:`radial-gradient(240px 240px at ${b.x}% ${b.y}%, rgba(255,255,255,0.10), transparent 70%)`}}),N.jsx(Tb,{"code-path":"src/pages/home/Spotlight.tsx:202:15",burstKey:c}),N.jsx("button",{"code-path":"src/pages/home/Spotlight.tsx:204:15",type:"button","aria-pressed":o,"aria-label":"Toggle shiny artwork",onClick:()=>{l(R=>!R),u(R=>R+1)},className:Fi("absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-md border transition-all duration-200",o?"border-gold/60 bg-gold-soft text-gold shadow-glow-gold":"border-hairline bg-surface2/80 text-tx-muted hover:border-hairline2 hover:text-gold"),children:N.jsx(Jm,{"code-path":"src/pages/home/Spotlight.tsx:219:17",size:18,strokeWidth:1.75})})]})}),N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:225:11",className:"flex flex-col justify-center gap-4 lg:col-span-7",children:N.jsx(ir,{"code-path":"src/pages/home/Spotlight.tsx:226:13",mode:"wait",children:N.jsx(st.div,{"code-path":"src/pages/home/Spotlight.tsx:227:15",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.4},className:"flex flex-col gap-4",children:[N.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:236:19",className:"pixel-label text-[11px] text-gold",children:jm(t)},"num"),N.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:239:19",children:[N.jsx("h2",{"code-path":"src/pages/home/Spotlight.tsx:240:21",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:n?Wf(n.name):"…"}),N.jsx("p",{"code-path":"src/pages/home/Spotlight.tsx:243:21",className:"mt-1 font-sans text-base italic text-tx-secondary",children:s?Qm(s):" "})]},"name"),N.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:247:19",className:"flex flex-wrap gap-2",children:A.map(R=>N.jsx(eg,{"code-path":"src/pages/home/Spotlight.tsx:249:23",type:R,glow:!0},R))},"types"),N.jsx("p",{"code-path":"src/pages/home/Spotlight.tsx:252:19",className:"max-w-[62ch] font-sans text-base leading-[1.55] text-tx-secondary",children:s?tg(s):"Catching data from the tall grass…"},"flavor"),N.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:255:19",className:"flex max-w-[440px] flex-col gap-2.5",children:[N.jsx(Wo,{"code-path":"src/pages/home/Spotlight.tsx:256:21",label:"HP",value:n?Ul(n,"hp"):0,type:E}),N.jsx(Wo,{"code-path":"src/pages/home/Spotlight.tsx:257:21",label:"ATK",value:n?Ul(n,"attack"):0,type:E,delay:80}),N.jsx(Wo,{"code-path":"src/pages/home/Spotlight.tsx:258:21",label:"DEF",value:n?Ul(n,"defense"):0,type:E,delay:160})]},"stats"),N.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:260:19",className:"mt-2 flex flex-wrap gap-4",children:[N.jsxs(Tl,{"code-path":"src/pages/home/Spotlight.tsx:261:21",to:`/pokemon/${t}`,className:"group relative inline-flex items-center gap-2 overflow-hidden rounded-md border px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]",style:{borderColor:`rgba(${Nt[E].rgb},0.6)`,background:`linear-gradient(135deg, rgba(${Nt[E].rgb},0.25), rgba(${Nt[E].rgb},0.10))`,boxShadow:`0 0 0 rgba(${Nt[E].rgb},0)`},children:[N.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:270:23",className:"absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full"}),N.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:271:23",className:"relative",children:"View full entry →"})]}),N.jsx("button",{"code-path":"src/pages/home/Spotlight.tsx:273:21",type:"button",onClick:()=>e(R=>R+1),className:"rounded-md border border-hairline2 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]",children:"Next spotlight"})]},"cta")].map((R,D)=>N.jsx(st.div,{"code-path":"src/pages/home/Spotlight.tsx:282:19",initial:{y:24,opacity:0},whileInView:{y:0,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.5,delay:D*.08,ease:Cc},children:R},R.key))},t)})})]})]})})}const wb=[.16,1,.3,1],Pc=()=>typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches;function Rb(){const r=Id(),[e,t]=Ze.useState(null),n=i=>{if(Pc()&&e!==i){t(i);return}r(`/pokedex?type=${i}`)};return N.jsxs("section",{"code-path":"src/pages/home/TypeSpectrum.tsx:29:5",className:"mx-auto max-w-content px-4 py-24 md:px-8",children:[N.jsxs(Uf,{"code-path":"src/pages/home/TypeSpectrum.tsx:30:7",className:"mb-12 flex flex-col items-center gap-4 text-center",children:[N.jsx("span",{"code-path":"src/pages/home/TypeSpectrum.tsx:31:9",className:"pixel-label text-[10px] text-gold",children:"TYPE SPECTRUM"}),N.jsx("h2",{"code-path":"src/pages/home/TypeSpectrum.tsx:32:9",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:"Eighteen Energies"}),N.jsx("p",{"code-path":"src/pages/home/TypeSpectrum.tsx:35:9",className:"max-w-[52ch] font-sans text-base text-tx-secondary",children:"Every Pokémon channels one or two elemental energies. Pick one."})]}),N.jsx("div",{"code-path":"src/pages/home/TypeSpectrum.tsx:41:7",className:"flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0",children:ng.map((i,s)=>{const a=Math.floor(s/6),o=s%6,l=Math.abs(a-1)+Math.abs(o-2.5),c=e===i,u=Nt[i].rgb;return N.jsxs(st.button,{"code-path":"src/pages/home/TypeSpectrum.tsx:49:13",type:"button","data-type":i,onClick:()=>n(i),onMouseEnter:()=>!Pc()&&t(i),onMouseLeave:()=>!Pc()&&t(null),className:Fi("group relative flex h-24 w-24 shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-md border sm:h-24 sm:w-auto","transition-colors duration-300 focus-visible:border-[rgba(var(--t),0.8)]",c?"border-[rgba(var(--t),0.6)]":"border-hairline bg-surface1"),style:{"--t":u,background:c?`radial-gradient(circle at 50% 60%, rgba(${u},0.22), transparent 75%)`:void 0,backgroundColor:void 0},initial:{scale:.6,opacity:0},whileInView:{scale:1,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.5,delay:l*.035,ease:wb},children:[N.jsx(ir,{"code-path":"src/pages/home/TypeSpectrum.tsx:74:15",children:c&&N.jsx("div",{"code-path":"src/pages/home/TypeSpectrum.tsx:76:19",className:"pointer-events-none absolute -top-14 left-1/2 z-20 hidden -translate-x-1/2 gap-1 sm:flex",children:ig[i].map((d,f)=>N.jsx(st.div,{"code-path":"src/pages/home/TypeSpectrum.tsx:78:23",initial:{scale:0,y:8},animate:{scale:1,y:[8,-4,0]},exit:{scale:0,opacity:0},transition:{type:"spring",stiffness:420,damping:30,delay:f*.06},children:N.jsx(ja,{"code-path":"src/pages/home/TypeSpectrum.tsx:85:25",id:d,name:i,era:"gen5",skeleton:!1,className:"h-12 w-12"})},d))})}),N.jsx(st.span,{"code-path":"src/pages/home/TypeSpectrum.tsx:92:15",animate:c?{scale:[1,1.18,.96,1],rotate:[0,-4,3,0]}:{scale:1,rotate:0},transition:{duration:.3},className:Fi("transition-all duration-300",c?"text-[rgb(var(--t))] opacity-100 drop-shadow-[0_0_12px_rgba(var(--t),0.8)]":"text-tx-secondary opacity-35 grayscale"),style:{"--t":u},children:N.jsx(El,{"code-path":"src/pages/home/TypeSpectrum.tsx:103:17",type:i,size:32})}),N.jsx("span",{"code-path":"src/pages/home/TypeSpectrum.tsx:105:15",className:Fi("pixel-label text-[9px] transition-colors duration-300",c?"text-[rgb(var(--t))]":"text-tx-muted"),style:{"--t":u},children:i})]},i)})})]})}const Dd=[.16,1,.3,1],Cb=[`rgb(${Nt.grass.rgb})`,`rgb(${Nt.fire.rgb})`,`rgb(${Nt.water.rgb})`,`rgb(${Nt.grass.rgb})`];function Pb(){const r=Ze.useRef(null),e=Ze.useRef(null),t=Lc(0),[n,i]=Ze.useState(0),s=Ud(t,o=>n>0?Math.min(1,Math.max(0,-o/n)):0);Ze.useEffect(()=>{const o=()=>{const c=e.current,u=r.current;!c||!u||i(Math.max(0,c.scrollWidth-u.clientWidth))};o();const l=new ResizeObserver(o);return r.current&&l.observe(r.current),()=>l.disconnect()},[]);const a=o=>{const l=Math.min(0,Math.max(-n,t.get()+o*-344));Ku(t,l,{duration:.4,ease:Dd})};return N.jsxs("section",{"code-path":"src/pages/home/GenerationsRail.tsx:48:5",className:"py-24",children:[N.jsxs(Uf,{"code-path":"src/pages/home/GenerationsRail.tsx:49:7",className:"mx-auto mb-10 flex max-w-content flex-wrap items-end justify-between gap-6 px-4 md:px-8",children:[N.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:50:9",className:"flex flex-col gap-4",children:[N.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:51:11",className:"pixel-label text-[10px] text-gold",children:"1996 → 2022"}),N.jsx("h2",{"code-path":"src/pages/home/GenerationsRail.tsx:52:11",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:"Nine Generations"})]}),N.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:56:9",className:"flex items-center gap-4",children:[N.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:57:11",className:"pixel-label hidden text-[9px] text-tx-muted sm:block",children:"DRAG ⟶"}),N.jsx("button",{"code-path":"src/pages/home/GenerationsRail.tsx:58:11",type:"button",onClick:()=>a(-1),"aria-label":"Previous generation",className:"grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold",children:N.jsx(og,{"code-path":"src/pages/home/GenerationsRail.tsx:64:13",size:18,strokeWidth:1.75})}),N.jsx("button",{"code-path":"src/pages/home/GenerationsRail.tsx:66:11",type:"button",onClick:()=>a(1),"aria-label":"Next generation",className:"grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold",children:N.jsx(lg,{"code-path":"src/pages/home/GenerationsRail.tsx:72:13",size:18,strokeWidth:1.75})})]})]}),N.jsxs(st.div,{"code-path":"src/pages/home/GenerationsRail.tsx:77:7",initial:{x:60,opacity:0},whileInView:{x:0,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.7,ease:Dd},children:[N.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:83:9",ref:r,className:"overflow-hidden",children:N.jsx(st.div,{"code-path":"src/pages/home/GenerationsRail.tsx:84:11",ref:e,drag:"x",style:{x:t},dragConstraints:{left:-n,right:0},dragTransition:{power:.4,timeConstant:220},className:"flex cursor-grab gap-6 px-4 active:cursor-grabbing md:px-8",children:rg.map(o=>{const l=o.range[1]-o.range[0]+1,c=o.gen<=5?"gen5":"home";return N.jsxs(Tl,{"code-path":"src/pages/home/GenerationsRail.tsx:96:17",to:`/pokedex?gen=${o.gen}`,draggable:!1,onDragStart:u=>u.preventDefault(),className:"group relative flex h-[360px] w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-surface1 p-6 transition-transform duration-300 ease-out-expo hover:-translate-y-1.5 sm:w-[320px]",children:[N.jsx(st.div,{"code-path":"src/pages/home/GenerationsRail.tsx:104:19","aria-hidden":!0,className:"pointer-events-none absolute inset-0 rounded-lg border opacity-0 transition-opacity duration-300 group-hover:opacity-100",animate:{borderColor:Cb},transition:{duration:3,repeat:1/0,ease:"linear"}}),N.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:111:19","aria-hidden":!0,className:"absolute -right-2 -top-4 select-none font-display text-8xl font-black text-tx-primary/[0.08]",children:o.roman}),N.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:118:19",className:"flex items-baseline justify-between",children:[N.jsxs("span",{"code-path":"src/pages/home/GenerationsRail.tsx:119:21",className:"pixel-label text-[10px] text-gold",children:["GEN ",o.roman]}),N.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:120:21",className:"font-sans text-xs font-medium text-tx-muted",children:o.year})]}),N.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:123:19",className:"flex items-end justify-center gap-2",children:o.starters.map((u,d)=>N.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:125:23",className:"group-hover:animate-[hop_0.42s_ease-in-out]",style:{animationDelay:`${d*100}ms`},children:N.jsx(ja,{"code-path":"src/pages/home/GenerationsRail.tsx:130:25",id:u,name:`Gen ${o.roman} starter`,era:c,skeleton:!1,className:"h-20 w-20 sm:h-24 sm:w-24"})},u))}),N.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:135:19",children:[N.jsx("h3",{"code-path":"src/pages/home/GenerationsRail.tsx:136:21",className:"font-sans text-lg font-bold text-tx-primary transition-colors duration-200 group-hover:text-gold",children:o.region}),N.jsxs("span",{"code-path":"src/pages/home/GenerationsRail.tsx:139:21",className:"pixel-label mt-1 block text-[9px] text-tx-muted",children:[l," POKÉMON"]})]})]},o.gen)})})}),N.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:150:9",className:"mx-4 mt-6 h-0.5 overflow-hidden rounded-pill bg-surface3 md:mx-8",children:N.jsx(st.div,{"code-path":"src/pages/home/GenerationsRail.tsx:151:11",className:"h-full origin-left bg-gradient-to-r from-gold to-type-fire",style:{scaleX:s}})})]})]})}const Ff=[.16,1,.3,1],Db=[{id:1,name:"Bulbasaur",types:["grass","poison"]},{id:2,name:"Ivysaur",types:["grass","poison"]},{id:3,name:"Venusaur",types:["grass","poison"]},{id:4,name:"Charmander",types:["fire"]},{id:5,name:"Charmeleon",types:["fire"]},{id:6,name:"Charizard",types:["fire","flying"]}],Lb=["grass","fire","water"];function Nb({live:r}){const[e,t]=Ze.useState(null),n=Db.filter(i=>!e||i.types.includes(e));return N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:32:5",className:"flex flex-col gap-3",children:[N.jsx("div",{"code-path":"src/pages/home/Features.tsx:33:7",className:"flex gap-2",children:Lb.map(i=>{const s=e===i;return N.jsxs("button",{"code-path":"src/pages/home/Features.tsx:37:13",type:"button","aria-pressed":s,onClick:()=>t(s?null:i),className:Fi("inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 font-sans text-xs font-semibold capitalize transition-all duration-200",s?"-translate-y-0.5 border-[rgba(var(--t),0.8)] bg-[rgba(var(--t),0.18)] text-[rgb(var(--t))] shadow-[0_0_12px_rgba(var(--t),0.35)]":"border-hairline bg-surface2 text-tx-muted hover:text-tx-secondary"),style:{"--t":Nt[i].rgb},children:[N.jsx(El,{"code-path":"src/pages/home/Features.tsx:50:15",type:i,size:14}),i]},i)})}),N.jsxs(st.div,{"code-path":"src/pages/home/Features.tsx:56:7",layout:!0,className:"grid min-h-[148px] grid-cols-3 content-start gap-2",children:[N.jsx(ir,{"code-path":"src/pages/home/Features.tsx:57:9",mode:"popLayout",children:n.map(i=>N.jsxs(st.div,{"code-path":"src/pages/home/Features.tsx:59:13",layout:!0,initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},transition:{duration:.25,ease:Ff},className:"relative flex flex-col items-center gap-1 rounded-md border border-hairline bg-surface2 p-2",children:[N.jsx("div",{"code-path":"src/pages/home/Features.tsx:68:15","aria-hidden":!0,className:"absolute inset-x-2 top-1 h-8 rounded-full blur-md",style:{background:`rgba(${Nt[i.types[0]].rgb},0.25)`}}),N.jsx(ja,{"code-path":"src/pages/home/Features.tsx:73:15",id:i.id,name:i.name,era:"gen5",skeleton:!1,eager:r,className:"relative h-14 w-14"}),N.jsx("span",{"code-path":"src/pages/home/Features.tsx:74:15",className:"font-sans text-[11px] font-semibold text-tx-secondary",children:i.name})]},i.id))}),n.length===0&&N.jsxs(st.div,{"code-path":"src/pages/home/Features.tsx:79:11",initial:{opacity:0},animate:{opacity:1},className:"col-span-3 flex flex-col items-center gap-2 py-6",children:[N.jsx("img",{"code-path":"src/pages/home/Features.tsx:84:13",src:"/empty-dex.svg",alt:"",className:"h-14 w-auto opacity-70"}),N.jsx("span",{"code-path":"src/pages/home/Features.tsx:85:13",className:"font-sans text-xs font-medium text-gold",children:"No water types in this mini set."})]})]})]})}const Ld={hp:35,attack:55,defense:40,"special-attack":50,"special-defense":50,speed:90};function Ib({values:r,prog:e}){const t=Ze.useRef(null),n=62,i=80;Ze.useEffect(()=>{const a=r.map((o,l)=>{const c=(-90+l*60)*(Math.PI/180),u=o/180*n*e;return`${i+Math.cos(c)*u},${i+Math.sin(c)*u}`}).join(" ");t.current?.setAttribute("points",a)},[r,e]);const s=[.33,.66,1];return N.jsxs("svg",{"code-path":"src/pages/home/Features.tsx:120:5",viewBox:"0 0 160 160",className:"h-[160px] w-[160px]",children:[s.map(a=>N.jsx("polygon",{"code-path":"src/pages/home/Features.tsx:122:9",points:Array.from({length:6},(o,l)=>{const c=(-90+l*60)*(Math.PI/180);return`${i+Math.cos(c)*n*a},${i+Math.sin(c)*n*a}`}).join(" "),fill:"none",stroke:"rgba(255,255,255,0.08)",strokeWidth:"1"},a)),Array.from({length:6},(a,o)=>{const l=(-90+o*60)*(Math.PI/180);return N.jsx("line",{"code-path":"src/pages/home/Features.tsx:136:11",x1:i,y1:i,x2:i+Math.cos(l)*n,y2:i+Math.sin(l)*n,stroke:"rgba(255,255,255,0.08)",strokeWidth:"1"},o)}),N.jsx("polygon",{"code-path":"src/pages/home/Features.tsx:147:7",ref:t,fill:"rgba(255,214,10,0.25)",stroke:"#FFD60A",strokeWidth:"1.5"})]})}function Ub({live:r}){const[e,t]=Ze.useState("bars"),[n,i]=Ze.useState(0),[s,a]=Ze.useState(0);Ze.useEffect(()=>{if(!r||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const l=window.setInterval(()=>i(c=>c+1),4e3);return()=>window.clearInterval(l)},[r]),Ze.useEffect(()=>{if(e!=="radar")return;const l=Ku(0,1,{duration:.6,ease:Ff,onUpdate:a});return()=>l.stop()},[e,n]);const o=Xf.map(l=>Ld[l]);return N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:175:5",className:"flex flex-col gap-3",children:[N.jsx("div",{"code-path":"src/pages/home/Features.tsx:176:7",className:"relative flex w-fit rounded-pill border border-hairline bg-surface1 p-1",children:["bars","radar"].map(l=>N.jsxs("button",{"code-path":"src/pages/home/Features.tsx:178:11",type:"button","aria-pressed":e===l,onClick:()=>t(l),className:Fi("relative rounded-pill px-3 py-1 font-sans text-[13px] font-semibold capitalize transition-colors",e===l?"text-gold":"text-tx-muted hover:text-tx-secondary"),children:[e===l&&N.jsx(st.span,{"code-path":"src/pages/home/Features.tsx:189:15",layoutId:"stats-thumb",className:"absolute inset-0 rounded-pill border border-gold/50 bg-surface3",transition:{type:"spring",stiffness:420,damping:30}}),N.jsx("span",{"code-path":"src/pages/home/Features.tsx:195:13",className:"relative",children:l})]},l))}),N.jsx("div",{"code-path":"src/pages/home/Features.tsx:199:7",className:"grid min-h-[148px] place-items-center",children:N.jsx(ir,{"code-path":"src/pages/home/Features.tsx:200:9",mode:"wait",children:e==="bars"?N.jsx(st.div,{"code-path":"src/pages/home/Features.tsx:202:13",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:"flex w-full flex-col gap-2",children:Xf.map((l,c)=>N.jsx(Wo,{"code-path":"src/pages/home/Features.tsx:211:17",label:sg[l],value:Ld[l],type:"electric",delay:c*60},l))},`bars-${n}`):N.jsx(st.div,{"code-path":"src/pages/home/Features.tsx:215:13",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0},transition:{duration:.3},children:N.jsx(Ib,{"code-path":"src/pages/home/Features.tsx:222:15",values:o,prog:s})},`radar-${n}`)})})]})}const Dc=[{year:1996,label:"GEN I",era:"gen1",rgb:Nt.normal.rgb},{year:1999,label:"GEN II",era:"gen2",rgb:Nt.electric.rgb},{year:2004,label:"GEN IV",era:"gen4",rgb:Nt.grass.rgb},{year:2010,label:"GEN V",era:"gen5",rgb:Nt.water.rgb},{year:2016,label:"3D ERA",era:"showdown",rgb:Nt.fire.rgb}];function Fb(){const[r,e]=Ze.useState(0),t=Dc[r],n=t.era==="gen1"?vr.gen1RedBlue(25):t.era==="gen2"?vr.gen2Crystal(25):t.era==="gen4"?vr.gen4Platinum(25):t.era==="gen5"?vr.gen5Animated(25):vr.showdown(25);return N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:256:5",className:"flex flex-col gap-3",children:[N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:257:7",className:"relative mx-auto grid h-[148px] w-[148px] place-items-center",children:[N.jsx("div",{"code-path":"src/pages/home/Features.tsx:259:9","aria-hidden":!0,className:"absolute bottom-4 h-5 w-24 rounded-[50%] blur-[6px] transition-colors duration-500",style:{background:`rgba(${t.rgb},0.35)`,boxShadow:`0 0 24px rgba(${t.rgb},0.4)`}}),N.jsx(ir,{"code-path":"src/pages/home/Features.tsx:264:9",mode:"sync",children:N.jsx(st.img,{"code-path":"src/pages/home/Features.tsx:265:11",src:n,alt:`Pikachu — ${t.label} sprite`,draggable:!1,className:Fi("relative h-24 w-24 object-contain",t.era!=="showdown"&&"pixelated"),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.25}},t.year)})]}),N.jsx("input",{"code-path":"src/pages/home/Features.tsx:278:7",type:"range",min:0,max:Dc.length-1,step:1,value:r,onChange:i=>e(Number(i.target.value)),"aria-label":"Sprite era scrubber",className:"w-full accent-gold"}),N.jsx("div",{"code-path":"src/pages/home/Features.tsx:288:7",className:"flex justify-between",children:Dc.map((i,s)=>N.jsx("button",{"code-path":"src/pages/home/Features.tsx:290:11",type:"button",onClick:()=>e(s),className:Fi("pixel-label text-[8px] transition-colors",s===r?"text-gold":"text-tx-muted hover:text-tx-secondary"),children:i.year},i.year))})]})}const Ob=[{title:"Filter in a flash",caption:"Type, generation, region — the whole dex reshuffles instantly.",Demo:Nb},{title:"Stats that move",caption:"Base stats fill, count, and morph — numbers you can feel.",Demo:Ub},{title:"Sprite Museum",caption:"From 1996 pixels to 3D-era GIFs — every sprite era, one gallery.",Demo:Fb}],Bb=["PHASE 02 — BATTLE SIMULATOR","PHASE 03 — TEAM BUILDER","PHASE 04 — INTERACTIVE MAPS","PHASE 05 — NUZLOCKE TRACKER","PHASE 06 — LIVING DEX","PHASE 07 — TCG CARDS"];function kb({title:r,caption:e,Demo:t,index:n}){const i=Ze.useRef(null),s=Bd(i,{once:!0,margin:"-20% 0px"});return N.jsxs(st.div,{"code-path":"src/pages/home/Features.tsx:340:5",ref:i,initial:{y:40,opacity:0,filter:"blur(8px)"},whileInView:{y:0,opacity:1,filter:"blur(0px)"},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.6,delay:n*.12,ease:Ff},className:"flex flex-col gap-4 rounded-xl border border-hairline bg-surface1 p-6 lg:aspect-[5/6]",children:[N.jsx(t,{"code-path":"src/pages/home/Features.tsx:348:7",live:s}),N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:349:7",className:"mt-auto",children:[N.jsx("h3",{"code-path":"src/pages/home/Features.tsx:350:9",className:"font-display text-lg font-bold",children:r}),N.jsx("p",{"code-path":"src/pages/home/Features.tsx:351:9",className:"mt-1 font-sans text-sm text-tx-secondary",children:e})]})]})}function zb(){return N.jsxs("section",{"code-path":"src/pages/home/Features.tsx:359:5",className:"mx-auto max-w-content px-4 py-24 md:px-8",children:[N.jsxs("div",{"code-path":"src/pages/home/Features.tsx:360:7",className:"mb-12 flex flex-col gap-4",children:[N.jsx("span",{"code-path":"src/pages/home/Features.tsx:361:9",className:"pixel-label text-[10px] text-gold",children:"PHASE 01 — WHAT'S INSIDE"}),N.jsx("h2",{"code-path":"src/pages/home/Features.tsx:362:9",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:"Built for Trainers"})]}),N.jsx("div",{"code-path":"src/pages/home/Features.tsx:367:7",className:"grid gap-6 md:grid-cols-3",children:Ob.map((r,e)=>N.jsx(kb,{"code-path":"src/pages/home/Features.tsx:369:11",title:r.title,caption:r.caption,Demo:r.Demo,index:e},r.title))}),N.jsx("div",{"code-path":"src/pages/home/Features.tsx:374:7",className:"group relative mt-16 overflow-hidden border-y border-hairline py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]",children:N.jsx("div",{"code-path":"src/pages/home/Features.tsx:375:9",className:"flex w-max animate-[marquee_60s_linear_infinite] gap-10 group-hover:[animation-play-state:paused] sm:animate-[marquee_40s_linear_infinite]",children:[0,1].map(r=>N.jsx("div",{"code-path":"src/pages/home/Features.tsx:377:13",className:"flex gap-10","aria-hidden":r===1,children:Bb.map(e=>N.jsxs("span",{"code-path":"src/pages/home/Features.tsx:379:17",className:"group/item relative flex cursor-default items-center gap-2 opacity-40",children:[N.jsx(cg,{"code-path":"src/pages/home/Features.tsx:380:19",size:12,strokeWidth:1.75,className:"text-tx-muted"}),N.jsx("span",{"code-path":"src/pages/home/Features.tsx:381:19",className:"pixel-label whitespace-nowrap text-[9px] text-tx-secondary",children:e}),N.jsx("span",{"code-path":"src/pages/home/Features.tsx:382:19",className:"pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-sm border border-hairline bg-surface2 px-2 py-1 font-sans text-xs text-tx-secondary opacity-0 shadow-elevate transition-all duration-150 group-hover/item:scale-100 group-hover/item:opacity-100",children:"Locked — arrives in a later phase."})]},`${r}-${e}`))},r))})})]})}const Gb=[{target:1025,label:"POKÉMON",format:r=>r.toLocaleString("en-US")},{target:18,label:"TYPES",format:r=>String(r)},{target:9,label:"GENERATIONS",format:r=>String(r)},{target:1e4,label:"SPRITES ARCHIVED",format:r=>`${r.toLocaleString("en-US")}+`}];function Hb({target:r,format:e,delay:t}){const n=Ze.useRef(null),i=Bd(n,{once:!0,margin:"-20% 0px"}),[s,a]=Ze.useState(e(0));return Ze.useEffect(()=>{if(!i)return;const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches,l=Ku(0,r,{duration:o?0:1.2,delay:t,ease:[.16,1,.3,1],onUpdate:c=>a(e(Math.round(c)))});return()=>l.stop()},[i,r,t,e]),N.jsx("span",{"code-path":"src/pages/home/StatsBand.tsx:30:5",ref:n,className:"font-display text-[40px] font-extrabold leading-none text-gold tabular-nums",children:s})}function Vb(){return N.jsxs("section",{"code-path":"src/pages/home/StatsBand.tsx:38:5",className:"relative border-y border-hairline bg-surface1",children:[N.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:40:7","aria-hidden":!0,className:"absolute left-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]",style:{background:"radial-gradient(circle, rgba(69,200,255,0.10), transparent 70%)"}}),N.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:45:7","aria-hidden":!0,className:"absolute right-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]",style:{background:"radial-gradient(circle, rgba(255,122,69,0.10), transparent 70%)"}}),N.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:50:7",className:"relative mx-auto grid max-w-content grid-cols-2 gap-10 px-4 py-16 md:px-8 lg:grid-cols-4",children:Gb.map((r,e)=>N.jsxs("div",{"code-path":"src/pages/home/StatsBand.tsx:52:11",className:"flex flex-col items-center gap-3 text-center",children:[N.jsx(Hb,{"code-path":"src/pages/home/StatsBand.tsx:53:13",target:r.target,format:r.format,delay:e*.15}),N.jsx("span",{"code-path":"src/pages/home/StatsBand.tsx:54:13",className:"pixel-label text-[10px] text-tx-muted",children:r.label})]},r.label))})]})}const Nd="pdx:preloader-done";function Jb(){const[r,e]=Ze.useState(()=>{try{return!sessionStorage.getItem(Nd)}catch{return!1}}),t=()=>{try{sessionStorage.setItem(Nd,"1")}catch{}e(!1)};return N.jsxs(N.Fragment,{children:[N.jsx(ir,{"code-path":"src/pages/Home.tsx:36:7",children:r&&N.jsx(st.div,{"code-path":"src/pages/Home.tsx:38:11",exit:{opacity:0},transition:{duration:.5,ease:"easeOut"},className:"fixed inset-0 z-[100]",children:N.jsx(Od,{"code-path":"src/pages/Home.tsx:44:13",variant:"page",onDone:t})},"preloader")}),N.jsx(Sb,{"code-path":"src/pages/Home.tsx:49:7",started:!r}),N.jsx(yb,{"code-path":"src/pages/Home.tsx:50:7"}),N.jsx(Ab,{"code-path":"src/pages/Home.tsx:51:7"}),N.jsx(Rb,{"code-path":"src/pages/Home.tsx:52:7"}),N.jsx(Pb,{"code-path":"src/pages/Home.tsx:53:7"}),N.jsx(zb,{"code-path":"src/pages/Home.tsx:54:7"}),N.jsx(Vb,{"code-path":"src/pages/Home.tsx:55:7"})]})}export{Jb as default};
