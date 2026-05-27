import styled from '@emotion/styled';
import { colors, customOffsetFocusOutline } from '@m-next/styles';
import { motion } from 'framer-motion';

export const EditButton = styled(motion.div)`
  position: relative;
  cursor: pointer;
  z-index: 200;
  display: 'inline-block';

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -51%);
    z-index: -1;
    background-color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
`;

export const ImageWidgetWrapper = styled.div(({ size, isRound, centerAlign, fitToContainer, disabled }) => {
  const { width, height, minWidth, maxWidth } = size;

  let display = 'inline-block';
  let alignItems = null;
  let justifyContent = null;

  if (fitToContainer) {
    display = 'flex';
    alignItems = 'flex-start';
    justifyContent = 'flex-start';
  } else if (centerAlign) {
    display = 'inline-flex';
    alignItems = 'center';
    justifyContent = 'center';
  }

  return [
    {
      position: 'relative',
      display,
      alignItems,
      justifyContent,
      border: 'none',

      width: fitToContainer ? '100%' : width,
      height: fitToContainer ? '100%' : height,
      flex: fitToContainer ? '1' : null,
      minWidth: fitToContainer ? 0 : minWidth,
      minHeight: fitToContainer ? 0 : null,
      maxWidth: fitToContainer ? null : maxWidth,
      borderRadius: isRound ? '50%' : null,
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      focus: {
        outline: 'none',
      },
    },
  ];
});

export const ImageWrapper = styled.div`
  display: ${(props) => (props.fitToContainer ? 'flex' : 'inline-block')};
  align-items: ${(props) => (props.fitToContainer ? 'flex-start' : null)};
  justify-content: ${(props) => (props.fitToContainer ? 'center' : null)};
  border-radius: 3px;
  width: ${(props) => (props.fitToContainer ? '100%' : '100%')};
  height: ${(props) => (props.fitToContainer ? '100%' : 'auto')};
  overflow: ${(props) => (props.alignTop ? null : 'hidden')};

  body.user-is-tabbing &:focus {
    ${(props) => (props.hasClick ? customOffsetFocusOutline : '')};
    ${(props) => props.hasClick && 'overflow: visible'};
  }
`;

export const TiffContainer = styled.div(() => [
  {
    canvas: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
]);

const getImageStyles = ({ isV4, fitToContainer }) => {
  if (isV4) {
    return { width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: null };
  }
  return {
    width: '100%',
    height: fitToContainer ? '100%' : 'auto',
    maxWidth: null,
    maxHeight: null,
    objectFit: fitToContainer ? 'contain' : null,
  };
};

export const Image = styled.img((props) => [
  {
    ...getImageStyles(props),
    outline: 'none',
    cursor: props.hasClick ? 'pointer' : 'default',
    ...(props?.style ?? {}),
  },
]);

export const ImageContainer = styled.div(({ fitToContainer }) => [
  {
    position: 'relative',
    display: fitToContainer ? 'flex' : 'inline-block',
    flexDirection: fitToContainer ? 'column' : null,
    border: 'none',
    width: fitToContainer ? '100%' : null,
    height: fitToContainer ? '100%' : null,

    focus: {
      outline: 'none',
    },
  },
]);

export const ImageEditerContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    //   backgroundColor: colors.concrete,
  },
]);

export const ImageEditorFooter = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    justifyContent: 'flex-end',
  },
]);

export const ProgressBarWrapper = styled.div`
  background-color: rgba(46, 198, 232, 0.1);
  width: 100%;
  height: 8px;
  border-radius: 8px;
  border: 1px solid rgba(46, 198, 232, 0.1);
`;

export const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(89.99deg, #0e79d6 0%, #2ec7e8 99.99%);
  border-radius: 8px;
  width: ${(props) => props.percentage}%;
`;

export const FileIconWrapper = styled.div`
  margin-right: 8px;
  position: relative;
  cursor: ${(p) => (p.isUploading ? 'default' : 'pointer')};
`;

export const FileExtention = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  line-height: 9px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: #fff;
  background: ${colors['blue']};
  padding: 0 1px;
`;
export const ImageEditorUploaderContent = styled.div(() => [
  {
    height: 254,
    width: '100%',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
]);

export const ImageEditorUploaderFileWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
]);

export const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 3px;
  background-color: white;
  min-width: 162px;
  box-shadow: 0px 1px 7px 1px rgba(0, 0, 0, 0.1);
  margin: 0%;
  z-index: 210;
  text-align: left;
`;

export const MenuItem = styled.span`
  width: 100%;
  list-style: none;
  padding: 8px;
  cursor: pointer;
  line-height: 16px;
  font-size: 14px;
  user-select: none;

  &:hover {
    background-color: ${colors.greyLightest};
    color: ${colors.blue};
  }

  &:hover.edit-btn-delete {
    color: ${colors.red};
  }

  position: relative;
`;
