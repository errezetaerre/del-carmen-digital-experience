// The approved 11B-23 engine, adapted to real Artwork data and primary media.
// Deliberately local to the experimental artwork-detail view.
import { hasBlockingArtworkDialog } from '@/shared/ui/artwork/hasBlockingArtworkDialog';
import { GLASS_BOOK_QUERY } from '../../presentation/artworkBookViewport';
export { GLASS_BOOK_QUERY };
import { bindGlassTouchNavigation } from './glassTouchNavigation';
import { burstDust, burstGlassDust } from '@/shared/ui/particle-field/dust';
import { getSiteMessages } from '@/i18n/messages';
import { artworkTextLocale, formatArtworkCategory, formatArtworkAuthorship, formatArtworkTechnique } from '@/i18n/artworkCopy';
let wheelMomentumLocked=false;
let wheelMomentumUnlockTimer=null;

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function formatLabel(value){return value.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}



export function createGlassArtbook(root,options){
 if(!options.artworks.length)throw Error('Glass Artbook requires an artwork');
 const instance=options.instanceId.replace(/[^a-zA-Z0-9_-]/g,'');
 if(!instance)throw Error('Glass Artbook requires a stable instance identifier');
 const locale=options.locale??'en';
 const copy=getSiteMessages(locale).Glass;
 const nativeDocument=window.document;
 root.dataset.phase='loading';
 delete root.dataset.glassGesturing;
 const wideLayout=matchMedia(GLASS_BOOK_QUERY);
 const resources=new Set(),assets=new Map(),imageLoads=new Set(),imageJobs=new WeakMap(),cleanups=[];
 let entrancePlaying=false;
 let mediaLoading=true,loadRequest=null,loadSignature='';
 let disposed=false,frameId=0,pendingPointer=null,wheelActive=false,wheelTimer=null,edgeTimer=null;
 let pendingDustIndex=null,dustCleanup=null;
 function inputBlocked(){return mediaLoading||entrancePlaying||hasBlockingArtworkDialog(root);}
 function requestAnimationFrame(callback){frameId=window.requestAnimationFrame(now=>{if(!disposed)callback(now);});return frameId;}
 const document={
  documentElement:root,
  querySelector:selector=>root.querySelector(selector.startsWith('#')?'#'+instance+'-'+selector.slice(1):selector),
  addEventListener(type,listener){
   const guarded=event=>{if(!disposed&&!inputBlocked())listener(event);};
   nativeDocument.addEventListener(type,guarded);
   cleanups.push(()=>nativeDocument.removeEventListener(type,guarded));
  }
 };
 root.innerHTML=`<section class="scene" id="${instance}-scene" aria-label="${escapeHtml(copy.viewer)}"><div class="stage" id="${instance}-stage"><div class="book" id="${instance}-book"><div class="leaf left" id="${instance}-baseLeft"></div><div class="leaf right" id="${instance}-baseRight"></div><div class="turn" id="${instance}-turn"><div class="face front" id="${instance}-turnFront"></div><div class="face back" id="${instance}-turnBack"></div></div><div class="hinge"></div><div class="ga-artwork-actions" data-glass-artwork-actions></div></div></div></section><div class="controls font-sans"><button type="button" id="${instance}-prev" class="previous-control text-white/60 transition-colors hover:text-brand-gold"><span class="nav-label text-[9px] uppercase tracking-[0.28em]">← ${escapeHtml(copy.previous)}</span><span class="nav-title font-display" id="${instance}-previousTitle"></span></button><div class="control-center"><span class="meta text-[9px] tracking-[0.24em] text-white/35" id="${instance}-counter" aria-live="polite"></span><span class="guide-dock text-[9px] uppercase tracking-[0.14em] text-white/35" id="${instance}-guideDock" aria-hidden="true">${escapeHtml(copy.dragDock)}</span></div><button type="button" id="${instance}-next" class="next-control text-white/60 transition-colors hover:text-brand-gold"><span class="nav-label text-[9px] uppercase tracking-[0.28em]">${escapeHtml(copy.next)} →</span><span class="nav-title font-display" id="${instance}-nextTitle"></span></button></div><div class="guide-bubble" id="${instance}-guide" aria-hidden="true"><span class="guide-arrow font-display">‹</span><span class="guide-text font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-white/70" id="${instance}-guideText"><span class="guide-wide">${escapeHtml(copy.swipeGlass)}</span><span class="guide-narrow">${escapeHtml(copy.useButtons)}</span></span><span class="guide-arrow font-display">›</span></div><div hidden><input id="${instance}-optical" type="range" value="60"/><output id="${instance}-opticalValue"></output><input id="${instance}-cornerOptical" type="range" value="90"/><output id="${instance}-cornerValue"></output><input id="${instance}-persp" type="number" value="1040"/><span id="${instance}-perspValue"></span><p id="${instance}-glstatus"></p></div>`;
 root.dataset.renderer='webgl';

 // Load and decode before revealing a spread. Cached/broken images can both
 // report complete, so dimensions and decode are checked independently.
 function waitForImage(image){
  if(imageJobs.has(image))return imageJobs.get(image);
  let resolve,timer=null,finished=false,decoding=false;
  const job={promise:new Promise(done=>{resolve=done;}),cancel:()=>finish(false)};
  function finish(ready){
   if(finished)return;
   finished=true;
   image.removeEventListener('load',loaded);image.removeEventListener('error',failed);
   if(timer!==null)window.clearTimeout(timer);
   imageLoads.delete(job);resolve(ready);
  }
  function failed(){finish(false);}
  function loaded(){
   if(finished||decoding)return;
   if(!image.naturalWidth||!image.naturalHeight){finish(false);return;}
   decoding=true;
   try{
    Promise.resolve(typeof image.decode==='function'?image.decode():undefined)
     .then(()=>finish(!!image.naturalWidth&&!!image.naturalHeight),failed);
   }catch{failed();}
  }
  imageJobs.set(image,job);imageLoads.add(job);
  image.addEventListener('load',loaded);image.addEventListener('error',failed);
  timer=window.setTimeout(failed,30000);
  if(image.complete)loaded();
  return job;
 }
 function getPrimaryAsset(work){
  const src=work.images.primary.src;
  if(assets.has(src))return assets.get(src);
  const image=new window.Image();image.decoding='async';
  const asset={image,status:'loading',job:null,promise:null};assets.set(src,asset);
  image.src=src;
  asset.job=waitForImage(image);
  asset.promise=asset.job.promise.then(ready=>{asset.status=ready?'ready':'error';return ready;});
  return asset;
 }
 function publishLoadState(status,artworkIndex=index,kind='selection'){
  mediaLoading=status!=='ready';root.dataset.loadState=status;
  const artworkId=works[artworkIndex].id,signature=status+':'+artworkId+':'+kind;
  if(signature===loadSignature)return;
  loadSignature=signature;options.onLoadStateChange?.({status,artworkId,kind});
 }
 function cancelPreparation(){
  if(loadRequest?.timer!=null)window.clearTimeout(loadRequest.timer);
  loadRequest=null;
 }
 function prepareArtwork(artworkIndex,continueWith,kind){
  cancelPreparation();
  const request={artworkIndex,continueWith,kind,timer:null,failed:false};
  loadRequest=request;publishLoadState('loading',artworkIndex,kind);
  const asset=getPrimaryAsset(works[artworkIndex]);
  // The displayed elements also need decoding, rather than only a preloader.
  // Adjacent assets are preloaded independently and never delay this spread.
  const visibleImages=[];
  for(const state of faceStates.values())if(state.kind==='art'&&state.workIndex===artworkIndex){
   for(const image of state.content.querySelectorAll('img'))visibleImages.push(waitForImage(image).promise);
  }
  const fail=()=>{
   if(disposed||loadRequest!==request||request.failed)return;
   request.failed=true;window.clearTimeout(request.timer);
   if(pendingPointer?.loading&&pendingPointer.request===request){pendingPointer=null;setSelectionLock(false);}
   publishLoadState('error',artworkIndex,kind);
  };
  request.timer=window.setTimeout(fail,30000);
  // Force font/layout discovery before taking the current FontFaceSet.ready.
  void root.offsetHeight;
  Promise.all([asset.promise,...visibleImages,Promise.resolve(nativeDocument.fonts?.ready).then(()=>true)])
   .then(results=>{
    if(disposed||loadRequest!==request||request.failed)return;
    if(results.some(ready=>!ready)){fail();return;}
    window.clearTimeout(request.timer);loadRequest=null;
    render();publishLoadState('ready',artworkIndex,kind);continueWith();
   },fail);
 }
 function ensureTurnReady(dir){
  const target=index+dir;
  if(getPrimaryAsset(works[target]).status==='ready')return true;
  // Keep the current spread intact until the incoming image is ready.
  prepareArtwork(target,()=>{if(!disposed&&wideLayout.matches&&!inputBlocked())navigate(dir);},'turn');
  return false;
 }
 function showEdge(direction,amount){
  prepareInteraction();
  const distance=Math.min(12,Math.abs(amount)*.18);
  stage.style.transition='none';stage.style.transform=`translateX(${-direction*distance}px)`;
  if(edgeTimer!==null)window.clearTimeout(edgeTimer);
  edgeTimer=window.setTimeout(clearEdge,160);
 }
 function clearEdge(){stage.style.transition='transform 180ms ease-out';stage.style.transform='none';edgeTimer=null;}
 function dropPointerCapture(id){
  if(id==null||id<0)return;
  try{if(scene.hasPointerCapture(id))scene.releasePointerCapture(id);}catch{}
 }
 function setSelectionLock(active){
  if(!active){delete root.dataset.glassGesturing;return;}
  root.dataset.glassGesturing='';
  const selection=nativeDocument.getSelection?.();
  if(!selection)return;
  let owned=!!((selection.anchorNode&&root.contains(selection.anchorNode))||(selection.focusNode&&root.contains(selection.focusNode)));
  for(let i=0;!owned&&i<selection.rangeCount;i++){
   try{owned=selection.getRangeAt(i).intersectsNode(root);}catch{}
  }
  if(owned)selection.removeAllRanges();
 }
 function isReadingPress(event){
  const pane=event.target.closest('.info');
  if(!pane)return false;
  // Keep an overflowing sheet's scrollbar usable alongside the page gesture.
  if(pane.scrollHeight>pane.clientHeight){
   const box=pane.getBoundingClientRect(),gutter=Math.max(14,pane.offsetWidth-pane.clientWidth);
   if(event.clientX>=box.right-gutter&&event.clientX<=box.right)return true;
  }
  const fallback=()=>!!event.target.closest('.info h2,.info p,.info small,.info dt,.info dd,.info span,.info .ga-categories');
  if(!nativeDocument.createRange||!nativeDocument.createTreeWalker)return fallback();
  const range=nativeDocument.createRange();
  try{
   const walker=nativeDocument.createTreeWalker(pane,4); // NodeFilter.SHOW_TEXT
   for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(!node.textContent?.trim())continue;
    range.selectNodeContents(node);
    for(const rect of range.getClientRects()){
     if(rect.width>0&&rect.height>0&&event.clientX>=rect.left-2&&event.clientX<=rect.right+2&&event.clientY>=rect.top-2&&event.clientY<=rect.bottom+2)return true;
    }
   }
   return false;
  }catch{return fallback();}
  finally{range.detach?.();}
 }
 function cancelPendingTouch(){
  const pending=pendingPointer;pendingPointer=null;
  if(pending?.loading&&loadRequest===pending.request){
   cancelPreparation();publishLoadState('ready');render();
  }
 }
 function beginTouchTurn(pending,event,dir){
  pending.latest=event;
  if(!animating&&getPrimaryAsset(works[index+dir]).status!=='ready'){
   // Retain this finger and its latest position during an incoming-image wait.
   // A button's readiness continuation must not replace a live touch gesture.
   pending.loading=true;pending.direction=dir;pending.from=index;
   event.preventDefault();setSelectionLock(true);clearRequestedNavigation();
   prepareArtwork(index+dir,()=>{
    if(disposed||pendingPointer!==pending)return;
    if(!wideLayout.matches||inputBlocked()||index!==pending.from){pendingPointer=null;setSelectionLock(false);return;}
    pendingPointer=null;down(pending.event,pending.direction);move(pending.latest);
    // Position accumulated while loading is not an instantaneous fling.
    if(drag)drag.v=0;
    if(!drag&&!animating)setSelectionLock(false);
   },'turn');
   pending.request=loadRequest;
   return;
  }
  pendingPointer=null;down(pending.event,dir);move(event);
  if(!drag&&!animating)setSelectionLock(false);
 }
 function onPointerDown(event){
  if(event.isPrimary===false){
   onPointerCancel({pointerId:drag?.id??pendingPointer?.id});
   return;
  }
  if(!wideLayout.matches||inputBlocked()||wheelActive||event.button!==0||event.target.closest('button,a,input,textarea,select,[contenteditable],[data-artwork-highlights],[data-lightbox-native-scroll]'))return;
  if(drag||pendingPointer)return;
  // Letters own selection; padding, line gaps and free glass own page turns.
  if(!animating&&isReadingPress(event))return;
  if(event.pointerType==='mouse'){setSelectionLock(true);event.preventDefault();}
  // Mouse regrabs stay immediate. A touch must establish horizontal intent,
  // including while a leaf is settling, so vertical reading remains native.
  if(animating&&event.pointerType!=='touch'){down(event);return;}
  pendingPointer={event,x:event.clientX,y:event.clientY,id:event.pointerId};
 }
 function onPointerMove(event){
  if(pendingPointer&&pendingPointer.id===event.pointerId&&!drag){
   if(pendingPointer.loading){pendingPointer.latest=event;event.preventDefault();return;}
   const dx=event.clientX-pendingPointer.x,dy=event.clientY-pendingPointer.y;
   if(Math.max(Math.abs(dx),Math.abs(dy))<6)return;
   if(event.pointerType==='touch'){
    // Small diagonal grip movement is undecided, not a permanently lost grab.
    if(Math.abs(dy)>=10&&Math.abs(dy)>Math.abs(dx)*1.25){pendingPointer=null;if(!animating)setSelectionLock(false);return;}
    if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy)*1.05)return;
   }else if(Math.abs(dx)<Math.abs(dy)*1.05){pendingPointer=null;if(!animating)setSelectionLock(false);return;}
   const dir=dx<0?1:-1;
   if(!animating&&(index+dir<0||index+dir>=works.length)){showEdge(dir,dx);pendingPointer=null;setSelectionLock(false);return;}
   if(event.pointerType==='touch'){beginTouchTurn(pendingPointer,event,dir);return;}
   const start=pendingPointer.event;pendingPointer=null;
   down(start,dir);
   if(!drag&&!animating)setSelectionLock(false);
  }
  move(event);
 }
 function onPointerRelease(event){
  if(disposed)return;
  if(pendingPointer?.id===event.pointerId)cancelPendingTouch();
  clearEdge();
  if(inputBlocked())onPointerCancel(event);else release(event);
  dropPointerCapture(event.pointerId);
  if(!animating&&!drag&&!pendingPointer)setSelectionLock(false);
 }
 function onPointerCancel(event){
  if(disposed)return;
  if(pendingPointer?.id===event.pointerId)cancelPendingTouch();
  if(!drag||drag.id!==event.pointerId){if(!animating&&!pendingPointer)setSelectionLock(false);return;}
  const id=drag.id;drag=null;
  goal=angle>90?180:0;velocity=0;settling=true;animating=true;
  dropPointerCapture(id);
  if(reducedMotion.matches){angle=goal;finish();}else render();
 }
 function onInputBlur(){
  guidePointerPressed=false;
  postponeGuide();
  clearLandedDust();
  clearRequestedNavigation();
  if(loadRequest?.kind==='turn'){cancelPreparation();publishLoadState('ready');render();}
  if(wheelActive)finishWheel();
  pendingPointer=null;
  if(drag)onPointerCancel({pointerId:drag.id});
  setSelectionLock(false);
 }
 function onVisibilityChange(){if(nativeDocument.hidden)onInputBlur();else scheduleGuide();}
 function lockWheel(){
  wheelMomentumLocked=true;
  if(wheelMomentumUnlockTimer!==null)window.clearTimeout(wheelMomentumUnlockTimer);
  wheelMomentumUnlockTimer=window.setTimeout(()=>{wheelMomentumLocked=false;wheelMomentumUnlockTimer=null;},160);
 }
 function finishWheel(){
  if(!wheelActive)return;
  wheelActive=false;wheelTimer=null;lockWheel();release({pointerId:-1});
 }
 function onWheel(event){
  if(event.ctrlKey)return;
  if(event.target.closest("[data-artwork-highlights],[data-lightbox-native-scroll]"))return;
  if(!wideLayout.matches||inputBlocked())return;
  const horizontal=event.shiftKey&&Math.abs(event.deltaX)<1?event.deltaY:event.deltaX;
  if(!horizontal||(!event.shiftKey&&Math.abs(horizontal)<=Math.abs(event.deltaY)))return;
  if(wheelMomentumLocked){event.preventDefault();lockWheel();return;}
  if(!wheelActive&&(drag||animating||pendingPointer))return;
  event.preventDefault();
  const pixels=horizontal*(event.deltaMode===1?16:event.deltaMode===2?stage.clientWidth:1);
  if(!wheelActive){
   const dir=pixels>0?1:-1;
   if(index+dir<0||index+dir>=works.length){showEdge(dir,pixels);lockWheel();return;}
   if(!ensureTurnReady(dir))return;
   if(reducedMotion.matches){lockWheel();navigate(dir);return;}
   prepareInteraction();configure(dir);turn.style.display='block';turn.style.visibility='visible';
   angle=0;velocity=0;goal=0;settling=false;animating=true;wheelActive=true;
   drag={id:-1,startX:0,startAngle:0,lastT:performance.now(),v:0,dir};
  }
  const now=performance.now(),travel=stage.getBoundingClientRect().width*.45;
  const proposed=Math.max(0,Math.min(180,angle+pixels*drag.dir/travel*180));
  const elapsed=Math.max(8,now-drag.lastT),retention=Math.exp(-elapsed/36);
  drag.v=drag.v*retention+(proposed-angle)/(elapsed/1000)*(1-retention);
  angle=proposed;drag.lastT=now;render();
  if(wheelTimer!==null)window.clearTimeout(wheelTimer);
  if(angle>=179.55)finishWheel();else wheelTimer=window.setTimeout(finishWheel,140);
 }
const works=options.artworks;
const $=s=>document.querySelector(s), scene=$('#scene'),stage=$('#stage'),book=$('#book'),turn=$('#turn'),front=$('#turnFront'),back=$('#turnBack'),baseLeft=$('#baseLeft'),baseRight=$('#baseRight');let index=Math.max(0,works.findIndex(w=>w.id===options.initialArtworkId)), direction=1, angle=0,velocity=0,goal=0,drag=null,lastTime=performance.now(),settling=false,animating=false;
const corners='<canvas class="material-gl" aria-hidden="true"></canvas><div class="glass-rim" aria-hidden="true"></div>';
function art(w){
 if(w.creationStatus&&w.creationStatus!=='completed'){
  const preview=options.renderPreview?.(w)??`<p>${w.creationStatus==='planned'?'Coming Soon':'In Progress'}</p>`;
  return `<div class="art ga-preview">${preview}</div>`;
 }
 return `<div class="art" role="img" aria-label="${escapeHtml(w.images.primary.alt)}"><img class="ga-image relative z-10 h-auto max-h-[58svh] w-auto max-w-full select-none object-contain shadow-[0_35px_100px_rgba(0,0,0,0.45)] md:max-h-[64svh] lg:max-h-[75vh] [@media(orientation:landscape)_and_(max-height:600px)]:!max-h-[78svh] [@media(orientation:landscape)_and_(max-height:600px)]:!max-w-[94vw]" src="${escapeHtml(w.images.primary.src)}" alt="${escapeHtml(w.images.primary.alt)}" width="${w.images.primary.width??1200}" height="${w.images.primary.height??1200}" decoding="async" draggable="false"/></div>`;
}
function info(w,id){
 if(options.renderInformation)return `<div tabindex="0" class="info">${options.renderInformation(w,id)}</div>`;
 const presentation=options.getPresentation?.(w);
 const authorship=escapeHtml(formatArtworkAuthorship(w,locale));
 return `<div tabindex="0" class="info max-w-xl -translate-y-1 md:-translate-y-2 lg:max-w-md lg:translate-y-0"><small class="font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-brand-gold">${escapeHtml(presentation?.yearLabel??String(w.year))} · ${authorship}</small><h2 class="mt-5 font-display text-4xl font-light leading-[0.98] tracking-[0.01em] text-white md:text-5xl xl:text-6xl">${escapeHtml(w.title)}</h2>${presentation?.previewLabel?`<p class="mt-3 font-sans text-xs text-white/50">${escapeHtml(presentation.previewLabel)}</p>`:''}${w.quote?`<p lang="${artworkTextLocale(w,locale)}" class="ga-quote mt-6 font-display text-lg font-light italic leading-relaxed text-white/65 md:text-xl">“${escapeHtml(w.quote)}”</p>`:''}<div class="rule" aria-hidden="true">${glintMarkup(id+'-glint')}</div><dl class="ga-metadata mt-8 grid grid-cols-[110px_1fr] gap-x-6 gap-y-4 font-sans text-sm"><dt class="text-white/35">${escapeHtml(copy.medium)}</dt><dd class="text-white/75">${escapeHtml(formatArtworkTechnique(w,locale))}</dd><dt class="text-white/35">${escapeHtml(copy.dimensions)}</dt><dd class="text-white/75">${w.dimensions.width} × ${w.dimensions.height} ${escapeHtml(w.dimensions.unit)}</dd><dt class="text-white/35">${escapeHtml(copy.status)}</dt><dd class="text-white/75">${escapeHtml(presentation?.statusLabel??formatLabel(w.availability))}</dd></dl>${w.description?`<p lang="${artworkTextLocale(w,locale)}" class="ga-description mt-10 font-sans text-sm font-light leading-[1.9] text-white/55 md:text-[15px]">${escapeHtml(w.description)}</p>`:''}${w.categories.length?`<div class="ga-categories mt-10 gap-x-5 gap-y-3">${w.categories.map(category=>`<span class="font-sans text-[9px] uppercase tracking-[0.24em] text-white/35">${escapeHtml(formatArtworkCategory(category,locale))}</span>`).join('')}</div>`:''}</div>`;
}
// DOM labels and shader uniforms share these descriptors. Never infer the
// artwork again from the current index while a different spread is exposed.
const faceStates=new Map();
let transition=null;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const glassProfile=Object.freeze({outerRadius:14,innerRadius:2});
// Stable portal nodes move with their owning art face, never with the scene.
const highlightWindows=[0,1].map(slot=>{
 const window=nativeDocument.createElement('div');
 window.className='ga-highlights-window';
 window.dataset.glassHighlightWindow=String(slot);
 window.innerHTML=`<div class="ga-artwork-highlights" data-glass-artwork-highlights="${slot}" inert aria-hidden="true"></div>`;
 return window;
});
const highlights=highlightWindows.map(window=>window.firstElementChild);
const highlightIndices=[-1,-1];
const highlightLayouts=[null,null];
let activeHighlight=0,highlightTransition=null;
document.documentElement.style.setProperty('--glass-outer-radius',glassProfile.outerRadius+'px');
document.documentElement.style.setProperty('--glass-inner-radius',glassProfile.innerRadius+'px');

// Native vector accents travel with their own physical face, including its back.
// Local fragment IDs are stable and unique across the four persistent faces.
const accentPalette=Object.freeze({
 shadow:'#6F4B2D',bronze:'#A77943',gold:'#C99A5B',shoulder:'#E1BB80',soft:'#E8C48B',light:'#F7DBA9'
});
const linePalette=Object.freeze({...accentPalette,soft:'#DDB783',light:'#EBC994'});
function glintMarkup(id){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 320 64" preserveAspectRatio="none" focusable="false">
 <defs>
  <linearGradient id="${id}-color" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
   <stop offset="0" stop-color="${linePalette.bronze}" stop-opacity=".08"/><stop offset=".14" stop-color="${linePalette.bronze}" stop-opacity=".28"/>
   <stop offset=".32" stop-color="${linePalette.gold}" stop-opacity=".68"/><stop offset=".45" stop-color="${linePalette.soft}" stop-opacity=".94"/>
   <stop offset=".50" stop-color="${linePalette.light}"/><stop offset=".55" stop-color="${linePalette.soft}" stop-opacity=".94"/>
   <stop offset=".68" stop-color="${linePalette.gold}" stop-opacity=".68"/><stop offset=".86" stop-color="${linePalette.bronze}" stop-opacity=".28"/>
   <stop offset="1" stop-color="${linePalette.bronze}" stop-opacity=".08"/>
  </linearGradient>
  <linearGradient id="${id}-field" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
   <stop offset="0" stop-color="${linePalette.bronze}" stop-opacity="0"/><stop offset=".16" stop-color="${linePalette.gold}" stop-opacity=".06"/>
   <stop offset=".32" stop-color="${linePalette.shoulder}" stop-opacity=".42"/><stop offset=".44" stop-color="${linePalette.soft}" stop-opacity=".79"/>
   <stop offset=".50" stop-color="${linePalette.light}"/><stop offset=".56" stop-color="${linePalette.soft}" stop-opacity=".79"/>
   <stop offset=".68" stop-color="${linePalette.shoulder}" stop-opacity=".42"/><stop offset=".84" stop-color="${linePalette.gold}" stop-opacity=".06"/>
   <stop offset="1" stop-color="${linePalette.bronze}" stop-opacity="0"/>
  </linearGradient>
  <filter id="${id}-air" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="24 6"/></filter>
  <filter id="${id}-shoulder" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="12 1.7"/></filter>
  <filter id="${id}-near" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="7 .45"/></filter>
 </defs>
 <path d="M 0 -4 H 320" fill="none" stroke="url(#${id}-field)" stroke-width="9" opacity=".60" filter="url(#${id}-air)"/>
 <path d="M 0 -.8 H 320" fill="none" stroke="url(#${id}-field)" stroke-width="3.4" opacity=".68" filter="url(#${id}-shoulder)"/>
 <path d="M 0 .5 H 320" fill="none" stroke="url(#${id}-color)" stroke-width="1.2" opacity=".65" filter="url(#${id}-near)"/>
 <path d="M 0 .5 H 320" fill="none" stroke="url(#${id}-color)" stroke-width=".45"/>
 </svg>`;
}
function rimMarkup(id,width,height,side){
 const r=glassProfile.outerRadius-1,e=1.30,arcR=r-e;
 const vertical=Math.min(32,height*.15),horizontal=Math.min(40,width*.21);
 const cy=height-r,fx=r-arcR/Math.sqrt(2),fy=cy+arcR/Math.sqrt(2);
 const contour=`M ${e} ${cy-vertical} V ${cy} A ${arcR} ${arcR} 0 0 0 ${r} ${height-e} H ${r+horizontal}`;
 const mirror=side>0?`translate(${width} 0) scale(-1 1)`:'';
 const reflection=`<g data-reflection="corner">
  <g data-soft-glow="corner" opacity=".18">
   <circle cx="${fx+.75}" cy="${fy-.75}" r="12.8" fill="url(#${id}-blend-air)" filter="url(#${id}-blend-air-soft)"/>
  </g>
  <circle data-halo="corner" cx="${fx+1.5}" cy="${fy-1.5}" r="14" fill="url(#${id}-sphere)" opacity=".80" filter="url(#${id}-sphere-soft)"/>
  <g clip-path="url(#${id}-inside)">
   <path d="${contour}" transform="translate(3 -3)" fill="none" stroke="url(#${id}-atmosphere)" stroke-width="16" opacity=".50" filter="url(#${id}-air)"/>
  </g>
  <path d="${contour}" fill="none" stroke="url(#${id}-atmosphere)" stroke-width="4.8" opacity=".56" filter="url(#${id}-outside)"/>
  <path d="${contour}" fill="none" stroke="url(#${id}-light)" stroke-width="2.0" opacity=".50" filter="url(#${id}-near)"/>
  <path d="${contour}" fill="none" stroke="url(#${id}-light)" stroke-width=".72" opacity=".82"/>

 </g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" focusable="false">
 <defs>
  <clipPath id="${id}-inside" clipPathUnits="userSpaceOnUse"><rect width="${width}" height="${height}" rx="${r}"/></clipPath>
  <radialGradient id="${id}-light" gradientUnits="userSpaceOnUse" cx="${fx}" cy="${fy}" r="54">
   <stop offset="0" stop-color="${accentPalette.light}"/><stop offset=".13" stop-color="${accentPalette.soft}"/>
   <stop offset=".28" stop-color="${accentPalette.gold}" stop-opacity=".70"/><stop offset=".50" stop-color="${accentPalette.bronze}" stop-opacity=".26"/>
   <stop offset=".76" stop-color="${accentPalette.bronze}" stop-opacity=".035"/><stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-atmosphere" gradientUnits="userSpaceOnUse" cx="${fx}" cy="${fy}" r="56">
   <stop offset="0" stop-color="${accentPalette.shoulder}" stop-opacity=".88"/><stop offset=".20" stop-color="${accentPalette.gold}" stop-opacity=".66"/>
   <stop offset=".45" stop-color="${accentPalette.bronze}" stop-opacity=".26"/><stop offset=".72" stop-color="${accentPalette.bronze}" stop-opacity=".035"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-sphere">
   <stop offset="0" stop-color="#F0D5A3" stop-opacity=".65"/>
   <stop offset=".18" stop-color="${accentPalette.shoulder}" stop-opacity=".48"/>
   <stop offset=".42" stop-color="${accentPalette.gold}" stop-opacity=".23"/>
   <stop offset=".70" stop-color="${accentPalette.bronze}" stop-opacity=".065"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-blend-air">
   <stop offset="0" stop-color="${accentPalette.light}" stop-opacity=".75"/><stop offset=".20" stop-color="${accentPalette.shoulder}" stop-opacity=".65"/>
   <stop offset=".45" stop-color="${accentPalette.gold}" stop-opacity=".36"/><stop offset=".72" stop-color="${accentPalette.bronze}" stop-opacity=".10"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <filter id="${id}-blend-air-soft" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="${id}-sphere-soft" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${id}-air" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="${id}-outside" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="${id}-near" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".52"/></filter>
 </defs>
 <g transform="${mirror}">${reflection}<g transform="translate(0 ${height}) scale(1 -1)">${reflection}</g></g></svg>`;
}
function updateRim(el,state,width,height,deg,strength){
 const signature=width+':'+height+':'+state.side;
 if(state.rimSignature!==signature){
  state.rim.innerHTML=rimMarkup(el.id+'-rim',width,height,state.side);
  state.rimSignature=signature;
 }
 const angleEnergy=1+.10*Math.pow(Math.sin(deg*Math.PI/180),2);
 state.rim.style.opacity=String(Math.min(1,strength*angleEnergy));
}

for(const el of [baseLeft,baseRight,front,back]){
 el.innerHTML='<div class="face-content"></div>'+corners;
 const canvas=el.querySelector('.material-gl');
 const state={canvas,content:el.querySelector('.face-content'),rim:el.querySelector('.glass-rim'),rimSignature:null,kind:null,workIndex:-1,side:1,initialized:false};
 faceStates.set(el,state);
 canvas.addEventListener('webglcontextlost',e=>{
  if(disposed)return;
  e.preventDefault();resources.delete(glassStates.get(canvas));glassStates.delete(canvas);state.initialized=true;
  $('#glstatus').textContent=copy.restoring;
 });
 canvas.addEventListener('webglcontextrestored',()=>{
  if(disposed)return;
  state.initialized=false;paintMaterialFrame();
 });
}
function assignFace(el,kind,workIndex,side){
 const state=faceStates.get(el);
 if(state.kind!==kind||state.workIndex!==workIndex){
  state.content.innerHTML=kind==='art'?art(works[workIndex]):info(works[workIndex],el.id);
 }
 Object.assign(state,{kind,workIndex,side});
 el.dataset.workIndex=String(workIndex);el.dataset.kind=kind;el.dataset.side=String(side);
}
function syncLayout(){
 const artWidth=baseLeft.clientWidth,infoWidth=baseRight.clientWidth;
 const infoStart=baseRight.offsetLeft;
 const gap=Math.max(0,infoStart-artWidth),hinge=artWidth+gap*.5;
 stage.style.setProperty('--glass-hinge',hinge+'px');
 stage.style.setProperty('--glass-art-width',artWidth+'px');
 root.style.setProperty('--glass-art-width',artWidth+'px');
 // Preserve the base camera distance while fitting the larger viewport.
 // The camera depends only on the resting layout, never on the turn angle.
 // A rigid leaf may project past the viewport without any automatic fitting.
 const distance=Math.max(1040,Math.max(artWidth,infoWidth)*2.35);
 const camera=distance.toFixed(2)+'px';
 if(stage.style.perspective!==camera)stage.style.perspective=camera;
 $('#persp').value=distance.toFixed(2);
 turn.style.left=hinge+'px';turn.style.transformOrigin='0px center';
 for(const face of [front,back]){
  const width=faceStates.get(face).kind==='art'?artWidth:infoWidth;
  face.style.width=width+'px';
  face.style.left=(direction===1?gap*.5:-width-gap*.5)+'px';
 }
}
function syncOcclusion(){
 const left=faceStates.get(baseLeft).content,right=faceStates.get(baseRight).content;
 left.style.clipPath='none';right.style.clipPath='none';
 if(!transition||!wideLayout.matches)return;
 // Hide only the underlying copy covered by the projected moving face.
 // CSS masks content to its own physical leaf. The moving sheet itself keeps
 // its full size and may project beyond the book or viewport.
 const face=angle<90?front:back,state=faceStates.get(face);
 const theta=(direction===1?-angle:angle)*Math.PI/180;
 const hinge=baseLeft.clientWidth+(baseRight.offsetLeft-baseLeft.clientWidth)*.5;
 const distance=Number($('#persp').value)||1040;
 const project=x=>hinge+x*Math.cos(theta)/Math.max(.10,1+Math.sin(theta)*x/distance);
 const start=Number.parseFloat(face.style.left),end=start+Number.parseFloat(face.style.width);
 const min=Math.min(project(start),project(end)),max=Math.max(project(start),project(end));
 if(state.kind==='art'){
  const clipped=Math.max(0,Math.min(baseLeft.clientWidth,baseLeft.clientWidth-min));
  left.style.clipPath=`inset(0 ${clipped}px 0 0)`;
 }else{
  const clipped=Math.max(0,Math.min(baseRight.clientWidth,max-baseRight.offsetLeft));
  right.style.clipPath=`inset(0 0 0 ${clipped}px)`;
 }
}
function configure(dir){
 clearLandedDust();
 setSelectionLock(true);
 direction=dir;
 const target=index+dir;
 if(target<0||target>=works.length)throw Error('Invalid artwork transition');
 transition=Object.freeze({from:index,to:target,direction:dir});
 if(dir===1){
  assignFace(baseLeft,'art',index,-1);assignFace(baseRight,'info',target,1);
  assignFace(front,'info',index,1);assignFace(back,'art',target,-1);

 }else{
  assignFace(baseLeft,'art',target,-1);assignFace(baseRight,'info',index,1);
  assignFace(front,'art',index,-1);assignFace(back,'info',target,1);

 }
 turn.dataset.direction=String(dir);
 return target;
}
function assignHighlight(slot,artworkIndex){
 if(highlightIndices[slot]===artworkIndex)return;
 highlightIndices[slot]=artworkIndex;
 options.onHighlightArtwork?.(slot,works[artworkIndex]);
}
function alignHighlight(slot,face){
 const content=faceStates.get(face).content;
 const image=content.querySelector('.ga-image'),art=content.querySelector('.art');
 const width=face.clientWidth;
 const signature=[face.id,face.dataset.workIndex,width,face.clientHeight,image?.offsetLeft,image?.offsetWidth,art?.offsetLeft].join(':');
 if(highlightLayouts[slot]===signature)return;
 highlightLayouts[slot]=signature;
 const inset=Math.max(16,Math.min(28,width*.035));
 let left=inset,right=width-inset;
 if(image&&image.offsetWidth){
  const matrix=window.getComputedStyle(image).transform.match(/^matrix(?:3d)?\((.*)\)$/);
  const scale=matrix?Math.abs(Number(matrix[1].split(',')[0])):1;
  const paintedWidth=image.offsetWidth*scale;
  const start=(art?.offsetLeft??0)+image.offsetLeft-(paintedWidth-image.offsetWidth)*.5;
  left=Math.max(inset,start);right=Math.min(width-inset,start+paintedWidth);
 }
 highlights[slot].style.left=left.toFixed(3)+'px';
 highlights[slot].style.width=Math.max(0,right-left).toFixed(3)+'px';
 highlights[slot].style.bottom=Math.max(12,Math.min(18,face.clientHeight*.025)).toFixed(3)+'px';
}
function syncHighlights(){
 if(transition&&highlightTransition!==transition){
  highlightTransition=transition;
  assignHighlight(activeHighlight,transition.from);
  assignHighlight(1-activeHighlight,transition.to);
 }else if(!transition){
  if(highlightTransition&&index===highlightTransition.to)activeHighlight=1-activeHighlight;
  highlightTransition=null;
  assignHighlight(activeHighlight,index);
 }
 // Both phases use the live leaf angle, including reverse drags and regrabs.
 // The target ribbon enters during expansion, before finish() commits the route.
 const ease=value=>{const p=Math.max(0,Math.min(1,value));return p*p*(3-2*p);};
 for(const [slot,highlight] of highlights.entries()){
  const sourceFace=transition?.direction===-1?front:baseLeft;
  const targetFace=transition?.direction===-1?baseLeft:back;
  const face=slot===activeHighlight?sourceFace:targetFace;
  // Reparent the complete reveal window without remounting React content.
  // Native face transforms supply the same perspective as the painting.
  if(highlightWindows[slot].parentElement!==face)face.appendChild(highlightWindows[slot]);
  alignHighlight(slot,face);
  const work=works[highlightIndices[slot]];
  const ready=!!work&&highlight.querySelector('[data-glass-highlight-artwork]')?.dataset.glassHighlightArtwork===work.id;
  const displacement=transition
   ?ease(slot===activeHighlight?angle/90:(180-angle)/90)
   :(slot===activeHighlight?0:1);
  const detail=highlight.querySelector('[data-artwork-highlight-detail]');
  const contentHeight=detail?highlight.offsetHeight-detail.offsetTop:highlight.offsetHeight;
  const distance=Math.max(32,highlight.offsetHeight,contentHeight)+Math.max(0,parseFloat(highlight.style.bottom)||16)+12;
  highlight.style.setProperty('--ga-halo-y',((ready?displacement:1)*distance).toFixed(3)+'px');
  highlight.inert=!!transition||entrancePlaying||slot!==activeHighlight||!ready;
  highlight.setAttribute('aria-hidden',String(entrancePlaying||!ready||displacement===1));
 }
}
function clearLandedDust(){
 pendingDustIndex=null;dustCleanup?.();dustCleanup=null;
}
function requestLandedDust(){
 clearLandedDust();
 const work=works[index];
 const badges=options.getPresentation?.(work)?.badges??[];
 if(disposed||nativeDocument.hidden||reducedMotion.matches||!badges.some(badge=>badge.kind!=='planned'&&badge.kind!=='in-progress'))return;
 pendingDustIndex=index;
}
function syncLandedDust(){
 if(pendingDustIndex===null)return;
 if(pendingDustIndex!==index){clearLandedDust();return;}
 if(transition||entrancePlaying||inputBlocked())return;
 const highlight=highlights[activeHighlight];
 const ready=highlight.querySelector('[data-glass-highlight-artwork]')?.dataset.glassHighlightArtwork===works[index].id;
 // The stable React portal may commit after the native turn. Wait for the
 // correct live ribbon, not an arbitrary delay or the outgoing artwork.
 if(!ready||highlight.inert||!highlight.querySelector('[data-artwork-highlights]'))return;
 if(!highlight.clientWidth||!highlight.clientHeight)return;
 if(!book.clientWidth||!book.clientHeight||!baseLeft.clientWidth||!baseLeft.clientHeight||!baseRight.clientWidth||!baseRight.clientHeight)return;
 pendingDustIndex=null;
 const stops=[
  burstDust(highlight),
  burstGlassDust(book,baseLeft,baseRight)
 ];
 dustCleanup=()=>{for(const stop of stops)stop();};
}
function render(){syncLayout();updateNavigation();const grazing=Math.pow(Math.sin(angle*Math.PI/180),1.5);turn.style.setProperty("--grazing",grazing.toFixed(4));// Specular highlight slides while the rigid sheet rotates; both endpoints
 // match the static leaf exactly, preventing the last-frame brightness jump.
 const theta=angle*Math.PI/180;
 const shineX=50+(direction===1?1:-1)*34*Math.sin(theta);
 const shineEnergy=1+0.18*Math.pow(Math.sin(theta),2);
 turn.style.setProperty('--shine-x',shineX.toFixed(3)+'%');
 turn.style.setProperty('--shine-energy',shineEnergy.toFixed(4));turn.style.transform=`rotateY(${direction===1?-angle:angle}deg)`;$('#prev').disabled=inputBlocked()||(index===0&&!drag&&!animating);$('#next').disabled=inputBlocked()||(index===works.length-1&&!drag&&!animating);syncHighlights();scene.classList.toggle('turning',!!transition);syncOcclusion();paintMaterialFrame();syncLandedDust()}
function idle(){
 direction=1;angle=0;goal=0;velocity=0;transition=null;
 turn.style.visibility='hidden';turn.style.display='none';
 assignFace(baseLeft,'art',index,-1);assignFace(baseRight,'info',index,1);
 // Prewarm both hidden surfaces without recreating them on the first grab.
 assignFace(front,'info',index,1);assignFace(back,'art',Math.min(index+1,works.length-1),-1);
 render();
}
// Button/key bursts retain one bounded destination, never an image-load queue.
let requestedIndex=null,rapidNavigation=false;
function clearRequestedNavigation(){requestedIndex=null;rapidNavigation=false;}
function requestNavigation(dir){
 if(disposed||inputBlocked()||drag||wheelActive||pendingPointer||(dir!==1&&dir!==-1))return;
 const destination=requestedIndex??(transition&&goal===180?transition.to:index);
 const target=Math.max(0,Math.min(works.length-1,destination+dir));
 if(target===destination)return;
 requestedIndex=target;
 if(animating)rapidNavigation=true;
 else navigate(Math.sign(target-index));
}
function continueRequestedNavigation(){
 if(requestedIndex===null)return;
 if(disposed||!wideLayout.matches||inputBlocked()||index===requestedIndex){clearRequestedNavigation();return;}
 navigate(Math.sign(requestedIndex-index));
}

function navigate(dir){
 if(inputBlocked()||drag||animating||index+dir<0||index+dir>=works.length)return;
 if(!ensureTurnReady(dir))return;
 prepareInteraction();configure(dir);turn.style.display='block';turn.style.visibility='visible';
 angle=0;velocity=0;goal=180;animating=true;settling=true;render();
 if(reducedMotion.matches||!wideLayout.matches){angle=180;finish();}
}
function finish(){
 // Prepare and draw the resting spread before hiding the covering sheet.
 // A cancelled turn commits its source; a completed turn commits its target.
 if(!transition)return;
 index=goal===180?transition.to:transition.from;
 assignFace(baseLeft,'art',index,-1);assignFace(baseRight,'info',index,1);
 paintMaterialFrame();
 turn.style.display='none';turn.style.visibility='hidden';
 animating=false;settling=false;direction=1;angle=0;goal=0;velocity=0;transition=null;
 setSelectionLock(false);
 render();
}
function tick(now){
 synchronizeMotionPause();
 if(inputBlocked()){lastTime=now;requestAnimationFrame(tick);return;}
 const dt=Math.min(.025,(now-lastTime)/1000||.016);lastTime=now;
 if(settling&&!drag){
   // A faster natural response keeps the original damping ratio and
   // directional character. Release velocity and direct dragging stay intact.
   const settlePace=rapidNavigation?2.1:1.5;
   const stiffness=(direction===1?230:130)*settlePace*settlePace;
   const damping=(direction===1?24:20)*settlePace;
   const acceleration=(goal-angle)*stiffness-velocity*damping;
   velocity+=acceleration*dt;angle+=velocity*dt;
   if(goal===180&&angle>=179.55){angle=180;finish()}
   else if(goal===0&&angle<=.45){angle=0;finish()}
   else render();
 }else render();
 requestAnimationFrame(tick);
}
function down(e,requestedDirection){
 if(inputBlocked()||drag||e.button!==0)return;
 if(!animating){
  const rect=stage.getBoundingClientRect();
  const dir=requestedDirection??(e.clientX>=rect.left+baseLeft.clientWidth+(baseRight.offsetLeft-baseLeft.clientWidth)*.5?1:-1);
  if(index+dir<0||index+dir>=works.length||!ensureTurnReady(dir))return;
 }
 // Native Touch Events have identifiers independent of Pointer Events.
 // Document movement also keeps a mouse grab alive if capture is unavailable.
 try{scene.setPointerCapture(e.pointerId);}catch{}
 setSelectionLock(true);e.preventDefault?.();
 clearRequestedNavigation();
 prepareInteraction();
 const rect=stage.getBoundingClientRect();
 const relative=(e.clientX-rect.left)/rect.width;
 if(animating){
   // Grab the moving leaf without resetting its angle or its contents.
   // This also works while it is returning to its starting side.
   settling=false;velocity=0;
   drag={id:e.pointerId,startX:e.clientX,startAngle:angle,lastT:performance.now(),v:0,dir:direction};
 }else{
   const dir=requestedDirection??(e.clientX>=rect.left+baseLeft.clientWidth+(baseRight.offsetLeft-baseLeft.clientWidth)*.5?1:-1);
   if(index+dir<0||index+dir>=works.length)return;
   prepareInteraction();configure(dir);turn.style.display='block';turn.style.visibility='visible';
   angle=0;velocity=0;goal=0;settling=false;animating=true;
   drag={id:e.pointerId,startX:e.clientX,startAngle:0,lastT:performance.now(),v:0,dir};
 }
 render();
}
function move(e){
 if(!drag||e.pointerId!==drag.id)return;
 e.preventDefault?.();
 const now=performance.now();
 const travel=stage.getBoundingClientRect().width*.45;
 const signed=drag.dir===1?-(e.clientX-drag.startX):(e.clientX-drag.startX);
 const proposed=Math.max(0,Math.min(180,drag.startAngle+(signed/travel)*180));
 const dt=Math.max(8,now-drag.lastT);
 const instantaneous=(proposed-angle)/(dt/1000);
 drag.v=drag.v*.65+instantaneous*.35;
 angle=proposed;drag.lastT=now;render();
}
function up(e){
 if(!drag||e.pointerId!==drag.id)return;
 const v=drag.v;drag=null;
 goal=angle>90||v>230?180:0;
 velocity=Math.max(-260,Math.min(260,v*.4));
 settling=true;animating=true;render();
}
// Keep the approved down/move/up response intact. Only the passive spring
// settles faster; reduced motion still bypasses passive animation.
function release(e){
 if(!drag||e.pointerId!==drag.id)return;
 up(e);
 if(reducedMotion.matches&&settling){angle=goal;finish();}
}

function usesNativeTouch(event){return event.pointerType==='touch'&&'ontouchstart' in window;}
const scenePointerHandlers=[['pointerdown',onPointerDown],['pointermove',onPointerMove],['pointerup',onPointerRelease],['pointercancel',onPointerCancel],['lostpointercapture',onPointerCancel]]
 .map(([type,handler])=>[type,event=>{if(!usesNativeTouch(event))handler(event);}]);
for(const [type,handler] of scenePointerHandlers)scene.addEventListener(type,handler);
const stopTouch=bindGlassTouchNavigation(scene,{
 start(input){onPointerDown(input);return pendingPointer?.id===input.pointerId||drag?.id===input.pointerId;},
 move:onPointerMove,end:input=>input.type==='pointercancel'?onPointerCancel(input):onPointerRelease(input)
});
cleanups.push(stopTouch);
function onOutsidePointerMove(event){if(!usesNativeTouch(event)&&!scene.contains(event.target))onPointerMove(event);}
function onDocumentPointerUp(event){if(!usesNativeTouch(event))onPointerRelease(event);}
function onDocumentPointerCancel(event){if(!usesNativeTouch(event))onPointerCancel(event);}
$('#next').onclick=()=>requestNavigation(1);$('#prev').onclick=()=>requestNavigation(-1);
document.addEventListener('keydown',e=>{
 if(e.target.closest('input,textarea,select,[contenteditable],[data-artwork-highlights],[data-lightbox-native-scroll]'))return;
 if(e.key==='ArrowRight'){e.preventDefault();requestNavigation(1)}
 if(e.key==='ArrowLeft'){e.preventDefault();requestNavigation(-1)}
});
$('#optical').oninput=e=>{document.documentElement.style.setProperty('--optical-strength',(e.target.value/100).toFixed(2));$('#opticalValue').textContent=e.target.value+'%'};$('#cornerOptical').oninput=e=>{$('#cornerValue').textContent=e.target.value+'%'};$('#persp').oninput=e=>{stage.style.perspective=e.target.value+'px';$('#perspValue').textContent=e.target.value+' px'}

// 11B-23 optics composited transparently over the canonical detail content.
const glassStates=new WeakMap();
const glVert=`#version 300 es
precision highp float;in vec2 aPosition;out vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const glFrag=`#version 300 es
precision highp float;in vec2 vUv;out vec4 outColor;
uniform float uAngle,uLight,uStrength,uArt,uPalette,uSide,uPixelRatio,uCornerStrength;
uniform vec2 uSize,uRadii;
vec3 rotY(vec3 p,float a){return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
void coat(inout vec3 color,inout float alpha,vec3 tint,float coverage){
 coverage=clamp(coverage,0.,1.);
 float next=coverage+alpha*(1.-coverage);
 color=(tint*coverage+color*alpha*(1.-coverage))/max(next,.001);
 alpha=next;
}
void main(){
 vec2 uv=vUv;vec2 q=uv*2.-1.;
 float a=radians(uAngle),l=radians(uLight);
 vec3 n=normalize(rotY(vec3(0.,0.,1.),a));
 // Same camera/light/half-vector/Fresnel/specular model as Optical Lab 10.
 vec3 ro=vec3(0.,0.,3.5);
 // uSide is +1 for a face whose hinge is on its left and -1 on its right.
 // The reverse carries the opposite side and a 180-degree normal rotation.
 // Both faces therefore occupy the same rigid sheet around the same hinge.
 vec3 p=rotY(vec3((q.x+uSide)*.59,q.y*.76,0.),a);
 vec3 L=normalize(vec3(sin(l),.30,cos(l)));
 vec3 V=normalize(ro-p);vec3 H=normalize(L+V);
 float spec=pow(max(dot(n,H),0.),180.);
 float fres=pow(1.-abs(dot(n,V)),4.);
 float grazing=pow(max(dot(reflect(-L,n),V),0.),26.);
 float band=pow(max(dot(n,H),0.),30.);
 float energy=uStrength*(spec*2.8+grazing*.28+band*.15+fres*.48);
 // Information faces are visible at negative normal angles; artwork faces
 // are visible at positive angles. A mirrored support light lets the same
 // rigid-glass specular model catch both sweeps. The approved artwork pass
 // and primary light at +35 degrees remain exactly unchanged.
 if(uArt<.5){
  vec3 infoL=normalize(vec3(-sin(l),.30,cos(l)));
  vec3 infoH=normalize(infoL+V);
  float infoSpec=pow(max(dot(n,infoH),0.),180.);
  float infoGrazing=pow(max(dot(reflect(-infoL,n),V),0.),26.);
  float infoBand=pow(max(dot(n,infoH),0.),30.);
  energy+=uStrength*(infoSpec*2.8+infoGrazing*.28+infoBand*.15);
 }

 // Only a neutral 5% black film is composited over the existing DOM image.
 // Reflection raises opacity locally; the primary image is never repainted.
 float spineDistance=uSide>0.?uv.x:1.-uv.x;
 float spine=exp(-spineDistance*18.)*uStrength*(.07+.13*fres);
 float alpha=.05;
 vec3 color=vec3(0.);
 coat(color,alpha,vec3(1.,.86,.64),1.-exp(-max(energy+spine,0.)));
 // Signed distance to the rounded contour, in CSS pixels. The radii
 // match the clipping profile minus its one-pixel transparent border.
 vec2 cssSize=uSize/max(uPixelRatio,.001);
 vec2 centered=(uv-.5)*cssSize;
 vec2 edgePx=min(uv,1.-uv)*cssSize;
 bool outerCorner=q.x*uSide>0.;
 float radius=outerCorner?uRadii.x:uRadii.y;
 radius=min(radius,min(cssSize.x,cssSize.y)*.25);
 vec2 box=abs(centered)-(cssSize*.5-vec2(radius));
 vec2 roundVector=max(box,vec2(0.));
 float contour=length(roundVector)+min(max(box.x,box.y),0.)-radius;
 float distanceInside=-contour;
 float aa=max(fwidth(contour),.35);
 // The bevel normal follows each corner's arc as well as its straight edges.
 vec2 outward=length(roundVector)>.001?normalize(roundVector)*sign(centered):
   (box.x>box.y?vec2(sign(centered.x),0.):vec2(0.,sign(centered.y)));
 vec3 bevelN=normalize(rotY(vec3(outward*.55,1.),a));
 vec3 perimeterL=uArt<.5?normalize(vec3(-sin(l),.30,cos(l))):L;
 vec3 perimeterH=normalize(perimeterL+V);
 float bevelSpec=pow(max(dot(bevelN,perimeterH),0.),64.);
 float bevelFres=pow(1.-abs(dot(bevelN,V)),4.);
 // The continuous rim uses a bounded bronze/champagne reflection.
 // The contour stays in place; its colored film is now finer and capped at 50% opacity.
 float offset=distanceInside-.85;
 float coreWidth=max(.23,aa*.32);
 float softCore=exp(-.5*pow(offset/coreWidth,2.));
 float shoulder=exp(-.5*pow(offset/1.15,2.));
 float falloff=1.-smoothstep(3.,4.5,max(distanceInside,0.));
 float rimEnergy=.06+uStrength*(.24+.16*bevelSpec+.06*bevelFres);
 float borderOpacity=.50;
 float rimCoverage=borderOpacity*softCore*falloff*clamp(.50+uStrength*(.70+.50*bevelSpec+.20*bevelFres),0.,1.);
 vec3 bronzeShadow=vec3(111.,75.,45.)/255.;
 vec3 bronzeBody=vec3(167.,121.,67.)/255.;
 vec3 goldShoulder=vec3(201.,154.,91.)/255.;
 vec3 champagne=vec3(225.,187.,128.)/255.;
 vec3 highlight=vec3(240.,213.,163.)/255.;
 coat(color,alpha,champagne,rimCoverage);
 // A specular corner focus feeds the short physical metal bevel.
 // A distinct bronze substrate preserves the cap under the moving glass
 // reflection. Its warm catch and surrounding light have independent energy.
 vec3 cornerHighlight=vec3(247.,219.,169.)/255.;
 vec3 cornerGlow=vec3(211.,164.,96.)/255.;
 float cornerReach=max(edgePx.x,edgePx.y);
 bool onArc=box.x>0. && box.y>0.;
 float along=onArc?radius*abs(atan(roundVector.y,roundVector.x)-.785398):
   radius*.785398+max(cornerReach-radius,0.);
 float tailEnvelope=outerCorner?exp(-pow(along/44.,1.6)):0.;
 tailEnvelope*=1.-smoothstep(28.,42.,along);
 float focusEnvelope=outerCorner?exp(-.5*pow(along/18.,2.)):0.;
 focusEnvelope*=1.-smoothstep(30.,48.,along);
 float capWidth=.60+5.80*exp(-pow(along/32.,1.7));
 float capCoverage=tailEnvelope*(1.-smoothstep(capWidth-aa*.6,capWidth+aa*.6,distanceInside));
 float across=clamp(distanceInside/capWidth,0.,1.);
 vec3 capN=normalize(rotY(vec3(outward*(1.-2.*across),1.),a));
 float capSpec=pow(max(dot(capN,perimeterH),0.),100.);
 float darkFacet=exp(-pow((across-.73)/.16,2.));
 float broadFacet=exp(-pow((across-.37)/.30,2.));
 vec3 bronzeEnvironment=mix(vec3(.14,.115,.09),bronzeShadow,.38);
 vec3 metal=mix(bronzeEnvironment,goldShoulder,.24+.40*broadFacet);
 metal=mix(metal,champagne,broadFacet*(.18+.22*uCornerStrength));
 metal*=1.-.28*darkFacet;
 coat(color,alpha,metal,capCoverage);
 float depth=max(distanceInside,0.);
 float innerAir=exp(-.5*pow((depth-2.2)/6.2,2.));
 innerAir*=1.-smoothstep(17.,23.,depth);
 float airEnergy=innerAir*focusEnvelope*uCornerStrength*.21;
 coat(color,alpha,cornerGlow,1.-exp(-airEnergy));
 float cornerShoulder=exp(-.5*pow((depth-1.7)/1.05,2.));
 float shoulderEnergy=cornerShoulder*focusEnvelope*uCornerStrength*(.56+.12*capSpec);
 coat(color,alpha,vec3(225.,187.,128.)/255.,1.-exp(-shoulderEnergy));
 float reflectionDepth=1.30+.22*sin(a+.15*outward.y);
 float catchWidth=max(.34,aa*.60);
 float arcCatch=exp(-.5*pow((depth-reflectionDepth)/catchWidth,2.));
 float reflectedEnergy=arcCatch*focusEnvelope*uCornerStrength*(4.3+capSpec*1.2);
 coat(color,alpha,cornerHighlight,1.-exp(-reflectedEnergy));
 outColor=vec4(pow(clamp(color,0.,1.),vec3(.94)),alpha*(1.-smoothstep(-aa,aa,contour)));
}`;
function makeMaterial(canvas){
 try{
  const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:false,antialias:true,preserveDrawingBuffer:true});if(!gl)throw Error('WebGL2 no disponible');
  function sh(t,source){const s=gl.createShader(t);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();gl.attachShader(program,sh(gl.VERTEX_SHADER,glVert));gl.attachShader(program,sh(gl.FRAGMENT_SHADER,glFrag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const material={gl,program,buffer,uniforms:Object.fromEntries(['uAngle','uLight','uStrength','uArt','uPalette','uSide','uSize','uPixelRatio','uRadii','uCornerStrength'].map(k=>[k,gl.getUniformLocation(program,k)]))};
  resources.add(material);return material;
 }catch(e){root.dataset.renderer='fallback';document.querySelector('#glstatus').textContent='Showing the artwork image without reflections.';console.error(e);return null;}
}
function paintMaterialFrame(){
 const strength=Number($('#optical').value)/100;
 const cornerStrength=Number($('#cornerOptical').value)/100;
 const dpr=Math.min(devicePixelRatio||1,2);
 // Hidden canvases have no client size. The fixed leaf supplies the same
 // untransformed dimensions so all four materials are ready before reveal.

 let ready=0;
 for(const [el,state] of faceStates){
  const {canvas,kind,workIndex,side}=state;
  const reference=kind==='art'?baseLeft:baseRight;
  const width=reference.clientWidth,height=reference.clientHeight;
  const w=Math.max(2,Math.round(width*dpr)),h=Math.max(2,Math.round(height*dpr));
  if(!state.initialized){
   state.initialized=true;
   const material=makeMaterial(canvas);
   if(material)glassStates.set(canvas,material);
  }
  const material=glassStates.get(canvas);if(!material)continue;
  const {gl,program,uniforms:u}=material;
  if(gl.isContextLost())continue;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  const deg=el===front?(direction===1?-angle:angle):
    el===back?(direction===1?180-angle:angle-180):el===baseLeft?preview.left:preview.right;
  updateRim(el,state,width,height,deg,cornerStrength);
  const signature=[w,h,dpr,kind,workIndex,side,deg.toFixed(5),strength,cornerStrength].join(':');
  if(material.lastFrame===signature){ready++;continue;}
  material.lastFrame=signature;
  gl.useProgram(program);
  gl.uniform1f(u.uAngle,deg);gl.uniform1f(u.uLight,35);gl.uniform1f(u.uStrength,strength);gl.uniform1f(u.uCornerStrength,cornerStrength);
  gl.uniform1f(u.uArt,kind==='art'?1:0);gl.uniform1f(u.uPalette,workIndex);
  gl.uniform1f(u.uSide,side);gl.uniform2f(u.uSize,w,h);gl.uniform1f(u.uPixelRatio,dpr);gl.uniform2f(u.uRadii,glassProfile.outerRadius-1,glassProfile.innerRadius-1);gl.drawArrays(gl.TRIANGLES,0,6);
  ready++;
 }
 if(ready===4){root.dataset.renderer='webgl';$('#glstatus').textContent='Artwork ready.';}
 else $('#glstatus').textContent='Showing the artwork image without reflections.';
}

// Entrance and guidance use the project's GSAP instance. The approved page
// physics and material remain in their existing single animation loop.
const motion=options.motion;
const preview={left:0,right:0};
const guide=$('#guide'),guideText=$('#guideText'),guideDock=$('#guideDock');
let entranceTween=null,guideTween=null,hoverTween=null,guideTimer=null,demonstrationTween=null;
let guideLearned=false,guideSealing=false;
let guidePointerPressed=false;
let pausedForImage=false,navigationIndex=-1;
let viewportSignature=[baseLeft.clientWidth,baseLeft.clientHeight,baseRight.clientWidth].join(':');
root.dataset.guide=guideLearned?'learned':'reminding';

function updateNavigation(){
 if(navigationIndex===index)return;
 navigationIndex=index;
 $('#counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(works.length).padStart(2,'0')}`;
 const previous=works[index-1],next=works[index+1];
 $('#previousTitle').textContent=previous?.title??'';
 $('#nextTitle').textContent=next?.title??'';
 $('#prev').setAttribute('aria-label',previous?copy.previousArtwork+' '+previous.title:copy.noPrevious);
 $('#next').setAttribute('aria-label',next?copy.nextArtwork+' '+next.title:copy.noNext);
 $('#prev').title=previous?.title??'';$('#next').title=next?.title??'';
}
function updateGuideCopy(){
 guideDock.textContent=wideLayout.matches?copy.dragDock:copy.buttonDock;
}
function positionGuide(){
 if(disposed||guideLearned||guideSealing||entrancePlaying)return;
 const rect=scene.getBoundingClientRect(),host=root.getBoundingClientRect();
 const values={left:rect.left-host.left+rect.width*.5,top:rect.top-host.top+rect.height*.5,x:0,y:0,scale:1};
 if(motion)motion.set(guide,{...values,xPercent:-50,yPercent:-50});
 else{guide.style.left=values.left+'px';guide.style.top=values.top+'px';}
}
function scheduleGuide(){
 if(guideTimer!==null)window.clearTimeout(guideTimer);guideTimer=null;
 if(!disposed&&!nativeDocument.hidden)guideTimer=window.setTimeout(pulseGuide,5000);
}
function stopGuideDemonstration(){
 if(!demonstrationTween&&!root.hasAttribute('data-glass-demonstrating'))return;
 demonstrationTween?.kill();demonstrationTween=null;
 delete root.dataset.glassDemonstrating;
 preview.left=0;preview.right=0;applyPreview();
}
function postponeGuide(){stopGuideDemonstration();scheduleGuide();}
function pulseGuide(){
 guideTimer=null;
 if(disposed||nativeDocument.hidden)return;
 const selection=nativeDocument.getSelection?.();
 const readingSelection=!!(selection?.toString()&&root.contains(selection.anchorNode));
 if(!guideSealing&&!demonstrationTween&&!inputBlocked()&&!guidePointerPressed&&!drag&&!pendingPointer&&!animating&&!wheelActive&&!readingSelection&&!reducedMotion.matches&&motion){
  const target=guideLearned?guideDock:guide;
  guideTween=motion.to(target,{opacity:.32,duration:.70,yoyo:true,repeat:1,ease:'sine.inOut',overwrite:true});
  if(!guideLearned&&wideLayout.matches&&works.length>1){
   clearPreview(true);
   const side=index<works.length-1?'right':'left',lift=side==='right'?-16:16;
   root.dataset.glassDemonstrating=side;
   // A rigid resting leaf teaches the hinge. The real turn angle, spring,
   // contents, navigation and input ownership never become a fake turn.
   demonstrationTween=motion.timeline({onComplete(){
    demonstrationTween=null;delete root.dataset.glassDemonstrating;
    preview.left=0;preview.right=0;applyPreview();scheduleGuide();
   }})
    .to(preview,{[side]:lift,duration:.72,ease:'power2.out',onUpdate:applyPreview})
    .to(preview,{[side]:0,duration:.82,ease:'power3.in',onUpdate:applyPreview},'+=.28')
    .to(preview,{[side]:side==='right'?.65:-.65,duration:.14,ease:'power2.out',onUpdate:applyPreview})
    .to(preview,{[side]:0,duration:.18,ease:'sine.inOut',onUpdate:applyPreview});
  }
 }
 scheduleGuide();
}
function finishGuide(){
 if(disposed)return;
 guideSealing=false;guideLearned=true;root.dataset.guide='learned';
 guide.style.visibility='hidden';guideDock.style.opacity='1';
}
function learnGuide(){
 if(guideLearned||guideSealing)return;
 if(guideTimer!==null)window.clearTimeout(guideTimer);guideTimer=null;
 scheduleGuide();
 stopGuideDemonstration();
 guideTween?.kill();guideTween=null;
 positionGuide();guideSealing=true;root.dataset.guide='sealing';
 if(!motion||reducedMotion.matches){finishGuide();return;}
 const source=guide.getBoundingClientRect(),target=guideDock.getBoundingClientRect();
 const dx=target.left+target.width*.5-source.left-source.width*.5;
 const dy=target.top+target.height*.5-source.top-source.height*.5;
 motion.set(guide,{opacity:1,visibility:'visible'});
 guideTween=motion.timeline({onComplete:finishGuide});
 guideTween.to(guide,{opacity:.75,scale:.9,duration:.16,ease:'power1.out',onComplete(){guideText.textContent=guideDock.textContent;}})
  .to(guide,{x:dx,y:dy,scale:.72,backgroundColor:'rgba(0,0,0,0)',borderColor:'rgba(255,255,255,0)',duration:.64,ease:'power3.inOut'})
  .to(guide,{opacity:0,duration:.16});
}
function clearPreview(immediate=false){
 if(entrancePlaying)return;
 stopGuideDemonstration();
 hoverTween?.kill();hoverTween=null;
 if(immediate||!motion||reducedMotion.matches){
  preview.left=0;preview.right=0;
  baseLeft.style.transform='none';baseRight.style.transform='none';
 }else hoverTween=motion.to(preview,{left:0,right:0,duration:.30,ease:'power2.out',overwrite:true,onUpdate:applyPreview});
}
function applyPreview(){
 baseLeft.style.transform=preview.left?'rotateY('+preview.left+'deg)':'none';
 baseRight.style.transform=preview.right?'rotateY('+preview.right+'deg)':'none';
}
function onProximity(event){
 if(event.target.closest("[data-artwork-highlights],[data-lightbox-native-scroll]"))return;
 if(!motion||reducedMotion.matches||!wideLayout.matches||inputBlocked()||drag||animating||pendingPointer||demonstrationTween||guidePointerPressed||event.pointerType==='touch')return;
 const rect=stage.getBoundingClientRect(),position=(event.clientX-rect.left)/rect.width;
 let left=0,right=0;
 if(position<.14&&index>0)left=2.6*Math.max(0,Math.min(1,(.14-position)/.14));
 if(position>.86&&index<works.length-1)right=-2.6*Math.max(0,Math.min(1,(position-.86)/.14));
 hoverTween=motion.to(preview,{left,right,duration:.22,ease:'power2.out',overwrite:true,onUpdate:applyPreview});
}
function prepareInteraction(){clearPreview(true);learnGuide();}
function finishEntrance(){
 if(disposed)return;
 entranceTween?.kill();entranceTween=null;entrancePlaying=false;
 preview.left=0;applyPreview();root.dataset.phase='open';render();positionGuide();
 setSelectionLock(false);
 requestLandedDust();
 scheduleGuide();
}
function drawEntrance(){applyPreview();render();}
function beginEntrance(){
 if(disposed)return;
 root.dataset.phase='opening';
 if(!motion||reducedMotion.matches||!wideLayout.matches){finishEntrance();return;}
 entranceTween=motion.timeline({onComplete:finishEntrance});
 // Accelerate toward the spread, then absorb the small rigid rebound.
 entranceTween.to(preview,{left:-2.3,duration:.88,delay:.32,ease:'power2.in',onUpdate:drawEntrance})
  .to(preview,{left:.7,duration:.18,ease:'power2.out',onUpdate:drawEntrance})
  .to(preview,{left:0,duration:.26,ease:'sine.inOut',onUpdate:drawEntrance});
 if(pausedForImage)entranceTween.pause();
}
function startExperience(){
 updateNavigation();updateGuideCopy();
 entrancePlaying=true;root.dataset.phase='loading';
 preview.left=motion&&!reducedMotion.matches&&wideLayout.matches?66:0;drawEntrance();
 prepareArtwork(index,beginEntrance,'entrance');
 positionGuide();
}
function synchronizeMotionPause(){
 const pause=hasBlockingArtworkDialog(root);
 if(pause===pausedForImage)return;
 pausedForImage=pause;
 postponeGuide();
 for(const animation of [entranceTween,guideTween,hoverTween]){
  if(pause)animation?.pause();else animation?.resume();
 }
 if(pause){clearRequestedNavigation();clearPreview(true);clearLandedDust();}
}
function disposeExperience(){
 stopGuideDemonstration();
 entranceTween?.kill();guideTween?.kill();hoverTween?.kill();
 if(guideTimer!==null)window.clearTimeout(guideTimer);
}
scene.addEventListener('pointermove',onProximity);
scene.addEventListener('pointerleave',()=>clearPreview());
// Observe the first press before native-touch or mouse ownership is decided.
// Reading and taps postpone teaching; only a real navigation learns it.
function guidePress(){guidePointerPressed=true;postponeGuide();}
function guideRelease(){if(guidePointerPressed){guidePointerPressed=false;postponeGuide();}}
function guideMotionChanged(){postponeGuide();}
root.addEventListener('pointerdown',guidePress,true);
nativeDocument.addEventListener('pointerup',guideRelease,true);
nativeDocument.addEventListener('pointercancel',guideRelease,true);
scene.addEventListener('wheel',postponeGuide,{passive:true,capture:true});
scene.addEventListener('scroll',postponeGuide,true);
root.addEventListener('focusin',postponeGuide);
reducedMotion.addEventListener('change',guideMotionChanged);
cleanups.push(()=>{
 root.removeEventListener('pointerdown',guidePress,true);
 nativeDocument.removeEventListener('pointerup',guideRelease,true);
 nativeDocument.removeEventListener('pointercancel',guideRelease,true);
 scene.removeEventListener('wheel',postponeGuide,true);
 scene.removeEventListener('scroll',postponeGuide,true);
 root.removeEventListener('focusin',postponeGuide);
 reducedMotion.removeEventListener('change',guideMotionChanged);
});

// One animation loop: transform, content and material are drawn in one frame.
idle();requestAnimationFrame(tick);

 const approvedFinish=finish;
 finish=function(){const before=index;approvedFinish();if(index!==before){requestLandedDust();preload();options.onNavigate?.(works[index]);}continueRequestedNavigation();};
 scene.addEventListener('wheel',onWheel,{passive:false});
 nativeDocument.addEventListener('pointermove',onOutsidePointerMove);nativeDocument.addEventListener('pointerup',onDocumentPointerUp);nativeDocument.addEventListener('pointercancel',onDocumentPointerCancel);
 window.addEventListener('blur',onInputBlur);nativeDocument.addEventListener('visibilitychange',onVisibilityChange);
 root.addEventListener('artwork-image-zoom',onInputBlur);
 cleanups.push(()=>{
  nativeDocument.removeEventListener('pointermove',onOutsidePointerMove);nativeDocument.removeEventListener('pointerup',onDocumentPointerUp);nativeDocument.removeEventListener('pointercancel',onDocumentPointerCancel);
  window.removeEventListener('blur',onInputBlur);nativeDocument.removeEventListener('visibilitychange',onVisibilityChange);
  root.removeEventListener('artwork-image-zoom',onInputBlur);
  for(const [type,listener] of scenePointerHandlers)scene.removeEventListener(type,listener);
 });
 function onLayoutChange(){
  postponeGuide();
  clearLandedDust();
  clearRequestedNavigation();
  if(!wideLayout.matches){cancelPendingTouch();setSelectionLock(false);}
  if(!wideLayout.matches&&transition){const pointerId=drag?.id;drag=null;dropPointerCapture(pointerId);pendingPointer=null;wheelActive=false;
   if(wheelTimer!==null)window.clearTimeout(wheelTimer);wheelTimer=null;goal=angle>90?180:0;angle=goal;finish();}
  if(entrancePlaying&&!mediaLoading)finishEntrance();if(guideSealing){guideTween?.kill();finishGuide();}clearPreview(true);updateGuideCopy();positionGuide();
  render();
 }
 wideLayout.addEventListener('change',onLayoutChange);cleanups.push(()=>wideLayout.removeEventListener('change',onLayoutChange));
 const observer=new ResizeObserver(()=>{
  if(disposed)return;
  const signature=[baseLeft.clientWidth,baseLeft.clientHeight,baseRight.clientWidth].join(':');
  if(signature!==viewportSignature){
   viewportSignature=signature;
   clearLandedDust();
   if(guideSealing){guideTween?.kill();finishGuide();}
  }
  render();positionGuide();
 });observer.observe(baseLeft);observer.observe(baseRight);observer.observe(scene);
 const preload=()=>{
  const retained=new Set();
  for(const i of [index-1,index,index+1])if(works[i]){retained.add(works[i].images.primary.src);getPrimaryAsset(works[i]);}
  for(const state of faceStates.values())if(state.kind==='art')retained.add(works[state.workIndex].images.primary.src);
  for(const [src,asset] of assets)if(!retained.has(src)){asset.job.cancel();assets.delete(src);}
 };
 preload();startExperience();
 return {
  navigate(dir){requestNavigation(dir);},
  select(id){
   const target=works.findIndex(work=>work.id===id);if(target<0||target===index)return;
   clearLandedDust();
   clearRequestedNavigation();
   cancelPreparation();
   setSelectionLock(false);
   if(entrancePlaying)finishEntrance();clearPreview(true);
   if(wheelActive){wheelActive=false;if(wheelTimer!==null)window.clearTimeout(wheelTimer);wheelTimer=null;lockWheel();}
   const wasLoading=mediaLoading;
   const pointerId=drag?.id;drag=null;dropPointerCapture(pointerId);pendingPointer=null;settling=false;animating=false;clearEdge();index=target;
   const needsLoading=wasLoading||getPrimaryAsset(works[index]).status!=='ready';
   if(needsLoading)root.dataset.phase='loading';
   idle();preload();
   if(needsLoading)prepareArtwork(index,()=>{root.dataset.phase='open';render();positionGuide();},'selection');
   else publishLoadState('ready');
  },
  retry(){
   if(disposed||!loadRequest||!loadRequest.failed)return;
   const request=loadRequest;
   const src=works[request.artworkIndex].images.primary.src,asset=assets.get(src);
   if(asset){asset.job.cancel();assets.delete(src);}
   for(const state of faceStates.values())if(state.kind==='art'&&state.workIndex===request.artworkIndex){
    for(const image of state.content.querySelectorAll('img')){
     imageJobs.get(image)?.cancel();imageJobs.delete(image);
     const src=image.getAttribute('src');image.removeAttribute('src');image.setAttribute('src',src);
    }
   }
   prepareArtwork(request.artworkIndex,request.continueWith,request.kind);
  },
  dispose(){
   clearLandedDust();
   clearRequestedNavigation();cancelPreparation();
   setSelectionLock(false);
   const pointerId=drag?.id;drag=null;pendingPointer=null;dropPointerCapture(pointerId);
   disposed=true;disposeExperience();window.cancelAnimationFrame(frameId);observer.disconnect();
   if(wheelTimer!==null)window.clearTimeout(wheelTimer);if(edgeTimer!==null)window.clearTimeout(edgeTimer);
   for(const cleanup of cleanups)cleanup();scene.removeEventListener('wheel',onWheel);
   for(const job of imageLoads)job.cancel();assets.clear();
   for(const material of resources){const {gl}=material;gl.deleteBuffer(material.buffer);gl.deleteProgram(material.program);gl.getExtension('WEBGL_lose_context')?.loseContext();}resources.clear();
   root.replaceChildren();
  }
 };
}
