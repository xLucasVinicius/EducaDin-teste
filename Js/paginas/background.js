generateHexagons();
function generateHexagons() { // Função para gerar os hexágonos

const patternElement = document.getElementById("pattern"); // Seleciona o elemento do fundo

const countY = Math.ceil(patternElement.clientHeight / 40) + 1; // Calcula o número de linhas
const countX = Math.ceil(patternElement.clientWidth / 48) + 1; // Calcula o número de colunas

for (let i = 0; i < countY; i++) { // Contador para criar os hexágonos em todo o fundo
    for (let j = 0; j < countX; j++) {
        const hexagon = document.createElement("div"); // Cria um novo hexágono

        // Define o estilo do hexágono
        hexagon.style = ` 
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODciIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODcgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMi4xOTg3MyAyNi4xNTQ3TDQzLjUgMi4zMDk0TDg0LjgwMTMgMjYuMTU0N1Y3My44NDUzTDQzLjUgOTcuNjkwNkwyLjE5ODczIDczLjg0NTNWMjYuMTU0N1oiIGZpbGw9IiMxRjFGMUYiIHN0cm9rZT0iIzFGMUYxRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=') no-repeat;
        width: 44px;
        height: 50px;
        background-size: contain;
        position: absolute;
        top: ${i * 40}px;
        left: ${j * 48 + ((i * 24) % 48)}px;
        `;

        patternElement.appendChild(hexagon); // Adiciona o hexágono ao elemento do fundo
    }
}


let mousePosition = { // Objeto para armazenar a posição do mouse
    x: 0,
    y: 0
};

document.addEventListener("mousemove", (mouse) => { // Evento para atualizar a posição do mouse
    mousePosition = {
        x: mouse.clientX,
        y: mouse.clientY
    };
});

const loop = () => { // Função para atualizar a posição do gradiente e sempre seguir o mouse
    const gradientElement = document.getElementById("gradient"); // Seleciona o elemento de gradiente
    gradientElement.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`; // Define a posição do gradiente
    window.requestAnimationFrame(loop); // Chama a próxima iteração
};

window.requestAnimationFrame(loop); // Chama a primeira iteração

}

window.addEventListener('resize', generateHexagons); // Adiciona um ouvinte para o evento de redimensionamento da janela
