import{_ as m,u as g,r as y,a as x,b as d,o as u,c as h,d as a,e as t,f as i,w as s,g as k,h as l,t as n}from"./index.0a2bdc2d.js";const v=["src"],w={__name:"CompanyInfoPage",setup(C){const r=g().query._id,p="/watch";let e=y({});return x.get(`http://51.250.120.112:3030/guide/get-by-id?_id=${r}`).then(c=>{e.value=c.data,console.log(e.value)}).catch(c=>{console.log(c)}),(c,B)=>{const f=d("a-spin"),o=d("a-col"),_=d("a-row");return u(),h("div",null,[a(k,{backRoute:p}),t(e)._id?(u(),i(_,{key:1,display:"flex",justify:"center",gutter:[16,16]},{default:s(()=>[a(o,{xs:24,lg:24,class:"title"},{default:s(()=>[l("h1",null,n(t(e).name),1)]),_:1}),a(o,{xs:22,md:6,lg:5},{default:s(()=>[a(_,{display:"flex"},{default:s(()=>[l("img",{src:t(e).image,alt:"",srcset:""},null,8,v)]),_:1})]),_:1}),a(o,{xs:22,md:12,lg:10,class:"content"},{default:s(()=>[a(o,{xs:22,class:"description"},{default:s(()=>[l("h3",null,n(t(e).description),1)]),_:1}),a(o,{xs:22,md:16,lg:16,class:"time",style:{display:"flex","flex-direction":"column"}},{default:s(()=>[l("span",null,"\u0410\u0434\u0440\u0435\u0441: "+n(t(e).address),1),l("span",null,"\u0422\u0435\u043B\u0435\u0444\u043E\u043D: "+n(t(e).phone),1),l("span",null,"\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0435\u0442\u0438: "+n(t(e).socialMedia),1)]),_:1})]),_:1})]),_:1})):(u(),i(_,{key:0},{default:s(()=>[a(o,{span:24,class:"d-flex justify-center"},{default:s(()=>[a(f,{size:"large"})]),_:1})]),_:1}))])}}},P=m(w,[["__scopeId","data-v-964246e4"]]);export{P as default};
