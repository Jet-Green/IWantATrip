import{u as B,p as E,r as f,i as M,b as p,o as S,c as q,d as e,e as v,B as F,w as a,s as g,g as d,j as P,l as u,v as w}from"./index.b2427561.js";import{u as D,G as N}from"./guide.c7624d6a.js";import{_ as O}from"./ImageCropper.308ff051.js";const V=d("h2",null,"\u0414\u043E\u0431\u0430\u0432\u044C \u043E\u0431\u044A\u0435\u043A\u0442",-1),A=["onSubmit"],I=u(" \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 "),L=d("span",{class:"mdi mdi-12px mdi-plus"},null,-1),T=u(" \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u043E\u0442\u043E "),$={class:"d-flex ma-2",style:{"overflow-x":"scroll"}},H=["src"],J=d("h3",null,"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u043E\u0442\u043E?",-1),K={class:"d-flex justify-center"},Q=u("\u0414\u0430 "),W=u(" \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 "),X=u(" \u0410\u0434\u0440\u0435\u0441 "),Y=u(" \u0422\u0435\u043B\u0435\u0444\u043E\u043D "),Z=u(" \u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0435\u0442\u0438 "),ee=u("\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C"),se={__name:"AddGuideElement",setup(te){const k=D(),y=B(),U=E();let n=f(!1),i=f(!1),G=f(null),b=null,m=f();const o=M({image:"",name:"",address:"",phone:"",socialMedia:"",description:"",type:""});function j(c){n.value=!1,b=c;const t=URL.createObjectURL(c);m.value=t}function C(){m.value="",i.value=!1}function R(){o.type=y.query.type,k.createGuideElement(o).then(c=>{function t(){U.push("/"+y.query.type)}const r=c.data._id;let s=new FormData;s.append("guide-element-image",b,r+"_0.png"),N.uploadGuideElementImage(s).then(_=>{Object.assign(o,{image:"",name:"",address:"",phone:"",socialMedia:"",description:"",type:""}),b=null,m.value=null,w.config({duration:3,top:"90vh"}),w.success({content:"\u041E\u0431\u044A\u0435\u043A\u0442 \u0441\u043E\u0437\u0434\u0430\u043D!",onClose:t})})})}return(c,t)=>{const r=p("a-input"),s=p("a-col"),_=p("a-button"),x=p("a-modal"),z=p("a-textarea"),h=p("a-row");return S(),q("div",null,[e(F,{backRoute:"/"+v(y).query.type},null,8,["backRoute"]),e(h,{type:"flex",justify:"center"},{default:a(()=>[e(s,{xs:22,lg:12},{default:a(()=>[V,d("form",{action:"POST",onSubmit:P(R,["prevent"]),enctype:"multipart/form-data",ref_key:"newGuideElementForm",ref:G},[e(h,{gutter:[16,16]},{default:a(()=>[e(s,{span:24},{default:a(()=>[I,e(r,{placeholder:"\u041C\u0443\u0437\u0435\u0439",size:"large",value:o.name,"onUpdate:value":t[0]||(t[0]=l=>o.name=l)},null,8,["value"])]),_:1}),e(s,{span:24},{default:a(()=>[e(_,{onClick:t[1]||(t[1]=l=>g(n)?n.value=!0:n=!0),class:"mb-8",type:"dashed",block:""},{default:a(()=>[L,T]),_:1}),d("div",$,[d("img",{src:v(m),alt:"",class:"ma-4",style:{"max-width":"200px",cursor:"pointer"},onClick:t[2]||(t[2]=l=>{g(i)?i.value=!0:i=!0})},null,8,H),e(x,{visible:v(i),"onUpdate:visible":t[3]||(t[3]=l=>g(i)?i.value=l:i=l),footer:null},{default:a(()=>[J,d("div",K,[e(_,{class:"mt-16",type:"primary",size:"large",onClick:C},{default:a(()=>[Q]),_:1})])]),_:1},8,["visible"])])]),_:1}),e(s,{span:24},{default:a(()=>[W,e(z,{placeholder:"\u0411\u043E\u043B\u0435\u0435 1000 \u044D\u043A\u0441\u043F\u043E\u043D\u044F\u0442\u043E\u0432 \u0438\u0437 25 \u0441\u0442\u0440\u0430\u043D \u043C\u0438\u0440\u0430",rows:4,value:o.description,"onUpdate:value":t[4]||(t[4]=l=>o.description=l)},null,8,["value"])]),_:1}),e(s,{span:24},{default:a(()=>[X,e(r,{placeholder:"\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0430 2\u0410",size:"large",value:o.address,"onUpdate:value":t[5]||(t[5]=l=>o.address=l)},null,8,["value"])]),_:1}),e(s,{span:24},{default:a(()=>[Y,e(r,{placeholder:"79127528871",size:"large",value:o.phone,"onUpdate:value":t[6]||(t[6]=l=>o.phone=l)},null,8,["value"])]),_:1}),e(s,{span:24},{default:a(()=>[Z,e(r,{placeholder:"https://vk.com/qbitclub",size:"large",value:o.socialMedia,"onUpdate:value":t[7]||(t[7]=l=>o.socialMedia=l)},null,8,["value"])]),_:1})]),_:1}),e(h,{class:"d-flex justify-center"},{default:a(()=>[e(s,null,{default:a(()=>[e(_,{type:"primary","html-type":"submit",class:"lets_go_btn mt-8",size:"large"},{default:a(()=>[ee]),_:1})]),_:1})]),_:1})],40,A)]),_:1})]),_:1}),e(x,{visible:v(n),"onUpdate:visible":t[8]||(t[8]=l=>g(n)?n.value=l:n=l),footer:null},{default:a(()=>[e(O,{onAddImage:j})]),_:1},8,["visible"])])}}};export{se as default};
