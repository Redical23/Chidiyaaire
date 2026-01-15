"use client";

import { useState, useEffect, useSyncExternalStore } from 'react';

// Simple media query subscription for SSR-safe mobile detection
function subscribe(callback) {
    if (typeof window === 'undefined') return () => { };
    const mq = window.matchMedia('(max-width: 767px)');
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
}

function getServerSnapshot() {
    return false; // Default to desktop on server
}

export function useIsMobile() {
    // Use useSyncExternalStore for proper SSR handling
    const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Also track if we're mounted to handle hydration
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return false until mounted to prevent layout shift
    if (!mounted) return false;

    return isMobile;
}
