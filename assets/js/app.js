// Año en footer
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

// Menú responsive
const burger = document.querySelector('.burger');
const menu = document.querySelector('#mainmenu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Header shrink / sombra al hacer scroll
(() => {
  const h = document.querySelector('.site-header');
  if(!h) return;
  const on = () => h.classList.toggle('scrolled', window.scrollY > 10);
  addEventListener('scroll', on, {passive:true}); on();
})();

// Reveal
(() => {
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length){
    els.forEach(el => el.classList.add('is-visible')); return;
  }
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  },{threshold:.15});
  els.forEach(el => io.observe(el));
})();

// Métricas animadas
(() => {
  const nums = document.querySelectorAll('.metric-number'); if(!nums.length) return;
  const animate = (el,to,dur=1200)=>{ const t0=performance.now(); const step=t=>{
    const p=Math.min(1,(t-t0)/dur); el.textContent=Math.floor(to*p).toLocaleString('es-CL'); if(p<1) requestAnimationFrame(step);
  }; requestAnimationFrame(step); };
  if(!('IntersectionObserver' in window)){ nums.forEach(el=>animate(el,parseInt(el.dataset.target||'0',10))); return; }
  const io=new IntersectionObserver((es,o)=>{ es.forEach(e=>{ if(e.isIntersecting){ animate(e.target,parseInt(e.target.dataset.target||'0',10)); o.unobserve(e.target); } }); },{threshold:.4});
  nums.forEach(n=>io.observe(n));
})();

// Swiper: Hero + Testimonios
const heroSwiper = new Swiper('.hero-slider', {
  loop:true, effect:'fade', speed:800, autoplay:{delay:4000},
  pagination:{ el:'.hero .swiper-pagination', clickable:true },
  navigation:{ nextEl:'.hero .swiper-button-next', prevEl:'.hero .swiper-button-prev' }
});
new Swiper('.testimonios-swiper', { loop:true, autoplay:{delay:4500}, spaceBetween:16, slidesPerView:1, breakpoints:{900:{slidesPerView:2}} });

// Parallax suave en hero (respeta reduce-motion)
(() => {
  const box = document.querySelector('.hero-slider.parallax');
  if(!box || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const onScroll = () => {
    const rect = box.getBoundingClientRect();
    if(rect.bottom < 0 || rect.top > innerHeight) return;
    const p = (rect.top / innerHeight);
    box.style.setProperty('--y', `${p * -12}px`);
  };
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// Fade-up (contacto)
(() => {
  const els = document.querySelectorAll('.fade-up'); if(!els.length) return;
  if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('on')); return; }
  const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }); },{threshold:.15});
  els.forEach(el=>io.observe(el));
})();

// Tracking básico
const track = (name, meta={}) => { try{ console.log('track', name, meta); }catch(e){} };
document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.addEventListener('click', ()=>track('click_whatsapp',{href:a.href})));
document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click', ()=>track('click_llamar',{href:a.href})));

// Formulario: mailto a tu correo (pruebas)
(() => {
  const form = document.getElementById('contact-form'); if(!form) return;
  const toast = (msg) => { const el=document.createElement('div'); el.textContent=msg;
    el.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#0D47A1;color:#fff;padding:.7rem 1rem;border-radius:999px;box-shadow:0 10px 20px rgba(0,0,0,.15);z-index:9999;opacity:0;transition:opacity .2s';
    document.body.appendChild(el); requestAnimationFrame(()=> el.style.opacity=1); setTimeout(()=>{ el.style.opacity=0; setTimeout(()=> el.remove(), 200); }, 2000);
  };
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const d = new FormData(form);
    const nombre=(d.get('nombre')||'').trim(), email=(d.get('email')||'').trim(), mensaje=(d.get('mensaje')||'').trim();
    if(!nombre || !email || !mensaje){ toast('Completa todos los campos'); return; }
    const subject=encodeURIComponent('Contacto web — Club de Leones Las Condes');
    const body=encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);
    window.location.href=`mailto:nicolasrojas1724@gmail.com?subject=${subject}&body=${body}`;
    toast('Abriendo tu correo…'); form.reset();
  });
})();
