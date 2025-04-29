'use client';

import React, { ReactNode, useState, useEffect } from 'react';
// framer-motionの代わりにネイティブのCSSアニメーションを使用する

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
  // CSSトランジションを使用
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      data-testid="fade-in"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}s ease-in-out`,
        transitionDelay: `${delay}s`
      }}
      className={className}
    >
      {children}
    </div>
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

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return `translateX(-${distance}px)`;
        case 'right':
          return `translateX(${distance}px)`;
        case 'up':
          return `translateY(-${distance}px)`;
        case 'down':
          return `translateY(${distance}px)`;
        default:
          return `translateX(${distance}px)`;
      }
    }
    return 'translateX(0) translateY(0)';
  };

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}s ease-in-out`,
        transitionDelay: `${delay}s`
      }}
      className={className}
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      data-testid="scale-in-mock"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        transition: `all ${duration}s ease-in-out`,
        transitionDelay: `${delay}s`
      }}
      className={className}
    >
      {children}
    </div>
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

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            opacity: visibleItems.includes(index) ? 1 : 0,
            transform: visibleItems.includes(index) ? 'translateY(0)' : 'translateY(8px)',
            transition: `all ${duration}s ease-in-out`,
            transitionDelay: `${index * staggerDelay}s`
          }}
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
      className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease-in-out'
      }}
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      data-testid="slide-up"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all ${duration}s ease-in-out`,
        transitionDelay: `${delay}s`
      }}
      className={className}
    >
      {children}
    </div>
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
    <div data-testid="stagger-container" className={className}>
      {children}
    </div>
  );
};

// スタッガードアニメーション用の子アイテム
export const StaggerItem = ({
  children,
  duration = 0.5,
  className = ""
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // マウント後に表示
    setIsVisible(true);
  }, []);

  return (
    <div
      data-testid="stagger-item"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: `all ${duration}s ease-in-out`
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// アニメーションリストアイテム
export const AnimatedListItem = ({
  children,
  index,
  className = ""
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease-in-out',
        transitionDelay: `${index * 0.05}s`
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// ページトランジション
export const PageTransition = ({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-in-out'
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// モーションコンポーネントの代替
export const motion = {
  div: ({ children, className, initial, animate, exit, transition, ...props }: any) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

    // CSSスタイルでアニメーションを模倣
    const getStyle = () => {
      const style: React.CSSProperties = {};

      if (animate && initial) {
        // 最も一般的なアニメーションケースを処理
        if ('opacity' in initial && 'opacity' in animate) {
          style.opacity = isVisible ? animate.opacity : initial.opacity;
        }

        if (('x' in initial || 'y' in initial) && ('x' in animate || 'y' in animate)) {
          const translateX = isVisible ? (animate.x || 0) : (initial.x || 0);
          const translateY = isVisible ? (animate.y || 0) : (initial.y || 0);
          style.transform = `translate(${translateX}px, ${translateY}px)`;
        }

        if ('scale' in initial && 'scale' in animate) {
          style.transform = isVisible ? `scale(${animate.scale})` : `scale(${initial.scale})`;
        }
      }

      style.transition = `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease-in-out'}`;
      if (transition?.delay) {
        style.transitionDelay = `${transition.delay}s`;
      }

      return style;
    };

    return (
      <div
        data-testid="motion-div"
        className={className}
        style={getStyle()}
        {...props}
      >
        {children}
      </div>
    );
  },
  span: ({ children, className, initial, animate, exit, transition, ...props }: any) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

    // CSSスタイルでアニメーションを模倣
    const getStyle = () => {
      const style: React.CSSProperties = {};

      if (animate && initial) {
        if ('opacity' in initial && 'opacity' in animate) {
          style.opacity = isVisible ? animate.opacity : initial.opacity;
        }

        if (('x' in initial || 'y' in initial) && ('x' in animate || 'y' in animate)) {
          const translateX = isVisible ? (animate.x || 0) : (initial.x || 0);
          const translateY = isVisible ? (animate.y || 0) : (initial.y || 0);
          style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
      }

      style.transition = `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease-in-out'}`;
      if (transition?.delay) {
        style.transitionDelay = `${transition.delay}s`;
      }

      return style;
    };

    return (
      <span
        data-testid="motion-span"
        className={className}
        style={getStyle()}
        {...props}
      >
        {children}
      </span>
    );
  }
};

// AnimatePresenceの代替
// eslint-disable-next-line react/display-name
export const AnimatePresence = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
