declare module '@m-next/loading-skeleton' {
    import * as React from 'react';

    export interface LoadingSkeletonProps {
        id?: string;
        count?: number;
        height?: string | number;
        width?: string | number;
        circle?: boolean;
        style?: React.CSSProperties;
        duration?: number;
    }

    const LoadingSkeleton: React.FC<LoadingSkeletonProps>;
    export default LoadingSkeleton;
}