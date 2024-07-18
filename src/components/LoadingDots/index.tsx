// LoadingDots.js
import React from 'react';
import { Variants, motion } from 'framer-motion';
import styles from './index.module.less';

const dotVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.8,
			yoyo: Infinity,
			staggerChildren: 0.1,
			repeat: Infinity,
			repeatType: 'reverse',
			ease: 'easeInOut',
		},
	},
};

const dotChildVariants: Variants = {
	hidden: { scale: 0 },
	visible: {
		scale: 1,
		transition: {
			duration: 0.8,
			yoyo: Infinity,
			staggerChildren: 0.1,
			repeat: Infinity,
			repeatType: 'reverse',
			ease: 'easeInOut',
		},
	},
};

const LoadingDots = () => {
	return (
		<motion.div
			className={styles['loading-dots']}
			variants={dotVariants}
			initial='hidden'
			animate='visible'
		>
			<motion.span variants={dotChildVariants}>&#8226;</motion.span>
			<motion.span variants={dotChildVariants}>&#8226;</motion.span>
			<motion.span variants={dotChildVariants}>&#8226;</motion.span>
		</motion.div>
	);
};

export default LoadingDots;
