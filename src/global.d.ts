declare module 'framer-motion' {
  import React from 'react';
  
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    layout?: boolean | string;
    layoutId?: string;
  }

  export type MotionComponent<P = {}> = React.ComponentType<P & MotionProps>;

  interface CustomMotion {
    <C extends React.ComponentType<any>>(component: C): MotionComponent<React.ComponentProps<C>>;
    div: MotionComponent<React.HTMLAttributes<HTMLDivElement>>;
    span: MotionComponent<React.HTMLAttributes<HTMLSpanElement>>;
    a: MotionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    button: MotionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    p: MotionComponent<React.HTMLAttributes<HTMLParagraphElement>>;
    img: MotionComponent<React.ImgHTMLAttributes<HTMLImageElement>>;
    // Add other HTML elements as needed
  }

  export const motion: CustomMotion;
  
  export const AnimatePresence: React.FC<{ children: React.ReactNode; mode?: 'sync' | 'wait' | 'popLayout'; }>;
} 