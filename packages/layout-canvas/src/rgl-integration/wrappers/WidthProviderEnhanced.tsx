import React, { useEffect, useState, useCallback, useRef } from 'react';
import { WidthProviderEnhancedProps } from '../types';

/**
 * Enhanced width provider optimized for our canvas sizing
 * Provides more control over width measurement and caching
 */
export const WidthProviderEnhanced: React.FC<WidthProviderEnhancedProps> = ({
  children,
  fixedWidth,
  measureBeforeChildren = false,
}) => {
  const [width, setWidth] = useState<number>(fixedWidth || 900); // Default to 900px canvas width
  const [isMounted, setIsMounted] = useState<boolean>(!measureBeforeChildren);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Measure width function
  const measureWidth = useCallback(() => {
    if (fixedWidth) {
      setWidth(fixedWidth);
      return;
    }

    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth > 0 && containerWidth !== width) {
        setWidth(containerWidth);
      }
    }
  }, [fixedWidth, width]);

  // Setup ResizeObserver for dynamic width changes
  useEffect(() => {
    if (fixedWidth) {
      setWidth(fixedWidth);
      setIsMounted(true);
      return;
    }

    // Initial measurement
    measureWidth();

    // Setup ResizeObserver for responsive width changes
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          if (newWidth > 0 && newWidth !== width) {
            setWidth(newWidth);
          }
        }
      });

      resizeObserverRef.current.observe(containerRef.current);
    } else {
      // Fallback to window resize listener
      const handleResize = () => {
        measureWidth();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    // Set mounted after first measurement
    setIsMounted(true);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [fixedWidth, measureWidth, width]);

  // Handle container mount
  const handleContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && containerRef.current !== node) {
        // Store node reference
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

        // Measure width when container is mounted
        if (!fixedWidth) {
          const containerWidth = node.offsetWidth;
          if (containerWidth > 0) {
            setWidth(containerWidth);
          }
        }

        setIsMounted(true);
      }
    },
    [fixedWidth],
  );

  // Don't render children until we have a valid width measurement
  if (measureBeforeChildren && (!isMounted || width <= 0)) {
    return (
      <div
        ref={handleContainerRef}
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Measuring canvas width...
      </div>
    );
  }

  return (
    <div ref={handleContainerRef} style={{ width: '100%' }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Pass width as prop to child components
          return React.cloneElement(child, {
            width,
            ...child.props,
          });
        }
        return child;
      })}
    </div>
  );
};

/**
 * Higher-order component version of WidthProviderEnhanced
 * Similar to RGL's WidthProvider but with our enhancements
 */
export function withWidthProvider<T extends { width?: number }>(WrappedComponent: React.ComponentType<T>) {
  const WithWidthProviderComponent: React.FC<Omit<T, 'width'> & WidthProviderEnhancedProps> = (props) => {
    const { fixedWidth, measureBeforeChildren, ...componentProps } = props;

    return (
      <WidthProviderEnhanced fixedWidth={fixedWidth} measureBeforeChildren={measureBeforeChildren}>
        <WrappedComponent {...(componentProps as unknown as T)} />
      </WidthProviderEnhanced>
    );
  };

  WithWidthProviderComponent.displayName = `withWidthProvider(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithWidthProviderComponent;
}

/**
 * Hook version for components that need width information
 */
export const useContainerWidth = (containerRef: React.RefObject<HTMLElement>, fixedWidth?: number) => {
  const [width, setWidth] = useState<number>(fixedWidth || 900);
  const [isReady, setIsReady] = useState<boolean>(!!fixedWidth);

  useEffect(() => {
    if (fixedWidth) {
      setWidth(fixedWidth);
      setIsReady(true);
      return;
    }

    const measureWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          setWidth(containerWidth);
          setIsReady(true);
        }
      }
    };

    // Initial measurement
    measureWidth();

    // Setup ResizeObserver
    let resizeObserver: ResizeObserver | null = null;

    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          if (newWidth > 0) {
            setWidth(newWidth);
            setIsReady(true);
          }
        }
      });

      resizeObserver.observe(containerRef.current);
    } else {
      // Fallback to window resize
      const handleResize = measureWidth;
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerRef, fixedWidth]);

  return { width, isReady };
};

/**
 * Utility function to calculate grid dimensions
 */
export const calculateGridDimensions = (
  containerWidth: number,
  cols: number = 12,
  margin: [number, number] = [4, 4],
  containerPadding: [number, number] = [8, 8],
) => {
  const [marginX] = margin;
  const [paddingX] = containerPadding;

  // Available width after padding
  const availableWidth = containerWidth - paddingX * 2;

  // Width per column including margins
  const totalMarginWidth = (cols - 1) * marginX;
  const columnWidth = (availableWidth - totalMarginWidth) / cols;

  return {
    containerWidth,
    availableWidth,
    columnWidth,
    totalMarginWidth,
    cols,
  };
};

export default WidthProviderEnhanced;
