import { useState, useEffect } from "react";

const useDeviceOrientation = () => {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const updateOrientation = () => {
            const isLandscapeMode = window.matchMedia("(orientation: landscape)").matches;
            setIsLandscape(isLandscapeMode);
        };

        updateOrientation();

        window.addEventListener("resize", updateOrientation);

        return () => {
            window.removeEventListener("resize", updateOrientation);
        };
    }, []);

    return isLandscape;
};

export default useDeviceOrientation;
