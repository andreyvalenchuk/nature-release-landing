window.NatureReleaseDocuments = (() => {
  function initialiseToc(scope = document) {
    const toc = scope.querySelector('.toc, .l-toc');
    if (!toc) return;

    toc._sectionObserver?.disconnect();
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const sections = links.map(link => ({ link, section: scope.querySelector(link.getAttribute('href')) })).filter(item => item.section);
    const setActive = id => links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));

    links.forEach(link => link.addEventListener('click', () => setActive(link.getAttribute('href').slice(1))));
    toc._sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
    sections.forEach(({ section }) => toc._sectionObserver.observe(section));
    if (sections[0]) setActive(sections[0].section.id);
  }

  return { initialiseToc };
})();
