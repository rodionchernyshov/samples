import React from 'react';
import cx from 'classnames';

import styles from './styles.module.css';

interface IHeadingProps {
  /** Set additional css class */
  className?: string;
  /** Set inline css styles */
  style?: React.CSSProperties;
  /** Children passed on as React child */
  children?: React.ReactNode;
  /** Set variant for header */
  variant?: HeadingVariant;
  /** Set heading color */
  color?: HeadingColor;
  /** Set bold variant for header */
  bold?: boolean;
  /** Set medium variant for header */
  medium?: boolean;
  /** Makes heading uppercase */
  upperCase?: boolean;
}

export enum HeadingVariant {
  /** H1 = 36px */
  H1 = 'h1',
  /** H2 = 24px */
  H2 = 'h2',
  /** H3 = 18px */
  H3 = 'h3',
  /** H4 = 16px */
  H4 = 'h4',
  /** H5 = 16px */
  H5 = 'h5',
  /** H6 = 14px */
  H6 = 'h6',
}

export enum HeadingColor {
  BLACK = 'black',
  GREY = 'grey',
  GREY2 = 'grey2',
}

export const Heading: React.FC<IHeadingProps> = ({
  className,
  variant = HeadingVariant.H1,
  color = HeadingColor.BLACK,
  bold,
  medium,
  upperCase,
  style,
  ...props
}) => {
  const elClass: string = cx(styles.container, className, {
    [styles.bold]: bold,
    [styles.medium]: medium,
    [styles.uppercase]: upperCase,
    [styles.variantH1]: variant === HeadingVariant.H1,
    [styles.variantH2]: variant === HeadingVariant.H2,
    [styles.variantH3]: variant === HeadingVariant.H3,
    [styles.variantH4]: variant === HeadingVariant.H4,
    [styles.variantH5]: variant === HeadingVariant.H5,
    [styles.variantH6]: variant === HeadingVariant.H6,
    [styles.colorBlack]: color === HeadingColor.BLACK,
    [styles.colorGrey]: color === HeadingColor.GREY,
    [styles.colorGrey2]: color === HeadingColor.GREY2,
  });

  return (
    <div className={elClass} style={style} {...props}>
      <span>{props.children}</span>
    </div>
  );
};

export default Heading;
