import{stage,img,place,fitStage,backLink,escapeHTML,creamPaper,reducedMotion}from'./shared.js';
import{browseProjects}from'./router.js';
import{revealAbout}from'./archive-reveal.js';
import{installStudentWork}from'./student-work.js';
export function renderAbout(root,reference){
 root.innerHTML=backLink('choose','← CHOOSE')+stage('about');const el=root.querySelector('.stage');
 el.innerHTML=[['03_ABOUT_BLUE_CARD_HOLE_EDGE',155,27,1332,860],['03_ABOUT_FOLDER_KRAFT_BACK',-36,108,680.376,699],['03_ABOUT_BLUE_CARD_BG',8.03,150.42,600.024,602.013],['03_ABOUT_PROFILE_PHOTO',133.76,206.32,214.932,243.66]].map(([name,x,y,w,h])=>`<div class="about-layer" data-about-asset="${name}" style="${place(x,y,w,h)}">${name==='03_ABOUT_BLUE_CARD_HOLE_EDGE'?creamPaper():img(name,'',name.includes('PHOTO')?'曹雨晨的照片':'')}</div>`).join('');
 const texts=[];function walk(n){if(n.type==='TEXT')texts.push(n);n.children?.forEach(walk)}walk(reference);
 const flowIds=new Set(['3:192','3:193','3:194','3:195','3:196','3:197','3:201','3:203','3:205','3:209','3:210','3:211']);
 const text=id=>escapeHTML(texts.find(n=>n.id===id).text.replace(/[\r\n]+/g,' ').replace(/,\s*/g,', ').trim());
 el.insertAdjacentHTML('beforeend',texts.filter(n=>!flowIds.has(n.id)).map(n=>`<p data-node-id="${n.id}" class="about-copy ${['科研经历','专业技能'].includes(n.text)?'about-heading':n.id==='3:188'?'about-bullet-heading':''}" style="left:${n.id==='3:198'?611:n.x}px;top:${n.y}px;width:${n.width}px;font-size:${n.fontSize||12}px;">${escapeHTML(n.text)}</p>`).join(''));
 el.insertAdjacentHTML('beforeend',`<section class="about-publications"><h2 class="about-bullet-heading">${text('3:201')}</h2><article><p>${text('3:195')}</p><p class="paper-title">${text('3:194')}</p><p class="paper-authors">${text('3:197')}</p></article><article><p>${text('3:196')}</p><p class="paper-title">${text('3:192')}</p><p class="paper-authors">${text('3:193')}</p></article><div class="about-research-result"><h2 class="about-bullet-heading">${text('3:203')}</h2><p>${text('3:205')}</p></div></section><section class="about-skills"><p>设计<br>服务设计 / 用户研究 / 交互设计<br>界面设计 / 信息可视化 / 视觉设计</p><p>AI与数字实践<br>生成式人工智能 / 提示词设计<br><span class="skill-term">Vibe Coding</span> / <span class="skill-term">AI辅助原型开发</span></p><p>软件<br>Figma / ChatGPT / Codex<br>Photoshop / Canvas / Tobii</p></section>`);
 el.insertAdjacentHTML('beforeend',`<aside class="about-contact" aria-label="联系方式"><img class="about-contact-paper" src="assets/about/contact-paper.png" alt="" draggable="false"><address class="about-contact-details"><div><span>TEL</span><a href="tel:13913902786">13913902786</a></div><div><span>E-mail</span><a href="mailto:2131688946@qq.com">2131688946@qq.com</a></div></address></aside><h1 class="about-title"><img src="assets/about/about-title.svg" alt="About Me" draggable="false"></h1>`);
 const composition=document.createElement('div');composition.className='about-composition';composition.append(...el.childNodes);el.append(composition);
 composition.insertAdjacentHTML('beforeend','<button class="about-browse-projects">阅览我的项目 <span aria-hidden="true">→</span></button>');
 let disposed=false,departure;
 composition.querySelector('.about-browse-projects').onclick=async e=>{
  e.currentTarget.disabled=true;
  departure=composition.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 8px'}],{duration:reducedMotion.matches?80:220,fill:'forwards',easing:'ease'});
  await departure.finished.catch(()=>{});if(!disposed)browseProjects();
 };
 const unfit=fitStage(root),stopStudentWork=installStudentWork(el),stopReveal=revealAbout(el);return()=>{disposed=true;departure?.cancel();stopStudentWork();stopReveal();unfit();};
}
