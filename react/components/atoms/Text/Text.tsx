import React from 'react';
import cx from 'classnames';

import styles from './Text.module.css';

interface ITextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Text size */
  variant?: TextSize;
  /** Makes text light */
  light?: boolean;
  /** Makes text medium */
  medium?: boolean;
  /** Makes text bold */
  bold?: boolean;
  /** Makes text italic */
  italic?: boolean;
  /** Makes text capitalized */
  caps?: boolean;
  /** Use Small Caps typography */
  smallCaps?: boolean;
  /** Use Extra Small Caps typography */
  extraSmallCaps?: boolean;
  /** Makes text uppercase */
  upperCase?: boolean;
  /** Set font face */
  fontFace?: FontFace;
  /** Set text color */
  color?: TextColor;
  /** Set the type of text highlighting */
  highlightColor?: HighlightColor;
  /* Set the background color for text */
  backgroundColor?: BackgroundColor;
  /** Apply inline styling */
  inline?: boolean;
  /** Make ellipsis overflow */
  ellipsisOverflow?: boolean;
  /** Make text underline */
  underline?: boolean;
}

export enum FontFace {
  poppins = 'poppins',
  monospace = 'monospace',
  arial = 'arial',
}

export enum TextSize {
  /** XXXS = 8px */
  XXXS = 'xxxs',
  /** XXS = 9px */
  XXS = 'xxs',
  /** XS = 10px */
  XS = 'xs',
  /** S = 11px */
  S = 's',
  /** M = 12px */
  M = 'm',
  /** L = 13px */
  L = 'l',
  /** XL = 14px */
  XL = 'xl',
  /** XXL = 15px */
  XXL = 'xxl',
  /** XXXL = 16px */
  XXXL = 'xxxl',
  /** XXXXL = 18px */
  XXXXL = 'xxxxl',
}

export enum TextColor {
  BLACK = 'black',
  WHITE = 'white',
  GREY = 'grey',
  GREY2 = 'grey2',
  ORANGE = 'orange',
  GREY3 = 'grey3',
  PURPLE3 = 'Purple3',
  CLASSIC_GREY3 = 'classicGrey3',
}

export enum HighlightColor {
  LIGHT_ORANGE = 'light_orange',
  RED = 'red',
  GREEN = 'green',
}

export enum BackgroundColor {
  GREEN = 'green',
}

export const Text = React.forwardRef<HTMLParagraphElement, ITextProps>(
  (
    {
      variant = TextSize.M,
      color = TextColor.BLACK,
      highlightColor,
      className,
      light,
      medium,
      bold,
      italic,
      caps,
      smallCaps,
      extraSmallCaps,
      ellipsisOverflow,
      upperCase,
      style,
      fontFace = FontFace.poppins,
      inline,
      backgroundColor,
      underline,
      children,
      ...props
    },
    ref,
  ) => {
    const elClass: string = cx(styles.container, className, {
      [styles.textLight]: light,
      [styles.textMedium]: medium,
      [styles.textBold]: bold,
      [styles.textItalic]: italic,
      [styles.textCaps]: caps,
      [styles.textSmallCaps]: smallCaps,
      [styles.textUppercase]: upperCase,
      [styles.ellipsisOverflow]: ellipsisOverflow,
      [styles.textExtraSmallCaps]: extraSmallCaps,
      [styles.textSizeXxxs]: variant === TextSize.XXXS,
      [styles.textSizeXxs]: variant === TextSize.XXS,
      [styles.textSizeXs]: variant === TextSize.XS,
      [styles.textSizeS]: variant === TextSize.S,
      [styles.textSizeM]: variant === TextSize.M,
      [styles.textSizeL]: variant === TextSize.L,
      [styles.textSizeXl]: variant === TextSize.XL,
      [styles.textSizeXxl]: variant === TextSize.XXL,
      [styles.textSizeXxxl]: variant === TextSize.XXXL,
      [styles.textSizeXxxxl]: variant === TextSize.XXXXL,
      [styles.faceDefault]: fontFace === FontFace.poppins,
      [styles.faceMonospace]: fontFace === FontFace.monospace,
      [styles.faceArial]: fontFace === FontFace.arial,
      [styles.colorBlack]: color === TextColor.BLACK,
      [styles.colorWhite]: color === TextColor.WHITE,
      [styles.colorGrey]: color === TextColor.GREY,
      [styles.colorGrey2]: color === TextColor.GREY2,
      [styles.colorOrange]: color === TextColor.ORANGE,
      [styles.colorGrey3]: color === TextColor.GREY3,
      [styles.colorPurple3]: color === TextColor.PURPLE3,
      [styles.colorClassicGrey3]: color === TextColor.CLASSIC_GREY3,
      [styles.highlightLightOrange]: highlightColor === HighlightColor.LIGHT_ORANGE,
      [styles.highlightRed]: highlightColor === HighlightColor.RED,
      [styles.highlightGreen]: highlightColor === HighlightColor.GREEN,
      [styles.backgroundGreen]: backgroundColor === BackgroundColor.GREEN,
      [styles.inline]: inline,
      [styles.underline]: underline,
    });

    return (
      <p className={elClass} style={style} ref={ref} {...props}>
        {children}
      </p>
    );
  },
);

export default Text;
