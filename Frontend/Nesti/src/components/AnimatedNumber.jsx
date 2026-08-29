import { useEffect, useRef, useState } from "react";

// Counts smoothly from 0 up to `value` whenever value changes.
function AnimatedNumber({ value = 0, duration = 700, style }) {

    const [display, setDisplay] = useState(0);
    const prevValue = useRef(0);

    useEffect(() => {

        const from = prevValue.current;
        const to = Number(value) || 0;
        const start = performance.now();

        let frame;

        const tick = (now) => {

            const progress = Math.min(
                (now - start) / duration,
                1
            );

            // ease-out-cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplay(
                Math.round(from + (to - from) * eased)
            );

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            } else {
                prevValue.current = to;
            }

        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);

    }, [value, duration]);

    return <span style={style}>{display}</span>;

}

export default AnimatedNumber;
