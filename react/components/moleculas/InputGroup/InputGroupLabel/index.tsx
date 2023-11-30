import React from 'react';
import cx from 'classnames';
import Text, { TextColor, TextSize } from '@writerai/ui-atoms';

import styles from './styles.module.css';

export interface ILabelProps {
  /** Set additional css class */
  className?: string;
  /** Set inline css styles */
  style?: React.CSSProperties;
  /** Children passed on as React child */
  children?: React.ReactNode;
  /** Adds mark " *REQUIRED " to Label */
  required?: boolean;
  /** Error text to show in label field if */
  errorText?: string;
}

export const Label: React.FC<ILabelProps & React.AllHTMLAttributes<HTMLLabelElement>> = ({
  className,
  children,
  required = false,
  errorText = '',
  ...props
}) => (
  <label className={cx(className, styles.styledLabel)} {...props}>
    <Text caps variant={TextSize.XS}>
      {children}
    </Text>
    {required && !errorText && (
      <Text caps variant={TextSize.XS} className={styles.requiredMark}>
        *Required
      </Text>
    )}
    {errorText && (
      <Text className={styles.errorText} caps variant={TextSize.XS} color={TextColor.ORANGE}>
        {errorText}
      </Text>
    )}
  </label>
);

export default Label;
