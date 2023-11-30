import React, { ReactElement } from 'react';
import cx from 'classnames';

import styles from './styles.module.css';

import { DotLoader } from '../MiscElements';

export interface IButtonProps {
  /** Route to navigate to */
  navTo?: string;
  /** set <a> target */
  navTarget?: string;
  /** Set custom class name of button */
  className?: string;
  /** Set custom style of button */
  style?: React.CSSProperties;
  /** Set the icon component of button */
  icon?: React.ReactNode;
  /** Set the size of button */
  size?: SizeTypes;
  /** Set the type of button */
  type?: ButtonTypes;
  /** Set the handler to handle click event */
  onClick?: (e: React.MouseEvent) => void;
  /** Disabled state of button */
  disabled?: boolean;
  /** Set the danger status of button */
  danger?: boolean;
  /** Button shape changed to round */
  round?: boolean;
  /** Set the loading status of button */
  isLoading?: boolean;
  /** Set the generating button style */
  isGenerating?: boolean;
  /** Set content in button */
  content?: string | ReactElement;
  /** Button shape changed to squared */
  squared?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  /** Set custom class name of disabled button */
  disabledClassName?: string;
}

export enum SizeTypes {
  /** XS = height-20 font-10 */
  XXS = 'xxs',
  /** XS = height-28 font-12 */
  XS = 'xs',
  /** SMALL = height-32 font-13 */
  SMALL = 'small',
  /** MEDIUM = height-40 font-14 */
  MEDIUM = 'medium',
  /** LARGE = height-44 font-15 */
  LARGE = 'large',
  /** XXL = height-52 font-15 */
  XXL = 'xxl',
  /** XXL = height-60 font-16 */
  XXXL = 'xxxl',
}

export enum ButtonTypes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DEFAULT = 'default',
  BLACK = 'black',
  TRANSPARENT = 'transparent',
  BORDERED = 'bordered',
  TRANSPARENT_HOVER = 'transparentHover',
  TRANSPARENT_LINK = 'transparentLink',
  LINK = 'link',
  GRAY = 'gray',
  BLUE2 = 'blue2',
  MAUVE = 'mauve',
  PURPLE = 'purple',
  PURPLE_2 = 'purple2',
  PURPLE_3 = 'purple3',
  GREEN = 'green',
  YELLOW = 'yellow',
  PINK = 'pink',
  GRAY_NU = 'graynu',
}

export const Button: React.FC<IButtonProps> = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, IButtonProps>(
  (
    {
      className,
      disabledClassName,
      children,
      onClick,
      style,
      content = '',
      icon = null,
      size = SizeTypes.MEDIUM,
      type = ButtonTypes.DEFAULT,
      disabled = false,
      round = false,
      squared = false,
      danger = false,
      isLoading = false,
      isGenerating = false,
      htmlType = 'button',
      navTarget,
      navTo,
      ...props
    },
    ref,
  ) => {
    const elClass: string = cx(className, styles.button, styles[type], styles[size], {
      [disabledClassName ?? styles.disabled]: disabled,
      [styles.round]: round,
      [styles.squared]: squared,
      [styles.danger]: danger,
      [styles.loading]: isLoading,
      [styles.generating]: isGenerating,
    });

    const _onDisabledClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (navTo) {
      return (
        <a
          ref={ref}
          className={elClass}
          href={navTo}
          target={navTarget}
          style={style}
          onClick={isLoading || disabled ? _onDisabledClick : onClick}
          // eslint-disable-next-line react/button-has-type
          type={htmlType}
          {...props}
        >
          {isLoading && <DotLoader className={styles.dotLoader} />}
          {icon}
          {isLoading ? null : children || <span className={styles.content}>{content}</span>}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={elClass}
        style={style}
        onClick={isLoading || disabled ? _onDisabledClick : onClick}
        // eslint-disable-next-line react/button-has-type
        type={htmlType}
        {...props}
      >
        {isLoading && <DotLoader compact={round || squared} />}
        {icon}
        {isLoading ? null : children || <span className={styles.content}>{content}</span>}
      </button>
    );
  },
);
