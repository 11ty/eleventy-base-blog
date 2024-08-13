const wordElement = document.querySelector(".word");
const letterContainers = wordElement.querySelectorAll(".letter-container");

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

    return palette.map((color) => {
        const rgb = hexToRgb(color);
        const accent = rgb.map((c) => Math.min(255, c + 30));
        return {
            primary: color,
            accent: rgbToHex(...accent),
        };
    });
}

const colors = generateColors(numLetters);
// const tallLetters = new Set(['b', 'd', 'f', 'h', 'k', 'l', 't', 'i']);
// const dipLetters = new Set(['q', 'p', 'g', 'y']);
// const uniqueLetters = new Set(['j'])

letterContainers.forEach((container, index) => {
    const letterWrapper = container.querySelector(".letter-wrapper");
    const letter = container.querySelector(".letter");
    const rand = Math.random();

    letter.style.setProperty("--random-delay", `${rand}s`);
    letter.style.setProperty("--random-size", rand * 100);

    const height = getRandomHeight();
    const rotation = getRandomRotate();

    Object.assign(letterWrapper.style, {
        top: `${height / 2}px`,
    });

    // Helper function to darken a color
    function getDarkerColor(hex, factor) {
        const rgb = hexToRgb(hex);
        const darkerRgb = rgb.map(c => Math.max(0, Math.floor(c - c * factor)));
        return `rgb(${darkerRgb.join(',')})`;
    }

    const primaryColor = colors[index].primary;
    // const darkColor = getDarkerColor(primaryColor, 0.3);

    Object.assign(letter.style, {
        textAlign: "center",
        color:  colors[index].accent,
        WebkitTextStroke: `1px ${ colors[index].primary}`,
        textStroke: `1px ${ colors[index].primary}`,
        paintOrder: "stroke fill"

    });

    letter.style.setProperty('--rotation', rotation);
    letter.style.setProperty('--font-weight', '400');

    Object.assign(container.style, {
        width: `${fixedWidth}px`,
        display: "inline-block",
        verticalAlign: "top",
        marginLeft: index > 0 ? "0px" : "",
    });
});


// Helper functions
function getRandomHeight() {
    return Math.floor(Math.random() * (window.innerHeight / 1.5));
}

function getRandomRotate() {
    return Math.floor(Math.random() * 360);
}
