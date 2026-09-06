window.NatureReleaseDocuments = (() => {
  function initialiseAccordions(root = document) {
    root.querySelectorAll('.section, .l-section').forEach(section => {
      if (section.dataset.disclosureReady) return;

      const number = section.querySelector(':scope > .section__number, :scope > .l-section-num');
      const title = section.querySelector(':scope > h2, :scope > .l-section-title');
      if (!number || !title) return;

      const button = document.createElement('button');
      const body = document.createElement('div');
      const icon = document.createElement('span');
      const siblings = [...section.children].filter(child => child !== number && child !== title);

      button.type = 'button';
      button.className = 'document-accordion__toggle';
      button.setAttribute('aria-expanded', 'false');
      number.classList.add('document-accordion__number');
      title.classList.add('document-accordion__title');
      icon.className = 'document-accordion__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '+';
      body.className = 'document-accordion__body';

      button.append(number, title, icon);
      body.append(...siblings);
      section.replaceChildren(button, body);
      section.dataset.disclosureReady = 'true';

      button.addEventListener('click', () => {
        const shouldOpen = !section.classList.contains('is-open');
        const group = section.parentElement;
        group.querySelectorAll(':scope > .section.is-open, :scope > .l-section.is-open').forEach(openSection => {
          openSection.classList.remove('is-open');
          openSection.querySelector('.document-accordion__toggle')?.setAttribute('aria-expanded', 'false');
        });
        section.classList.toggle('is-open', shouldOpen);
        button.setAttribute('aria-expanded', String(shouldOpen));
      });
    });
  }

  return { initialiseAccordions };
})();
