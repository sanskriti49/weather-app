import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AnimatedBackground.module.css";
import { useWeatherContext } from "../contexts/WeatherContext"; // Adjust path if needed

const MoonIcon = () => <div className={styles.moon}></div>;
const StarsIcon = () => <div className={styles.stars}></div>;

const CloudIcon = ({ cloudRef, className }) => (
	<div ref={cloudRef} className={`${styles.cloud} ${className}`}></div>
);

function AnimatedBackground() {
	//const { isDay = true } = useWeatherContext() || {};

	// Refs for clouds
	const cloudRefs = [useRef(null), useRef(null), useRef(null)];
	const containerRef = useRef(null);

	useEffect(() => {
		const clouds = cloudRefs.map((ref) => ref.current).filter(Boolean);

		const tweenCloud = (cloudElement) => {
			if (!cloudElement) return;

			//const startLeft = Math.random() * 100 - 20 + "vw"; // Random start X-position
			const startLeft = "-20vw"; // Start offscreen to the left

			const startTop = Math.random() * 40 + 10 + "%"; // Random start Y-position
			const speed = Math.random() * 20 + 20; // Random duration

			gsap.set(cloudElement, { left: startLeft, top: startTop });

			gsap.to(cloudElement, {
				left: "100vw",
				duration: speed,
				ease: "linear",
				onComplete: () => {
					tweenCloud(cloudElement); // Restart animation with new random values
				},
			});
		};

		clouds.forEach(tweenCloud);

		return () => {
			gsap.killTweensOf(clouds);
		};
	}, []);

	// const backgroundClass = `${styles.background} ${
	// 	isDay ? styles.day : styles.night
	// }`;

	return (
		<div className={styles.container} ref={containerRef}>
			<div>
				<div className={styles.overlay}></div>
				<StarsIcon />
				{cloudRefs.map((ref, index) => (
					<CloudIcon
						key={index}
						cloudRef={ref}
						className={styles[`cloud${index}`]}
					/>
				))}
			</div>
		</div>
	);
}

export default AnimatedBackground;
