//  Scroll-animatie JavaScript: zorgt dat elk element 1 voor 1 verschijnt

 (function() {
      document.addEventListener('DOMContentLoaded', function() {
        const hiddenElements = document.querySelectorAll('.hidden');

        // Intersection Observer met een drempelwaarde zodat ze netjes 1 voor 1 tevoorschijn komen
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Voeg de 'show' klasse toe, de CSS transition zorgt voor de vertraging (via transition-delay)
              entry.target.classList.add('show');
              // We kunnen het element blijven observeren, maar we willen niet dat het opnieuw wordt geanimeerd
              // dus we stoppen met observeren voor dit element.
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.2,
          rootMargin: '0px 0px -20px 0px'
        });

        hiddenElements.forEach(el => observer.observe(el));

        // Check of elementen al zichtbaar zijn bij het laden (bijv. als de sectie al in beeld is)
        // Dit helpt als de pagina al gescrold is naar de vaardigheden.
        hiddenElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const winHeight = window.innerHeight || document.documentElement.clientHeight;
          if (rect.top < winHeight * 0.8 && rect.bottom > 0) {
            el.classList.add('show');
            observer.unobserve(el);
          }
        });
      });
    })();




    document.addEventListener("mousemove", (e) => {
    createPop(e.clientX, e.clientY);
});

function createPop(x, y) {
    const pop = document.createElement("span");
    pop.classList.add("mouse-pop");

// const pop = document.createElement("div");
// pop.classList.add("mouse-star");

const stars = ["✨", "⭐", "💖", "🌸", "🩷"];
pop.textContent = stars[Math.floor(Math.random() * stars.length)];

    
    pop.style.left = x + "px";
    pop.style.top = y + "px";

    // Willekeurige grootte
    const size = Math.random() * 18 + 8;
    pop.style.width = size + "px";
    pop.style.height = size + "px";

    // Willekeurige kleur
    const colors = [
        "#ff69b4",
        "#ffb6c1",
        "#ffd700",
        "#87cefa",
        "#98fb98",
        "#ffffff",
        "#c084fc"
    ];

    pop.style.background =
        colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(pop);

    setTimeout(() => {
        pop.remove();
    }, 700);
}