const wordElement = document.querySelector('.word');
const letterContainers = wordElement.querySelectorAll('.letter-container');

const parentWidth = wordElement.offsetWidth;
const numLetters = letterContainers.length;
const fixedWidth = parentWidth / (numLetters + 1);

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function generateColorPalette(baseHue, numColors = 5) {
    const palette = [];
    const saturation = 0.4;
    const lightness = 0.5;

    for (let i = 0; i < numColors; i++) {
        const hue = (baseHue + i * (360 / numColors)) % 360;
        const [r, g, b] = hslToRgb(hue / 360, saturation, lightness);
        palette.push(rgbToHex(r, g, b));
    }

    return palette;
}

function generateColors(numLetters) {
    const baseHue = Math.random() * 360;
    const palette = generateColorPalette(baseHue, numLetters);

    return palette.map(color => {
        const rgb = hexToRgb(color);
        const accent = rgb.map(c => Math.min(255, c + 30));
        return {
            primary: color,
            accent: rgbToHex(...accent)
        };
    });
}


const colors = generateColors(numLetters);

letterContainers.forEach((container, index) => {
    const letterWrapper = container.querySelector('.letter-wrapper');
    const letter = container.querySelector('.letter');

    const height = getRandomHeight();
    const fontSize = getRandomFontSize();
    const rotation = getRandomRotate();
    const zIndex = 1000 - fontSize; // Inverse relationship

    Object.assign(letterWrapper.style, {
        top: `${height / 2}px`
    });
    Object.assign(letter.style, {
        fontSize: `${fontSize}px`,
        zIndex: zIndex,
        textAlign: 'center',
        transform: `rotate(${rotation}deg)`,
        transition: 'none', // Ensure no transition is applied
        color: colors[index].primary,
    });

    // Store the rotation in a data attribute
    letter.dataset.rotation = rotation;

    Object.assign(container.style, {
        width: `${fixedWidth}px`,
        display: 'inline-block',
        verticalAlign: 'top',
        marginLeft: index > 0 ? '0px' : ''
    });

    // Set initial opacity to 0
    letter.style.opacity = '0';

    // Generate a random delay between 0 and 3 seconds
    const delay = Math.random() * 1000;

    // Use setTimeout to trigger the fade-in effect
    setTimeout(() => {
        letter.style.transition = 'opacity 0.3s ease-in';
        letter.style.opacity = '1';
    }, delay);
});

// Helper functions
function getRandomFontSize() {
    return Math.floor(Math.random() * 512) + 36;
}

function getRandomHeight() {
    return Math.floor(Math.random() * (window.innerHeight / 2)) + 16;
}

function getRandomRotate() {
    return Math.floor(Math.random() * 360);
}