window.NatureReleaseDocuments = (() => {
  function initialiseToc(scope = document) {
    const toc = scope.querySelector('.toc, .l-toc');
    if (!toc) return;

    toc._onScroll && window.removeEventListener('scroll', toc._onScroll);
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const sections = links.map(link => ({ link, section: scope.querySelector(link.getAttribute('href')) })).filter(item => item.section);
    const setActive = id => links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const updateActiveSection = () => {
      const anchor = window.innerHeight * 0.34;
      const current = sections.filter(({ section }) => section.getBoundingClientRect().top <= anchor).at(-1) || sections[0];
      if (current) setActive(current.section.id);
    };

    links.forEach(link => link.addEventListener('click', () => setActive(link.getAttribute('href').slice(1))));
    toc._onScroll = updateActiveSection;
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  return { initialiseToc };
})();
