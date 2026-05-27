export const checkboxColor = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Checkbox Colors
        case 'mi-checkbox-alert':
          style.backgroundColor = '#DA211E';
          style.borderColor = '#DA211E';
          break;
        case 'mi-checkbox-primary':
          style.backgroundColor = '#0D71C8';
          style.borderColor = '#0D71C8';
          break;
        case 'mi-checkbox-navigation':
          style.backgroundColor = '#022266';
          style.borderColor = '#022266';
          break;
        case 'mi-checkbox-caution':
          style.backgroundColor = '#E05D2A';
          style.borderColor = '#E05D2A';
          break;
        case 'mi-checkbox-success':
          style.backgroundColor = '#007B4A';
          style.borderColor = '#007B4A';
          break;
        case 'mi-checkbox-grey':
          style.backgroundColor = '#BACAD0';
          style.borderColor = '#BACAD0';
          break;
        case 'mi-checkbox-dark-grey':
          style.backgroundColor = '#545F67';
          style.borderColor = '#545F67';
          break;
        case 'mi-checkbox-silver':
          style.backgroundColor = '#EEF5F7';
          style.borderColor = '#EEF5F7';
          break;
        default:
          return null;
      }
    });
  }

  return style;
};

export const captionStyle = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Caption Colors
        case 'mi-checkbox-label-alert':
          style.color = '#DA211E';
          break;
        case 'mi-checkbox-label-primary':
          style.color = '#0D71C8';
          break;
        case 'mi-checkbox-label-navigation':
          style.color = '#022266';
          break;
        case 'mi-checkbox-label-caution':
          style.color = '#E05D2A';
          break;
        case 'mi-checkbox-label-success':
          style.color = '#007B4A';
          break;
        case 'mi-checkbox-label-grey':
          style.color = '#BACAD0';
          break;
        case 'mi-checkbox-label-gunmetal':
          style.color = '#545F67';
          break;
        case 'mi-checkbox-label-silver':
          style.color = '#EEF5F7';
          break;
        case 'mi-checkbox-label-black':
          style.color = '#000000';
          break;
        case 'mi-checkbox-label-white':
          style.color = '#FFFFFF';
          break;

        // Caption Align
        case 'mi-caption-font-xxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xsmall':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-small':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-large':
          style.fontSize = '14px';
          break;
        case 'mi-caption-font-xlarge':
          style.fontSize = '15.75px';
          break;
        case 'mi-caption-font-xxlarge':
          style.fontSize = '19.25px';
          break;

        // Font Weights
        case 'mi-text-bold':
          style.fontWeight = '600';
          break;
        case 'mi-text-bolder':
          style.fontWeight = '900';
          break;
        default:
          return null;
      }
    });
  }

  return style;
};

export const checkboxDark = (classes) => {
  let dark = false;
  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Checkbox Colors
        case 'mi-checkbox-silver':
          dark = true;
          break;
        default:
          dark = false;
          break;
      }
    });
  }

  return dark;
};
