const stickers=[
['good-morning','おはよー！','GOOD MORNING','hi'],['hello-day','こんにちは！','HELLO','hi'],['good-evening','こんばんは！','GOOD EVENING','hi'],['hello','よろしく！','LET’S GO','hi'],['going','いってきます！','I’M OFF','hi'],['come-with-me','いってらっしゃい！','TAKE CARE','hi'],['im-home','ただいま！','I’M HOME','hi'],['im-home-cheerful','ただいま！','I’M BACK','hi'],['welcome-home','おかえり！','WELCOME HOME','hi'],['good-night','おやすみ！','GOOD NIGHT','hi'],['leaving-first','お先に失礼します！','LEAVING FIRST','hi'],['see-you','またね！','SEE YOU','hi'],['see-you-tomorrow','また明日！','SEE YOU TOMORROW','hi'],['later','あとでね','SEE YOU LATER','hi'],
['ok','OK！','ALL GOOD','reply'],['yes','はーい！','YES','reply'],['understood','了解です！','GOT IT','reply'],['naruhodo','なるほど！','I SEE','reply'],['got-it','わかる','I GET YOU','reply'],['leave-it-to-me','任せて！','LEAVE IT TO ME','reply'],['wait','ちょっと待って！','WAIT A SEC','reply'],['waited','お待たせ！','SORRY TO KEEP YOU WAITING','reply'],['okay','だいじょうぶ？','ARE YOU OK?','reply'],['exactly','それな！','THAT’S IT','reply'],['really','え、ほんと？','FOR REAL?','reply'],['no-way','待って無理','NO WAY','reply'],['shh','しっ','SHH','reply'],['secret','ひみつ','SECRET','reply'],['on-hold','保留！','ON HOLD','reply'],['memo','メモメモ','NOTE THAT','reply'],
['love','すき','LOVE IT','mood'],['excited','わくわく','SO EXCITED','mood'],['ehehe','えへへ','HEHE','mood'],['smirk','ニヤリ','HEH','mood'],['sparkle','キラーン！','SPARKLE','mood'],['stare','じーっ','STARE','mood'],['peek','ちらっ','PEEK','mood'],['blank','ぽかーん','HUH?','mood'],['seriously','まじか','SERIOUSLY?','mood'],['gasp','ガーン','OH NO','mood'],['angry','ぷんぷん','GRR','mood'],['cry','泣','CRYING','mood'],['lonely','しょんぼり…','FEELING BLUE','mood'],['wiped-out','ぐったり','WIPED OUT','mood'],['drained','しんど…','DRAINED','mood'],['shaking','震える','SHAKING','mood'],['lol','それは草','LOL','mood'],['obsessed','沼った','HOOKED','mood'],['broke','金欠','BROKE','mood'],
['thanks','ありがとう！','THANK YOU','thanks'],['thanks-help','助かる！','THANKS A LOT','thanks'],['thanks-polite','おつです！','THANKS','thanks'],['please','おねがいします！','PLEASE','thanks'],['sorry','ペコリ','SORRY','thanks'],['sorry-friend','ごめんね！','I’M SORRY','thanks'],['good-job','おつかれさま！','GOOD JOB','thanks'],['get-well','おだいじに！','GET WELL','thanks'],
['yay','やったー！','YAY','hype'],['amazing','すごい！','AMAZING','hype'],['great-job','えらい！','GREAT JOB','hype'],['congrats','おめでとう！','CONGRATS','hype'],['fight','ファイト！','FIGHT','hype'],['genius','天才か','GENIUS','hype'],['god-tier','神！','GOATED','hype'],['champion','優勝','CHAMPION','hype'],['gacha','神引き！','JACKPOT','hype'],['success','大成功！','BIG WIN','hype'],['battle-ready','臨戦態勢！','BATTLE READY','hype'],
['sleepy','眠い…','SLEEPY','now'],['charging','充電中…','RECHARGING','now'],['hikikomori','引きこもり中…','HIKIKOMORI','now'],['working','作業中…','WORKING','now'],['streaming','配信中！','LIVE NOW','now'],['snacking','補給中！','SNACK TIME','now'],['all-nighter','徹夜中','ALL NIGHTER','now'],['screenshot','スクショとった！','SCREENSHOT','now'],['on-site','現場です！','ON SITE','now'],['summer-break','夏休み！','SUMMER BREAK','now'],
['on-my-way','いま向かってます！','ON MY WAY','out'],['speeding','爆速で行く！','GOING FAST','out'],['packed','準備完了！','ALL SET','out'],['bought','買ってきた！','GOT THE GOODS','out'],['shopping-spree','爆買い！','SHOPPING SPREE','out']
].map(([id,name,sub,category])=>({id,name,sub,category,thumb:`stamps/thumbs/${id}.webp`,file:`stamps/${id}.png`}));
const CATS=[['all','すべて'],['hi','あいさつ'],['reply','返事'],['mood','気持ち'],['thanks','感謝'],['hype','ほめる'],['now','いま'],['out','おでかけ']];
const grid=document.querySelector('#grid'),empty=document.querySelector('#empty'),modal=document.querySelector('#modal'),preview=document.querySelector('#preview'),favOnly=document.querySelector('#favOnly'),nav=document.querySelector('#categories');
let active,showFavs=false,category='all',favorites=new Set(JSON.parse(localStorage.getItem('kanon-favorites')||'[]'));
const sendBlobs=new Map();
function prefetch(s){
  if(!sendBlobs.has(s.id)){
    sendBlobs.set(s.id,fetch(s.file).then(r=>{
      if(!r.ok)throw new Error('stamp missing');
      return r.blob();
    }).catch(err=>{sendBlobs.delete(s.id);throw err}));
  }
  return sendBlobs.get(s.id);
}
function render(){grid.replaceChildren();let list=category==='all'?stickers:stickers.filter(s=>s.category===category);if(showFavs)list=list.filter(s=>favorites.has(s.id));empty.hidden=!!list.length;grid.hidden=!list.length;document.querySelector('#emptyTitle').textContent=showFavs?'この種類のお気に入りはまだありません':'スタンプがありません';document.querySelector('#emptyText').textContent=showFavs?'ハートを押すと、ここに集められます。':'別の種類を選んでみてください。';list.forEach((s,i)=>{const el=document.createElement('article');el.className='stamp';el.style.setProperty('--i',Math.min(i,12));el.innerHTML=`<button class="stamp-open" aria-label="${s.name}を開く"><span class="visual"><img src="${s.thumb}" alt="${s.name}" loading="lazy" decoding="async"></span><b>${s.name}</b><small>${s.sub}</small></button><span class="tap">TAP TO USE</span><button class="heart ${favorites.has(s.id)?'on':''}" aria-label="お気に入り">${favorites.has(s.id)?'♥':'♡'}</button>`;el.querySelector('.stamp-open').onclick=()=>open(s);el.querySelector('.heart').onclick=()=>toggle(s.id);grid.append(el)})}
function toggle(id){favorites.has(id)?favorites.delete(id):favorites.add(id);localStorage.setItem('kanon-favorites',JSON.stringify([...favorites]));render()}
function open(s){active=s;preview.src=s.thumb;preview.alt=s.name;document.querySelector('#selected').textContent=s.name;modal.hidden=false;document.body.style.overflow='hidden';prefetch(s)}
function close(){modal.hidden=true;document.body.style.overflow=''}
async function blob(){return prefetch(active)}
async function shareBlob(){
  const size=512,canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d');
  const radius=Math.hypot(size*.5,size*.62);
  const bg=ctx.createRadialGradient(size*.5,size*.38,0,size*.5,size*.38,radius);
  bg.addColorStop(0,'#ffffff');
  bg.addColorStop(.42,'#ffffff');
  bg.addColorStop(.74,'#ffe8f5');
  bg.addColorStop(1,'#d9f3ff');
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,size,size);
  const image=await createImageBitmap(await blob());
  ctx.drawImage(image,0,0,size,size);
  image.close();
  return new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('image compose failed')),'image/png'));
}
const say=t=>{const e=document.querySelector('#notice');e.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>e.textContent='',3200)};
document.querySelector('#close').onclick=close;modal.onclick=e=>{if(e.target===modal)close()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
document.querySelector('#copy').onclick=async()=>{try{await navigator.clipboard.write([new ClipboardItem({'image/png':await shareBlob()})]);say('コピーしました！LINEに貼り付けてね。')}catch{say('コピーできない場合は「送る」か「保存」を使ってね。')}};
document.querySelector('#share').onclick=async()=>{try{const f=new File([await shareBlob()],`${active.id}.png`,{type:'image/png'});if(navigator.canShare?.({files:[f]}))await navigator.share({files:[f]});else document.querySelector('#save').click()}catch(e){if(e.name!=='AbortError')say('保存してから送ってね。')}};
document.querySelector('#save').onclick=async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(await shareBlob());a.download=`kanon-${active.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);say('PNGを保存しました！')};
function renderCats(){
  nav.replaceChildren(favOnly);
  CATS.forEach(([id,label])=>{
    const n=id==='all'?stickers.length:stickers.filter(s=>s.category===id).length;
    const b=document.createElement('button');
    b.dataset.category=id;
    if(id===category)b.className='on';
    b.innerHTML=`${label} <b>${n}</b>`;
    b.onclick=()=>{category=id;renderCats();render()};
    nav.append(b);
  });
}
favOnly.onclick=()=>{showFavs=!showFavs;favOnly.setAttribute('aria-pressed',showFavs);favOnly.classList.toggle('on',showFavs);favOnly.innerHTML=`お気に入り <b>${showFavs?'♥':'♡'}</b>`;render()};
addEventListener('pointermove',e=>{
  document.documentElement.style.setProperty('--mx',e.clientX+'px');
  document.documentElement.style.setProperty('--my',e.clientY+'px');
},{passive:true});
renderCats();
render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');
