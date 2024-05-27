const wordElement = document.querySelector('.word');
const letterContainers = wordElement.querySelectorAll('.letter-container');

const parentWidth = wordElement.offsetWidth;
const numLetters = letterContainers.length;
const fixedWidth = parentWidth / (numLetters + 1);

letterContainers.forEach((container, index) => {
    const letterWrapper = container.querySelector('.letter-wrapper');
    const letter = container.querySelector('.letter');

    // Consolidate style settings with Object.assign
    Object.assign(letterWrapper.style, {
        top: `${getRandomHeight()}px`
    });

    const fontSize = getRandomFontSize();
    const rotation = getRandomRotate();
    Object.assign(letter.style, {
        fontSize: `${fontSize}px`,
        lineHeight: `${fontSize}px`,
        textAlign: 'center',
        transform: `rotate(${rotation}deg)`
    });

    // Store the rotation in a data attribute
    letter.dataset.rotation = rotation;

    Object.assign(container.style, {
        width: `${fixedWidth}px`,
        display: 'inline-block',
        verticalAlign: 'top',
        marginLeft: index > 0 ? '0px' : ''
    });
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