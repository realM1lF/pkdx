import{r as C,j as q}from"./react-CAzfkKky.js";import{W as D,S as H,O as N,B as V,C as U,a as g,b as X,A as Y,P as k}from"./three-TvjUTm4R.js";const J=new U("#A8B0C4"),K=["#FF7A45","#45C8FF","#FFD60A"].map(w=>new U(w)),Q=`
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
`,Z=`
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;function $({className:w}){const A=C.useRef(null);return C.useEffect(()=>{const h=A.current;if(!h)return;const t=h.parentElement;if(!t)return;const G=window.matchMedia("(prefers-reduced-motion: reduce)").matches,l=window.matchMedia("(pointer: coarse)").matches?117:350,d=new D({canvas:h,alpha:!0,antialias:!1});d.setClearColor(0,0);const x=new H,i=new N(-1,1,1,-1,-10,10),s=new V,c=new Float32Array(l*3),M=new Float32Array(l),u=new Float32Array(l*4),f=[];let p=t.clientWidth,o=t.clientHeight;for(let e=0;e<l;e++){let r=J,a=.3;Math.random()>.6&&(r=K[Math.floor(Math.random()*3)],a=.5),u[e*4]=r.r,u[e*4+1]=r.g,u[e*4+2]=r.b,u[e*4+3]=a,M[e]=1+Math.random()*2,f.push({bx:(Math.random()-.5)*p,by:(Math.random()-.5)*o,vy:2+Math.random()*4,phase:Math.random()*Math.PI*2,swayAmp:4+Math.random()*8,dx:0,dy:0})}s.setAttribute("position",new g(c,3)),s.setAttribute("aSize",new g(M,1)),s.setAttribute("aColor",new g(u,4));const F=new X({vertexShader:Q,fragmentShader:Z,transparent:!0,depthWrite:!1,blending:Y,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}}),T=new k(s,F);x.add(T);const P=()=>{p=t.clientWidth,o=t.clientHeight,d.setSize(p,o,!1),d.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.left=-p/2,i.right=p/2,i.top=o/2,i.bottom=-o/2,i.updateProjectionMatrix()};P();const m={x:-9999,y:-9999},R=e=>{const r=h.getBoundingClientRect();m.x=e.clientX-r.left-p/2,m.y=-(e.clientY-r.top-o/2)},S=()=>{m.x=-9999,m.y=-9999};t.addEventListener("pointermove",R,{passive:!0}),t.addEventListener("pointerleave",S,{passive:!0});const E=new ResizeObserver(P);E.observe(t);let y=0,z=!0;const b=120,B=e=>{if(y=requestAnimationFrame(B),!z)return;const r=e/1e3;for(let a=0;a<l;a++){const n=f[a],O=n.bx+Math.sin(r*.4+n.phase)*n.swayAmp+n.dx,_=((n.by+r*n.vy+o/2)%(o+40)+o+40)%(o+40)-o/2-20+n.dy,j=O-m.x,I=_-m.y,v=Math.hypot(j,I);if(v<b&&v>.01){const W=(b-v)/b*1.6;n.dx+=j/v*W,n.dy+=I/v*W}n.dx*=.95,n.dy*=.95,c[a*3]=O,c[a*3+1]=_,c[a*3+2]=0}s.attributes.position.needsUpdate=!0,d.render(x,i)},L=new IntersectionObserver(([e])=>{z=e.isIntersecting});if(L.observe(t),G){for(let e=0;e<l;e++)c[e*3]=f[e].bx,c[e*3+1]=f[e].by,c[e*3+2]=0;s.attributes.position.needsUpdate=!0,d.render(x,i)}else y=requestAnimationFrame(B);return()=>{cancelAnimationFrame(y),L.disconnect(),E.disconnect(),t.removeEventListener("pointermove",R),t.removeEventListener("pointerleave",S),s.dispose(),F.dispose(),d.dispose()}},[]),q.jsx("canvas",{ref:A,className:w,style:{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"},"aria-hidden":!0})}const re=C.memo($);export{re as default};
