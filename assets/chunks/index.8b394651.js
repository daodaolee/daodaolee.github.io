import{j as re,k as P,g as te,l as ne,m as ae,q as oe,s as se,v as ue,w as I,x as N,y as ie,z as le}from"../app.ec7a89e7.js";var L;const U=typeof window<"u",fe=e=>typeof e=="function",ce=e=>typeof e=="string",pe=()=>{};U&&((L=window==null?void 0:window.navigator)==null?void 0:L.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function A(e){return typeof e=="function"?e():te(e)}function de(e,r){function t(...n){e(()=>r.apply(this,n),{fn:r,thisArg:this,args:n})}return t}const q=e=>e();function ve(e=q){const r=P(!0);function t(){r.value=!1}function n(){r.value=!0}return{isActive:r,pause:t,resume:n,eventFilter:(...s)=>{r.value&&e(...s)}}}function _e(e){return e}function G(e){return se()?(ue(e),!0):!1}function Oe(e){return typeof e=="function"?I(e):P(e)}function K(e,r=!0){ne()?ae(e):r?e():oe(e)}function nr(e=!1,r={}){const{truthyValue:t=!0,falsyValue:n=!1}=r,a=re(e),s=P(e);function i(u){if(arguments.length)return s.value=u,s.value;{const c=A(t);return s.value=s.value===c?A(n):c,s.value}}return a?i:[s,i]}var M=Object.getOwnPropertySymbols,ye=Object.prototype.hasOwnProperty,ge=Object.prototype.propertyIsEnumerable,me=(e,r)=>{var t={};for(var n in e)ye.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(e!=null&&M)for(var n of M(e))r.indexOf(n)<0&&ge.call(e,n)&&(t[n]=e[n]);return t};function he(e,r,t={}){const n=t,{eventFilter:a=q}=n,s=me(n,["eventFilter"]);return N(e,de(a,r),s)}var we=Object.defineProperty,Pe=Object.defineProperties,be=Object.getOwnPropertyDescriptors,C=Object.getOwnPropertySymbols,X=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable,T=(e,r,t)=>r in e?we(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Se=(e,r)=>{for(var t in r||(r={}))X.call(r,t)&&T(e,t,r[t]);if(C)for(var t of C(r))Y.call(r,t)&&T(e,t,r[t]);return e},$e=(e,r)=>Pe(e,be(r)),je=(e,r)=>{var t={};for(var n in e)X.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(e!=null&&C)for(var n of C(e))r.indexOf(n)<0&&Y.call(e,n)&&(t[n]=e[n]);return t};function Ee(e,r,t={}){const n=t,{eventFilter:a}=n,s=je(n,["eventFilter"]),{eventFilter:i,pause:u,resume:c,isActive:l}=ve(a);return{stop:he(e,r,$e(Se({},s),{eventFilter:i})),pause:u,resume:c,isActive:l}}function Ie(e){var r;const t=A(e);return(r=t==null?void 0:t.$el)!=null?r:t}const S=U?window:void 0;function Ne(...e){let r,t,n,a;if(ce(e[0])||Array.isArray(e[0])?([t,n,a]=e,r=S):[r,t,n,a]=e,!r)return pe;Array.isArray(t)||(t=[t]),Array.isArray(n)||(n=[n]);const s=[],i=()=>{s.forEach(f=>f()),s.length=0},u=(f,_,v)=>(f.addEventListener(_,v,a),()=>f.removeEventListener(_,v,a)),c=N(()=>Ie(r),f=>{i(),f&&s.push(...t.flatMap(_=>n.map(v=>u(f,_,v))))},{immediate:!0,flush:"post"}),l=()=>{c(),i()};return G(l),l}function Ae(e,r=!1){const t=P(),n=()=>t.value=Boolean(e());return n(),K(n,r),t}function Ce(e,r={}){const{window:t=S}=r,n=Ae(()=>t&&"matchMedia"in t&&typeof t.matchMedia=="function");let a;const s=P(!1),i=()=>{!a||("removeEventListener"in a?a.removeEventListener("change",u):a.removeListener(u))},u=()=>{!n.value||(i(),a=t.matchMedia(Oe(e).value),s.value=a.matches,"addEventListener"in a?a.addEventListener("change",u):a.addListener(u))};return ie(u),G(()=>i()),s}const D=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},F="__vueuse_ssr_handlers__";D[F]=D[F]||{};const De=D[F];function Z(e,r){return De[e]||r}function Fe(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}var Le=Object.defineProperty,k=Object.getOwnPropertySymbols,Me=Object.prototype.hasOwnProperty,Te=Object.prototype.propertyIsEnumerable,Q=(e,r,t)=>r in e?Le(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,R=(e,r)=>{for(var t in r||(r={}))Me.call(r,t)&&Q(e,t,r[t]);if(k)for(var t of k(r))Te.call(r,t)&&Q(e,t,r[t]);return e};const ke={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}};function Qe(e,r,t,n={}){var a;const{flush:s="pre",deep:i=!0,listenToStorageChanges:u=!0,writeDefaults:c=!0,mergeDefaults:l=!1,shallow:f,window:_=S,eventFilter:v,onError:m=o=>{console.error(o)}}=n,p=(f?le:P)(r);if(!t)try{t=Z("getDefaultStorage",()=>{var o;return(o=S)==null?void 0:o.localStorage})()}catch(o){m(o)}if(!t)return p;const O=A(r),$=Fe(O),g=(a=n.serializer)!=null?a:ke[$],{pause:d,resume:h}=Ee(p,()=>w(p.value),{flush:s,deep:i,eventFilter:v});return _&&u&&Ne(_,"storage",j),j(),p;function w(o){try{o==null?t.removeItem(e):t.setItem(e,g.write(o))}catch(y){m(y)}}function b(o){d();try{const y=o?o.newValue:t.getItem(e);if(y==null)return c&&O!==null&&t.setItem(e,g.write(O)),O;if(!o&&l){const E=g.read(y);return fe(l)?l(E,O):$==="object"&&!Array.isArray(E)?R(R({},O),E):E}else return typeof y!="string"?y:g.read(y)}catch(y){m(y)}finally{h()}}function j(o){if(!(o&&o.storageArea!==t)){if(o&&o.key===null){p.value=O;return}o&&o.key!==e||(p.value=b(o))}}}function ee(e){return Ce("(prefers-color-scheme: dark)",e)}var Re=Object.defineProperty,V=Object.getOwnPropertySymbols,Ve=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable,x=(e,r,t)=>r in e?Re(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,We=(e,r)=>{for(var t in r||(r={}))Ve.call(r,t)&&x(e,t,r[t]);if(V)for(var t of V(r))xe.call(r,t)&&x(e,t,r[t]);return e};function Je(e={}){const{selector:r="html",attribute:t="class",initialValue:n="auto",window:a=S,storage:s,storageKey:i="vueuse-color-scheme",listenToStorageChanges:u=!0,storageRef:c,emitAuto:l}=e,f=We({auto:"",light:"light",dark:"dark"},e.modes||{}),_=ee({window:a}),v=I(()=>_.value?"dark":"light"),m=c||(i==null?P(n):Qe(i,n,s,{window:a,listenToStorageChanges:u})),p=I({get(){return m.value==="auto"&&!l?v.value:m.value},set(d){m.value=d}}),O=Z("updateHTMLAttrs",(d,h,w)=>{const b=a==null?void 0:a.document.querySelector(d);if(!!b)if(h==="class"){const j=w.split(/\s/g);Object.values(f).flatMap(o=>(o||"").split(/\s/g)).filter(Boolean).forEach(o=>{j.includes(o)?b.classList.add(o):b.classList.remove(o)})}else b.setAttribute(h,w)});function $(d){var h;const w=d==="auto"?v.value:d;O(r,t,(h=f[w])!=null?h:w)}function g(d){e.onChanged?e.onChanged(d,$):$(d)}return N(p,g,{flush:"post",immediate:!0}),l&&N(v,()=>g(p.value),{flush:"post"}),K(()=>g(p.value)),p}var ze=Object.defineProperty,Be=Object.defineProperties,He=Object.getOwnPropertyDescriptors,W=Object.getOwnPropertySymbols,Ue=Object.prototype.hasOwnProperty,qe=Object.prototype.propertyIsEnumerable,J=(e,r,t)=>r in e?ze(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Ge=(e,r)=>{for(var t in r||(r={}))Ue.call(r,t)&&J(e,t,r[t]);if(W)for(var t of W(r))qe.call(r,t)&&J(e,t,r[t]);return e},Ke=(e,r)=>Be(e,He(r));function ar(e={}){const{valueDark:r="dark",valueLight:t="",window:n=S}=e,a=Je(Ke(Ge({},e),{onChanged:(u,c)=>{var l;e.onChanged?(l=e.onChanged)==null||l.call(e,u==="dark"):c(u)},modes:{dark:r,light:t}})),s=ee({window:n});return I({get(){return a.value==="dark"},set(u){u===s.value?a.value="auto":a.value=u?"dark":"light"}})}var z;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(z||(z={}));var Xe=Object.defineProperty,B=Object.getOwnPropertySymbols,Ye=Object.prototype.hasOwnProperty,Ze=Object.prototype.propertyIsEnumerable,H=(e,r,t)=>r in e?Xe(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,er=(e,r)=>{for(var t in r||(r={}))Ye.call(r,t)&&H(e,t,r[t]);if(B)for(var t of B(r))Ze.call(r,t)&&H(e,t,r[t]);return e};const rr={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};er({linear:_e},rr);export{nr as a,ar as u};
