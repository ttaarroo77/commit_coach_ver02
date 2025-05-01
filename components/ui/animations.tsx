'use client';

import React, { ReactNode, useState, useEffect } from 'react';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, duration = 0.3, delay = 0, className = '' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const durationClass = duration === 0.3 ? 'duration-300' : 
                        duration === 0.5 ? 'duration-500' : 
                        duration === 1 ? 'duration-1000' : 'duration-300';
  
  return (
    <div
      className={`transition-opacity ${durationClass} ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}

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

export function ScaleIn({ children, duration = 0.3, delay = 0, className = '' }: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const durationClass = duration === 0.3 ? 'duration-300' : 
                        duration === 0.5 ? 'duration-500' : 
                        duration === 1 ? 'duration-1000' : 'duration-300';
  
  return (
    <div
      className={`transition-all ${durationClass} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${className}`}
    >
      {children}
    </div>
  );
}

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
