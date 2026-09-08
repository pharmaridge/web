import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cfg=window.PHARMA_SUPABASE||{};
if(cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT')){const db=createClient(cfg.url,cfg.anonKey);
 const settingsResponse=await db.from('site_settings').select('key,value');
 if(settingsResponse.data?.length){const settings=Object.fromEntries(settingsResponse.data.map(x=>[x.key,x.value]));
  document.querySelectorAll('[data-contact-email]').forEach(x=>{x.textContent=settings.contact_email||x.textContent;x.href='mailto:'+(settings.contact_email||'')});
  document.querySelectorAll('[data-contact-href]').forEach(x=>x.href='mailto:'+(settings.contact_email||''));
  document.querySelectorAll('[data-contact-phone]').forEach(x=>{x.textContent=settings.contact_phone||x.textContent;x.href='tel:'+(settings.contact_phone||'').replace(/[^+\d]/g,'')});
  document.querySelectorAll('[data-office]').forEach(x=>x.innerHTML=(settings.head_office||x.textContent).replace(/\|/g,'<br>'));
  document.querySelectorAll('[data-price="essential"]').forEach(x=>x.textContent=settings.essential_price||x.textContent);
  document.querySelectorAll('[data-price="partner"]').forEach(x=>x.textContent=settings.partner_price||x.textContent);
  const announcement=document.querySelector('.topline-inner span:first-child');if(announcement&&settings.announcement)announcement.innerHTML='<i class="pulse-dot"></i> '+escapeHtml(settings.announcement);
 }
 const {data}=await db.from('client_showcase').select('name,story,logo_url').eq('featured',true).order('sort_order').order('created_at',{ascending:false});if(data?.length){const track=document.querySelector('#client-track');if(track){track.innerHTML=data.map(c=>`<article class="client-card"><img src="${c.logo_url||'assets/pharmaridge-mark-source.png'}" alt="${escapeHtml(c.name)} logo"><div><h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.story||'Using PharmaRidge to run with clarity.')}</p></div></article>`).join('')}}}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
async function loadExtendedContent(db){
 const [{data:people},{data:partners},{data:ads}]=await Promise.all([
  db.from('team_profiles').select('name,role,bio,image_url').eq('published',true).order('sort_order'),
  db.from('partners').select('name,category,description,logo_url,website_url').eq('published',true).order('sort_order'),
  db.from('site_ads').select('title,message,image_url,cta_label,cta_url').eq('published',true).order('created_at',{ascending:false}).limit(1)
 ]);
 const peopleGrid=document.querySelector('#people-grid');if(peopleGrid&&people?.length)peopleGrid.innerHTML=people.map(p=>`<article class="person-card"><img src="${p.image_url||'assets/pharmaridge-mark-source.png'}" alt="${escapeHtml(p.name)}"><div><span class="card-kicker">${escapeHtml(p.role)}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.bio)}</p></div></article>`).join('');
 const partnerGrid=document.querySelector('#partners-grid');if(partnerGrid&&partners?.length)partnerGrid.innerHTML=partners.map(p=>`<a class="partner-card" href="${p.website_url||'#'}" target="_blank" rel="noopener"><img src="${p.logo_url||'assets/pharmaridge-mark-source.png'}" alt="${escapeHtml(p.name)}"><div><span>${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p></div></a>`).join('');
 const ad=ads?.[0],pop=document.querySelector('#ad-popover');if(ad&&pop&&!sessionStorage.getItem('pharma-ad-'+ad.title)){document.querySelector('#ad-title').textContent=ad.title;document.querySelector('#ad-message').textContent=ad.message;const img=document.querySelector('#ad-image');if(ad.image_url){img.src=ad.image_url;img.hidden=false}else img.hidden=true;const cta=document.querySelector('#ad-cta');if(ad.cta_label&&ad.cta_url){cta.textContent=ad.cta_label;cta.href=ad.cta_url;cta.hidden=false}else cta.hidden=true;setTimeout(()=>{pop.hidden=false},1800);document.querySelector('.ad-close')?.addEventListener('click',()=>{pop.hidden=true;sessionStorage.setItem('pharma-ad-'+ad.title,'1')})}}
if(cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT'))loadExtendedContent(createClient(cfg.url,cfg.anonKey));
async function loadMedia(db){
 const [{data:videos},{data:docs}]=await Promise.all([db.from('video_library').select('title,category,youtube_url,description').eq('published',true).order('sort_order'),db.from('resource_library').select('title,category,google_url,description').eq('published',true).order('sort_order')]);
 const vg=document.querySelector('#video-grid'),rg=document.querySelector('#resource-grid'),cats=document.querySelector('#media-categories');
 const getId=url=>{try{const u=new URL(url);return u.hostname.includes('youtu.be')?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/').pop()}catch(e){return ''}};
 if(videos?.length&&vg){const categories=['All',...new Set(videos.map(v=>v.category).filter(Boolean))];cats.innerHTML=categories.map((c,i)=>`<button class="media-filter ${i?'':'active'}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');const render=cat=>{vg.innerHTML=videos.filter(v=>cat==='All'||v.category===cat).map(v=>{const id=getId(v.youtube_url);return `<article class="video-card"><a class="video-frame" href="${v.youtube_url}" target="_blank" rel="noopener"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="${escapeHtml(v.title)}"><span>▶</span></a><span class="card-kicker">${escapeHtml(v.category)}</span><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.description||'')}</p></article>`}).join('')};render('All');cats.querySelectorAll('.media-filter').forEach(b=>b.onclick=()=>{cats.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.category)})}
 if(docs?.length&&rg)rg.innerHTML=docs.map(d=>`<a class="resource-card" href="${d.google_url}" target="_blank" rel="noopener"><span class="resource-icon">↗</span><div><span class="card-kicker">${escapeHtml(d.category)}</span><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.description||'Open document in Google Docs ↗')}</p></div></a>`).join('')}
}
if(cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT'))loadMedia(createClient(cfg.url,cfg.anonKey));
