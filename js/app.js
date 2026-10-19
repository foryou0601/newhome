(() => {
'use strict';
const $=id=>document.getElementById(id),config=window.FAMILY_CONFIG;
class FamilyGift {
  constructor() {
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animations=new Set();this.layers=new Set();this.manualPaused=false;this.controller=null;this.serial=0;this.soundOn=true;this.begun=false;
    const split=config.letter.indexOf('\n');$('letterDear').textContent=config.letter.slice(0,split);$('letterBody').textContent=config.letter.slice(split+1);
    $('music').src=config.music;
    $('start').addEventListener('click',()=>this.start());
    $('openAlbum').addEventListener('click',()=>this.album());
    $('replayAlbum').addEventListener('click',()=>this.album());
    $('replayAll').addEventListener('click',()=>this.reset());
    $('pause').addEventListener('click',()=>{this.manualPaused=!this.manualPaused;this.syncPause();});
    $('sound').addEventListener('click',()=>{
      if(this.begun&&$('music').paused){this.soundOn=true;this.playMusic();}else this.soundOn=!this.soundOn;
      this.syncSound();
    });
    document.addEventListener('visibilitychange',()=>this.syncPause());
    new MutationObserver(()=>this.syncPause()).observe($('viewer'),{attributes:true,attributeFilter:['open']});
    $('viewer').addEventListener('click',event=>{if(event.target!==$('viewer'))return;const r=$('viewer').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('viewer').close();});
    this.dust();this.renderGallery();this.syncSound();
    for(const src of ['images/monkey.webp','images/dragon.webp']){const image=new Image();image.src=src;}
  }
  get paused(){return this.manualPaused||document.hidden||$('viewer').open;}
  syncPause(){const paused=this.paused;document.body.classList.toggle('suspended',paused);this.animations.forEach(a=>{if(a.playState!=='finished')paused?a.pause():a.play();});$('pause').textContent=this.manualPaused?'Tiếp tục':'Tạm dừng';$('pause').setAttribute('aria-pressed',String(this.manualPaused));}
  syncSound(){$('music').muted=!this.soundOn;$('sound').setAttribute('aria-pressed',String(this.soundOn));$('sound').innerHTML=this.soundOn?'♫ <span>Đang bật</span>':'♪ <span>Đã tắt</span>';}
  playMusic(){const promise=$('music').play();if(promise)promise.catch(()=>{$('sound').innerHTML='♫ <span>Chạm để nghe</span>';});}
  dust(){const fragment=document.createDocumentFragment();for(let i=0;i<(innerWidth<600?28:45);i++){const star=document.createElement('i');star.className='dust';const size=Math.random()> .9?2:1;star.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;--o:${.15+Math.random()*.4};--speed:${4+Math.random()*5}s;--delay:${-Math.random()*8}s`;fragment.append(star);}$('dust').append(fragment);}
  show(id,chapter){document.querySelectorAll('.scene').forEach(el=>el.classList.toggle('active',el.id===id));$('chapter').textContent=chapter+' — 04';window.scrollTo({top:0,behavior:'instant'});}
  clear(){this.serial++;if(this.controller)this.controller.abort();this.controller=null;this.animations.forEach(a=>a.cancel());this.animations.clear();this.layers.forEach(el=>el.remove());this.layers.clear();$('effects').replaceChildren();this.manualPaused=false;this.syncPause();}
  begin(){this.clear();this.controller=new AbortController();return{signal:this.controller.signal,serial:this.serial};}
  check(signal){if(signal.aborted)throw new DOMException('Stopped','AbortError');}
  wait(duration,signal){return new Promise((resolve,reject)=>{let left=duration,last=performance.now(),timer;const abort=()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);reject(new DOMException('Stopped','AbortError'));};const tick=()=>{if(signal.aborted)return abort();const now=performance.now();if(!this.paused)left-=Math.min(now-last,180);last=now;if(left<=0){signal.removeEventListener('abort',abort);resolve();}else timer=setTimeout(tick,this.paused?180:60);};signal.addEventListener('abort',abort,{once:true});tick();});}
  animate(el,frames,options,onDone){const a=el.animate(frames,options);this.animations.add(a);a.finished.then(()=>{if(onDone)onDone();this.animations.delete(a);a.cancel();},()=>this.animations.delete(a));if(this.paused)a.pause();return a;}
  async step(duration,signal){await this.wait(duration,signal);this.check(signal);}
  async start(){
    if($('start').disabled)return;
    const {signal}=this.begin();this.begun=true;$('start').disabled=true;
    $('gallery').hidden=true;$('music').currentTime=0;$('music').volume=.55;this.syncSound();this.playMusic();
    try{await this.dance(signal);await this.dragonOpening(signal);$('openAlbum').focus({preventScroll:true});}
    catch(error){if(error.name!=='AbortError'){this.show('letterScene','03');$('openAlbum').focus({preventScroll:true});}}
  }
  async dance(signal){
    this.show('party','02');const left=$('monkeyLeft'),right=$('monkeyRight'),actors=[left,right];
    actors.forEach(el=>el.classList.add('visible'));
    actors.forEach((el,i)=>this.animate(el,[{transform:`translate(${(i?1:-1)*(innerWidth+200)}px,65px) rotate(${i?12:-12}deg)`,opacity:0},{transform:'translate(0,-16px) rotate(0deg)',opacity:1,offset:.8},{transform:'translate(0,0) rotate(0deg)',opacity:1}],{duration:this.reduced?200:1100,easing:'cubic-bezier(.16,.7,.25,1)',fill:'both'}));
    await this.step(this.reduced?240:1150,signal);
    for(let round=1;round<=3;round++){
      $('danceStatus').textContent=`Nhào lộn ${round} / 3 · Quẩy cùng nhà mình!`;
      for(let i=0;i<actors.length;i++){
        const sprite=actors[i].querySelector('img'),sign=i?-1:1;
        this.animate(sprite,this.reduced?[{opacity:.5},{opacity:1}]:[{transform:'translateY(0) rotate(0deg)'},{transform:`translateY(-95px) rotate(${sign*180}deg)`,offset:.48},{transform:`translateY(0) rotate(${sign*360}deg)`}],{duration:this.reduced?350:1200,delay:i*100,easing:'cubic-bezier(.35,.05,.35,1)',fill:'both'});
      }
      await this.step(this.reduced?500:1450,signal);
    }
    $('danceStatus').textContent='Ba vòng rồi, nhường sân khấu cho nhân vật tiếp theo nha!';
    actors.forEach((el,i)=>this.animate(el,[{transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1},{transform:`translate(${i?-65:65}px,-50px) scale(.08) rotate(${i?18:-18}deg)`,opacity:0}],{duration:this.reduced?180:850,easing:'ease-in',fill:'both'},()=>el.classList.remove('visible')));
    await this.step(this.reduced?220:930,signal);actors.forEach(el=>el.classList.remove('visible'));
  }
  mouth(dragon){const r=dragon.querySelector('.mouth-anchor').getBoundingClientRect();return{x:r.left+r.width*.55,y:r.top+r.height*.5};}
  fireShot(dragon,target,signal){
    if(this.reduced)return;
    const mouth=this.mouth(dragon),layer=document.createElement('div');layer.className='fire-shot';layer.setAttribute('aria-hidden','true');$('effects').append(layer);this.layers.add(layer);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);svg.setAttribute('preserveAspectRatio','none');layer.append(svg);
    for(let i=0;i<3;i++){
      const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',`M ${mouth.x} ${mouth.y} Q ${(mouth.x+target.x)/2} ${Math.min(mouth.y,target.y)-65-i*12} ${target.x} ${target.y}`);path.setAttribute('fill','none');path.setAttribute('stroke',['#f36b37','#ffb657','#fff2bd'][i]);path.setAttribute('stroke-width',String(22-i*8));path.setAttribute('stroke-linecap','round');svg.append(path);const length=path.getTotalLength();path.style.strokeDasharray=String(length);
      this.animate(path,[{strokeDashoffset:length,opacity:0},{strokeDashoffset:length*.4,opacity:.9,offset:.3},{strokeDashoffset:0,opacity:.8,offset:.7},{strokeDashoffset:-length*.5,opacity:0}],{duration:1050+i*45,easing:'ease-out',fill:'both'},()=>path.remove());
    }
    for(let i=0;i<(innerWidth<600?20:34);i++){
      const ember=document.createElement('i');ember.className='ember';const size=5+Math.random()*10;ember.style.cssText=`left:${mouth.x}px;top:${mouth.y}px;width:${size}px;height:${size*1.8}px`;layer.append(ember);const dx=target.x-mouth.x,dy=target.y-mouth.y;
      this.animate(ember,[{transform:'translate(-50%,-50%) scale(.2)',opacity:0},{transform:`translate(${dx*.55+(Math.random()-.5)*55}px,${dy*.6-40}px) scale(1.2) rotate(-20deg)`,opacity:1,offset:.45},{transform:`translate(${dx+(Math.random()-.5)*140}px,${dy+30+Math.random()*75}px) scale(.1) rotate(40deg)`,opacity:0}],{duration:900+Math.random()*500,delay:Math.random()*150,easing:'ease-out',fill:'both'},()=>ember.remove());
    }
    this.wait(1700,signal).then(()=>{layer.remove();this.layers.delete(layer);},()=>{layer.remove();this.layers.delete(layer);});
  }
  async dragonOpening(signal){
    this.show('dragonIntro','02');const dragon=$('bigDragon');dragon.classList.add('visible');
    this.animate(dragon,[{transform:`translate(${-innerWidth-300}px,-50px) rotate(-10deg)`,opacity:0},{opacity:1,offset:.2},{transform:'translate(0,0) rotate(0deg)',opacity:1}],{duration:this.reduced?200:1550,easing:'cubic-bezier(.18,.65,.25,1)',fill:'both'});
    await this.step(this.reduced?240:1650,signal);this.fireShot(dragon,{x:innerWidth*.77,y:innerHeight*.42},signal);await this.step(this.reduced?180:850,signal);
    const flood=document.createElement('div');flood.className='fire-flood';$('effects').append(flood);this.layers.add(flood);
    if(!this.reduced)for(let i=0;i<14;i++){
      const flame=document.createElement('i');flame.className='fire-pillar';flame.style.left=(i*8-5)+'%';flame.style.width=(12+Math.random()*12)+'%';flood.append(flame);
      this.animate(flame,[{transform:'translateY(70%) scaleY(.3)'},{transform:'translateY(-8%) scaleY(1.1)'},{transform:'translateY(0) scaleY(1)'}],{duration:1500,delay:Math.random()*150,easing:'ease-out',fill:'both'});
    }
    this.animate(flood,[{opacity:0},{opacity:1}],{duration:this.reduced?250:1050,fill:'both'},()=>{flood.style.opacity='1';});
    await this.step(this.reduced?320:1250,signal);this.show('letterScene','03');dragon.classList.remove('visible');
    this.animate(flood,[{opacity:1},{opacity:0}],{duration:this.reduced?350:1450,easing:'ease-in-out',fill:'both'},()=>{flood.remove();this.layers.delete(flood);});
    await this.step(this.reduced?400:1510,signal);
  }
  openPhoto(photo){$('fullPhoto').src=photo.src;$('fullPhoto').alt=photo.original;$('fullCaption').textContent=photo.caption;$('viewer').showModal();}
  makeCard(photo){const card=document.createElement('button');card.className='photo-card';card.setAttribute('aria-label','Xem '+photo.caption);const img=document.createElement('img');img.src=photo.src;img.alt=photo.original;const caption=document.createElement('span');caption.textContent=photo.caption;card.append(img,caption);card.addEventListener('click',()=>this.openPhoto(photo));$('photoStage').append(card);return card;}
  async album(){
    const {signal,serial}=this.begin();this.show('album','04');$('gallery').hidden=true;$('photoStage').replaceChildren();$('pause').disabled=false;$('replayAlbum').disabled=true;$('babyDragon').classList.remove('breathing');
    try{
      for(let i=0;i<config.photos.length;i++){
        this.check(signal);const photo=config.photos[i];$('photoCount').textContent=`${String(i+1).padStart(2,'0')} / ${config.photos.length}`;$('albumHint').textContent='Một chút lửa ấm, một tấm ảnh nhà mình ♡';
        const sky=$('photoStage').getBoundingClientRect(),target={x:sky.left+sky.width/2,y:sky.top+sky.height/2};$('babyDragon').classList.add('breathing');this.fireShot($('babyDragon'),target,signal);
        const card=this.makeCard(photo),mouth=this.mouth($('babyDragon')),dx=mouth.x-target.x,dy=mouth.y-target.y;
        this.animate(card,[{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.08) rotate(18deg)`,opacity:0},{opacity:1,offset:.25},{transform:'translate(-50%,-50%) scale(1) rotate(-3deg)',opacity:1}],{duration:this.reduced?220:1150,easing:'cubic-bezier(.18,.7,.25,1)',fill:'both'});
        await this.step(this.reduced?260:1220,signal);$('babyDragon').classList.remove('breathing');$('albumHint').textContent='Chạm vào ảnh để ngắm lâu hơn.';await this.step(this.reduced?2000:2600,signal);
        this.animate(card,[{opacity:1,transform:'translate(-50%,-50%) rotate(-3deg)'},{opacity:0,transform:'translate(-50%,-62%) rotate(1deg)'}],{duration:this.reduced?180:450,easing:'ease-in',fill:'both'},()=>{card.style.opacity='0';});
        await this.step(this.reduced?220:500,signal);card.remove();await this.step(100,signal);
      }
      $('photoCount').textContent=`${config.photos.length} / ${config.photos.length}`;$('albumHint').textContent='Hết ảnh rồi, còn thương thì chưa hết nha ♡';
      const end=document.createElement('div');end.className='album-complete';const heart=document.createElement('span');heart.textContent='♡';const text=document.createElement('p');text.textContent='Cảm ơn vì đã thành người nhà.';const hint=document.createElement('small');hint.textContent='Tất cả kỷ niệm ở ngay bên dưới.';end.append(heart,text,hint);$('photoStage').append(end);$('gallery').hidden=false;
    }catch(error){if(error.name!=='AbortError')$('albumHint').textContent='Chạm “Xem lại album” để cùng rồng con xem tiếp nhé.';}
    finally{if(this.serial===serial){$('pause').disabled=true;$('replayAlbum').disabled=false;$('babyDragon').classList.remove('breathing');}}
  }
  renderGallery(){const fragment=document.createDocumentFragment();for(const photo of config.photos){const tile=document.createElement('button');tile.className='gallery-tile';tile.setAttribute('aria-label','Xem '+photo.caption);const img=document.createElement('img');img.src=photo.src;img.alt=photo.original;img.loading='lazy';img.decoding='async';const caption=document.createElement('span');caption.textContent=photo.caption;tile.append(img,caption);tile.addEventListener('click',()=>this.openPhoto(photo));fragment.append(tile);}$('galleryGrid').append(fragment);}
  reset(){this.clear();this.begun=false;$('music').pause();$('music').currentTime=0;$('gallery').hidden=true;$('photoStage').replaceChildren();$('monkeyLeft').classList.remove('visible');$('monkeyRight').classList.remove('visible');$('bigDragon').classList.remove('visible');$('start').disabled=false;this.show('welcome','01');$('start').focus({preventScroll:true});}
}
window.FamilyGift=FamilyGift;
window.familyGift=new FamilyGift();
})();
