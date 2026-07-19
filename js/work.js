document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.querySelector('.no-results');
    const modal = document.getElementById('projectModal');

    if (!cards.length || !modal) return;

    // ----- Scroll-reveal (zelfde techniek als js/index.js) -----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
    });

    cards.forEach((card, i) => {
        card.classList.add('hidden');
        card.style.transitionDelay = (i * 0.12) + 's';
        revealObserver.observe(card);
    });

    // Als een kaart al in beeld is bij het laden, direct tonen
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const winHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < winHeight * 0.85 && rect.bottom > 0) {
            card.classList.add('show');
            revealObserver.unobserve(card);
        }
    });

    // ----- Filteren op techniek -----
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter.toLowerCase();
            let visibleCount = 0;

            cards.forEach((card) => {
                const tags = Array.from(card.querySelectorAll('.tag')).map((tag) => tag.textContent.toLowerCase());
                const matches = filter === 'all' || tags.some((tag) => tag.includes(filter));
                card.classList.toggle('filtered-out', !matches);
                if (matches) visibleCount++;
            });

            if (noResults) {
                noResults.classList.toggle('show', visibleCount === 0);
            }
        });
    });

    // ----- Lightbox / modal -----
    const modalImg = modal.querySelector('.project-modal-photo img');
    const modalTitle = modal.querySelector('.project-modal-body h2');
    const modalTags = modal.querySelector('.project-modal-tags');
    const modalDesc = modal.querySelector('.project-modal-body p');
    const modalClose = modal.querySelector('.project-modal-close');
    const modalBackdrop = modal.querySelector('.project-modal-backdrop');

    let lastFocusedCard = null;

    function openModal(card) {
        const photo = card.querySelector('.project-photo img');
        modalImg.src = photo.src;
        modalImg.alt = photo.alt;
        modalTitle.textContent = card.querySelector('h2').textContent;
        modalDesc.textContent = card.querySelector('.project-body p').textContent;

        modalTags.innerHTML = '';
        card.querySelectorAll('.project-tags .tag').forEach((tag) => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag.textContent;
            modalTags.appendChild(span);
        });

        lastFocusedCard = card;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastFocusedCard) lastFocusedCard.focus();
    }

    cards.forEach((card) => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});
