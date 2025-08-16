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
