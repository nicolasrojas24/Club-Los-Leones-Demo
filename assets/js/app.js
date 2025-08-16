// Reveal on scroll
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show') })
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Header shadow on scroll
const hdr = document.querySelector('header');
window.addEventListener('scroll', ()=>{
  hdr.classList.toggle('scrolled', window.scrollY > 8);
});

// Parallax suave para la imagen del hero
const heroImg = document.querySelector('.hero-illu img');
window.addEventListener('scroll', ()=>{
  if(!heroImg) return;
  const y = window.scrollY * 0.15; // intensidad
  heroImg.style.transform = `translateY(${y}px) scale(1.02)`;
});

// Contadores (para spans con class="counter" y data-to="123")
function animateCounter(el, to, ms=1200){
  const start = 0; const t0 = performance.now();
  function step(t){
    const p = Math.min((t - t0)/ms, 1);
    el.textContent = Math.floor(start + p*(to-start));
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('.counter').forEach(el=>{
  const to = parseInt(el.dataset.to||'0',10);
  const ob = new IntersectionObserver((ents,ob2)=>{
    if(ents[0].isIntersecting){ animateCounter(el,to); ob2.disconnect(); }
  });
  ob.observe(el);
});
