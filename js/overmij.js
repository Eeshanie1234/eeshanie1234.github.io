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