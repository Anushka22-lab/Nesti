// Persistent, extremely subtle animated backdrop used behind every
// screen in Nesti. Pure CSS — cheap to render, respects
// prefers-reduced-motion automatically (see index.css).
function GalaxyBackground() {
    return <div className="nesti-galaxy" aria-hidden="true" />;
}

export default GalaxyBackground;
