"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

export function MagneticText({ text = "CREATIVE", hoverText = "EXPLORE", className = "" }) {
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const innerTextRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isMobile, setIsMobile] = useState(false);

    const mousePos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef();

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => {
            window.removeEventListener("resize", updateSize);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    useEffect(() => {
        if (isMobile) return; // Skip animation on mobile

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const animate = () => {
            currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
            currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

            if (circleRef.current) {
                circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
            }

            if (innerTextRef.current) {
                innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isMobile]);

    const handleMouseMove = useCallback((e) => {
        if (isMobile || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, [isMobile]);

    const handleMouseEnter = useCallback((e) => {
        if (isMobile || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePos.current = { x, y };
        currentPos.current = { x, y };
        setIsHovered(true);
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    // Simple text on mobile
    if (isMobile) {
        return (
            <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
                <span className="text-2xl md:text-5xl font-bold tracking-tighter text-slate-600">{text}</span>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("relative inline-flex items-center justify-center cursor-none select-none", className)}
        >
            {/* Base text layer - original text */}
            <span className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900">{text}</span>

            <div
                ref={circleRef}
                className="absolute top-0 left-0 pointer-events-none rounded-full bg-blue-500 overflow-hidden"
                style={{
                    width: isHovered ? 150 : 0,
                    height: isHovered ? 150 : 0,
                    transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
                    willChange: "transform, width, height",
                }}
            >
                <div
                    ref={innerTextRef}
                    className="absolute flex items-center justify-center"
                    style={{
                        width: containerSize.width,
                        height: containerSize.height,
                        top: "50%",
                        left: "50%",
                        willChange: "transform",
                    }}
                >
                    <span className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white whitespace-nowrap">
                        {hoverText}
                    </span>
                </div>
            </div>
        </div>
    );
}
