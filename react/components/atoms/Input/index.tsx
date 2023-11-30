import React from 'react';
import { MuiStylesProvider, MuiInput, MuiInputProps } from '../mui';
import cx from 'classnames';
import styles from './styles.module.css';

interface InputElementProps extends MuiInputProps {
  classNameFocused?: string;
  rounded?: boolean;
}

export const Input: React.FC<InputElementProps> = ({
  className,
  style,
  value,
  type = 'text',
  onChange,
  multiline,
  classNameFocused,
  rounded,
  ...props
}) => {
  const inputStyles = {
    root: cx(className, styles.inputWrapper, !value ? styles.placeHolderShown : styles.filled, {
      [styles.inputWrapperMultiline]: multiline,
      [styles.inputRounded]: rounded,
    }),
    input: styles.input,
    error: styles.error,
    disabled: styles.disabled,
    focused: cx(styles.focused, classNameFocused),
    inputTypeSearch: styles.inputSearch,
    multiline: styles.multiLine,
  };

  return (
    <MuiStylesProvider injectFirst>
      <MuiInput
        classes={inputStyles}
        disableUnderline
        multiline={multiline}
        style={style}
        fullWidth
        {...{ type, value, onChange }}
        {...props}
      />
    </MuiStylesProvider>
  );
};

export default Input;
