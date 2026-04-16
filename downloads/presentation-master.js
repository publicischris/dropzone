const presentationMasterBootstrap=()=>{
  'use strict';

  const runtimeSourceGlobal=typeof window!=='undefined'? (window.__presentationMasterSource||null) : null;
  const stage=document.getElementById('stage');
  const toolbar=document.getElementById('toolbar');
  const helpDialog=document.getElementById('helpDialog');
  const isAuthoringEnabled=!document.documentElement.hasAttribute('data-export-build');
  const currentScript=document.currentScript;
  const appScriptSourcePromise=(async()=>{
    if(runtimeSourceGlobal) return runtimeSourceGlobal;
    if(!currentScript) return null;
    const inlineContent=currentScript.textContent?.trim();
    if(inlineContent){
      return currentScript.textContent;
    }
    const src=currentScript.getAttribute('src');
    if(!src) return null;
    try{
      const response=await fetch(new URL(src, document.location.href));
      if(!response.ok) return null;
      return await response.text();
    }catch(err){
      return null;
    }
  })();
  const wizardOverlay=isAuthoringEnabled? document.getElementById('configWizard') : null;
  const slidesListEl=isAuthoringEnabled && wizardOverlay? wizardOverlay.querySelector('#wizardSlidesList') : null;
  const stepButtons=isAuthoringEnabled && wizardOverlay? [...wizardOverlay.querySelectorAll('[data-step-target]')] : [];
  const stepSections=isAuthoringEnabled && wizardOverlay? [...wizardOverlay.querySelectorAll('.wizard-step')] : [];

  const defaults={
    meta:{title:'Präsentation',description:'Präsentations-Master',date:'auto',locale:'de-DE',timezone:'Europe/Berlin'},
    brand:{showOnSlides:true,logo:{}},
    theme:{
      fonts:{},
      colors:{},
      typography:{
        h1:{size:88, weight:800},
        h2:{size:46, weight:700},
        h3:{size:28, weight:700},
        h4:{size:22, weight:700},
        body:{size:22, weight:400},
        small:{size:16, weight:500},
        statLabel:{size:18, weight:600},
        statValue:{size:64, weight:800},
        statUnit:{size:24, weight:600}
      }
    },
    toolbar:{filename:'presentation.html',showFullscreen:true,showExport:true,showPrint:true},
    help:{
      show:true,
      text:'Tasten: <span class="kbd">←</span>/<span class="kbd">→</span> · <span class="kbd">f</span> Vollbild · <span class="kbd">p</span> PDF · <span class="kbd">e</span> Export'
    },
    footer:{left:'',right:'Seite {current}/{total}'},
    slides:[]
  };

  let rawConfig=clone(window.presentationConfig||{});
  window.presentationConfig=clone(rawConfig);
  let config=mergeDeep(defaults, rawConfig);
  let wizardState=clone(rawConfig);
  let wizardStep=0;
  let wizardDirty=false;
  const slideCollapseState=new WeakMap();
  const basicsSectionCollapseState={meta:false, branding:false, toolbar:false, help:false};
  const themeSectionCollapseState={fonts:false, typography:false, colors:false};

  const ui=setupUI();
  const wizard=setupWizard();

  render();

  function render(){
    config=mergeDeep(defaults, rawConfig);
    applyMeta(config.meta);
    applyTheme(config.theme);
    applyHelp(config.help);
    buildSlides(config);
    setPages();
    ui.updateSlides();
    ui.applyToolbar(config.toolbar||{});
  }

  function updateConfig(newConfig){
    rawConfig=clone(newConfig||{});
    window.presentationConfig=clone(rawConfig);
    render();
  }

  function setupUI(){
    const navLeft=document.getElementById('navLeft');
    const navRight=document.getElementById('navRight');
    const btnPrev=document.getElementById('btnPrev');
    const btnNext=document.getElementById('btnNext');
    const btnFull=document.getElementById('btnFull');
    const btnExport=document.getElementById('btnExport');
    const btnPrint=document.getElementById('btnPrint');
    const btnWizard=document.getElementById('btnWizard');
    let slides=[]; let index=0; let hideTimer=null;

    function updateSlides(){
      slides=[...stage.querySelectorAll('.slide')];
      index=0;
      slides.forEach((slide, i)=>slide.setAttribute('aria-hidden', i===0?'false':'true'));
      fit();
    }

    function show(i){
      if(!slides.length) return;
      index=Math.max(0, Math.min(i, slides.length-1));
      slides.forEach((slide, idx)=>slide.setAttribute('aria-hidden', idx===index?'false':'true'));
      revealToolbar();
    }

    function next(){show(index+1);} function prev(){show(index-1);} show(0);

    function fit(){
      const sw=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--slide-w'))||1600;
      const sh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--slide-h'))||900;
      const padding=48;
      const vw=window.innerWidth-padding;
      const vh=window.innerHeight-padding;
      const scale=Math.min(vw/sw, vh/sh);
      stage.style.transform=`scale(${scale})`;
    }
    window.addEventListener('resize', fit, {passive:true});

    function revealToolbar(){
      toolbar.classList.add('visible');
      clearTimeout(hideTimer);
      hideTimer=setTimeout(()=>toolbar.classList.remove('visible'),2200);
    }

    if(btnNext) btnNext.addEventListener('click', next);
    if(btnPrev) btnPrev.addEventListener('click', prev);
    navRight.addEventListener('click', next);
    navLeft.addEventListener('click', prev);
    document.addEventListener('mousemove', ()=>{ if(!wizard.isOpen()) revealToolbar(); }, {passive:true});
    document.addEventListener('keydown', e=>{
      if(wizard.isOpen()){
        if(e.key==='Escape'){ wizard.close(); }
        return;
      }
      if(e.key==='ArrowRight'){ next(); }
      if(e.key==='ArrowLeft'){ prev(); }
      if(e.key==='f' && (config.toolbar?.showFullscreen!==false)){ toggleFull(); }
      if(e.key==='p' && (config.toolbar?.showPrint!==false)){ window.print(); }
      if(isAuthoringEnabled && e.key==='e' && (config.toolbar?.showExport!==false)){ exportHTML(); }
      if(isAuthoringEnabled && e.key==='w'){ wizard.open(); }
    });

    function toggleFull(){
      if(!document.fullscreenElement){ document.documentElement.requestFullscreen?.(); }
      else{ document.exitFullscreen?.(); }
    }
    if(btnFull) btnFull.addEventListener('click', ()=>{ if(config.toolbar?.showFullscreen!==false) toggleFull(); });
    if(btnExport){
      if(isAuthoringEnabled){
        btnExport.addEventListener('click', ()=>{ if(config.toolbar?.showExport!==false) exportHTML(); });
      }else{
        btnExport.style.display='none';
      }
    }
    if(btnPrint) btnPrint.addEventListener('click', ()=>{ if(config.toolbar?.showPrint!==false) window.print(); });
    if(btnWizard){
      if(isAuthoringEnabled){
        btnWizard.addEventListener('click', ()=>wizard.open());
      }else{
        btnWizard.style.display='none';
      }
    }

    function applyToolbar(settings){
      if(btnFull) btnFull.style.display=settings.showFullscreen===false? 'none' : '';
      if(btnExport){
        if(isAuthoringEnabled){
          btnExport.style.display=settings.showExport===false? 'none' : '';
        }else{
          btnExport.style.display='none';
        }
      }
      if(btnPrint) btnPrint.style.display=settings.showPrint===false? 'none' : '';
      if(btnWizard) btnWizard.style.display=isAuthoringEnabled? '' : 'none';
    }

    return {updateSlides,applyToolbar};
  }

  function setupWizard(){
    if(!isAuthoringEnabled || !wizardOverlay || !slidesListEl){
      return {open:()=>{}, close:()=>{}, isOpen:()=>false};
    }
    function open(){
      wizardState=clone(rawConfig);
      normaliseWizardState(wizardState);
      wizardStep=0;
      wizardDirty=false;
      wizardOverlay.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      populateGeneralFields();
      applyBasicsSectionStates();
      applyThemeSectionStates();
      renderSlidesEditor();
      updateStep();
      updateNavButtons();
    }

    function requestClose(){
      if(wizardDirty && !window.confirm('Änderungen verwerfen?')) return;
      wizardDirty=false;
      wizardOverlay.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    }

    function isOpen(){
      return wizardOverlay.getAttribute('aria-hidden')==='false';
    }

    wizardOverlay.addEventListener('click', onWizardClick);
    wizardOverlay.addEventListener('click', e=>{
      if(e.target===wizardOverlay){
        requestClose();
      }
    });
    wizardOverlay.addEventListener('input', onWizardInput, true);
    wizardOverlay.addEventListener('change', onWizardInput, true);

    function onWizardClick(event){
      const target=event.target.closest('[data-action]');
      if(!target) return;
      event.preventDefault();
      const action=target.dataset.action;
      switch(action){
        case 'close':
          requestClose();
          break;
        case 'next':
          wizardStep=Math.min(stepSections.length-1, wizardStep+1);
          updateStep();
          updateNavButtons();
          break;
        case 'prev':
          wizardStep=Math.max(0, wizardStep-1);
          updateStep();
          updateNavButtons();
          break;
        case 'download':
          downloadConfig(wizardState);
          break;
        case 'apply':
          updateConfig(wizardState);
          wizardDirty=false;
          wizardOverlay.setAttribute('aria-hidden','true');
          document.body.style.overflow='';
          break;
        case 'add-slide':
          addSlide(target.dataset.type||'content');
          break;
        case 'remove-slide':
          removeSlide(Number(target.dataset.index));
          break;
        case 'move-slide':
          moveSlide(Number(target.dataset.index), target.dataset.direction);
          break;
        case 'toggle-slide':
          toggleSlide(Number(target.dataset.index));
          break;
        case 'toggle-basics-section':
          toggleBasicsSection(String(target.dataset.section||''));
          break;
        case 'toggle-theme-section':
          toggleThemeSection(String(target.dataset.section||''));
          break;
        case 'add-block':
          addBlock(Number(target.dataset.slide), target.dataset.type||'text');
          break;
        case 'remove-block':
          removeBlock(Number(target.dataset.slide), Number(target.dataset.block));
          break;
        case 'move-block':
          moveBlock(Number(target.dataset.slide), Number(target.dataset.block), target.dataset.direction);
          break;
        case 'add-stat':
          addStat(Number(target.dataset.index));
          break;
        case 'remove-stat':
          removeStat(Number(target.dataset.index), Number(target.dataset.stat));
          break;
        case 'move-stat':
          moveStat(Number(target.dataset.index), Number(target.dataset.stat), target.dataset.direction);
          break;
        case 'add-card':
          addCard(Number(target.dataset.slide), Number(target.dataset.block));
          break;
        case 'remove-card':
          removeCard(Number(target.dataset.slide), Number(target.dataset.block), Number(target.dataset.card));
          break;
        case 'move-card':
          moveCard(Number(target.dataset.slide), Number(target.dataset.block), Number(target.dataset.card), target.dataset.direction);
          break;
        default:
          break;
      }
    }

    function onWizardInput(event){
      const el=event.target;
      const path=el.dataset.path;
      if(!path) return;
      const value=readInputValue(el);
      if(/^slides\.\d+\.type$/.test(path)){
        const [, slideIndexStr]=path.match(/^slides\.(\d+)\.type$/) || [];
        const slideIndex=Number(slideIndexStr);
        convertSlideType(slideIndex, value);
        renderSlidesEditor();
        wizardDirty=true;
        return;
      }
      if(/^slides\.\d+\.blocks\.\d+\.type$/.test(path)){
        const [, slideIndexStr, blockIndexStr]=path.match(/^slides\.(\d+)\.blocks\.(\d+)\.type$/) || [];
        convertBlockType(Number(slideIndexStr), Number(blockIndexStr), value);
        renderSlidesEditor();
        wizardDirty=true;
        return;
      }
      setByPath(wizardState, path, value);
      wizardDirty=true;
      if(path.startsWith('slides.')){
        updateSlideMetaDisplay(path);
      }
    }

    function populateGeneralFields(){
      wizardOverlay.querySelectorAll('[data-path]').forEach(el=>{
        if(el.closest('#wizardSlidesList')) return;
        const value=getByPath(wizardState, el.dataset.path);
        setElementValue(el, value);
      });
    }

    function updateStep(){
      stepSections.forEach((section, idx)=>{
        if(idx===wizardStep){
          section.classList.add('active');
          section.setAttribute('aria-hidden','false');
        }else{
          section.classList.remove('active');
          section.setAttribute('aria-hidden','true');
        }
      });
      stepButtons.forEach(btn=>{
        const targetIndex=Number(btn.dataset.stepTarget);
        btn.classList.toggle('active', targetIndex===wizardStep);
        btn.setAttribute('aria-selected', targetIndex===wizardStep ? 'true':'false');
      });
    }

    function updateNavButtons(){
      const prevBtn=wizardOverlay.querySelector('[data-action="prev"]');
      const nextBtn=wizardOverlay.querySelector('[data-action="next"]');
      if(prevBtn) prevBtn.disabled=wizardStep===0;
      if(nextBtn) nextBtn.disabled=wizardStep>=stepSections.length-1;
    }

    function addSlide(type){
      const slide=createSlideTemplate(type||'content');
      slideCollapseState.set(slide, false);
      wizardState.slides.push(slide);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function removeSlide(index){
      if(index<0 || index>=wizardState.slides.length) return;
      const [removed]=wizardState.slides.splice(index,1);
      if(removed) slideCollapseState.delete(removed);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function moveSlide(index, direction){
      if(direction!=='up' && direction!=='down') return;
      const target=direction==='up'? index-1 : index+1;
      if(target<0 || target>=wizardState.slides.length) return;
      swap(wizardState.slides, index, target);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function addBlock(slideIndex, type){
      const slide=wizardState.slides[slideIndex];
      if(!slide) return;
      if(!Array.isArray(slide.blocks)) slide.blocks=[];
      slide.blocks.push(createBlockTemplate(type||'text'));
      renderSlidesEditor();
      wizardDirty=true;
    }

    function removeBlock(slideIndex, blockIndex){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.blocks)) return;
      slide.blocks.splice(blockIndex,1);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function moveBlock(slideIndex, blockIndex, direction){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.blocks)) return;
      const target=direction==='up'? blockIndex-1 : blockIndex+1;
      if(target<0 || target>=slide.blocks.length) return;
      swap(slide.blocks, blockIndex, target);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function addStat(slideIndex){
      const slide=wizardState.slides[slideIndex];
      if(!slide) return;
      if(!Array.isArray(slide.stats)) slide.stats=[];
      slide.stats.push({label:'', value:'', unit:'', text:''});
      renderSlidesEditor();
      wizardDirty=true;
    }

    function removeStat(slideIndex, statIndex){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.stats)) return;
      slide.stats.splice(statIndex,1);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function moveStat(slideIndex, statIndex, direction){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.stats)) return;
      const target=direction==='up'? statIndex-1 : statIndex+1;
      if(target<0 || target>=slide.stats.length) return;
      swap(slide.stats, statIndex, target);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function addCard(slideIndex, blockIndex){
      const block=getBlock(slideIndex, blockIndex);
      if(!block) return;
      if(!Array.isArray(block.cards)) block.cards=[];
      block.cards.push({title:'', text:'', html:'', variant:'', eyebrow:'', value:'', list:{items:[]}});
      renderSlidesEditor();
      wizardDirty=true;
    }

    function removeCard(slideIndex, blockIndex, cardIndex){
      const block=getBlock(slideIndex, blockIndex);
      if(!block || !Array.isArray(block.cards)) return;
      block.cards.splice(cardIndex,1);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function moveCard(slideIndex, blockIndex, cardIndex, direction){
      const block=getBlock(slideIndex, blockIndex);
      if(!block || !Array.isArray(block.cards)) return;
      const target=direction==='up'? cardIndex-1 : cardIndex+1;
      if(target<0 || target>=block.cards.length) return;
      swap(block.cards, cardIndex, target);
      renderSlidesEditor();
      wizardDirty=true;
    }

    function convertSlideType(index, type){
      const slide=wizardState.slides[index];
      if(!slide) return;
      const wasCollapsed=slideCollapseState.get(slide)===true;
      const converted=createSlideTemplate(type, slide);
      slideCollapseState.set(converted, wasCollapsed);
      slideCollapseState.delete(slide);
      wizardState.slides[index]=converted;
    }

    function convertBlockType(slideIndex, blockIndex, type){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.blocks)) return;
      const prev=slide.blocks[blockIndex]||{};
      slide.blocks[blockIndex]=createBlockTemplate(type, prev);
    }

    function getBlock(slideIndex, blockIndex){
      const slide=wizardState.slides[slideIndex];
      if(!slide || !Array.isArray(slide.blocks)) return null;
      return slide.blocks[blockIndex];
    }

    function updateSlideMetaDisplay(path){
      const match=path.match(/^slides\.(\d+)(?:\.stats\.(\d+))?/);
      if(!match) return;
      const slideIndex=Number(match[1]);
      const card=slidesListEl.querySelector(`[data-slide-index="${slideIndex}"]`);
      if(!card) return;
      const slide=wizardState.slides[slideIndex];
      const titleSpan=card.querySelector('[data-role="slide-title"]');
      const typeSpan=card.querySelector('[data-role="slide-type"]');
      if(titleSpan){
        const label=slide.title || slide.subtitle || slide.tag || `Folie ${slideIndex+1}`;
        titleSpan.textContent=label;
      }
      if(typeSpan){
        typeSpan.textContent=slide.type||'content';
      }
    }

    stepButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        wizardStep=Number(btn.dataset.stepTarget)||0;
        updateStep();
        updateNavButtons();
      });
    });

    return {open,close:requestClose,isOpen};
  }

  function buildSlides(config){
    stage.innerHTML='';
    const slides=config.slides||[];
    const frag=document.createDocumentFragment();
    slides.forEach((slide, index)=>{
      frag.appendChild(createSlideElement(slide, config, index));
    });
    stage.appendChild(frag);
  }

  function createSlideElement(slide, config, index){
    const section=document.createElement('section');
    section.className='slide';
    section.setAttribute('role','region');
    section.setAttribute('aria-label', slide.ariaLabel || stripHTML(slide.title) || `Folie ${index+1}`);
    section.setAttribute('aria-hidden','true');

    if(slide.backgroundImage){
      const bg=document.createElement('img');
      bg.className='background-image';
      bg.src=slide.backgroundImage;
      bg.alt='';
      section.appendChild(bg);
    }

    const content=document.createElement('div');
    content.className='content';

    const logo=createLogo(config.brand||{});
    if(logo) section.appendChild(logo);

    if(slide.type==='cover'){
      if(slide.tag){
        const tag=document.createElement('div');
        tag.className='tag';
        tag.innerHTML=slide.tag;
        content.appendChild(tag);
      }
      if(slide.title){
        const h1=document.createElement('h1');
        h1.className='title-xl';
        h1.innerHTML=slide.title;
        content.appendChild(h1);
      }
      if(slide.subtitle){
        const h3=document.createElement('h3');
        h3.innerHTML=slide.subtitle;
        content.appendChild(h3);
      }
      if(Array.isArray(slide.stats) && slide.stats.length){
        const grid=document.createElement('div');
        const cols=Math.min(Math.max(slide.stats.length,1),3);
        grid.className=`grid cols-${cols}`;
        slide.stats.forEach(stat=>{
          const card=document.createElement('div');
          card.className='card';
          const label=document.createElement('div');
          label.className='stat-label';
          label.innerHTML=stat.label || '';
          card.appendChild(label);
          if(stat.value){
            const value=document.createElement('div');
            value.className='kpi stat-value';
            value.innerHTML=stat.value + (stat.unit? `<span class="stat-unit">${stat.unit}</span>`:'');
            card.appendChild(value);
          }
          if(stat.text){
            const text=document.createElement('p');
            text.innerHTML=stat.text;
            card.appendChild(text);
          }
          grid.appendChild(card);
        });
        content.appendChild(grid);
      }
    }else{
      if(slide.title){
        const h2=document.createElement('h2');
        h2.innerHTML=slide.title;
        content.appendChild(h2);
      }
      (slide.blocks||[]).forEach(block=>{
        const blockEl=createBlock(block);
        if(blockEl) content.appendChild(blockEl);
      });
    }

    section.appendChild(content);

    const footer=createFooter(config, slide, index);
    if(footer) section.appendChild(footer);
    return section;
  }

  function createBlock(block){
    if(!block) return null;
    switch(block.type){
      case 'text':{
        const p=document.createElement('p');
        p.innerHTML=block.text||'';
        if(block.muted) p.classList.add('muted');
        if(block.small) p.classList.add('small');
        return p;
      }
      case 'list':{
        const ordered=block.ordered || block.style==='numbered';
        const list=document.createElement(ordered? 'ol':'ul');
        if(block.style==='check') list.classList.add('list-check');
        if(block.style==='cross') list.classList.add('list-cross');
        (block.items||[]).forEach(item=>{
          const li=document.createElement('li');
          li.innerHTML=item;
          list.appendChild(li);
        });
        return list;
      }
      case 'grid':{
        const cols=Math.min(Math.max(block.columns||2,1),4);
        const grid=document.createElement('div');
        grid.className=`grid cols-${cols}`;
        (block.cards||[]).forEach(cardData=>{
          const card=document.createElement('div');
          card.className='card';
          if(cardData.variant) card.classList.add(cardData.variant);
          if(cardData.eyebrow){
            const eyebrow=document.createElement('div');
            eyebrow.className='eyebrow';
            eyebrow.innerHTML=cardData.eyebrow;
            card.appendChild(eyebrow);
          }
          if(cardData.title){
            const title=document.createElement('h3');
            title.innerHTML=cardData.title;
            card.appendChild(title);
          }
          if(cardData.value){
            const stat=document.createElement('div');
            stat.className='stat stat-value';
            stat.innerHTML=cardData.value;
            card.appendChild(stat);
          }
          if(cardData.text){
            const text=document.createElement('p');
            text.innerHTML=cardData.text;
            card.appendChild(text);
          }
          if(cardData.html){
            const html=document.createElement('div');
            html.innerHTML=cardData.html;
            card.appendChild(html);
          }
          if(cardData.list){
            const listBlock={type:'list', items:cardData.list.items||[], ordered:cardData.list.ordered, style:cardData.list.style};
            const listEl=createBlock(listBlock);
            if(listEl) card.appendChild(listEl);
          }
          grid.appendChild(card);
        });
        return grid;
      }
      case 'quote':{
        const quote=document.createElement('blockquote');
        quote.innerHTML=block.text||'';
        return quote;
      }
      case 'html':{
        const wrapper=document.createElement('div');
        wrapper.innerHTML=block.content||'';
        return wrapper;
      }
      default:
        return null;
    }
  }

  function createFooter(config, slide, index){
    const footer=document.createElement('div');
    footer.className='footer';
    const left=document.createElement('div');
    left.innerHTML=slide.footerLeft ?? config.footer.left ?? '';
    const right=document.createElement('div');
    right.innerHTML=(slide.footerRight ?? config.footer.right ?? '')
      .replace('{current}', `<span class="page-current" data-index="${index}"></span>`)
      .replace('{total}', '<span class="page-total"></span>');
    footer.appendChild(left);
    footer.appendChild(right);
    const dateText=getDateString(config.meta);
    footer.querySelectorAll('.date').forEach(el=>el.textContent=dateText);
    return footer;
  }

  function applyMeta(meta){
    if(meta?.title) document.title=meta.title;
    const desc=document.querySelector('meta[name="description"]');
    if(meta?.description && desc) desc.setAttribute('content', meta.description);
  }

  function applyTheme(theme){
    if(!theme) return;
    const root=document.documentElement;
    const set=(varName, value)=>{ if(value!==undefined && value!==null && value!==''){ root.style.setProperty(varName, value); } };
    if(theme.fonts){
      set('--font-heading', theme.fonts.heading);
      set('--font-body', theme.fonts.body);
      set('--font-mono', theme.fonts.mono);
    }
    if(theme.colors){
      set('--bg', theme.colors.background);
      set('--surface', theme.colors.surface);
      set('--text', theme.colors.text);
      set('--muted', theme.colors.muted);
      set('--primary', theme.colors.primary);
      set('--secondary', theme.colors.secondary);
      set('--accent', theme.colors.accent);
      set('--link', theme.colors.link);
      set('--hover', theme.colors.hover);
      set('--ok', theme.colors.ok);
      set('--warn', theme.colors.warn);
      set('--danger', theme.colors.danger);
    }
    if(theme.typography){
      applyTypography(theme.typography);
    }
  }

  function applyTypography(typography){
    if(!typography) return;
    const root=document.documentElement;
    const assign=(name, value, unit)=>{
      if(value===undefined || value===null || value==='') return;
      let final=value;
      if(typeof final==='number'){
        final=unit? `${final}${unit}` : String(final);
      }
      root.style.setProperty(name, String(final));
    };
    assign('--font-h1-size', typography.h1?.size, 'px');
    assign('--font-h1-weight', typography.h1?.weight, '');
    assign('--font-h2-size', typography.h2?.size, 'px');
    assign('--font-h2-weight', typography.h2?.weight, '');
    assign('--font-h3-size', typography.h3?.size, 'px');
    assign('--font-h3-weight', typography.h3?.weight, '');
    assign('--font-h4-size', typography.h4?.size, 'px');
    assign('--font-h4-weight', typography.h4?.weight, '');
    assign('--font-body-size', typography.body?.size, 'px');
    assign('--font-body-weight', typography.body?.weight, '');
    assign('--font-small-size', typography.small?.size, 'px');
    assign('--font-small-weight', typography.small?.weight, '');
    assign('--font-stat-label-size', typography.statLabel?.size, 'px');
    assign('--font-stat-label-weight', typography.statLabel?.weight, '');
    assign('--font-stat-value-size', typography.statValue?.size, 'px');
    assign('--font-stat-value-weight', typography.statValue?.weight, '');
    assign('--font-stat-unit-size', typography.statUnit?.size, 'px');
    assign('--font-stat-unit-weight', typography.statUnit?.weight, '');
  }

  function applyHelp(help){
    if(!helpDialog) return;
    const isVisible=help?.show!==false;
    const content=help?.text ?? defaults.help.text;
    helpDialog.innerHTML=content;
    helpDialog.style.display=isVisible? '' : 'none';
    if(isVisible){
      helpDialog.removeAttribute('hidden');
      helpDialog.setAttribute('aria-hidden','false');
    }else{
      helpDialog.setAttribute('hidden','');
      helpDialog.setAttribute('aria-hidden','true');
    }
  }

  function createLogo(brand){
    if(!brand || brand.showOnSlides===false) return null;
    if(!brand.logo?.src && !brand.name) return null;
    const wrapper=document.createElement('div');
    wrapper.className='logo';
    if(brand.logo?.src){
      const img=document.createElement('img');
      img.src=brand.logo.src;
      img.alt=brand.logo.alt || brand.name || 'Logo';
      img.onerror=()=>{
        img.onerror=null;
        img.src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'><rect width='120' height='40' rx='8' fill='%23033c8c'/><text x='60' y='26' fill='white' font-family='Arial' font-size='16' text-anchor='middle'>Logo</text></svg>";
      };
      wrapper.appendChild(img);
    }
    if(brand.name){
      const span=document.createElement('span');
      span.className='brand';
      span.textContent=brand.name;
      wrapper.appendChild(span);
    }
    return wrapper;
  }

  function setPages(){
    const slides=[...stage.querySelectorAll('.slide')];
    slides.forEach((slide, index)=>{
      slide.querySelectorAll('.page-current').forEach(el=>el.textContent=String(index+1));
      slide.querySelectorAll('.page-total').forEach(el=>el.textContent=String(slides.length));
    });
  }

  function getDateString(meta){
    if(!meta) return '';
    if(meta.date && meta.date!=='auto') return meta.date;
    try{
      const formatter=new Intl.DateTimeFormat(meta.locale||'de-DE', {timeZone:meta.timezone||'Europe/Berlin', year:'numeric', month:'2-digit', day:'2-digit'});
      return formatter.format(new Date());
    }catch(err){
      return new Date().toLocaleDateString();
    }
  }

  async function exportHTML(){
    const cloneDoc=document.documentElement.cloneNode(true);
    cloneDoc.setAttribute('data-export-build','');
    const externalConfig=cloneDoc.querySelector('script[src$="presentation-config.js"]');
    if(externalConfig) externalConfig.remove();
    const inlineConfig=document.createElement('script');
    inlineConfig.setAttribute('data-inline-config','');
    inlineConfig.textContent='window.presentationConfig = '+JSON.stringify(rawConfig, null, 2)+';';
    const appScript=cloneDoc.querySelector('script[data-app]');
    const scriptSource=(await appScriptSourcePromise)||runtimeSourceGlobal;
    if(appScript){
      if(scriptSource){
        const inlineApp=document.createElement('script');
        inlineApp.setAttribute('data-app','');
        inlineApp.textContent=scriptSource;
        const parent=appScript.parentNode;
        parent.replaceChild(inlineApp, appScript);
        parent.insertBefore(inlineConfig, inlineApp);
      }else{
        appScript.parentNode.insertBefore(inlineConfig, appScript);
      }
    }else{
      cloneDoc.querySelector('head').appendChild(inlineConfig);
    }
    const wizardClone=cloneDoc.querySelector('#configWizard');
    if(wizardClone){
      wizardClone.remove();
    }
    const wizardBtnClone=cloneDoc.querySelector('#btnWizard');
    if(wizardBtnClone){
      wizardBtnClone.remove();
    }
    const exportBtnClone=cloneDoc.querySelector('#btnExport');
    if(exportBtnClone){
      exportBtnClone.remove();
    }
    const docType=document.doctype;
    let docTypeString='<!doctype html>';
    if(docType){
      let publicId=docType.publicId || '';
      let systemId=docType.systemId || '';
      const hasPublic=publicId.length>0;
      const hasSystem=systemId.length>0;
      docTypeString=`<!doctype ${docType.name}`;
      if(hasPublic){
        docTypeString+=` PUBLIC "${publicId}"`;
      }
      if(hasSystem){
        docTypeString+=hasPublic?` "${systemId}"`:` SYSTEM "${systemId}"`;
      }
      docTypeString+='>';
    }
    const htmlString=`${docTypeString}\n${cloneDoc.outerHTML}`;
    const blob=new Blob([htmlString], {type:'text/html;charset=utf-8'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=config.toolbar?.filename || 'presentation.html';
    document.body.appendChild(link);
    link.click();
    setTimeout(()=>{
      URL.revokeObjectURL(link.href);
      link.remove();
    },1200);
  }

  function downloadConfig(data){
    const blob=new Blob(['window.presentationConfig = '+JSON.stringify(data, null, 2)+';'], {type:'application/javascript;charset=utf-8'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download='presentation-config.js';
    document.body.appendChild(link);
    link.click();
    setTimeout(()=>{
      URL.revokeObjectURL(link.href);
      link.remove();
    },1200);
  }

  function normaliseWizardState(state){
    state.meta=state.meta || {};
    state.brand=state.brand || {};
    state.brand.logo=state.brand.logo || {};
    state.brand.showOnSlides=state.brand.showOnSlides!==false;
    state.toolbar=state.toolbar || {};
    state.toolbar.showFullscreen=state.toolbar.showFullscreen!==false;
    state.toolbar.showExport=state.toolbar.showExport!==false;
    state.toolbar.showPrint=state.toolbar.showPrint!==false;
    state.help=state.help || {};
    if(state.help.show===undefined) state.help.show=true;
    if(state.help.text===undefined) state.help.text=defaults.help.text;
    state.footer=state.footer || {};
    state.theme=state.theme || {};
    state.theme.fonts=state.theme.fonts || {};
    state.theme.colors=state.theme.colors || {};
    state.theme.typography=mergeDeep(defaults.theme.typography||{}, state.theme.typography || {});
    state.slides=Array.isArray(state.slides)? state.slides.slice() : [];
    state.slides=state.slides.map(slide=>{
      const template=createSlideTemplate(slide.type||'content', slide);
      slideCollapseState.set(template, false);
      return template;
    });
  }

    function toggleSlide(index){
      const slide=wizardState.slides[index];
      if(!slide) return;
      const currentlyCollapsed=slideCollapseState.get(slide)===true;
      const nextState=!currentlyCollapsed;
      slideCollapseState.set(slide, nextState);
      const card=slidesListEl.querySelector(`[data-slide-index="${index}"]`);
      if(card){
        applyCollapseState(card, nextState);
      }
    }

    function toggleBasicsSection(section){
      if(!section || !(section in basicsSectionCollapseState)) return;
      const nextState=!basicsSectionCollapseState[section];
      basicsSectionCollapseState[section]=nextState;
      const card=wizardOverlay.querySelector(`.wizard-card[data-basics-section="${section}"]`);
      if(card){
        applyBasicsSectionState(card, nextState);
      }
    }

    function applyBasicsSectionStates(){
      wizardOverlay.querySelectorAll('.wizard-card[data-basics-section]').forEach(card=>{
        const section=card.getAttribute('data-basics-section');
        const collapsed=basicsSectionCollapseState[section]===true;
        applyBasicsSectionState(card, collapsed);
      });
    }

    function applyBasicsSectionState(card, collapsed){
      if(!card) return;
      card.classList.toggle('is-collapsed', collapsed);
      const toggleBtn=card.querySelector('.wizard-toggle');
      if(toggleBtn){
        const label=card.getAttribute('data-section-label') || 'Bereich';
        toggleBtn.setAttribute('aria-expanded', collapsed? 'false':'true');
        toggleBtn.setAttribute('aria-label', collapsed? `${label} ausklappen` : `${label} einklappen`);
        toggleBtn.setAttribute('title', collapsed? 'Aufklappen':'Einklappen');
      }
    }

    function toggleThemeSection(section){
      if(!section || !(section in themeSectionCollapseState)) return;
      const nextState=!themeSectionCollapseState[section];
      themeSectionCollapseState[section]=nextState;
      const card=wizardOverlay.querySelector(`.wizard-card[data-theme-section="${section}"]`);
      if(card){
        applyThemeSectionState(card, nextState);
      }
    }

    function applyCollapseState(card, collapsed){
      card.classList.toggle('is-collapsed', collapsed);
      const toggleBtn=card.querySelector('.wizard-toggle');
      if(toggleBtn){
        toggleBtn.setAttribute('aria-expanded', collapsed? 'false':'true');
        toggleBtn.setAttribute('aria-label', collapsed? 'Folie ausklappen':'Folie einklappen');
        toggleBtn.setAttribute('title', collapsed? 'Aufklappen':'Einklappen');
      }
    }

    function applyThemeSectionStates(){
      wizardOverlay.querySelectorAll('.wizard-card[data-theme-section]').forEach(card=>{
        const section=card.getAttribute('data-theme-section');
        const collapsed=themeSectionCollapseState[section]===true;
        applyThemeSectionState(card, collapsed);
      });
    }

    function applyThemeSectionState(card, collapsed){
      if(!card) return;
      card.classList.toggle('is-collapsed', collapsed);
      const toggleBtn=card.querySelector('.wizard-toggle');
      if(toggleBtn){
        const label=card.getAttribute('data-section-label') || 'Bereich';
        toggleBtn.setAttribute('aria-expanded', collapsed? 'false':'true');
        toggleBtn.setAttribute('aria-label', collapsed? `${label} ausklappen` : `${label} einklappen`);
        toggleBtn.setAttribute('title', collapsed? 'Aufklappen':'Einklappen');
      }
    }

  function renderSlidesEditor(){
    if(!Array.isArray(wizardState.slides) || !wizardState.slides.length){
      slidesListEl.innerHTML='<div class="wizard-empty">Keine Slides vorhanden – fügen Sie oben eine neue Folie hinzu.</div>';
      return;
    }
    wizardState.slides.forEach(slide=>{
      if(!slideCollapseState.has(slide)) slideCollapseState.set(slide, false);
    });
    const markup=wizardState.slides.map((slide, index)=>createSlideEditor(slide, index)).join('');
    slidesListEl.innerHTML=markup;
  }

  function createSlideEditor(slide, index){
    const title=escapeHTML(slide.title || slide.subtitle || slide.tag || `Folie ${index+1}`);
    const type=escapeHTML(slide.type || 'content');
    const collapsed=slideCollapseState.get(slide)===true;
    const bodyId=`wizard-slide-${index}-body`;
    const baseFields=`<div class="wizard-grid">
      <div class="wizard-field">
        <label>Typ</label>
        <select data-path="slides.${index}.type">
          <option value="cover"${slide.type==='cover'?' selected':''}>Cover</option>
          <option value="content"${(!slide.type || slide.type==='content')?' selected':''}>Content</option>
        </select>
      </div>
      <div class="wizard-field">
        <label>Titel</label>
        <input type="text" data-path="slides.${index}.title" value="${escapeHTML(slide.title||'')}" />
      </div>
      <div class="wizard-field">
        <label>ARIA-Label</label>
        <input type="text" data-path="slides.${index}.ariaLabel" value="${escapeHTML(slide.ariaLabel||'')}" />
      </div>
    </div>`;

    let body='';
    if(slide.type==='cover'){
      const stats=Array.isArray(slide.stats)? slide.stats:[];
      const statsMarkup=stats.map((stat, statIndex)=>`
        <div class="wizard-card" data-stat-index="${statIndex}">
          <header style="justify-content:space-between;">
            <h4>Highlight ${statIndex+1}</h4>
            <div class="wizard-inline" style="justify-content:flex-end;">
              <button class="wizard-chip" type="button" data-action="move-stat" data-direction="up" data-index="${index}" data-stat="${statIndex}" ${statIndex===0?'disabled':''}>▲</button>
              <button class="wizard-chip" type="button" data-action="move-stat" data-direction="down" data-index="${index}" data-stat="${statIndex}" ${statIndex===stats.length-1?'disabled':''}>▼</button>
              <button class="wizard-chip" type="button" data-action="remove-stat" data-index="${index}" data-stat="${statIndex}">Entfernen</button>
            </div>
          </header>
          <div class="wizard-grid">
            <div class="wizard-field">
              <label>Label</label>
              <input type="text" data-path="slides.${index}.stats.${statIndex}.label" value="${escapeHTML(stat.label||'')}" />
            </div>
            <div class="wizard-field">
              <label>Wert</label>
              <input type="text" data-path="slides.${index}.stats.${statIndex}.value" value="${escapeHTML(stat.value||'')}" />
            </div>
            <div class="wizard-field">
              <label>Einheit</label>
              <input type="text" data-path="slides.${index}.stats.${statIndex}.unit" value="${escapeHTML(stat.unit||'')}" />
            </div>
            <div class="wizard-field" style="grid-column:1/-1;">
              <label>Text</label>
              <textarea data-path="slides.${index}.stats.${statIndex}.text">${escapeHTML(stat.text||'')}</textarea>
            </div>
          </div>
        </div>`).join('');
      body=`<div class="wizard-grid">
        <div class="wizard-field">
          <label>Tag/Badge</label>
          <input type="text" data-path="slides.${index}.tag" value="${escapeHTML(slide.tag||'')}" />
        </div>
        <div class="wizard-field" style="grid-column:1/-1;">
          <label>Untertitel</label>
          <textarea data-path="slides.${index}.subtitle">${escapeHTML(slide.subtitle||'')}</textarea>
        </div>
      </div>
      <div class="wizard-list">${statsMarkup || '<div class="wizard-empty">Noch keine Highlights hinzugefügt.</div>'}</div>
      <div class="wizard-inline" style="justify-content:flex-end;">
        <button class="wizard-chip" type="button" data-action="add-stat" data-index="${index}">Highlight hinzufügen</button>
      </div>`;
    }else{
      const blocks=Array.isArray(slide.blocks)? slide.blocks:[];
      const blocksMarkup=blocks.map((block, blockIndex)=>createBlockEditor(block, index, blockIndex)).join('');
      body=`<div class="wizard-list">${blocksMarkup || '<div class="wizard-empty">Noch keine Inhalte. Fügen Sie einen Block hinzu.</div>'}</div>
      <div class="wizard-inline" style="justify-content:flex-end;">
        <span class="wizard-small">Neuer Block:</span>
        <button class="wizard-chip" type="button" data-action="add-block" data-slide="${index}" data-type="text">Text</button>
        <button class="wizard-chip" type="button" data-action="add-block" data-slide="${index}" data-type="list">Liste</button>
        <button class="wizard-chip" type="button" data-action="add-block" data-slide="${index}" data-type="grid">Karten</button>
        <button class="wizard-chip" type="button" data-action="add-block" data-slide="${index}" data-type="quote">Zitat</button>
        <button class="wizard-chip" type="button" data-action="add-block" data-slide="${index}" data-type="html">HTML</button>
      </div>`;
    }

    return `<article class="wizard-card${collapsed?' is-collapsed':''}" data-slide-index="${index}">
      <header>
        <div class="wizard-card-headline">
          <button class="wizard-toggle" type="button" data-action="toggle-slide" data-index="${index}" aria-expanded="${collapsed?'false':'true'}" aria-controls="${bodyId}" aria-label="${collapsed?'Folie ausklappen':'Folie einklappen'}" title="${collapsed?'Aufklappen':'Einklappen'}">▾</button>
          <h4>Folie ${index+1}: <span data-role="slide-title">${title}</span></h4>
        </div>
        <div class="wizard-inline" style="justify-content:flex-end;">
          <span class="wizard-tag" data-role="slide-type">${type}</span>
          <button class="wizard-chip" type="button" data-action="move-slide" data-direction="up" data-index="${index}" ${index===0?'disabled':''}>▲</button>
          <button class="wizard-chip" type="button" data-action="move-slide" data-direction="down" data-index="${index}" ${index===wizardState.slides.length-1?'disabled':''}>▼</button>
          <button class="wizard-chip" type="button" data-action="remove-slide" data-index="${index}">Entfernen</button>
        </div>
      </header>
      <div class="wizard-card-body" id="${bodyId}">
        ${baseFields}
        ${body}
      </div>
    </article>`;
  }

  function createBlockEditor(block, slideIndex, blockIndex){
    const typeOptions=['text','list','grid','quote','html'].map(option=>`<option value="${option}"${(block.type||'text')===option?' selected':''}>${option.toUpperCase()}</option>`).join('');
    const totalBlocks=(wizardState.slides[slideIndex].blocks||[]).length;
    let content='';
    switch(block.type){
      case 'list':{
        const items=(block.items||[]).join('\n');
        content=`<div class="wizard-grid">
          <div class="wizard-field">
            <label>Stil</label>
            <select data-path="slides.${slideIndex}.blocks.${blockIndex}.style">
              <option value=""${!block.style?' selected':''}>Standard</option>
              <option value="check"${block.style==='check'?' selected':''}>Check</option>
              <option value="cross"${block.style==='cross'?' selected':''}>Cross</option>
              <option value="numbered"${block.style==='numbered'?' selected':''}>Nummeriert</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Nummeriert</label>
            <select data-path="slides.${slideIndex}.blocks.${blockIndex}.ordered">
              <option value="false"${block.ordered? '':' selected'}>Nein</option>
              <option value="true"${block.ordered? ' selected':''}>Ja</option>
            </select>
          </div>
          <div class="wizard-field" style="grid-column:1/-1;">
            <label>Einträge (eine Zeile pro Punkt)</label>
            <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.items" data-type="array">${escapeHTML(items)}</textarea>
          </div>
        </div>`;
        break;
      }
      case 'grid':{
        const cards=Array.isArray(block.cards)? block.cards:[];
        const cardsMarkup=cards.map((card, cardIndex)=>createCardEditor(card, slideIndex, blockIndex, cardIndex)).join('');
        content=`<div class="wizard-grid">
          <div class="wizard-field" style="max-width:180px;">
            <label>Spalten</label>
            <input type="number" min="1" max="4" data-numeric="true" data-path="slides.${slideIndex}.blocks.${blockIndex}.columns" value="${escapeHTML(String(block.columns ?? 3))}" />
          </div>
        </div>
        <div class="wizard-list">${cardsMarkup || '<div class="wizard-empty">Keine Karten vorhanden.</div>'}</div>
        <div class="wizard-inline" style="justify-content:flex-end;">
          <button class="wizard-chip" type="button" data-action="add-card" data-slide="${slideIndex}" data-block="${blockIndex}">Karte hinzufügen</button>
        </div>`;
        break;
      }
      case 'quote':{
        content=`<div class="wizard-field">
          <label>Zitat</label>
          <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.text">${escapeHTML(block.text||'')}</textarea>
        </div>`;
        break;
      }
      case 'html':{
        content=`<div class="wizard-field">
          <label>Benutzerdefinierter HTML-Inhalt</label>
          <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.content">${escapeHTML(block.content||'')}</textarea>
        </div>`;
        break;
      }
      default:{
        content=`<div class="wizard-field">
          <label>Text</label>
          <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.text">${escapeHTML(block.text||'')}</textarea>
        </div>
        <div class="wizard-inline">
          <div class="wizard-field">
            <label>Muted</label>
            <select data-path="slides.${slideIndex}.blocks.${blockIndex}.muted">
              <option value="false"${block.muted? '':' selected'}>Nein</option>
              <option value="true"${block.muted? ' selected':''}>Ja</option>
            </select>
          </div>
          <div class="wizard-field">
            <label>Kleine Schrift</label>
            <select data-path="slides.${slideIndex}.blocks.${blockIndex}.small">
              <option value="false"${block.small? '':' selected'}>Nein</option>
              <option value="true"${block.small? ' selected':''}>Ja</option>
            </select>
          </div>
        </div>`;
        break;
      }
    }
    return `<div class="wizard-card" data-block-index="${blockIndex}">
      <header>
        <h4>Block ${blockIndex+1}</h4>
        <div class="wizard-inline" style="justify-content:flex-end;">
          <select data-path="slides.${slideIndex}.blocks.${blockIndex}.type">${typeOptions}</select>
          <button class="wizard-chip" type="button" data-action="move-block" data-direction="up" data-slide="${slideIndex}" data-block="${blockIndex}" ${blockIndex===0?'disabled':''}>▲</button>
          <button class="wizard-chip" type="button" data-action="move-block" data-direction="down" data-slide="${slideIndex}" data-block="${blockIndex}" ${blockIndex===(totalBlocks-1)?'disabled':''}>▼</button>
          <button class="wizard-chip" type="button" data-action="remove-block" data-slide="${slideIndex}" data-block="${blockIndex}">Entfernen</button>
        </div>
      </header>
      ${content}
    </div>`;
  }

  function createCardEditor(card, slideIndex, blockIndex, cardIndex){
    const listItems=(card.list?.items||[]).join('\n');
    const block=wizardState.slides[slideIndex].blocks[blockIndex];
    const totalCards=(block.cards||[]).length;
    return `<div class="wizard-card" data-card-index="${cardIndex}">
      <header>
        <h4>Karte ${cardIndex+1}</h4>
        <div class="wizard-inline" style="justify-content:flex-end;">
          <button class="wizard-chip" type="button" data-action="move-card" data-direction="up" data-slide="${slideIndex}" data-block="${blockIndex}" data-card="${cardIndex}" ${cardIndex===0?'disabled':''}>▲</button>
          <button class="wizard-chip" type="button" data-action="move-card" data-direction="down" data-slide="${slideIndex}" data-block="${blockIndex}" data-card="${cardIndex}" ${cardIndex===(totalCards-1)?'disabled':''}>▼</button>
          <button class="wizard-chip" type="button" data-action="remove-card" data-slide="${slideIndex}" data-block="${blockIndex}" data-card="${cardIndex}">Entfernen</button>
        </div>
      </header>
      <div class="wizard-grid">
        <div class="wizard-field">
          <label>Titel</label>
          <input type="text" data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.title" value="${escapeHTML(card.title||'')}" />
        </div>
        <div class="wizard-field">
          <label>Eyebrow</label>
          <input type="text" data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.eyebrow" value="${escapeHTML(card.eyebrow||'')}" />
        </div>
        <div class="wizard-field">
          <label>Stat / Wert</label>
          <input type="text" data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.value" value="${escapeHTML(card.value||'')}" />
        </div>
        <div class="wizard-field">
          <label>Variante (CSS-Klasse)</label>
          <input type="text" data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.variant" value="${escapeHTML(card.variant||'')}" />
        </div>
      </div>
      <div class="wizard-field">
        <label>Text</label>
        <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.text">${escapeHTML(card.text||'')}</textarea>
      </div>
      <div class="wizard-field">
        <label>HTML</label>
        <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.html">${escapeHTML(card.html||'')}</textarea>
      </div>
      <div class="wizard-inline">
        <div class="wizard-field">
          <label>Listen-Stil</label>
          <select data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.list.style">
            <option value=""${!card.list?.style?' selected':''}>Standard</option>
            <option value="check"${card.list?.style==='check'?' selected':''}>Check</option>
            <option value="cross"${card.list?.style==='cross'?' selected':''}>Cross</option>
            <option value="numbered"${card.list?.style==='numbered'?' selected':''}>Nummeriert</option>
          </select>
        </div>
        <div class="wizard-field">
          <label>Listen-Einträge</label>
          <textarea data-path="slides.${slideIndex}.blocks.${blockIndex}.cards.${cardIndex}.list.items" data-type="array">${escapeHTML(listItems)}</textarea>
        </div>
      </div>
    </div>`;
  }

  function createSlideTemplate(type, previous){
    const base={type:type};
    if(type==='cover'){
      return {
        type:'cover',
        ariaLabel:previous?.ariaLabel || '',
        tag:previous?.tag || '',
        title:previous?.title || '',
        subtitle:previous?.subtitle || '',
        stats:Array.isArray(previous?.stats)? previous.stats.map(stat=>({...stat})) : []
      };
    }
    return {
      type:'content',
      ariaLabel:previous?.ariaLabel || '',
      title:previous?.title || '',
      blocks:Array.isArray(previous?.blocks)? previous.blocks.map(block=>createBlockTemplate(block.type||'text', block)) : []
    };
  }

  function createBlockTemplate(type, previous){
    switch(type){
      case 'list':
        return {type:'list', style:previous?.style||'', ordered:!!previous?.ordered, items:Array.isArray(previous?.items)? previous.items.slice():[]};
      case 'grid':
        return {type:'grid', columns:previous?.columns ?? 3, cards:Array.isArray(previous?.cards)? previous.cards.map(card=>({...card, list:{...(card.list||{}), items:Array.isArray(card.list?.items)? card.list.items.slice():[]}})) : []};
      case 'quote':
        return {type:'quote', text:previous?.text || ''};
      case 'html':
        return {type:'html', content:previous?.content || previous?.text || ''};
      default:
        return {type:'text', text:previous?.text || '', muted:!!previous?.muted, small:!!previous?.small};
    }
  }

  function readInputValue(el){
    if(el.dataset.type==='array'){
      return el.value.split('\n').map(item=>item.trim()).filter(Boolean);
    }
    if(el.dataset.numeric==='true' || el.type==='number'){
      if(el.value.trim()==='') return '';
      const num=Number(el.value);
      return Number.isFinite(num)? num : '';
    }
    if(el.tagName==='SELECT' && (el.value==='true' || el.value==='false')){
      return el.value==='true';
    }
    if(el.type==='checkbox'){
      return el.checked;
    }
    return el.value;
  }

  function setElementValue(el, value){
    if(el.dataset.type==='array'){
      el.value=Array.isArray(value)? value.join('\n') : '';
      return;
    }
    if(el.tagName==='SELECT' && (value===true || value===false)){
      el.value=value? 'true':'false';
      return;
    }
    if(el.type==='checkbox'){
      el.checked=!!value;
      return;
    }
    if(el.type==='color'){
      el.value=(typeof value==='string' && value)? value : '#000000';
      return;
    }
    el.value=value ?? '';
  }

  function clone(value){
    if(typeof structuredClone==='function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value||{}));
  }

  function mergeDeep(base, source){
    if(typeof base!=='object' || base===null) return clone(source);
    const output=Array.isArray(base)? [...base] : {...base};
    if(typeof source!=='object' || source===null) return clone(source) ?? output;
    Object.keys(source).forEach(key=>{
      const value=source[key];
      if(Array.isArray(value)){
        output[key]=value.map(item=>clone(item));
      }else if(value && typeof value==='object'){
        output[key]=mergeDeep(base[key]??{}, value);
      }else{
        output[key]=value;
      }
    });
    return output;
  }

  function getByPath(obj, path){
    if(!obj) return undefined;
    return path.split('.').reduce((acc,key)=>acc==null? undefined : acc[key], obj);
  }

  function setByPath(obj, path, value){
    const keys=path.split('.');
    let current=obj;
    keys.forEach((key, idx)=>{
      if(idx===keys.length-1){
        current[key]=value;
      }else{
        if(current[key]===undefined){
          current[key]=Number.isInteger(Number(keys[idx+1]))? [] : {};
        }
        current=current[key];
      }
    });
  }

  function swap(arr, a, b){
    const temp=arr[a];
    arr[a]=arr[b];
    arr[b]=temp;
  }

  function escapeHTML(value){
    if(value===undefined || value===null) return '';
    return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function stripHTML(value){
    if(!value) return '';
    const tmp=document.createElement('div');
    tmp.innerHTML=value;
    return tmp.textContent||'';
  }
};

if(typeof window!=='undefined'){
  window.__presentationMasterSource=`(${presentationMasterBootstrap.toString()})();`;
}

presentationMasterBootstrap();
