import * as React from 'react';

export type ExampleComponentProps = {
  id?: string,
  message?: string,
  primaryButton?: string,
  onPrimaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
};

function ExampleComponent(props: ExampleComponentProps) {
  const {
    id = '',
    message = '',
    primaryButton = '',
    onPrimaryButtonClick,
  } = props;


  return (
    <div id={`${id}-example`}>
      <span id={`${id}-example-message`} style={{ padding: 16 }}>
        {message}
      </span>
      {primaryButton && (
        <button id={`${id}-example-button`} type='button' onClick={onPrimaryButtonClick}>
          {primaryButton}
        </button>
      )}
    </div>
  );
}

export default ExampleComponent;
