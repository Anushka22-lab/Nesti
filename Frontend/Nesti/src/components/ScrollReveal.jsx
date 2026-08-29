import { useEffect, useRef, useState } from "react";

// Scroll-triggered entrance animation. Uses IntersectionObserver so nothing
// animates until it's actually about to be seen, and only ever fires once.
// GPU-friendly: only opacity + transform are animated, no layout properties.
//
// direction: "up" | "down" | "left" | "right" | "scaleY" | "scaleX" | "none"
// "scaleY"/"scaleX" are for connector lines growing into place rather than
// content fading in — pass fade={false} to keep those fully opaque.

function ScrollReveal({
    children,
    delay = 0,
    distance = 22,
    duration = 0.8,
    direction = "up",
    fade,
    threshold = 0.2,
    onVisible,
    as: Tag = "div",
    className = "",
    style
}) {

    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        const el = ref.current;
        if (!el) return;

        const reduced =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced) {
            setVisible(true);
            if (onVisible) onVisible();
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (onVisible) onVisible();
                    io.unobserve(el);
                }
            },
            { threshold, rootMargin: "0px 0px -8% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold]);

    const transforms = {
        up: [`translateY(${distance}px)`, "translateY(0)"],
        down: [`translateY(-${distance}px)`, "translateY(0)"],
        left: [`translateX(${distance}px)`, "translateX(0)"],
        right: [`translateX(-${distance}px)`, "translateX(0)"],
        scaleY: ["scaleY(0)", "scaleY(1)"],
        scaleX: ["scaleX(0)", "scaleX(1)"],
        none: ["none", "none"]
    };

    const [from, to] = transforms[direction] || transforms.up;
    const shouldFade = fade === undefined ? direction !== "scaleY" && direction !== "scaleX" : fade;

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                opacity: shouldFade ? (visible ? 1 : 0) : 1,
                transform: visible ? to : from,
                transformOrigin: style?.transformOrigin || "top left",
                transition:
                    `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, ` +
                    `transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
                willChange: "opacity, transform",
                ...style
            }}
        >
            {children}
        </Tag>
    );

}

export default ScrollReveal;
