import{_ as B,G as I,p as N,H as $,I as D,b as i,o as r,c as g,d as e,w as t,B as F,e as m,f,k as y,F as V,q as j,l as a,t as l,J as L,K as P,L as z,g as k}from"./index.b2427561.js";const b=c=>(P("data-v-01c49e83"),c=c(),z(),c),M=b(()=>k("h2",null,"\u0418\u0449\u0443 \u043F\u043E\u043F\u0443\u0442\u0447\u0438\u043A\u0430",-1)),R=a("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0435\u0431\u044F"),T=a("\u0438\u043C\u044F"),q=a("\u0432\u043E\u0437\u0440\u0430\u0441\u0442"),E=a("\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435"),G=a("\u043F\u043E\u043F\u0443\u0442\u0447\u0438\u043A"),H=a("\u043D\u0430\u0447\u0430\u043B\u043E"),J=a("\u043A\u043E\u043D\u0435\u0446"),K=a("\u043F\u043E\u0436\u0435\u043B\u0430\u043D\u0438\u044F"),A=a("\u043E\u0442\u043A\u043B\u0438\u043A"),O=b(()=>k("span",{class:"mdi mdi-thumb-up-outline"},null,-1)),Q={__name:"CompanionsPage",setup(c){const v=I();let C=N(),p=$(D).smaller("md");const x=o=>new Date(o).toLocaleDateString("ru-Ru",{year:"2-digit",month:"2-digit",day:"2-digit"}),S=o=>{if(o>=10&&o<=20)return`${o} \u043B\u0435\u0442`;let _=o.split(""),n=_[_.length-1];return n==1?`${o} \u0433\u043E\u0434`:n==2||n==3||n==4?`${o} \u0433\u043E\u0434\u0430`:`${o} \u043B\u0435\u0442`};return(o,_)=>{const n=i("a-button"),s=i("a-col"),u=i("a-row"),h=i("a-divider");return r(),g("div",null,[e(F),e(u,{type:"flex",justify:"center"},{default:t(()=>[e(s,{xs:22,lg:12},{default:t(()=>[M,e(u,{type:"flex",justify:"center"},{default:t(()=>[e(s,{class:"d-flex justify-center"},{default:t(()=>[e(n,{class:"lets_go_btn ma-16",type:"primary",size:"large",onClick:_[0]||(_[0]=d=>m(C).push("/add-companion"))},{default:t(()=>[R]),_:1})]),_:1})]),_:1})]),_:1}),e(s,{xs:22,lg:16},{default:t(()=>[e(u,{class:"table_header"},{default:t(()=>[e(s,{xs:4,md:3},{default:t(()=>[T]),_:1}),e(s,{xs:4,md:2},{default:t(()=>[q]),_:1}),e(s,{xs:12,md:5},{default:t(()=>[E]),_:1}),e(s,{xs:4,md:3},{default:t(()=>[G]),_:1}),m(p)?(r(),f(h,{key:0,class:"ma-0"})):y("",!0),e(s,{xs:4,md:2},{default:t(()=>[H]),_:1}),e(s,{xs:4,md:2},{default:t(()=>[J]),_:1}),e(s,{xs:12,md:5},{default:t(()=>[K]),_:1}),e(s,{xs:4,md:2},{default:t(()=>[A]),_:1})]),_:1}),(r(!0),g(V,null,j(m(v).companions,(d,w)=>(r(),f(u,{key:w,class:L([d.gender=="Male"?"men":"women","mt-4 pa-8"]),style:{"text-align":"center"}},{default:t(()=>[e(s,{xs:4,md:3},{default:t(()=>[a(l(d.name),1)]),_:2},1024),e(s,{xs:4,md:2},{default:t(()=>[a(l(S(d.age)),1)]),_:2},1024),e(s,{xs:12,md:5},{default:t(()=>[a(l(d.direction),1)]),_:2},1024),e(s,{xs:4,md:3},{default:t(()=>[a(l(d.gender=="Male"?"\u043C\u0443\u0436":"\u0436\u0435\u043D"),1)]),_:2},1024),m(p)?(r(),f(h,{key:0,class:"ma-0"})):y("",!0),e(s,{xs:4,md:2},{default:t(()=>[a(l(x(d.start)),1)]),_:2},1024),e(s,{xs:4,md:2},{default:t(()=>[a(l(x(d.end)),1)]),_:2},1024),e(s,{xs:12,md:5},{default:t(()=>[a(l(d.description),1)]),_:2},1024),e(s,{xs:4,md:2},{default:t(()=>[e(n,{shape:"circle"},{default:t(()=>[O]),_:1})]),_:1})]),_:2},1032,["class"]))),128))]),_:1})]),_:1})])}}},X=B(Q,[["__scopeId","data-v-01c49e83"]]);export{X as default};
