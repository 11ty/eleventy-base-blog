import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';

const H8 = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1],
    [1, 1, -1, -1, 1, 1, -1, -1],
    [1, -1, -1, 1, 1, -1, -1, 1],
    [1, 1, 1, 1, -1, -1, -1, -1],
    [1, -1, 1, -1, -1, 1, -1, 1],
    [1, 1, -1, -1, -1, -1, 1, 1],
    [1, -1, -1, 1, -1, 1, 1, -1]
];

function diffuse(size, ...ins) {
    const len = ins.length;
    const scale = Math.sqrt(1 / len);

    const dels = ins.map((input, i) => {
        const lineSize = size * ((i + 1) / len);
        return el.sdelay({ size: lineSize }, input);
    });

    return H8.map((row, i) => {
        return el.add(...row.map((col, j) => {
            return el.mul(col * scale, dels[j]);
        }));
    });
}

function dampFDN(name, sampleRate, size, decay, modDepth, ...ins) {
    const len = ins.length;
    const scale = Math.sqrt(1 / len);
    const md = el.mul(modDepth, 0.02);

    const dels = ins.map((input, i) => {
        return el.add(
            input,
            el.mul(
                decay,
                el.smooth(0.105, el.tapIn({ name: `${name}:fdn${i}` })),
            ),
        );
    });

    let mix = H8.map((row, i) => {
        return el.add(...row.map((col, j) => {
            return el.mul(col * scale, dels[j]);
        }));
    });

    return mix.map((mm, i) => {
        const modulate = (x, rate, amt) => el.add(x, el.mul(amt, el.cycle(rate)));
        const ms2samps = (ms) => sampleRate * (ms / 1000.0);

        const delaySize = el.mul(el.add(1.00, el.mul(3, size)), ms2samps((i + 1) * 17));
        const readPos = modulate(delaySize, el.add(0.1, el.mul(i, md)), ms2samps(2.5));

        return el.tapOut(
            { name: `${name}:fdn${i}` },
            el.delay(
                { size: ms2samps(750) },
                readPos,
                0,
                mm
            ),
        );
    });
}

function srvb(props, xl, xr) {
    const key = props.key;
    const sampleRate = props.sampleRate;
    const size = el.sm(props.size);
    const decay = el.sm(props.decay);
    const modDepth = el.sm(props.mod);
    const mix = el.sm(props.mix);

    const mid = el.mul(0.5, el.add(xl, xr));
    const side = el.mul(0.5, el.sub(xl, xr));
    const four = [xl, xr, mid, side];
    const eight = [...four, ...four.map(x => el.mul(-1, x))];

    const ms2samps = (ms) => sampleRate * (ms / 1000.0);

    const d1 = diffuse(ms2samps(43), ...eight);
    const d2 = diffuse(ms2samps(97), ...d1);
    const d3 = diffuse(ms2samps(117), ...d2);

    const d4 = dampFDN(`${key}:d4`, sampleRate, size, 0.004, modDepth, ...d3);
    const r0 = dampFDN(`${key}:r0`, sampleRate, size, decay, modDepth, ...d4);

    const yl = el.mul(0.25, el.add(r0[0], r0[2], r0[4], r0[6]));
    const yr = el.mul(0.25, el.add(r0[1], r0[3], r0[5], r0[7]));

    return [
        el.select(mix, yl, xl),
        el.select(mix, yr, xr),
    ];
}

export default srvb;