declare module '@m-next/image' {

    import * as React from 'react';

    export type ImageType = 'Fixed' | 'Responsive' | 'Background' | 'Dynamic' | 'Fit';
    export type UnsetImageType = 'person' | 'document' | 'landscape' | 'loader' | 'runtimeLandscape';

    export interface ImageStyleProps extends React.CSSProperties {
        wrapperStyle?: React.CSSProperties;
        imgStyle?: React.CSSProperties;
    }

    export interface ImageProps {
        id: string;
        caption?: string;
        imgType?: ImageType;
        value?: string;
        width?: number | string;
        height?: number | string;
        minWidth?: number | string;
        minWidthTablet?: number | string;
        minWidthMobile?: number | string;
        maxWidth?: number | string;
        maxWidthTablet?: number | string;
        maxWidthMobile?: number | string;
        disabled?: boolean;
        tabIndex?: string;
        originalName?: string;
        unsetImage?: UnsetImageType;
        circle?: boolean;
        onClick?: (e: React.MouseEvent) => void;
        className?: string;
        style?: ImageStyleProps;
        hideCaption?: boolean;
        isMobile?: boolean;
        isLoading?: boolean;
        alignTop?: boolean;
        tooltip?: string;
        tooltipId?: string;
        centerAlign?: boolean;
        fitToContainer?: boolean;
        placeholderIcon?: string;
        isV4?: boolean;
        cornerAction?: React.ReactNode;
    }

    export interface EditableImageProps extends ImageProps {
        onDelete?: () => void;
        onFileReadSuccess?: (file: File) => void;
        uploading?: boolean;
        uploadProgress?: number;
        uploadingFile?: string;
        uploadStyle?: React.CSSProperties;
        progressStyle?: React.CSSProperties;
        onClose?: () => void;
        onErrorMessageForUser?: (msg: string) => void;
        showSetImage?: boolean;
        customSetImageButton?: (onClick: () => void, disabled: boolean) => React.ReactNode;
        cornerEditing?: boolean;
        onDownloadImage?: (imageUrl: string) => void;
        isV4Design?: boolean;
        onWebUrlChange?: (url: string) => void;
        hasImage?: boolean;
    }

    const Image: React.FC<ImageProps>;
    const EditableImage: React.FC<EditableImageProps>;

    export default Image;
    export { EditableImage };
}