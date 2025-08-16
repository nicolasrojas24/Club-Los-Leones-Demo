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

// Reveal on scroll
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:.15});
  els.forEach(el => io.observe(el));
})();

// Métricas animadas
(function(){
  const nums = document.querySelectorAll('.metric-number');
  if(!nums.length) return;
  const animate = (el, to, dur=1200)=>{
    const start = 0, t0 = performance.now();
    const step = (t)=>{
      const p = Math.min(1, (t - t0)/dur);
      el.textContent = Math.floor(start + (to - start)*p).toLocaleString('es-CL');
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if(!('IntersectionObserver' in window)){
    nums.forEach(el => animate(el, parseInt(el.dataset.target||'0',10)));
    return;
  }
  const io = new IntersectionObserver((entries, o)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animate(e.target, parseInt(e.target.dataset.target||'0',10));
        o.unobserve(e.target);
      }
    });
  },{threshold:.4});
  nums.forEach(n => io.observe(n));
})();

// Tracking básico (WhatsApp y Llamar)
const track = (name, meta={}) => { try { console.log('track', name, meta); } catch(e){} };
document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{
  a.addEventListener('click', ()=> track('click_whatsapp', {href:a.href}));
});
document.querySelectorAll('a[href^="tel:"]').forEach(a=>{
  a.addEventListener('click', ()=> track('click_llamar', {href:a.href}));
});

// Formulario: mailto a tu correo de prueba
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').toString().trim();
    const email  = (data.get('email')  || '').toString().trim();
    const mensaje= (data.get('mensaje')|| '').toString().trim();

    if (!nombre || !email || !mensaje) {
      alert('Por favor completa todos los campos.');
      return;
    }
    const subject = encodeURIComponent('Contacto web — Club de Leones Las Condes');
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
    );

    window.location.href = `mailto:nicolasrojas1724@gmail.com?subject=${subject}&body=${body}`;
  });
}
// Animación 'fade-up' por IntersectionObserver (estilo referencia)
(() => {
  const els = document.querySelectorAll('.fade-up');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('on'));
    return;
  }
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  },{threshold:.15});
  els.forEach(el => io.observe(el));
})();

// Mejora UX del formulario: validación + toast
(() => {
  const form = document.getElementById('contact-form');
  if(!form) return;

  // Pequeño “toast” sin librerías
  const toast = (msg) => {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position:fixed;left:50%;bottom:20px;transform:translateX(-50%);
      background:#0D47A1;color:#fff;padding:.7rem 1rem;border-radius:999px;
      box-shadow:0 10px 20px rgba(0,0,0,.15);z-index:9999;opacity:0;transition:opacity .2s
    `;
    document.body.appendChild(el);
    requestAnimationFrame(()=> el.style.opacity = 1);
    setTimeout(()=>{ el.style.opacity = 0; setTimeout(()=> el.remove(), 200); }, 2000);
  };

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const nombre = (data.get('nombre')||'').trim();
    const email  = (data.get('email')||'').trim();
    const mensaje= (data.get('mensaje')||'').trim();

    if(!nombre || !email || !mensaje){
      toast('Completa todos los campos');
      return;
    }
    // mailto para pruebas
    const subject = encodeURIComponent('Contacto web — Club de Leones Las Condes');
    const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);
    window.location.href = `mailto:nicolasrojas1724@gmail.com?subject=${subject}&body=${body}`;
    toast('Abriendo tu correo…');
    form.reset();
  });
})();
