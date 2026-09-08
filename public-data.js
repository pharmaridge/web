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
