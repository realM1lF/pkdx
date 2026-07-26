import{c as Bd,r as Ke,j as D,T as Lt,a as Rl,g as Jm,u as kd,b as zd,l as Qm,d as eg,e as Vn,f as ps,h as tg,i as Gd,m as it,L as Dr,S as no,n as os,k as Oi,M as Hd,A as rr,s as Sr,o as ng,p as Qu,R as Bl,F as ig,q as rg,t as sg,v as ag,w as Fc,x as $f,P as Vd,y as og,z as lg,B as cg,C as ug,D as fg,E as kl,G as hg,H as dg,I as pg,J as mg,K as Kf,N as gg}from"./index-BJK05Do4.js";import{C as _g}from"./chevron-down-CqJHREcd.js";import{M as xg}from"./map-DkaWT1yT.js";import{U as vg}from"./users-DCzodgBr.js";import{S as Sg}from"./swords-c2La_mua.js";import{A as Wd}from"./arrow-right-DDTPMu8Q.js";import{S as $o,u as Xd}from"./StatBar-BABwv6fj.js";import{S as Mg}from"./sparkles-DJGFrkOL.js";import{A as yg}from"./arrow-left-C_Krlvtk.js";import{a as ef}from"./index-B_RqxFYY.js";const bg=[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]],Eg=Bd("dices",bg);const Tg=[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v7",key:"1yj91y"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["circle",{cx:"19",cy:"18",r:"3",key:"1qljk2"}],["path",{d:"M12 18H7a2 2 0 0 1-2-2V9",key:"16sdep"}],["path",{d:"m9 15 3 3-3 3",key:"1m3kbl"}]],Ag=Bd("git-compare-arrows",Tg);function $i(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function Yd(r,e){r.prototype=Object.create(e.prototype),r.prototype.constructor=r,r.__proto__=e}var ti={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Wa={duration:.5,overwrite:!1,delay:0},tf,hn,Dt,di=1e8,Tt=1/di,Oc=Math.PI*2,wg=Oc/4,Rg=0,qd=Math.sqrt,Cg=Math.cos,Pg=Math.sin,cn=function(e){return typeof e=="string"},zt=function(e){return typeof e=="function"},sr=function(e){return typeof e=="number"},nf=function(e){return typeof e>"u"},Gi=function(e){return typeof e=="object"},Fn=function(e){return e!==!1},rf=function(){return typeof window<"u"},lo=function(e){return zt(e)||cn(e)},$d=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},yn=Array.isArray,Dg=/random\([^)]+\)/g,Ng=/,\s*/g,Zf=/(?:-?\.?\d|\.)+/gi,Kd=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,zs=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,zl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Zd=/[+-]=-?[.\d]+/,Lg=/[^,'"\[\]\s]+/gi,Ig=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,It,Ci,Bc,sf,ii={},ul={},jd,Jd=function(e){return(ul=ea(e,ii))&&Hn},af=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},Xa=function(e,t){return!t&&console.warn(e)},Qd=function(e,t){return e&&(ii[e]=t)&&ul&&(ul[e]=t)||ii},Ya=function(){return 0},Ug={suppressEvents:!0,isStart:!0,kill:!1},Ko={suppressEvents:!0,kill:!1},Fg={suppressEvents:!0},of={},Rr=[],kc={},ep,Kn={},Gl={},jf=30,Zo=[],lf="",cf=function(e){var t=e[0],n,i;if(Gi(t)||zt(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(i=Zo.length;i--&&!Zo[i].targetTest(t););n=Zo[i]}for(i=e.length;i--;)e[i]&&(e[i]._gsap||(e[i]._gsap=new yp(e[i],n)))||e.splice(i,1);return e},es=function(e){return e._gsap||cf(pi(e))[0]._gsap},tp=function(e,t,n){return(n=e[t])&&zt(n)?e[t]():nf(n)&&e.getAttribute&&e.getAttribute(t)||n},On=function(e,t){return(e=e.split(",")).forEach(t)||e},Wt=function(e){return Math.round(e*1e5)/1e5||0},Nt=function(e){return Math.round(e*1e7)/1e7||0},Vs=function(e,t){var n=t.charAt(0),i=parseFloat(t.substr(2));return e=parseFloat(e),n==="+"?e+i:n==="-"?e-i:n==="*"?e*i:e/i},Og=function(e,t){for(var n=t.length,i=0;e.indexOf(t[i])<0&&++i<n;);return i<n},fl=function(){var e=Rr.length,t=Rr.slice(0),n,i;for(kc={},Rr.length=0,n=0;n<e;n++)i=t[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},uf=function(e){return!!(e._initted||e._startAt||e.add)},np=function(e,t,n,i){Rr.length&&!hn&&fl(),e.render(t,n,!!(hn&&t<0&&uf(e))),Rr.length&&!hn&&fl()},ip=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(Lg).length<2?t:cn(e)?e.trim():e},rp=function(e){return e},ri=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Bg=function(e){return function(t,n){for(var i in n)i in t||i==="duration"&&e||i==="ease"||(t[i]=n[i])}},ea=function(e,t){for(var n in t)e[n]=t[n];return e},Jf=function r(e,t){for(var n in t)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(e[n]=Gi(t[n])?r(e[n]||(e[n]={}),t[n]):t[n]);return e},hl=function(e,t){var n={},i;for(i in e)i in t||(n[i]=e[i]);return n},Da=function(e){var t=e.parent||It,n=e.keyframes?Bg(yn(e.keyframes)):ri;if(Fn(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},kg=function(e,t){for(var n=e.length,i=n===t.length;i&&n--&&e[n]===t[n];);return n<0},sp=function(e,t,n,i,s){var a=e[i],o;if(s)for(o=t[s];a&&a[s]>o;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[i]=t,t._prev=a,t.parent=t._dp=e,t},Cl=function(e,t,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=t._prev,a=t._next;s?s._next=a:e[n]===t&&(e[n]=a),a?a._prev=s:e[i]===t&&(e[i]=s),t._next=t._prev=t.parent=null},Nr=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},ts=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},zg=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},zc=function(e,t,n,i){return e._startAt&&(hn?e._startAt.revert(Ko):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,i))},Gg=function r(e){return!e||e._ts&&r(e.parent)},Qf=function(e){return e._repeat?ta(e._tTime,e=e.duration()+e._rDelay)*e:0},ta=function(e,t){var n=Math.floor(e=Nt(e/t));return e&&n===e?n-1:n},dl=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},Pl=function(e){return e._end=Nt(e._start+(e._tDur/Math.abs(e._ts||e._rts||Tt)||0))},Dl=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=Nt(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),Pl(e),n._dirty||ts(n,e)),e},ap=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=dl(e.rawTime(),t),(!t._dur||io(0,t.totalDuration(),n)-t._tTime>Tt)&&t.render(n,!0)),ts(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-Tt}},Ni=function(e,t,n,i){return t.parent&&Nr(t),t._start=Nt((sr(n)?n:n||e!==It?li(e,n,t):e._time)+t._delay),t._end=Nt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),sp(e,t,"_first","_last",e._sort?"_start":0),Gc(t)||(e._recent=t),i||ap(e,t),e._ts<0&&Dl(e,e._tTime),e},op=function(e,t){return(ii.ScrollTrigger||af("scrollTrigger",t))&&ii.ScrollTrigger.create(t,e)},lp=function(e,t,n,i,s){if(hf(e,t,s),!e._initted)return 1;if(!n&&e._pt&&!hn&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&ep!==jn.frame)return Rr.push(e),e._lazy=[s,i],1},Hg=function r(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||r(t))},Gc=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Vg=function(e,t,n,i){var s=e.ratio,a=t<0||!t&&(!e._start&&Hg(e)&&!(!e._initted&&Gc(e))||(e._ts<0||e._dp._ts<0)&&!Gc(e))?0:1,o=e._rDelay,l=0,c,u,d;if(o&&e._repeat&&(l=io(0,e._tDur,t),u=ta(l,o),e._yoyo&&u&1&&(a=1-a),u!==ta(e._tTime,o)&&(s=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==s||hn||i||e._zTime===Tt||!t&&e._zTime){if(!e._initted&&lp(e,t,i,n,l))return;for(d=e._zTime,e._zTime=t||(n?Tt:0),n||(n=t&&!d),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&zc(e,t,n,!0),e._onUpdate&&!n&&Qn(e,"onUpdate"),l&&e._repeat&&!n&&e.parent&&Qn(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&Nr(e,1),!n&&!hn&&(Qn(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Wg=function(e,t,n){var i;if(n>t)for(i=e._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>t)return i;i=i._next}else for(i=e._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<t)return i;i=i._prev}},na=function(e,t,n,i){var s=e._repeat,a=Nt(t)||0,o=e._tTime/e._tDur;return o&&!i&&(e._time*=a/e._dur),e._dur=a,e._tDur=s?s<0?1e10:Nt(a*(s+1)+e._rDelay*s):a,o>0&&!i&&Dl(e,e._tTime=e._tDur*o),e.parent&&Pl(e),n||ts(e.parent,e),e},eh=function(e){return e instanceof Un?ts(e):na(e,e._dur)},Xg={_start:0,endTime:Ya,totalDuration:Ya},li=function r(e,t,n){var i=e.labels,s=e._recent||Xg,a=e.duration()>=di?s.endTime(!1):e._dur,o,l,c;return cn(t)&&(isNaN(t)||t in i)?(l=t.charAt(0),c=t.substr(-1)==="%",o=t.indexOf("="),l==="<"||l===">"?(o>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(o<0?s:n).totalDuration()/100:1)):o<0?(t in i||(i[t]=a),i[t]):(l=parseFloat(t.charAt(o-1)+t.substr(o+1)),c&&n&&(l=l/100*(yn(n)?n[0]:n).totalDuration()),o>1?r(e,t.substr(0,o-1),n)+l:a+l)):t==null?a:+t},Na=function(e,t,n){var i=sr(t[1]),s=(i?2:1)+(e<2?0:1),a=t[s],o,l;if(i&&(a.duration=t[1]),a.parent=n,e){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Fn(l.vars.inherit)&&l.parent;a.immediateRender=Fn(o.immediateRender),e<2?a.runBackwards=1:a.startAt=t[s-1]}return new jt(t[0],a,t[s+1])},Or=function(e,t){return e||e===0?t(e):t},io=function(e,t,n){return n<e?e:n>t?t:n},vn=function(e,t){return!cn(e)||!(t=Ig.exec(e))?"":t[1]},Yg=function(e,t,n){return Or(n,function(i){return io(e,t,i)})},Hc=[].slice,cp=function(e,t){return e&&Gi(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Gi(e[0]))&&!e.nodeType&&e!==Ci},qg=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(i){var s;return cn(i)&&!t||cp(i,1)?(s=n).push.apply(s,pi(i)):n.push(i)})||n},pi=function(e,t,n){return Dt&&!t&&Dt.selector?Dt.selector(e):cn(e)&&!n&&(Bc||!ia())?Hc.call((t||sf).querySelectorAll(e),0):yn(e)?qg(e,n):cp(e)?Hc.call(e,0):e?[e]:[]},Vc=function(e){return e=pi(e)[0]||Xa("Invalid scope")||{},function(t){var n=e.current||e.nativeElement||e;return pi(t,n.querySelectorAll?n:n===e?Xa("Invalid scope")||sf.createElement("div"):e)}},up=function(e){return e.sort(function(){return .5-Math.random()})},fp=function(e){if(zt(e))return e;var t=Gi(e)?e:{each:e},n=ns(t.ease),i=t.from||0,s=parseFloat(t.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=t.axis,u=i,d=i;return cn(i)?u=d={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(u=i[0],d=i[1]),function(f,h,g){var _=(g||t).length,p=a[_],m,b,w,S,E,T,A,v,y;if(!p){if(y=t.grid==="auto"?0:(t.grid||[1,di])[1],!y){for(A=-di;A<(A=g[y++].getBoundingClientRect().left)&&y<_;);y<_&&y--}for(p=a[_]=[],m=l?Math.min(y,_)*u-.5:i%y,b=y===di?0:l?_*d/y-.5:i/y|0,A=0,v=di,T=0;T<_;T++)w=T%y-m,S=b-(T/y|0),p[T]=E=c?Math.abs(c==="y"?S:w):qd(w*w+S*S),E>A&&(A=E),E<v&&(v=E);i==="random"&&up(p),p.max=A-v,p.min=v,p.v=_=(parseFloat(t.amount)||parseFloat(t.each)*(y>_?_-1:c?c==="y"?_/y:y:Math.max(y,_/y))||0)*(i==="edges"?-1:1),p.b=_<0?s-_:s,p.u=vn(t.amount||t.each)||0,n=n&&_<0?a_(n):n}return _=(p[f]-p.min)/p.max||0,Nt(p.b+(n?n(_):_)*p.v)+p.u}},Wc=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(n){var i=Nt(Math.round(parseFloat(n)/e)*e*t);return(i-i%1)/t+(sr(n)?0:vn(n))}},hp=function(e,t){var n=yn(e),i,s;return!n&&Gi(e)&&(i=n=e.radius||di,e.values?(e=pi(e.values),(s=!sr(e[0]))&&(i*=i)):e=Wc(e.increment)),Or(t,n?zt(e)?function(a){return s=e(a),Math.abs(s-a)<=i?s:a}:function(a){for(var o=parseFloat(s?a.x:a),l=parseFloat(s?a.y:0),c=di,u=0,d=e.length,f,h;d--;)s?(f=e[d].x-o,h=e[d].y-l,f=f*f+h*h):f=Math.abs(e[d]-o),f<c&&(c=f,u=d);return u=!i||c<=i?e[u]:a,s||u===a||sr(a)?u:u+vn(a)}:Wc(e))},dp=function(e,t,n,i){return Or(yn(e)?!t:n===!0?!!(n=0):!i,function(){return yn(e)?e[~~(Math.random()*e.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*i)/i})},$g=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(i){return t.reduce(function(s,a){return a(s)},i)}},Kg=function(e,t){return function(n){return e(parseFloat(n))+(t||vn(n))}},Zg=function(e,t,n){return mp(e,t,0,1,n)},pp=function(e,t,n){return Or(n,function(i){return e[~~t(i)]})},jg=function r(e,t,n){var i=t-e;return yn(e)?pp(e,r(0,e.length),t):Or(n,function(s){return(i+(s-e)%i)%i+e})},Jg=function r(e,t,n){var i=t-e,s=i*2;return yn(e)?pp(e,r(0,e.length-1),t):Or(n,function(a){return a=(s+(a-e)%s)%s||0,e+(a>i?s-a:a)})},qa=function(e){return e.replace(Dg,function(t){var n=t.indexOf("[")+1,i=t.substring(n||7,n?t.indexOf("]"):t.length-1).split(Ng);return dp(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},mp=function(e,t,n,i,s){var a=t-e,o=i-n;return Or(s,function(l){return n+((l-e)/a*o||0)})},Qg=function r(e,t,n,i){var s=isNaN(e+t)?0:function(h){return(1-h)*e+h*t};if(!s){var a=cn(e),o={},l,c,u,d,f;if(n===!0&&(i=1)&&(n=null),a)e={p:e},t={p:t};else if(yn(e)&&!yn(t)){for(u=[],d=e.length,f=d-2,c=1;c<d;c++)u.push(r(e[c-1],e[c]));d--,s=function(g){g*=d;var _=Math.min(f,~~g);return u[_](g-_)},n=t}else i||(e=ea(yn(e)?[]:{},e));if(!u){for(l in t)ff.call(o,e,l,"get",t[l]);s=function(g){return mf(g,o)||(a?e.p:e)}}}return Or(n,s)},th=function(e,t,n){var i=e.labels,s=di,a,o,l;for(a in i)o=i[a]-t,o<0==!!n&&o&&s>(o=Math.abs(o))&&(l=a,s=o);return l},Qn=function(e,t,n){var i=e.vars,s=i[t],a=Dt,o=e._ctx,l,c,u;if(s)return l=i[t+"Params"],c=i.callbackScope||e,n&&Rr.length&&fl(),o&&(Dt=o),u=l?s.apply(c,l):s.call(c),Dt=a,u},ya=function(e){return Nr(e),e.scrollTrigger&&e.scrollTrigger.kill(!!hn),e.progress()<1&&Qn(e,"onInterrupt"),e},Gs,gp=[],_p=function(e){if(e)if(e=!e.name&&e.default||e,rf()||e.headless){var t=e.name,n=zt(e),i=t&&!n&&e.init?function(){this._props=[]}:e,s={init:Ya,render:mf,add:ff,kill:g_,modifier:m_,rawVars:0},a={targetTest:0,get:0,getSetter:pf,aliases:{},register:0};if(ia(),e!==i){if(Kn[t])return;ri(i,ri(hl(e,s),a)),ea(i.prototype,ea(s,hl(e,a))),Kn[i.prop=t]=i,e.targetTest&&(Zo.push(i),of[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Qd(t,i),e.register&&e.register(Hn,i,Bn)}else gp.push(e)},Et=255,ba={aqua:[0,Et,Et],lime:[0,Et,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Et],navy:[0,0,128],white:[Et,Et,Et],olive:[128,128,0],yellow:[Et,Et,0],orange:[Et,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Et,0,0],pink:[Et,192,203],cyan:[0,Et,Et],transparent:[Et,Et,Et,0]},Hl=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*Et+.5|0},xp=function(e,t,n){var i=e?sr(e)?[e>>16,e>>8&Et,e&Et]:0:ba.black,s,a,o,l,c,u,d,f,h,g;if(!i){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),ba[e])i=ba[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),a=e.charAt(2),o=e.charAt(3),e="#"+s+s+a+a+o+o+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return i=parseInt(e.substr(1,6),16),[i>>16,i>>8&Et,i&Et,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),i=[e>>16,e>>8&Et,e&Et]}else if(e.substr(0,3)==="hsl"){if(i=g=e.match(Zf),!t)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,a=u<=.5?u*(c+1):u+c-u*c,s=u*2-a,i.length>3&&(i[3]*=1),i[0]=Hl(l+1/3,s,a),i[1]=Hl(l,s,a),i[2]=Hl(l-1/3,s,a);else if(~e.indexOf("="))return i=e.match(Kd),n&&i.length<4&&(i[3]=1),i}else i=e.match(Zf)||ba.transparent;i=i.map(Number)}return t&&!g&&(s=i[0]/Et,a=i[1]/Et,o=i[2]/Et,d=Math.max(s,a,o),f=Math.min(s,a,o),u=(d+f)/2,d===f?l=c=0:(h=d-f,c=u>.5?h/(2-d-f):h/(d+f),l=d===s?(a-o)/h+(a<o?6:0):d===a?(o-s)/h+2:(s-a)/h+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},vp=function(e){var t=[],n=[],i=-1;return e.split(Cr).forEach(function(s){var a=s.match(zs)||[];t.push.apply(t,a),n.push(i+=a.length+1)}),t.c=n,t},nh=function(e,t,n){var i="",s=(e+i).match(Cr),a=t?"hsla(":"rgba(",o=0,l,c,u,d;if(!s)return e;if(s=s.map(function(f){return(f=xp(f,t,1))&&a+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),n&&(u=vp(e),l=n.c,l.join(i)!==u.c.join(i)))for(c=e.replace(Cr,"1").split(zs),d=c.length-1;o<d;o++)i+=c[o]+(~l.indexOf(o)?s.shift()||a+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=e.split(Cr),d=c.length-1;o<d;o++)i+=c[o]+s[o];return i+c[d]},Cr=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in ba)r+="|"+e+"\\b";return new RegExp(r+")","gi")})(),e_=/hsl[a]?\(/,Sp=function(e){var t=e.join(" "),n;if(Cr.lastIndex=0,Cr.test(t))return n=e_.test(t),e[1]=nh(e[1],n),e[0]=nh(e[0],n,vp(e[1])),!0},$a,jn=(function(){var r=Date.now,e=500,t=33,n=r(),i=n,s=1e3/240,a=s,o=[],l,c,u,d,f,h,g=function _(p){var m=r()-i,b=p===!0,w,S,E,T;if((m>e||m<0)&&(n+=m-t),i+=m,E=i-n,w=E-a,(w>0||b)&&(T=++d.frame,f=E-d.time*1e3,d.time=E=E/1e3,a+=w+(w>=s?4:s-w),S=1),b||(l=c(_)),S)for(h=0;h<o.length;h++)o[h](E,f,T,p)};return d={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(p){return f/(1e3/(p||60))},wake:function(){jd&&(!Bc&&rf()&&(Ci=Bc=window,sf=Ci.document||{},ii.gsap=Hn,(Ci.gsapVersions||(Ci.gsapVersions=[])).push(Hn.version),Jd(ul||Ci.GreenSockGlobals||!Ci.gsap&&Ci||{}),gp.forEach(_p)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=u||function(p){return setTimeout(p,a-d.time*1e3+1|0)},$a=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),$a=0,c=Ya},lagSmoothing:function(p,m){e=p||1/0,t=Math.min(m||33,e)},fps:function(p){s=1e3/(p||240),a=d.time*1e3+s},add:function(p,m,b){var w=m?function(S,E,T,A){p(S,E,T,A),d.remove(w)}:p;return d.remove(p),o[b?"unshift":"push"](w),ia(),w},remove:function(p,m){~(m=o.indexOf(p))&&o.splice(m,1)&&h>=m&&h--},_listeners:o},d})(),ia=function(){return!$a&&jn.wake()},ct={},t_=/^[\d.\-M][\d.\-,\s]/,n_=/["']/g,i_=function(e){for(var t={},n=e.substr(1,e.length-3).split(":"),i=n[0],s=1,a=n.length,o,l,c;s<a;s++)l=n[s],o=s!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),t[i]=isNaN(c)?c.replace(n_,"").trim():+c,i=l.substr(o+1).trim();return t},r_=function(e){var t=e.indexOf("(")+1,n=e.indexOf(")"),i=e.indexOf("(",t);return e.substring(t,~i&&i<n?e.indexOf(")",n+1):n)},s_=function(e){var t=(e+"").split("("),n=ct[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf("{")?[i_(t[1])]:r_(e).split(",").map(ip)):ct._CE&&t_.test(e)?ct._CE("",e):n},a_=function(e){return function(t){return 1-e(1-t)}},ns=function(e,t){return e&&(zt(e)?e:ct[e]||s_(e))||t},ms=function(e,t,n,i){n===void 0&&(n=function(l){return 1-t(1-l)}),i===void 0&&(i=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:n,easeInOut:i},a;return On(e,function(o){ct[o]=ii[o]=s,ct[a=o.toLowerCase()]=n;for(var l in s)ct[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ct[o+"."+l]=s[l]}),s},Mp=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},Vl=function r(e,t,n){var i=t>=1?t:1,s=(n||(e?.3:.45))/(t<1?t:1),a=s/Oc*(Math.asin(1/i)||0),o=function(u){return u===1?1:i*Math.pow(2,-10*u)*Pg((u-a)*s)+1},l=e==="out"?o:e==="in"?function(c){return 1-o(1-c)}:Mp(o);return s=Oc/s,l.config=function(c,u){return r(e,c,u)},l},Wl=function r(e,t){t===void 0&&(t=1.70158);var n=function(a){return a?--a*a*((t+1)*a+t)+1:0},i=e==="out"?n:e==="in"?function(s){return 1-n(1-s)}:Mp(n);return i.config=function(s){return r(e,s)},i};On("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,e){var t=e<5?e+1:e;ms(r+",Power"+(t-1),e?function(n){return Math.pow(n,t)}:function(n){return n},function(n){return 1-Math.pow(1-n,t)},function(n){return n<.5?Math.pow(n*2,t)/2:1-Math.pow((1-n)*2,t)/2})});ct.Linear.easeNone=ct.none=ct.Linear.easeIn;ms("Elastic",Vl("in"),Vl("out"),Vl());(function(r,e){var t=1/e,n=2*t,i=2.5*t,s=function(o){return o<t?r*o*o:o<n?r*Math.pow(o-1.5/e,2)+.75:o<i?r*(o-=2.25/e)*o+.9375:r*Math.pow(o-2.625/e,2)+.984375};ms("Bounce",function(a){return 1-s(1-a)},s)})(7.5625,2.75);ms("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});ms("Circ",function(r){return-(qd(1-r*r)-1)});ms("Sine",function(r){return r===1?1:-Cg(r*wg)+1});ms("Back",Wl("in"),Wl("out"),Wl());ct.SteppedEase=ct.steps=ii.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,i=e+(t?0:1),s=t?1:0,a=1-Tt;return function(o){return((i*io(0,a,o)|0)+s)*n}}};Wa.ease=ct["quad.out"];On("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return lf+=r+","+r+"Params,"});var yp=function(e,t){this.id=Rg++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:tp,this.set=t?t.getSetter:pf},Ka=(function(){function r(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,na(this,+t.duration,1,1),this.data=t.data,Dt&&(this._ctx=Dt,Dt.data.push(this)),$a||jn.wake()}var e=r.prototype;return e.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},e.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},e.totalDuration=function(n){return arguments.length?(this._dirty=0,na(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(n,i){if(ia(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Dl(this,n),!s._dp||s.parent||ap(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Ni(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Tt||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),np(this,n,i)),this},e.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+Qf(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},e.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+Qf(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?ta(this._tTime,s)+1:1},e.timeScale=function(n,i){if(!arguments.length)return this._rts===-Tt?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?dl(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Tt?0:this._rts,this.totalTime(io(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),Pl(this),zg(this)},e.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(ia(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Tt&&(this._tTime-=Tt)))),this):this._ps},e.startTime=function(n){if(arguments.length){this._start=Nt(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&Ni(i,this,this._start-this._delay),this}return this._start},e.endTime=function(n){return this._start+(Fn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?dl(i.rawTime(n),this):this._tTime:this._tTime},e.revert=function(n){n===void 0&&(n=Fg);var i=hn;return hn=n,uf(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),hn=i,this},e.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},e.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,eh(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,eh(this),i?this.time(i):this}return this._rDelay},e.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},e.seek=function(n,i){return this.totalTime(li(this,n),Fn(i))},e.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Fn(i)),this._dur||(this._zTime=-Tt),this},e.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},e.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},e.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Tt:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-Tt,this},e.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-Tt)},e.eventCallback=function(n,i,s){var a=this.vars;return arguments.length>1?(i?(a[n]=i,s&&(a[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},e.then=function(n){var i=this,s=i._prom;return new Promise(function(a){var o=zt(n)?n:rp,l=function(){var u=i.then;i.then=null,s&&s(),zt(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=u),a(o),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},e.kill=function(){ya(this)},r})();ri(Ka.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Tt,_prom:0,_ps:!1,_rts:1});var Un=(function(r){Yd(e,r);function e(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Fn(n.sortChildren),It&&Ni(n.parent||It,$i(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&op($i(s),n.scrollTrigger),s}var t=e.prototype;return t.to=function(i,s,a){return Na(0,arguments,this),this},t.from=function(i,s,a){return Na(1,arguments,this),this},t.fromTo=function(i,s,a,o){return Na(2,arguments,this),this},t.set=function(i,s,a){return s.duration=0,s.parent=this,Da(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new jt(i,s,li(this,a),1),this},t.call=function(i,s,a){return Ni(this,jt.delayedCall(0,i,s),a)},t.staggerTo=function(i,s,a,o,l,c,u){return a.duration=s,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=u,a.parent=this,new jt(i,a,li(this,l)),this},t.staggerFrom=function(i,s,a,o,l,c,u){return a.runBackwards=1,Da(a).immediateRender=Fn(a.immediateRender),this.staggerTo(i,s,a,o,l,c,u)},t.staggerFromTo=function(i,s,a,o,l,c,u,d){return o.startAt=a,Da(o).immediateRender=Fn(o.immediateRender),this.staggerTo(i,s,o,l,c,u,d)},t.render=function(i,s,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:Nt(i),d=this._zTime<0!=i<0&&(this._initted||!c),f,h,g,_,p,m,b,w,S,E,T,A;if(this!==It&&u>l&&i>=0&&(u=l),u!==this._tTime||a||d){if(o!==this._time&&c&&(u+=this._time-o,i+=this._time-o),f=u,S=this._start,w=this._ts,m=!w,d&&(c||(o=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(T=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,s,a);if(f=Nt(u%p),u===l?(_=this._repeat,f=c):(E=Nt(u/p),_=~~E,_&&_===E&&(f=c,_--),f>c&&(f=c)),E=ta(this._tTime,p),!o&&this._tTime&&E!==_&&this._tTime-E*p-this._dur<=0&&(E=_),T&&_&1&&(f=c-f,A=1),_!==E&&!this._lock){var v=T&&E&1,y=v===(T&&_&1);if(_<E&&(v=!v),o=v?0:u%c?c:u,this._lock=1,this.render(o||(A?0:Nt(_*p)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&Qn(this,"onRepeat"),this.vars.repeatRefresh&&!A&&(this.invalidate()._lock=1,E=_),o&&o!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,y&&(this._lock=2,o=v?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!A&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(b=Wg(this,Nt(o),Nt(f)),b&&(u-=f-(f=b._start))),this._tTime=u,this._time=f,this._act=!!w,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&u&&c&&!s&&!E&&(Qn(this,"onStart"),this._tTime!==u))return this;if(f>=o&&i>=0)for(h=this._first;h;){if(g=h._next,(h._act||f>=h._start)&&h._ts&&b!==h){if(h.parent!==this)return this.render(i,s,a);if(h.render(h._ts>0?(f-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(f-h._start)*h._ts,s,a),f!==this._time||!this._ts&&!m){b=0,g&&(u+=this._zTime=-Tt);break}}h=g}else{h=this._last;for(var C=i<0?i:f;h;){if(g=h._prev,(h._act||C<=h._end)&&h._ts&&b!==h){if(h.parent!==this)return this.render(i,s,a);if(h.render(h._ts>0?(C-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(C-h._start)*h._ts,s,a||hn&&uf(h)),f!==this._time||!this._ts&&!m){b=0,g&&(u+=this._zTime=C?-Tt:Tt);break}}h=g}}if(b&&!s&&(this.pause(),b.render(f>=o?0:-Tt)._zTime=f>=o?1:-1,this._ts))return this._start=S,Pl(this),this.render(i,s,a);this._onUpdate&&!s&&Qn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&o)&&(S===this._start||Math.abs(w)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Nr(this,1),!s&&!(i<0&&!o)&&(u||o||!l)&&(Qn(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(i,s){var a=this;if(sr(s)||(s=li(this,s,i)),!(i instanceof Ka)){if(yn(i))return i.forEach(function(o){return a.add(o,s)}),this;if(cn(i))return this.addLabel(i,s);if(zt(i))i=jt.delayedCall(0,i);else return this}return this!==i?Ni(this,i,s):this},t.getChildren=function(i,s,a,o){i===void 0&&(i=!0),s===void 0&&(s=!0),a===void 0&&(a=!0),o===void 0&&(o=-di);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof jt?s&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,a)))),c=c._next;return l},t.getById=function(i){for(var s=this.getChildren(1,1,1),a=s.length;a--;)if(s[a].vars.id===i)return s[a]},t.remove=function(i){return cn(i)?this.removeLabel(i):zt(i)?this.killTweensOf(i):(i.parent===this&&Cl(this,i),i===this._recent&&(this._recent=this._last),ts(this))},t.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Nt(jn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},t.addLabel=function(i,s){return this.labels[i]=li(this,s),this},t.removeLabel=function(i){return delete this.labels[i],this},t.addPause=function(i,s,a){var o=jt.delayedCall(0,s||Ya,a);return o.data="isPause",this._hasPause=1,Ni(this,o,li(this,i))},t.removePause=function(i){var s=this._first;for(i=li(this,i);s;)s._start===i&&s.data==="isPause"&&Nr(s),s=s._next},t.killTweensOf=function(i,s,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)yr!==o[l]&&o[l].kill(i,s);return this},t.getTweensOf=function(i,s){for(var a=[],o=pi(i),l=this._first,c=sr(s),u;l;)l instanceof jt?Og(l._targets,o)&&(c?(!yr||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&a.push(l):(u=l.getTweensOf(o,s)).length&&a.push.apply(a,u),l=l._next;return a},t.tweenTo=function(i,s){s=s||{};var a=this,o=li(a,i),l=s,c=l.startAt,u=l.onStart,d=l.onStartParams,f=l.immediateRender,h,g=jt.to(a,ri({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||Tt,onStart:function(){if(a.pause(),!h){var p=s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==p&&na(g,p,0,1).render(g._time,!0,!0),h=1}u&&u.apply(g,d||[])}},s));return f?g.render(0):g},t.tweenFromTo=function(i,s,a){return this.tweenTo(s,ri({startAt:{time:li(this,i)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(i){return i===void 0&&(i=this._time),th(this,li(this,i))},t.previousLabel=function(i){return i===void 0&&(i=this._time),th(this,li(this,i),1)},t.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Tt)},t.shiftChildren=function(i,s,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=Nt(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(s)for(c in l)l[c]>=a&&(l[c]+=i);return ts(this)},t.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},t.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,a;s;)a=s._next,this.remove(s),s=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),ts(this)},t.totalDuration=function(i){var s=0,a=this,o=a._last,l=di,c,u,d;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(d=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),u=o._start,u>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Ni(a,o,u-o._delay,1)._lock=0):l=u,u<0&&o._ts&&(s-=u,(!d&&!a._dp||d&&d.smoothChildTiming)&&(a._start+=Nt(u/a._ts),a._time-=u,a._tTime-=u),a.shiftChildren(-u,!1,-1/0),l=0),o._end>s&&o._ts&&(s=o._end),o=c;na(a,a===It&&a._time>s?a._time:s,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(i){if(It._ts&&(np(It,dl(i,It)),ep=jn.frame),jn.frame>=jf){jf+=ti.autoSleep||120;var s=It._first;if((!s||!s._ts)&&ti.autoSleep&&jn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||jn.sleep()}}},e})(Ka);ri(Un.prototype,{_lock:0,_hasPause:0,_forcing:0});var o_=function(e,t,n,i,s,a,o){var l=new Bn(this._pt,e,t,0,1,Rp,null,s),c=0,u=0,d,f,h,g,_,p,m,b;for(l.b=n,l.e=i,n+="",i+="",(m=~i.indexOf("random("))&&(i=qa(i)),a&&(b=[n,i],a(b,e,t),n=b[0],i=b[1]),f=n.match(zl)||[];d=zl.exec(i);)g=d[0],_=i.substring(c,d.index),h?h=(h+1)%5:_.substr(-5)==="rgba("&&(h=1),g!==f[u++]&&(p=parseFloat(f[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:p,c:g.charAt(1)==="="?Vs(p,g)-p:parseFloat(g)-p,m:h&&h<4?Math.round:0},c=zl.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(Zd.test(i)||m)&&(l.e=0),this._pt=l,l},ff=function(e,t,n,i,s,a,o,l,c,u){zt(i)&&(i=i(s||0,e,a));var d=e[t],f=n!=="get"?n:zt(d)?c?e[t.indexOf("set")||!zt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():d,h=zt(d)?c?h_:Ap:df,g;if(cn(i)&&(~i.indexOf("random(")&&(i=qa(i)),i.charAt(1)==="="&&(g=Vs(f,i)+(vn(f)||0),(g||g===0)&&(i=g))),!u||f!==i||Xc)return!isNaN(f*i)&&i!==""?(g=new Bn(this._pt,e,t,+f||0,i-(f||0),typeof d=="boolean"?p_:wp,0,h),c&&(g.fp=c),o&&g.modifier(o,this,e),this._pt=g):(!d&&!(t in e)&&af(t,i),o_.call(this,e,t,f,i,h,l||ti.stringFilter,c))},l_=function(e,t,n,i,s){if(zt(e)&&(e=La(e,s,t,n,i)),!Gi(e)||e.style&&e.nodeType||yn(e)||$d(e))return cn(e)?La(e,s,t,n,i):e;var a={},o;for(o in e)a[o]=La(e[o],s,t,n,i);return a},bp=function(e,t,n,i,s,a){var o,l,c,u;if(Kn[e]&&(o=new Kn[e]).init(s,o.rawVars?t[e]:l_(t[e],i,s,a,n),n,i,a)!==!1&&(n._pt=l=new Bn(n._pt,s,e,0,1,o.render,o,0,o.priority),n!==Gs))for(c=n._ptLookup[n._targets.indexOf(s)],u=o._props.length;u--;)c[o._props[u]]=l;return o},yr,Xc,hf=function r(e,t,n){var i=e.vars,s=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,d=i.yoyoEase,f=i.keyframes,h=i.autoRevert,g=e._dur,_=e._startAt,p=e._targets,m=e.parent,b=m&&m.data==="nested"?m.vars.targets:p,w=e._overwrite==="auto"&&!tf,S=e.timeline,E=i.easeReverse||d,T,A,v,y,C,L,P,O,G,U,H,B,K;if(S&&(!f||!s)&&(s="none"),e._ease=ns(s,Wa.ease),e._rEase=E&&(ns(E)||e._ease),e._from=!S&&!!i.runBackwards,e._from&&(e.ratio=1),!S||f&&!i.stagger){if(O=p[0]?es(p[0]).harness:0,B=O&&i[O.prop],T=hl(i,of),_&&(_._zTime<0&&_.progress(1),t<0&&u&&o&&!h?_.render(-1,!0):_.revert(u&&g?Ko:Ug),_._lazy=0),a){if(Nr(e._startAt=jt.set(p,ri({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!_&&Fn(l),startAt:null,delay:0,onUpdate:c&&function(){return Qn(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(hn||!o&&!h)&&e._startAt.revert(Ko),o&&g&&t<=0&&n<=0){t&&(e._zTime=t);return}}else if(u&&g&&!_){if(t&&(o=!1),v=ri({overwrite:!1,data:"isFromStart",lazy:o&&!_&&Fn(l),immediateRender:o,stagger:0,parent:m},T),B&&(v[O.prop]=B),Nr(e._startAt=jt.set(p,v)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(hn?e._startAt.revert(Ko):e._startAt.render(-1,!0)),e._zTime=t,!o)r(e._startAt,Tt,Tt);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&Fn(l)||l&&!g,A=0;A<p.length;A++){if(C=p[A],P=C._gsap||cf(p)[A]._gsap,e._ptLookup[A]=U={},kc[P.id]&&Rr.length&&fl(),H=b===p?A:b.indexOf(C),O&&(G=new O).init(C,B||T,e,H,b)!==!1&&(e._pt=y=new Bn(e._pt,C,G.name,0,1,G.render,G,0,G.priority),G._props.forEach(function(te){U[te]=y}),G.priority&&(L=1)),!O||B)for(v in T)Kn[v]&&(G=bp(v,T,e,H,C,b))?G.priority&&(L=1):U[v]=y=ff.call(e,C,v,"get",T[v],H,b,0,i.stringFilter);e._op&&e._op[A]&&e.kill(C,e._op[A]),w&&e._pt&&(yr=e,It.killTweensOf(C,U,e.globalTime(t)),K=!e.parent,yr=0),e._pt&&l&&(kc[P.id]=1)}L&&Cp(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!K,f&&t<=0&&S.render(di,!0,!0)},c_=function(e,t,n,i,s,a,o,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,d,f,h;if(!c)for(c=e._ptCache[t]=[],f=e._ptLookup,h=e._targets.length;h--;){if(u=f[h][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return Xc=1,e.vars[t]="+=0",hf(e,o),Xc=0,l?Xa(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(h=c.length;h--;)d=c[h],u=d._pt||d,u.s=(i||i===0)&&!s?i:u.s+(i||0)+a*u.c,u.c=n-u.s,d.e&&(d.e=Wt(n)+vn(d.e)),d.b&&(d.b=u.s+vn(d.b))},u_=function(e,t){var n=e[0]?es(e[0]).harness:0,i=n&&n.aliases,s,a,o,l;if(!i)return t;s=ea({},t);for(a in i)if(a in s)for(l=i[a].split(","),o=l.length;o--;)s[l[o]]=s[a];return s},f_=function(e,t,n,i){var s=t.ease||i||"power1.inOut",a,o;if(yn(t))o=n[e]||(n[e]=[]),t.forEach(function(l,c){return o.push({t:c/(t.length-1)*100,v:l,e:s})});else for(a in t)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(e),v:t[a],e:s})},La=function(e,t,n,i,s){return zt(e)?e.call(t,n,i,s):cn(e)&&~e.indexOf("random(")?qa(e):e},Ep=lf+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Tp={};On(Ep+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return Tp[r]=1});var jt=(function(r){Yd(e,r);function e(n,i,s,a){var o;typeof i=="number"&&(s.duration=i,i=s,s=null),o=r.call(this,a?i:Da(i))||this;var l=o.vars,c=l.duration,u=l.delay,d=l.immediateRender,f=l.stagger,h=l.overwrite,g=l.keyframes,_=l.defaults,p=l.scrollTrigger,m=i.parent||It,b=(yn(n)||$d(n)?sr(n[0]):"length"in i)?[n]:pi(n),w,S,E,T,A,v,y,C;if(o._targets=b.length?cf(b):Xa("GSAP target "+n+" not found. https://gsap.com",!ti.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=h,g||f||lo(c)||lo(u)){i=o.vars;var L=i.easeReverse||i.yoyoEase;if(w=o.timeline=new Un({data:"nested",defaults:_||{},targets:m&&m.data==="nested"?m.vars.targets:b}),w.kill(),w.parent=w._dp=$i(o),w._start=0,f||lo(c)||lo(u)){if(T=b.length,y=f&&fp(f),Gi(f))for(A in f)~Ep.indexOf(A)&&(C||(C={}),C[A]=f[A]);for(S=0;S<T;S++)E=hl(i,Tp),E.stagger=0,L&&(E.easeReverse=L),C&&ea(E,C),v=b[S],E.duration=+La(c,$i(o),S,v,b),E.delay=(+La(u,$i(o),S,v,b)||0)-o._delay,!f&&T===1&&E.delay&&(o._delay=u=E.delay,o._start+=u,E.delay=0),w.to(v,E,y?y(S,v,b):0),w._ease=ct.none;w.duration()?c=u=0:o.timeline=0}else if(g){Da(ri(w.vars.defaults,{ease:"none"})),w._ease=ns(g.ease||i.ease||"none");var P=0,O,G,U;if(yn(g))g.forEach(function(H){return w.to(b,H,">")}),w.duration();else{E={};for(A in g)A==="ease"||A==="easeEach"||f_(A,g[A],E,g.easeEach);for(A in E)for(O=E[A].sort(function(H,B){return H.t-B.t}),P=0,S=0;S<O.length;S++)G=O[S],U={ease:G.e,duration:(G.t-(S?O[S-1].t:0))/100*c},U[A]=G.v,w.to(b,U,P),P+=U.duration;w.duration()<c&&w.to({},{duration:c-w.duration()})}}c||o.duration(c=w.duration())}else o.timeline=0;return h===!0&&!tf&&(yr=$i(o),It.killTweensOf(b),yr=0),Ni(m,$i(o),s),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(d||!c&&!g&&o._start===Nt(m._time)&&Fn(d)&&Gg($i(o))&&m.data!=="nested")&&(o._tTime=-Tt,o.render(Math.max(0,-u)||0)),p&&op($i(o),p),o}var t=e.prototype;return t.render=function(i,s,a){var o=this._time,l=this._tDur,c=this._dur,u=i<0,d=i>l-Tt&&!u?l:i<Tt?0:i,f,h,g,_,p,m,b,w;if(!c)Vg(this,i,s,a);else if(d!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=d,w=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+i,s,a);if(f=Nt(d%_),d===l?(g=this._repeat,f=c):(p=Nt(d/_),g=~~p,g&&g===p?(f=c,g--):f>c&&(f=c)),m=this._yoyo&&g&1,m&&(f=c-f),p=ta(this._tTime,_),f===o&&!a&&this._initted&&g===p)return this._tTime=d,this;g!==p&&this.vars.repeatRefresh&&!m&&!this._lock&&f!==_&&this._initted&&(this._lock=a=1,this.render(Nt(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(lp(this,u?i:f,a,s,d))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==p))return this;if(c!==this._dur)return this.render(i,s,a)}if(this._rEase){var S=f<o;if(S!==this._inv){var E=S?o:c-o;this._inv=S,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=E?(S?-1:1)/E:0,this._invScale=S?-this.ratio:1-this.ratio,this._invEase=S?this._rEase:this._ease}this.ratio=b=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=b=this._ease(f/c);if(this._from&&(this.ratio=b=1-b),this._tTime=d,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&d&&!s&&!p&&(Qn(this,"onStart"),this._tTime!==d))return this;for(h=this._pt;h;)h.r(b,h.d),h=h._next;w&&w.render(i<0?i:w._dur*w._ease(f/this._dur),s,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(u&&zc(this,i,s,a),Qn(this,"onUpdate")),this._repeat&&g!==p&&this.vars.onRepeat&&!s&&this.parent&&Qn(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(u&&!this._onUpdate&&zc(this,i,!0,!0),(i||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&Nr(this,1),!s&&!(u&&!o)&&(d||o||m)&&(Qn(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},t.resetTo=function(i,s,a,o,l){$a||jn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||hf(this,c),u=this._ease(c/this._dur),c_(this,i,s,a,o,u,c,l)?this.resetTo(i,s,a,o,1):(Dl(this,0),this.parent||sp(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?ya(this):this.scrollTrigger&&this.scrollTrigger.kill(!!hn),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,yr&&yr.vars.overwrite!==!0)._first||ya(this),this.parent&&a!==this.timeline.totalDuration()&&na(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?pi(i):o,c=this._ptLookup,u=this._pt,d,f,h,g,_,p,m;if((!s||s==="all")&&kg(o,l))return s==="all"&&(this._pt=0),ya(this);for(d=this._op=this._op||[],s!=="all"&&(cn(s)&&(_={},On(s,function(b){return _[b]=1}),s=_),s=u_(o,s)),m=o.length;m--;)if(~l.indexOf(o[m])){f=c[m],s==="all"?(d[m]=s,g=f,h={}):(h=d[m]=d[m]||{},g=s);for(_ in g)p=f&&f[_],p&&((!("kill"in p.d)||p.d.kill(_)===!0)&&Cl(this,p,"_pt"),delete f[_]),h!=="all"&&(h[_]=1)}return this._initted&&!this._pt&&u&&ya(this),this},e.to=function(i,s){return new e(i,s,arguments[2])},e.from=function(i,s){return Na(1,arguments)},e.delayedCall=function(i,s,a,o){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},e.fromTo=function(i,s,a){return Na(2,arguments)},e.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(i,s)},e.killTweensOf=function(i,s,a){return It.killTweensOf(i,s,a)},e})(Ka);ri(jt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});On("staggerTo,staggerFrom,staggerFromTo",function(r){jt[r]=function(){var e=new Un,t=Hc.call(arguments,0);return t.splice(r==="staggerFromTo"?5:4,0,0),e[r].apply(e,t)}});var df=function(e,t,n){return e[t]=n},Ap=function(e,t,n){return e[t](n)},h_=function(e,t,n,i){return e[t](i.fp,n)},d_=function(e,t,n){return e.setAttribute(t,n)},pf=function(e,t){return zt(e[t])?Ap:nf(e[t])&&e.setAttribute?d_:df},wp=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},p_=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Rp=function(e,t){var n=t._pt,i="";if(!e&&t.b)i=t.b;else if(e===1&&t.e)i=t.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+i,n=n._next;i+=t.c}t.set(t.t,t.p,i,t)},mf=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},m_=function(e,t,n,i){for(var s=this._pt,a;s;)a=s._next,s.p===i&&s.modifier(e,t,n),s=a},g_=function(e){for(var t=this._pt,n,i;t;)i=t._next,t.p===e&&!t.op||t.op===e?Cl(this,t,"_pt"):t.dep||(n=1),t=i;return!n},__=function(e,t,n,i){i.mSet(e,t,i.m.call(i.tween,n,i.mt),i)},Cp=function(e){for(var t=e._pt,n,i,s,a;t;){for(n=t._next,i=s;i&&i.pr>t.pr;)i=i._next;(t._prev=i?i._prev:a)?t._prev._next=t:s=t,(t._next=i)?i._prev=t:a=t,t=n}e._pt=s},Bn=(function(){function r(t,n,i,s,a,o,l,c,u){this.t=n,this.s=s,this.c=a,this.p=i,this.r=o||wp,this.d=l||this,this.set=c||df,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=r.prototype;return e.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=__,this.m=n,this.mt=s,this.tween=i},r})();On(lf+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return of[r]=1});ii.TweenMax=ii.TweenLite=jt;ii.TimelineLite=ii.TimelineMax=Un;It=new Un({sortChildren:!1,defaults:Wa,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ti.stringFilter=Sp;var is=[],jo={},x_=[],ih=0,v_=0,Xl=function(e){return(jo[e]||x_).map(function(t){return t()})},Yc=function(){var e=Date.now(),t=[];e-ih>2&&(Xl("matchMediaInit"),is.forEach(function(n){var i=n.queries,s=n.conditions,a,o,l,c;for(o in i)a=Ci.matchMedia(i[o]).matches,a&&(l=1),a!==s[o]&&(s[o]=a,c=1);c&&(n.revert(),l&&t.push(n))}),Xl("matchMediaRevert"),t.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),ih=e,Xl("matchMedia"))},Pp=(function(){function r(t,n){this.selector=n&&Vc(n),this.data=[],this._r=[],this.isReverted=!1,this.id=v_++,t&&this.add(t)}var e=r.prototype;return e.add=function(n,i,s){zt(n)&&(s=i,i=n,n=zt);var a=this,o=function(){var c=Dt,u=a.selector,d;return c&&c!==a&&c.data.push(a),s&&(a.selector=Vc(s)),Dt=a,d=i.apply(a,arguments),zt(d)&&a._r.push(d),Dt=c,a.selector=u,a.isReverted=!1,d};return a.last=o,n===zt?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},e.ignore=function(n){var i=Dt;Dt=null,n(this),Dt=i},e.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof jt&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(n,i){var s=this;if(n?(function(){for(var o=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return o.splice(o.indexOf(u),1)}));for(o.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,d){return d.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Un?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof jt)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i)for(var a=is.length;a--;)is[a].id===this.id&&is.splice(a,1)},e.revert=function(n){this.kill(n||{})},r})(),S_=(function(){function r(t){this.contexts=[],this.scope=t,Dt&&Dt.data.push(this)}var e=r.prototype;return e.add=function(n,i,s){Gi(n)||(n={matches:n});var a=new Pp(0,s||this.scope),o=a.conditions={},l,c,u;Dt&&!a.selector&&(a.selector=Dt.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?u=1:(l=Ci.matchMedia(n[c]),l&&(is.indexOf(a)<0&&is.push(a),(o[c]=l.matches)&&(u=1),l.addListener?l.addListener(Yc):l.addEventListener("change",Yc)));return u&&i(a,function(d){return a.add(null,d)}),this},e.revert=function(n){this.kill(n||{})},e.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),pl={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(i){return _p(i)})},timeline:function(e){return new Un(e)},getTweensOf:function(e,t){return It.getTweensOf(e,t)},getProperty:function(e,t,n,i){cn(e)&&(e=pi(e)[0]);var s=es(e||{}).get,a=n?rp:ip;return n==="native"&&(n=""),e&&(t?a((Kn[t]&&Kn[t].get||s)(e,t,n,i)):function(o,l,c){return a((Kn[o]&&Kn[o].get||s)(e,o,l,c))})},quickSetter:function(e,t,n){if(e=pi(e),e.length>1){var i=e.map(function(u){return Hn.quickSetter(u,t,n)}),s=i.length;return function(u){for(var d=s;d--;)i[d](u)}}e=e[0]||{};var a=Kn[t],o=es(e),l=o.harness&&(o.harness.aliases||{})[t]||t,c=a?function(u){var d=new a;Gs._pt=0,d.init(e,n?u+n:u,Gs,0,[e]),d.render(1,d),Gs._pt&&mf(1,Gs)}:o.set(e,l);return a?c:function(u){return c(e,l,n?u+n:u,o,1)}},quickTo:function(e,t,n){var i,s=Hn.to(e,ri((i={},i[t]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,u){return s.resetTo(t,l,c,u)};return a.tween=s,a},isTweening:function(e){return It.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=ns(e.ease,Wa.ease)),Jf(Wa,e||{})},config:function(e){return Jf(ti,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,i=e.plugins,s=e.defaults,a=e.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!Kn[o]&&!ii[o]&&Xa(t+" effect requires "+o+" plugin.")}),Gl[t]=function(o,l,c){return n(pi(o),ri(l||{},s),c)},a&&(Un.prototype[t]=function(o,l,c){return this.add(Gl[t](o,Gi(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){ct[e]=ns(t)},parseEase:function(e,t){return arguments.length?ns(e,t):ct},getById:function(e){return It.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new Un(e),i,s;for(n.smoothChildTiming=Fn(e.smoothChildTiming),It.remove(n),n._dp=0,n._time=n._tTime=It._time,i=It._first;i;)s=i._next,(t||!(!i._dur&&i instanceof jt&&i.vars.onComplete===i._targets[0]))&&Ni(n,i,i._start-i._delay),i=s;return Ni(It,n,0),n},context:function(e,t){return e?new Pp(e,t):Dt},matchMedia:function(e){return new S_(e)},matchMediaRefresh:function(){return is.forEach(function(e){var t=e.conditions,n,i;for(i in t)t[i]&&(t[i]=!1,n=1);n&&e.revert()})||Yc()},addEventListener:function(e,t){var n=jo[e]||(jo[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=jo[e],i=n&&n.indexOf(t);i>=0&&n.splice(i,1)},utils:{wrap:jg,wrapYoyo:Jg,distribute:fp,random:dp,snap:hp,normalize:Zg,getUnit:vn,clamp:Yg,splitColor:xp,toArray:pi,selector:Vc,mapRange:mp,pipe:$g,unitize:Kg,interpolate:Qg,shuffle:up},install:Jd,effects:Gl,ticker:jn,updateRoot:Un.updateRoot,plugins:Kn,globalTimeline:It,core:{PropTween:Bn,globals:Qd,Tween:jt,Timeline:Un,Animation:Ka,getCache:es,_removeLinkedListItem:Cl,reverting:function(){return hn},context:function(e){return e&&Dt&&(Dt.data.push(e),e._ctx=Dt),Dt},suppressOverwrites:function(e){return tf=e}}};On("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return pl[r]=jt[r]});jn.add(Un.updateRoot);Gs=pl.to({},{duration:0});var M_=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},y_=function(e,t){var n=e._targets,i,s,a;for(i in t)for(s=n.length;s--;)a=e._ptLookup[s][i],a&&(a=a.d)&&(a._pt&&(a=M_(a,i)),a&&a.modifier&&a.modifier(t[i],e,n[s],i))},Yl=function(e,t){return{name:e,headless:1,rawVars:1,init:function(i,s,a){a._onInit=function(o){var l,c;if(cn(s)&&(l={},On(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}y_(o,s)}}}},Hn=pl.registerPlugin({name:"attr",init:function(e,t,n,i,s){var a,o,l;this.tween=n;for(a in t)l=e.getAttribute(a)||"",o=this.add(e,"setAttribute",(l||0)+"",t[a],i,s,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(e,t){for(var n=t._pt;n;)hn?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:"endArray",headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},Yl("roundProps",Wc),Yl("modifiers"),Yl("snap",hp))||pl;jt.version=Un.version=Hn.version="3.15.0";jd=1;rf()&&ia();ct.Power0;ct.Power1;ct.Power2;ct.Power3;ct.Power4;ct.Linear;ct.Quad;ct.Cubic;ct.Quart;ct.Quint;ct.Strong;ct.Elastic;ct.Back;ct.SteppedEase;ct.Bounce;ct.Sine;ct.Expo;ct.Circ;var rh,br,Ws,gf,Zr,sh,_f,b_=function(){return typeof window<"u"},ar={},Wr=180/Math.PI,Xs=Math.PI/180,Ss=Math.atan2,ah=1e8,xf=/([A-Z])/g,E_=/(left|right|width|margin|padding|x)/i,T_=/[\s,\(]\S/,Li={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},qc=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},A_=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},w_=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},R_=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},C_=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},Dp=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Np=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},P_=function(e,t,n){return e.style[t]=n},D_=function(e,t,n){return e.style.setProperty(t,n)},N_=function(e,t,n){return e._gsap[t]=n},L_=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},I_=function(e,t,n,i,s){var a=e._gsap;a.scaleX=a.scaleY=n,a.renderTransform(s,a)},U_=function(e,t,n,i,s){var a=e._gsap;a[t]=n,a.renderTransform(s,a)},Ut="transform",kn=Ut+"Origin",F_=function r(e,t){var n=this,i=this.target,s=i.style,a=i._gsap;if(e in ar&&s){if(this.tfm=this.tfm||{},e!=="transform")e=Li[e]||e,~e.indexOf(",")?e.split(",").forEach(function(o){return n.tfm[o]=Ki(i,o)}):this.tfm[e]=a.x?a[e]:Ki(i,e),e===kn&&(this.tfm.zOrigin=a.zOrigin);else return Li.transform.split(",").forEach(function(o){return r.call(n,o,t)});if(this.props.indexOf(Ut)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(kn,t,"")),e=Ut}(s||t)&&this.props.push(e,t,s[e])},Lp=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},O_=function(){var e=this.props,t=this.target,n=t.style,i=t._gsap,s,a;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?n[e[s]]=e[s+2]:n.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(xf,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=_f(),(!s||!s.isStart)&&!n[Ut]&&(Lp(n),i.zOrigin&&n[kn]&&(n[kn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},Ip=function(e,t){var n={target:e,props:[],revert:O_,save:F_};return e._gsap||Hn.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(i){return n.save(i)}),n},Up,$c=function(e,t){var n=br.createElementNS?br.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):br.createElement(e);return n&&n.style?n:br.createElement(e)},ei=function r(e,t,n){var i=getComputedStyle(e);return i[t]||i.getPropertyValue(t.replace(xf,"-$1").toLowerCase())||i.getPropertyValue(t)||!n&&r(e,ra(t)||t,1)||""},oh="O,Moz,ms,Ms,Webkit".split(","),ra=function(e,t,n){var i=t||Zr,s=i.style,a=5;if(e in s&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(oh[a]+e in s););return a<0?null:(a===3?"ms":a>=0?oh[a]:"")+e},Kc=function(){b_()&&window.document&&(rh=window,br=rh.document,Ws=br.documentElement,Zr=$c("div")||{style:{}},$c("div"),Ut=ra(Ut),kn=Ut+"Origin",Zr.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Up=!!ra("perspective"),_f=Hn.core.reverting,gf=1)},lh=function(e){var t=e.ownerSVGElement,n=$c("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=e.cloneNode(!0),s;i.style.display="block",n.appendChild(i),Ws.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),Ws.removeChild(n),s},ch=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},Fp=function(e){var t,n;try{t=e.getBBox()}catch{t=lh(e),n=1}return t&&(t.width||t.height)||n||(t=lh(e)),t&&!t.width&&!t.x&&!t.y?{x:+ch(e,["x","cx","x1"])||0,y:+ch(e,["y","cy","y1"])||0,width:0,height:0}:t},Op=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Fp(e))},Lr=function(e,t){if(t){var n=e.style,i;t in ar&&t!==kn&&(t=Ut),n.removeProperty?(i=t.substr(0,2),(i==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),n.removeProperty(i==="--"?t:t.replace(xf,"-$1").toLowerCase())):n.removeAttribute(t)}},Er=function(e,t,n,i,s,a){var o=new Bn(e._pt,t,n,0,1,a?Np:Dp);return e._pt=o,o.b=i,o.e=s,e._props.push(n),o},uh={deg:1,rad:1,turn:1},B_={grid:1,flex:1},Ir=function r(e,t,n,i){var s=parseFloat(n)||0,a=(n+"").trim().substr((s+"").length)||"px",o=Zr.style,l=E_.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),d=100,f=i==="px",h=i==="%",g,_,p,m;if(i===a||!s||uh[i]||uh[a])return s;if(a!=="px"&&!f&&(s=r(e,t,n,"px")),m=e.getCTM&&Op(e),(h||a==="%")&&(ar[t]||~t.indexOf("adius")))return g=m?e.getBBox()[l?"width":"height"]:e[u],Wt(h?s/g*d:s/100*g);if(o[l?"width":"height"]=d+(f?a:i),_=i!=="rem"&&~t.indexOf("adius")||i==="em"&&e.appendChild&&!c?e:e.parentNode,m&&(_=(e.ownerSVGElement||{}).parentNode),(!_||_===br||!_.appendChild)&&(_=br.body),p=_._gsap,p&&h&&p.width&&l&&p.time===jn.time&&!p.uncache)return Wt(s/p.width*d);if(h&&(t==="height"||t==="width")){var b=e.style[t];e.style[t]=d+i,g=e[u],b?e.style[t]=b:Lr(e,t)}else(h||a==="%")&&!B_[ei(_,"display")]&&(o.position=ei(e,"position")),_===e&&(o.position="static"),_.appendChild(Zr),g=Zr[u],_.removeChild(Zr),o.position="absolute";return l&&h&&(p=es(_),p.time=jn.time,p.width=_[u]),Wt(f?g*s/d:g&&s?d/g*s:0)},Ki=function(e,t,n,i){var s;return gf||Kc(),t in Li&&t!=="transform"&&(t=Li[t],~t.indexOf(",")&&(t=t.split(",")[0])),ar[t]&&t!=="transform"?(s=ja(e,i),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:gl(ei(e,kn))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=ml[t]&&ml[t](e,t,n)||ei(e,t)||tp(e,t)||(t==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Ir(e,t,s,n)+n:s},k_=function(e,t,n,i){if(!n||n==="none"){var s=ra(t,e,1),a=s&&ei(e,s,1);a&&a!==n?(t=s,n=a):t==="borderColor"&&(n=ei(e,"borderTopColor"))}var o=new Bn(this._pt,e.style,t,0,1,Rp),l=0,c=0,u,d,f,h,g,_,p,m,b,w,S,E;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=ei(e,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=e.style[t],e.style[t]=i,i=ei(e,t)||i,_?e.style[t]=_:Lr(e,t)),u=[n,i],Sp(u),n=u[0],i=u[1],f=n.match(zs)||[],E=i.match(zs)||[],E.length){for(;d=zs.exec(i);)p=d[0],b=i.substring(l,d.index),g?g=(g+1)%5:(b.substr(-5)==="rgba("||b.substr(-5)==="hsla(")&&(g=1),p!==(_=f[c++]||"")&&(h=parseFloat(_)||0,S=_.substr((h+"").length),p.charAt(1)==="="&&(p=Vs(h,p)+S),m=parseFloat(p),w=p.substr((m+"").length),l=zs.lastIndex-w.length,w||(w=w||ti.units[t]||S,l===i.length&&(i+=w,o.e+=w)),S!==w&&(h=Ir(e,t,_,w)||0),o._pt={_next:o._pt,p:b||c===1?b:",",s:h,c:m-h,m:g&&g<4||t==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=t==="display"&&i==="none"?Np:Dp;return Zd.test(i)&&(o.e=0),this._pt=o,o},fh={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},z_=function(e){var t=e.split(" "),n=t[0],i=t[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(e=n,n=i,i=e),t[0]=fh[n]||n,t[1]=fh[i]||i,t.join(" ")},G_=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,i=n.style,s=t.u,a=n._gsap,o,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)o=s[c],ar[o]&&(l=1,o=o==="transformOrigin"?kn:Ut),Lr(n,o);l&&(Lr(n,Ut),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",ja(n,1),a.uncache=1,Lp(i)))}},ml={clearProps:function(e,t,n,i,s){if(s.data!=="isFromStart"){var a=e._pt=new Bn(e._pt,t,n,0,0,G_);return a.u=i,a.pr=-10,a.tween=s,e._props.push(n),1}}},Za=[1,0,0,1,0,0],Bp={},kp=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},hh=function(e){var t=ei(e,Ut);return kp(t)?Za:t.substr(7).match(Kd).map(Wt)},vf=function(e,t){var n=e._gsap||es(e),i=e.style,s=hh(e),a,o,l,c;return n.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Za:s):(s===Za&&!e.offsetParent&&e!==Ws&&!n.svg&&(l=i.display,i.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,o=e.nextElementSibling,Ws.appendChild(e)),s=hh(e),l?i.display=l:Lr(e,"display"),c&&(o?a.insertBefore(e,o):a?a.appendChild(e):Ws.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Zc=function(e,t,n,i,s,a){var o=e._gsap,l=s||vf(e,!0),c=o.xOrigin||0,u=o.yOrigin||0,d=o.xOffset||0,f=o.yOffset||0,h=l[0],g=l[1],_=l[2],p=l[3],m=l[4],b=l[5],w=t.split(" "),S=parseFloat(w[0])||0,E=parseFloat(w[1])||0,T,A,v,y;n?l!==Za&&(A=h*p-g*_)&&(v=S*(p/A)+E*(-_/A)+(_*b-p*m)/A,y=S*(-g/A)+E*(h/A)-(h*b-g*m)/A,S=v,E=y):(T=Fp(e),S=T.x+(~w[0].indexOf("%")?S/100*T.width:S),E=T.y+(~(w[1]||w[0]).indexOf("%")?E/100*T.height:E)),i||i!==!1&&o.smooth?(m=S-c,b=E-u,o.xOffset=d+(m*h+b*_)-m,o.yOffset=f+(m*g+b*p)-b):o.xOffset=o.yOffset=0,o.xOrigin=S,o.yOrigin=E,o.smooth=!!i,o.origin=t,o.originIsAbsolute=!!n,e.style[kn]="0px 0px",a&&(Er(a,o,"xOrigin",c,S),Er(a,o,"yOrigin",u,E),Er(a,o,"xOffset",d,o.xOffset),Er(a,o,"yOffset",f,o.yOffset)),e.setAttribute("data-svg-origin",S+" "+E)},ja=function(e,t){var n=e._gsap||new yp(e);if("x"in n&&!t&&!n.uncache)return n;var i=e.style,s=n.scaleX<0,a="px",o="deg",l=getComputedStyle(e),c=ei(e,kn)||"0",u,d,f,h,g,_,p,m,b,w,S,E,T,A,v,y,C,L,P,O,G,U,H,B,K,te,N,ae,de,Ve,Xe,Be;return u=d=f=_=p=m=b=w=S=0,h=g=1,n.svg=!!(e.getCTM&&Op(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Ut]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Ut]!=="none"?l[Ut]:"")),i.scale=i.rotate=i.translate="none"),A=vf(e,n.svg),n.svg&&(n.uncache?(K=e.getBBox(),c=n.xOrigin-K.x+"px "+(n.yOrigin-K.y)+"px",B=""):B=!t&&e.getAttribute("data-svg-origin"),Zc(e,B||c,!!B||n.originIsAbsolute,n.smooth!==!1,A)),E=n.xOrigin||0,T=n.yOrigin||0,A!==Za&&(L=A[0],P=A[1],O=A[2],G=A[3],u=U=A[4],d=H=A[5],A.length===6?(h=Math.sqrt(L*L+P*P),g=Math.sqrt(G*G+O*O),_=L||P?Ss(P,L)*Wr:0,b=O||G?Ss(O,G)*Wr+_:0,b&&(g*=Math.abs(Math.cos(b*Xs))),n.svg&&(u-=E-(E*L+T*O),d-=T-(E*P+T*G))):(Be=A[6],Ve=A[7],N=A[8],ae=A[9],de=A[10],Xe=A[11],u=A[12],d=A[13],f=A[14],v=Ss(Be,de),p=v*Wr,v&&(y=Math.cos(-v),C=Math.sin(-v),B=U*y+N*C,K=H*y+ae*C,te=Be*y+de*C,N=U*-C+N*y,ae=H*-C+ae*y,de=Be*-C+de*y,Xe=Ve*-C+Xe*y,U=B,H=K,Be=te),v=Ss(-O,de),m=v*Wr,v&&(y=Math.cos(-v),C=Math.sin(-v),B=L*y-N*C,K=P*y-ae*C,te=O*y-de*C,Xe=G*C+Xe*y,L=B,P=K,O=te),v=Ss(P,L),_=v*Wr,v&&(y=Math.cos(v),C=Math.sin(v),B=L*y+P*C,K=U*y+H*C,P=P*y-L*C,H=H*y-U*C,L=B,U=K),p&&Math.abs(p)+Math.abs(_)>359.9&&(p=_=0,m=180-m),h=Wt(Math.sqrt(L*L+P*P+O*O)),g=Wt(Math.sqrt(H*H+Be*Be)),v=Ss(U,H),b=Math.abs(v)>2e-4?v*Wr:0,S=Xe?1/(Xe<0?-Xe:Xe):0),n.svg&&(B=e.getAttribute("transform"),n.forceCSS=e.setAttribute("transform","")||!kp(ei(e,Ut)),B&&e.setAttribute("transform",B))),Math.abs(b)>90&&Math.abs(b)<270&&(s?(h*=-1,b+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,b+=b<=0?180:-180)),t=t||n.uncache,n.x=u-((n.xPercent=u&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+a,n.y=d-((n.yPercent=d&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-d)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+a,n.z=f+a,n.scaleX=Wt(h),n.scaleY=Wt(g),n.rotation=Wt(_)+o,n.rotationX=Wt(p)+o,n.rotationY=Wt(m)+o,n.skewX=b+o,n.skewY=w+o,n.transformPerspective=S+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!t&&n.zOrigin||0)&&(i[kn]=gl(c)),n.xOffset=n.yOffset=0,n.force3D=ti.force3D,n.renderTransform=n.svg?V_:Up?zp:H_,n.uncache=0,n},gl=function(e){return(e=e.split(" "))[0]+" "+e[1]},ql=function(e,t,n){var i=vn(t);return Wt(parseFloat(t)+parseFloat(Ir(e,"x",n+"px",i)))+i},H_=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,zp(e,t)},Br="0deg",ha="0px",kr=") ",zp=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,u=n.rotationY,d=n.rotationX,f=n.skewX,h=n.skewY,g=n.scaleX,_=n.scaleY,p=n.transformPerspective,m=n.force3D,b=n.target,w=n.zOrigin,S="",E=m==="auto"&&e&&e!==1||m===!0;if(w&&(d!==Br||u!==Br)){var T=parseFloat(u)*Xs,A=Math.sin(T),v=Math.cos(T),y;T=parseFloat(d)*Xs,y=Math.cos(T),a=ql(b,a,A*y*-w),o=ql(b,o,-Math.sin(T)*-w),l=ql(b,l,v*y*-w+w)}p!==ha&&(S+="perspective("+p+kr),(i||s)&&(S+="translate("+i+"%, "+s+"%) "),(E||a!==ha||o!==ha||l!==ha)&&(S+=l!==ha||E?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+kr),c!==Br&&(S+="rotate("+c+kr),u!==Br&&(S+="rotateY("+u+kr),d!==Br&&(S+="rotateX("+d+kr),(f!==Br||h!==Br)&&(S+="skew("+f+", "+h+kr),(g!==1||_!==1)&&(S+="scale("+g+", "+_+kr),b.style[Ut]=S||"translate(0, 0)"},V_=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,u=n.skewY,d=n.scaleX,f=n.scaleY,h=n.target,g=n.xOrigin,_=n.yOrigin,p=n.xOffset,m=n.yOffset,b=n.forceCSS,w=parseFloat(a),S=parseFloat(o),E,T,A,v,y;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=Xs,c*=Xs,E=Math.cos(l)*d,T=Math.sin(l)*d,A=Math.sin(l-c)*-f,v=Math.cos(l-c)*f,c&&(u*=Xs,y=Math.tan(c-u),y=Math.sqrt(1+y*y),A*=y,v*=y,u&&(y=Math.tan(u),y=Math.sqrt(1+y*y),E*=y,T*=y)),E=Wt(E),T=Wt(T),A=Wt(A),v=Wt(v)):(E=d,v=f,T=A=0),(w&&!~(a+"").indexOf("px")||S&&!~(o+"").indexOf("px"))&&(w=Ir(h,"x",a,"px"),S=Ir(h,"y",o,"px")),(g||_||p||m)&&(w=Wt(w+g-(g*E+_*A)+p),S=Wt(S+_-(g*T+_*v)+m)),(i||s)&&(y=h.getBBox(),w=Wt(w+i/100*y.width),S=Wt(S+s/100*y.height)),y="matrix("+E+","+T+","+A+","+v+","+w+","+S+")",h.setAttribute("transform",y),b&&(h.style[Ut]=y)},W_=function(e,t,n,i,s){var a=360,o=cn(s),l=parseFloat(s)*(o&&~s.indexOf("rad")?Wr:1),c=l-i,u=i+c+"deg",d,f;return o&&(d=s.split("_")[1],d==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),d==="cw"&&c<0?c=(c+a*ah)%a-~~(c/a)*a:d==="ccw"&&c>0&&(c=(c-a*ah)%a-~~(c/a)*a)),e._pt=f=new Bn(e._pt,t,n,i,c,A_),f.e=u,f.u="deg",e._props.push(n),f},dh=function(e,t){for(var n in t)e[n]=t[n];return e},X_=function(e,t,n){var i=dh({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,u,d,f,h,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[Ut]=t,o=ja(n,1),Lr(n,Ut),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Ut],a[Ut]=t,o=ja(n,1),a[Ut]=c);for(l in ar)c=i[l],u=o[l],c!==u&&s.indexOf(l)<0&&(h=vn(c),g=vn(u),d=h!==g?Ir(n,l,c,g):parseFloat(c),f=parseFloat(u),e._pt=new Bn(e._pt,o,l,d,f-d,qc),e._pt.u=g||0,e._props.push(l));dh(o,i)};On("padding,margin,Width,Radius",function(r,e){var t="Top",n="Right",i="Bottom",s="Left",a=(e<3?[t,n,i,s]:[t+s,t+n,i+n,i+s]).map(function(o){return e<2?r+o:"border"+o+r});ml[e>1?"border"+r:r]=function(o,l,c,u,d){var f,h;if(arguments.length<4)return f=a.map(function(g){return Ki(o,g,c)}),h=f.join(" "),h.split(f[0]).length===5?f[0]:h;f=(u+"").split(" "),h={},a.forEach(function(g,_){return h[g]=f[_]=f[_]||f[(_-1)/2|0]}),o.init(l,h,d)}});var Gp={name:"css",register:Kc,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,i,s){var a=this._props,o=e.style,l=n.vars.startAt,c,u,d,f,h,g,_,p,m,b,w,S,E,T,A,v,y;gf||Kc(),this.styles=this.styles||Ip(e),v=this.styles.props,this.tween=n;for(_ in t)if(_!=="autoRound"&&(u=t[_],!(Kn[_]&&bp(_,t,n,i,e,s)))){if(h=typeof u,g=ml[_],h==="function"&&(u=u.call(n,i,e,s),h=typeof u),h==="string"&&~u.indexOf("random(")&&(u=qa(u)),g)g(this,e,_,u,n)&&(A=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(_)+"").trim(),u+="",Cr.lastIndex=0,Cr.test(c)||(p=vn(c),m=vn(u),m?p!==m&&(c=Ir(e,_,c,m)+m):p&&(u+=p)),this.add(o,"setProperty",c,u,i,s,0,0,_),a.push(_),v.push(_,0,o[_]);else if(h!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,e,s):l[_],cn(c)&&~c.indexOf("random(")&&(c=qa(c)),vn(c+"")||c==="auto"||(c+=ti.units[_]||vn(Ki(e,_))||""),(c+"").charAt(1)==="="&&(c=Ki(e,_))):c=Ki(e,_),f=parseFloat(c),b=h==="string"&&u.charAt(1)==="="&&u.substr(0,2),b&&(u=u.substr(2)),d=parseFloat(u),_ in Li&&(_==="autoAlpha"&&(f===1&&Ki(e,"visibility")==="hidden"&&d&&(f=0),v.push("visibility",0,o.visibility),Er(this,o,"visibility",f?"inherit":"hidden",d?"inherit":"hidden",!d)),_!=="scale"&&_!=="transform"&&(_=Li[_],~_.indexOf(",")&&(_=_.split(",")[0]))),w=_ in ar,w){if(this.styles.save(_),y=u,h==="string"&&u.substring(0,6)==="var(--"){if(u=ei(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var C=e.style.perspective;e.style.perspective=u,u=ei(e,"perspective"),C?e.style.perspective=C:Lr(e,"perspective")}d=parseFloat(u)}if(S||(E=e._gsap,E.renderTransform&&!t.parseTransform||ja(e,t.parseTransform),T=t.smoothOrigin!==!1&&E.smooth,S=this._pt=new Bn(this._pt,o,Ut,0,1,E.renderTransform,E,0,-1),S.dep=1),_==="scale")this._pt=new Bn(this._pt,E,"scaleY",E.scaleY,(b?Vs(E.scaleY,b+d):d)-E.scaleY||0,qc),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){v.push(kn,0,o[kn]),u=z_(u),E.svg?Zc(e,u,0,T,0,this):(m=parseFloat(u.split(" ")[2])||0,m!==E.zOrigin&&Er(this,E,"zOrigin",E.zOrigin,m),Er(this,o,_,gl(c),gl(u)));continue}else if(_==="svgOrigin"){Zc(e,u,1,T,0,this);continue}else if(_ in Bp){W_(this,E,_,f,b?Vs(f,b+u):u);continue}else if(_==="smoothOrigin"){Er(this,E,"smooth",E.smooth,u);continue}else if(_==="force3D"){E[_]=u;continue}else if(_==="transform"){X_(this,u,e);continue}}else _ in o||(_=ra(_)||_);if(w||(d||d===0)&&(f||f===0)&&!T_.test(u)&&_ in o)p=(c+"").substr((f+"").length),d||(d=0),m=vn(u)||(_ in ti.units?ti.units[_]:p),p!==m&&(f=Ir(e,_,c,m)),this._pt=new Bn(this._pt,w?E:o,_,f,(b?Vs(f,b+d):d)-f,!w&&(m==="px"||_==="zIndex")&&t.autoRound!==!1?C_:qc),this._pt.u=m||0,w&&y!==u?(this._pt.b=c,this._pt.e=y,this._pt.r=R_):p!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=w_);else if(_ in o)k_.call(this,e,_,c,b?b+u:u);else if(_ in e)this.add(e,_,c||e[_],b?b+u:u,i,s);else if(_!=="parseTransform"){af(_,u);continue}w||(_ in o?v.push(_,0,o[_]):typeof e[_]=="function"?v.push(_,2,e[_]()):v.push(_,1,c||e[_])),a.push(_)}}A&&Cp(this)},render:function(e,t){if(t.tween._time||!_f())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:Ki,aliases:Li,getSetter:function(e,t,n){var i=Li[t];return i&&i.indexOf(",")<0&&(t=i),t in ar&&t!==kn&&(e._gsap.x||Ki(e,"x"))?n&&sh===n?t==="scale"?L_:N_:(sh=n||{})&&(t==="scale"?I_:U_):e.style&&!nf(e.style[t])?P_:~t.indexOf("-")?D_:pf(e,t)},core:{_removeProperty:Lr,_getMatrix:vf}};Hn.utils.checkPrefix=ra;Hn.core.getStyleSaver=Ip;(function(r,e,t,n){var i=On(r+","+e+","+t,function(s){ar[s]=1});On(e,function(s){ti.units[s]="deg",Bp[s]=1}),Li[i[13]]=r+","+e,On(n,function(s){var a=s.split(":");Li[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");On("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){ti.units[r]="px"});Hn.registerPlugin(Gp);var Ys=Hn.registerPlugin(Gp)||Hn;Ys.core.Tween;function Y_(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function q_(r,e,t){return e&&Y_(r.prototype,e),r}var un,Jo,Jn,Tr,Ar,qs,Hp,Xr,$s,Vp,Ji,vi,Wp,Xp=function(){return un||typeof window<"u"&&(un=window.gsap)&&un.registerPlugin&&un},Yp=1,Hs=[],nt=[],Bi=[],Ia=Date.now,jc=function(e,t){return t},$_=function(){var e=$s.core,t=e.bridge||{},n=e._scrollers,i=e._proxies;n.push.apply(n,nt),i.push.apply(i,Bi),nt=n,Bi=i,jc=function(a,o){return t[a](o)}},Pr=function(e,t){return~Bi.indexOf(e)&&Bi[Bi.indexOf(e)+1][t]},Ua=function(e){return!!~Vp.indexOf(e)},An=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:i!==!1,capture:!!s})},Tn=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},co="scrollLeft",uo="scrollTop",Jc=function(){return Ji&&Ji.isPressed||nt.cache++},_l=function(e,t){var n=function i(s){if(s||s===0){Yp&&(Jn.history.scrollRestoration="manual");var a=Ji&&Ji.isPressed;s=i.v=Math.round(s)||(Ji&&Ji.iOS?1:0),e(s),i.cacheID=nt.cache,a&&jc("ss",s)}else(t||nt.cache!==i.cacheID||jc("ref"))&&(i.cacheID=nt.cache,i.v=e());return i.v+i.offset};return n.offset=0,e&&n},Dn={s:co,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:_l(function(r){return arguments.length?Jn.scrollTo(r,en.sc()):Jn.pageXOffset||Tr[co]||Ar[co]||qs[co]||0})},en={s:uo,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:Dn,sc:_l(function(r){return arguments.length?Jn.scrollTo(Dn.sc(),r):Jn.pageYOffset||Tr[uo]||Ar[uo]||qs[uo]||0})},In=function(e,t){return(t&&t._ctx&&t._ctx.selector||un.utils.toArray)(e)[0]||(typeof e=="string"&&un.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},K_=function(e,t){for(var n=t.length;n--;)if(t[n]===e||t[n].contains(e))return!0;return!1},Ur=function(e,t){var n=t.s,i=t.sc;Ua(e)&&(e=Tr.scrollingElement||Ar);var s=nt.indexOf(e),a=i===en.sc?1:2;!~s&&(s=nt.push(e)-1),nt[s+a]||An(e,"scroll",Jc);var o=nt[s+a],l=o||(nt[s+a]=_l(Pr(e,n),!0)||(Ua(e)?i:_l(function(c){return arguments.length?e[n]=c:e[n]})));return l.target=e,o||(l.smooth=un.getProperty(e,"scrollBehavior")==="smooth"),l},Qc=function(e,t,n){var i=e,s=e,a=Ia(),o=a,l=t||50,c=Math.max(500,l*3),u=function(g,_){var p=Ia();_||p-a>l?(s=i,i=g,o=a,a=p):n?i+=g:i=s+(g-s)/(p-o)*(a-o)},d=function(){s=i=n?0:i,o=a=0},f=function(g){var _=o,p=s,m=Ia();return(g||g===0)&&g!==i&&u(g),a===o||m-o>c?0:(i+(n?p:-p))/((n?m:a)-_)*1e3};return{update:u,reset:d,getVelocity:f}},da=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},ph=function(e){var t=Math.max.apply(Math,e),n=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(n)?t:n},qp=function(){$s=un.core.globals().ScrollTrigger,$s&&$s.core&&$_()},$p=function(e){return un=e||Xp(),!Jo&&un&&typeof document<"u"&&document.body&&(Jn=window,Tr=document,Ar=Tr.documentElement,qs=Tr.body,Vp=[Jn,Tr,Ar,qs],un.utils.clamp,Wp=un.core.context||function(){},Xr="onpointerenter"in qs?"pointer":"mouse",Hp=Xt.isTouch=Jn.matchMedia&&Jn.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Jn||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,vi=Xt.eventTypes=("ontouchstart"in Ar?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Ar?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return Yp=0},500),Jo=1),$s||qp(),Jo};Dn.op=en;nt.cache=0;var Xt=(function(){function r(t){this.init(t)}var e=r.prototype;return e.init=function(n){Jo||$p(un)||console.warn("Please gsap.registerPlugin(Observer)"),$s||qp();var i=n.tolerance,s=n.dragMinimum,a=n.type,o=n.target,l=n.lineHeight,c=n.debounce,u=n.preventDefault,d=n.onStop,f=n.onStopDelay,h=n.ignore,g=n.wheelSpeed,_=n.event,p=n.onDragStart,m=n.onDragEnd,b=n.onDrag,w=n.onPress,S=n.onRelease,E=n.onRight,T=n.onLeft,A=n.onUp,v=n.onDown,y=n.onChangeX,C=n.onChangeY,L=n.onChange,P=n.onToggleX,O=n.onToggleY,G=n.onHover,U=n.onHoverEnd,H=n.onMove,B=n.ignoreCheck,K=n.isNormalizer,te=n.onGestureStart,N=n.onGestureEnd,ae=n.onWheel,de=n.onEnable,Ve=n.onDisable,Xe=n.onClick,Be=n.scrollSpeed,j=n.capture,le=n.allowClicks,re=n.lockAxis,Re=n.onLockAxis;this.target=o=In(o)||Ar,this.vars=n,h&&(h=un.utils.toArray(h)),i=i||1e-9,s=s||0,g=g||1,Be=Be||1,a=a||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Jn.getComputedStyle(qs).lineHeight)||22);var Oe,Te,st,be,ke,We,Ge,Y=this,ut=0,vt=0,At=n.passive||!u&&n.passive!==!1,Ye=Ur(o,Dn),mt=Ur(o,en),F=Ye(),Ft=mt(),ze=~a.indexOf("touch")&&!~a.indexOf("pointer")&&vi[0]==="pointerdown",R=Ua(o),x=o.ownerDocument||Tr,z=[0,0,0],W=[0,0,0],Z=0,fe=function(){return Z=Ia()},ce=function(ie,Ue){return(Y.event=ie)&&h&&K_(ie.target,h)||Ue&&ze&&ie.pointerType!=="touch"||B&&B(ie,Ue)},J=function(){Y._vx.reset(),Y._vy.reset(),Te.pause(),d&&d(Y)},Q=function(){var ie=Y.deltaX=ph(z),Ue=Y.deltaY=ph(W),oe=Math.abs(ie)>=i,Fe=Math.abs(Ue)>=i;L&&(oe||Fe)&&L(Y,ie,Ue,z,W),oe&&(E&&Y.deltaX>0&&E(Y),T&&Y.deltaX<0&&T(Y),y&&y(Y),P&&Y.deltaX<0!=ut<0&&P(Y),ut=Y.deltaX,z[0]=z[1]=z[2]=0),Fe&&(v&&Y.deltaY>0&&v(Y),A&&Y.deltaY<0&&A(Y),C&&C(Y),O&&Y.deltaY<0!=vt<0&&O(Y),vt=Y.deltaY,W[0]=W[1]=W[2]=0),(be||st)&&(H&&H(Y),st&&(p&&st===1&&p(Y),b&&b(Y),st=0),be=!1),We&&!(We=!1)&&Re&&Re(Y),ke&&(ae(Y),ke=!1),Oe=0},me=function(ie,Ue,oe){z[oe]+=ie,W[oe]+=Ue,Y._vx.update(ie),Y._vy.update(Ue),c?Oe||(Oe=requestAnimationFrame(Q)):Q()},we=function(ie,Ue){re&&!Ge&&(Y.axis=Ge=Math.abs(ie)>Math.abs(Ue)?"x":"y",We=!0),Ge!=="y"&&(z[2]+=ie,Y._vx.update(ie,!0)),Ge!=="x"&&(W[2]+=Ue,Y._vy.update(Ue,!0)),c?Oe||(Oe=requestAnimationFrame(Q)):Q()},ge=function(ie){if(!ce(ie,1)){ie=da(ie,u);var Ue=ie.clientX,oe=ie.clientY,Fe=Ue-Y.x,Ce=oe-Y.y,qe=Y.isDragging;Y.x=Ue,Y.y=oe,(qe||(Fe||Ce)&&(Math.abs(Y.startX-Ue)>=s||Math.abs(Y.startY-oe)>=s))&&(st||(st=qe?2:1),qe||(Y.isDragging=!0),we(Fe,Ce))}},pe=Y.onPress=function(se){ce(se,1)||se&&se.button||(Y.axis=Ge=null,Te.pause(),Y.isPressed=!0,se=da(se),ut=vt=0,Y.startX=Y.x=se.clientX,Y.startY=Y.y=se.clientY,Y._vx.reset(),Y._vy.reset(),An(K?o:x,vi[1],ge,At,!0),Y.deltaX=Y.deltaY=0,w&&w(Y))},ue=Y.onRelease=function(se){if(!ce(se,1)){Tn(K?o:x,vi[1],ge,!0);var ie=!isNaN(Y.y-Y.startY),Ue=Y.isDragging,oe=Ue&&(Math.abs(Y.x-Y.startX)>3||Math.abs(Y.y-Y.startY)>3),Fe=da(se);!oe&&ie&&(Y._vx.reset(),Y._vy.reset(),u&&le&&un.delayedCall(.08,function(){if(Ia()-Z>300&&!se.defaultPrevented){if(se.target.click)se.target.click();else if(x.createEvent){var Ce=x.createEvent("MouseEvents");Ce.initMouseEvent("click",!0,!0,Jn,1,Fe.screenX,Fe.screenY,Fe.clientX,Fe.clientY,!1,!1,!1,!1,0,null),se.target.dispatchEvent(Ce)}}})),Y.isDragging=Y.isGesturing=Y.isPressed=!1,d&&Ue&&!K&&Te.restart(!0),st&&Q(),m&&Ue&&m(Y),S&&S(Y,oe)}},De=function(ie){return ie.touches&&ie.touches.length>1&&(Y.isGesturing=!0)&&te(ie,Y.isDragging)},Ie=function(){return(Y.isGesturing=!1)||N(Y)},I=function(ie){if(!ce(ie)){var Ue=Ye(),oe=mt();me((Ue-F)*Be,(oe-Ft)*Be,1),F=Ue,Ft=oe,d&&Te.restart(!0)}},he=function(ie){if(!ce(ie)){ie=da(ie,u),ae&&(ke=!0);var Ue=(ie.deltaMode===1?l:ie.deltaMode===2?Jn.innerHeight:1)*g;me(ie.deltaX*Ue,ie.deltaY*Ue,0),d&&!K&&Te.restart(!0)}},ee=function(ie){if(!ce(ie)){var Ue=ie.clientX,oe=ie.clientY,Fe=Ue-Y.x,Ce=oe-Y.y;Y.x=Ue,Y.y=oe,be=!0,d&&Te.restart(!0),(Fe||Ce)&&we(Fe,Ce)}},_e=function(ie){Y.event=ie,G(Y)},xe=function(ie){Y.event=ie,U(Y)},ne=function(ie){return ce(ie)||da(ie,u)&&Xe(Y)};Te=Y._dc=un.delayedCall(f||.25,J).pause(),Y.deltaX=Y.deltaY=0,Y._vx=Qc(0,50,!0),Y._vy=Qc(0,50,!0),Y.scrollX=Ye,Y.scrollY=mt,Y.isDragging=Y.isGesturing=Y.isPressed=!1,Wp(this),Y.enable=function(se){return Y.isEnabled||(An(R?x:o,"scroll",Jc),a.indexOf("scroll")>=0&&An(R?x:o,"scroll",I,At,j),a.indexOf("wheel")>=0&&An(o,"wheel",he,At,j),(a.indexOf("touch")>=0&&Hp||a.indexOf("pointer")>=0)&&(An(o,vi[0],pe,At,j),An(x,vi[2],ue),An(x,vi[3],ue),le&&An(o,"click",fe,!0,!0),Xe&&An(o,"click",ne),te&&An(x,"gesturestart",De),N&&An(x,"gestureend",Ie),G&&An(o,Xr+"enter",_e),U&&An(o,Xr+"leave",xe),H&&An(o,Xr+"move",ee)),Y.isEnabled=!0,Y.isDragging=Y.isGesturing=Y.isPressed=be=st=!1,Y._vx.reset(),Y._vy.reset(),F=Ye(),Ft=mt(),se&&se.type&&pe(se),de&&de(Y)),Y},Y.disable=function(){Y.isEnabled&&(Hs.filter(function(se){return se!==Y&&Ua(se.target)}).length||Tn(R?x:o,"scroll",Jc),Y.isPressed&&(Y._vx.reset(),Y._vy.reset(),Tn(K?o:x,vi[1],ge,!0)),Tn(R?x:o,"scroll",I,j),Tn(o,"wheel",he,j),Tn(o,vi[0],pe,j),Tn(x,vi[2],ue),Tn(x,vi[3],ue),Tn(o,"click",fe,!0),Tn(o,"click",ne),Tn(x,"gesturestart",De),Tn(x,"gestureend",Ie),Tn(o,Xr+"enter",_e),Tn(o,Xr+"leave",xe),Tn(o,Xr+"move",ee),Y.isEnabled=Y.isPressed=Y.isDragging=!1,Ve&&Ve(Y))},Y.kill=Y.revert=function(){Y.disable();var se=Hs.indexOf(Y);se>=0&&Hs.splice(se,1),Ji===Y&&(Ji=0)},Hs.push(Y),K&&Ua(o)&&(Ji=Y),Y.enable(_)},q_(r,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),r})();Xt.version="3.15.0";Xt.create=function(r){return new Xt(r)};Xt.register=$p;Xt.getAll=function(){return Hs.slice()};Xt.getById=function(r){return Hs.filter(function(e){return e.vars.id===r})[0]};Xp()&&un.registerPlugin(Xt);var Ae,Bs,tt,_t,Zn,gt,Sf,xl,Ja,Fa,Ea,fo,_n,Nl,eu,Cn,mh,gh,ks,Kp,$l,Zp,Rn,tu,jp,Jp,vr,nu,Mf,Ks,yf,Oa,iu,Kl,ho=1,xn=Date.now,Zl=xn(),mi=0,Ta=0,_h=function(e,t,n){var i=$n(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return n["_"+t+"Clamp"]=i,i?e.substr(6,e.length-7):e},xh=function(e,t){return t&&(!$n(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},Z_=function r(){return Ta&&requestAnimationFrame(r)},vh=function(){return Nl=1},Sh=function(){return Nl=0},Pi=function(e){return e},Aa=function(e){return Math.round(e*1e5)/1e5||0},Qp=function(){return typeof window<"u"},em=function(){return Ae||Qp()&&(Ae=window.gsap)&&Ae.registerPlugin&&Ae},ls=function(e){return!!~Sf.indexOf(e)},tm=function(e){return(e==="Height"?yf:tt["inner"+e])||Zn["client"+e]||gt["client"+e]},nm=function(e){return Pr(e,"getBoundingClientRect")||(ls(e)?function(){return il.width=tt.innerWidth,il.height=yf,il}:function(){return Zi(e)})},j_=function(e,t,n){var i=n.d,s=n.d2,a=n.a;return(a=Pr(e,"getBoundingClientRect"))?function(){return a()[i]}:function(){return(t?tm(s):e["client"+s])||0}},J_=function(e,t){return!t||~Bi.indexOf(e)?nm(e):function(){return il}},Ii=function(e,t){var n=t.s,i=t.d2,s=t.d,a=t.a;return Math.max(0,(n="scroll"+i)&&(a=Pr(e,n))?a()-nm(e)()[s]:ls(e)?(Zn[n]||gt[n])-tm(i):e[n]-e["offset"+i])},po=function(e,t){for(var n=0;n<ks.length;n+=3)(!t||~t.indexOf(ks[n+1]))&&e(ks[n],ks[n+1],ks[n+2])},$n=function(e){return typeof e=="string"},Sn=function(e){return typeof e=="function"},wa=function(e){return typeof e=="number"},Yr=function(e){return typeof e=="object"},pa=function(e,t,n){return e&&e.progress(t?0:1)&&n&&e.pause()},Ms=function(e,t,n){if(e.enabled){var i=e._ctx?e._ctx.add(function(){return t(e,n)}):t(e,n);i&&i.totalTime&&(e.callbackAnimation=i)}},ys=Math.abs,im="left",rm="top",bf="right",Ef="bottom",rs="width",ss="height",Ba="Right",ka="Left",za="Top",Ga="Bottom",Zt="padding",ui="margin",sa="Width",Tf="Height",Qt="px",fi=function(e){return tt.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},Q_=function(e){var t=fi(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},Mh=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Zi=function(e,t){var n=t&&fi(e)[eu]!=="matrix(1, 0, 0, 1, 0, 0)"&&Ae.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},vl=function(e,t){var n=t.d2;return e["offset"+n]||e["client"+n]||0},sm=function(e){var t=[],n=e.labels,i=e.duration(),s;for(s in n)t.push(n[s]/i);return t},e0=function(e){return function(t){return Ae.utils.snap(sm(e),t)}},Af=function(e){var t=Ae.utils.snap(e),n=Array.isArray(e)&&e.slice(0).sort(function(i,s){return i-s});return n?function(i,s,a){a===void 0&&(a=.001);var o;if(!s)return t(i);if(s>0){for(i-=a,o=0;o<n.length;o++)if(n[o]>=i)return n[o];return n[o-1]}else for(o=n.length,i+=a;o--;)if(n[o]<=i)return n[o];return n[0]}:function(i,s,a){a===void 0&&(a=.001);var o=t(i);return!s||Math.abs(o-i)<a||o-i<0==s<0?o:t(s<0?i-e:i+e)}},t0=function(e){return function(t,n){return Af(sm(e))(t,n.direction)}},mo=function(e,t,n,i){return n.split(",").forEach(function(s){return e(t,s,i)})},ln=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:!i,capture:!!s})},on=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},go=function(e,t,n){n=n&&n.wheelHandler,n&&(e(t,"wheel",n),e(t,"touchmove",n))},yh={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},_o={toggleActions:"play",anticipatePin:0},Sl={top:0,left:0,center:.5,bottom:1,right:1},Qo=function(e,t){if($n(e)){var n=e.indexOf("="),i=~n?+(e.charAt(n-1)+1)*parseFloat(e.substr(n+1)):0;~n&&(e.indexOf("%")>n&&(i*=t/100),e=e.substr(0,n-1)),e=i+(e in Sl?Sl[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},xo=function(e,t,n,i,s,a,o,l){var c=s.startColor,u=s.endColor,d=s.fontSize,f=s.indent,h=s.fontWeight,g=_t.createElement("div"),_=ls(n)||Pr(n,"pinType")==="fixed",p=e.indexOf("scroller")!==-1,m=_?gt:n.tagName==="IFRAME"?n.contentDocument.body:n,b=e.indexOf("start")!==-1,w=b?c:u,S="border-color:"+w+";font-size:"+d+";color:"+w+";font-weight:"+h+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return S+="position:"+((p||l)&&_?"fixed;":"absolute;"),(p||l||!_)&&(S+=(i===en?bf:Ef)+":"+(a+parseFloat(f))+"px;"),o&&(S+="box-sizing:border-box;text-align:left;width:"+o.offsetWidth+"px;"),g._isStart=b,g.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),g.style.cssText=S,g.innerText=t||t===0?e+"-"+t:e,m.children[0]?m.insertBefore(g,m.children[0]):m.appendChild(g),g._offset=g["offset"+i.op.d2],el(g,0,i,b),g},el=function(e,t,n,i){var s={display:"block"},a=n[i?"os2":"p2"],o=n[i?"p2":"os2"];e._isFlipped=i,s[n.a+"Percent"]=i?-100:0,s[n.a]=i?"1px":0,s["border"+a+sa]=1,s["border"+o+sa]=0,s[n.p]=t+"px",Ae.set(e,s)},Qe=[],ru={},Qa,bh=function(){return xn()-mi>34&&(Qa||(Qa=requestAnimationFrame(er)))},bs=function(){(!Rn||!Rn.isPressed||Rn.startX>gt.clientWidth)&&(nt.cache++,Rn?Qa||(Qa=requestAnimationFrame(er)):er(),mi||us("scrollStart"),mi=xn())},jl=function(){Jp=tt.innerWidth,jp=tt.innerHeight},Ra=function(e){nt.cache++,(e===!0||!_n&&!Zp&&!_t.fullscreenElement&&!_t.webkitFullscreenElement&&(!tu||Jp!==tt.innerWidth||Math.abs(tt.innerHeight-jp)>tt.innerHeight*.25))&&xl.restart(!0)},cs={},n0=[],am=function r(){return on(rt,"scrollEnd",r)||jr(!0)},us=function(e){return cs[e]&&cs[e].map(function(t){return t()})||n0},qn=[],om=function(e){for(var t=0;t<qn.length;t+=5)(!e||qn[t+4]&&qn[t+4].query===e)&&(qn[t].style.cssText=qn[t+1],qn[t].getBBox&&qn[t].setAttribute("transform",qn[t+2]||""),qn[t+3].uncache=1)},lm=function(){return nt.forEach(function(e){return Sn(e)&&++e.cacheID&&(e.rec=e())})},wf=function(e,t){var n;for(Cn=0;Cn<Qe.length;Cn++)n=Qe[Cn],n&&(!t||n._ctx===t)&&(e?n.kill(1):n.revert(!0,!0));Oa=!0,t&&om(t),t||us("revert")},cm=function(e,t){nt.cache++,(t||!Pn)&&nt.forEach(function(n){return Sn(n)&&n.cacheID++&&(n.rec=0)}),$n(e)&&(tt.history.scrollRestoration=Mf=e)},Pn,as=0,Eh,i0=function(){if(Eh!==as){var e=Eh=as;requestAnimationFrame(function(){return e===as&&jr(!0)})}},um=function(){gt.appendChild(Ks),yf=!Rn&&Ks.offsetHeight||tt.innerHeight,gt.removeChild(Ks)},Th=function(e){return Ja(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},jr=function(e,t){if(Zn=_t.documentElement,gt=_t.body,Sf=[tt,_t,Zn,gt],mi&&!e&&!Oa){ln(rt,"scrollEnd",am);return}um(),Pn=rt.isRefreshing=!0,Oa||lm();var n=us("refreshInit");Kp&&rt.sort(),t||wf(),nt.forEach(function(i){Sn(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),Qe.slice(0).forEach(function(i){return i.refresh()}),Oa=!1,Qe.forEach(function(i){if(i._subPinOffset&&i.pin){var s=i.vars.horizontal?"offsetWidth":"offsetHeight",a=i.pin[s];i.revert(!0,1),i.adjustPinSpacing(i.pin[s]-a),i.refresh()}}),iu=1,Th(!0),Qe.forEach(function(i){var s=Ii(i.scroller,i._dir),a=i.vars.end==="max"||i._endClamp&&i.end>s,o=i._startClamp&&i.start>=s;(a||o)&&i.setPositions(o?s-1:i.start,a?Math.max(o?s:i.start+1,s):i.end,!0)}),Th(!1),iu=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),nt.forEach(function(i){Sn(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),cm(Mf,1),xl.pause(),as++,Pn=2,er(2),Qe.forEach(function(i){return Sn(i.vars.onRefresh)&&i.vars.onRefresh(i)}),Pn=rt.isRefreshing=!1,us("refresh")},su=0,tl=1,Ha,er=function(e){if(e===2||!Pn&&!Oa){rt.isUpdating=!0,Ha&&Ha.update(0);var t=Qe.length,n=xn(),i=n-Zl>=50,s=t&&Qe[0].scroll();if(tl=su>s?-1:1,Pn||(su=s),i&&(mi&&!Nl&&n-mi>200&&(mi=0,us("scrollEnd")),Ea=Zl,Zl=n),tl<0){for(Cn=t;Cn-- >0;)Qe[Cn]&&Qe[Cn].update(0,i);tl=1}else for(Cn=0;Cn<t;Cn++)Qe[Cn]&&Qe[Cn].update(0,i);rt.isUpdating=!1}Qa=0},au=[im,rm,Ef,bf,ui+Ga,ui+Ba,ui+za,ui+ka,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],nl=au.concat([rs,ss,"boxSizing","max"+sa,"max"+Tf,"position",ui,Zt,Zt+za,Zt+Ba,Zt+Ga,Zt+ka]),r0=function(e,t,n){Zs(n);var i=e._gsap;if(i.spacerIsNative)Zs(i.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},Jl=function(e,t,n,i){if(!e._gsap.swappedIn){for(var s=au.length,a=t.style,o=e.style,l;s--;)l=au[s],a[l]=n[l];a.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(a.display="inline-block"),o[Ef]=o[bf]="auto",a.flexBasis=n.flexBasis||"auto",a.overflow="visible",a.boxSizing="border-box",a[rs]=vl(e,Dn)+Qt,a[ss]=vl(e,en)+Qt,a[Zt]=o[ui]=o[rm]=o[im]="0",Zs(i),o[rs]=o["max"+sa]=n[rs],o[ss]=o["max"+Tf]=n[ss],o[Zt]=n[Zt],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},s0=/([A-Z])/g,Zs=function(e){if(e){var t=e.t.style,n=e.length,i=0,s,a;for((e.t._gsap||Ae.core.getCache(e.t)).uncache=1;i<n;i+=2)a=e[i+1],s=e[i],a?t[s]=a:t[s]&&t.removeProperty(s.replace(s0,"-$1").toLowerCase())}},vo=function(e){for(var t=nl.length,n=e.style,i=[],s=0;s<t;s++)i.push(nl[s],n[nl[s]]);return i.t=e,i},a0=function(e,t,n){for(var i=[],s=e.length,a=n?8:0,o;a<s;a+=2)o=e[a],i.push(o,o in t?t[o]:e[a+1]);return i.t=e.t,i},il={left:0,top:0},Ah=function(e,t,n,i,s,a,o,l,c,u,d,f,h,g){Sn(e)&&(e=e(l)),$n(e)&&e.substr(0,3)==="max"&&(e=f+(e.charAt(4)==="="?Qo("0"+e.substr(3),n):0));var _=h?h.time():0,p,m,b;if(h&&h.seek(0),isNaN(e)||(e=+e),wa(e))h&&(e=Ae.utils.mapRange(h.scrollTrigger.start,h.scrollTrigger.end,0,f,e)),o&&el(o,n,i,!0);else{Sn(t)&&(t=t(l));var w=(e||"0").split(" "),S,E,T,A;b=In(t,l)||gt,S=Zi(b)||{},(!S||!S.left&&!S.top)&&fi(b).display==="none"&&(A=b.style.display,b.style.display="block",S=Zi(b),A?b.style.display=A:b.style.removeProperty("display")),E=Qo(w[0],S[i.d]),T=Qo(w[1]||"0",n),e=S[i.p]-c[i.p]-u+E+s-T,o&&el(o,T,i,n-T<20||o._isStart&&T>20),n-=n-T}if(g&&(l[g]=e||-.001,e<0&&(e=0)),a){var v=e+n,y=a._isStart;p="scroll"+i.d2,el(a,v,i,y&&v>20||!y&&(d?Math.max(gt[p],Zn[p]):a.parentNode[p])<=v+1),d&&(c=Zi(o),d&&(a.style[i.op.p]=c[i.op.p]-i.op.m-a._offset+Qt))}return h&&b&&(p=Zi(b),h.seek(f),m=Zi(b),h._caScrollDist=p[i.p]-m[i.p],e=e/h._caScrollDist*f),h&&h.seek(_),h?e:Math.round(e)},o0=/(webkit|moz|length|cssText|inset)/i,wh=function(e,t,n,i){if(e.parentNode!==t){var s=e.style,a,o;if(t===gt){e._stOrig=s.cssText,o=fi(e);for(a in o)!+a&&!o0.test(a)&&o[a]&&typeof s[a]=="string"&&a!=="0"&&(s[a]=o[a]);s.top=n,s.left=i}else s.cssText=e._stOrig;Ae.core.getCache(e).uncache=1,t.appendChild(e)}},fm=function(e,t,n){var i=t,s=i;return function(a){var o=Math.round(e());return o!==i&&o!==s&&Math.abs(o-i)>3&&Math.abs(o-s)>3&&(a=o,n&&n()),s=i,i=Math.round(a),i}},So=function(e,t,n){var i={};i[t.p]="+="+n,Ae.set(e,i)},Rh=function(e,t){var n=Ur(e,t),i="_scroll"+t.p2,s=function a(o,l,c,u,d){var f=a.tween,h=l.onComplete,g={};c=c||n();var _=fm(n,c,function(){f.kill(),a.tween=0});return d=u&&d||0,u=u||o-c,f&&f.kill(),l[i]=o,l.inherit=!1,l.modifiers=g,g[i]=function(){return _(c+u*f.ratio+d*f.ratio*f.ratio)},l.onUpdate=function(){nt.cache++,a.tween&&er()},l.onComplete=function(){a.tween=0,h&&h.call(f)},f=a.tween=Ae.to(e,l),f};return e[i]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},ln(e,"wheel",n.wheelHandler),rt.isTouch&&ln(e,"touchmove",n.wheelHandler),s},rt=(function(){function r(t,n){Bs||r.register(Ae)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),nu(this),this.init(t,n)}var e=r.prototype;return e.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ta){this.update=this.refresh=this.kill=Pi;return}n=Mh($n(n)||wa(n)||n.nodeType?{trigger:n}:n,_o);var s=n,a=s.onUpdate,o=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,d=s.scrub,f=s.trigger,h=s.pin,g=s.pinSpacing,_=s.invalidateOnRefresh,p=s.anticipatePin,m=s.onScrubComplete,b=s.onSnapComplete,w=s.once,S=s.snap,E=s.pinReparent,T=s.pinSpacer,A=s.containerAnimation,v=s.fastScrollEnd,y=s.preventOverlaps,C=n.horizontal||n.containerAnimation&&n.horizontal!==!1?Dn:en,L=!d&&d!==0,P=In(n.scroller||tt),O=Ae.core.getCache(P),G=ls(P),U=("pinType"in n?n.pinType:Pr(P,"pinType")||G&&"fixed")==="fixed",H=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],B=L&&n.toggleActions.split(" "),K="markers"in n?n.markers:_o.markers,te=G?0:parseFloat(fi(P)["border"+C.p2+sa])||0,N=this,ae=n.onRefreshInit&&function(){return n.onRefreshInit(N)},de=j_(P,G,C),Ve=J_(P,G),Xe=0,Be=0,j=0,le=Ur(P,C),re,Re,Oe,Te,st,be,ke,We,Ge,Y,ut,vt,At,Ye,mt,F,Ft,ze,R,x,z,W,Z,fe,ce,J,Q,me,we,ge,pe,ue,De,Ie,I,he,ee,_e,xe;if(N._startClamp=N._endClamp=!1,N._dir=C,p*=45,N.scroller=P,N.scroll=A?A.time.bind(A):le,Te=le(),N.vars=n,i=i||n.animation,"refreshPriority"in n&&(Kp=1,n.refreshPriority===-9999&&(Ha=N)),O.tweenScroll=O.tweenScroll||{top:Rh(P,en),left:Rh(P,Dn)},N.tweenTo=re=O.tweenScroll[C.p],N.scrubDuration=function(oe){De=wa(oe)&&oe,De?ue?ue.duration(oe):ue=Ae.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:De,paused:!0,onComplete:function(){return m&&m(N)}}):(ue&&ue.progress(1).kill(),ue=0)},i&&(i.vars.lazy=!1,i._initted&&!N.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),N.animation=i.pause(),i.scrollTrigger=N,N.scrubDuration(d),ge=0,l||(l=i.vars.id)),S&&((!Yr(S)||S.push)&&(S={snapTo:S}),"scrollBehavior"in gt.style&&Ae.set(G?[gt,Zn]:P,{scrollBehavior:"auto"}),nt.forEach(function(oe){return Sn(oe)&&oe.target===(G?_t.scrollingElement||Zn:P)&&(oe.smooth=!1)}),Oe=Sn(S.snapTo)?S.snapTo:S.snapTo==="labels"?e0(i):S.snapTo==="labelsDirectional"?t0(i):S.directional!==!1?function(oe,Fe){return Af(S.snapTo)(oe,xn()-Be<500?0:Fe.direction)}:Ae.utils.snap(S.snapTo),Ie=S.duration||{min:.1,max:2},Ie=Yr(Ie)?Fa(Ie.min,Ie.max):Fa(Ie,Ie),I=Ae.delayedCall(S.delay||De/2||.1,function(){var oe=le(),Fe=xn()-Be<500,Ce=re.tween;if((Fe||Math.abs(N.getVelocity())<10)&&!Ce&&!Nl&&Xe!==oe){var qe=(oe-be)/Ye,qt=i&&!L?i.totalProgress():qe,et=Fe?0:(qt-pe)/(xn()-Ea)*1e3||0,Ct=Ae.utils.clamp(-qe,1-qe,ys(et/2)*et/.185),rn=qe+(S.inertia===!1?0:Ct),Pt,Mt,at=S,bn=at.onStart,wt=at.onInterrupt,dn=at.onComplete;if(Pt=Oe(rn,N),wa(Pt)||(Pt=rn),Mt=Math.max(0,Math.round(be+Pt*Ye)),oe<=ke&&oe>=be&&Mt!==oe){if(Ce&&!Ce._initted&&Ce.data<=ys(Mt-oe))return;S.inertia===!1&&(Ct=Pt-qe),re(Mt,{duration:Ie(ys(Math.max(ys(rn-qt),ys(Pt-qt))*.185/et/.05||0)),ease:S.ease||"power3",data:ys(Mt-oe),onInterrupt:function(){return I.restart(!0)&&wt&&Ms(N,wt)},onComplete:function(){N.update(),Xe=le(),i&&!L&&(ue?ue.resetTo("totalProgress",Pt,i._tTime/i._tDur):i.progress(Pt)),ge=pe=i&&!L?i.totalProgress():N.progress,b&&b(N),dn&&Ms(N,dn)}},oe,Ct*Ye,Mt-oe-Ct*Ye),bn&&Ms(N,bn,re.tween)}}else N.isActive&&Xe!==oe&&I.restart(!0)}).pause()),l&&(ru[l]=N),f=N.trigger=In(f||h!==!0&&h),xe=f&&f._gsap&&f._gsap.stRevert,xe&&(xe=xe(N)),h=h===!0?f:In(h),$n(o)&&(o={targets:f,className:o}),h&&(g===!1||g===ui||(g=!g&&h.parentNode&&h.parentNode.style&&fi(h.parentNode).display==="flex"?!1:Zt),N.pin=h,Re=Ae.core.getCache(h),Re.spacer?mt=Re.pinState:(T&&(T=In(T),T&&!T.nodeType&&(T=T.current||T.nativeElement),Re.spacerIsNative=!!T,T&&(Re.spacerState=vo(T))),Re.spacer=ze=T||_t.createElement("div"),ze.classList.add("pin-spacer"),l&&ze.classList.add("pin-spacer-"+l),Re.pinState=mt=vo(h)),n.force3D!==!1&&Ae.set(h,{force3D:!0}),N.spacer=ze=Re.spacer,we=fi(h),fe=we[g+C.os2],x=Ae.getProperty(h),z=Ae.quickSetter(h,C.a,Qt),Jl(h,ze,we),Ft=vo(h)),K){vt=Yr(K)?Mh(K,yh):yh,Y=xo("scroller-start",l,P,C,vt,0),ut=xo("scroller-end",l,P,C,vt,0,Y),R=Y["offset"+C.op.d2];var ne=In(Pr(P,"content")||P);We=this.markerStart=xo("start",l,ne,C,vt,R,0,A),Ge=this.markerEnd=xo("end",l,ne,C,vt,R,0,A),A&&(_e=Ae.quickSetter([We,Ge],C.a,Qt)),!U&&!(Bi.length&&Pr(P,"fixedMarkers")===!0)&&(Q_(G?gt:P),Ae.set([Y,ut],{force3D:!0}),J=Ae.quickSetter(Y,C.a,Qt),me=Ae.quickSetter(ut,C.a,Qt))}if(A){var se=A.vars.onUpdate,ie=A.vars.onUpdateParams;A.eventCallback("onUpdate",function(){N.update(0,0,1),se&&se.apply(A,ie||[])})}if(N.previous=function(){return Qe[Qe.indexOf(N)-1]},N.next=function(){return Qe[Qe.indexOf(N)+1]},N.revert=function(oe,Fe){if(!Fe)return N.kill(!0);var Ce=oe!==!1||!N.enabled,qe=_n;Ce!==N.isReverted&&(Ce&&(he=Math.max(le(),N.scroll.rec||0),j=N.progress,ee=i&&i.progress()),We&&[We,Ge,Y,ut].forEach(function(qt){return qt.style.display=Ce?"none":"block"}),Ce&&(_n=N,N.update(Ce)),h&&(!E||!N.isActive)&&(Ce?r0(h,ze,mt):Jl(h,ze,fi(h),ce)),Ce||N.update(Ce),_n=qe,N.isReverted=Ce)},N.refresh=function(oe,Fe,Ce,qe){if(!((_n||!N.enabled)&&!Fe)){if(h&&oe&&mi){ln(r,"scrollEnd",am);return}!Pn&&ae&&ae(N),_n=N,re.tween&&!Ce&&(re.tween.kill(),re.tween=0),ue&&ue.pause(),_&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(Se){return Se.vars.immediateRender&&Se.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),N.isReverted||N.revert(!0,!0),N._subPinOffset=!1;var qt=de(),et=Ve(),Ct=A?A.duration():Ii(P,C),rn=Ye<=.01||!Ye,Pt=0,Mt=qe||0,at=Yr(Ce)?Ce.end:n.end,bn=n.endTrigger||f,wt=Yr(Ce)?Ce.start:n.start||(n.start===0||!f?0:h?"0 0":"0 100%"),dn=N.pinnedContainer=n.pinnedContainer&&In(n.pinnedContainer,N),En=f&&Math.max(0,Qe.indexOf(N))||0,$t=En,Ot,Jt,Ti,_s,sn,Gt,si,M,k,$,V,X,ve;for(K&&Yr(Ce)&&(X=Ae.getProperty(Y,C.p),ve=Ae.getProperty(ut,C.p));$t-- >0;)Gt=Qe[$t],Gt.end||Gt.refresh(0,1)||(_n=N),si=Gt.pin,si&&(si===f||si===h||si===dn)&&!Gt.isReverted&&($||($=[]),$.unshift(Gt),Gt.revert(!0,!0)),Gt!==Qe[$t]&&(En--,$t--);for(Sn(wt)&&(wt=wt(N)),wt=_h(wt,"start",N),be=Ah(wt,f,qt,C,le(),We,Y,N,et,te,U,Ct,A,N._startClamp&&"_startClamp")||(h?-.001:0),Sn(at)&&(at=at(N)),$n(at)&&!at.indexOf("+=")&&(~at.indexOf(" ")?at=($n(wt)?wt.split(" ")[0]:"")+at:(Pt=Qo(at.substr(2),qt),at=$n(wt)?wt:(A?Ae.utils.mapRange(0,A.duration(),A.scrollTrigger.start,A.scrollTrigger.end,be):be)+Pt,bn=f)),at=_h(at,"end",N),ke=Math.max(be,Ah(at||(bn?"100% 0":Ct),bn,qt,C,le()+Pt,Ge,ut,N,et,te,U,Ct,A,N._endClamp&&"_endClamp"))||-.001,Pt=0,$t=En;$t--;)Gt=Qe[$t]||{},si=Gt.pin,si&&Gt.start-Gt._pinPush<=be&&!A&&Gt.end>0&&(Ot=Gt.end-(N._startClamp?Math.max(0,Gt.start):Gt.start),(si===f&&Gt.start-Gt._pinPush<be||si===dn)&&isNaN(wt)&&(Pt+=Ot*(1-Gt.progress)),si===h&&(Mt+=Ot));if(be+=Pt,ke+=Pt,N._startClamp&&(N._startClamp+=Pt),N._endClamp&&!Pn&&(N._endClamp=ke||-.001,ke=Math.min(ke,Ii(P,C))),Ye=ke-be||(be-=.01)&&.001,rn&&(j=Ae.utils.clamp(0,1,Ae.utils.normalize(be,ke,he))),N._pinPush=Mt,We&&Pt&&(Ot={},Ot[C.a]="+="+Pt,dn&&(Ot[C.p]="-="+le()),Ae.set([We,Ge],Ot)),h&&!(iu&&N.end>=Ii(P,C)))Ot=fi(h),_s=C===en,Ti=le(),W=parseFloat(x(C.a))+Mt,!Ct&&ke>1&&(V=(G?_t.scrollingElement||Zn:P).style,V={style:V,value:V["overflow"+C.a.toUpperCase()]},G&&fi(gt)["overflow"+C.a.toUpperCase()]!=="scroll"&&(V.style["overflow"+C.a.toUpperCase()]="scroll")),Jl(h,ze,Ot),Ft=vo(h),Jt=Zi(h,!0),M=U&&Ur(P,_s?Dn:en)(),g?(ce=[g+C.os2,Ye+Mt+Qt],ce.t=ze,$t=g===Zt?vl(h,C)+Ye+Mt:0,$t&&(ce.push(C.d,$t+Qt),ze.style.flexBasis!=="auto"&&(ze.style.flexBasis=$t+Qt)),Zs(ce),dn&&Qe.forEach(function(Se){Se.pin===dn&&Se.vars.pinSpacing!==!1&&(Se._subPinOffset=!0)}),U&&le(he)):($t=vl(h,C),$t&&ze.style.flexBasis!=="auto"&&(ze.style.flexBasis=$t+Qt)),U&&(sn={top:Jt.top+(_s?Ti-be:M)+Qt,left:Jt.left+(_s?M:Ti-be)+Qt,boxSizing:"border-box",position:"fixed"},sn[rs]=sn["max"+sa]=Math.ceil(Jt.width)+Qt,sn[ss]=sn["max"+Tf]=Math.ceil(Jt.height)+Qt,sn[ui]=sn[ui+za]=sn[ui+Ba]=sn[ui+Ga]=sn[ui+ka]="0",sn[Zt]=Ot[Zt],sn[Zt+za]=Ot[Zt+za],sn[Zt+Ba]=Ot[Zt+Ba],sn[Zt+Ga]=Ot[Zt+Ga],sn[Zt+ka]=Ot[Zt+ka],F=a0(mt,sn,E),Pn&&le(0)),i?(k=i._initted,$l(1),i.render(i.duration(),!0,!0),Z=x(C.a)-W+Ye+Mt,Q=Math.abs(Ye-Z)>1,U&&Q&&F.splice(F.length-2,2),i.render(0,!0,!0),k||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),$l(0)):Z=Ye,V&&(V.value?V.style["overflow"+C.a.toUpperCase()]=V.value:V.style.removeProperty("overflow-"+C.a));else if(f&&le()&&!A)for(Jt=f.parentNode;Jt&&Jt!==gt;)Jt._pinOffset&&(be-=Jt._pinOffset,ke-=Jt._pinOffset),Jt=Jt.parentNode;$&&$.forEach(function(Se){return Se.revert(!1,!0)}),N.start=be,N.end=ke,Te=st=Pn?he:le(),!A&&!Pn&&(Te<he&&le(he),N.scroll.rec=0),N.revert(!1,!0),Be=xn(),I&&(Xe=-1,I.restart(!0)),_n=0,i&&L&&(i._initted||ee)&&i.progress()!==ee&&i.progress(ee||0,!0).render(i.time(),!0,!0),(rn||j!==N.progress||A||_||i&&!i._initted)&&(i&&!L&&(i._initted||j||i.vars.immediateRender!==!1)&&i.totalProgress(A&&be<-.001&&!j?Ae.utils.normalize(be,ke,0):j,!0),N.progress=rn||(Te-be)/Ye===j?0:j),h&&g&&(ze._pinOffset=Math.round(N.progress*Z)),ue&&ue.invalidate(),isNaN(X)||(X-=Ae.getProperty(Y,C.p),ve-=Ae.getProperty(ut,C.p),So(Y,C,X),So(We,C,X-(qe||0)),So(ut,C,ve),So(Ge,C,ve-(qe||0))),rn&&!Pn&&N.update(),u&&!Pn&&!At&&(At=!0,u(N),At=!1)}},N.getVelocity=function(){return(le()-st)/(xn()-Ea)*1e3||0},N.endAnimation=function(){pa(N.callbackAnimation),i&&(ue?ue.progress(1):i.paused()?L||pa(i,N.direction<0,1):pa(i,i.reversed()))},N.labelToScroll=function(oe){return i&&i.labels&&(be||N.refresh()||be)+i.labels[oe]/i.duration()*Ye||0},N.getTrailing=function(oe){var Fe=Qe.indexOf(N),Ce=N.direction>0?Qe.slice(0,Fe).reverse():Qe.slice(Fe+1);return($n(oe)?Ce.filter(function(qe){return qe.vars.preventOverlaps===oe}):Ce).filter(function(qe){return N.direction>0?qe.end<=be:qe.start>=ke})},N.update=function(oe,Fe,Ce){if(!(A&&!Ce&&!oe)){var qe=Pn===!0?he:N.scroll(),qt=oe?0:(qe-be)/Ye,et=qt<0?0:qt>1?1:qt||0,Ct=N.progress,rn,Pt,Mt,at,bn,wt,dn,En;if(Fe&&(st=Te,Te=A?le():qe,S&&(pe=ge,ge=i&&!L?i.totalProgress():et)),p&&h&&!_n&&!ho&&mi&&(!et&&be<qe+(qe-st)/(xn()-Ea)*p?et=1e-4:et===1&&ke>qe+(qe-st)/(xn()-Ea)*p&&(et=.9999)),et!==Ct&&N.enabled){if(rn=N.isActive=!!et&&et<1,Pt=!!Ct&&Ct<1,wt=rn!==Pt,bn=wt||!!et!=!!Ct,N.direction=et>Ct?1:-1,N.progress=et,bn&&!_n&&(Mt=et&&!Ct?0:et===1?1:Ct===1?2:3,L&&(at=!wt&&B[Mt+1]!=="none"&&B[Mt+1]||B[Mt],En=i&&(at==="complete"||at==="reset"||at in i))),y&&(wt||En)&&(En||d||!i)&&(Sn(y)?y(N):N.getTrailing(y).forEach(function(Ti){return Ti.endAnimation()})),L||(ue&&!_n&&!ho?(ue._dp._time-ue._start!==ue._time&&ue.render(ue._dp._time-ue._start),ue.resetTo?ue.resetTo("totalProgress",et,i._tTime/i._tDur):(ue.vars.totalProgress=et,ue.invalidate().restart())):i&&i.totalProgress(et,!!(_n&&(Be||oe)))),h){if(oe&&g&&(ze.style[g+C.os2]=fe),!U)z(Aa(W+Z*et));else if(bn){if(dn=!oe&&et>Ct&&ke+1>qe&&qe+1>=Ii(P,C),E)if(!oe&&(rn||dn)){var $t=Zi(h,!0),Ot=qe-be;wh(h,gt,$t.top+(C===en?Ot:0)+Qt,$t.left+(C===en?0:Ot)+Qt)}else wh(h,ze);Zs(rn||dn?F:Ft),Q&&et<1&&rn||z(W+(et===1&&!dn?Z:0))}}S&&!re.tween&&!_n&&!ho&&I.restart(!0),o&&(wt||w&&et&&(et<1||!Kl))&&Ja(o.targets).forEach(function(Ti){return Ti.classList[rn||w?"add":"remove"](o.className)}),a&&!L&&!oe&&a(N),bn&&!_n?(L&&(En&&(at==="complete"?i.pause().totalProgress(1):at==="reset"?i.restart(!0).pause():at==="restart"?i.restart(!0):i[at]()),a&&a(N)),(wt||!Kl)&&(c&&wt&&Ms(N,c),H[Mt]&&Ms(N,H[Mt]),w&&(et===1?N.kill(!1,1):H[Mt]=0),wt||(Mt=et===1?1:3,H[Mt]&&Ms(N,H[Mt]))),v&&!rn&&Math.abs(N.getVelocity())>(wa(v)?v:2500)&&(pa(N.callbackAnimation),ue?ue.progress(1):pa(i,at==="reverse"?1:!et,1))):L&&a&&!_n&&a(N)}if(me){var Jt=A?qe/A.duration()*(A._caScrollDist||0):qe;J(Jt+(Y._isFlipped?1:0)),me(Jt)}_e&&_e(-qe/A.duration()*(A._caScrollDist||0))}},N.enable=function(oe,Fe){N.enabled||(N.enabled=!0,ln(P,"resize",Ra),G||ln(P,"scroll",bs),ae&&ln(r,"refreshInit",ae),oe!==!1&&(N.progress=j=0,Te=st=Xe=le()),Fe!==!1&&N.refresh())},N.getTween=function(oe){return oe&&re?re.tween:ue},N.setPositions=function(oe,Fe,Ce,qe){if(A){var qt=A.scrollTrigger,et=A.duration(),Ct=qt.end-qt.start;oe=qt.start+Ct*oe/et,Fe=qt.start+Ct*Fe/et}N.refresh(!1,!1,{start:xh(oe,Ce&&!!N._startClamp),end:xh(Fe,Ce&&!!N._endClamp)},qe),N.update()},N.adjustPinSpacing=function(oe){if(ce&&oe){var Fe=ce.indexOf(C.d)+1;ce[Fe]=parseFloat(ce[Fe])+oe+Qt,ce[1]=parseFloat(ce[1])+oe+Qt,Zs(ce)}},N.disable=function(oe,Fe){if(oe!==!1&&N.revert(!0,!0),N.enabled&&(N.enabled=N.isActive=!1,Fe||ue&&ue.pause(),he=0,Re&&(Re.uncache=1),ae&&on(r,"refreshInit",ae),I&&(I.pause(),re.tween&&re.tween.kill()&&(re.tween=0)),!G)){for(var Ce=Qe.length;Ce--;)if(Qe[Ce].scroller===P&&Qe[Ce]!==N)return;on(P,"resize",Ra),G||on(P,"scroll",bs)}},N.kill=function(oe,Fe){N.disable(oe,Fe),ue&&!Fe&&ue.kill(),l&&delete ru[l];var Ce=Qe.indexOf(N);Ce>=0&&Qe.splice(Ce,1),Ce===Cn&&tl>0&&Cn--,Ce=0,Qe.forEach(function(qe){return qe.scroller===N.scroller&&(Ce=1)}),Ce||Pn||(N.scroll.rec=0),i&&(i.scrollTrigger=null,oe&&i.revert({kill:!1}),Fe||i.kill()),We&&[We,Ge,Y,ut].forEach(function(qe){return qe.parentNode&&qe.parentNode.removeChild(qe)}),Ha===N&&(Ha=0),h&&(Re&&(Re.uncache=1),Ce=0,Qe.forEach(function(qe){return qe.pin===h&&Ce++}),Ce||(Re.spacer=0)),n.onKill&&n.onKill(N)},Qe.push(N),N.enable(!1,!1),xe&&xe(N),i&&i.add&&!Ye){var Ue=N.update;N.update=function(){N.update=Ue,nt.cache++,be||ke||N.refresh()},Ae.delayedCall(.01,N.update),Ye=.01,be=ke=0}else N.refresh();h&&i0()},r.register=function(n){return Bs||(Ae=n||em(),Qp()&&window.document&&r.enable(),Bs=Ta),Bs},r.defaults=function(n){if(n)for(var i in n)_o[i]=n[i];return _o},r.disable=function(n,i){Ta=0,Qe.forEach(function(a){return a[i?"kill":"disable"](n)}),on(tt,"wheel",bs),on(_t,"scroll",bs),clearInterval(fo),on(_t,"touchcancel",Pi),on(gt,"touchstart",Pi),mo(on,_t,"pointerdown,touchstart,mousedown",vh),mo(on,_t,"pointerup,touchend,mouseup",Sh),xl.kill(),po(on);for(var s=0;s<nt.length;s+=3)go(on,nt[s],nt[s+1]),go(on,nt[s],nt[s+2])},r.enable=function(){if(tt=window,_t=document,Zn=_t.documentElement,gt=_t.body,Ae){if(Ja=Ae.utils.toArray,Fa=Ae.utils.clamp,nu=Ae.core.context||Pi,$l=Ae.core.suppressOverwrites||Pi,Mf=tt.history.scrollRestoration||"auto",su=tt.pageYOffset||0,Ae.core.globals("ScrollTrigger",r),gt){Ta=1,Ks=document.createElement("div"),Ks.style.height="100vh",Ks.style.position="absolute",um(),Z_(),Xt.register(Ae),r.isTouch=Xt.isTouch,vr=Xt.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),tu=Xt.isTouch===1,ln(tt,"wheel",bs),Sf=[tt,_t,Zn,gt],Ae.matchMedia?(r.matchMedia=function(u){var d=Ae.matchMedia(),f;for(f in u)d.add(f,u[f]);return d},Ae.addEventListener("matchMediaInit",function(){lm(),wf()}),Ae.addEventListener("matchMediaRevert",function(){return om()}),Ae.addEventListener("matchMedia",function(){jr(0,1),us("matchMedia")}),Ae.matchMedia().add("(orientation: portrait)",function(){return jl(),jl})):console.warn("Requires GSAP 3.11.0 or later"),jl(),ln(_t,"scroll",bs);var n=gt.hasAttribute("style"),i=gt.style,s=i.borderTopStyle,a=Ae.core.Animation.prototype,o,l;for(a.revert||Object.defineProperty(a,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",o=Zi(gt),en.m=Math.round(o.top+en.sc())||0,Dn.m=Math.round(o.left+Dn.sc())||0,s?i.borderTopStyle=s:i.removeProperty("border-top-style"),n||(gt.setAttribute("style",""),gt.removeAttribute("style")),fo=setInterval(bh,250),Ae.delayedCall(.5,function(){return ho=0}),ln(_t,"touchcancel",Pi),ln(gt,"touchstart",Pi),mo(ln,_t,"pointerdown,touchstart,mousedown",vh),mo(ln,_t,"pointerup,touchend,mouseup",Sh),eu=Ae.utils.checkPrefix("transform"),nl.push(eu),Bs=xn(),xl=Ae.delayedCall(.2,jr).pause(),ks=[_t,"visibilitychange",function(){var u=tt.innerWidth,d=tt.innerHeight;_t.hidden?(mh=u,gh=d):(mh!==u||gh!==d)&&Ra()},_t,"DOMContentLoaded",jr,tt,"load",jr,tt,"resize",Ra],po(ln),Qe.forEach(function(u){return u.enable(0,1)}),l=0;l<nt.length;l+=3)go(on,nt[l],nt[l+1]),go(on,nt[l],nt[l+2])}else if(_t){var c=function u(){r.enable(),_t.removeEventListener("DOMContentLoaded",u)};_t.addEventListener("DOMContentLoaded",c)}}},r.config=function(n){"limitCallbacks"in n&&(Kl=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(fo)||(fo=i)&&setInterval(bh,i),"ignoreMobileResize"in n&&(tu=r.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(po(on)||po(ln,n.autoRefreshEvents||"none"),Zp=(n.autoRefreshEvents+"").indexOf("resize")===-1)},r.scrollerProxy=function(n,i){var s=In(n),a=nt.indexOf(s),o=ls(s);~a&&nt.splice(a,o?6:2),i&&(o?Bi.unshift(tt,i,gt,i,Zn,i):Bi.unshift(s,i))},r.clearMatchMedia=function(n){Qe.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},r.isInViewport=function(n,i,s){var a=($n(n)?In(n):n).getBoundingClientRect(),o=a[s?rs:ss]*i||0;return s?a.right-o>0&&a.left+o<tt.innerWidth:a.bottom-o>0&&a.top+o<tt.innerHeight},r.positionInViewport=function(n,i,s){$n(n)&&(n=In(n));var a=n.getBoundingClientRect(),o=a[s?rs:ss],l=i==null?o/2:i in Sl?Sl[i]*o:~i.indexOf("%")?parseFloat(i)*o/100:parseFloat(i)||0;return s?(a.left+l)/tt.innerWidth:(a.top+l)/tt.innerHeight},r.killAll=function(n){if(Qe.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var i=cs.killAll||[];cs={},i.forEach(function(s){return s()})}},r})();rt.version="3.15.0";rt.saveStyles=function(r){return r?Ja(r).forEach(function(e){if(e&&e.style){var t=qn.indexOf(e);t>=0&&qn.splice(t,5),qn.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),Ae.core.getCache(e),nu())}}):qn};rt.revert=function(r,e){return wf(!r,e)};rt.create=function(r,e){return new rt(r,e)};rt.refresh=function(r){return r?Ra(!0):(Bs||rt.register())&&jr(!0)};rt.update=function(r){return++nt.cache&&er(r===!0?2:0)};rt.clearScrollMemory=cm;rt.maxScroll=function(r,e){return Ii(r,e?Dn:en)};rt.getScrollFunc=function(r,e){return Ur(In(r),e?Dn:en)};rt.getById=function(r){return ru[r]};rt.getAll=function(){return Qe.filter(function(r){return r.vars.id!=="ScrollSmoother"})};rt.isScrolling=function(){return!!mi};rt.snapDirectional=Af;rt.addEventListener=function(r,e){var t=cs[r]||(cs[r]=[]);~t.indexOf(e)||t.push(e)};rt.removeEventListener=function(r,e){var t=cs[r],n=t&&t.indexOf(e);n>=0&&t.splice(n,1)};rt.batch=function(r,e){var t=[],n={},i=e.interval||.016,s=e.batchMax||1e9,a=function(c,u){var d=[],f=[],h=Ae.delayedCall(i,function(){u(d,f),d=[],f=[]}).pause();return function(g){d.length||h.restart(!0),d.push(g.trigger),f.push(g),s<=d.length&&h.progress(1)}},o;for(o in e)n[o]=o.substr(0,2)==="on"&&Sn(e[o])&&o!=="onRefreshInit"?a(o,e[o]):e[o];return Sn(s)&&(s=s(),ln(rt,"refresh",function(){return s=e.batchMax()})),Ja(r).forEach(function(l){var c={};for(o in n)c[o]=n[o];c.trigger=l,t.push(rt.create(c))}),t};var Ch=function(e,t,n,i){return t>i?e(i):t<0&&e(0),n>i?(i-t)/(n-t):n<0?t/(t-n):1},Ql=function r(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(Xt.isTouch?" pinch-zoom":""):"none",e===Zn&&r(gt,t)},Mo={auto:1,scroll:1},l0=function(e){var t=e.event,n=e.target,i=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,a=s._gsap||Ae.core.getCache(s),o=xn(),l;if(!a._isScrollT||o-a._isScrollT>2e3){for(;s&&s!==gt&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(Mo[(l=fi(s)).overflowY]||Mo[l.overflowX]));)s=s.parentNode;a._isScroll=s&&s!==n&&!ls(s)&&(Mo[(l=fi(s)).overflowY]||Mo[l.overflowX]),a._isScrollT=o}(a._isScroll||i==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},hm=function(e,t,n,i){return Xt.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:i=i&&l0,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&ln(_t,Xt.eventTypes[0],Dh,!1,!0)},onDisable:function(){return on(_t,Xt.eventTypes[0],Dh,!0)}})},c0=/(input|label|select|textarea)/i,Ph,Dh=function(e){var t=c0.test(e.target.tagName);(t||Ph)&&(e._gsapAllow=!0,Ph=t)},u0=function(e){Yr(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,n=t.normalizeScrollX,i=t.momentum,s=t.allowNestedScroll,a=t.onRelease,o,l,c=In(e.target)||Zn,u=Ae.core.globals().ScrollSmoother,d=u&&u.get(),f=vr&&(e.content&&In(e.content)||d&&e.content!==!1&&!d.smooth()&&d.content()),h=Ur(c,en),g=Ur(c,Dn),_=1,p=(Xt.isTouch&&tt.visualViewport?tt.visualViewport.scale*tt.visualViewport.width:tt.outerWidth)/tt.innerWidth,m=0,b=Sn(i)?function(){return i(o)}:function(){return i||2.8},w,S,E=hm(c,e.type,!0,s),T=function(){return S=!1},A=Pi,v=Pi,y=function(){l=Ii(c,en),v=Fa(vr?1:0,l),n&&(A=Fa(0,Ii(c,Dn))),w=as},C=function(){f._gsap.y=Aa(parseFloat(f._gsap.y)+h.offset)+"px",f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(f._gsap.y)+", 0, 1)",h.offset=h.cacheID=0},L=function(){if(S){requestAnimationFrame(T);var K=Aa(o.deltaY/2),te=v(h.v-K);if(f&&te!==h.v+h.offset){h.offset=te-h.v;var N=Aa((parseFloat(f&&f._gsap.y)||0)-h.offset);f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+N+", 0, 1)",f._gsap.y=N+"px",h.cacheID=nt.cache,er()}return!0}h.offset&&C(),S=!0},P,O,G,U,H=function(){y(),P.isActive()&&P.vars.scrollY>l&&(h()>l?P.progress(1)&&h(l):P.resetTo("scrollY",l))};return f&&Ae.set(f,{y:"+=0"}),e.ignoreCheck=function(B){return vr&&B.type==="touchmove"&&L()||_>1.05&&B.type!=="touchstart"||o.isGesturing||B.touches&&B.touches.length>1},e.onPress=function(){S=!1;var B=_;_=Aa((tt.visualViewport&&tt.visualViewport.scale||1)/p),P.pause(),B!==_&&Ql(c,_>1.01?!0:n?!1:"x"),O=g(),G=h(),y(),w=as},e.onRelease=e.onGestureStart=function(B,K){if(h.offset&&C(),!K)U.restart(!0);else{nt.cache++;var te=b(),N,ae;n&&(N=g(),ae=N+te*.05*-B.velocityX/.227,te*=Ch(g,N,ae,Ii(c,Dn)),P.vars.scrollX=A(ae)),N=h(),ae=N+te*.05*-B.velocityY/.227,te*=Ch(h,N,ae,Ii(c,en)),P.vars.scrollY=v(ae),P.invalidate().duration(te).play(.01),(vr&&P.vars.scrollY>=l||N>=l-1)&&Ae.to({},{onUpdate:H,duration:te})}a&&a(B)},e.onWheel=function(){P._ts&&P.pause(),xn()-m>1e3&&(w=0,m=xn())},e.onChange=function(B,K,te,N,ae){if(as!==w&&y(),K&&n&&g(A(N[2]===K?O+(B.startX-B.x):g()+K-N[1])),te){h.offset&&C();var de=ae[2]===te,Ve=de?G+B.startY-B.y:h()+te-ae[1],Xe=v(Ve);de&&Ve!==Xe&&(G+=Xe-Ve),h(Xe)}(te||K)&&er()},e.onEnable=function(){Ql(c,n?!1:"x"),rt.addEventListener("refresh",H),ln(tt,"resize",H),h.smooth&&(h.target.style.scrollBehavior="auto",h.smooth=g.smooth=!1),E.enable()},e.onDisable=function(){Ql(c,!0),on(tt,"resize",H),rt.removeEventListener("refresh",H),E.kill()},e.lockAxis=e.lockAxis!==!1,o=new Xt(e),o.iOS=vr,vr&&!h()&&h(1),vr&&Ae.ticker.add(Pi),U=o._dc,P=Ae.to(o,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:fm(h,h(),function(){return P.pause()})},onUpdate:er,onComplete:U.vars.onComplete}),o};rt.sort=function(r){if(Sn(r))return Qe.sort(r);var e=tt.pageYOffset||0;return rt.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+tt.innerHeight}),Qe.sort(r||function(t,n){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};rt.observe=function(r){return new Xt(r)};rt.normalizeScroll=function(r){if(typeof r>"u")return Rn;if(r===!0&&Rn)return Rn.enable();if(r===!1){Rn&&Rn.kill(),Rn=r;return}var e=r instanceof Xt?r:u0(r);return Rn&&Rn.target===e.target&&Rn.kill(),ls(e.target)&&(Rn=e),e};rt.core={_getVelocityProp:Qc,_inputObserver:hm,_scrollers:nt,_proxies:Bi,bridge:{ss:function(){mi||us("scrollStart"),mi=xn()},ref:function(){return _n}}};em()&&Ae.registerPlugin(rt);let Nh=typeof document<"u"?Ke.useLayoutEffect:Ke.useEffect,Lh=r=>r&&!Array.isArray(r)&&typeof r=="object",yo=[],f0={},dm=Ys;const Rf=(r,e=yo)=>{let t=f0;Lh(r)?(t=r,r=null,e="dependencies"in t?t.dependencies:yo):Lh(e)&&(t=e,e="dependencies"in t?t.dependencies:yo),r&&typeof r!="function"&&console.warn("First parameter must be a function or config object");const{scope:n,revertOnUpdate:i}=t,s=Ke.useRef(!1),a=Ke.useRef(dm.context(()=>{},n)),o=Ke.useRef(c=>a.current.add(null,c)),l=e&&e.length&&!i;return l&&Nh(()=>(s.current=!0,()=>a.current.revert()),yo),Nh(()=>{if(r&&a.current.add(r,n),!l||!s.current)return()=>a.current.revert()},e),{context:a.current,contextSafe:o.current}};Rf.register=r=>{dm=r};Rf.headless=!0;Ys.registerPlugin(rt);const h0=[{type:"fire",size:72,pos:{left:"6%",top:"22%"},opacity:.12,dur:7,rate:.6},{type:"water",size:84,pos:{right:"8%",top:"18%"},opacity:.1,dur:8.4,rate:.8},{type:"electric",size:56,pos:{left:"12%",bottom:"18%"},opacity:.14,dur:6.2,rate:.5},{type:"grass",size:64,pos:{right:"14%",bottom:"24%"},opacity:.09,dur:9,rate:.7},{type:"psychic",size:48,pos:{left:"28%",top:"12%"},opacity:.1,dur:6.8,rate:.55},{type:"dragon",size:96,pos:{right:"30%",top:"9%"},opacity:.08,dur:8.8,rate:.9},{type:"fairy",size:56,pos:{left:"44%",bottom:"8%"},opacity:.12,dur:7.6,rate:.65}];function d0(){const r=Ke.useRef(null);return Rf(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||window.matchMedia("(pointer: coarse)").matches)return;const e=r.current?.closest("section");if(!e)return;const t=Jm(),n=()=>rt.update();return t?.on("scroll",n),Ys.to('[data-layer="nebula"]',{yPercent:18,ease:"none",scrollTrigger:{trigger:e,start:"top top",end:"bottom top",scrub:1}}),Ys.utils.toArray("[data-glyph]").forEach(i=>{const s=Number(i.dataset.rate??.5);Ys.to(i,{y:-s*180,ease:"none",scrollTrigger:{trigger:e,start:"top top",end:"bottom top",scrub:1}})}),()=>t?.off("scroll",n)},{scope:r}),D.jsxs("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:59:5",ref:r,className:"absolute inset-0","aria-hidden":!0,children:[D.jsxs("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:61:7","data-layer":"nebula",className:"absolute -inset-y-24 inset-x-0",children:[D.jsx("img",{"code-path":"src/pages/home/HeroBackdrop.tsx:62:9",src:"/hero-nebula.png",alt:"",className:"h-full w-full object-cover"}),D.jsx("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:63:9",className:"absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void"})]}),h0.map(e=>D.jsx("div",{"code-path":"src/pages/home/HeroBackdrop.tsx:67:9","data-glyph":!0,"data-rate":e.rate,className:"absolute",style:{...e.pos,opacity:e.opacity,color:Lt[e.type].base},children:D.jsx(Rl,{"code-path":"src/pages/home/HeroBackdrop.tsx:74:11",type:e.type,size:e.size,style:{animation:`floaty ${e.dur}s ease-in-out infinite`}})},e.type))]})}const Cf="185",p0=0,Ih=1,m0=2,rl=1,g0=2,Ca=3,Fr=0,zn=1,ji=2,tr=0,js=1,ou=2,Uh=3,Fh=4,_0=5,$r=100,x0=101,v0=102,S0=103,M0=104,y0=200,b0=201,E0=202,T0=203,lu=204,cu=205,A0=206,w0=207,R0=208,C0=209,P0=210,D0=211,N0=212,L0=213,I0=214,uu=0,fu=1,hu=2,aa=3,du=4,pu=5,mu=6,gu=7,pm=0,U0=1,F0=2,ki=0,mm=1,gm=2,_m=3,xm=4,vm=5,Sm=6,Mm=7,ym=300,fs=301,oa=302,ec=303,tc=304,Ll=306,_u=1e3,Qi=1001,xu=1002,fn=1003,O0=1004,bo=1005,Mn=1006,nc=1007,Jr=1008,hi=1009,bm=1010,Em=1011,eo=1012,Pf=1013,Hi=1014,Ui=1015,or=1016,Df=1017,Nf=1018,to=1020,Tm=35902,Am=35899,wm=1021,Rm=1022,yi=1023,lr=1026,Qr=1027,Cm=1028,Lf=1029,hs=1030,If=1031,Uf=1033,sl=33776,al=33777,ol=33778,ll=33779,vu=35840,Su=35841,Mu=35842,yu=35843,bu=36196,Eu=37492,Tu=37496,Au=37488,wu=37489,Ml=37490,Ru=37491,Cu=37808,Pu=37809,Du=37810,Nu=37811,Lu=37812,Iu=37813,Uu=37814,Fu=37815,Ou=37816,Bu=37817,ku=37818,zu=37819,Gu=37820,Hu=37821,Vu=36492,Wu=36494,Xu=36495,Yu=36283,qu=36284,yl=36285,$u=36286,B0=3200,Oh=0,k0=1,Mr="",ci="srgb",bl="srgb-linear",El="linear",xt="srgb",Es=7680,Bh=519,z0=512,G0=513,H0=514,Ff=515,V0=516,W0=517,Of=518,X0=519,kh=35044,zh="300 es",Fi=2e3,Tl=2001;function Y0(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Al(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function q0(){const r=Al("canvas");return r.style.display="block",r}const Gh={};function Hh(...r){const e="THREE."+r.shift();console.log(e,...r)}function Pm(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function He(...r){r=Pm(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function ht(...r){r=Pm(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function Js(...r){const e=r.join(" ");e in Gh||(Gh[e]=!0,He(...r))}function $0(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const K0={[uu]:fu,[hu]:mu,[du]:gu,[aa]:pu,[fu]:uu,[mu]:hu,[gu]:du,[pu]:aa};class gs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ic=Math.PI/180,Ku=180/Math.PI;function ro(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(mn[r&255]+mn[r>>8&255]+mn[r>>16&255]+mn[r>>24&255]+"-"+mn[e&255]+mn[e>>8&255]+"-"+mn[e>>16&15|64]+mn[e>>24&255]+"-"+mn[t&63|128]+mn[t>>8&255]+"-"+mn[t>>16&255]+mn[t>>24&255]+mn[n&255]+mn[n>>8&255]+mn[n>>16&255]+mn[n>>24&255]).toLowerCase()}function lt(r,e,t){return Math.max(e,Math.min(t,r))}function Z0(r,e){return(r%e+e)%e}function rc(r,e,t){return(1-t)*r+t*e}function ma(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ln(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Hf=class Hf{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Hf.prototype.isVector2=!0;let pt=Hf;class ua{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3],f=s[a+0],h=s[a+1],g=s[a+2],_=s[a+3];if(d!==_||l!==f||c!==h||u!==g){let p=l*f+c*h+u*g+d*_;p<0&&(f=-f,h=-h,g=-g,_=-_,p=-p);let m=1-o;if(p<.9995){const b=Math.acos(p),w=Math.sin(b);m=Math.sin(m*b)/w,o=Math.sin(o*b)/w,l=l*m+f*o,c=c*m+h*o,u=u*m+g*o,d=d*m+_*o}else{l=l*m+f*o,c=c*m+h*o,u=u*m+g*o,d=d*m+_*o;const b=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=b,c*=b,u*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=s[a],f=s[a+1],h=s[a+2],g=s[a+3];return e[t]=o*g+u*d+l*h-c*f,e[t+1]=l*g+u*f+c*d-o*h,e[t+2]=c*g+u*h+o*f-l*d,e[t+3]=u*g-o*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),d=o(s/2),f=l(n/2),h=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"YXZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"ZXY":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"ZYX":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"YZX":this._x=f*u*d+c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d-f*h*g;break;case"XZY":this._x=f*u*d-c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d+f*h*g;break;default:He("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(s-c)*h,this._z=(a-i)*h}else if(n>o&&n>d){const h=2*Math.sqrt(1+n-o-d);this._w=(u-l)/h,this._x=.25*h,this._y=(i+a)/h,this._z=(s+c)/h}else if(o>d){const h=2*Math.sqrt(1+o-n-d);this._w=(s-c)/h,this._x=(i+a)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-n-o);this._w=(a-i)/h,this._x=(s+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(lt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-s*l,this._y=i*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Vf=class Vf{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-s*i),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-s*d,this.z=i+l*d+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return sc.copy(this).projectOnVector(e),this.sub(sc)}reflect(e){return this.sub(sc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Vf.prototype.isVector3=!0;let q=Vf;const sc=new q,Vh=new ua,Wf=class Wf{constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],h=n[5],g=n[8],_=i[0],p=i[3],m=i[6],b=i[1],w=i[4],S=i[7],E=i[2],T=i[5],A=i[8];return s[0]=a*_+o*b+l*E,s[3]=a*p+o*w+l*T,s[6]=a*m+o*S+l*A,s[1]=c*_+u*b+d*E,s[4]=c*p+u*w+d*T,s[7]=c*m+u*S+d*A,s[2]=f*_+h*b+g*E,s[5]=f*p+h*w+g*T,s[8]=f*m+h*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*s,h=c*s-a*l,g=t*d+n*f+i*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-u*n)*_,e[2]=(o*n-i*a)*_,e[3]=f*_,e[4]=(u*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=h*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Js("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ac.makeScale(e,t)),this}rotate(e){return Js("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ac.makeRotation(-e)),this}translate(e,t){return Js("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ac.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Wf.prototype.isMatrix3=!0;let $e=Wf;const ac=new $e,Wh=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xh=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function j0(){const r={enabled:!0,workingColorSpace:bl,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===xt&&(i.r=nr(i.r),i.g=nr(i.g),i.b=nr(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xt&&(i.r=Qs(i.r),i.g=Qs(i.g),i.b=Qs(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Mr?El:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Js("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Js("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[bl]:{primaries:e,whitePoint:n,transfer:El,toXYZ:Wh,fromXYZ:Xh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ci},outputColorSpaceConfig:{drawingBufferColorSpace:ci}},[ci]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:Wh,fromXYZ:Xh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ci}}}),r}const ot=j0();function nr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Qs(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ts;class J0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ts===void 0&&(Ts=Al("canvas")),Ts.width=e.width,Ts.height=e.height;const i=Ts.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ts}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Al("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=nr(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(nr(t[n]/255)*255):t[n]=nr(t[n]);return{data:t,width:e.width,height:e.height}}else return He("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Q0=0;class Bf{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=ro(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(oc(i[a].image)):s.push(oc(i[a]))}else s=oc(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function oc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?J0.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(He("Texture: Unable to serialize Texture."),{})}let ex=0;const lc=new q;class Nn extends gs{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,n=Qi,i=Qi,s=Mn,a=Jr,o=yi,l=hi,c=Nn.DEFAULT_ANISOTROPY,u=Mr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ex++}),this.uuid=ro(),this.name="",this.source=new Bf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(lc).x}get height(){return this.source.getSize(lc).y}get depth(){return this.source.getSize(lc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){He(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ym)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _u:e.x=e.x-Math.floor(e.x);break;case Qi:e.x=e.x<0?0:1;break;case xu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _u:e.y=e.y-Math.floor(e.y);break;case Qi:e.y=e.y<0?0:1;break;case xu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=ym;Nn.DEFAULT_ANISOTROPY=1;const Xf=class Xf{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+h+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,S=(h+1)/2,E=(m+1)/2,T=(u+f)/4,A=(d+_)/4,v=(g+p)/4;return w>S&&w>E?w<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(w),i=T/n,s=A/n):S>E?S<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(S),n=T/i,s=v/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=A/s,i=v/s),this.set(n,i,s,t),this}let b=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(d-_)/b,this.z=(f-u)/b,this.w=Math.acos((c+h+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this.w=lt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this.w=lt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Xf.prototype.isVector4=!0;let kt=Xf;class tx extends gs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new kt(0,0,e,t),this.scissorTest=!1,this.viewport=new kt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},s=new Nn(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Mn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Bf(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends tx{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Dm extends Nn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class nx extends Nn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const wl=class wl{constructor(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p)}set(e,t,n,i,s,a,o,l,c,u,d,f,h,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=f,m[3]=h,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new wl().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/As.setFromMatrixColumn(e,0).length(),s=1/As.setFromMatrixColumn(e,1).length(),a=1/As.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+h*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,h=l*d,g=c*u,_=c*d;t[0]=f+_*o,t[4]=g*o-h,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,h=l*d,g=c*u,_=c*d;t[0]=f-_*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*u,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=g*c-h,t[8]=f*c+_,t[1]=l*d,t[5]=_*c+f,t[9]=h*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,h=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-f*d,t[8]=g*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=h*d+g,t[10]=f-_*d}else if(e.order==="XZY"){const f=a*l,h=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+_,t[5]=a*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*u,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ix,e,rx)}lookAt(e,t,n){const i=this.elements;return Xn.subVectors(e,t),Xn.lengthSq()===0&&(Xn.z=1),Xn.normalize(),dr.crossVectors(n,Xn),dr.lengthSq()===0&&(Math.abs(n.z)===1?Xn.x+=1e-4:Xn.z+=1e-4,Xn.normalize(),dr.crossVectors(n,Xn)),dr.normalize(),Eo.crossVectors(Xn,dr),i[0]=dr.x,i[4]=Eo.x,i[8]=Xn.x,i[1]=dr.y,i[5]=Eo.y,i[9]=Xn.y,i[2]=dr.z,i[6]=Eo.z,i[10]=Xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],h=n[13],g=n[2],_=n[6],p=n[10],m=n[14],b=n[3],w=n[7],S=n[11],E=n[15],T=i[0],A=i[4],v=i[8],y=i[12],C=i[1],L=i[5],P=i[9],O=i[13],G=i[2],U=i[6],H=i[10],B=i[14],K=i[3],te=i[7],N=i[11],ae=i[15];return s[0]=a*T+o*C+l*G+c*K,s[4]=a*A+o*L+l*U+c*te,s[8]=a*v+o*P+l*H+c*N,s[12]=a*y+o*O+l*B+c*ae,s[1]=u*T+d*C+f*G+h*K,s[5]=u*A+d*L+f*U+h*te,s[9]=u*v+d*P+f*H+h*N,s[13]=u*y+d*O+f*B+h*ae,s[2]=g*T+_*C+p*G+m*K,s[6]=g*A+_*L+p*U+m*te,s[10]=g*v+_*P+p*H+m*N,s[14]=g*y+_*O+p*B+m*ae,s[3]=b*T+w*C+S*G+E*K,s[7]=b*A+w*L+S*U+E*te,s[11]=b*v+w*P+S*H+E*N,s[15]=b*y+w*O+S*B+E*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],g=e[3],_=e[7],p=e[11],m=e[15],b=l*h-c*f,w=o*h-c*d,S=o*f-l*d,E=a*h-c*u,T=a*f-l*u,A=a*d-o*u;return t*(_*b-p*w+m*S)-n*(g*b-p*E+m*T)+i*(g*w-_*E+m*A)-s*(g*S-_*T+p*A)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],g=e[12],_=e[13],p=e[14],m=e[15],b=t*o-n*a,w=t*l-i*a,S=t*c-s*a,E=n*l-i*o,T=n*c-s*o,A=i*c-s*l,v=u*_-d*g,y=u*p-f*g,C=u*m-h*g,L=d*p-f*_,P=d*m-h*_,O=f*m-h*p,G=b*O-w*P+S*L+E*C-T*y+A*v;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/G;return e[0]=(o*O-l*P+c*L)*U,e[1]=(i*P-n*O-s*L)*U,e[2]=(_*A-p*T+m*E)*U,e[3]=(f*T-d*A-h*E)*U,e[4]=(l*C-a*O-c*y)*U,e[5]=(t*O-i*C+s*y)*U,e[6]=(p*S-g*A-m*w)*U,e[7]=(u*A-f*S+h*w)*U,e[8]=(a*P-o*C+c*v)*U,e[9]=(n*C-t*P-s*v)*U,e[10]=(g*T-_*S+m*b)*U,e[11]=(d*S-u*T-h*b)*U,e[12]=(o*y-a*L-l*v)*U,e[13]=(t*L-n*y+i*v)*U,e[14]=(_*w-g*E-p*b)*U,e[15]=(u*E-d*w+f*b)*U,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,d=o+o,f=s*c,h=s*u,g=s*d,_=a*u,p=a*d,m=o*d,b=l*c,w=l*u,S=l*d,E=n.x,T=n.y,A=n.z;return i[0]=(1-(_+m))*E,i[1]=(h+S)*E,i[2]=(g-w)*E,i[3]=0,i[4]=(h-S)*T,i[5]=(1-(f+m))*T,i[6]=(p+b)*T,i[7]=0,i[8]=(g+w)*A,i[9]=(p-b)*A,i[10]=(1-(f+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=As.set(i[0],i[1],i[2]).length();const o=As.set(i[4],i[5],i[6]).length(),l=As.set(i[8],i[9],i[10]).length();s<0&&(a=-a),gi.copy(this);const c=1/a,u=1/o,d=1/l;return gi.elements[0]*=c,gi.elements[1]*=c,gi.elements[2]*=c,gi.elements[4]*=u,gi.elements[5]*=u,gi.elements[6]*=u,gi.elements[8]*=d,gi.elements[9]*=d,gi.elements[10]*=d,t.setFromRotationMatrix(gi),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=Fi,l=!1){const c=this.elements,u=2*s/(t-e),d=2*s/(n-i),f=(t+e)/(t-e),h=(n+i)/(n-i);let g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===Fi)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Tl)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=Fi,l=!1){const c=this.elements,u=2/(t-e),d=2/(n-i),f=-(t+e)/(t-e),h=-(n+i)/(n-i);let g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===Fi)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Tl)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};wl.prototype.isMatrix4=!0;let Yt=wl;const As=new q,gi=new Yt,ix=new q(0,0,0),rx=new q(1,1,1),dr=new q,Eo=new q,Xn=new q,Yh=new Yt,qh=new ua;class ds{constructor(e=0,t=0,n=0,i=ds.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],d=i[2],f=i[6],h=i[10];switch(t){case"XYZ":this._y=Math.asin(lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-lt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(lt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-lt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(lt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:He("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Yh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qh.setFromEuler(this),this.setFromQuaternion(qh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ds.DEFAULT_ORDER="XYZ";class Nm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sx=0;const $h=new q,ws=new ua,Vi=new Yt,To=new q,ga=new q,ax=new q,ox=new ua,Kh=new q(1,0,0),Zh=new q(0,1,0),jh=new q(0,0,1),Jh={type:"added"},lx={type:"removed"},Rs={type:"childadded",child:null},cc={type:"childremoved",child:null};class Gn extends gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sx++}),this.uuid=ro(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Gn.DEFAULT_UP.clone();const e=new q,t=new ds,n=new ua,i=new q(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Yt},normalMatrix:{value:new $e}}),this.matrix=new Yt,this.matrixWorld=new Yt,this.matrixAutoUpdate=Gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ws.setFromAxisAngle(e,t),this.quaternion.multiply(ws),this}rotateOnWorldAxis(e,t){return ws.setFromAxisAngle(e,t),this.quaternion.premultiply(ws),this}rotateX(e){return this.rotateOnAxis(Kh,e)}rotateY(e){return this.rotateOnAxis(Zh,e)}rotateZ(e){return this.rotateOnAxis(jh,e)}translateOnAxis(e,t){return $h.copy(e).applyQuaternion(this.quaternion),this.position.add($h.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Kh,e)}translateY(e){return this.translateOnAxis(Zh,e)}translateZ(e){return this.translateOnAxis(jh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Vi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?To.copy(e):To.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ga.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Vi.lookAt(ga,To,this.up):Vi.lookAt(To,ga,this.up),this.quaternion.setFromRotationMatrix(Vi),i&&(Vi.extractRotation(i.matrixWorld),ws.setFromRotationMatrix(Vi),this.quaternion.premultiply(ws.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ht("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jh),Rs.child=e,this.dispatchEvent(Rs),Rs.child=null):ht("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(lx),cc.child=e,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jh),Rs.child=e,this.dispatchEvent(Rs),Rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,e,ax),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,ox,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Gn.DEFAULT_UP=new q(0,1,0);Gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ao extends Gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const cx={type:"move"};class uc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ao,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ao,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ao,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,g=.005;c.inputState.pinching&&f>h+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(cx)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ao;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Lm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pr={h:0,s:0,l:0},wo={h:0,s:0,l:0};function fc(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class dt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ot.workingColorSpace){if(e=Z0(e,1),t=lt(t,0,1),n=lt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=fc(a,s,e+1/3),this.g=fc(a,s,e),this.b=fc(a,s,e-1/3)}return ot.colorSpaceToWorking(this,i),this}setStyle(e,t=ci){function n(s){s!==void 0&&parseFloat(s)<1&&He("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:He("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);He("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ci){const n=Lm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):He("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=nr(e.r),this.g=nr(e.g),this.b=nr(e.b),this}copyLinearToSRGB(e){return this.r=Qs(e.r),this.g=Qs(e.g),this.b=Qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ci){return ot.workingToColorSpace(gn.copy(this),e),Math.round(lt(gn.r*255,0,255))*65536+Math.round(lt(gn.g*255,0,255))*256+Math.round(lt(gn.b*255,0,255))}getHexString(e=ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(gn.copy(this),t);const n=gn.r,i=gn.g,s=gn.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(gn.copy(this),t),e.r=gn.r,e.g=gn.g,e.b=gn.b,e}getStyle(e=ci){ot.workingToColorSpace(gn.copy(this),e);const t=gn.r,n=gn.g,i=gn.b;return e!==ci?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(pr),this.setHSL(pr.h+e,pr.s+t,pr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(pr),e.getHSL(wo);const n=rc(pr.h,wo.h,t),i=rc(pr.s,wo.s,t),s=rc(pr.l,wo.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const gn=new dt;dt.NAMES=Lm;class ux extends Gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ds,this.environmentIntensity=1,this.environmentRotation=new ds,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const _i=new q,Wi=new q,hc=new q,Xi=new q,Cs=new q,Ps=new q,Qh=new q,dc=new q,pc=new q,mc=new q,gc=new kt,_c=new kt,xc=new kt;class Mi{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),_i.subVectors(e,t),i.cross(_i);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){_i.subVectors(i,t),Wi.subVectors(n,t),hc.subVectors(e,t);const a=_i.dot(_i),o=_i.dot(Wi),l=_i.dot(hc),c=Wi.dot(Wi),u=Wi.dot(hc),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,h=(c*l-o*u)*f,g=(a*u-o*l)*f;return s.set(1-h-g,g,h)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Xi)===null?!1:Xi.x>=0&&Xi.y>=0&&Xi.x+Xi.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Xi.x),l.addScaledVector(a,Xi.y),l.addScaledVector(o,Xi.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return gc.setScalar(0),_c.setScalar(0),xc.setScalar(0),gc.fromBufferAttribute(e,t),_c.fromBufferAttribute(e,n),xc.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(gc,s.x),a.addScaledVector(_c,s.y),a.addScaledVector(xc,s.z),a}static isFrontFacing(e,t,n,i){return _i.subVectors(n,t),Wi.subVectors(e,t),_i.cross(Wi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _i.subVectors(this.c,this.b),Wi.subVectors(this.a,this.b),_i.cross(Wi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Mi.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Cs.subVectors(i,n),Ps.subVectors(s,n),dc.subVectors(e,n);const l=Cs.dot(dc),c=Ps.dot(dc);if(l<=0&&c<=0)return t.copy(n);pc.subVectors(e,i);const u=Cs.dot(pc),d=Ps.dot(pc);if(u>=0&&d<=u)return t.copy(i);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Cs,a);mc.subVectors(e,s);const h=Cs.dot(mc),g=Ps.dot(mc);if(g>=0&&h<=g)return t.copy(s);const _=h*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ps,o);const p=u*g-h*d;if(p<=0&&d-u>=0&&h-g>=0)return Qh.subVectors(s,i),o=(d-u)/(d-u+(h-g)),t.copy(i).addScaledVector(Qh,o);const m=1/(p+_+f);return a=_*m,o=f*m,t.copy(n).addScaledVector(Cs,a).addScaledVector(Ps,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class so{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=xi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,xi):xi.fromBufferAttribute(s,a),xi.applyMatrix4(e.matrixWorld),this.expandByPoint(xi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ro.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ro.copy(n.boundingBox)),Ro.applyMatrix4(e.matrixWorld),this.union(Ro)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xi),xi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_a),Co.subVectors(this.max,_a),Ds.subVectors(e.a,_a),Ns.subVectors(e.b,_a),Ls.subVectors(e.c,_a),mr.subVectors(Ns,Ds),gr.subVectors(Ls,Ns),zr.subVectors(Ds,Ls);let t=[0,-mr.z,mr.y,0,-gr.z,gr.y,0,-zr.z,zr.y,mr.z,0,-mr.x,gr.z,0,-gr.x,zr.z,0,-zr.x,-mr.y,mr.x,0,-gr.y,gr.x,0,-zr.y,zr.x,0];return!vc(t,Ds,Ns,Ls,Co)||(t=[1,0,0,0,1,0,0,0,1],!vc(t,Ds,Ns,Ls,Co))?!1:(Po.crossVectors(mr,gr),t=[Po.x,Po.y,Po.z],vc(t,Ds,Ns,Ls,Co))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Yi=[new q,new q,new q,new q,new q,new q,new q,new q],xi=new q,Ro=new so,Ds=new q,Ns=new q,Ls=new q,mr=new q,gr=new q,zr=new q,_a=new q,Co=new q,Po=new q,Gr=new q;function vc(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Gr.fromArray(r,s);const o=i.x*Math.abs(Gr.x)+i.y*Math.abs(Gr.y)+i.z*Math.abs(Gr.z),l=e.dot(Gr),c=t.dot(Gr),u=n.dot(Gr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Kt=new q,Do=new pt;let fx=0;class ni extends gs{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fx++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kh,this.updateRanges=[],this.gpuType=Ui,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Do.fromBufferAttribute(this,t),Do.applyMatrix3(e),this.setXY(t,Do.x,Do.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix3(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ma(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ln(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ma(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ma(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ma(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ma(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),n=Ln(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),n=Ln(n,this.array),i=Ln(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),n=Ln(n,this.array),i=Ln(i,this.array),s=Ln(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kh&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Im extends ni{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Um extends ni{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ir extends ni{constructor(e,t,n){super(new Float32Array(e),t,n)}}const hx=new so,xa=new q,Sc=new q;class Il{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):hx.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xa.subVectors(e,this.center);const t=xa.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(xa,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xa.copy(e.center).add(Sc)),this.expandByPoint(xa.copy(e.center).sub(Sc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let dx=0;const oi=new Yt,Mc=new Gn,Is=new q,Yn=new so,va=new so,an=new q;class Ei extends gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:dx++}),this.uuid=ro(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Y0(e)?Um:Im)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new $e().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return oi.makeRotationFromQuaternion(e),this.applyMatrix4(oi),this}rotateX(e){return oi.makeRotationX(e),this.applyMatrix4(oi),this}rotateY(e){return oi.makeRotationY(e),this.applyMatrix4(oi),this}rotateZ(e){return oi.makeRotationZ(e),this.applyMatrix4(oi),this}translate(e,t,n){return oi.makeTranslation(e,t,n),this.applyMatrix4(oi),this}scale(e,t,n){return oi.makeScale(e,t,n),this.applyMatrix4(oi),this}lookAt(e){return Mc.lookAt(e),Mc.updateMatrix(),this.applyMatrix4(Mc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Is).negate(),this.translate(Is.x,Is.y,Is.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ir(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&He("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new so);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Yn.setFromBufferAttribute(s),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Il);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){const n=this.boundingSphere.center;if(Yn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];va.setFromBufferAttribute(o),this.morphTargetsRelative?(an.addVectors(Yn.min,va.min),Yn.expandByPoint(an),an.addVectors(Yn.max,va.max),Yn.expandByPoint(an)):(Yn.expandByPoint(va.min),Yn.expandByPoint(va.max))}Yn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)an.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(an));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)an.fromBufferAttribute(o,c),l&&(Is.fromBufferAttribute(e,c),an.add(Is)),i=Math.max(i,n.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ni(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new q,l[v]=new q;const c=new q,u=new q,d=new q,f=new pt,h=new pt,g=new pt,_=new q,p=new q;function m(v,y,C){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,C),f.fromBufferAttribute(s,v),h.fromBufferAttribute(s,y),g.fromBufferAttribute(s,C),u.sub(c),d.sub(c),h.sub(f),g.sub(f);const L=1/(h.x*g.y-g.x*h.y);isFinite(L)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(L),p.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(L),o[v].add(_),o[y].add(_),o[C].add(_),l[v].add(p),l[y].add(p),l[C].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let v=0,y=b.length;v<y;++v){const C=b[v],L=C.start,P=C.count;for(let O=L,G=L+P;O<G;O+=3)m(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const w=new q,S=new q,E=new q,T=new q;function A(v){E.fromBufferAttribute(i,v),T.copy(E);const y=o[v];w.copy(y),w.sub(E.multiplyScalar(E.dot(y))).normalize(),S.crossVectors(T,y);const L=S.dot(l[v])<0?-1:1;a.setXYZW(v,w.x,w.y,w.z,L)}for(let v=0,y=b.length;v<y;++v){const C=b[v],L=C.start,P=C.count;for(let O=L,G=L+P;O<G;O+=3)A(e.getX(O+0)),A(e.getX(O+1)),A(e.getX(O+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ni(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);const i=new q,s=new q,a=new q,o=new q,l=new q,c=new q,u=new q,d=new q;if(e)for(let f=0,h=e.count;f<h;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),u.subVectors(a,s),d.subVectors(i,s),u.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,h=t.count;f<h;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(i,s),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)an.fromBufferAttribute(e,t),an.normalize(),e.setXYZ(t,an.x,an.y,an.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u);let h=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?h=l[_]*o.data.stride+o.offset:h=l[_]*u;for(let m=0;m<u;m++)f[g++]=c[h++]}return new ni(f,u,d)}if(this.index===null)return He("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ei,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,d=c.length;u<d;u++){const f=c[u],h=e(f,n);l.push(h)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(i[l]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let px=0;class ao extends gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:px++}),this.uuid=ro(),this.name="",this.type="Material",this.blending=js,this.side=Fr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lu,this.blendDst=cu,this.blendEquation=$r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dt(0,0,0),this.blendAlpha=0,this.depthFunc=aa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){He(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==js&&(n.blending=this.blending),this.side!==Fr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==lu&&(n.blendSrc=this.blendSrc),this.blendDst!==cu&&(n.blendDst=this.blendDst),this.blendEquation!==$r&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==aa&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new dt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new pt().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new pt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const qi=new q,yc=new q,No=new q,_r=new q,bc=new q,Lo=new q,Ec=new q;class Fm{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){yc.copy(e).add(t).multiplyScalar(.5),No.copy(t).sub(e).normalize(),_r.copy(this.origin).sub(yc);const s=e.distanceTo(t)*.5,a=-this.direction.dot(No),o=_r.dot(this.direction),l=-_r.dot(No),c=_r.lengthSq(),u=Math.abs(1-a*a);let d,f,h,g;if(u>0)if(d=a*l-o,f=a*o-l,g=s*u,d>=0)if(f>=-g)if(f<=g){const _=1/u;d*=_,f*=_,h=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-s,-l),s),h=f*(f+2*l)+c):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(yc).addScaledVector(No,f),h}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const n=qi.dot(this.direction),i=qi.dot(qi)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,n,i,s){bc.subVectors(t,e),Lo.subVectors(n,e),Ec.crossVectors(bc,Lo);let a=this.direction.dot(Ec),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_r.subVectors(this.origin,e);const l=o*this.direction.dot(Lo.crossVectors(_r,Lo));if(l<0)return null;const c=o*this.direction.dot(bc.cross(_r));if(c<0||l+c>a)return null;const u=-o*_r.dot(Ec);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Om extends ao{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ds,this.combine=pm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ed=new Yt,Hr=new Fm,Io=new Il,td=new q,Uo=new q,Fo=new q,Oo=new q,Tc=new q,Bo=new q,nd=new q,ko=new q;class cr extends Gn{constructor(e=new Ei,t=new Om){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Bo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],d=s[l];u!==0&&(Tc.fromBufferAttribute(d,e),a?Bo.addScaledVector(Tc,u):Bo.addScaledVector(Tc.sub(t),u))}t.add(Bo)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Io.copy(n.boundingSphere),Io.applyMatrix4(s),Hr.copy(e.ray).recast(e.near),!(Io.containsPoint(Hr.origin)===!1&&(Hr.intersectSphere(Io,td)===null||Hr.origin.distanceToSquared(td)>(e.far-e.near)**2))&&(ed.copy(s).invert(),Hr.copy(e.ray).applyMatrix4(ed),!(n.boundingBox!==null&&Hr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hr)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],b=Math.max(p.start,h.start),w=Math.min(o.count,Math.min(p.start+p.count,h.start+h.count));for(let S=b,E=w;S<E;S+=3){const T=o.getX(S),A=o.getX(S+1),v=o.getX(S+2);i=zo(this,m,e,n,c,u,d,T,A,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const b=o.getX(p),w=o.getX(p+1),S=o.getX(p+2);i=zo(this,a,e,n,c,u,d,b,w,S),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],b=Math.max(p.start,h.start),w=Math.min(l.count,Math.min(p.start+p.count,h.start+h.count));for(let S=b,E=w;S<E;S+=3){const T=S,A=S+1,v=S+2;i=zo(this,m,e,n,c,u,d,T,A,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),_=Math.min(l.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const b=p,w=p+1,S=p+2;i=zo(this,a,e,n,c,u,d,b,w,S),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function mx(r,e,t,n,i,s,a,o){let l;if(e.side===zn?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===Fr,o),l===null)return null;ko.copy(o),ko.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(ko);return c<t.near||c>t.far?null:{distance:c,point:ko.clone(),object:r}}function zo(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,Uo),r.getVertexPosition(l,Fo),r.getVertexPosition(c,Oo);const u=mx(r,e,t,n,Uo,Fo,Oo,nd);if(u){const d=new q;Mi.getBarycoord(nd,Uo,Fo,Oo,d),i&&(u.uv=Mi.getInterpolatedAttribute(i,o,l,c,d,new pt)),s&&(u.uv1=Mi.getInterpolatedAttribute(s,o,l,c,d,new pt)),a&&(u.normal=Mi.getInterpolatedAttribute(a,o,l,c,d,new q),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new q,materialIndex:0};Mi.getNormal(Uo,Fo,Oo,f.normal),u.face=f,u.barycoord=d}return u}class gx extends Nn{constructor(e=null,t=1,n=1,i,s,a,o,l,c=fn,u=fn,d,f){super(null,a,o,l,c,u,i,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ac=new q,_x=new q,xx=new $e;class qr{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ac.subVectors(n,t).cross(_x.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Ac),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||xx.getNormalMatrix(e),i=this.coplanarPoint(Ac).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vr=new Il,vx=new pt(.5,.5),Go=new q;class Bm{constructor(e=new qr,t=new qr,n=new qr,i=new qr,s=new qr,a=new qr){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Fi,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],d=s[5],f=s[6],h=s[7],g=s[8],_=s[9],p=s[10],m=s[11],b=s[12],w=s[13],S=s[14],E=s[15];if(i[0].setComponents(c-a,h-u,m-g,E-b).normalize(),i[1].setComponents(c+a,h+u,m+g,E+b).normalize(),i[2].setComponents(c+o,h+d,m+_,E+w).normalize(),i[3].setComponents(c-o,h-d,m-_,E-w).normalize(),n)i[4].setComponents(l,f,p,S).normalize(),i[5].setComponents(c-l,h-f,m-p,E-S).normalize();else if(i[4].setComponents(c-l,h-f,m-p,E-S).normalize(),t===Fi)i[5].setComponents(c+l,h+f,m+p,E+S).normalize();else if(t===Tl)i[5].setComponents(l,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){Vr.center.set(0,0,0);const t=vx.distanceTo(e.center);return Vr.radius=.7071067811865476+t,Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Go.x=i.normal.x>0?e.max.x:e.min.x,Go.y=i.normal.y>0?e.max.y:e.min.y,Go.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Go)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Sx extends ao{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const id=new Yt,Zu=new Fm,Ho=new Il,Vo=new q;class Mx extends Gn{constructor(e=new Ei,t=new Sx){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ho.copy(n.boundingSphere),Ho.applyMatrix4(i),Ho.radius+=s,e.ray.intersectsSphere(Ho)===!1)return;id.copy(i).invert(),Zu.copy(e.ray).applyMatrix4(id);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),h=Math.min(c.count,a.start+a.count);for(let g=f,_=h;g<_;g++){const p=c.getX(g);Vo.fromBufferAttribute(d,p),rd(Vo,p,l,i,e,t,this)}}else{const f=Math.max(0,a.start),h=Math.min(d.count,a.start+a.count);for(let g=f,_=h;g<_;g++)Vo.fromBufferAttribute(d,g),rd(Vo,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function rd(r,e,t,n,i,s,a){const o=Zu.distanceSqToPoint(r);if(o<t){const l=new q;Zu.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class km extends Nn{constructor(e=[],t=fs,n,i,s,a,o,l,c,u){super(e,t,n,i,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class la extends Nn{constructor(e,t,n=Hi,i,s,a,o=fn,l=fn,c,u=lr,d=1){if(u!==lr&&u!==Qr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,i,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class yx extends la{constructor(e,t=Hi,n=fs,i,s,a=fn,o=fn,l,c=lr){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class zm extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class oo extends Ei{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],d=[];let f=0,h=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new ir(c,3)),this.setAttribute("normal",new ir(u,3)),this.setAttribute("uv",new ir(d,2));function g(_,p,m,b,w,S,E,T,A,v,y){const C=S/A,L=E/v,P=S/2,O=E/2,G=T/2,U=A+1,H=v+1;let B=0,K=0;const te=new q;for(let N=0;N<H;N++){const ae=N*L-O;for(let de=0;de<U;de++){const Ve=de*C-P;te[_]=Ve*b,te[p]=ae*w,te[m]=G,c.push(te.x,te.y,te.z),te[_]=0,te[p]=0,te[m]=T>0?1:-1,u.push(te.x,te.y,te.z),d.push(de/A),d.push(1-N/v),B+=1}}for(let N=0;N<v;N++)for(let ae=0;ae<A;ae++){const de=f+ae+U*N,Ve=f+ae+U*(N+1),Xe=f+(ae+1)+U*(N+1),Be=f+(ae+1)+U*N;l.push(de,Ve,Be),l.push(Ve,Xe,Be),K+=6}o.addGroup(h,K,y),h+=K,f+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ul extends Ei{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,d=e/o,f=t/l,h=[],g=[],_=[],p=[];for(let m=0;m<u;m++){const b=m*f-a;for(let w=0;w<c;w++){const S=w*d-s;g.push(S,-b,0),_.push(0,0,1),p.push(w/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<o;b++){const w=b+c*m,S=b+c*(m+1),E=b+1+c*(m+1),T=b+1+c*m;h.push(w,S,T),h.push(S,E,T)}this.setIndex(h),this.setAttribute("position",new ir(g,3)),this.setAttribute("normal",new ir(_,3)),this.setAttribute("uv",new ir(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ul(e.width,e.height,e.widthSegments,e.heightSegments)}}function ca(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if(sd(i))i.isRenderTargetTexture?(He("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(sd(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function wn(r){const e={};for(let t=0;t<r.length;t++){const n=ca(r[t]);for(const i in n)e[i]=n[i]}return e}function sd(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function bx(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Gm(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const Ex={clone:ca,merge:wn};var Tx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ax=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bi extends ao{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tx,this.fragmentShader=Ax,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ca(e.uniforms),this.uniformsGroups=bx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new dt().setHex(i.value);break;case"v2":this.uniforms[n].value=new pt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new q().fromArray(i.value);break;case"v4":this.uniforms[n].value=new kt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new $e().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Yt().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class wx extends bi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Rx extends ao{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=B0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Cx extends ao{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Wo=new q,Xo=new ua,wi=new q;class Hm extends Gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Yt,this.projectionMatrix=new Yt,this.projectionMatrixInverse=new Yt,this.coordinateSystem=Fi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Wo,Xo,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Xo,wi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Wo,Xo,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Xo,wi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const xr=new q,ad=new pt,od=new pt;class Si extends Hm{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ku*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ic*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ku*2*Math.atan(Math.tan(ic*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xr.x,xr.y).multiplyScalar(-e/xr.z),xr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xr.x,xr.y).multiplyScalar(-e/xr.z)}getViewSize(e,t){return this.getViewBounds(e,ad,od),t.subVectors(od,ad)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ic*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class kf extends Hm{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Us=-90,Fs=1;class Px extends Gn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Si(Us,Fs,e,t);i.layers=this.layers,this.add(i);const s=new Si(Us,Fs,e,t);s.layers=this.layers,this.add(s);const a=new Si(Us,Fs,e,t);a.layers=this.layers,this.add(a);const o=new Si(Us,Fs,e,t);o.layers=this.layers,this.add(o);const l=new Si(Us,Fs,e,t);l.layers=this.layers,this.add(l);const c=new Si(Us,Fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Fi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Tl)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Dx extends Si{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Yf=class Yf{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};Yf.prototype.isMatrix2=!0;let ld=Yf;function cd(r,e,t,n){const i=Nx(n);switch(t){case wm:return r*e;case Cm:return r*e/i.components*i.byteLength;case Lf:return r*e/i.components*i.byteLength;case hs:return r*e*2/i.components*i.byteLength;case If:return r*e*2/i.components*i.byteLength;case Rm:return r*e*3/i.components*i.byteLength;case yi:return r*e*4/i.components*i.byteLength;case Uf:return r*e*4/i.components*i.byteLength;case sl:case al:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ol:case ll:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Su:case yu:return Math.max(r,16)*Math.max(e,8)/4;case vu:case Mu:return Math.max(r,8)*Math.max(e,8)/2;case bu:case Eu:case Au:case wu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Tu:case Ml:case Ru:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Cu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Pu:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Du:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Nu:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Lu:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Iu:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Uu:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Fu:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Ou:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Bu:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case ku:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case zu:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Gu:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Hu:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Vu:case Wu:case Xu:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Yu:case qu:return Math.ceil(r/4)*Math.ceil(e/4)*8;case yl:case $u:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nx(r){switch(r){case hi:case bm:return{byteLength:1,components:1};case eo:case Em:case or:return{byteLength:2,components:1};case Df:case Nf:return{byteLength:2,components:4};case Hi:case Pf:case Ui:return{byteLength:4,components:1};case Tm:case Am:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cf}}));typeof window<"u"&&(window.__THREE__?He("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cf);function Vm(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Lx(r){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=r.HALF_FLOAT:h=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=r.SHORT;else if(c instanceof Uint32Array)h=r.UNSIGNED_INT;else if(c instanceof Int32Array)h=r.INT;else if(c instanceof Int8Array)h=r.BYTE;else if(c instanceof Uint8Array)h=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,u);else{d.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<d.length;h++){const g=d[f],_=d[h];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let h=0,g=d.length;h<g;h++){const _=d[h];r.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var Ix=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ux=`#ifdef USE_ALPHAHASH
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
#endif`,Fx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ox=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,kx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zx=`#ifdef USE_AOMAP
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
#endif`,Gx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hx=`#ifdef USE_BATCHING
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
#endif`,Vx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qx=`#ifdef USE_IRIDESCENCE
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
#endif`,$x=`#ifdef USE_BUMPMAP
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
#endif`,Kx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ev=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,tv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,nv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,iv=`#define PI 3.141592653589793
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
} // validated`,rv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sv=`vec3 transformedNormal = objectNormal;
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
#endif`,av=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ov=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uv="gl_FragColor = linearToOutputTexel( gl_FragColor );",fv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hv=`#ifdef USE_ENVMAP
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
#endif`,dv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,pv=`#ifdef USE_ENVMAP
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
#endif`,mv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gv=`#ifdef USE_ENVMAP
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
#endif`,_v=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mv=`#ifdef USE_GRADIENTMAP
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
}`,yv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ev=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tv=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Av=`#ifdef USE_ENVMAP
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
#endif`,wv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dv=`PhysicalMaterial material;
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
#endif`,Nv=`uniform sampler2D dfgLUT;
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
}`,Lv=`
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
#endif`,Iv=`#if defined( RE_IndirectDiffuse )
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
#endif`,Uv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fv=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Ov=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wv=`#if defined( USE_POINTS_UV )
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
#endif`,Xv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$v=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zv=`#ifdef USE_MORPHTARGETS
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
#endif`,jv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,eS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,iS=`#ifdef USE_NORMALMAP
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
#endif`,rS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,aS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,oS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,uS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_S=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vS=`float getShadowMask() {
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
}`,SS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,MS=`#ifdef USE_SKINNING
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
#endif`,yS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bS=`#ifdef USE_SKINNING
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
#endif`,ES=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,TS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,AS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,RS=`#ifdef USE_TRANSMISSION
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
#endif`,CS=`#ifdef USE_TRANSMISSION
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
#endif`,PS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,DS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,NS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,LS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const IS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,US=`uniform sampler2D t2D;
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
}`,FS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,OS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,BS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zS=`#include <common>
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
}`,GS=`#if DEPTH_PACKING == 3200
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
}`,HS=`#define DISTANCE
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
}`,VS=`#define DISTANCE
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
}`,WS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,XS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,YS=`uniform float scale;
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
}`,qS=`uniform vec3 diffuse;
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
}`,$S=`#include <common>
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
}`,KS=`uniform vec3 diffuse;
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
}`,ZS=`#define LAMBERT
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
}`,jS=`#define LAMBERT
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
}`,JS=`#define MATCAP
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
}`,QS=`#define MATCAP
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
}`,eM=`#define NORMAL
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
}`,tM=`#define NORMAL
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
}`,nM=`#define PHONG
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
}`,iM=`#define PHONG
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
}`,rM=`#define STANDARD
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
}`,sM=`#define STANDARD
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
}`,aM=`#define TOON
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
}`,oM=`#define TOON
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
}`,lM=`uniform float size;
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
}`,cM=`uniform vec3 diffuse;
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
}`,uM=`#include <common>
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
}`,fM=`uniform vec3 color;
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
}`,hM=`uniform float rotation;
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
}`,dM=`uniform vec3 diffuse;
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
}`,je={alphahash_fragment:Ix,alphahash_pars_fragment:Ux,alphamap_fragment:Fx,alphamap_pars_fragment:Ox,alphatest_fragment:Bx,alphatest_pars_fragment:kx,aomap_fragment:zx,aomap_pars_fragment:Gx,batching_pars_vertex:Hx,batching_vertex:Vx,begin_vertex:Wx,beginnormal_vertex:Xx,bsdfs:Yx,iridescence_fragment:qx,bumpmap_pars_fragment:$x,clipping_planes_fragment:Kx,clipping_planes_pars_fragment:Zx,clipping_planes_pars_vertex:jx,clipping_planes_vertex:Jx,color_fragment:Qx,color_pars_fragment:ev,color_pars_vertex:tv,color_vertex:nv,common:iv,cube_uv_reflection_fragment:rv,defaultnormal_vertex:sv,displacementmap_pars_vertex:av,displacementmap_vertex:ov,emissivemap_fragment:lv,emissivemap_pars_fragment:cv,colorspace_fragment:uv,colorspace_pars_fragment:fv,envmap_fragment:hv,envmap_common_pars_fragment:dv,envmap_pars_fragment:pv,envmap_pars_vertex:mv,envmap_physical_pars_fragment:Av,envmap_vertex:gv,fog_vertex:_v,fog_pars_vertex:xv,fog_fragment:vv,fog_pars_fragment:Sv,gradientmap_pars_fragment:Mv,lightmap_pars_fragment:yv,lights_lambert_fragment:bv,lights_lambert_pars_fragment:Ev,lights_pars_begin:Tv,lights_toon_fragment:wv,lights_toon_pars_fragment:Rv,lights_phong_fragment:Cv,lights_phong_pars_fragment:Pv,lights_physical_fragment:Dv,lights_physical_pars_fragment:Nv,lights_fragment_begin:Lv,lights_fragment_maps:Iv,lights_fragment_end:Uv,lightprobes_pars_fragment:Fv,logdepthbuf_fragment:Ov,logdepthbuf_pars_fragment:Bv,logdepthbuf_pars_vertex:kv,logdepthbuf_vertex:zv,map_fragment:Gv,map_pars_fragment:Hv,map_particle_fragment:Vv,map_particle_pars_fragment:Wv,metalnessmap_fragment:Xv,metalnessmap_pars_fragment:Yv,morphinstance_vertex:qv,morphcolor_vertex:$v,morphnormal_vertex:Kv,morphtarget_pars_vertex:Zv,morphtarget_vertex:jv,normal_fragment_begin:Jv,normal_fragment_maps:Qv,normal_pars_fragment:eS,normal_pars_vertex:tS,normal_vertex:nS,normalmap_pars_fragment:iS,clearcoat_normal_fragment_begin:rS,clearcoat_normal_fragment_maps:sS,clearcoat_pars_fragment:aS,iridescence_pars_fragment:oS,opaque_fragment:lS,packing:cS,premultiplied_alpha_fragment:uS,project_vertex:fS,dithering_fragment:hS,dithering_pars_fragment:dS,roughnessmap_fragment:pS,roughnessmap_pars_fragment:mS,shadowmap_pars_fragment:gS,shadowmap_pars_vertex:_S,shadowmap_vertex:xS,shadowmask_pars_fragment:vS,skinbase_vertex:SS,skinning_pars_vertex:MS,skinning_vertex:yS,skinnormal_vertex:bS,specularmap_fragment:ES,specularmap_pars_fragment:TS,tonemapping_fragment:AS,tonemapping_pars_fragment:wS,transmission_fragment:RS,transmission_pars_fragment:CS,uv_pars_fragment:PS,uv_pars_vertex:DS,uv_vertex:NS,worldpos_vertex:LS,background_vert:IS,background_frag:US,backgroundCube_vert:FS,backgroundCube_frag:OS,cube_vert:BS,cube_frag:kS,depth_vert:zS,depth_frag:GS,distance_vert:HS,distance_frag:VS,equirect_vert:WS,equirect_frag:XS,linedashed_vert:YS,linedashed_frag:qS,meshbasic_vert:$S,meshbasic_frag:KS,meshlambert_vert:ZS,meshlambert_frag:jS,meshmatcap_vert:JS,meshmatcap_frag:QS,meshnormal_vert:eM,meshnormal_frag:tM,meshphong_vert:nM,meshphong_frag:iM,meshphysical_vert:rM,meshphysical_frag:sM,meshtoon_vert:aM,meshtoon_frag:oM,points_vert:lM,points_frag:cM,shadow_vert:uM,shadow_frag:fM,sprite_vert:hM,sprite_frag:dM},Me={common:{diffuse:{value:new dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new q},probesMax:{value:new q},probesResolution:{value:new q}},points:{diffuse:{value:new dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new dt(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Di={basic:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},specular:{value:new dt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:wn([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:wn([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new dt(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:wn([Me.points,Me.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:wn([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:wn([Me.common,Me.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:wn([Me.sprite,Me.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:wn([Me.common,Me.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:wn([Me.lights,Me.fog,{color:{value:new dt(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Di.physical={uniforms:wn([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new dt(0)},specularColor:{value:new dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const Yo={r:0,b:0,g:0},pM=new Yt,Wm=new $e;Wm.set(-1,0,0,0,1,0,0,0,1);function mM(r,e,t,n,i,s){const a=new dt(0);let o=i===!0?0:1,l,c,u=null,d=0,f=null;function h(b){let w=b.isScene===!0?b.background:null;if(w&&w.isTexture){const S=b.backgroundBlurriness>0;w=e.get(w,S)}return w}function g(b){let w=!1;const S=h(b);S===null?p(a,o):S&&S.isColor&&(p(S,1),w=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(b,w){const S=h(w);S&&(S.isCubeTexture||S.mapping===Ll)?(c===void 0&&(c=new cr(new oo(1,1,1),new bi({name:"BackgroundCubeMaterial",uniforms:ca(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(pM.makeRotationFromEuler(w.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Wm),c.material.toneMapped=ot.getTransfer(S.colorSpace)!==xt,(u!==S||d!==S.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,u=S,d=S.version,f=r.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new cr(new Ul(2,2),new bi({name:"BackgroundMaterial",uniforms:ca(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:Fr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ot.getTransfer(S.colorSpace)!==xt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,f=r.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,w){b.getRGB(Yo,Gm(r)),t.buffers.color.setClear(Yo.r,Yo.g,Yo.b,w,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,w=1){a.set(b),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,p(a,o)},render:g,addToRenderList:_,dispose:m}}function gM(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(L,P,O,G,U){let H=!1;const B=d(L,G,O,P);s!==B&&(s=B,c(s.object)),H=h(L,G,O,U),H&&g(L,G,O,U),U!==null&&e.update(U,r.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(L,P,O,G),U!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return r.createVertexArray()}function c(L){return r.bindVertexArray(L)}function u(L){return r.deleteVertexArray(L)}function d(L,P,O,G){const U=G.wireframe===!0;let H=n[P.id];H===void 0&&(H={},n[P.id]=H);const B=L.isInstancedMesh===!0?L.id:0;let K=H[B];K===void 0&&(K={},H[B]=K);let te=K[O.id];te===void 0&&(te={},K[O.id]=te);let N=te[U];return N===void 0&&(N=f(l()),te[U]=N),N}function f(L){const P=[],O=[],G=[];for(let U=0;U<t;U++)P[U]=0,O[U]=0,G[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:O,attributeDivisors:G,object:L,attributes:{},index:null}}function h(L,P,O,G){const U=s.attributes,H=P.attributes;let B=0;const K=O.getAttributes();for(const te in K)if(K[te].location>=0){const ae=U[te];let de=H[te];if(de===void 0&&(te==="instanceMatrix"&&L.instanceMatrix&&(de=L.instanceMatrix),te==="instanceColor"&&L.instanceColor&&(de=L.instanceColor)),ae===void 0||ae.attribute!==de||de&&ae.data!==de.data)return!0;B++}return s.attributesNum!==B||s.index!==G}function g(L,P,O,G){const U={},H=P.attributes;let B=0;const K=O.getAttributes();for(const te in K)if(K[te].location>=0){let ae=H[te];ae===void 0&&(te==="instanceMatrix"&&L.instanceMatrix&&(ae=L.instanceMatrix),te==="instanceColor"&&L.instanceColor&&(ae=L.instanceColor));const de={};de.attribute=ae,ae&&ae.data&&(de.data=ae.data),U[te]=de,B++}s.attributes=U,s.attributesNum=B,s.index=G}function _(){const L=s.newAttributes;for(let P=0,O=L.length;P<O;P++)L[P]=0}function p(L){m(L,0)}function m(L,P){const O=s.newAttributes,G=s.enabledAttributes,U=s.attributeDivisors;O[L]=1,G[L]===0&&(r.enableVertexAttribArray(L),G[L]=1),U[L]!==P&&(r.vertexAttribDivisor(L,P),U[L]=P)}function b(){const L=s.newAttributes,P=s.enabledAttributes;for(let O=0,G=P.length;O<G;O++)P[O]!==L[O]&&(r.disableVertexAttribArray(O),P[O]=0)}function w(L,P,O,G,U,H,B){B===!0?r.vertexAttribIPointer(L,P,O,U,H):r.vertexAttribPointer(L,P,O,G,U,H)}function S(L,P,O,G){_();const U=G.attributes,H=O.getAttributes(),B=P.defaultAttributeValues;for(const K in H){const te=H[K];if(te.location>=0){let N=U[K];if(N===void 0&&(K==="instanceMatrix"&&L.instanceMatrix&&(N=L.instanceMatrix),K==="instanceColor"&&L.instanceColor&&(N=L.instanceColor)),N!==void 0){const ae=N.normalized,de=N.itemSize,Ve=e.get(N);if(Ve===void 0)continue;const Xe=Ve.buffer,Be=Ve.type,j=Ve.bytesPerElement,le=Be===r.INT||Be===r.UNSIGNED_INT||N.gpuType===Pf;if(N.isInterleavedBufferAttribute){const re=N.data,Re=re.stride,Oe=N.offset;if(re.isInstancedInterleavedBuffer){for(let Te=0;Te<te.locationSize;Te++)m(te.location+Te,re.meshPerAttribute);L.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Te=0;Te<te.locationSize;Te++)p(te.location+Te);r.bindBuffer(r.ARRAY_BUFFER,Xe);for(let Te=0;Te<te.locationSize;Te++)w(te.location+Te,de/te.locationSize,Be,ae,Re*j,(Oe+de/te.locationSize*Te)*j,le)}else{if(N.isInstancedBufferAttribute){for(let re=0;re<te.locationSize;re++)m(te.location+re,N.meshPerAttribute);L.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let re=0;re<te.locationSize;re++)p(te.location+re);r.bindBuffer(r.ARRAY_BUFFER,Xe);for(let re=0;re<te.locationSize;re++)w(te.location+re,de/te.locationSize,Be,ae,de*j,de/te.locationSize*re*j,le)}}else if(B!==void 0){const ae=B[K];if(ae!==void 0)switch(ae.length){case 2:r.vertexAttrib2fv(te.location,ae);break;case 3:r.vertexAttrib3fv(te.location,ae);break;case 4:r.vertexAttrib4fv(te.location,ae);break;default:r.vertexAttrib1fv(te.location,ae)}}}}b()}function E(){y();for(const L in n){const P=n[L];for(const O in P){const G=P[O];for(const U in G){const H=G[U];for(const B in H)u(H[B].object),delete H[B];delete G[U]}}delete n[L]}}function T(L){if(n[L.id]===void 0)return;const P=n[L.id];for(const O in P){const G=P[O];for(const U in G){const H=G[U];for(const B in H)u(H[B].object),delete H[B];delete G[U]}}delete n[L.id]}function A(L){for(const P in n){const O=n[P];for(const G in O){const U=O[G];if(U[L.id]===void 0)continue;const H=U[L.id];for(const B in H)u(H[B].object),delete H[B];delete U[L.id]}}}function v(L){for(const P in n){const O=n[P],G=L.isInstancedMesh===!0?L.id:0,U=O[G];if(U!==void 0){for(const H in U){const B=U[H];for(const K in B)u(B[K].object),delete B[K];delete U[H]}delete O[G],Object.keys(O).length===0&&delete n[P]}}}function y(){C(),a=!0,s!==i&&(s=i,c(s.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:y,resetDefaultState:C,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:p,disableUnusedAttributes:b}}function _M(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(r.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let f=0;for(let h=0;h<u;h++)f+=c[h];t.update(f,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function xM(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==yi&&n.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const v=A===or&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==hi&&n.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ui&&!v)}function l(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(He("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&He("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),b=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),S=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),T=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:b,maxVaryings:w,maxFragmentUniforms:S,maxSamples:E,samples:T}}function vM(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new qr,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||n!==0||i;return i=f,n=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=r.get(d);if(!i||g===null||g.length===0||s&&!p)s?u(null):c();else{const b=s?0:n,w=b*4;let S=m.clippingState||null;l.value=S,S=u(g,f,w,h);for(let E=0;E!==w;++E)S[E]=t[E];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,h,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=h+_*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,S=h;w!==_;++w,S+=4)a.copy(d[w]).applyMatrix4(b,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}const wr=4,ud=[.125,.215,.35,.446,.526,.582],Kr=20,SM=256,Sa=new kf,fd=new dt;let wc=null,Rc=0,Cc=0,Pc=!1;const MM=new q;class hd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=MM}=s;wc=this._renderer.getRenderTarget(),Rc=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=md(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(wc,Rc,Cc),this._renderer.xr.enabled=Pc,e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fs||e.mapping===oa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wc=this._renderer.getRenderTarget(),Rc=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:or,format:yi,colorSpace:bl,depthBuffer:!1},i=dd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dd(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=yM(s)),this._blurMaterial=EM(s,e,t),this._ggxMaterial=bM(s,e,t)}return i}_compileMaterial(e){const t=new cr(new Ei,e);this._renderer.compile(t,Sa)}_sceneToCubeUV(e,t,n,i,s){const l=new Si(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(fd),d.toneMapping=ki,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new cr(new oo,new Om({name:"PMREM.Background",side:zn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,p=_.material;let m=!1;const b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,m=!0):(p.color.copy(fd),m=!0);for(let w=0;w<6;w++){const S=w%3;S===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[w],s.y,s.z)):S===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[w]));const E=this._cubeSize;Os(i,S*E,w>2?E:0,E,E),d.setRenderTarget(i),m&&d.render(_,l),d.render(e,l)}d.toneMapping=h,d.autoClear=f,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===fs||e.mapping===oa;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=md()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pd());const s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Os(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Sa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=0+c*1.25,h=d*f,{_lodMax:g}=this,_=this._sizeLods[n],p=3*_*(n>g-wr?n-g+wr:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=g-t,Os(s,p,m,3*_,2*_),i.setRenderTarget(s),i.render(o,Sa),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,Os(e,p,m,3*_,2*_),i.setRenderTarget(e),i.render(o,Sa)}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ht("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[i];d.material=c;const f=c.uniforms,h=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*Kr-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):Kr;p>Kr&&He(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Kr}`);const m=[];let b=0;for(let A=0;A<Kr;++A){const v=A/_,y=Math.exp(-v*v/2);m.push(y),A===0?b+=y:A<p&&(b+=2*y)}for(let A=0;A<m.length;A++)m[A]=m[A]/b;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-n;const S=this._sizeLods[i],E=3*S*(i>w-wr?i-w+wr:0),T=4*(this._cubeSize-S);Os(t,E,T,3*S,2*S),l.setRenderTarget(t),l.render(d,Sa)}}function yM(r){const e=[],t=[],n=[];let i=r;const s=r-wr+1+ud.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>r-wr?l=ud[a-r+wr-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,_=3,p=2,m=1,b=new Float32Array(_*g*h),w=new Float32Array(p*g*h),S=new Float32Array(m*g*h);for(let T=0;T<h;T++){const A=T%3*2/3-1,v=T>2?0:-1,y=[A,v,0,A+2/3,v,0,A+2/3,v+1,0,A,v,0,A+2/3,v+1,0,A,v+1,0];b.set(y,_*g*T),w.set(f,p*g*T);const C=[T,T,T,T,T,T];S.set(C,m*g*T)}const E=new Ei;E.setAttribute("position",new ni(b,_)),E.setAttribute("uv",new ni(w,p)),E.setAttribute("faceIndex",new ni(S,m)),n.push(new cr(E,null)),i>wr&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function dd(r,e,t){const n=new zi(r,e,t);return n.texture.mapping=Ll,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function bM(r,e,t){return new bi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:SM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:tr,depthTest:!1,depthWrite:!1})}function EM(r,e,t){const n=new Float32Array(Kr),i=new q(0,1,0);return new bi({name:"SphericalGaussianBlur",defines:{n:Kr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:tr,depthTest:!1,depthWrite:!1})}function pd(){return new bi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:tr,depthTest:!1,depthWrite:!1})}function md(){return new bi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function Fl(){return`

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
	`}class Xm extends zi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new km(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new oo(5,5,5),s=new bi({name:"CubemapFromEquirect",uniforms:ca(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zn,blending:tr});s.uniforms.tEquirect.value=t;const a=new cr(i,s),o=t.minFilter;return t.minFilter===Jr&&(t.minFilter=Mn),new Px(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}function TM(r){let e=new WeakMap,t=new WeakMap,n=null;function i(f,h=!1){return f==null?null:h?a(f):s(f)}function s(f){if(f&&f.isTexture){const h=f.mapping;if(h===ec||h===tc)if(e.has(f)){const g=e.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const _=new Xm(g.height);return _.fromEquirectangularTexture(r,f),e.set(f,_),f.addEventListener("dispose",c),o(_.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const h=f.mapping,g=h===ec||h===tc,_=h===fs||h===oa;if(g||_){let p=t.get(f);const m=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return n===null&&(n=new hd(r)),p=g?n.fromEquirectangular(f,p):n.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{const b=f.image;return g&&b&&b.height>0||_&&b&&l(b)?(n===null&&(n=new hd(r)),p=g?n.fromEquirectangular(f):n.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,h){return h===ec?f.mapping=fs:h===tc&&(f.mapping=oa),f}function l(f){let h=0;const g=6;for(let _=0;_<g;_++)f[_]!==void 0&&h++;return h===g}function c(f){const h=f.target;h.removeEventListener("dispose",c);const g=e.get(h);g!==void 0&&(e.delete(h),g.dispose())}function u(f){const h=f.target;h.removeEventListener("dispose",u);const g=t.get(h);g!==void 0&&(t.delete(h),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function AM(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Js("WebGLRenderer: "+n+" extension not supported."),i}}}function wM(r,e,t,n){const i={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const h in f)e.update(f[h],r.ARRAY_BUFFER)}function c(d){const f=[],h=d.index,g=d.attributes.position;let _=0;if(g===void 0)return;if(h!==null){const b=h.array;_=h.version;for(let w=0,S=b.length;w<S;w+=3){const E=b[w+0],T=b[w+1],A=b[w+2];f.push(E,T,T,A,A,E)}}else{const b=g.array;_=g.version;for(let w=0,S=b.length/3-1;w<S;w+=3){const E=w+0,T=w+1,A=w+2;f.push(E,T,T,A,A,E)}}const p=new(g.count>=65535?Um:Im)(f,1);p.version=_;const m=s.get(d);m&&e.remove(m),s.set(d,p)}function u(d){const f=s.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function RM(r,e,t){let n;function i(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,f){r.drawElements(n,f,s,d*a),t.update(f,n,1)}function c(d,f,h){h!==0&&(r.drawElementsInstanced(n,f,s,d*a,h),t.update(f,n,h))}function u(d,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,h);let _=0;for(let p=0;p<h;p++)_+=f[p];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function CM(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:ht("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function PM(r,e,t){const n=new WeakMap,i=new kt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let y=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();const h=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let w=0;h===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let S=o.attributes.position.count*w,E=1;S>e.maxTextureSize&&(E=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const T=new Float32Array(S*E*4*d),A=new Dm(T,S,E,d);A.type=Ui,A.needsUpdate=!0;const v=w*4;for(let C=0;C<d;C++){const L=p[C],P=m[C],O=b[C],G=S*E*4*C;for(let U=0;U<L.count;U++){const H=U*v;h===!0&&(i.fromBufferAttribute(L,U),T[G+H+0]=i.x,T[G+H+1]=i.y,T[G+H+2]=i.z,T[G+H+3]=0),g===!0&&(i.fromBufferAttribute(P,U),T[G+H+4]=i.x,T[G+H+5]=i.y,T[G+H+6]=i.z,T[G+H+7]=0),_===!0&&(i.fromBufferAttribute(O,U),T[G+H+8]=i.x,T[G+H+9]=i.y,T[G+H+10]=i.z,T[G+H+11]=O.itemSize===4?i.w:1)}}f={count:d,texture:A,size:new pt(S,E)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let h=0;for(let _=0;_<c.length;_++)h+=c[_];const g=o.morphTargetsRelative?1:1-h;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function DM(r,e,t,n,i){let s=new WeakMap;function a(c){const u=i.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==u&&(h.update(),s.set(h,u))}return f}function o(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const NM={[mm]:"LINEAR_TONE_MAPPING",[gm]:"REINHARD_TONE_MAPPING",[_m]:"CINEON_TONE_MAPPING",[xm]:"ACES_FILMIC_TONE_MAPPING",[Sm]:"AGX_TONE_MAPPING",[Mm]:"NEUTRAL_TONE_MAPPING",[vm]:"CUSTOM_TONE_MAPPING"};function LM(r,e,t,n,i,s){const a=new zi(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,depthTexture:i?new la(e,t):void 0}),o=new zi(e,t,{type:or,depthBuffer:!1,stencilBuffer:!1}),l=new Ei;l.setAttribute("position",new ir([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ir([0,2,0,0,2,0],2));const c=new wx({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new cr(l,c),d=new kf(-1,1,1,-1,0,1);let f=null,h=null,g=!1,_,p=null,m=[],b=!1;this.setSize=function(w,S){a.setSize(w,S),o.setSize(w,S);for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(w,S)}},this.setEffects=function(w){m=w,b=m.length>0&&m[0].isRenderPass===!0;const S=a.width,E=a.height;for(let T=0;T<m.length;T++){const A=m[T];A.setSize&&A.setSize(S,E)}},this.begin=function(w,S){if(g||w.toneMapping===ki&&m.length===0)return!1;if(p=S,S!==null){const E=S.width,T=S.height;(a.width!==E||a.height!==T)&&this.setSize(E,T)}return b===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=ki,!0},this.hasRenderPass=function(){return b},this.end=function(w,S){w.toneMapping=_,g=!0;let E=a,T=o;for(let A=0;A<m.length;A++){const v=m[A];if(v.enabled!==!1&&(v.render(w,T,E,S),v.needsSwap!==!1)){const y=E;E=T,T=y}}if(f!==w.outputColorSpace||h!==w.toneMapping){f=w.outputColorSpace,h=w.toneMapping,c.defines={},ot.getTransfer(f)===xt&&(c.defines.SRGB_TRANSFER="");const A=NM[h];A&&(c.defines[A]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,w.setRenderTarget(p),w.render(u,d),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Ym=new Nn,ju=new la(1,1),qm=new Dm,$m=new nx,Km=new km,gd=[],_d=[],xd=new Float32Array(16),vd=new Float32Array(9),Sd=new Float32Array(4);function fa(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=gd[i];if(s===void 0&&(s=new Float32Array(i),gd[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function tn(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function nn(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Ol(r,e){let t=_d[e];t===void 0&&(t=new Int32Array(e),_d[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function IM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function UM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2fv(this.addr,e),nn(t,e)}}function FM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;r.uniform3fv(this.addr,e),nn(t,e)}}function OM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4fv(this.addr,e),nn(t,e)}}function BM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Sd.set(n),r.uniformMatrix2fv(this.addr,!1,Sd),nn(t,n)}}function kM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;vd.set(n),r.uniformMatrix3fv(this.addr,!1,vd),nn(t,n)}}function zM(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;xd.set(n),r.uniformMatrix4fv(this.addr,!1,xd),nn(t,n)}}function GM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function HM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2iv(this.addr,e),nn(t,e)}}function VM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;r.uniform3iv(this.addr,e),nn(t,e)}}function WM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4iv(this.addr,e),nn(t,e)}}function XM(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function YM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;r.uniform2uiv(this.addr,e),nn(t,e)}}function qM(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;r.uniform3uiv(this.addr,e),nn(t,e)}}function $M(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;r.uniform4uiv(this.addr,e),nn(t,e)}}function KM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(ju.compareFunction=t.isReversedDepthBuffer()?Of:Ff,s=ju):s=Ym,t.setTexture2D(e||s,i)}function ZM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||$m,i)}function jM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Km,i)}function JM(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||qm,i)}function QM(r){switch(r){case 5126:return IM;case 35664:return UM;case 35665:return FM;case 35666:return OM;case 35674:return BM;case 35675:return kM;case 35676:return zM;case 5124:case 35670:return GM;case 35667:case 35671:return HM;case 35668:case 35672:return VM;case 35669:case 35673:return WM;case 5125:return XM;case 36294:return YM;case 36295:return qM;case 36296:return $M;case 35678:case 36198:case 36298:case 36306:case 35682:return KM;case 35679:case 36299:case 36307:return ZM;case 35680:case 36300:case 36308:case 36293:return jM;case 36289:case 36303:case 36311:case 36292:return JM}}function ey(r,e){r.uniform1fv(this.addr,e)}function ty(r,e){const t=fa(e,this.size,2);r.uniform2fv(this.addr,t)}function ny(r,e){const t=fa(e,this.size,3);r.uniform3fv(this.addr,t)}function iy(r,e){const t=fa(e,this.size,4);r.uniform4fv(this.addr,t)}function ry(r,e){const t=fa(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function sy(r,e){const t=fa(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function ay(r,e){const t=fa(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function oy(r,e){r.uniform1iv(this.addr,e)}function ly(r,e){r.uniform2iv(this.addr,e)}function cy(r,e){r.uniform3iv(this.addr,e)}function uy(r,e){r.uniform4iv(this.addr,e)}function fy(r,e){r.uniform1uiv(this.addr,e)}function hy(r,e){r.uniform2uiv(this.addr,e)}function dy(r,e){r.uniform3uiv(this.addr,e)}function py(r,e){r.uniform4uiv(this.addr,e)}function my(r,e,t){const n=this.cache,i=e.length,s=Ol(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=ju:a=Ym;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function gy(r,e,t){const n=this.cache,i=e.length,s=Ol(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||$m,s[a])}function _y(r,e,t){const n=this.cache,i=e.length,s=Ol(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Km,s[a])}function xy(r,e,t){const n=this.cache,i=e.length,s=Ol(t,i);tn(n,s)||(r.uniform1iv(this.addr,s),nn(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||qm,s[a])}function vy(r){switch(r){case 5126:return ey;case 35664:return ty;case 35665:return ny;case 35666:return iy;case 35674:return ry;case 35675:return sy;case 35676:return ay;case 5124:case 35670:return oy;case 35667:case 35671:return ly;case 35668:case 35672:return cy;case 35669:case 35673:return uy;case 5125:return fy;case 36294:return hy;case 36295:return dy;case 36296:return py;case 35678:case 36198:case 36298:case 36306:case 35682:return my;case 35679:case 36299:case 36307:return gy;case 35680:case 36300:case 36308:case 36293:return _y;case 36289:case 36303:case 36311:case 36292:return xy}}class Sy{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=QM(t.type)}}class My{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vy(t.type)}}class yy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const Dc=/(\w+)(\])?(\[|\.)?/g;function Md(r,e){r.seq.push(e),r.map[e.id]=e}function by(r,e,t){const n=r.name,i=n.length;for(Dc.lastIndex=0;;){const s=Dc.exec(n),a=Dc.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Md(t,c===void 0?new Sy(o,r,e):new My(o,r,e));break}else{let d=t.map[o];d===void 0&&(d=new yy(o),Md(t,d)),t=d}}}class cl{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);by(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function yd(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const Ey=37297;let Ty=0;function Ay(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const bd=new $e;function wy(r){ot._getMatrix(bd,ot.workingColorSpace,r);const e=`mat3( ${bd.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(r)){case El:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Ed(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Ay(r.getShaderSource(e),o)}else return s}function Ry(r,e){const t=wy(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Cy={[mm]:"Linear",[gm]:"Reinhard",[_m]:"Cineon",[xm]:"ACESFilmic",[Sm]:"AgX",[Mm]:"Neutral",[vm]:"Custom"};function Py(r,e){const t=Cy[e];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qo=new q;function Dy(){ot.getLuminanceCoefficients(qo);const r=qo.x.toFixed(4),e=qo.y.toFixed(4),t=qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ny(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Pa).join(`
`)}function Ly(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Iy(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Pa(r){return r!==""}function Td(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ad(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Uy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ju(r){return r.replace(Uy,Oy)}const Fy=new Map;function Oy(r,e){let t=je[e];if(t===void 0){const n=Fy.get(e);if(n!==void 0)t=je[n],He('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ju(t)}const By=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wd(r){return r.replace(By,ky)}function ky(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Rd(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}const zy={[rl]:"SHADOWMAP_TYPE_PCF",[Ca]:"SHADOWMAP_TYPE_VSM"};function Gy(r){return zy[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Hy={[fs]:"ENVMAP_TYPE_CUBE",[oa]:"ENVMAP_TYPE_CUBE",[Ll]:"ENVMAP_TYPE_CUBE_UV"};function Vy(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":Hy[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const Wy={[oa]:"ENVMAP_MODE_REFRACTION"};function Xy(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":Wy[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Yy={[pm]:"ENVMAP_BLENDING_MULTIPLY",[U0]:"ENVMAP_BLENDING_MIX",[F0]:"ENVMAP_BLENDING_ADD"};function qy(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":Yy[r.combine]||"ENVMAP_BLENDING_NONE"}function $y(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ky(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Gy(t),c=Vy(t),u=Xy(t),d=qy(t),f=$y(t),h=Ny(t),g=Ly(s),_=i.createProgram();let p,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Pa).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Pa).join(`
`),m.length>0&&(m+=`
`)):(p=[Rd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pa).join(`
`),m=[Rd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?je.tonemapping_pars_fragment:"",t.toneMapping!==ki?Py("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,Ry("linearToOutputTexel",t.outputColorSpace),Dy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Pa).join(`
`)),a=Ju(a),a=Td(a,t),a=Ad(a,t),o=Ju(o),o=Td(o,t),o=Ad(o,t),a=wd(a),o=wd(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===zh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=b+p+a,S=b+m+o,E=yd(i,i.VERTEX_SHADER,w),T=yd(i,i.FRAGMENT_SHADER,S);i.attachShader(_,E),i.attachShader(_,T),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(L){if(r.debug.checkShaderErrors){const P=i.getProgramInfoLog(_)||"",O=i.getShaderInfoLog(E)||"",G=i.getShaderInfoLog(T)||"",U=P.trim(),H=O.trim(),B=G.trim();let K=!0,te=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(K=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,E,T);else{const N=Ed(i,E,"vertex"),ae=Ed(i,T,"fragment");ht("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+U+`
`+N+`
`+ae)}else U!==""?He("WebGLProgram: Program Info Log:",U):(H===""||B==="")&&(te=!1);te&&(L.diagnostics={runnable:K,programLog:U,vertexShader:{log:H,prefix:p},fragmentShader:{log:B,prefix:m}})}i.deleteShader(E),i.deleteShader(T),v=new cl(i,_),y=Iy(i,_)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(_,Ey)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ty++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let Zy=0;class jy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Jy(e),t.set(e,n)),n}}class Jy{constructor(e){this.id=Zy++,this.code=e,this.usedTimes=0}}function Qy(r){return r===hs||r===Ml||r===yl}function eb(r,e,t,n,i,s){const a=new Nm,o=new jy,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer;let f=n.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,y,C,L,P,O){const G=L.fog,U=P.geometry,H=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,B=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,K=e.get(v.envMap||H,B),te=K&&K.mapping===Ll?K.image.height:null,N=h[v.type];v.precision!==null&&(f=n.getMaxPrecision(v.precision),f!==v.precision&&He("WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const ae=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,de=ae!==void 0?ae.length:0;let Ve=0;U.morphAttributes.position!==void 0&&(Ve=1),U.morphAttributes.normal!==void 0&&(Ve=2),U.morphAttributes.color!==void 0&&(Ve=3);let Xe,Be,j,le;if(N){const ie=Di[N];Xe=ie.vertexShader,Be=ie.fragmentShader}else{Xe=v.vertexShader,Be=v.fragmentShader;const ie=o.getVertexShaderStage(v),Ue=o.getFragmentShaderStage(v);o.update(v,ie,Ue),j=ie.id,le=Ue.id}const re=r.getRenderTarget(),Re=r.state.buffers.depth.getReversed(),Oe=P.isInstancedMesh===!0,Te=P.isBatchedMesh===!0,st=!!v.map,be=!!v.matcap,ke=!!K,We=!!v.aoMap,Ge=!!v.lightMap,Y=!!v.bumpMap&&v.wireframe===!1,ut=!!v.normalMap,vt=!!v.displacementMap,At=!!v.emissiveMap,Ye=!!v.metalnessMap,mt=!!v.roughnessMap,F=v.anisotropy>0,Ft=v.clearcoat>0,ze=v.dispersion>0,R=v.iridescence>0,x=v.sheen>0,z=v.transmission>0,W=F&&!!v.anisotropyMap,Z=Ft&&!!v.clearcoatMap,fe=Ft&&!!v.clearcoatNormalMap,ce=Ft&&!!v.clearcoatRoughnessMap,J=R&&!!v.iridescenceMap,Q=R&&!!v.iridescenceThicknessMap,me=x&&!!v.sheenColorMap,we=x&&!!v.sheenRoughnessMap,ge=!!v.specularMap,pe=!!v.specularColorMap,ue=!!v.specularIntensityMap,De=z&&!!v.transmissionMap,Ie=z&&!!v.thicknessMap,I=!!v.gradientMap,he=!!v.alphaMap,ee=v.alphaTest>0,_e=!!v.alphaHash,xe=!!v.extensions;let ne=ki;v.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ne=r.toneMapping);const se={shaderID:N,shaderType:v.type,shaderName:v.name,vertexShader:Xe,fragmentShader:Be,defines:v.defines,customVertexShaderID:j,customFragmentShaderID:le,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Te,batchingColor:Te&&P._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&P.instanceColor!==null,instancingMorph:Oe&&P.morphTexture!==null,outputColorSpace:re===null?r.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:st,matcap:be,envMap:ke,envMapMode:ke&&K.mapping,envMapCubeUVHeight:te,aoMap:We,lightMap:Ge,bumpMap:Y,normalMap:ut,displacementMap:vt,emissiveMap:At,normalMapObjectSpace:ut&&v.normalMapType===k0,normalMapTangentSpace:ut&&v.normalMapType===Oh,packedNormalMap:ut&&v.normalMapType===Oh&&Qy(v.normalMap.format),metalnessMap:Ye,roughnessMap:mt,anisotropy:F,anisotropyMap:W,clearcoat:Ft,clearcoatMap:Z,clearcoatNormalMap:fe,clearcoatRoughnessMap:ce,dispersion:ze,iridescence:R,iridescenceMap:J,iridescenceThicknessMap:Q,sheen:x,sheenColorMap:me,sheenRoughnessMap:we,specularMap:ge,specularColorMap:pe,specularIntensityMap:ue,transmission:z,transmissionMap:De,thicknessMap:Ie,gradientMap:I,opaque:v.transparent===!1&&v.blending===js&&v.alphaToCoverage===!1,alphaMap:he,alphaTest:ee,alphaHash:_e,combine:v.combine,mapUv:st&&g(v.map.channel),aoMapUv:We&&g(v.aoMap.channel),lightMapUv:Ge&&g(v.lightMap.channel),bumpMapUv:Y&&g(v.bumpMap.channel),normalMapUv:ut&&g(v.normalMap.channel),displacementMapUv:vt&&g(v.displacementMap.channel),emissiveMapUv:At&&g(v.emissiveMap.channel),metalnessMapUv:Ye&&g(v.metalnessMap.channel),roughnessMapUv:mt&&g(v.roughnessMap.channel),anisotropyMapUv:W&&g(v.anisotropyMap.channel),clearcoatMapUv:Z&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:fe&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:we&&g(v.sheenRoughnessMap.channel),specularMapUv:ge&&g(v.specularMap.channel),specularColorMapUv:pe&&g(v.specularColorMap.channel),specularIntensityMapUv:ue&&g(v.specularIntensityMap.channel),transmissionMapUv:De&&g(v.transmissionMap.channel),thicknessMapUv:Ie&&g(v.thicknessMap.channel),alphaMapUv:he&&g(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ut||F),vertexNormals:!!U.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!U.attributes.uv&&(st||he),fog:!!G,useFog:v.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||U.attributes.normal===void 0&&ut===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Re,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:Ve,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:O.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&C.length>0,shadowMapType:r.shadowMap.type,toneMapping:ne,decodeVideoTexture:st&&v.map.isVideoTexture===!0&&ot.getTransfer(v.map.colorSpace)===xt,decodeVideoTextureEmissive:At&&v.emissiveMap.isVideoTexture===!0&&ot.getTransfer(v.emissiveMap.colorSpace)===xt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===ji,flipSided:v.side===zn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:xe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&v.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function p(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)y.push(C),y.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(m(y,v),b(y,v),y.push(r.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function m(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function b(v,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function w(v){const y=h[v.type];let C;if(y){const L=Di[y];C=Ex.clone(L.uniforms)}else C=v.uniforms;return C}function S(v,y){let C=u.get(y);return C!==void 0?++C.usedTimes:(C=new Ky(r,y,v,i),c.push(C),u.set(y,C)),C}function E(v){if(--v.usedTimes===0){const y=c.indexOf(v);c[y]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function A(){o.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:w,acquireProgram:S,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:A}}function tb(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function nb(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Cd(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Pd(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function o(f,h,g,_,p,m){let b=r[e];return b===void 0?(b={id:f.id,object:f,geometry:h,material:g,materialVariant:a(f),groupOrder:_,renderOrder:f.renderOrder,z:p,group:m},r[e]=b):(b.id=f.id,b.object=f,b.geometry=h,b.material=g,b.materialVariant=a(f),b.groupOrder=_,b.renderOrder=f.renderOrder,b.z=p,b.group=m),e++,b}function l(f,h,g,_,p,m){const b=o(f,h,g,_,p,m);g.transmission>0?n.push(b):g.transparent===!0?i.push(b):t.push(b)}function c(f,h,g,_,p,m){const b=o(f,h,g,_,p,m);g.transmission>0?n.unshift(b):g.transparent===!0?i.unshift(b):t.unshift(b)}function u(f,h,g){t.length>1&&t.sort(f||nb),n.length>1&&n.sort(h||Cd),i.length>1&&i.sort(h||Cd),g&&(t.reverse(),n.reverse(),i.reverse())}function d(){for(let f=e,h=r.length;f<h;f++){const g=r[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:d,sort:u}}function ib(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Pd,r.set(n,[a])):i>=s.length?(a=new Pd,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function rb(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new q,color:new dt};break;case"SpotLight":t={position:new q,direction:new q,color:new dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new dt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new dt,groundColor:new dt};break;case"RectAreaLight":t={color:new dt,position:new q,halfWidth:new q,halfHeight:new q};break}return r[e.id]=t,t}}}function sb(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let ab=0;function ob(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function lb(r){const e=new rb,t=sb(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new q);const i=new q,s=new Yt,a=new Yt;function o(c){let u=0,d=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let h=0,g=0,_=0,p=0,m=0,b=0,w=0,S=0,E=0,T=0,A=0;c.sort(ob);for(let y=0,C=c.length;y<C;y++){const L=c[y],P=L.color,O=L.intensity,G=L.distance;let U=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===hs?U=L.shadow.map.texture:U=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=P.r*O,d+=P.g*O,f+=P.b*O;else if(L.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(L.sh.coefficients[H],O);A++}else if(L.isDirectionalLight){const H=e.get(L);if(H.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const B=L.shadow,K=t.get(L);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,n.directionalShadow[h]=K,n.directionalShadowMap[h]=U,n.directionalShadowMatrix[h]=L.shadow.matrix,b++}n.directional[h]=H,h++}else if(L.isSpotLight){const H=e.get(L);H.position.setFromMatrixPosition(L.matrixWorld),H.color.copy(P).multiplyScalar(O),H.distance=G,H.coneCos=Math.cos(L.angle),H.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),H.decay=L.decay,n.spot[_]=H;const B=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,B.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[_]=B.matrix,L.castShadow){const K=t.get(L);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,n.spotShadow[_]=K,n.spotShadowMap[_]=U,S++}_++}else if(L.isRectAreaLight){const H=e.get(L);H.color.copy(P).multiplyScalar(O),H.halfWidth.set(L.width*.5,0,0),H.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=H,p++}else if(L.isPointLight){const H=e.get(L);if(H.color.copy(L.color).multiplyScalar(L.intensity),H.distance=L.distance,H.decay=L.decay,L.castShadow){const B=L.shadow,K=t.get(L);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,K.shadowCameraNear=B.camera.near,K.shadowCameraFar=B.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=U,n.pointShadowMatrix[g]=L.shadow.matrix,w++}n.point[g]=H,g++}else if(L.isHemisphereLight){const H=e.get(L);H.skyColor.copy(L.color).multiplyScalar(O),H.groundColor.copy(L.groundColor).multiplyScalar(O),n.hemi[m]=H,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Me.LTC_FLOAT_1,n.rectAreaLTC2=Me.LTC_FLOAT_2):(n.rectAreaLTC1=Me.LTC_HALF_1,n.rectAreaLTC2=Me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const v=n.hash;(v.directionalLength!==h||v.pointLength!==g||v.spotLength!==_||v.rectAreaLength!==p||v.hemiLength!==m||v.numDirectionalShadows!==b||v.numPointShadows!==w||v.numSpotShadows!==S||v.numSpotMaps!==E||v.numLightProbes!==A)&&(n.directional.length=h,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=S+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,v.directionalLength=h,v.pointLength=g,v.spotLength=_,v.rectAreaLength=p,v.hemiLength=m,v.numDirectionalShadows=b,v.numPointShadows=w,v.numSpotShadows=S,v.numSpotMaps=E,v.numLightProbes=A,n.version=ab++)}function l(c,u){let d=0,f=0,h=0,g=0,_=0;const p=u.matrixWorldInverse;for(let m=0,b=c.length;m<b;m++){const w=c[m];if(w.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),d++}else if(w.isSpotLight){const S=n.spot[h];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),h++}else if(w.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),a.identity(),s.copy(w.matrixWorld),s.premultiply(p),a.extractRotation(s),S.halfWidth.set(w.width*.5,0,0),S.halfHeight.set(0,w.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(p),f++}else if(w.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(w.matrixWorld),S.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:n}}function Dd(r){const e=new lb(r),t=[],n=[],i=[];function s(f){d.camera=f,t.length=0,n.length=0,i.length=0}function a(f){t.push(f)}function o(f){n.push(f)}function l(f){i.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function cb(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Dd(r),e.set(i,[o])):s>=a.length?(o=new Dd(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const ub=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fb=`uniform sampler2D shadow_pass;
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
}`,hb=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],db=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],Nd=new Yt,Ma=new q,Nc=new q;function pb(r,e,t){let n=new Bm;const i=new pt,s=new pt,a=new kt,o=new Rx,l=new Cx,c={},u=t.maxTextureSize,d={[Fr]:zn,[zn]:Fr,[ji]:ji},f=new bi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:ub,fragmentShader:fb}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const g=new Ei;g.setAttribute("position",new ni(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new cr(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rl;let m=this.type;this.render=function(T,A,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===g0&&(He("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=rl);const y=r.getRenderTarget(),C=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),P=r.state;P.setBlending(tr),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const O=m!==this.type;O&&A.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(U=>U.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,U=T.length;G<U;G++){const H=T[G],B=H.shadow;if(B===void 0){He("WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const K=B.getFrameExtents();i.multiply(K),s.copy(B.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/K.x),i.x=s.x*K.x,B.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/K.y),i.y=s.y*K.y,B.mapSize.y=s.y));const te=r.state.buffers.depth.getReversed();if(B.camera._reversedDepth=te,B.map===null||O===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Ca){if(H.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new zi(i.x,i.y,{format:hs,type:or,minFilter:Mn,magFilter:Mn,generateMipmaps:!1}),B.map.texture.name=H.name+".shadowMap",B.map.depthTexture=new la(i.x,i.y,Ui),B.map.depthTexture.name=H.name+".shadowMapDepth",B.map.depthTexture.format=lr,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=fn,B.map.depthTexture.magFilter=fn}else H.isPointLight?(B.map=new Xm(i.x),B.map.depthTexture=new yx(i.x,Hi)):(B.map=new zi(i.x,i.y),B.map.depthTexture=new la(i.x,i.y,Hi)),B.map.depthTexture.name=H.name+".shadowMap",B.map.depthTexture.format=lr,this.type===rl?(B.map.depthTexture.compareFunction=te?Of:Ff,B.map.depthTexture.minFilter=Mn,B.map.depthTexture.magFilter=Mn):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=fn,B.map.depthTexture.magFilter=fn);B.camera.updateProjectionMatrix()}const N=B.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<N;ae++){if(B.map.isWebGLCubeRenderTarget)r.setRenderTarget(B.map,ae),r.clear();else{ae===0&&(r.setRenderTarget(B.map),r.clear());const de=B.getViewport(ae);a.set(s.x*de.x,s.y*de.y,s.x*de.z,s.y*de.w),P.viewport(a)}if(H.isPointLight){const de=B.camera,Ve=B.matrix,Xe=H.distance||de.far;Xe!==de.far&&(de.far=Xe,de.updateProjectionMatrix()),Ma.setFromMatrixPosition(H.matrixWorld),de.position.copy(Ma),Nc.copy(de.position),Nc.add(hb[ae]),de.up.copy(db[ae]),de.lookAt(Nc),de.updateMatrixWorld(),Ve.makeTranslation(-Ma.x,-Ma.y,-Ma.z),Nd.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Nd,de.coordinateSystem,de.reversedDepth)}else B.updateMatrices(H);n=B.getFrustum(),S(A,v,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===Ca&&b(B,v),B.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(y,C,L)};function b(T,A){const v=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,h.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new zi(i.x,i.y,{format:hs,type:or})),f.uniforms.shadow_pass.value=T.map.depthTexture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,r.setRenderTarget(T.mapPass),r.clear(),r.renderBufferDirect(A,null,v,f,_,null),h.uniforms.shadow_pass.value=T.mapPass.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,r.setRenderTarget(T.map),r.clear(),r.renderBufferDirect(A,null,v,h,_,null)}function w(T,A,v,y){let C=null;const L=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)C=L;else if(C=v.isPointLight===!0?l:o,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const P=C.uuid,O=A.uuid;let G=c[P];G===void 0&&(G={},c[P]=G);let U=G[O];U===void 0&&(U=C.clone(),G[O]=U,A.addEventListener("dispose",E)),C=U}if(C.visible=A.visible,C.wireframe=A.wireframe,y===Ca?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:d[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const P=r.properties.get(C);P.light=v}return C}function S(T,A,v,y,C){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===Ca)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);const O=e.update(T),G=T.material;if(Array.isArray(G)){const U=O.groups;for(let H=0,B=U.length;H<B;H++){const K=U[H],te=G[K.materialIndex];if(te&&te.visible){const N=w(T,te,y,C);T.onBeforeShadow(r,T,A,v,O,N,K),r.renderBufferDirect(v,null,O,N,T,K),T.onAfterShadow(r,T,A,v,O,N,K)}}}else if(G.visible){const U=w(T,G,y,C);T.onBeforeShadow(r,T,A,v,O,U,null),r.renderBufferDirect(v,null,O,U,T,null),T.onAfterShadow(r,T,A,v,O,U,null)}}const P=T.children;for(let O=0,G=P.length;O<G;O++)S(P[O],A,v,y,C)}function E(T){T.target.removeEventListener("dispose",E);for(const v in c){const y=c[v],C=T.target.uuid;C in y&&(y[C].dispose(),delete y[C])}}}function mb(r,e){function t(){let I=!1;const he=new kt;let ee=null;const _e=new kt(0,0,0,0);return{setMask:function(xe){ee!==xe&&!I&&(r.colorMask(xe,xe,xe,xe),ee=xe)},setLocked:function(xe){I=xe},setClear:function(xe,ne,se,ie,Ue){Ue===!0&&(xe*=ie,ne*=ie,se*=ie),he.set(xe,ne,se,ie),_e.equals(he)===!1&&(r.clearColor(xe,ne,se,ie),_e.copy(he))},reset:function(){I=!1,ee=null,_e.set(-1,0,0,0)}}}function n(){let I=!1,he=!1,ee=null,_e=null,xe=null;return{setReversed:function(ne){if(he!==ne){const se=e.get("EXT_clip_control");ne?se.clipControlEXT(se.LOWER_LEFT_EXT,se.ZERO_TO_ONE_EXT):se.clipControlEXT(se.LOWER_LEFT_EXT,se.NEGATIVE_ONE_TO_ONE_EXT),he=ne;const ie=xe;xe=null,this.setClear(ie)}},getReversed:function(){return he},setTest:function(ne){ne?re(r.DEPTH_TEST):Re(r.DEPTH_TEST)},setMask:function(ne){ee!==ne&&!I&&(r.depthMask(ne),ee=ne)},setFunc:function(ne){if(he&&(ne=K0[ne]),_e!==ne){switch(ne){case uu:r.depthFunc(r.NEVER);break;case fu:r.depthFunc(r.ALWAYS);break;case hu:r.depthFunc(r.LESS);break;case aa:r.depthFunc(r.LEQUAL);break;case du:r.depthFunc(r.EQUAL);break;case pu:r.depthFunc(r.GEQUAL);break;case mu:r.depthFunc(r.GREATER);break;case gu:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}_e=ne}},setLocked:function(ne){I=ne},setClear:function(ne){xe!==ne&&(xe=ne,he&&(ne=1-ne),r.clearDepth(ne))},reset:function(){I=!1,ee=null,_e=null,xe=null,he=!1}}}function i(){let I=!1,he=null,ee=null,_e=null,xe=null,ne=null,se=null,ie=null,Ue=null;return{setTest:function(oe){I||(oe?re(r.STENCIL_TEST):Re(r.STENCIL_TEST))},setMask:function(oe){he!==oe&&!I&&(r.stencilMask(oe),he=oe)},setFunc:function(oe,Fe,Ce){(ee!==oe||_e!==Fe||xe!==Ce)&&(r.stencilFunc(oe,Fe,Ce),ee=oe,_e=Fe,xe=Ce)},setOp:function(oe,Fe,Ce){(ne!==oe||se!==Fe||ie!==Ce)&&(r.stencilOp(oe,Fe,Ce),ne=oe,se=Fe,ie=Ce)},setLocked:function(oe){I=oe},setClear:function(oe){Ue!==oe&&(r.clearStencil(oe),Ue=oe)},reset:function(){I=!1,he=null,ee=null,_e=null,xe=null,ne=null,se=null,ie=null,Ue=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},d={},f={},h=new WeakMap,g=[],_=null,p=!1,m=null,b=null,w=null,S=null,E=null,T=null,A=null,v=new dt(0,0,0),y=0,C=!1,L=null,P=null,O=null,G=null,U=null;const H=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,K=0;const te=r.getParameter(r.VERSION);te.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(te)[1]),B=K>=1):te.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),B=K>=2);let N=null,ae={};const de=r.getParameter(r.SCISSOR_BOX),Ve=r.getParameter(r.VIEWPORT),Xe=new kt().fromArray(de),Be=new kt().fromArray(Ve);function j(I,he,ee,_e){const xe=new Uint8Array(4),ne=r.createTexture();r.bindTexture(I,ne),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let se=0;se<ee;se++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(he,0,r.RGBA,1,1,_e,0,r.RGBA,r.UNSIGNED_BYTE,xe):r.texImage2D(he+se,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,xe);return ne}const le={};le[r.TEXTURE_2D]=j(r.TEXTURE_2D,r.TEXTURE_2D,1),le[r.TEXTURE_CUBE_MAP]=j(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[r.TEXTURE_2D_ARRAY]=j(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),le[r.TEXTURE_3D]=j(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(r.DEPTH_TEST),a.setFunc(aa),Y(!1),ut(Ih),re(r.CULL_FACE),We(tr);function re(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function Re(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function Oe(I,he){return f[I]!==he?(r.bindFramebuffer(I,he),f[I]=he,I===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=he),I===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=he),!0):!1}function Te(I,he){let ee=g,_e=!1;if(I){ee=h.get(he),ee===void 0&&(ee=[],h.set(he,ee));const xe=I.textures;if(ee.length!==xe.length||ee[0]!==r.COLOR_ATTACHMENT0){for(let ne=0,se=xe.length;ne<se;ne++)ee[ne]=r.COLOR_ATTACHMENT0+ne;ee.length=xe.length,_e=!0}}else ee[0]!==r.BACK&&(ee[0]=r.BACK,_e=!0);_e&&r.drawBuffers(ee)}function st(I){return _!==I?(r.useProgram(I),_=I,!0):!1}const be={[$r]:r.FUNC_ADD,[x0]:r.FUNC_SUBTRACT,[v0]:r.FUNC_REVERSE_SUBTRACT};be[S0]=r.MIN,be[M0]=r.MAX;const ke={[y0]:r.ZERO,[b0]:r.ONE,[E0]:r.SRC_COLOR,[lu]:r.SRC_ALPHA,[P0]:r.SRC_ALPHA_SATURATE,[R0]:r.DST_COLOR,[A0]:r.DST_ALPHA,[T0]:r.ONE_MINUS_SRC_COLOR,[cu]:r.ONE_MINUS_SRC_ALPHA,[C0]:r.ONE_MINUS_DST_COLOR,[w0]:r.ONE_MINUS_DST_ALPHA,[D0]:r.CONSTANT_COLOR,[N0]:r.ONE_MINUS_CONSTANT_COLOR,[L0]:r.CONSTANT_ALPHA,[I0]:r.ONE_MINUS_CONSTANT_ALPHA};function We(I,he,ee,_e,xe,ne,se,ie,Ue,oe){if(I===tr){p===!0&&(Re(r.BLEND),p=!1);return}if(p===!1&&(re(r.BLEND),p=!0),I!==_0){if(I!==m||oe!==C){if((b!==$r||E!==$r)&&(r.blendEquation(r.FUNC_ADD),b=$r,E=$r),oe)switch(I){case js:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ou:r.blendFunc(r.ONE,r.ONE);break;case Uh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Fh:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:ht("WebGLState: Invalid blending: ",I);break}else switch(I){case js:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case ou:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Uh:ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fh:ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ht("WebGLState: Invalid blending: ",I);break}w=null,S=null,T=null,A=null,v.set(0,0,0),y=0,m=I,C=oe}return}xe=xe||he,ne=ne||ee,se=se||_e,(he!==b||xe!==E)&&(r.blendEquationSeparate(be[he],be[xe]),b=he,E=xe),(ee!==w||_e!==S||ne!==T||se!==A)&&(r.blendFuncSeparate(ke[ee],ke[_e],ke[ne],ke[se]),w=ee,S=_e,T=ne,A=se),(ie.equals(v)===!1||Ue!==y)&&(r.blendColor(ie.r,ie.g,ie.b,Ue),v.copy(ie),y=Ue),m=I,C=!1}function Ge(I,he){I.side===ji?Re(r.CULL_FACE):re(r.CULL_FACE);let ee=I.side===zn;he&&(ee=!ee),Y(ee),I.blending===js&&I.transparent===!1?We(tr):We(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const _e=I.stencilWrite;o.setTest(_e),_e&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),At(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):Re(r.SAMPLE_ALPHA_TO_COVERAGE)}function Y(I){L!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),L=I)}function ut(I){I!==p0?(re(r.CULL_FACE),I!==P&&(I===Ih?r.cullFace(r.BACK):I===m0?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Re(r.CULL_FACE),P=I}function vt(I){I!==O&&(B&&r.lineWidth(I),O=I)}function At(I,he,ee){I?(re(r.POLYGON_OFFSET_FILL),(G!==he||U!==ee)&&(G=he,U=ee,a.getReversed()&&(he=-he),r.polygonOffset(he,ee))):Re(r.POLYGON_OFFSET_FILL)}function Ye(I){I?re(r.SCISSOR_TEST):Re(r.SCISSOR_TEST)}function mt(I){I===void 0&&(I=r.TEXTURE0+H-1),N!==I&&(r.activeTexture(I),N=I)}function F(I,he,ee){ee===void 0&&(N===null?ee=r.TEXTURE0+H-1:ee=N);let _e=ae[ee];_e===void 0&&(_e={type:void 0,texture:void 0},ae[ee]=_e),(_e.type!==I||_e.texture!==he)&&(N!==ee&&(r.activeTexture(ee),N=ee),r.bindTexture(I,he||le[I]),_e.type=I,_e.texture=he)}function Ft(){const I=ae[N];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function ze(){try{r.compressedTexImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function R(){try{r.compressedTexImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function x(){try{r.texSubImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function z(){try{r.texSubImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function W(){try{r.compressedTexSubImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function Z(){try{r.compressedTexSubImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function fe(){try{r.texStorage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function ce(){try{r.texStorage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function J(){try{r.texImage2D(...arguments)}catch(I){ht("WebGLState:",I)}}function Q(){try{r.texImage3D(...arguments)}catch(I){ht("WebGLState:",I)}}function me(I){return d[I]!==void 0?d[I]:r.getParameter(I)}function we(I,he){d[I]!==he&&(r.pixelStorei(I,he),d[I]=he)}function ge(I){Xe.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),Xe.copy(I))}function pe(I){Be.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),Be.copy(I))}function ue(I,he){let ee=c.get(he);ee===void 0&&(ee=new WeakMap,c.set(he,ee));let _e=ee.get(I);_e===void 0&&(_e=r.getUniformBlockIndex(he,I.name),ee.set(I,_e))}function De(I,he){const _e=c.get(he).get(I);l.get(he)!==_e&&(r.uniformBlockBinding(he,_e,I.__bindingPointIndex),l.set(he,_e))}function Ie(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,ae={},f={},h=new WeakMap,g=[],_=null,p=!1,m=null,b=null,w=null,S=null,E=null,T=null,A=null,v=new dt(0,0,0),y=0,C=!1,L=null,P=null,O=null,G=null,U=null,Xe.set(0,0,r.canvas.width,r.canvas.height),Be.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:re,disable:Re,bindFramebuffer:Oe,drawBuffers:Te,useProgram:st,setBlending:We,setMaterial:Ge,setFlipSided:Y,setCullFace:ut,setLineWidth:vt,setPolygonOffset:At,setScissorTest:Ye,activeTexture:mt,bindTexture:F,unbindTexture:Ft,compressedTexImage2D:ze,compressedTexImage3D:R,texImage2D:J,texImage3D:Q,pixelStorei:we,getParameter:me,updateUBOMapping:ue,uniformBlockBinding:De,texStorage2D:fe,texStorage3D:ce,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:W,compressedTexSubImage3D:Z,scissor:ge,viewport:pe,reset:Ie}}function gb(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pt,u=new WeakMap,d=new Set;let f;const h=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return g?new OffscreenCanvas(R,x):Al("canvas")}function p(R,x,z){let W=1;const Z=ze(R);if((Z.width>z||Z.height>z)&&(W=z/Math.max(Z.width,Z.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const fe=Math.floor(W*Z.width),ce=Math.floor(W*Z.height);f===void 0&&(f=_(fe,ce));const J=x?_(fe,ce):f;return J.width=fe,J.height=ce,J.getContext("2d").drawImage(R,0,0,fe,ce),He("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+fe+"x"+ce+")."),J}else return"data"in R&&He("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function m(R){return R.generateMipmaps}function b(R){r.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?r.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(R,x,z,W,Z,fe=!1){if(R!==null){if(r[R]!==void 0)return r[R];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ce;W&&(ce=e.get("EXT_texture_norm16"),ce||He("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=x;if(x===r.RED&&(z===r.FLOAT&&(J=r.R32F),z===r.HALF_FLOAT&&(J=r.R16F),z===r.UNSIGNED_BYTE&&(J=r.R8),z===r.UNSIGNED_SHORT&&ce&&(J=ce.R16_EXT),z===r.SHORT&&ce&&(J=ce.R16_SNORM_EXT)),x===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&(J=r.R8UI),z===r.UNSIGNED_SHORT&&(J=r.R16UI),z===r.UNSIGNED_INT&&(J=r.R32UI),z===r.BYTE&&(J=r.R8I),z===r.SHORT&&(J=r.R16I),z===r.INT&&(J=r.R32I)),x===r.RG&&(z===r.FLOAT&&(J=r.RG32F),z===r.HALF_FLOAT&&(J=r.RG16F),z===r.UNSIGNED_BYTE&&(J=r.RG8),z===r.UNSIGNED_SHORT&&ce&&(J=ce.RG16_EXT),z===r.SHORT&&ce&&(J=ce.RG16_SNORM_EXT)),x===r.RG_INTEGER&&(z===r.UNSIGNED_BYTE&&(J=r.RG8UI),z===r.UNSIGNED_SHORT&&(J=r.RG16UI),z===r.UNSIGNED_INT&&(J=r.RG32UI),z===r.BYTE&&(J=r.RG8I),z===r.SHORT&&(J=r.RG16I),z===r.INT&&(J=r.RG32I)),x===r.RGB_INTEGER&&(z===r.UNSIGNED_BYTE&&(J=r.RGB8UI),z===r.UNSIGNED_SHORT&&(J=r.RGB16UI),z===r.UNSIGNED_INT&&(J=r.RGB32UI),z===r.BYTE&&(J=r.RGB8I),z===r.SHORT&&(J=r.RGB16I),z===r.INT&&(J=r.RGB32I)),x===r.RGBA_INTEGER&&(z===r.UNSIGNED_BYTE&&(J=r.RGBA8UI),z===r.UNSIGNED_SHORT&&(J=r.RGBA16UI),z===r.UNSIGNED_INT&&(J=r.RGBA32UI),z===r.BYTE&&(J=r.RGBA8I),z===r.SHORT&&(J=r.RGBA16I),z===r.INT&&(J=r.RGBA32I)),x===r.RGB&&(z===r.UNSIGNED_SHORT&&ce&&(J=ce.RGB16_EXT),z===r.SHORT&&ce&&(J=ce.RGB16_SNORM_EXT),z===r.UNSIGNED_INT_5_9_9_9_REV&&(J=r.RGB9_E5),z===r.UNSIGNED_INT_10F_11F_11F_REV&&(J=r.R11F_G11F_B10F)),x===r.RGBA){const Q=fe?El:ot.getTransfer(Z);z===r.FLOAT&&(J=r.RGBA32F),z===r.HALF_FLOAT&&(J=r.RGBA16F),z===r.UNSIGNED_BYTE&&(J=Q===xt?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT&&ce&&(J=ce.RGBA16_EXT),z===r.SHORT&&ce&&(J=ce.RGBA16_SNORM_EXT),z===r.UNSIGNED_SHORT_4_4_4_4&&(J=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&(J=r.RGB5_A1)}return(J===r.R16F||J===r.R32F||J===r.RG16F||J===r.RG32F||J===r.RGBA16F||J===r.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function E(R,x){let z;return R?x===null||x===Hi||x===to?z=r.DEPTH24_STENCIL8:x===Ui?z=r.DEPTH32F_STENCIL8:x===eo&&(z=r.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Hi||x===to?z=r.DEPTH_COMPONENT24:x===Ui?z=r.DEPTH_COMPONENT32F:x===eo&&(z=r.DEPTH_COMPONENT16),z}function T(R,x){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==fn&&R.minFilter!==Mn?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function A(R){const x=R.target;x.removeEventListener("dispose",A),y(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function v(R){const x=R.target;x.removeEventListener("dispose",v),L(x)}function y(R){const x=n.get(R);if(x.__webglInit===void 0)return;const z=R.source,W=h.get(z);if(W){const Z=W[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(R),Object.keys(W).length===0&&h.delete(z)}n.remove(R)}function C(R){const x=n.get(R);r.deleteTexture(x.__webglTexture);const z=R.source,W=h.get(z);delete W[x.__cacheKey],a.memory.textures--}function L(R){const x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let Z=0;Z<x.__webglFramebuffer[W].length;Z++)r.deleteFramebuffer(x.__webglFramebuffer[W][Z]);else r.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)r.deleteFramebuffer(x.__webglFramebuffer[W]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const z=R.textures;for(let W=0,Z=z.length;W<Z;W++){const fe=n.get(z[W]);fe.__webglTexture&&(r.deleteTexture(fe.__webglTexture),a.memory.textures--),n.remove(z[W])}n.remove(R)}let P=0;function O(){P=0}function G(){return P}function U(R){P=R}function H(){const R=P;return R>=i.maxTextures&&He("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),P+=1,R}function B(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function K(R,x){const z=n.get(R);if(R.isVideoTexture&&F(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const W=R.image;if(W===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{Re(z,R,x);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+x)}function te(R,x){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){Re(z,R,x);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+x)}function N(R,x){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){Re(z,R,x);return}t.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+x)}function ae(R,x){const z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Oe(z,R,x);return}t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+x)}const de={[_u]:r.REPEAT,[Qi]:r.CLAMP_TO_EDGE,[xu]:r.MIRRORED_REPEAT},Ve={[fn]:r.NEAREST,[O0]:r.NEAREST_MIPMAP_NEAREST,[bo]:r.NEAREST_MIPMAP_LINEAR,[Mn]:r.LINEAR,[nc]:r.LINEAR_MIPMAP_NEAREST,[Jr]:r.LINEAR_MIPMAP_LINEAR},Xe={[z0]:r.NEVER,[X0]:r.ALWAYS,[G0]:r.LESS,[Ff]:r.LEQUAL,[H0]:r.EQUAL,[Of]:r.GEQUAL,[V0]:r.GREATER,[W0]:r.NOTEQUAL};function Be(R,x){if(x.type===Ui&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Mn||x.magFilter===nc||x.magFilter===bo||x.magFilter===Jr||x.minFilter===Mn||x.minFilter===nc||x.minFilter===bo||x.minFilter===Jr)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(R,r.TEXTURE_WRAP_S,de[x.wrapS]),r.texParameteri(R,r.TEXTURE_WRAP_T,de[x.wrapT]),(R===r.TEXTURE_3D||R===r.TEXTURE_2D_ARRAY)&&r.texParameteri(R,r.TEXTURE_WRAP_R,de[x.wrapR]),r.texParameteri(R,r.TEXTURE_MAG_FILTER,Ve[x.magFilter]),r.texParameteri(R,r.TEXTURE_MIN_FILTER,Ve[x.minFilter]),x.compareFunction&&(r.texParameteri(R,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(R,r.TEXTURE_COMPARE_FUNC,Xe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===fn||x.minFilter!==bo&&x.minFilter!==Jr||x.type===Ui&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");r.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function j(R,x){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",A));const W=x.source;let Z=h.get(W);Z===void 0&&(Z={},h.set(W,Z));const fe=B(x);if(fe!==R.__cacheKey){Z[fe]===void 0&&(Z[fe]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Z[fe].usedTimes++;const ce=Z[R.__cacheKey];ce!==void 0&&(Z[R.__cacheKey].usedTimes--,ce.usedTimes===0&&C(x)),R.__cacheKey=fe,R.__webglTexture=Z[fe].texture}return z}function le(R,x,z){return Math.floor(Math.floor(R/z)/x)}function re(R,x,z,W){const fe=R.updateRanges;if(fe.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,x.width,x.height,z,W,x.data);else{fe.sort((we,ge)=>we.start-ge.start);let ce=0;for(let we=1;we<fe.length;we++){const ge=fe[ce],pe=fe[we],ue=ge.start+ge.count,De=le(pe.start,x.width,4),Ie=le(ge.start,x.width,4);pe.start<=ue+1&&De===Ie&&le(pe.start+pe.count-1,x.width,4)===De?ge.count=Math.max(ge.count,pe.start+pe.count-ge.start):(++ce,fe[ce]=pe)}fe.length=ce+1;const J=t.getParameter(r.UNPACK_ROW_LENGTH),Q=t.getParameter(r.UNPACK_SKIP_PIXELS),me=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,x.width);for(let we=0,ge=fe.length;we<ge;we++){const pe=fe[we],ue=Math.floor(pe.start/4),De=Math.ceil(pe.count/4),Ie=ue%x.width,I=Math.floor(ue/x.width),he=De,ee=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,Ie),t.pixelStorei(r.UNPACK_SKIP_ROWS,I),t.texSubImage2D(r.TEXTURE_2D,0,Ie,I,he,ee,z,W,x.data)}R.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,J),t.pixelStorei(r.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(r.UNPACK_SKIP_ROWS,me)}}function Re(R,x,z){let W=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=r.TEXTURE_3D);const Z=j(R,x),fe=x.source;t.bindTexture(W,R.__webglTexture,r.TEXTURE0+z);const ce=n.get(fe);if(fe.version!==ce.__version||Z===!0){if(t.activeTexture(r.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const ee=ot.getPrimaries(ot.workingColorSpace),_e=x.colorSpace===Mr?null:ot.getPrimaries(x.colorSpace),xe=x.colorSpace===Mr||ee===_e?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=p(x.image,!1,i.maxTextureSize);Q=Ft(x,Q);const me=s.convert(x.format,x.colorSpace),we=s.convert(x.type);let ge=S(x.internalFormat,me,we,x.normalized,x.colorSpace,x.isVideoTexture);Be(W,x);let pe;const ue=x.mipmaps,De=x.isVideoTexture!==!0,Ie=ce.__version===void 0||Z===!0,I=fe.dataReady,he=T(x,Q);if(x.isDepthTexture)ge=E(x.format===Qr,x.type),Ie&&(De?t.texStorage2D(r.TEXTURE_2D,1,ge,Q.width,Q.height):t.texImage2D(r.TEXTURE_2D,0,ge,Q.width,Q.height,0,me,we,null));else if(x.isDataTexture)if(ue.length>0){De&&Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,ue[0].width,ue[0].height);for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,we,pe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,me,we,pe.data);x.generateMipmaps=!1}else De?(Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,Q.width,Q.height),I&&re(x,Q,me,we)):t.texImage2D(r.TEXTURE_2D,0,ge,Q.width,Q.height,0,me,we,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&Ie&&t.texStorage3D(r.TEXTURE_2D_ARRAY,he,ge,ue[0].width,ue[0].height,Q.depth);for(let ee=0,_e=ue.length;ee<_e;ee++)if(pe=ue[ee],x.format!==yi)if(me!==null)if(De){if(I)if(x.layerUpdates.size>0){const xe=cd(pe.width,pe.height,x.format,x.type);for(const ne of x.layerUpdates){const se=pe.data.subarray(ne*xe/pe.data.BYTES_PER_ELEMENT,(ne+1)*xe/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,ne,pe.width,pe.height,1,me,se)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,pe.width,pe.height,Q.depth,me,pe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ee,ge,pe.width,pe.height,Q.depth,0,pe.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?I&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,pe.width,pe.height,Q.depth,me,we,pe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ee,ge,pe.width,pe.height,Q.depth,0,me,we,pe.data)}else{De&&Ie&&t.texStorage2D(r.TEXTURE_2D,he,ge,ue[0].width,ue[0].height);for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],x.format!==yi?me!==null?De?I&&t.compressedTexSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,pe.data):t.compressedTexImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,pe.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,pe.width,pe.height,me,we,pe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,pe.width,pe.height,0,me,we,pe.data)}else if(x.isDataArrayTexture)if(De){if(Ie&&t.texStorage3D(r.TEXTURE_2D_ARRAY,he,ge,Q.width,Q.height,Q.depth),I)if(x.layerUpdates.size>0){const ee=cd(Q.width,Q.height,x.format,x.type);for(const _e of x.layerUpdates){const xe=Q.data.subarray(_e*ee/Q.data.BYTES_PER_ELEMENT,(_e+1)*ee/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,_e,Q.width,Q.height,1,me,we,xe)}x.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,me,we,Q.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ge,Q.width,Q.height,Q.depth,0,me,we,Q.data);else if(x.isData3DTexture)De?(Ie&&t.texStorage3D(r.TEXTURE_3D,he,ge,Q.width,Q.height,Q.depth),I&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,me,we,Q.data)):t.texImage3D(r.TEXTURE_3D,0,ge,Q.width,Q.height,Q.depth,0,me,we,Q.data);else if(x.isFramebufferTexture){if(Ie)if(De)t.texStorage2D(r.TEXTURE_2D,he,ge,Q.width,Q.height);else{let ee=Q.width,_e=Q.height;for(let xe=0;xe<he;xe++)t.texImage2D(r.TEXTURE_2D,xe,ge,ee,_e,0,me,we,null),ee>>=1,_e>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in r){const ee=r.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),Q.parentNode!==ee){ee.appendChild(Q),d.add(x),ee.onpaint=_e=>{const xe=_e.changedElements;for(const ne of d)xe.includes(ne.image)&&(ne.needsUpdate=!0)},ee.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,Q);else{const xe=r.RGBA,ne=r.RGBA,se=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,xe,ne,se,Q)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(ue.length>0){if(De&&Ie){const ee=ze(ue[0]);t.texStorage2D(r.TEXTURE_2D,he,ge,ee.width,ee.height)}for(let ee=0,_e=ue.length;ee<_e;ee++)pe=ue[ee],De?I&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,me,we,pe):t.texImage2D(r.TEXTURE_2D,ee,ge,me,we,pe);x.generateMipmaps=!1}else if(De){if(Ie){const ee=ze(Q);t.texStorage2D(r.TEXTURE_2D,he,ge,ee.width,ee.height)}I&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,me,we,Q)}else t.texImage2D(r.TEXTURE_2D,0,ge,me,we,Q);m(x)&&b(W),ce.__version=fe.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Oe(R,x,z){if(x.image.length!==6)return;const W=j(R,x),Z=x.source;t.bindTexture(r.TEXTURE_CUBE_MAP,R.__webglTexture,r.TEXTURE0+z);const fe=n.get(Z);if(Z.version!==fe.__version||W===!0){t.activeTexture(r.TEXTURE0+z);const ce=ot.getPrimaries(ot.workingColorSpace),J=x.colorSpace===Mr?null:ot.getPrimaries(x.colorSpace),Q=x.colorSpace===Mr||ce===J?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const me=x.isCompressedTexture||x.image[0].isCompressedTexture,we=x.image[0]&&x.image[0].isDataTexture,ge=[];for(let ne=0;ne<6;ne++)!me&&!we?ge[ne]=p(x.image[ne],!0,i.maxCubemapSize):ge[ne]=we?x.image[ne].image:x.image[ne],ge[ne]=Ft(x,ge[ne]);const pe=ge[0],ue=s.convert(x.format,x.colorSpace),De=s.convert(x.type),Ie=S(x.internalFormat,ue,De,x.normalized,x.colorSpace),I=x.isVideoTexture!==!0,he=fe.__version===void 0||W===!0,ee=Z.dataReady;let _e=T(x,pe);Be(r.TEXTURE_CUBE_MAP,x);let xe;if(me){I&&he&&t.texStorage2D(r.TEXTURE_CUBE_MAP,_e,Ie,pe.width,pe.height);for(let ne=0;ne<6;ne++){xe=ge[ne].mipmaps;for(let se=0;se<xe.length;se++){const ie=xe[se];x.format!==yi?ue!==null?I?ee&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,0,0,ie.width,ie.height,ue,ie.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,Ie,ie.width,ie.height,0,ie.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,0,0,ie.width,ie.height,ue,De,ie.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se,Ie,ie.width,ie.height,0,ue,De,ie.data)}}}else{if(xe=x.mipmaps,I&&he){xe.length>0&&_e++;const ne=ze(ge[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,_e,Ie,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(we){I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ge[ne].width,ge[ne].height,ue,De,ge[ne].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ie,ge[ne].width,ge[ne].height,0,ue,De,ge[ne].data);for(let se=0;se<xe.length;se++){const Ue=xe[se].image[ne].image;I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,0,0,Ue.width,Ue.height,ue,De,Ue.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,Ie,Ue.width,Ue.height,0,ue,De,Ue.data)}}else{I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ue,De,ge[ne]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ie,ue,De,ge[ne]);for(let se=0;se<xe.length;se++){const ie=xe[se];I?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,0,0,ue,De,ie.image[ne]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ne,se+1,Ie,ue,De,ie.image[ne])}}}m(x)&&b(r.TEXTURE_CUBE_MAP),fe.__version=Z.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Te(R,x,z,W,Z,fe){const ce=s.convert(z.format,z.colorSpace),J=s.convert(z.type),Q=S(z.internalFormat,ce,J,z.normalized,z.colorSpace),me=n.get(x),we=n.get(z);if(we.__renderTarget=x,!me.__hasExternalTextures){const ge=Math.max(1,x.width>>fe),pe=Math.max(1,x.height>>fe);Z===r.TEXTURE_3D||Z===r.TEXTURE_2D_ARRAY?t.texImage3D(Z,fe,Q,ge,pe,x.depth,0,ce,J,null):t.texImage2D(Z,fe,Q,ge,pe,0,ce,J,null)}t.bindFramebuffer(r.FRAMEBUFFER,R),mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,W,Z,we.__webglTexture,0,Ye(x)):(Z===r.TEXTURE_2D||Z>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,W,Z,we.__webglTexture,fe),t.bindFramebuffer(r.FRAMEBUFFER,null)}function st(R,x,z){if(r.bindRenderbuffer(r.RENDERBUFFER,R),x.depthBuffer){const W=x.depthTexture,Z=W&&W.isDepthTexture?W.type:null,fe=E(x.stencilBuffer,Z),ce=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;mt(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ye(x),fe,x.width,x.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ye(x),fe,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,fe,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ce,r.RENDERBUFFER,R)}else{const W=x.textures;for(let Z=0;Z<W.length;Z++){const fe=W[Z],ce=s.convert(fe.format,fe.colorSpace),J=s.convert(fe.type),Q=S(fe.internalFormat,ce,J,fe.normalized,fe.colorSpace);mt(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ye(x),Q,x.width,x.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ye(x),Q,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,Q,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function be(R,x,z){const W=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=n.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",A)),Z.__webglTexture===void 0){Z.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture),Be(r.TEXTURE_CUBE_MAP,x.depthTexture);const me=s.convert(x.depthTexture.format),we=s.convert(x.depthTexture.type);let ge;x.depthTexture.format===lr?ge=r.DEPTH_COMPONENT24:x.depthTexture.format===Qr&&(ge=r.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ge,x.width,x.height,0,me,we,null)}}else K(x.depthTexture,0);const fe=Z.__webglTexture,ce=Ye(x),J=W?r.TEXTURE_CUBE_MAP_POSITIVE_X+z:r.TEXTURE_2D,Q=x.depthTexture.format===Qr?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(x.depthTexture.format===lr)mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Q,J,fe,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,Q,J,fe,0);else if(x.depthTexture.format===Qr)mt(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Q,J,fe,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,Q,J,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(R){const x=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const W=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",Z)};W.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=W}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let W=0;W<6;W++)be(x.__webglFramebuffer[W],R,W);else{const W=R.texture.mipmaps;W&&W.length>0?be(x.__webglFramebuffer[0],R,0):be(x.__webglFramebuffer,R,0)}else if(z){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=r.createRenderbuffer(),st(x.__webglDepthbuffer[W],R,!1);else{const Z=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=x.__webglDepthbuffer[W];r.bindRenderbuffer(r.RENDERBUFFER,fe),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,fe)}}else{const W=R.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),st(x.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,fe),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,fe)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function We(R,x,z){const W=n.get(R);x!==void 0&&Te(W.__webglFramebuffer,R,R.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&ke(R)}function Ge(R){const x=R.texture,z=n.get(R),W=n.get(x);R.addEventListener("dispose",v);const Z=R.textures,fe=R.isWebGLCubeRenderTarget===!0,ce=Z.length>1;if(ce||(W.__webglTexture===void 0&&(W.__webglTexture=r.createTexture()),W.__version=x.version,a.memory.textures++),fe){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let Q=0;Q<x.mipmaps.length;Q++)z.__webglFramebuffer[J][Q]=r.createFramebuffer()}else z.__webglFramebuffer[J]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<x.mipmaps.length;J++)z.__webglFramebuffer[J]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(ce)for(let J=0,Q=Z.length;J<Q;J++){const me=n.get(Z[J]);me.__webglTexture===void 0&&(me.__webglTexture=r.createTexture(),a.memory.textures++)}if(R.samples>0&&mt(R)===!1){z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){const Q=Z[J];z.__webglColorRenderbuffer[J]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[J]);const me=s.convert(Q.format,Q.colorSpace),we=s.convert(Q.type),ge=S(Q.internalFormat,me,we,Q.normalized,Q.colorSpace,R.isXRRenderTarget===!0),pe=Ye(R);r.renderbufferStorageMultisample(r.RENDERBUFFER,pe,ge,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+J,r.RENDERBUFFER,z.__webglColorRenderbuffer[J])}r.bindRenderbuffer(r.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),st(z.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(fe){t.bindTexture(r.TEXTURE_CUBE_MAP,W.__webglTexture),Be(r.TEXTURE_CUBE_MAP,x);for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)Te(z.__webglFramebuffer[J][Q],R,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Q);else Te(z.__webglFramebuffer[J],R,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);m(x)&&b(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let J=0,Q=Z.length;J<Q;J++){const me=Z[J],we=n.get(me);let ge=r.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ge,we.__webglTexture),Be(ge,me),Te(z.__webglFramebuffer,R,me,r.COLOR_ATTACHMENT0+J,ge,0),m(me)&&b(ge)}t.unbindTexture()}else{let J=r.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(J,W.__webglTexture),Be(J,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)Te(z.__webglFramebuffer[Q],R,x,r.COLOR_ATTACHMENT0,J,Q);else Te(z.__webglFramebuffer,R,x,r.COLOR_ATTACHMENT0,J,0);m(x)&&b(J),t.unbindTexture()}R.depthBuffer&&ke(R)}function Y(R){const x=R.textures;for(let z=0,W=x.length;z<W;z++){const Z=x[z];if(m(Z)){const fe=w(R),ce=n.get(Z).__webglTexture;t.bindTexture(fe,ce),b(fe),t.unbindTexture()}}}const ut=[],vt=[];function At(R){if(R.samples>0){if(mt(R)===!1){const x=R.textures,z=R.width,W=R.height;let Z=r.COLOR_BUFFER_BIT;const fe=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=n.get(R),J=x.length>1;if(J)for(let me=0;me<x.length;me++)t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const Q=R.texture.mipmaps;Q&&Q.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let me=0;me<x.length;me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=r.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=r.STENCIL_BUFFER_BIT)),J){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);const we=n.get(x[me]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,we,0)}r.blitFramebuffer(0,0,z,W,0,0,z,W,Z,r.NEAREST),l===!0&&(ut.length=0,vt.length=0,ut.push(r.COLOR_ATTACHMENT0+me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ut.push(fe),vt.push(fe),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,vt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),J)for(let me=0;me<x.length;me++){t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);const we=n.get(x[me]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.TEXTURE_2D,we,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const x=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function Ye(R){return Math.min(i.maxSamples,R.samples)}function mt(R){const x=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function F(R){const x=a.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Ft(R,x){const z=R.colorSpace,W=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==bl&&z!==Mr&&(ot.getTransfer(z)===xt?(W!==yi||Z!==hi)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ht("WebGLTextures: Unsupported texture color space:",z)),x}function ze(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=O,this.getTextureUnits=G,this.setTextureUnits=U,this.setTexture2D=K,this.setTexture2DArray=te,this.setTexture3D=N,this.setTextureCube=ae,this.rebindTextures=We,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=Y,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function _b(r,e){function t(n,i=Mr){let s;const a=ot.getTransfer(i);if(n===hi)return r.UNSIGNED_BYTE;if(n===Df)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Nf)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Tm)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Am)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===bm)return r.BYTE;if(n===Em)return r.SHORT;if(n===eo)return r.UNSIGNED_SHORT;if(n===Pf)return r.INT;if(n===Hi)return r.UNSIGNED_INT;if(n===Ui)return r.FLOAT;if(n===or)return r.HALF_FLOAT;if(n===wm)return r.ALPHA;if(n===Rm)return r.RGB;if(n===yi)return r.RGBA;if(n===lr)return r.DEPTH_COMPONENT;if(n===Qr)return r.DEPTH_STENCIL;if(n===Cm)return r.RED;if(n===Lf)return r.RED_INTEGER;if(n===hs)return r.RG;if(n===If)return r.RG_INTEGER;if(n===Uf)return r.RGBA_INTEGER;if(n===sl||n===al||n===ol||n===ll)if(a===xt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===sl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===al)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ll)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===sl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===al)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ol)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ll)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vu||n===Su||n===Mu||n===yu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===vu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Su)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Mu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===yu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===bu||n===Eu||n===Tu||n===Au||n===wu||n===Ml||n===Ru)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===bu||n===Eu)return a===xt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Tu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Au)return s.COMPRESSED_R11_EAC;if(n===wu)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Ml)return s.COMPRESSED_RG11_EAC;if(n===Ru)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Cu||n===Pu||n===Du||n===Nu||n===Lu||n===Iu||n===Uu||n===Fu||n===Ou||n===Bu||n===ku||n===zu||n===Gu||n===Hu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Cu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Pu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Du)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Nu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Lu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Iu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Uu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ou)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ku)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Gu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Hu)return a===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vu||n===Wu||n===Xu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Vu)return a===xt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Xu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Yu||n===qu||n===yl||n===$u)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Yu)return s.COMPRESSED_RED_RGTC1_EXT;if(n===qu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===$u)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===to?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const xb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vb=`
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

}`;class Sb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new zm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new bi({vertexShader:xb,fragmentShader:vb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new cr(new Ul(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Mb extends gs{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,g=null;const _=typeof XRWebGLBinding<"u",p=new Sb,m={},b=t.getContextAttributes();let w=null,S=null;const E=[],T=[],A=new pt;let v=null;const y=new Si;y.viewport=new kt;const C=new Si;C.viewport=new kt;const L=[y,C],P=new Dx;let O=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let le=E[j];return le===void 0&&(le=new uc,E[j]=le),le.getTargetRaySpace()},this.getControllerGrip=function(j){let le=E[j];return le===void 0&&(le=new uc,E[j]=le),le.getGripSpace()},this.getHand=function(j){let le=E[j];return le===void 0&&(le=new uc,E[j]=le),le.getHandSpace()};function U(j){const le=T.indexOf(j.inputSource);if(le===-1)return;const re=E[le];re!==void 0&&(re.update(j.inputSource,j.frame,c||a),re.dispatchEvent({type:j.type,data:j.inputSource}))}function H(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",B);for(let j=0;j<E.length;j++){const le=T[j];le!==null&&(T[j]=null,E[j].disconnect(le))}O=null,G=null,p.reset();for(const j in m)delete m[j];e.setRenderTarget(w),h=null,f=null,d=null,i=null,S=null,Be.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,n.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",H),i.addEventListener("inputsourceschange",B),b.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,Re=null,Oe=null;b.depth&&(Oe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=b.stencil?Qr:lr,Re=b.stencil?to:Hi);const Te={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(Te),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new zi(f.textureWidth,f.textureHeight,{format:yi,type:hi,depthTexture:new la(f.textureWidth,f.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const re={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new zi(h.framebufferWidth,h.framebufferHeight,{format:yi,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Be.setContext(i),Be.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function B(j){for(let le=0;le<j.removed.length;le++){const re=j.removed[le],Re=T.indexOf(re);Re>=0&&(T[Re]=null,E[Re].disconnect(re))}for(let le=0;le<j.added.length;le++){const re=j.added[le];let Re=T.indexOf(re);if(Re===-1){for(let Te=0;Te<E.length;Te++)if(Te>=T.length){T.push(re),Re=Te;break}else if(T[Te]===null){T[Te]=re,Re=Te;break}if(Re===-1)break}const Oe=E[Re];Oe&&Oe.connect(re)}}const K=new q,te=new q;function N(j,le,re){K.setFromMatrixPosition(le.matrixWorld),te.setFromMatrixPosition(re.matrixWorld);const Re=K.distanceTo(te),Oe=le.projectionMatrix.elements,Te=re.projectionMatrix.elements,st=Oe[14]/(Oe[10]-1),be=Oe[14]/(Oe[10]+1),ke=(Oe[9]+1)/Oe[5],We=(Oe[9]-1)/Oe[5],Ge=(Oe[8]-1)/Oe[0],Y=(Te[8]+1)/Te[0],ut=st*Ge,vt=st*Y,At=Re/(-Ge+Y),Ye=At*-Ge;if(le.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ye),j.translateZ(At),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Oe[10]===-1)j.projectionMatrix.copy(le.projectionMatrix),j.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const mt=st+At,F=be+At,Ft=ut-Ye,ze=vt+(Re-Ye),R=ke*be/F*mt,x=We*be/F*mt;j.projectionMatrix.makePerspective(Ft,ze,R,x,mt,F),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ae(j,le){le===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(le.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let le=j.near,re=j.far;p.texture!==null&&(p.depthNear>0&&(le=p.depthNear),p.depthFar>0&&(re=p.depthFar)),P.near=C.near=y.near=le,P.far=C.far=y.far=re,(O!==P.near||G!==P.far)&&(i.updateRenderState({depthNear:P.near,depthFar:P.far}),O=P.near,G=P.far),P.layers.mask=j.layers.mask|6,y.layers.mask=P.layers.mask&-5,C.layers.mask=P.layers.mask&-3;const Re=j.parent,Oe=P.cameras;ae(P,Re);for(let Te=0;Te<Oe.length;Te++)ae(Oe[Te],Re);Oe.length===2?N(P,y,C):P.projectionMatrix.copy(y.projectionMatrix),de(j,P,Re)};function de(j,le,re){re===null?j.matrix.copy(le.matrixWorld):(j.matrix.copy(re.matrixWorld),j.matrix.invert(),j.matrix.multiply(le.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(le.projectionMatrix),j.projectionMatrixInverse.copy(le.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Ku*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(j){l=j,f!==null&&(f.fixedFoveation=j),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(P)},this.getCameraTexture=function(j){return m[j]};let Ve=null;function Xe(j,le){if(u=le.getViewerPose(c||a),g=le,u!==null){const re=u.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let Re=!1;re.length!==P.cameras.length&&(P.cameras.length=0,Re=!0);for(let be=0;be<re.length;be++){const ke=re[be];let We=null;if(h!==null)We=h.getViewport(ke);else{const Y=d.getViewSubImage(f,ke);We=Y.viewport,be===0&&(e.setRenderTargetTextures(S,Y.colorTexture,Y.depthStencilTexture),e.setRenderTarget(S))}let Ge=L[be];Ge===void 0&&(Ge=new Si,Ge.layers.enable(be),Ge.viewport=new kt,L[be]=Ge),Ge.matrix.fromArray(ke.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(ke.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(We.x,We.y,We.width,We.height),be===0&&(P.matrix.copy(Ge.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Re===!0&&P.cameras.push(Ge)}const Oe=i.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const be=d.getDepthInformation(re[0]);be&&be.isValid&&be.texture&&p.init(be,i.renderState)}if(Oe&&Oe.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let be=0;be<re.length;be++){const ke=re[be].camera;if(ke){let We=m[ke];We||(We=new zm,m[ke]=We);const Ge=d.getCameraImage(ke);We.sourceTexture=Ge}}}}for(let re=0;re<E.length;re++){const Re=T[re],Oe=E[re];Re!==null&&Oe!==void 0&&Oe.update(Re,le,c||a)}Ve&&Ve(j,le),le.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:le}),g=null}const Be=new Vm;Be.setAnimationLoop(Xe),this.setAnimationLoop=function(j){Ve=j},this.dispose=function(){}}}const yb=new Yt,Zm=new $e;Zm.set(-1,0,0,0,1,0,0,0,1);function bb(r,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Gm(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,b,w,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),f(p,m),m.isMeshPhysicalMaterial&&h(p,m,S)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),_(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,b,w):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===zn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===zn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const b=e.get(m),w=b.envMap,S=b.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(yb.makeRotationFromEuler(S)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Zm),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function h(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===zn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const b=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Eb(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,E){const T=E.program;n.uniformBlockBinding(S,T)}function c(S,E){let T=i[S.id];T===void 0&&(p(S),T=u(S),i[S.id]=T,S.addEventListener("dispose",b));const A=E.program;n.updateUBOMapping(S,A);const v=e.render.frame;s[S.id]!==v&&(f(S),s[S.id]=v)}function u(S){const E=d();S.__bindingPointIndex=E;const T=r.createBuffer(),A=S.__size,v=S.usage;return r.bindBuffer(r.UNIFORM_BUFFER,T),r.bufferData(r.UNIFORM_BUFFER,A,v),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,E,T),T}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const E=i[S.id],T=S.uniforms,A=S.__cache;r.bindBuffer(r.UNIFORM_BUFFER,E);for(let v=0,y=T.length;v<y;v++){const C=T[v];if(Array.isArray(C))for(let L=0,P=C.length;L<P;L++)h(C[L],v,L,A);else h(C,v,0,A)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function h(S,E,T,A){if(_(S,E,T,A)===!0){const v=S.__offset,y=S.value;if(Array.isArray(y)){let C=0;for(let L=0;L<y.length;L++){const P=y[L],O=m(P);g(P,S.__data,C),typeof P!="number"&&typeof P!="boolean"&&!P.isMatrix3&&!ArrayBuffer.isView(P)&&(C+=O.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(y,S.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,v,S.__data)}}function g(S,E,T){typeof S=="number"||typeof S=="boolean"?E[0]=S:S.isMatrix3?(E[0]=S.elements[0],E[1]=S.elements[1],E[2]=S.elements[2],E[3]=0,E[4]=S.elements[3],E[5]=S.elements[4],E[6]=S.elements[5],E[7]=0,E[8]=S.elements[6],E[9]=S.elements[7],E[10]=S.elements[8],E[11]=0):ArrayBuffer.isView(S)?E.set(new S.constructor(S.buffer,S.byteOffset,E.length)):S.toArray(E,T)}function _(S,E,T,A){const v=S.value,y=E+"_"+T;if(A[y]===void 0)return typeof v=="number"||typeof v=="boolean"?A[y]=v:ArrayBuffer.isView(v)?A[y]=v.slice():A[y]=v.clone(),!0;{const C=A[y];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return A[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function p(S){const E=S.uniforms;let T=0;const A=16;for(let y=0,C=E.length;y<C;y++){const L=Array.isArray(E[y])?E[y]:[E[y]];for(let P=0,O=L.length;P<O;P++){const G=L[P],U=Array.isArray(G.value)?G.value:[G.value];for(let H=0,B=U.length;H<B;H++){const K=U[H],te=m(K),N=T%A,ae=N%te.boundary,de=N+ae;T+=ae,de!==0&&A-de<te.storage&&(T+=A-de),G.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=T,T+=te.storage}}}const v=T%A;return v>0&&(T+=A-v),S.__size=T,S.__cache={},this}function m(S){const E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=48,E.storage=48):S.isMatrix4?(E.boundary=64,E.storage=64):S.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(E.boundary=16,E.storage=S.byteLength):He("WebGLRenderer: Unsupported uniform value type.",S),E}function b(S){const E=S.target;E.removeEventListener("dispose",b);const T=a.indexOf(E.__bindingPointIndex);a.splice(T,1),r.deleteBuffer(i[E.id]),delete i[E.id],delete s[E.id]}function w(){for(const S in i)r.deleteBuffer(i[S]);a=[],i={},s={}}return{bind:l,update:c,dispose:w}}const Tb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ri=null;function Ab(){return Ri===null&&(Ri=new gx(Tb,16,16,hs,or),Ri.name="DFG_LUT",Ri.minFilter=Mn,Ri.magFilter=Mn,Ri.wrapS=Qi,Ri.wrapT=Qi,Ri.generateMipmaps=!1,Ri.needsUpdate=!0),Ri}class wb{constructor(e={}){const{canvas:t=q0(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:h=hi}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=h,p=new Set([Uf,If,Lf]),m=new Set([hi,Hi,eo,to,Df,Nf]),b=new Uint32Array(4),w=new Int32Array(4),S=new q;let E=null,T=null;const A=[],v=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let L=!1,P=null,O=null,G=null,U=null;this._outputColorSpace=ci;let H=0,B=0,K=null,te=-1,N=null;const ae=new kt,de=new kt;let Ve=null;const Xe=new dt(0);let Be=0,j=t.width,le=t.height,re=1,Re=null,Oe=null;const Te=new kt(0,0,j,le),st=new kt(0,0,j,le);let be=!1;const ke=new Bm;let We=!1,Ge=!1;const Y=new Yt,ut=new q,vt=new kt,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function mt(){return K===null?re:1}let F=n;function Ft(M,k){return t.getContext(M,k)}try{const M={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Cf}`),t.addEventListener("webglcontextlost",Ue,!1),t.addEventListener("webglcontextrestored",oe,!1),t.addEventListener("webglcontextcreationerror",Fe,!1),F===null){const k="webgl2";if(F=Ft(k,M),F===null)throw Ft(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw ht("WebGLRenderer: "+M.message),M}let ze,R,x,z,W,Z,fe,ce,J,Q,me,we,ge,pe,ue,De,Ie,I,he,ee,_e,xe,ne;function se(){ze=new AM(F),ze.init(),_e=new _b(F,ze),R=new xM(F,ze,e,_e),x=new mb(F,ze),R.reversedDepthBuffer&&f&&x.buffers.depth.setReversed(!0),O=F.createFramebuffer(),G=F.createFramebuffer(),U=F.createFramebuffer(),z=new CM(F),W=new tb,Z=new gb(F,ze,x,W,R,_e,z),fe=new TM(C),ce=new Lx(F),xe=new gM(F,ce),J=new wM(F,ce,z,xe),Q=new DM(F,J,ce,xe,z),I=new PM(F,R,Z),ue=new vM(W),me=new eb(C,fe,ze,R,xe,ue),we=new bb(C,W),ge=new ib,pe=new cb(ze),Ie=new mM(C,fe,x,Q,g,l),De=new pb(C,Q,R),ne=new Eb(F,z,R,x),he=new _M(F,ze,z),ee=new RM(F,ze,z),z.programs=me.programs,C.capabilities=R,C.extensions=ze,C.properties=W,C.renderLists=ge,C.shadowMap=De,C.state=x,C.info=z}se(),_!==hi&&(y=new LM(_,t.width,t.height,o,i,s));const ie=new Mb(C,F);this.xr=ie,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const M=ze.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=ze.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(M){M!==void 0&&(re=M,this.setSize(j,le,!1))},this.getSize=function(M){return M.set(j,le)},this.setSize=function(M,k,$=!0){if(ie.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}j=M,le=k,t.width=Math.floor(M*re),t.height=Math.floor(k*re),$===!0&&(t.style.width=M+"px",t.style.height=k+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,M,k)},this.getDrawingBufferSize=function(M){return M.set(j*re,le*re).floor()},this.setDrawingBufferSize=function(M,k,$){j=M,le=k,re=$,t.width=Math.floor(M*$),t.height=Math.floor(k*$),this.setViewport(0,0,M,k)},this.setEffects=function(M){if(_===hi){ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let k=0;k<M.length;k++)if(M[k].isOutputPass===!0){He("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ae)},this.getViewport=function(M){return M.copy(Te)},this.setViewport=function(M,k,$,V){M.isVector4?Te.set(M.x,M.y,M.z,M.w):Te.set(M,k,$,V),x.viewport(ae.copy(Te).multiplyScalar(re).round())},this.getScissor=function(M){return M.copy(st)},this.setScissor=function(M,k,$,V){M.isVector4?st.set(M.x,M.y,M.z,M.w):st.set(M,k,$,V),x.scissor(de.copy(st).multiplyScalar(re).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(M){x.setScissorTest(be=M)},this.setOpaqueSort=function(M){Re=M},this.setTransparentSort=function(M){Oe=M},this.getClearColor=function(M){return M.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor(...arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha(...arguments)},this.clear=function(M=!0,k=!0,$=!0){let V=0;if(M){let X=!1;if(K!==null){const ve=K.texture.format;X=p.has(ve)}if(X){const ve=K.texture.type,Se=m.has(ve),ye=Ie.getClearColor(),Pe=Ie.getClearAlpha(),Ne=ye.r,Ze=ye.g,Je=ye.b;Se?(b[0]=Ne,b[1]=Ze,b[2]=Je,b[3]=Pe,F.clearBufferuiv(F.COLOR,0,b)):(w[0]=Ne,w[1]=Ze,w[2]=Je,w[3]=Pe,F.clearBufferiv(F.COLOR,0,w))}else V|=F.COLOR_BUFFER_BIT}k&&(V|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),P=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Ue,!1),t.removeEventListener("webglcontextrestored",oe,!1),t.removeEventListener("webglcontextcreationerror",Fe,!1),Ie.dispose(),ge.dispose(),pe.dispose(),W.dispose(),fe.dispose(),Q.dispose(),xe.dispose(),ne.dispose(),me.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",Pt),ie.removeEventListener("sessionend",Mt),at.stop()};function Ue(M){M.preventDefault(),Hh("WebGLRenderer: Context Lost."),L=!0}function oe(){Hh("WebGLRenderer: Context Restored."),L=!1;const M=z.autoReset,k=De.enabled,$=De.autoUpdate,V=De.needsUpdate,X=De.type;se(),z.autoReset=M,De.enabled=k,De.autoUpdate=$,De.needsUpdate=V,De.type=X}function Fe(M){ht("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ce(M){const k=M.target;k.removeEventListener("dispose",Ce),qe(k)}function qe(M){qt(M),W.remove(M)}function qt(M){const k=W.get(M).programs;k!==void 0&&(k.forEach(function($){me.releaseProgram($)}),M.isShaderMaterial&&me.releaseShaderCache(M))}this.renderBufferDirect=function(M,k,$,V,X,ve){k===null&&(k=At);const Se=X.isMesh&&X.matrixWorld.determinantAffine()<0,ye=sn(M,k,$,V,X);x.setMaterial(V,Se);let Pe=$.index,Ne=1;if(V.wireframe===!0){if(Pe=J.getWireframeAttribute($),Pe===void 0)return;Ne=2}const Ze=$.drawRange,Je=$.attributes.position;let Le=Ze.start*Ne,St=(Ze.start+Ze.count)*Ne;ve!==null&&(Le=Math.max(Le,ve.start*Ne),St=Math.min(St,(ve.start+ve.count)*Ne)),Pe!==null?(Le=Math.max(Le,0),St=Math.min(St,Pe.count)):Je!=null&&(Le=Math.max(Le,0),St=Math.min(St,Je.count));const Ht=St-Le;if(Ht<0||Ht===1/0)return;xe.setup(X,V,ye,$,Pe);let Bt,yt=he;if(Pe!==null&&(Bt=ce.get(Pe),yt=ee,yt.setIndex(Bt)),X.isMesh)V.wireframe===!0?(x.setLineWidth(V.wireframeLinewidth*mt()),yt.setMode(F.LINES)):yt.setMode(F.TRIANGLES);else if(X.isLine){let pn=V.linewidth;pn===void 0&&(pn=1),x.setLineWidth(pn*mt()),X.isLineSegments?yt.setMode(F.LINES):X.isLineLoop?yt.setMode(F.LINE_LOOP):yt.setMode(F.LINE_STRIP)}else X.isPoints?yt.setMode(F.POINTS):X.isSprite&&yt.setMode(F.TRIANGLES);if(X.isBatchedMesh)if(ze.get("WEBGL_multi_draw"))yt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const pn=X._multiDrawStarts,Ee=X._multiDrawCounts,Wn=X._multiDrawCount,ft=Pe?ce.get(Pe).bytesPerElement:1,ai=W.get(V).currentProgram.getUniforms();for(let Ai=0;Ai<Wn;Ai++)ai.setValue(F,"_gl_DrawID",Ai),yt.render(pn[Ai]/ft,Ee[Ai])}else if(X.isInstancedMesh)yt.renderInstances(Le,Ht,X.count);else if($.isInstancedBufferGeometry){const pn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ee=Math.min($.instanceCount,pn);yt.renderInstances(Le,Ht,Ee)}else yt.render(Le,Ht)};function et(M,k,$){M.transparent===!0&&M.side===ji&&M.forceSinglePass===!1?(M.side=zn,M.needsUpdate=!0,Ot(M,k,$),M.side=Fr,M.needsUpdate=!0,Ot(M,k,$),M.side=ji):Ot(M,k,$)}this.compile=function(M,k,$=null){$===null&&($=M),T=pe.get($),T.init(k),v.push(T),$.traverseVisible(function(X){X.isLight&&X.layers.test(k.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),M!==$&&M.traverseVisible(function(X){X.isLight&&X.layers.test(k.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),T.setupLights();const V=new Set;return M.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const ve=X.material;if(ve)if(Array.isArray(ve))for(let Se=0;Se<ve.length;Se++){const ye=ve[Se];et(ye,$,X),V.add(ye)}else et(ve,$,X),V.add(ve)}),T=v.pop(),V},this.compileAsync=function(M,k,$=null){const V=this.compile(M,k,$);return new Promise(X=>{function ve(){if(V.forEach(function(Se){W.get(Se).currentProgram.isReady()&&V.delete(Se)}),V.size===0){X(M);return}setTimeout(ve,10)}ze.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let Ct=null;function rn(M){Ct&&Ct(M)}function Pt(){at.stop()}function Mt(){at.start()}const at=new Vm;at.setAnimationLoop(rn),typeof self<"u"&&at.setContext(self),this.setAnimationLoop=function(M){Ct=M,ie.setAnimationLoop(M),M===null?at.stop():at.start()},ie.addEventListener("sessionstart",Pt),ie.addEventListener("sessionend",Mt),this.render=function(M,k){if(k!==void 0&&k.isCamera!==!0){ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;P!==null&&P.renderStart(M,k);const $=ie.enabled===!0&&ie.isPresenting===!0,V=y!==null&&(K===null||$)&&y.begin(C,K);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(k),k=ie.getCamera()),M.isScene===!0&&M.onBeforeRender(C,M,k,K),T=pe.get(M,v.length),T.init(k),T.state.textureUnits=Z.getTextureUnits(),v.push(T),Y.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ke.setFromProjectionMatrix(Y,Fi,k.reversedDepth),Ge=this.localClippingEnabled,We=ue.init(this.clippingPlanes,Ge),E=ge.get(M,A.length),E.init(),A.push(E),ie.enabled===!0&&ie.isPresenting===!0){const Se=C.xr.getDepthSensingMesh();Se!==null&&bn(Se,k,-1/0,C.sortObjects)}bn(M,k,0,C.sortObjects),E.finish(),C.sortObjects===!0&&E.sort(Re,Oe,k.reversedDepth),Ye=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,Ye&&Ie.addToRenderList(E,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),We===!0&&ue.beginShadows();const X=T.state.shadowsArray;if(De.render(X,M,k),We===!0&&ue.endShadows(),(V&&y.hasRenderPass())===!1){const Se=E.opaque,ye=E.transmissive;if(T.setupLights(),k.isArrayCamera){const Pe=k.cameras;if(ye.length>0)for(let Ne=0,Ze=Pe.length;Ne<Ze;Ne++){const Je=Pe[Ne];dn(Se,ye,M,Je)}Ye&&Ie.render(M);for(let Ne=0,Ze=Pe.length;Ne<Ze;Ne++){const Je=Pe[Ne];wt(E,M,Je,Je.viewport)}}else ye.length>0&&dn(Se,ye,M,k),Ye&&Ie.render(M),wt(E,M,k)}K!==null&&B===0&&(Z.updateMultisampleRenderTarget(K),Z.updateRenderTargetMipmap(K)),V&&y.end(C),M.isScene===!0&&M.onAfterRender(C,M,k),xe.resetDefaultState(),te=-1,N=null,v.pop(),v.length>0?(T=v[v.length-1],Z.setTextureUnits(T.state.textureUnits),We===!0&&ue.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?E=A[A.length-1]:E=null,P!==null&&P.renderEnd()};function bn(M,k,$,V){if(M.visible===!1)return;if(M.layers.test(k.layers)){if(M.isGroup)$=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(k);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||ke.intersectsSprite(M)){V&&vt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Y);const Se=Q.update(M),ye=M.material;ye.visible&&E.push(M,Se,ye,$,vt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||ke.intersectsObject(M))){const Se=Q.update(M),ye=M.material;if(V&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),vt.copy(M.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),vt.copy(Se.boundingSphere.center)),vt.applyMatrix4(M.matrixWorld).applyMatrix4(Y)),Array.isArray(ye)){const Pe=Se.groups;for(let Ne=0,Ze=Pe.length;Ne<Ze;Ne++){const Je=Pe[Ne],Le=ye[Je.materialIndex];Le&&Le.visible&&E.push(M,Se,Le,$,vt.z,Je)}}else ye.visible&&E.push(M,Se,ye,$,vt.z,null)}}const ve=M.children;for(let Se=0,ye=ve.length;Se<ye;Se++)bn(ve[Se],k,$,V)}function wt(M,k,$,V){const{opaque:X,transmissive:ve,transparent:Se}=M;T.setupLightsView($),We===!0&&ue.setGlobalState(C.clippingPlanes,$),V&&x.viewport(ae.copy(V)),X.length>0&&En(X,k,$),ve.length>0&&En(ve,k,$),Se.length>0&&En(Se,k,$),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function dn(M,k,$,V){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){const Le=ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new zi(1,1,{generateMipmaps:!0,type:Le?or:hi,minFilter:Jr,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace})}const ve=T.state.transmissionRenderTarget[V.id],Se=V.viewport||ae;ve.setSize(Se.z*C.transmissionResolutionScale,Se.w*C.transmissionResolutionScale);const ye=C.getRenderTarget(),Pe=C.getActiveCubeFace(),Ne=C.getActiveMipmapLevel();C.setRenderTarget(ve),C.getClearColor(Xe),Be=C.getClearAlpha(),Be<1&&C.setClearColor(16777215,.5),C.clear(),Ye&&Ie.render($);const Ze=C.toneMapping;C.toneMapping=ki;const Je=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),We===!0&&ue.setGlobalState(C.clippingPlanes,V),En(M,$,V),Z.updateMultisampleRenderTarget(ve),Z.updateRenderTargetMipmap(ve),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let St=0,Ht=k.length;St<Ht;St++){const Bt=k[St],{object:yt,geometry:pn,material:Ee,group:Wn}=Bt;if(Ee.side===ji&&yt.layers.test(V.layers)){const ft=Ee.side;Ee.side=zn,Ee.needsUpdate=!0,$t(yt,$,V,pn,Ee,Wn),Ee.side=ft,Ee.needsUpdate=!0,Le=!0}}Le===!0&&(Z.updateMultisampleRenderTarget(ve),Z.updateRenderTargetMipmap(ve))}C.setRenderTarget(ye,Pe,Ne),C.setClearColor(Xe,Be),Je!==void 0&&(V.viewport=Je),C.toneMapping=Ze}function En(M,k,$){const V=k.isScene===!0?k.overrideMaterial:null;for(let X=0,ve=M.length;X<ve;X++){const Se=M[X],{object:ye,geometry:Pe,group:Ne}=Se;let Ze=Se.material;Ze.allowOverride===!0&&V!==null&&(Ze=V),ye.layers.test($.layers)&&$t(ye,k,$,Pe,Ze,Ne)}}function $t(M,k,$,V,X,ve){M.onBeforeRender(C,k,$,V,X,ve),M.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),X.onBeforeRender(C,k,$,V,M,ve),X.transparent===!0&&X.side===ji&&X.forceSinglePass===!1?(X.side=zn,X.needsUpdate=!0,C.renderBufferDirect($,k,V,X,M,ve),X.side=Fr,X.needsUpdate=!0,C.renderBufferDirect($,k,V,X,M,ve),X.side=ji):C.renderBufferDirect($,k,V,X,M,ve),M.onAfterRender(C,k,$,V,X,ve)}function Ot(M,k,$){k.isScene!==!0&&(k=At);const V=W.get(M),X=T.state.lights,ve=T.state.shadowsArray,Se=X.state.version,ye=me.getParameters(M,X.state,ve,k,$,T.state.lightProbeGridArray),Pe=me.getProgramCacheKey(ye);let Ne=V.programs;V.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?k.environment:null,V.fog=k.fog;const Ze=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;V.envMap=fe.get(M.envMap||V.environment,Ze),V.envMapRotation=V.environment!==null&&M.envMap===null?k.environmentRotation:M.envMapRotation,Ne===void 0&&(M.addEventListener("dispose",Ce),Ne=new Map,V.programs=Ne);let Je=Ne.get(Pe);if(Je!==void 0){if(V.currentProgram===Je&&V.lightsStateVersion===Se)return Ti(M,ye),Je}else ye.uniforms=me.getUniforms(M),P!==null&&M.isNodeMaterial&&P.build(M,$,ye),M.onBeforeCompile(ye,C),Je=me.acquireProgram(ye,Pe),Ne.set(Pe,Je),V.uniforms=ye.uniforms;const Le=V.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Le.clippingPlanes=ue.uniform),Ti(M,ye),V.needsLights=si(M),V.lightsStateVersion=Se,V.needsLights&&(Le.ambientLightColor.value=X.state.ambient,Le.lightProbe.value=X.state.probe,Le.directionalLights.value=X.state.directional,Le.directionalLightShadows.value=X.state.directionalShadow,Le.spotLights.value=X.state.spot,Le.spotLightShadows.value=X.state.spotShadow,Le.rectAreaLights.value=X.state.rectArea,Le.ltc_1.value=X.state.rectAreaLTC1,Le.ltc_2.value=X.state.rectAreaLTC2,Le.pointLights.value=X.state.point,Le.pointLightShadows.value=X.state.pointShadow,Le.hemisphereLights.value=X.state.hemi,Le.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Le.spotLightMatrix.value=X.state.spotLightMatrix,Le.spotLightMap.value=X.state.spotLightMap,Le.pointShadowMatrix.value=X.state.pointShadowMatrix),V.lightProbeGrid=T.state.lightProbeGridArray.length>0,V.currentProgram=Je,V.uniformsList=null,Je}function Jt(M){if(M.uniformsList===null){const k=M.currentProgram.getUniforms();M.uniformsList=cl.seqWithValue(k.seq,M.uniforms)}return M.uniformsList}function Ti(M,k){const $=W.get(M);$.outputColorSpace=k.outputColorSpace,$.batching=k.batching,$.batchingColor=k.batchingColor,$.instancing=k.instancing,$.instancingColor=k.instancingColor,$.instancingMorph=k.instancingMorph,$.skinning=k.skinning,$.morphTargets=k.morphTargets,$.morphNormals=k.morphNormals,$.morphColors=k.morphColors,$.morphTargetsCount=k.morphTargetsCount,$.numClippingPlanes=k.numClippingPlanes,$.numIntersection=k.numClipIntersection,$.vertexAlphas=k.vertexAlphas,$.vertexTangents=k.vertexTangents,$.toneMapping=k.toneMapping}function _s(M,k){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;S.setFromMatrixPosition(k.matrixWorld);for(let $=0,V=M.length;$<V;$++){const X=M[$];if(X.texture!==null&&X.boundingBox.containsPoint(S))return X}return null}function sn(M,k,$,V,X){k.isScene!==!0&&(k=At),Z.resetTextureUnits();const ve=k.fog,Se=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?k.environment:null,ye=K===null?C.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ot.workingColorSpace,Pe=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ne=fe.get(V.envMap||Se,Pe),Ze=V.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Je=!!$.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Le=!!$.morphAttributes.position,St=!!$.morphAttributes.normal,Ht=!!$.morphAttributes.color;let Bt=ki;V.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Bt=C.toneMapping);const yt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,pn=yt!==void 0?yt.length:0,Ee=W.get(V),Wn=T.state.lights;if(We===!0&&(Ge===!0||M!==N)){const Rt=M===N&&V.id===te;ue.setState(V,M,Rt)}let ft=!1;V.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==Wn.state.version||Ee.outputColorSpace!==ye||X.isBatchedMesh&&Ee.batching===!1||!X.isBatchedMesh&&Ee.batching===!0||X.isBatchedMesh&&Ee.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ee.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ee.instancing===!1||!X.isInstancedMesh&&Ee.instancing===!0||X.isSkinnedMesh&&Ee.skinning===!1||!X.isSkinnedMesh&&Ee.skinning===!0||X.isInstancedMesh&&Ee.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ee.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ee.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ee.instancingMorph===!1&&X.morphTexture!==null||Ee.envMap!==Ne||V.fog===!0&&Ee.fog!==ve||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==ue.numPlanes||Ee.numIntersection!==ue.numIntersection)||Ee.vertexAlphas!==Ze||Ee.vertexTangents!==Je||Ee.morphTargets!==Le||Ee.morphNormals!==St||Ee.morphColors!==Ht||Ee.toneMapping!==Bt||Ee.morphTargetsCount!==pn||!!Ee.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Ee.__version=V.version);let ai=Ee.currentProgram;ft===!0&&(ai=Ot(V,k,X),P&&V.isNodeMaterial&&P.onUpdateProgram(V,ai,Ee));let Ai=!1,ur=!1,xs=!1;const bt=ai.getUniforms(),Vt=Ee.uniforms;if(x.useProgram(ai.program)&&(Ai=!0,ur=!0,xs=!0),V.id!==te&&(te=V.id,ur=!0),Ee.needsLights){const Rt=_s(T.state.lightProbeGridArray,X);Ee.lightProbeGrid!==Rt&&(Ee.lightProbeGrid=Rt,ur=!0)}if(Ai||N!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),bt.setValue(F,"projectionMatrix",M.projectionMatrix),bt.setValue(F,"viewMatrix",M.matrixWorldInverse);const hr=bt.map.cameraPosition;hr!==void 0&&hr.setValue(F,ut.setFromMatrixPosition(M.matrixWorld)),R.logarithmicDepthBuffer&&bt.setValue(F,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&bt.setValue(F,"isOrthographic",M.isOrthographicCamera===!0),N!==M&&(N=M,ur=!0,xs=!0)}if(Ee.needsLights&&(Wn.state.directionalShadowMap.length>0&&bt.setValue(F,"directionalShadowMap",Wn.state.directionalShadowMap,Z),Wn.state.spotShadowMap.length>0&&bt.setValue(F,"spotShadowMap",Wn.state.spotShadowMap,Z),Wn.state.pointShadowMap.length>0&&bt.setValue(F,"pointShadowMap",Wn.state.pointShadowMap,Z)),X.isSkinnedMesh){bt.setOptional(F,X,"bindMatrix"),bt.setOptional(F,X,"bindMatrixInverse");const Rt=X.skeleton;Rt&&(Rt.boneTexture===null&&Rt.computeBoneTexture(),bt.setValue(F,"boneTexture",Rt.boneTexture,Z))}X.isBatchedMesh&&(bt.setOptional(F,X,"batchingTexture"),bt.setValue(F,"batchingTexture",X._matricesTexture,Z),bt.setOptional(F,X,"batchingIdTexture"),bt.setValue(F,"batchingIdTexture",X._indirectTexture,Z),bt.setOptional(F,X,"batchingColorTexture"),X._colorsTexture!==null&&bt.setValue(F,"batchingColorTexture",X._colorsTexture,Z));const fr=$.morphAttributes;if((fr.position!==void 0||fr.normal!==void 0||fr.color!==void 0)&&I.update(X,$,ai),(ur||Ee.receiveShadow!==X.receiveShadow)&&(Ee.receiveShadow=X.receiveShadow,bt.setValue(F,"receiveShadow",X.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&k.environment!==null&&(Vt.envMapIntensity.value=k.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=Ab()),ur){if(bt.setValue(F,"toneMappingExposure",C.toneMappingExposure),Ee.needsLights&&Gt(Vt,xs),ve&&V.fog===!0&&we.refreshFogUniforms(Vt,ve),we.refreshMaterialUniforms(Vt,V,re,le,T.state.transmissionRenderTarget[M.id]),Ee.needsLights&&Ee.lightProbeGrid){const Rt=Ee.lightProbeGrid;Vt.probesSH.value=Rt.texture,Vt.probesMin.value.copy(Rt.boundingBox.min),Vt.probesMax.value.copy(Rt.boundingBox.max),Vt.probesResolution.value.copy(Rt.resolution)}cl.upload(F,Jt(Ee),Vt,Z)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(cl.upload(F,Jt(Ee),Vt,Z),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&bt.setValue(F,"center",X.center),bt.setValue(F,"modelViewMatrix",X.modelViewMatrix),bt.setValue(F,"normalMatrix",X.normalMatrix),bt.setValue(F,"modelMatrix",X.matrixWorld),V.uniformsGroups!==void 0){const Rt=V.uniformsGroups;for(let hr=0,vs=Rt.length;hr<vs;hr++){const qf=Rt[hr];ne.update(qf,ai),ne.bind(qf,ai)}}return ai}function Gt(M,k){M.ambientLightColor.needsUpdate=k,M.lightProbe.needsUpdate=k,M.directionalLights.needsUpdate=k,M.directionalLightShadows.needsUpdate=k,M.pointLights.needsUpdate=k,M.pointLightShadows.needsUpdate=k,M.spotLights.needsUpdate=k,M.spotLightShadows.needsUpdate=k,M.rectAreaLights.needsUpdate=k,M.hemisphereLights.needsUpdate=k}function si(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(M,k,$){const V=W.get(M);V.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),W.get(M.texture).__webglTexture=k,W.get(M.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:$,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,k){const $=W.get(M);$.__webglFramebuffer=k,$.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(M,k=0,$=0){K=M,H=k,B=$;let V=null,X=!1,ve=!1;if(M){const ye=W.get(M);if(ye.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(F.FRAMEBUFFER,ye.__webglFramebuffer),ae.copy(M.viewport),de.copy(M.scissor),Ve=M.scissorTest,x.viewport(ae),x.scissor(de),x.setScissorTest(Ve),te=-1;return}else if(ye.__webglFramebuffer===void 0)Z.setupRenderTarget(M);else if(ye.__hasExternalTextures)Z.rebindTextures(M,W.get(M.texture).__webglTexture,W.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Ze=M.depthTexture;if(ye.__boundDepthTexture!==Ze){if(Ze!==null&&W.has(Ze)&&(M.width!==Ze.image.width||M.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(M)}}const Pe=M.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(ve=!0);const Ne=W.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ne[k])?V=Ne[k][$]:V=Ne[k],X=!0):M.samples>0&&Z.useMultisampledRTT(M)===!1?V=W.get(M).__webglMultisampledFramebuffer:Array.isArray(Ne)?V=Ne[$]:V=Ne,ae.copy(M.viewport),de.copy(M.scissor),Ve=M.scissorTest}else ae.copy(Te).multiplyScalar(re).floor(),de.copy(st).multiplyScalar(re).floor(),Ve=be;if($!==0&&(V=O),x.bindFramebuffer(F.FRAMEBUFFER,V)&&x.drawBuffers(M,V),x.viewport(ae),x.scissor(de),x.setScissorTest(Ve),X){const ye=W.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,ye.__webglTexture,$)}else if(ve){const ye=k;for(let Pe=0;Pe<M.textures.length;Pe++){const Ne=W.get(M.textures[Pe]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Pe,Ne.__webglTexture,$,ye)}}else if(M!==null&&$!==0){const ye=W.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ye.__webglTexture,$)}te=-1},this.readRenderTargetPixels=function(M,k,$,V,X,ve,Se,ye=0){if(!(M&&M.isWebGLRenderTarget)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Pe=Pe[Se]),Pe){x.bindFramebuffer(F.FRAMEBUFFER,Pe);try{const Ne=M.textures[ye],Ze=Ne.format,Je=Ne.type;if(M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ye),!R.textureFormatReadable(Ze)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Je)){ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=M.width-V&&$>=0&&$<=M.height-X&&F.readPixels(k,$,V,X,_e.convert(Ze),_e.convert(Je),ve)}finally{const Ne=K!==null?W.get(K).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(M,k,$,V,X,ve,Se,ye=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Pe=Pe[Se]),Pe)if(k>=0&&k<=M.width-V&&$>=0&&$<=M.height-X){x.bindFramebuffer(F.FRAMEBUFFER,Pe);const Ne=M.textures[ye],Ze=Ne.format,Je=Ne.type;if(M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ye),!R.textureFormatReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Le),F.bufferData(F.PIXEL_PACK_BUFFER,ve.byteLength,F.STREAM_READ),F.readPixels(k,$,V,X,_e.convert(Ze),_e.convert(Je),0);const St=K!==null?W.get(K).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,St);const Ht=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await $0(F,Ht,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Le),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ve),F.deleteBuffer(Le),F.deleteSync(Ht),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,k=null,$=0){const V=Math.pow(2,-$),X=Math.floor(M.image.width*V),ve=Math.floor(M.image.height*V),Se=k!==null?k.x:0,ye=k!==null?k.y:0;Z.setTexture2D(M,0),F.copyTexSubImage2D(F.TEXTURE_2D,$,0,0,Se,ye,X,ve),x.unbindTexture()},this.copyTextureToTexture=function(M,k,$=null,V=null,X=0,ve=0){let Se,ye,Pe,Ne,Ze,Je,Le,St,Ht;const Bt=M.isCompressedTexture?M.mipmaps[ve]:M.image;if($!==null)Se=$.max.x-$.min.x,ye=$.max.y-$.min.y,Pe=$.isBox3?$.max.z-$.min.z:1,Ne=$.min.x,Ze=$.min.y,Je=$.isBox3?$.min.z:0;else{const Vt=Math.pow(2,-X);Se=Math.floor(Bt.width*Vt),ye=Math.floor(Bt.height*Vt),M.isDataArrayTexture?Pe=Bt.depth:M.isData3DTexture?Pe=Math.floor(Bt.depth*Vt):Pe=1,Ne=0,Ze=0,Je=0}V!==null?(Le=V.x,St=V.y,Ht=V.z):(Le=0,St=0,Ht=0);const yt=_e.convert(k.format),pn=_e.convert(k.type);let Ee;k.isData3DTexture?(Z.setTexture3D(k,0),Ee=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Z.setTexture2DArray(k,0),Ee=F.TEXTURE_2D_ARRAY):(Z.setTexture2D(k,0),Ee=F.TEXTURE_2D),x.activeTexture(F.TEXTURE0),x.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),x.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),x.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const Wn=x.getParameter(F.UNPACK_ROW_LENGTH),ft=x.getParameter(F.UNPACK_IMAGE_HEIGHT),ai=x.getParameter(F.UNPACK_SKIP_PIXELS),Ai=x.getParameter(F.UNPACK_SKIP_ROWS),ur=x.getParameter(F.UNPACK_SKIP_IMAGES);x.pixelStorei(F.UNPACK_ROW_LENGTH,Bt.width),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Bt.height),x.pixelStorei(F.UNPACK_SKIP_PIXELS,Ne),x.pixelStorei(F.UNPACK_SKIP_ROWS,Ze),x.pixelStorei(F.UNPACK_SKIP_IMAGES,Je);const xs=M.isDataArrayTexture||M.isData3DTexture,bt=k.isDataArrayTexture||k.isData3DTexture;if(M.isDepthTexture){const Vt=W.get(M),fr=W.get(k),Rt=W.get(Vt.__renderTarget),hr=W.get(fr.__renderTarget);x.bindFramebuffer(F.READ_FRAMEBUFFER,Rt.__webglFramebuffer),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,hr.__webglFramebuffer);for(let vs=0;vs<Pe;vs++)xs&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,W.get(M).__webglTexture,X,Je+vs),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,W.get(k).__webglTexture,ve,Ht+vs)),F.blitFramebuffer(Ne,Ze,Se,ye,Le,St,Se,ye,F.DEPTH_BUFFER_BIT,F.NEAREST);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(X!==0||M.isRenderTargetTexture||W.has(M)){const Vt=W.get(M),fr=W.get(k);x.bindFramebuffer(F.READ_FRAMEBUFFER,G),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,U);for(let Rt=0;Rt<Pe;Rt++)xs?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Vt.__webglTexture,X,Je+Rt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Vt.__webglTexture,X),bt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fr.__webglTexture,ve,Ht+Rt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fr.__webglTexture,ve),X!==0?F.blitFramebuffer(Ne,Ze,Se,ye,Le,St,Se,ye,F.COLOR_BUFFER_BIT,F.NEAREST):bt?F.copyTexSubImage3D(Ee,ve,Le,St,Ht+Rt,Ne,Ze,Se,ye):F.copyTexSubImage2D(Ee,ve,Le,St,Ne,Ze,Se,ye);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else bt?M.isDataTexture||M.isData3DTexture?F.texSubImage3D(Ee,ve,Le,St,Ht,Se,ye,Pe,yt,pn,Bt.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Ee,ve,Le,St,Ht,Se,ye,Pe,yt,Bt.data):F.texSubImage3D(Ee,ve,Le,St,Ht,Se,ye,Pe,yt,pn,Bt):M.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ve,Le,St,Se,ye,yt,pn,Bt.data):M.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ve,Le,St,Bt.width,Bt.height,yt,Bt.data):F.texSubImage2D(F.TEXTURE_2D,ve,Le,St,Se,ye,yt,pn,Bt);x.pixelStorei(F.UNPACK_ROW_LENGTH,Wn),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ft),x.pixelStorei(F.UNPACK_SKIP_PIXELS,ai),x.pixelStorei(F.UNPACK_SKIP_ROWS,Ai),x.pixelStorei(F.UNPACK_SKIP_IMAGES,ur),ve===0&&k.generateMipmaps&&F.generateMipmap(Ee),x.unbindTexture()},this.initRenderTarget=function(M){W.get(M).__webglFramebuffer===void 0&&Z.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Z.setTextureCube(M,0):M.isData3DTexture?Z.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Z.setTexture2DArray(M,0):Z.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){H=0,B=0,K=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}const Rb=new dt("#A8B0C4"),Cb=["#FF7A45","#45C8FF","#FFD60A"].map(r=>new dt(r)),Pb=`
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
`,Db=`
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;function Nb({className:r}){const e=Ke.useRef(null);return Ke.useEffect(()=>{const t=e.current;if(!t)return;const n=t.parentElement;if(!n)return;const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=window.matchMedia("(pointer: coarse)").matches?117:350,o=new wb({canvas:t,alpha:!0,antialias:!1});o.setClearColor(0,0);const l=new ux,c=new kf(-1,1,1,-1,-10,10),u=new Ei,d=new Float32Array(a*3),f=new Float32Array(a),h=new Float32Array(a*4),g=[];let _=n.clientWidth,p=n.clientHeight;for(let O=0;O<a;O++){let G=Rb,U=.3;Math.random()>.6&&(G=Cb[Math.floor(Math.random()*3)],U=.5),h[O*4]=G.r,h[O*4+1]=G.g,h[O*4+2]=G.b,h[O*4+3]=U,f[O]=1+Math.random()*2,g.push({bx:(Math.random()-.5)*_,by:(Math.random()-.5)*p,vy:2+Math.random()*4,phase:Math.random()*Math.PI*2,swayAmp:4+Math.random()*8,dx:0,dy:0})}u.setAttribute("position",new ni(d,3)),u.setAttribute("aSize",new ni(f,1)),u.setAttribute("aColor",new ni(h,4));const m=new bi({vertexShader:Pb,fragmentShader:Db,transparent:!0,depthWrite:!1,blending:ou,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}}),b=new Mx(u,m);l.add(b);const w=()=>{_=n.clientWidth,p=n.clientHeight,o.setSize(_,p,!1),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.left=-_/2,c.right=_/2,c.top=p/2,c.bottom=-p/2,c.updateProjectionMatrix()};w();const S={x:-9999,y:-9999},E=O=>{const G=t.getBoundingClientRect();S.x=O.clientX-G.left-_/2,S.y=-(O.clientY-G.top-p/2)},T=()=>{S.x=-9999,S.y=-9999};n.addEventListener("pointermove",E,{passive:!0}),n.addEventListener("pointerleave",T,{passive:!0});const A=new ResizeObserver(w);A.observe(n);let v=0,y=!0;const C=120,L=O=>{if(v=requestAnimationFrame(L),!y)return;const G=O/1e3;for(let U=0;U<a;U++){const H=g[U],B=H.bx+Math.sin(G*.4+H.phase)*H.swayAmp+H.dx,te=((H.by+G*H.vy+p/2)%(p+40)+p+40)%(p+40)-p/2-20+H.dy,N=B-S.x,ae=te-S.y,de=Math.hypot(N,ae);if(de<C&&de>.01){const Ve=(C-de)/C*1.6;H.dx+=N/de*Ve,H.dy+=ae/de*Ve}H.dx*=.95,H.dy*=.95,d[U*3]=B,d[U*3+1]=te,d[U*3+2]=0}u.attributes.position.needsUpdate=!0,o.render(l,c)},P=new IntersectionObserver(([O])=>{y=O.isIntersecting});if(P.observe(n),i){for(let O=0;O<a;O++)d[O*3]=g[O].bx,d[O*3+1]=g[O].by,d[O*3+2]=0;u.attributes.position.needsUpdate=!0,o.render(l,c)}else v=requestAnimationFrame(L);return()=>{cancelAnimationFrame(v),P.disconnect(),A.disconnect(),n.removeEventListener("pointermove",E),n.removeEventListener("pointerleave",T),u.dispose(),m.dispose(),o.dispose()}},[]),D.jsx("canvas",{"code-path":"src/pages/home/ParticleField.tsx:199:5",ref:e,className:r,style:{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"},"aria-hidden":!0})}const Lb=Ke.memo(Nb),Va=[.16,1,.3,1],Ld=[{id:6,name:"Charizard",type:"fire",artOffsetX:-18},{id:3,name:"Venusaur",type:"grass",artOffsetX:-10},{id:9,name:"Blastoise",type:"water",artOffsetX:-12}],jm=[{id:1,name:"Bulbasaur"},{id:4,name:"Charmander"},{id:7,name:"Squirtle"}];function Id({text:r,started:e,baseDelay:t=0,gradient:n=!1}){return D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:44:5","aria-label":r,className:"inline-block",children:Array.from(r).map((i,s)=>D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:46:9","aria-hidden":!0,className:"inline-block overflow-hidden align-bottom",children:D.jsx(it.span,{"code-path":"src/pages/home/Hero.tsx:47:11",className:Oi("inline-block will-change-transform",n&&"text-gradient-alive"),initial:{y:60,rotate:6,opacity:0},animate:e?{y:0,rotate:0,opacity:1}:{},transition:{duration:.7,delay:t+s*.022,ease:Va},children:i===" "?" ":i})},s))})}function Ib({started:r}){const{t:e}=Vn(),t=ps(),[n,i]=Ke.useState(0);Ke.useEffect(()=>{if(!r||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const o=window.setInterval(()=>i(l=>(l+1)%Ld.length),6e3);return()=>window.clearInterval(o)},[r]);const s=Ld[n],a=Lt[s.type].rgb;return D.jsxs(it.div,{"code-path":"src/pages/home/Hero.tsx:77:5",className:"relative mx-auto h-[300px] w-[300px] lg:h-[520px] lg:w-[520px]",initial:{scale:.8,opacity:0},animate:r?{scale:1,opacity:1}:{},transition:{type:"spring",stiffness:180,damping:22,delay:.5},children:[D.jsxs("div",{"code-path":"src/pages/home/Hero.tsx:84:7",className:"absolute inset-0 z-0",children:[D.jsx(rr,{"code-path":"src/pages/home/Hero.tsx:85:9",mode:"sync",children:D.jsx(it.div,{"code-path":"src/pages/home/Hero.tsx:86:11",className:"type-aura animate-breathe",style:{background:`radial-gradient(circle at 50% 55%, rgba(${a},0.38) 0%, rgba(${a},0.12) 42%, transparent 70%)`},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.6}},s.type)}),D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:99:9",className:"absolute bottom-[8%] left-1/2 w-[58%] -translate-x-1/2",children:D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:100:11",className:"h-6 w-full animate-breathe rounded-[50%] border border-gold/50",style:{boxShadow:"0 0 24px rgba(246,201,69,0.25), inset 0 0 18px rgba(246,201,69,0.12)"}})})]}),D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:108:7",className:"absolute inset-x-0 bottom-[9%] z-10 mx-auto h-[84%] w-[84%] lg:h-[88%] lg:w-[88%]",style:{transform:`translateX(${s.artOffsetX}px)`},children:D.jsx(rr,{"code-path":"src/pages/home/Hero.tsx:112:9",mode:"sync",children:D.jsx(it.img,{"code-path":"src/pages/home/Hero.tsx:113:11",src:Sr.artwork(s.id),alt:e("home.hero.artworkAlt",{name:os(s.id,t)}),draggable:!1,className:"absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.6,ease:Va}},s.id)})}),D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:128:7",className:"absolute inset-0 z-20 hidden animate-spin-slow lg:block","aria-hidden":!0,children:jm.map((o,l)=>D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:130:11",className:"absolute left-1/2 top-1/2",style:{transform:`rotate(${l*120}deg) translateX(212px)`},children:D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:135:13",className:"animate-spin-rev",children:D.jsx("div",{"code-path":"src/pages/home/Hero.tsx:136:15",style:{transform:`rotate(${-l*120}deg)`},children:D.jsx(it.div,{"code-path":"src/pages/home/Hero.tsx:137:17",initial:{scale:0},animate:r?{scale:1}:{},transition:{type:"spring",stiffness:420,damping:30,delay:.9+l*.12},children:D.jsx(no,{"code-path":"src/pages/home/Hero.tsx:142:19",id:o.id,name:os(o.id,t),era:"gen5",skeleton:!1,className:"-ml-12 -mt-12 h-24 w-24"})})})})},o.id))})]})}function Ub({started:r}){const e=kd(),t=zd(),n=Qm(eg()??""),{t:i}=Vn(),s=ps(),a=Ke.useRef(null),[o,l]=Ke.useState(!1),{scrollYProgress:c}=tg({target:a,offset:["start start","end start"]}),u=Gd(c,[0,.6],[0,48]),d=()=>{if(o)return;l(!0);const f=1+Math.floor(Math.random()*Hd);window.setTimeout(()=>e(t(`/pokemon/${f}`)),500)};return D.jsxs("section",{"code-path":"src/pages/home/Hero.tsx:178:5",ref:a,className:"relative -mt-16 flex min-h-[100svh] items-center overflow-hidden md:-mt-[6.25rem]",children:[D.jsx(d0,{"code-path":"src/pages/home/Hero.tsx:179:7"}),D.jsx(Lb,{"code-path":"src/pages/home/Hero.tsx:180:7"}),D.jsxs(it.div,{"code-path":"src/pages/home/Hero.tsx:182:7",style:{y:u},className:"relative z-10 mx-auto grid w-full max-w-content gap-10 px-4 pb-24 pt-28 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-16",children:[D.jsxs("div",{"code-path":"src/pages/home/Hero.tsx:187:9",className:"lg:col-span-7",children:[D.jsx(it.p,{"code-path":"src/pages/home/Hero.tsx:188:11",className:"pixel-label text-[11px] text-gold",initial:{opacity:0,letterSpacing:"0.3em"},animate:r?{opacity:1,letterSpacing:"0.08em"}:{},transition:{duration:.4},children:i("home.hero.eyebrow")}),D.jsxs("h1",{"code-path":"src/pages/home/Hero.tsx:197:11",className:"mt-6 font-display text-[clamp(48px,8vw,96px)] font-black uppercase leading-[1.02] tracking-[0.01em]",children:[D.jsx(Id,{"code-path":"src/pages/home/Hero.tsx:198:13",text:i("home.hero.titleA"),started:r,baseDelay:.15}),D.jsx("br",{"code-path":"src/pages/home/Hero.tsx:199:13"}),D.jsx(Id,{"code-path":"src/pages/home/Hero.tsx:200:13",text:i("home.hero.titleB"),started:r,baseDelay:.45})]}),D.jsx(it.p,{"code-path":"src/pages/home/Hero.tsx:203:11",className:"mt-6 max-w-[56ch] font-sans text-lg leading-[1.6] text-tx-secondary",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.7,ease:Va},children:i("home.hero.blurb")}),D.jsxs(it.div,{"code-path":"src/pages/home/Hero.tsx:212:11",className:"mt-8 flex flex-wrap items-center gap-4",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.79,ease:Va},children:[D.jsxs(Dr,{"code-path":"src/pages/home/Hero.tsx:218:13",to:"/pokedex",className:"group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-glow-gold active:scale-[0.97]",children:[D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:222:15",className:"absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full"}),D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:223:15",className:"relative",children:i("home.hero.cta")})]}),D.jsxs("button",{"code-path":"src/pages/home/Hero.tsx:225:13",type:"button",onClick:d,className:"inline-flex items-center gap-2 rounded-md border border-hairline2 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]",children:[D.jsx(it.span,{"code-path":"src/pages/home/Hero.tsx:230:15",animate:o?{rotate:360}:{rotate:0},transition:{duration:.5,ease:"easeInOut"},className:"inline-flex",children:D.jsx(Eg,{"code-path":"src/pages/home/Hero.tsx:235:17",size:18,strokeWidth:1.75})}),i("home.hero.surprise")]}),n&&D.jsxs(Dr,{"code-path":"src/pages/home/Hero.tsx:240:15",to:`/nuzlocke/${n.run.id}`,className:"inline-flex flex-col rounded-md border border-hairline2 px-5 py-3 text-left transition-colors hover:border-gold/50 hover:text-gold",children:[D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:244:17",className:"font-display text-[11px] font-bold uppercase tracking-[0.06em] text-tx-primary",children:i("nuz.continueRun")}),D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:245:17",className:"mt-0.5 text-[11px] text-tx-muted",children:i("nuz.continueRunHint",{name:n.run.name})})]})]}),D.jsx(it.p,{"code-path":"src/pages/home/Hero.tsx:250:11",className:"pixel-label mt-8 text-[9px] text-tx-muted",initial:{y:24,opacity:0},animate:r?{y:0,opacity:1}:{},transition:{duration:.5,delay:.88,ease:Va},children:i("home.hero.stats")})]}),D.jsxs("div",{"code-path":"src/pages/home/Hero.tsx:261:9",className:"overflow-visible lg:col-span-5",children:[D.jsx(Ib,{"code-path":"src/pages/home/Hero.tsx:262:11",started:r}),D.jsx(it.div,{"code-path":"src/pages/home/Hero.tsx:264:11",className:"mt-4 flex items-center justify-center gap-6 lg:hidden",initial:{opacity:0},animate:r?{opacity:1}:{},transition:{delay:1,duration:.5},children:jm.map(f=>D.jsx(no,{"code-path":"src/pages/home/Hero.tsx:271:15",id:f.id,name:os(f.id,s),era:"gen5",skeleton:!1,className:"h-16 w-16"},f.id))})]})]}),D.jsxs(it.a,{"code-path":"src/pages/home/Hero.tsx:278:7",href:"#search-gateway",className:"absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-tx-muted transition-colors hover:text-gold",initial:{opacity:0},animate:r?{opacity:1}:{},transition:{delay:1.3,duration:.5},"aria-label":i("home.hero.scrollAria"),children:[D.jsx("span",{"code-path":"src/pages/home/Hero.tsx:286:9",className:"pixel-label text-[9px]",children:i("home.hero.scroll")}),D.jsx(_g,{"code-path":"src/pages/home/Hero.tsx:287:9",size:20,strokeWidth:1.75,className:"animate-cue-bounce"})]})]})}function zf({children:r,className:e,delay:t=0,y:n=40}){return D.jsx(it.div,{"code-path":"src/pages/home/Reveal.tsx:15:5",className:e,initial:{opacity:0,y:n,filter:"blur(8px)"},whileInView:{opacity:1,y:0,filter:"blur(0px)"},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.6,delay:t,ease:[.16,1,.3,1]},children:r})}const Fb=["fire","water","grass","electric","psychic","dragon","ghost","fairy"];function Ob(){const{t:r}=Vn(),e=ps();return D.jsxs("section",{"code-path":"src/pages/home/SearchGateway.tsx:19:5",id:"search-gateway",className:"relative z-10 bg-abyss pt-24 pb-12",children:[D.jsx("div",{"code-path":"src/pages/home/SearchGateway.tsx:23:7",className:"absolute inset-x-0 top-0 h-px",style:{background:"linear-gradient(90deg, transparent, rgba(255,122,69,0.3), rgba(69,200,255,0.3), rgba(255,214,10,0.3), transparent)"}}),D.jsxs(zf,{"code-path":"src/pages/home/SearchGateway.tsx:30:7",className:"mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-4",children:[D.jsx("span",{"code-path":"src/pages/home/SearchGateway.tsx:31:9",className:"pixel-label text-[10px] text-gold",children:r("home.gateway.eyebrow")}),D.jsx("h2",{"code-path":"src/pages/home/SearchGateway.tsx:32:9",className:"text-center font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:r("home.gateway.title")}),D.jsx(ng,{"code-path":"src/pages/home/SearchGateway.tsx:36:9",variant:"inline",className:"w-full"}),D.jsxs("div",{"code-path":"src/pages/home/SearchGateway.tsx:38:9",className:"flex flex-wrap items-center justify-center gap-2",children:[D.jsx("span",{"code-path":"src/pages/home/SearchGateway.tsx:39:11",className:"pixel-label mr-1 text-[9px] text-tx-muted",children:r("home.gateway.popular")}),Fb.map((t,n)=>D.jsx(it.div,{"code-path":"src/pages/home/SearchGateway.tsx:41:13",initial:{scale:.8,opacity:0},whileInView:{scale:1,opacity:1},viewport:{once:!0,margin:"-10% 0px"},transition:{type:"spring",stiffness:420,damping:30,delay:.15+n*.04},children:D.jsxs(Dr,{"code-path":"src/pages/home/SearchGateway.tsx:48:15",to:`/pokedex?type=${t}`,"data-type":t,className:"inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface2 px-3 py-1.5 font-sans text-xs font-semibold capitalize text-tx-secondary transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-[rgba(var(--t),0.8)] hover:bg-[rgba(var(--t),0.18)] hover:text-[rgb(var(--t))] hover:shadow-[0_0_16px_rgba(var(--t),0.35)]",style:{"--t":Lt[t].rgb},children:[D.jsx(Rl,{"code-path":"src/pages/home/SearchGateway.tsx:54:17",type:t,size:16}),Qu(t,e)]})},t))]})]})]})}const Bb=[.16,1,.3,1],kb=[{to:"/maps",Icon:xg,tag:"MAPS",accent:"#59B37A",titleKey:"home.features.toolkit.maps.title",captionKey:"home.features.toolkit.maps.caption",stats:[["home.features.toolkit.stats.regions",Bl.length],["home.features.toolkit.stats.locations",Bl.reduce((r,e)=>r+e.nodes.length,0)],["home.features.toolkit.stats.gens","I–V"]]},{to:"/nuzlocke",Icon:vg,tag:"NUZLOCKE",accent:"#E14D6B",titleKey:"home.features.toolkit.nuzlocke.title",captionKey:"home.features.toolkit.nuzlocke.caption",stats:[["home.features.toolkit.stats.regions",Bl.length+ig.length],["home.features.toolkit.stats.gens","I–IX"],["home.features.toolkit.stats.mode","SOLO+CO-OP"]]},{to:"/team",Icon:Sg,tag:"TEAM",accent:"#6E7FD7",titleKey:"home.features.toolkit.team.title",captionKey:"home.features.toolkit.team.caption",stats:[["home.features.toolkit.stats.species",1025],["home.features.toolkit.stats.gens","I–IX"],["home.features.toolkit.stats.export","SHOWDOWN"]]},{to:"/versus",Icon:Ag,tag:"VERSUS",accent:"#F5A623",titleKey:"home.features.toolkit.versus.title",captionKey:"home.features.toolkit.versus.caption",stats:[["home.features.toolkit.stats.mode","1v1"],["home.features.toolkit.stats.gens","I–IX"],["home.features.toolkit.stats.engine","SMOGON"]]}];function zb({card:r,index:e}){const{t}=Vn(),[n,i]=Ke.useState(!1),[s,a]=Ke.useState({x:0,y:0}),o=rg(r.accent),{Icon:l}=r;return D.jsxs(it.article,{"code-path":"src/pages/home/ToolkitSection.tsx:88:5",initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-15%"},transition:{duration:.4,ease:Bb,delay:e*.06},whileHover:{y:-6,scale:1.01},onHoverStart:()=>i(!0),onHoverEnd:()=>{i(!1),a({x:0,y:0})},onPointerMove:c=>{const u=c.currentTarget.getBoundingClientRect();a({x:((c.clientX-u.left)/u.width-.5)*-12,y:((c.clientY-u.top)/u.height-.5)*-12})},className:"group relative h-72 overflow-hidden rounded-lg border border-hairline bg-surface1 p-5 transition-[border-color,box-shadow] duration-200",style:{borderColor:n?`rgba(${o},0.55)`:void 0,boxShadow:n?`0 8px 40px rgba(${o},0.22)`:void 0},children:[D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:113:7",className:"pointer-events-none absolute -bottom-6 -right-6 transition-opacity duration-300",style:{transform:`translate(${s.x}px, ${s.y}px)`,transition:"transform 150ms ease-out",opacity:n?.16:.08},"aria-hidden":!0,children:D.jsx(l,{"code-path":"src/pages/home/ToolkitSection.tsx:122:9",size:190,strokeWidth:.75,style:{color:r.accent}})}),D.jsxs("div",{"code-path":"src/pages/home/ToolkitSection.tsx:125:7",className:"relative flex h-full flex-col",children:[D.jsxs("div",{"code-path":"src/pages/home/ToolkitSection.tsx:127:9",className:"flex items-center justify-between",children:[D.jsx("span",{"code-path":"src/pages/home/ToolkitSection.tsx:128:11",className:"pixel-label text-[9px] text-tx-muted",children:r.tag}),D.jsxs("span",{"code-path":"src/pages/home/ToolkitSection.tsx:129:11",className:"inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 pixel-label text-[8px]",style:{borderColor:`rgba(${o},0.5)`,color:r.accent},children:[D.jsx("span",{"code-path":"src/pages/home/ToolkitSection.tsx:133:13",className:"h-2 w-2 rounded-full",style:{background:r.accent,boxShadow:`0 0 6px rgba(${o},0.9)`}}),"LIVE"]})]}),D.jsx("h3",{"code-path":"src/pages/home/ToolkitSection.tsx:139:9",className:"mt-3 font-display text-[30px] font-extrabold uppercase leading-none tracking-wide text-tx-primary",children:t(r.titleKey)}),D.jsx("p",{"code-path":"src/pages/home/ToolkitSection.tsx:142:9",className:"mt-2 max-w-[46ch] text-[12.5px] font-medium leading-relaxed text-tx-secondary",children:t(r.captionKey)}),D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:146:9",className:"flex-1"}),D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:149:9",className:"grid grid-cols-3 divide-x divide-hairline border-y border-hairline py-2",children:r.stats.map(([c,u])=>D.jsxs("div",{"code-path":"src/pages/home/ToolkitSection.tsx:151:13",className:"px-3 first:pl-0",children:[D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:152:15",className:"pixel-label text-[8px] text-tx-muted",children:t(c)}),D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:153:15",className:"font-display text-[18px] font-bold tabular-nums",style:{color:r.accent},children:u})]},c))}),D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:161:9",className:"mt-3.5",children:D.jsxs(Dr,{"code-path":"src/pages/home/ToolkitSection.tsx:162:11",to:r.to,className:"inline-flex h-9 items-center gap-1.5 rounded-md border px-4 font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5",style:{borderColor:`rgba(${o},0.6)`,background:`linear-gradient(135deg, rgba(${o},0.25), rgba(${o},0.10))`},children:[t("home.features.open"),D.jsx(Wd,{"code-path":"src/pages/home/ToolkitSection.tsx:171:13",size:14,className:"transition-transform duration-200 group-hover:translate-x-0.5"})]})})]})]})}function Gb(){const{t:r}=Vn();return D.jsx("section",{"code-path":"src/pages/home/ToolkitSection.tsx:183:5",className:"relative bg-abyss pb-24",children:D.jsxs("div",{"code-path":"src/pages/home/ToolkitSection.tsx:184:7",className:"mx-auto max-w-content border-t border-hairline px-4 pt-16 md:px-8 md:pt-20",children:[D.jsxs("div",{"code-path":"src/pages/home/ToolkitSection.tsx:185:9",className:"mb-8 flex items-center gap-3",children:[D.jsx("span",{"code-path":"src/pages/home/ToolkitSection.tsx:186:11",className:"pixel-label text-[10px] text-gold",children:r("home.features.toolkitEyebrow")}),D.jsx("span",{"code-path":"src/pages/home/ToolkitSection.tsx:187:11",className:"h-px flex-1 bg-hairline"})]}),D.jsx("div",{"code-path":"src/pages/home/ToolkitSection.tsx:189:9",className:"grid gap-5 lg:grid-cols-2",children:kb.map((e,t)=>D.jsx(zb,{"code-path":"src/pages/home/ToolkitSection.tsx:191:13",card:e,index:t},e.tag))})]})})}const Lc=[.16,1,.3,1];function Hb(){const r=new Date;return Math.floor((r.getTime()-new Date(r.getFullYear(),0,0).getTime())/864e5)}function Vb(r){return(Hb()+r)*137%Hd+1}function Wb({burstKey:r}){const e=Ke.useMemo(()=>Array.from({length:8},(t,n)=>{const i=n/8*Math.PI*2+Math.random()*.5,s=60+Math.random()*60;return{x:Math.cos(i)*s,y:Math.sin(i)*s}}),[r]);return r===0?null:D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:42:5",className:"pointer-events-none absolute inset-0 z-20","aria-hidden":!0,children:e.map((t,n)=>D.jsx(it.img,{"code-path":"src/pages/home/Spotlight.tsx:44:9",src:"/sparkle.svg",alt:"",className:"absolute left-1/2 top-1/2 h-4 w-4",initial:{x:0,y:0,scale:0,opacity:1},animate:{x:t.x,y:t.y,scale:[0,1,0],opacity:[1,1,0]},transition:{duration:.7,delay:n*.03,ease:"easeOut"}},n))},r)}function Xb(){const{t:r}=Vn(),e=ps(),[t,n]=Ke.useState(0),i=Vb(t),[s,a]=Ke.useState(null),[o,l]=Ke.useState(null),[c,u]=Ke.useState(!1),[d,f]=Ke.useState(0),[h,g]=Ke.useState(i);h!==i&&(g(i),a(null),l(null),u(!1)),Ke.useEffect(()=>{let P=!0;return Promise.all([sg(i),ag(i)]).then(([O,G])=>{P&&(a(O),l(G))}).catch(()=>{}),()=>{P=!1}},[i]);const _=Ke.useRef(null),p=Fc(0),m=Fc(0),b=$f(p,{stiffness:180,damping:22}),w=$f(m,{stiffness:180,damping:22}),[S,E]=Ke.useState({x:50,y:50,o:0}),T=P=>{const O=_.current?.getBoundingClientRect();if(!O)return;const G=(P.clientX-O.left)/O.width,U=(P.clientY-O.top)/O.height;m.set((G-.5)*8),p.set(-(U-.5)*8),E({x:G*100,y:U*100,o:1})},A=()=>{p.set(0),m.set(0),E(P=>({...P,o:0}))},v=(s?.types??[]).sort((P,O)=>P.slot-O.slot).map(P=>P.type.name),y=v[0]??"normal",C=v[1]??y,L=o?.is_legendary||o?.is_mythical;return D.jsx("section",{"code-path":"src/pages/home/Spotlight.tsx:122:5",className:"mx-auto max-w-content px-4 py-24 md:px-8",children:D.jsxs(it.div,{"code-path":"src/pages/home/Spotlight.tsx:123:7",initial:{clipPath:"inset(12% 8% 12% 8% round 24px)",opacity:.4},whileInView:{clipPath:"inset(0% 0% 0% 0% round 24px)",opacity:1},viewport:{once:!0,margin:"-25% 0px"},transition:{duration:.9,ease:Lc},className:Oi("relative overflow-hidden rounded-xl border border-hairline bg-surface1",L&&"legendary-ring"),children:[D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:134:9","aria-hidden":!0,className:"absolute inset-0 transition-[background] duration-700",style:{background:`radial-gradient(640px 420px at 18% 30%, rgba(${Lt[y].rgb},0.18), transparent 70%), radial-gradient(560px 400px at 85% 75%, rgba(${Lt[C].rgb},0.14), transparent 70%)`}}),D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:141:9",className:"grain-overlay absolute inset-0"}),D.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:143:9",className:"relative grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-6",children:[D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:145:11",className:"lg:col-span-5",children:D.jsxs(it.div,{"code-path":"src/pages/home/Spotlight.tsx:146:13",ref:_,onPointerMove:T,onPointerLeave:A,className:"relative mx-auto aspect-square w-full max-w-[400px]",initial:{x:-40,opacity:0,filter:"blur(12px)"},whileInView:{x:0,opacity:1,filter:"blur(0px)"},viewport:{once:!0,margin:"-25% 0px"},transition:{duration:.7,ease:Lc},style:{perspective:800},children:[D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:157:15",className:"type-aura animate-breathe",style:{background:`radial-gradient(circle at 50% 55%, rgba(${Lt[y].rgb},0.38) 0%, rgba(${Lt[y].rgb},0.12) 42%, transparent 70%)`}}),D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:163:15",className:"absolute bottom-[8%] left-1/2 h-6 w-[58%] -translate-x-1/2 animate-breathe rounded-[50%] border border-gold/40"}),D.jsx(rr,{"code-path":"src/pages/home/Spotlight.tsx:164:15",mode:"sync",children:D.jsxs(it.div,{"code-path":"src/pages/home/Spotlight.tsx:165:17",className:"absolute inset-0",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},style:{rotateX:b,rotateY:w},children:[s&&D.jsx("img",{"code-path":"src/pages/home/Spotlight.tsx:175:21",src:c?Sr.artworkShiny(i):Sr.artwork(i),alt:`${r("home.hero.artworkAlt",{name:os(i,e)})}${c?r("detail.hero.shinySuffix"):""}`,draggable:!1,className:"h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"}),!s&&D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:183:21",className:"grid h-full w-full place-items-center",children:D.jsx(Vd,{"code-path":"src/pages/home/Spotlight.tsx:184:23",variant:"inline"})})]},i+String(c))}),D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:190:15","aria-hidden":!0,className:"pointer-events-none absolute inset-0 transition-opacity duration-300",style:{opacity:S.o,background:`radial-gradient(240px 240px at ${S.x}% ${S.y}%, rgba(255,255,255,0.10), transparent 70%)`}}),D.jsx(Wb,{"code-path":"src/pages/home/Spotlight.tsx:198:15",burstKey:d}),D.jsx("button",{"code-path":"src/pages/home/Spotlight.tsx:200:15",type:"button","aria-pressed":c,"aria-label":r("detail.hero.shinyArtwork"),onClick:()=>{u(P=>!P),f(P=>P+1)},className:Oi("absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-md border transition-all duration-200",c?"border-gold/60 bg-gold-soft text-gold shadow-glow-gold":"border-hairline bg-surface2/80 text-tx-muted hover:border-hairline2 hover:text-gold"),children:D.jsx(Mg,{"code-path":"src/pages/home/Spotlight.tsx:215:17",size:18,strokeWidth:1.75})})]})}),D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:221:11",className:"flex flex-col justify-center gap-4 lg:col-span-7",children:D.jsx(rr,{"code-path":"src/pages/home/Spotlight.tsx:222:13",mode:"wait",children:D.jsx(it.div,{"code-path":"src/pages/home/Spotlight.tsx:223:15",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.4},className:"flex flex-col gap-4",children:[D.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:232:19",className:"pixel-label text-[11px] text-gold",children:og(i)},"num"),D.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:235:19",children:[D.jsx("h2",{"code-path":"src/pages/home/Spotlight.tsx:236:21",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:s?os(i,e):"…"}),D.jsx("p",{"code-path":"src/pages/home/Spotlight.tsx:239:21",className:"mt-1 font-sans text-base italic text-tx-secondary",children:e==="de"?lg(i,e):o?cg(o):" "})]},"name"),D.jsx("div",{"code-path":"src/pages/home/Spotlight.tsx:243:19",className:"flex flex-wrap gap-2",children:v.map(P=>D.jsx(ug,{"code-path":"src/pages/home/Spotlight.tsx:245:23",type:P,glow:!0},P))},"types"),D.jsx("p",{"code-path":"src/pages/home/Spotlight.tsx:248:19",className:"max-w-[62ch] font-sans text-base leading-[1.55] text-tx-secondary",children:o?fg(o,e):r("home.spotlight.loadingFlavor")},"flavor"),D.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:251:19",className:"flex max-w-[440px] flex-col gap-2.5",children:[D.jsx($o,{"code-path":"src/pages/home/Spotlight.tsx:252:21",label:"HP",value:s?kl(s,"hp"):0,type:y}),D.jsx($o,{"code-path":"src/pages/home/Spotlight.tsx:253:21",label:"ATK",value:s?kl(s,"attack"):0,type:y,delay:80}),D.jsx($o,{"code-path":"src/pages/home/Spotlight.tsx:254:21",label:"DEF",value:s?kl(s,"defense"):0,type:y,delay:160})]},"stats"),D.jsxs("div",{"code-path":"src/pages/home/Spotlight.tsx:256:19",className:"mt-2 flex flex-wrap gap-4",children:[D.jsxs(Dr,{"code-path":"src/pages/home/Spotlight.tsx:257:21",to:`/pokemon/${i}`,className:"group relative inline-flex items-center gap-2 overflow-hidden rounded-md border px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]",style:{borderColor:`rgba(${Lt[y].rgb},0.6)`,background:`linear-gradient(135deg, rgba(${Lt[y].rgb},0.25), rgba(${Lt[y].rgb},0.10))`,boxShadow:`0 0 0 rgba(${Lt[y].rgb},0)`},children:[D.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:266:23",className:"absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full"}),D.jsx("span",{"code-path":"src/pages/home/Spotlight.tsx:267:23",className:"relative",children:r("home.spotlight.viewEntry")})]}),D.jsx("button",{"code-path":"src/pages/home/Spotlight.tsx:269:21",type:"button",onClick:()=>n(P=>P+1),className:"rounded-md border border-hairline2 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]",children:r("home.spotlight.next")})]},"cta")].map((P,O)=>D.jsx(it.div,{"code-path":"src/pages/home/Spotlight.tsx:278:19",initial:{y:24,opacity:0},whileInView:{y:0,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.5,delay:O*.08,ease:Lc},children:P},P.key))},i)})})]})]})})}const Yb=[.16,1,.3,1],Ic=()=>typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches;function qb(){const r=kd(),e=zd(),{t}=Vn(),n=ps(),[i,s]=Ke.useState(null),a=o=>{if(Ic()&&i!==o){s(o);return}r(e(`/pokedex?type=${o}`))};return D.jsxs("section",{"code-path":"src/pages/home/TypeSpectrum.tsx:35:5",className:"mx-auto max-w-content overflow-x-clip px-4 py-24 md:px-8",children:[D.jsxs(zf,{"code-path":"src/pages/home/TypeSpectrum.tsx:36:7",className:"mb-12 flex flex-col items-center gap-4 text-center",children:[D.jsx("span",{"code-path":"src/pages/home/TypeSpectrum.tsx:37:9",className:"pixel-label text-[10px] text-gold",children:t("home.spectrum.eyebrow")}),D.jsx("h2",{"code-path":"src/pages/home/TypeSpectrum.tsx:38:9",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:t("home.spectrum.title")}),D.jsx("p",{"code-path":"src/pages/home/TypeSpectrum.tsx:41:9",className:"max-w-[52ch] font-sans text-base text-tx-secondary",children:t("home.spectrum.blurb")})]}),D.jsx("div",{"code-path":"src/pages/home/TypeSpectrum.tsx:47:7",className:"flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0",children:hg.map((o,l)=>{const c=Math.floor(l/6),u=l%6,d=Math.abs(c-1)+Math.abs(u-2.5),f=i===o,h=Lt[o].rgb;return D.jsxs(it.button,{"code-path":"src/pages/home/TypeSpectrum.tsx:55:13",type:"button","data-type":o,onClick:()=>a(o),onMouseEnter:()=>!Ic()&&s(o),onMouseLeave:()=>!Ic()&&s(null),className:Oi("group relative flex h-24 w-24 shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-md border sm:h-24 sm:w-auto","transition-colors duration-300 focus-visible:border-[rgba(var(--t),0.8)]",f?"border-[rgba(var(--t),0.6)]":"border-hairline bg-surface1"),style:{"--t":h,background:f?`radial-gradient(circle at 50% 60%, rgba(${h},0.22), transparent 75%)`:void 0,backgroundColor:void 0},initial:{scale:.6,opacity:0},whileInView:{scale:1,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.5,delay:d*.035,ease:Yb},children:[D.jsx(rr,{"code-path":"src/pages/home/TypeSpectrum.tsx:80:15",children:f&&D.jsx("div",{"code-path":"src/pages/home/TypeSpectrum.tsx:82:19",className:"pointer-events-none absolute -top-14 left-1/2 z-20 hidden -translate-x-1/2 gap-1 sm:flex",children:dg[o].map((g,_)=>D.jsx(it.div,{"code-path":"src/pages/home/TypeSpectrum.tsx:84:23",initial:{scale:0,y:8},animate:{scale:1,y:[8,-4,0]},exit:{scale:0,opacity:0},transition:{type:"spring",stiffness:420,damping:30,delay:_*.06},children:D.jsx(no,{"code-path":"src/pages/home/TypeSpectrum.tsx:91:25",id:g,name:Qu(o,n),era:"gen5",skeleton:!1,className:"h-12 w-12"})},g))})}),D.jsx(it.span,{"code-path":"src/pages/home/TypeSpectrum.tsx:98:15",animate:f?{scale:[1,1.18,.96,1],rotate:[0,-4,3,0]}:{scale:1,rotate:0},transition:{duration:.3},className:Oi("transition-all duration-300",f?"text-[rgb(var(--t))] opacity-100 drop-shadow-[0_0_12px_rgba(var(--t),0.8)]":"text-tx-secondary opacity-35 grayscale"),style:{"--t":h},children:D.jsx(Rl,{"code-path":"src/pages/home/TypeSpectrum.tsx:109:17",type:o,size:32})}),D.jsx("span",{"code-path":"src/pages/home/TypeSpectrum.tsx:111:15",className:Oi("pixel-label text-[9px] transition-colors duration-300",f?"text-[rgb(var(--t))]":"text-tx-muted"),style:{"--t":h},children:o})]},o)})})]})}const Ud=[.16,1,.3,1],$b=[`rgb(${Lt.grass.rgb})`,`rgb(${Lt.fire.rgb})`,`rgb(${Lt.water.rgb})`,`rgb(${Lt.grass.rgb})`];function Kb(){const{t:r}=Vn(),e=Ke.useRef(null),t=Ke.useRef(null),n=Fc(0),[i,s]=Ke.useState(0),a=Gd(n,l=>i>0?Math.min(1,Math.max(0,-l/i)):0);Ke.useEffect(()=>{const l=()=>{const u=t.current,d=e.current;!u||!d||s(Math.max(0,u.scrollWidth-d.clientWidth))};l();const c=new ResizeObserver(l);return e.current&&c.observe(e.current),()=>c.disconnect()},[]);const o=l=>{const c=Math.min(0,Math.max(-i,n.get()+l*-344));ef(n,c,{duration:.4,ease:Ud})};return D.jsxs("section",{"code-path":"src/pages/home/GenerationsRail.tsx:51:5",className:"overflow-x-clip py-24",children:[D.jsxs(zf,{"code-path":"src/pages/home/GenerationsRail.tsx:52:7",className:"mx-auto mb-10 flex max-w-content flex-wrap items-end justify-between gap-6 px-4 md:px-8",children:[D.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:53:9",className:"flex flex-col gap-4",children:[D.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:54:11",className:"pixel-label text-[10px] text-gold",children:"1996 → 2022"}),D.jsx("h2",{"code-path":"src/pages/home/GenerationsRail.tsx:55:11",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:r("home.generations.title")})]}),D.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:59:9",className:"flex items-center gap-4",children:[D.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:60:11",className:"pixel-label hidden text-[9px] text-tx-muted sm:block",children:r("home.generations.drag")}),D.jsx("button",{"code-path":"src/pages/home/GenerationsRail.tsx:61:11",type:"button",onClick:()=>o(-1),"aria-label":r("home.generations.prev"),className:"grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold",children:D.jsx(yg,{"code-path":"src/pages/home/GenerationsRail.tsx:67:13",size:18,strokeWidth:1.75})}),D.jsx("button",{"code-path":"src/pages/home/GenerationsRail.tsx:69:11",type:"button",onClick:()=>o(1),"aria-label":r("home.generations.next"),className:"grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold",children:D.jsx(Wd,{"code-path":"src/pages/home/GenerationsRail.tsx:75:13",size:18,strokeWidth:1.75})})]})]}),D.jsxs(it.div,{"code-path":"src/pages/home/GenerationsRail.tsx:80:7",initial:{x:60,opacity:0},whileInView:{x:0,opacity:1},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.7,ease:Ud},className:"overflow-x-clip",children:[D.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:87:9",ref:e,className:"overflow-hidden",children:D.jsx(it.div,{"code-path":"src/pages/home/GenerationsRail.tsx:88:11",ref:t,drag:"x",style:{x:n},dragConstraints:{left:-i,right:0},dragTransition:{power:.4,timeConstant:220},className:"flex cursor-grab gap-6 px-4 active:cursor-grabbing md:px-8",children:pg.map(l=>{const c=l.range[1]-l.range[0]+1,u=l.gen<=5?"gen5":"home";return D.jsxs(Dr,{"code-path":"src/pages/home/GenerationsRail.tsx:100:17",to:`/pokedex?gen=${l.gen}`,draggable:!1,onDragStart:d=>d.preventDefault(),className:"group relative flex h-[360px] w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-surface1 p-6 transition-transform duration-300 ease-out-expo hover:-translate-y-1.5 sm:w-[320px]",children:[D.jsx(it.div,{"code-path":"src/pages/home/GenerationsRail.tsx:108:19","aria-hidden":!0,className:"pointer-events-none absolute inset-0 rounded-lg border opacity-0 transition-opacity duration-300 group-hover:opacity-100",animate:{borderColor:$b},transition:{duration:3,repeat:1/0,ease:"linear"}}),D.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:115:19","aria-hidden":!0,className:"absolute -right-2 -top-4 select-none font-display text-8xl font-black text-tx-primary/[0.08]",children:l.roman}),D.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:122:19",className:"flex items-baseline justify-between",children:[D.jsxs("span",{"code-path":"src/pages/home/GenerationsRail.tsx:123:21",className:"pixel-label text-[10px] text-gold",children:["GEN ",l.roman]}),D.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:124:21",className:"font-sans text-xs font-medium text-tx-muted",children:l.year})]}),D.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:127:19",className:"flex items-end justify-center gap-2",children:l.starters.map((d,f)=>D.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:129:23",className:"group-hover:animate-[hop_0.42s_ease-in-out]",style:{animationDelay:`${f*100}ms`},children:D.jsx(no,{"code-path":"src/pages/home/GenerationsRail.tsx:134:25",id:d,name:r("home.generations.starterAlt",{roman:l.roman}),era:u,skeleton:!1,className:"h-20 w-20 sm:h-24 sm:w-24"})},d))}),D.jsxs("div",{"code-path":"src/pages/home/GenerationsRail.tsx:139:19",children:[D.jsx("h3",{"code-path":"src/pages/home/GenerationsRail.tsx:140:21",className:"font-sans text-lg font-bold text-tx-primary transition-colors duration-200 group-hover:text-gold",children:r(`regions.${mg(l.region)}`)}),D.jsx("span",{"code-path":"src/pages/home/GenerationsRail.tsx:143:21",className:"pixel-label mt-1 block text-[9px] text-tx-muted",children:r("home.generations.count",{count:c})})]})]},l.gen)})})}),D.jsx("div",{"code-path":"src/pages/home/GenerationsRail.tsx:154:9",className:"mx-4 mt-6 h-0.5 overflow-hidden rounded-pill bg-surface3 md:mx-8",children:D.jsx(it.div,{"code-path":"src/pages/home/GenerationsRail.tsx:155:11",className:"h-full origin-left bg-gradient-to-r from-gold to-type-fire",style:{scaleX:a}})})]})]})}const Gf=[.16,1,.3,1],Zb=[{id:1,name:"Bulbasaur",types:["grass","poison"]},{id:2,name:"Ivysaur",types:["grass","poison"]},{id:3,name:"Venusaur",types:["grass","poison"]},{id:4,name:"Charmander",types:["fire"]},{id:5,name:"Charmeleon",types:["fire"]},{id:6,name:"Charizard",types:["fire","flying"]}],jb=["grass","fire","water"];function Jb({live:r}){const{t:e}=Vn(),t=ps(),[n,i]=Ke.useState(null),s=Zb.filter(a=>!n||a.types.includes(n));return D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:36:5",className:"flex flex-col gap-3",children:[D.jsx("div",{"code-path":"src/pages/home/Features.tsx:37:7",className:"flex gap-2",children:jb.map(a=>{const o=n===a;return D.jsxs("button",{"code-path":"src/pages/home/Features.tsx:41:13",type:"button","aria-pressed":o,onClick:()=>i(o?null:a),className:Oi("inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 font-sans text-xs font-semibold capitalize transition-all duration-200",o?"-translate-y-0.5 border-[rgba(var(--t),0.8)] bg-[rgba(var(--t),0.18)] text-[rgb(var(--t))] shadow-[0_0_12px_rgba(var(--t),0.35)]":"border-hairline bg-surface2 text-tx-muted hover:text-tx-secondary"),style:{"--t":Lt[a].rgb},children:[D.jsx(Rl,{"code-path":"src/pages/home/Features.tsx:54:15",type:a,size:14}),Qu(a,t)]},a)})}),D.jsxs(it.div,{"code-path":"src/pages/home/Features.tsx:60:7",layout:!0,className:"grid min-h-[148px] grid-cols-3 content-start gap-2",children:[D.jsx(rr,{"code-path":"src/pages/home/Features.tsx:61:9",mode:"popLayout",children:s.map(a=>D.jsxs(it.div,{"code-path":"src/pages/home/Features.tsx:63:13",layout:!0,initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},transition:{duration:.25,ease:Gf},className:"relative flex flex-col items-center gap-1 rounded-md border border-hairline bg-surface2 p-2",children:[D.jsx("div",{"code-path":"src/pages/home/Features.tsx:72:15","aria-hidden":!0,className:"absolute inset-x-2 top-1 h-8 rounded-full blur-md",style:{background:`rgba(${Lt[a.types[0]].rgb},0.25)`}}),D.jsx(no,{"code-path":"src/pages/home/Features.tsx:77:15",id:a.id,name:os(a.id,t),era:"gen5",skeleton:!1,eager:r,className:"relative h-14 w-14"}),D.jsx("span",{"code-path":"src/pages/home/Features.tsx:78:15",className:"font-sans text-[11px] font-semibold text-tx-secondary",children:os(a.id,t)})]},a.id))}),s.length===0&&D.jsxs(it.div,{"code-path":"src/pages/home/Features.tsx:83:11",initial:{opacity:0},animate:{opacity:1},className:"col-span-3 flex flex-col items-center gap-2 py-6",children:[D.jsx("img",{"code-path":"src/pages/home/Features.tsx:88:13",src:"/empty-dex.svg",alt:"",className:"h-14 w-auto opacity-70"}),D.jsx("span",{"code-path":"src/pages/home/Features.tsx:89:13",className:"font-sans text-xs font-medium text-gold",children:e("home.features.emptyDemo")})]})]})]})}const Fd={hp:35,attack:55,defense:40,"special-attack":50,"special-defense":50,speed:90};function Qb({values:r,prog:e}){const t=Ke.useRef(null),n=62,i=80;Ke.useEffect(()=>{const a=r.map((o,l)=>{const c=(-90+l*60)*(Math.PI/180),u=o/180*n*e;return`${i+Math.cos(c)*u},${i+Math.sin(c)*u}`}).join(" ");t.current?.setAttribute("points",a)},[r,e]);const s=[.33,.66,1];return D.jsxs("svg",{"code-path":"src/pages/home/Features.tsx:124:5",viewBox:"0 0 160 160",className:"h-[160px] w-[160px]",children:[s.map(a=>D.jsx("polygon",{"code-path":"src/pages/home/Features.tsx:126:9",points:Array.from({length:6},(o,l)=>{const c=(-90+l*60)*(Math.PI/180);return`${i+Math.cos(c)*n*a},${i+Math.sin(c)*n*a}`}).join(" "),fill:"none",stroke:"rgba(255,255,255,0.08)",strokeWidth:"1"},a)),Array.from({length:6},(a,o)=>{const l=(-90+o*60)*(Math.PI/180);return D.jsx("line",{"code-path":"src/pages/home/Features.tsx:140:11",x1:i,y1:i,x2:i+Math.cos(l)*n,y2:i+Math.sin(l)*n,stroke:"rgba(255,255,255,0.08)",strokeWidth:"1"},o)}),D.jsx("polygon",{"code-path":"src/pages/home/Features.tsx:151:7",ref:t,fill:"rgba(255,214,10,0.25)",stroke:"#FFD60A",strokeWidth:"1.5"})]})}function e1({live:r}){const{t:e}=Vn(),[t,n]=Ke.useState("bars"),[i,s]=Ke.useState(0),[a,o]=Ke.useState(0);Ke.useEffect(()=>{if(!r||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const c=window.setInterval(()=>s(u=>u+1),4e3);return()=>window.clearInterval(c)},[r]),Ke.useEffect(()=>{if(t!=="radar")return;const c=ef(0,1,{duration:.6,ease:Gf,onUpdate:o});return()=>c.stop()},[t,i]);const l=Kf.map(c=>Fd[c]);return D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:180:5",className:"flex flex-col gap-3",children:[D.jsx("div",{"code-path":"src/pages/home/Features.tsx:181:7",className:"relative flex w-fit rounded-pill border border-hairline bg-surface1 p-1",children:["bars","radar"].map(c=>D.jsxs("button",{"code-path":"src/pages/home/Features.tsx:183:11",type:"button","aria-pressed":t===c,onClick:()=>n(c),className:Oi("relative rounded-pill px-3 py-1 font-sans text-[13px] font-semibold capitalize transition-colors",t===c?"text-gold":"text-tx-muted hover:text-tx-secondary"),children:[t===c&&D.jsx(it.span,{"code-path":"src/pages/home/Features.tsx:194:15",layoutId:"stats-thumb",className:"absolute inset-0 rounded-pill border border-gold/50 bg-surface3",transition:{type:"spring",stiffness:420,damping:30}}),D.jsx("span",{"code-path":"src/pages/home/Features.tsx:200:13",className:"relative",children:e(`detail.combat.${c}`)})]},c))}),D.jsx("div",{"code-path":"src/pages/home/Features.tsx:204:7",className:"grid min-h-[148px] place-items-center",children:D.jsx(rr,{"code-path":"src/pages/home/Features.tsx:205:9",mode:"wait",children:t==="bars"?D.jsx(it.div,{"code-path":"src/pages/home/Features.tsx:207:13",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:"flex w-full flex-col gap-2",children:Kf.map((c,u)=>D.jsx($o,{"code-path":"src/pages/home/Features.tsx:216:17",label:gg[c],value:Fd[c],type:"electric",delay:u*60},c))},`bars-${i}`):D.jsx(it.div,{"code-path":"src/pages/home/Features.tsx:220:13",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0},transition:{duration:.3},children:D.jsx(Qb,{"code-path":"src/pages/home/Features.tsx:227:15",values:l,prog:a})},`radar-${i}`)})})]})}const Uc=[{year:1996,label:"GEN I",era:"gen1",rgb:Lt.normal.rgb},{year:1999,label:"GEN II",era:"gen2",rgb:Lt.electric.rgb},{year:2004,label:"GEN IV",era:"gen4",rgb:Lt.grass.rgb},{year:2010,label:"GEN V",era:"gen5",rgb:Lt.water.rgb},{year:2016,label:"3D ERA",era:"showdown",rgb:Lt.fire.rgb}];function t1(){const{t:r}=Vn(),[e,t]=Ke.useState(0),n=Uc[e],i=n.era==="gen1"?Sr.gen1RedBlue(25):n.era==="gen2"?Sr.gen2Crystal(25):n.era==="gen4"?Sr.gen4Platinum(25):n.era==="gen5"?Sr.gen5Animated(25):Sr.showdown(25);return D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:262:5",className:"flex flex-col gap-3",children:[D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:263:7",className:"relative mx-auto grid h-[148px] w-[148px] place-items-center",children:[D.jsx("div",{"code-path":"src/pages/home/Features.tsx:265:9","aria-hidden":!0,className:"absolute bottom-4 h-5 w-24 rounded-[50%] blur-[6px] transition-colors duration-500",style:{background:`rgba(${n.rgb},0.35)`,boxShadow:`0 0 24px rgba(${n.rgb},0.4)`}}),D.jsx(rr,{"code-path":"src/pages/home/Features.tsx:270:9",mode:"sync",children:D.jsx(it.img,{"code-path":"src/pages/home/Features.tsx:271:11",src:i,alt:`Pikachu — ${n.label} sprite`,draggable:!1,className:Oi("relative h-24 w-24 object-contain",n.era!=="showdown"&&"pixelated"),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.25}},n.year)})]}),D.jsx("input",{"code-path":"src/pages/home/Features.tsx:284:7",type:"range",min:0,max:Uc.length-1,step:1,value:e,onChange:s=>t(Number(s.target.value)),"aria-label":r("home.features.scrubberAria"),className:"w-full accent-gold"}),D.jsx("div",{"code-path":"src/pages/home/Features.tsx:294:7",className:"flex justify-between",children:Uc.map((s,a)=>D.jsx("button",{"code-path":"src/pages/home/Features.tsx:296:11",type:"button",onClick:()=>t(a),className:Oi("pixel-label text-[8px] transition-colors",a===e?"text-gold":"text-tx-muted hover:text-tx-secondary"),children:s.year},s.year))})]})}const n1=[{titleKey:"home.features.filterTitle",captionKey:"home.features.filterCaption",Demo:Jb},{titleKey:"home.features.statsTitle",captionKey:"home.features.statsCaption",Demo:e1},{titleKey:"home.features.museumTitle",captionKey:"home.features.museumCaption",Demo:t1}];function i1({titleKey:r,captionKey:e,Demo:t,index:n}){const{t:i}=Vn(),s=Ke.useRef(null),a=Xd(s,{once:!0,margin:"-20% 0px"});return D.jsxs(it.div,{"code-path":"src/pages/home/Features.tsx:327:5",ref:s,initial:{y:40,opacity:0,filter:"blur(8px)"},whileInView:{y:0,opacity:1,filter:"blur(0px)"},viewport:{once:!0,margin:"-20% 0px"},transition:{duration:.6,delay:n*.12,ease:Gf},className:"flex flex-col gap-4 rounded-xl border border-hairline bg-surface1 p-6 lg:aspect-[5/6]",children:[D.jsx(t,{"code-path":"src/pages/home/Features.tsx:335:7",live:a}),D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:336:7",className:"mt-auto",children:[D.jsx("h3",{"code-path":"src/pages/home/Features.tsx:337:9",className:"font-display text-lg font-bold",children:i(r)}),D.jsx("p",{"code-path":"src/pages/home/Features.tsx:338:9",className:"mt-1 font-sans text-sm text-tx-secondary",children:i(e)})]})]})}function r1(){const{t:r}=Vn();return D.jsxs("section",{"code-path":"src/pages/home/Features.tsx:347:5",className:"mx-auto max-w-content overflow-x-clip px-4 py-24 md:px-8",children:[D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:348:7",className:"mb-12 flex flex-col gap-4",children:[D.jsx("span",{"code-path":"src/pages/home/Features.tsx:349:9",className:"pixel-label text-[10px] text-gold",children:r("home.features.eyebrow")}),D.jsx("h2",{"code-path":"src/pages/home/Features.tsx:350:9",className:"font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]",children:r("home.features.title")})]}),D.jsx("div",{"code-path":"src/pages/home/Features.tsx:355:7",className:"grid gap-6 md:grid-cols-3",children:n1.map((e,t)=>D.jsx(i1,{"code-path":"src/pages/home/Features.tsx:357:11",titleKey:e.titleKey,captionKey:e.captionKey,Demo:e.Demo,index:t},e.titleKey))}),D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:362:7",className:"mt-10 flex flex-wrap items-center gap-5 rounded-lg border border-gold/35 bg-[linear-gradient(135deg,rgba(246,201,69,0.10),rgba(246,201,69,0.03))] px-6 py-6",children:[D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:363:9",className:"min-w-[220px] flex-1",children:[D.jsx("p",{"code-path":"src/pages/home/Features.tsx:364:11",className:"pixel-label text-[9px] text-gold",children:r("home.feedbackTeaser.eyebrow")}),D.jsx("h3",{"code-path":"src/pages/home/Features.tsx:365:11",className:"mt-1.5 font-display text-lg font-extrabold uppercase tracking-wide text-tx-primary",children:r("home.feedbackTeaser.title")}),D.jsx("p",{"code-path":"src/pages/home/Features.tsx:368:11",className:"mt-1.5 max-w-[56ch] font-sans text-[13px] leading-relaxed text-tx-secondary",children:r("home.feedbackTeaser.text")})]}),D.jsxs("div",{"code-path":"src/pages/home/Features.tsx:372:9",className:"flex flex-wrap items-center gap-3",children:[D.jsx(Dr,{"code-path":"src/pages/home/Features.tsx:373:11",to:"/feedback",className:"inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-4 font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-gold",children:r("home.feedbackTeaser.bugCta")}),D.jsx(Dr,{"code-path":"src/pages/home/Features.tsx:379:11",to:"/feedback",className:"inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-4 font-display text-[12px] font-bold uppercase tracking-wider text-tx-secondary transition-colors duration-200 hover:border-gold/50 hover:text-gold",children:r("home.feedbackTeaser.featureCta")})]})]})]})}const s1=[{target:1025,labelKey:"home.statsband.pokemon"},{target:18,labelKey:"home.statsband.types"},{target:9,labelKey:"home.statsband.generations"},{target:1e4,labelKey:"home.statsband.sprites",suffix:"+"}];function a1({target:r,format:e,delay:t}){const n=Ke.useRef(null),i=Xd(n,{once:!0,margin:"-20% 0px"}),[s,a]=Ke.useState(e(0));return Ke.useEffect(()=>{if(!i)return;const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches,l=ef(0,r,{duration:o?0:1.2,delay:t,ease:[.16,1,.3,1],onUpdate:c=>a(e(Math.round(c)))});return()=>l.stop()},[i,r,t,e]),D.jsx("span",{"code-path":"src/pages/home/StatsBand.tsx:32:5",ref:n,className:"font-display text-[40px] font-extrabold leading-none text-gold tabular-nums",children:s})}function o1(){const{t:r}=Vn(),e=ps(),t=(n,i="")=>`${n.toLocaleString(e==="de"?"de-DE":"en-US")}${i}`;return D.jsxs("section",{"code-path":"src/pages/home/StatsBand.tsx:44:5",className:"relative overflow-x-clip border-y border-hairline bg-surface1",children:[D.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:46:7","aria-hidden":!0,className:"absolute left-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]",style:{background:"radial-gradient(circle, rgba(69,200,255,0.10), transparent 70%)"}}),D.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:51:7","aria-hidden":!0,className:"absolute right-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]",style:{background:"radial-gradient(circle, rgba(255,122,69,0.10), transparent 70%)"}}),D.jsx("div",{"code-path":"src/pages/home/StatsBand.tsx:56:7",className:"relative mx-auto grid max-w-content grid-cols-2 gap-10 px-4 py-16 md:px-8 lg:grid-cols-4",children:s1.map((n,i)=>D.jsxs("div",{"code-path":"src/pages/home/StatsBand.tsx:58:11",className:"flex flex-col items-center gap-3 text-center",children:[D.jsx(a1,{"code-path":"src/pages/home/StatsBand.tsx:59:13",target:n.target,format:s=>t(s,n.suffix),delay:i*.15}),D.jsx("span",{"code-path":"src/pages/home/StatsBand.tsx:60:13",className:"pixel-label text-[10px] text-tx-muted",children:r(n.labelKey)})]},n.labelKey))})]})}const Od="pdx:preloader-done";function x1(){const[r,e]=Ke.useState(()=>{try{return!sessionStorage.getItem(Od)}catch{return!1}}),t=()=>{try{sessionStorage.setItem(Od,"1")}catch{}e(!1)};return D.jsxs(D.Fragment,{children:[D.jsx(rr,{"code-path":"src/pages/Home.tsx:37:7",children:r&&D.jsx(it.div,{"code-path":"src/pages/Home.tsx:39:11",exit:{opacity:0},transition:{duration:.5,ease:"easeOut"},className:"fixed inset-0 z-[100]",children:D.jsx(Vd,{"code-path":"src/pages/Home.tsx:45:13",variant:"page",onDone:t})},"preloader")}),D.jsx(Ub,{"code-path":"src/pages/Home.tsx:50:7",started:!r}),D.jsx(Ob,{"code-path":"src/pages/Home.tsx:51:7"}),D.jsx(Gb,{"code-path":"src/pages/Home.tsx:52:7"}),D.jsx(Xb,{"code-path":"src/pages/Home.tsx:53:7"}),D.jsx(qb,{"code-path":"src/pages/Home.tsx:54:7"}),D.jsx(Kb,{"code-path":"src/pages/Home.tsx:55:7"}),D.jsx(r1,{"code-path":"src/pages/Home.tsx:56:7"}),D.jsx(o1,{"code-path":"src/pages/Home.tsx:57:7"})]})}export{x1 as default};
