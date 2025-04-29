'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = 'right',
  duration = 0.3,
  delay = 0,
  distance = 20,
  className = ''
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const durationClass = duration === 0.3 ? 'duration-300' :
    duration === 0.5 ? 'duration-500' :
      duration === 1 ? 'duration-1000' : 'duration-300';

  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return `transform -translate-x-[${distance}px]`;
        case 'right':
          return `transform translate-x-[${distance}px]`;
        case 'up':
          return `transform -translate-y-[${distance}px]`;
        case 'down':
          return `transform translate-y-[${distance}px]`;
        default:
          return `transform translate-x-[${distance}px]`;
      }
    }
    return 'transform translate-x-0 translate-y-0';
  };

  return (
    <div
      className={`transition-all ${durationClass} ${isVisible ? 'opacity-100' : 'opacity-0'} ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  children: ReactNode[];
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedList({
  children,
  staggerDelay = 0.1,
  duration = 0.3,
  className = ''
}: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    const timers: NodeJS.Timeout[] = [];

    childrenArray.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * staggerDelay * 1000);

      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [children, staggerDelay]);

  const durationClass = duration === 0.3 ? 'duration-300' :
    duration === 0.5 ? 'duration-500' :
      duration === 1 ? 'duration-1000' : 'duration-300';

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`transition-all ${durationClass} ${visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface BouncyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function BouncyButton({ children, onClick, className = '', disabled = false }: BouncyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
    >
      {children}
    </div>
  );
}

// スライドアップアニメーション
export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.5,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// スタッガードアニメーション用のラッパー
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className = ""
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// スタッガード子要素用
export const StaggerItem = ({
  children,
  duration = 0.5,
  className = ""
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// リスト項目のアニメーション
export const AnimatedListItem = ({
  children,
  index,
  className = ""
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ページトランジション用ラッパー
export const PageTransition = ({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
