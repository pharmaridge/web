const defaults={email:'care@pharmaridge.com',phone:'+234 800 000 0000',office:'Plot 12, Healthcare Avenue|Abuja, Nigeria',essential:'Custom',partner:'Custom',announcement:'Pharmacy operations, brought into focus'};
let data={...defaults,...JSON.parse(localStorage.getItem('pharmaridge')||'{}')};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function render(){
 document.querySelector('.topline-inner span:first-child').innerHTML='<i class="pulse-dot"></i> '+data.announcement;
 $$('[data-contact-href]').forEach(x=>x.href='mailto:'+data.email); $$('[data-contact-email]').forEach(x=>{x.textContent=data.email;x.href='mailto:'+data.email});
 $$('[data-contact-phone]').forEach(x=>{x.textContent=data.phone;x.href='tel:'+data.phone.replace(/[^+\d]/g,'')});
 $$('[data-office]').forEach(x=>x.innerHTML=data.office.replace('|','<br>'));
 $$('[data-price="essential"]').forEach(x=>x.textContent=data.essential); $$('[data-price="partner"]').forEach(x=>x.textContent=data.partner);
 for(const [k,v] of Object.entries(data)){const el=$('#admin-form [name="'+k+'"]');if(el)el.value=v}
}
function toggleAdmin(open){$('#admin-drawer').classList.toggle('open',open);$('.scrim').classList.toggle('show',open)}
$$('.admin-open').forEach(b=>b.addEventListener('click',()=>toggleAdmin(true)));$('.close-admin').addEventListener('click',()=>toggleAdmin(false));$('.scrim').addEventListener('click',()=>toggleAdmin(false));
$('#admin-form').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);data=Object.fromEntries(form.entries());localStorage.setItem('pharmaridge',JSON.stringify(data));render();toggleAdmin(false);showToast('Changes saved — your public site is updated.')});
$('.reset-admin').addEventListener('click',()=>{data={...defaults};localStorage.removeItem('pharmaridge');render();showToast('Demo content restored.')});
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();e.target.reset();showToast('Thanks — your enquiry is on its way.')});
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)}
render();
// Product screen carousel
const track=document.querySelector('.carousel-track');
const slides=[...document.querySelectorAll('.carousel-slide')];
const dots=[...document.querySelectorAll('.carousel-dots button')];
let slideIndex=0;
function goToSlide(i){if(!track)return;slideIndex=(i+slides.length)%slides.length;track.style.transform=`translateX(-${slideIndex*100}%)`;slides.forEach((s,n)=>s.classList.toggle('active',n===slideIndex));dots.forEach((d,n)=>d.classList.toggle('active',n===slideIndex))}
document.querySelector('.carousel-control.next')?.addEventListener('click',()=>goToSlide(slideIndex+1));document.querySelector('.carousel-control.prev')?.addEventListener('click',()=>goToSlide(slideIndex-1));dots.forEach((d,n)=>d.addEventListener('click',()=>goToSlide(n)));
let carouselTimer=setInterval(()=>goToSlide(slideIndex+1),7000);document.querySelector('.product-carousel')?.addEventListener('mouseenter',()=>clearInterval(carouselTimer));
// Scroll-triggered entrance motion; remains lightweight and respects reduced-motion settings.
const revealTargets=document.querySelectorAll('.section,.product-section,.guide-section,.about-section,.dark-section,.contact-section,.service-card,.guide-card,.plan,.product-carousel');revealTargets.forEach(el=>el.classList.add('reveal'));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.12});revealTargets.forEach(el=>observer.observe(el))}else revealTargets.forEach(el=>el.classList.add('is-visible'));
// Hero preview carousel
const heroShots=[...document.querySelectorAll('.hero-shot')], heroDots=[...document.querySelectorAll('.hero-progress i')];let heroIndex=0;
function setHero(i){if(!heroShots.length)return;heroIndex=(i+heroShots.length)%heroShots.length;heroShots.forEach((x,n)=>x.classList.toggle('active',n===heroIndex));heroDots.forEach((x,n)=>x.classList.toggle('active',n===heroIndex))}
document.querySelector('.hero-next')?.addEventListener('click',()=>setHero(heroIndex+1));document.querySelector('.hero-prev')?.addEventListener('click',()=>setHero(heroIndex-1));let heroTimer=setInterval(()=>setHero(heroIndex+1),4800);document.querySelector('.hero-carousel')?.addEventListener('mouseenter',()=>clearInterval(heroTimer));
// Tabbed one-page navigation: the landing story stays light, deeper detail opens on demand.
const tabButtons=[...document.querySelectorAll('.tab-button')];const panels=[...document.querySelectorAll('[data-panel]')];
function activateTab(name){const target=document.querySelector('[data-panel="'+name+'"]');if(target)target.scrollIntoView({behavior:"smooth"});}
tabButtons.forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));
// Turn feature cards into tactile flip cards with a useful detail side.
const flipDetails=[['01 / POINT OF SALE','Counter-ready checkout','Keep every transaction visible and accountable.','Fast checkout','Receipts and cash tracking','Sales history'],['02 / STOCK CONTROL','Inventory with context','Know what is available, what is moving and what needs attention.','Batches and expiry dates','Purchase orders and transfers','Stocktake visibility'],['03 / MONEY & PEOPLE','Control beyond the counter','Connect your team, customers, suppliers and books to the work.','Staff attendance','Debtors and creditors','General ledger']];
document.querySelectorAll('.service-card').forEach((card,i)=>{const front=card.innerHTML,d=flipDetails[i];if(!d)return;card.innerHTML=`<div class="flip-inner"><div class="flip-front">${front}<small class="flip-hint">HOVER OR TAP TO TURN ↻</small></div><div class="flip-back"><span class="card-kicker">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><ul><li>${d[3]}</li><li>${d[4]}</li><li>${d[5]}</li></ul><small class="flip-hint">TAP TO RETURN ↻</small></div></div>`;card.addEventListener('click',()=>card.classList.toggle('flipped'))});
// Deep links open the relevant SPA tab instead of pointing at hidden content.
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const target=link.getAttribute('href');const map={"#services":"platform","#product":"platform","#how-it-works":"method","#plans":"plans","#about":"about","#contact":"contact"};if(map[target]){e.preventDefault(); if(target==='#about') document.querySelector('#about')?.scrollIntoView({behavior:'smooth'}); else activateTab(map[target])}}));
// Hero card carousel
const heroCards=[...document.querySelectorAll('.hero-card-slide')],heroCardDots=[...document.querySelectorAll('.hero-card-nav i')];let heroCardIndex=0;
function setHeroCard(i){if(!heroCards.length)return;heroCardIndex=(i+heroCards.length)%heroCards.length;heroCards.forEach((x,n)=>x.classList.toggle('active',n===heroCardIndex));heroCardDots.forEach((x,n)=>x.classList.toggle('active',n===heroCardIndex))}
document.querySelector('.hero-card-next')?.addEventListener('click',()=>setHeroCard(heroCardIndex+1));document.querySelector('.hero-card-prev')?.addEventListener('click',()=>setHeroCard(heroCardIndex-1));let heroCardTimer=setInterval(()=>setHeroCard(heroCardIndex+1),5600);document.querySelector('.hero-card-carousel')?.addEventListener('mouseenter',()=>clearInterval(heroCardTimer));
// Admin-managed client showcase
const clientKey='pharmaridge-clients';
function getClients(){try{return JSON.parse(localStorage.getItem(clientKey)||'[]')}catch(e){return []}}
function renderClients(){const clients=getClients(),track=document.querySelector('#client-track'),list=document.querySelector('#admin-client-list');if(!track)return;track.innerHTML=clients.length?clients.map(c=>`<article class="client-card"><img src="${c.logo||'assets/pharmaridge-mark-source.png'}" alt="${c.name} logo"><div><h3>${c.name}</h3><p>${c.story||'Using PharmaRidge to run with clarity.'}</p></div></article>`).join(''):`<article class="client-card"><div class="client-placeholder">PR</div><div><h3>Your pharmacy could be next</h3><p>Add a client story from the discreet admin workspace to feature it here.</p></div></article>`;if(list)list.innerHTML=clients.map((c,i)=>`<div class="admin-client-row"><span>${c.name}</span><button type="button" data-remove-client="${i}">Remove</button></div>`).join('');track.style.transform='translateX(0)';document.querySelectorAll('[data-remove-client]').forEach(b=>b.addEventListener('click',()=>{const cs=getClients();cs.splice(Number(b.dataset.removeClient),1);localStorage.setItem(clientKey,JSON.stringify(cs));renderClients()}))}
let clientOffset=0;function moveClients(dir){const track=document.querySelector('#client-track');if(!track)return;const cards=track.children;if(!cards.length)return;clientOffset=Math.max(0,Math.min(clientOffset+dir,Math.max(0,cards.length-2)));track.style.transform=`translateX(-${clientOffset*50}%)`};document.querySelector('.client-next')?.addEventListener('click',()=>moveClients(1));document.querySelector('.client-prev')?.addEventListener('click',()=>moveClients(-1));
document.querySelector('#add-client')?.addEventListener('click',()=>{const name=document.querySelector('[name="clientName"]')?.value.trim(),story=document.querySelector('[name="clientStory"]')?.value.trim(),file=document.querySelector('[name="clientLogo"]')?.files?.[0];if(!name){showToast('Add a client name first.');return}const save=logo=>{const cs=getClients();cs.push({name,story,logo});localStorage.setItem(clientKey,JSON.stringify(cs));document.querySelector('[name="clientName"]').value='';document.querySelector('[name="clientStory"]').value='';document.querySelector('[name="clientLogo"]').value='';renderClients();showToast('Client added to the public showcase.')};if(file){const reader=new FileReader();reader.onload=()=>save(reader.result);reader.readAsDataURL(file)}else save('')});renderClients();
