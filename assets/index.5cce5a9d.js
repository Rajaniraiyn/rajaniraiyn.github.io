const u=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}};u();const l=window.matchMedia("(prefers-color-scheme: dark)")?"dark":"light";localStorage.getItem("theme")===null&&localStorage.setItem("theme",l);const c=localStorage.getItem("theme")||l;customElements.define("theme-toggle",class extends HTMLElement{connectedCallback(){const a=this.attachShadow({mode:"open"});a.innerHTML=`<style>
.toggleWrapper {
    overflow: hidden;
    transform: scale(0.65)
}

.toggleWrapper input {
    position: absolute;
    left: -99em
}

.toggle,.toggle__handler {
    display: inline-block;
    position: relative
}

.toggle {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    width: 90px;
    height: 50px;
    background-color: #83d8ff;
    border-radius: 84px;
    transition: background-color 200ms cubic-bezier(.445,.05,.55,.95)
}

.toggle__handler {
    z-index: 1;
    top: 3px;
    left: 3px;
    width: 44px;
    height: 44px;
    background-color: #ffcf96;
    border-radius: 50px;
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
    transition: all 400ms cubic-bezier(.68,-.55,.265,1.55);
    transform: rotate(-45deg)
}

.toggle__handler .crater {
    position: absolute;
    background-color: #e8cda5;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    border-radius: 100%
}

.toggle__handler .crater--1 {
    top: 18px;
    left: 10px;
    width: 4px;
    height: 4px
}

.toggle__handler .crater--2 {
    top: 28px;
    left: 22px;
    width: 6px;
    height: 6px
}

.toggle__handler .crater--3 {
    top: 10px;
    left: 25px;
    width: 8px;
    height: 8px
}

.star {
    position: absolute;
    background-color: #fff;
    transition: all 300ms cubic-bezier(.445,.05,.55,.95);
    border-radius: 50%
}

.star--1,.star--2,.star--3 {
    top: 10px;
    left: 35px;
    z-index: 0;
    width: 30px;
    height: 3px
}

.star--2,.star--3 {
    top: 18px;
    left: 28px;
    z-index: 1
}

.star--3 {
    top: 27px;
    left: 40px;
    z-index: 0
}

.star--4,.star--5,.star--6 {
    opacity: 0;
    transition: all 300ms 0 cubic-bezier(.445,.05,.55,.95);
    top: 16px;
    left: 11px;
    z-index: 0;
    width: 2px;
    height: 2px;
    transform: translate3d(3px,0,0)
}

.star--5,.star--6 {
    top: 32px;
    left: 17px;
    width: 3px;
    height: 3px
}

.star--6 {
    top: 36px;
    left: 28px;
    width: 2px;
    height: 2px
}

input:checked+.toggle {
    background-color: #749dd6
}

input:checked+.toggle:before {
    color: #749ed7
}

input:checked+.toggle:after {
    color: #fff
}

input:checked+.toggle .toggle__handler {
    background-color: #ffe5b5;
    transform: translate3d(40px,0,0) rotate(0)
}

input:checked+.toggle .toggle__handler .crater {
    opacity: 1
}

input:checked+.toggle .star--1 {
    width: 2px;
    height: 2px
}

input:checked+.toggle .star--2 {
    width: 4px;
    height: 4px;
    transform: translate3d(-5px,0,0)
}

input:checked+.toggle .star--3 {
    width: 2px;
    height: 2px;
    transform: translate3d(-7px,0,0)
}

input:checked+.toggle .star--4,input:checked+.toggle .star--5,input:checked+.toggle .star--6 {
    opacity: 1;
    transform: translate3d(0,0,0)
}

input:checked+.toggle .star--4 {
    transition: all 300ms 200ms cubic-bezier(.445,.05,.55,.95)
}

input:checked+.toggle .star--5 {
    transition: all 300ms 300ms cubic-bezier(.445,.05,.55,.95)
}

input:checked+.toggle .star--6 {
    transition: all 300ms 400ms cubic-bezier(.445,.05,.55,.95)
}
</style>
<div class="toggleWrapper" >
  <input type="checkbox" class="dn" id="dn" oninput="toggleTheme()" ${c==="dark"?"checked":null} />
  <label for="dn" class="toggle">
    <span class="toggle__handler">
      <span class="crater crater--1"></span>
      <span class="crater crater--2"></span>
      <span class="crater crater--3"></span>
    </span>
    <span class="star star--1"></span>
    <span class="star star--2"></span>
    <span class="star star--3"></span>
    <span class="star star--4"></span>
    <span class="star star--5"></span>
    <span class="star star--6"></span>
  </label>
</div>`}});function i(a){localStorage.setItem("theme",a),document.documentElement.setAttribute("data-theme",a)}function f(){localStorage.getItem("theme")==="dark"?i("light"):i("dark")}window.toggleTheme=f;i(c);const m="modulepreload",d={},x="/",b=function(s,n){return!n||n.length===0?s():Promise.all(n.map(o=>{if(o=`${x}${o}`,o in d)return;d[o]=!0;const e=o.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${t}`))return;const r=document.createElement("link");if(r.rel=e?"stylesheet":m,e||(r.as="script",r.crossOrigin=""),r.href=o,document.head.appendChild(r),e)return new Promise((g,h)=>{r.addEventListener("load",g),r.addEventListener("error",h)})})).then(()=>s())};typeof window!="undefined"&&b(()=>import("./pwa.d07d7dff.js"),[]);const p=document.getElementById("scroll-to-top"),k=document.getElementsByClassName("header-image")[0],w=new IntersectionObserver(y);w.observe(k);function y(a){const{intersectionRatio:s}=a[0];s===0?p.classList.add("active"):s>0&&p.classList.remove("active")}const _=document.getElementById("obj-rocket");window.onload=()=>{setTimeout(()=>{_.style.transform="translate(0,0)"},1e3)};
