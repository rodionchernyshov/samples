import React from 'react';
import cx from 'classnames';
import styles from './styles.module.css';

export interface ISwitcherProps<T = string> {
  /** Set additional css class */
  className?: string;
  /** Set inline css styles */
  style?: React.CSSProperties;
  /** Children passed on as React child */
  children?: React.ReactNode;
  /** Set the handler to handle click event */
  onChange?: (e: boolean, fieldType?: T) => void;
  /** Set the id of button */
  id: string;
  /** Set the name of button */
  name?: string;
  /** Set the checked status of button */
  checked?: boolean;
  /** Set the label of button */
  label?: string | React.ReactElement;
  /** Disabled state of button */
  disabled?: boolean;
  /** Set the size of button */
  size?: number;
  /** Set the type of button */
  fieldType?: T;
}

export const Switcher = <T,>({
  className,
  style,
  onChange,
  id,
  label = '',
  name,
  checked = false,
  disabled = false,
  fieldType,
  size = 10,
}: ISwitcherProps<T>) => {
  const elClass: string = cx(className, styles.switcher, {
    [styles.disabled]: disabled,
  });

  const onSwitcherChange = () => {
    const _updatedValue = !checked;
    onChange?.(_updatedValue, fieldType);
  };

  return (
    <div style={{ ...style, ['--switcher-size' as string]: `${size}px` }} className={elClass}>
      <input type="checkbox" name={name} id={id} checked={checked} disabled={disabled} onChange={onSwitcherChange} />
      <label tabIndex={disabled ? -1 : 1} htmlFor={id}>
        <span className={styles.textHolder}>{label}</span>
      </label>
    </div>
  );
};