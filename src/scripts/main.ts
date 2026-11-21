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
    if (!open) all<HTMLElement>('[data-nav-dropdown]').forEach((item) => {
      item.classList.remove('expanded');
      item.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  };
  burger.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  all<HTMLAnchorElement>('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  all<HTMLButtonElement>('[data-nav-trigger]').forEach((button) => button.addEventListener('click', () => {
    const dropdown = button.closest<HTMLElement>('[data-nav-dropdown]');
    const open = !dropdown?.classList.contains('expanded');
    all<HTMLElement>('[data-nav-dropdown]').forEach((item) => {
      item.classList.toggle('expanded', item === dropdown && open);
      item.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', String(item === dropdown && open));
    });
  }));
  document.addEventListener('click', (event) => {
    if (header && !header.contains(event.target as Node)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      burger.focus();
    }
  });
}

// Las etapas cambian la escena ilustrada según el rol seleccionado.
all<HTMLElement>('[data-journey]').forEach((journey) => {
  const scene = journey.querySelector<HTMLElement>('[data-ride-scene]');
  const title = journey.querySelector<HTMLElement>('[data-scene-title]');
  const description = journey.querySelector<HTMLElement>('[data-scene-description]');
  const images = all<HTMLImageElement>('[data-stage-image]').filter((image) => image.closest('[data-journey]') === journey);
  const placeholder = journey.querySelector<HTMLElement>('[data-image-placeholder]');
  const buttons = all<HTMLButtonElement>('[data-step-button]').filter((button) => button.closest('[data-journey]') === journey);
  const autoToggle = journey.querySelector<HTMLButtonElement>('[data-journey-toggle]');
  const progressBars = all<HTMLElement>('.step-progress > span').filter((bar) => bar.closest('[data-journey]') === journey);
  let autoTimer: number | undefined;
  let inViewport = false;
  let userPaused = reduceMotion;
  if (reduceMotion && autoToggle) autoToggle.hidden = true;
  const showStage = (button: HTMLButtonElement) => {
    const titleText = button.dataset.title ?? '';
    const stepIndex = Number(button.dataset.step ?? 0);
    if (scene) scene.dataset.step = String(stepIndex);
    if (title) title.textContent = titleText;
    if (description) description.textContent = button.dataset.description ?? '';
    const activeImage = images.find((image) => Number(image.dataset.stageImage) === stepIndex);
    images.forEach((image) => {
      const isActive = image === activeImage;
      image.hidden = !isActive;
      image.closest('picture')?.toggleAttribute('hidden', !isActive);
      if (isActive) image.removeAttribute('aria-hidden');
      else image.setAttribute('aria-hidden', 'true');
    });
    if (placeholder) placeholder.hidden = Boolean(activeImage && !activeImage.dataset.failed);
  };
  images.forEach((image) => image.addEventListener('error', () => {
    image.dataset.failed = 'true';
    if (!image.hidden && placeholder) placeholder.hidden = false;
  }));
  images.forEach((image) => image.addEventListener('load', () => {
    delete image.dataset.failed;
    if (!image.hidden && placeholder) placeholder.hidden = true;
  }));
  const initial = buttons.find((button) => button.getAttribute('aria-pressed') === 'true');
  if (initial) showStage(initial);
  const roleInput = document.querySelector<HTMLInputElement>(journey.dataset.role === 'pasajero' ? '#t-pas' : '#t-con');
  const isRoleActive = () => !roleInput || roleInput.checked;
  const canAutoplay = () => journey.hasAttribute('data-autoplay') && !reduceMotion && !userPaused && inViewport && !document.hidden && isRoleActive();
  const stopAutoplay = () => {
    if (autoTimer !== undefined) window.clearTimeout(autoTimer);
    autoTimer = undefined;
    journey.removeAttribute('data-playing');
  };
  const startAutoplay = () => {
    stopAutoplay();
    if (!canAutoplay()) return;
    journey.setAttribute('data-playing', '');
    autoTimer = window.setTimeout(() => {
      const activeIndex = buttons.findIndex((button) => button.getAttribute('aria-pressed') === 'true');
      const next = buttons[(activeIndex + 1) % buttons.length];
      if (next) {
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === next)));
        showStage(next);
      }
      startAutoplay();
    }, 3000);
  };
  if (journey.hasAttribute('data-autoplay')) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting;
        startAutoplay();
      }, { threshold: 0.2 });
      observer.observe(journey);
    } else inViewport = true;
    autoToggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      autoToggle.setAttribute('aria-pressed', String(userPaused));
      autoToggle.textContent = userPaused ? 'Reanudar recorrido' : 'Pausar recorrido';
      startAutoplay();
    });
    document.addEventListener('visibilitychange', startAutoplay);
    roleInput?.addEventListener('change', () => {
      if (isRoleActive()) startAutoplay();
      else stopAutoplay();
    });
  }
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      showStage(button);
      if (journey.hasAttribute('data-autoplay')) {
        progressBars.forEach((bar) => { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; });
        startAutoplay();
      }
    });
  });
});

// En escritorio, cada tramo de scroll dentro de Cómo funciona avanza una etapa.
const journeyTrack = document.querySelector<HTMLElement>('[data-scroll-journey]');
const pinnedJourneyEnabled = window.matchMedia('(min-width: 801px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
if (journeyTrack && !journeyTrack.hasAttribute('data-autoplay-journey')) {
  let journeyFrame = 0;
  const syncJourneyStage = () => {
    if (!pinnedJourneyEnabled.matches || journeyFrame) return;
    journeyFrame = requestAnimationFrame(() => {
      journeyFrame = 0;
      const travel = journeyTrack.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(Math.max(-journeyTrack.getBoundingClientRect().top / travel, 0), 0.999999);
      const step = Math.min(Math.floor(progress * 4), 3);
      const activeJourney = all<HTMLElement>('[data-journey]').find((journey) => journey.getClientRects().length > 0);
      const buttons = activeJourney ? all<HTMLButtonElement>('[data-step-button]').filter((button) => button.closest('[data-journey]') === activeJourney) : [];
      const current = buttons.find((button) => button.getAttribute('aria-pressed') === 'true');
      const next = buttons[step];
      if (next && current !== next) next.click();
    });
  };
  window.addEventListener('scroll', syncJourneyStage, { passive: true });
  window.addEventListener('resize', syncJourneyStage);
  all<HTMLInputElement>('[name="rol"]').forEach((input) => input.addEventListener('change', syncJourneyStage));
  syncJourneyStage();
}

// El formulario solo se activa con un endpoint configurado.
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

    if (status) status.textContent = 'El formulario de contacto estará disponible pronto.';
  });
}
