const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const all = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

/** Ejecuta `fn` una sola vez cuando cada elemento entra en pantalla. */
function onceVisible(els: Element[], fn: (el: HTMLElement) => void, options: IntersectionObserverInit) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      fn(e.target as HTMLElement);
      io.unobserve(e.target);
    }
  }, options);
  els.forEach((el) => io.observe(el));
}

const revealEls = all<HTMLElement>('[data-reveal]');

if (!('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  // Aparición al hacer scroll
  onceVisible(revealEls, (el) => el.classList.add('in'), { threshold: 0.15 });

  // Taxímetro (contador) y PIN tipo tragamonedas
  const runCounter = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.dec ?? 0);
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - t0) / 1800, 1);
      el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(decimals);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const runSlot = (el: HTMLElement) => {
    const final = el.dataset.slot ?? '';
    let n = 0;
    const id = setInterval(() => {
      n++;
      el.textContent = [...final].map((c, i) => (n > 8 + i * 4 ? c : String(Math.floor(Math.random() * 10)))).join('');
      if (n > 8 + final.length * 4) clearInterval(id);
    }, 70);
  };
  if (!reduceMotion) {
    onceVisible(all<HTMLElement>('[data-count]'), runCounter, { threshold: 0.6 });
    onceVisible(all<HTMLElement>('[data-slot]'), runSlot, { threshold: 0.6 });
  }

  // Enlace activo del menú según la sección visible
  const links = all<HTMLAnchorElement>('#menu a');
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.toggle('on', a.hash === `#${e.target.id}`));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  links.forEach((a) => {
    const target = a.hash && a.pathname === location.pathname ? document.querySelector(a.hash) : null;
    if (target) spy.observe(target);
  });
}

// Navbar: estilo al bajar y menú móvil
const header = document.querySelector<HTMLElement>('.top');
const burger = document.querySelector<HTMLButtonElement>('.burger');
const scrollProgress = document.querySelector<HTMLElement>('.scroll-progress > span');
if (header && burger) {
  const onScroll = () => {
    header.classList.toggle('scrolled', header.hasAttribute('data-solid') || window.scrollY > 10);
    if (scrollProgress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open: boolean) => {
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  all<HTMLAnchorElement>('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
}

// Las etapas cambian la escena ilustrada según el rol seleccionado.
all<HTMLElement>('[data-journey]').forEach((journey) => {
  const scene = journey.querySelector<HTMLElement>('[data-ride-scene]');
  const title = journey.querySelector<HTMLElement>('[data-scene-title]');
  const description = journey.querySelector<HTMLElement>('[data-scene-description]');
  const frame = journey.querySelector<HTMLElement>('[data-stage-frame]');
  const image = journey.querySelector<HTMLElement>('[data-stage-image]');
  const placeholderTitle = journey.querySelector<HTMLElement>('[data-placeholder-title]');
  const placeholderPath = journey.querySelector<HTMLElement>('[data-placeholder-path]');
  const buttons = all<HTMLButtonElement>('[data-step-button]').filter((button) => button.closest('[data-journey]') === journey);
  const showStage = (button: HTMLButtonElement, loadImage = true) => {
    const titleText = button.dataset.title ?? '';
    const imagePath = button.dataset.image ?? '';
    if (scene) scene.dataset.step = button.dataset.step ?? '0';
    if (title) title.textContent = titleText;
    if (description) description.textContent = button.dataset.description ?? '';
    if (placeholderTitle) placeholderTitle.textContent = titleText;
    if (placeholderPath) placeholderPath.textContent = imagePath.replace(/^\//, '');
    if (frame) frame.classList.remove('has-image');
    if (image && imagePath && loadImage) {
      image.setAttribute('aria-label', titleText);
      const preload = new Image();
      preload.onload = () => {
        image.style.backgroundImage = `url("${imagePath}")`;
        frame?.classList.add('has-image');
      };
      preload.onerror = () => frame?.classList.remove('has-image');
      preload.src = imagePath;
    }
  };
  const initial = buttons.find((button) => button.getAttribute('aria-pressed') === 'true');
  if (initial) showStage(initial, false);
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      showStage(button);
    });
  });
});

// Formulario de contacto: usa el endpoint configurado o prepara un correo.
const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector<HTMLElement>('[data-form-status]');
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    if (data.get('website')) return;
    const endpoint = contactForm.dataset.endpoint;
    if (endpoint) {
      if (status) status.textContent = 'Enviando tu mensaje…';
      try {
        const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('No se pudo enviar el mensaje.');
        contactForm.reset();
        if (status) status.textContent = '¡Gracias! Recibimos tu mensaje.';
      } catch {
        if (status) status.textContent = 'No pudimos enviarlo ahora. Intenta de nuevo o escríbenos por correo.';
      }
      return;
    }

    const email = contactForm.dataset.email;
    if (!email) {
      if (status) status.textContent = 'El correo de contacto aún no está configurado.';
      return;
    }
    const subject = `Consulta Woki: ${String(data.get('motivo') ?? '')}`;
    const body = [
      `Nombre: ${data.get('nombre') ?? ''}`,
      `Correo o teléfono: ${data.get('contacto') ?? ''}`,
      `Motivo: ${data.get('motivo') ?? ''}`,
      '',
      String(data.get('mensaje') ?? ''),
    ].join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = 'Se abrirá tu correo con el mensaje listo para enviar.';
  });
}
