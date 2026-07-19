const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdnzyaq';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const resetLink = document.getElementById('resetForm');
    const bericht = document.getElementById('bericht');
    const charCounter = document.querySelector('.char-counter');
    const submitBtn = form ? form.querySelector('.submit-btn') : null;
    const formError = document.getElementById('formError');

    if (!form) return;

    const fields = {
        naam: { el: document.getElementById('naam'), required: true },
        email: { el: document.getElementById('email'), required: true, isEmail: true },
        onderwerp: { el: document.getElementById('onderwerp'), required: true },
        bericht: { el: document.getElementById('bericht'), required: true }
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(field, message) {
        const wrap = field.el.closest('.form-field');
        wrap.classList.add('invalid');
        wrap.querySelector('.field-error').textContent = message;
    }

    function clearError(field) {
        const wrap = field.el.closest('.form-field');
        wrap.classList.remove('invalid');
        wrap.querySelector('.field-error').textContent = '';
    }

    function validateField(key) {
        const field = fields[key];
        const value = field.el.value.trim();

        if (field.required && value === '') {
            showError(field, 'Dit veld is verplicht.');
            return false;
        }

        if (field.isEmail && !emailPattern.test(value)) {
            showError(field, 'Vul een geldig e-mailadres in.');
            return false;
        }

        clearError(field);
        return true;
    }

    // Live validatie zodra iemand een veld verlaat
    Object.keys(fields).forEach((key) => {
        fields[key].el.addEventListener('blur', () => validateField(key));
    });

    // Live karakter-teller op het berichtveld
    if (bericht && charCounter) {
        const max = bericht.getAttribute('maxlength') || 500;
        charCounter.textContent = '0 / ' + max;
        bericht.addEventListener('input', () => {
            charCounter.textContent = bericht.value.length + ' / ' + max;
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        Object.keys(fields).forEach((key) => {
            if (!validateField(key)) isValid = false;
        });

        if (!isValid) return;

        if (formError) formError.textContent = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Versturen...';
        }

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Verzenden mislukt');
                form.style.display = 'none';
                success.classList.add('show');
            })
            .catch(() => {
                if (formError) {
                    formError.textContent = 'Er ging iets mis bij het versturen, probeer het later opnieuw.';
                }
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Verstuur bericht';
                }
            });
    });

    if (resetLink) {
        resetLink.addEventListener('click', (e) => {
            e.preventDefault();
            success.classList.remove('show');
            form.style.display = '';
            form.reset();
            if (charCounter) charCounter.textContent = '0 / ' + (bericht.getAttribute('maxlength') || 500);
            if (formError) formError.textContent = '';
            Object.keys(fields).forEach((key) => clearError(fields[key]));
        });
    }
});
