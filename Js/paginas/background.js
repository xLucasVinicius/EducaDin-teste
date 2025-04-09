function generateHexagons() {
    const patternElement = document.getElementById("pattern");

    // Limpa hexágonos antigos
    patternElement.innerHTML = '';

    // Calcula a altura máxima entre a tela e o conteúdo da página
    const maxHeight = Math.max(
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight
    );

    patternElement.style.height = `${maxHeight}px`;

    const countY = Math.ceil(maxHeight / 40) + 1;
    const countX = Math.ceil(patternElement.clientWidth / 48) + 1;

    for (let i = 0; i < countY; i++) {
        for (let j = 0; j < countX; j++) {
            const hexagon = document.createElement("div");
            hexagon.style = `
                background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODciIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODcgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMi4xOTg3MyAyNi4xNTQ3TDQzLjUgMi4zMDk0TDg0LjgwMTMgMjYuMTU0N1Y3My44NDUzTDQzLjUgOTcuNjkwNkwyLjE5ODczIDczLjg0NTNWMjYuMTU0N1oiIGZpbGw9IiMxRjFGMUYiIHN0cm9rZT0iIzFGMUYxRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=') no-repeat;
                width: 44px;
                height: 50px;
                background-size: contain;
                position: absolute;
                top: ${i * 40}px;
                left: ${j * 48 + ((i * 24) % 48)}px;
            `;
            patternElement.appendChild(hexagon);
        }
    }
}

// Regenerar sempre que o conteúdo mudar
const observer = new ResizeObserver(() => {
    generateHexagons();
});
observer.observe(document.body);

// Também regenerar no resize
window.addEventListener('resize', generateHexagons);

// Gradiente que acompanha o mouse e o scroll
let mousePosition = { x: 0, y: 0 };

document.addEventListener("mousemove", (mouse) => {
    mousePosition = {
        x: mouse.clientX, // clientX/Y pegam posição relativa à viewport
        y: mouse.clientY
    };
});

const loop = () => {
    const gradientElement = document.getElementById("gradient");

    // Limita o X e Y à área visível da tela
    const limitedX = Math.min(mousePosition.x, window.innerWidth);
    const limitedY = Math.min(mousePosition.y, window.innerHeight);

    gradientElement.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
    window.requestAnimationFrame(loop);
};


generateHexagons();
window.requestAnimationFrame(loop);
