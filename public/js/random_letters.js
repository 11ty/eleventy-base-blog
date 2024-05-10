const wordElement = document.querySelector('.word');
const letterContainers = wordElement.querySelectorAll('.letter-container');

const parentWidth = wordElement.offsetWidth;
const numLetters = letterContainers.length;
const fixedWidth = parentWidth / (numLetters + 1);

letterContainers.forEach((container, index) => {
    const letterWrapper = container.querySelector('.letter-wrapper');
    const letter = container.querySelector('.letter');

    const fontSize = getRandomFontSize();
    const height = getRandomHeight();
    const rotate = getRandomRotate();

    letterWrapper.style.height = `${height}px`;
    letter.style.fontSize = `${fontSize}px`;
    letter.style.lineHeight = `${fontSize}px`;
    letter.style.textAlign = 'center';
    letter.style.transform = `rotate(${rotate}deg)`;

    container.style.width = `${fixedWidth}px`;
    container.style.position = 'inline-block';
    container.style.display = 'inline-block';
    container.style.verticalAlign = 'top';

    if (index > 0) {
        container.style.marginLeft = '0px';
    }
});

// Helper functions
function getRandomFontSize() {
    return Math.floor(Math.random() * 72) + 36;
}

function getRandomHeight() {
    return Math.floor(Math.random() * (window.innerHeight / 2)) + 16;
}

function getRandomRotate() {
    return Math.floor(Math.random() * 360);
}
