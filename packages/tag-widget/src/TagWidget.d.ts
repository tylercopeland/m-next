/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
declare module '@m-next/tag-widget' {
    import * as React from 'react';

    export type TagWidgetSize = 'narrow' | 'regular';

    export interface TagWidgetProps {
        id?: string;
        tagsList?: any[];
        value?: string[];
        suggestions?: string[];
        caption?: string;
        disabled?: boolean;
        isEditable?: boolean;
        onChange?: (value: string) => void;
        onCreate?: (tag: string) => void;
        showManageTags?: boolean;
        isPortal?: boolean;
        onActionButtonClick?: () => void;
        size?: TagWidgetSize;
        width?: number | string;
    }

    const TagWidget: React.FC<TagWidgetProps>;
    export default TagWidget;
}