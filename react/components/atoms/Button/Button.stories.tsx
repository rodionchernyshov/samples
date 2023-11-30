import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonTypes, SizeTypes } from '.';
import Icon, { IconVariant } from '../Icon';

const meta: Meta<typeof Button> = {
  title: 'Atom/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    content: 'I am PRIMARY button',
    type: ButtonTypes.PRIMARY,
  },
};
export const Secondary: Story = {
  args: {
    content: 'I am SECONDARY button',
    type: ButtonTypes.SECONDARY,
  },
};
export const Default: Story = {
  args: {
    content: 'I am DEFAULT button',
    type: ButtonTypes.DEFAULT,
  },
};
export const Black: Story = {
  args: {
    content: 'I am BLACK button',
    type: ButtonTypes.BLACK,
  },
};
export const Transparent: Story = {
  args: {
    content: 'I am TRANSPARENT button',
    type: ButtonTypes.TRANSPARENT,
  },
};
export const Bordered: Story = {
  args: {
    content: 'I am BORDERED button',
    type: ButtonTypes.BORDERED,
  },
};
export const TransparentHover: Story = {
  args: {
    content: 'I am TRANSPARENT_HOVER button',
    type: ButtonTypes.TRANSPARENT_HOVER,
  },
};
export const TransparentLink: Story = {
  args: {
    content: 'I am TRANSPARENT_LINK button',
    type: ButtonTypes.TRANSPARENT_LINK,
  },
};
export const Link: Story = {
  args: {
    content: 'I am LINK button',
    type: ButtonTypes.LINK,
  },
};
export const Gray: Story = {
  args: {
    content: 'I am GRAY button',
    type: ButtonTypes.GRAY,
  },
};
export const Blue2: Story = {
  args: {
    content: 'I am BLUE2 button',
    type: ButtonTypes.BLUE2,
  },
};
export const Mauve: Story = {
  args: {
    content: 'I am MAUVE button',
    type: ButtonTypes.MAUVE,
  },
};
export const Purple: Story = {
  args: {
    content: 'I am PURPLE button',
    type: ButtonTypes.PURPLE,
  },
};
export const Purple2: Story = {
  args: {
    content: 'I am PURPLE_2 button',
    type: ButtonTypes.PURPLE_2,
  },
};
export const Purple3: Story = {
  args: {
    content: 'I am PURPLE_3 button',
    type: ButtonTypes.PURPLE_3,
  },
};
export const Green: Story = {
  args: {
    content: 'I am GREEN button',
    type: ButtonTypes.GREEN,
  },
};
export const Yellow: Story = {
  args: {
    content: 'I am YELLOW button',
    type: ButtonTypes.YELLOW,
  },
};
export const Pink: Story = {
  args: {
    content: 'I am PINK button',
    type: ButtonTypes.PINK,
  },
};

export const XXS: Story = {
  args: {
    content: 'I am XXS size',
    size: SizeTypes.XXS,
  },
};
export const XS: Story = {
  args: {
    content: 'I am XS size',
    size: SizeTypes.XS,
  },
};
export const SMALL: Story = {
  args: {
    content: 'I am SMALL size',
    size: SizeTypes.SMALL,
  },
};
export const MEDIUM: Story = {
  args: {
    content: 'I am MEDIUM size',
    size: SizeTypes.MEDIUM,
  },
};
export const LARGE: Story = {
  args: {
    content: 'I am LARGE size',
    size: SizeTypes.LARGE,
  },
};
export const XXL: Story = {
  args: {
    content: 'I am XXL size',
    size: SizeTypes.XXL,
  },
};
export const XXXL: Story = {
  args: {
    content: 'I am XXXL size',
    size: SizeTypes.XXXL,
  },
};

export const PrimaryRounded: Story = {
  args: {
    type: ButtonTypes.PRIMARY,
    icon: <Icon name={IconVariant.WAND_WHITE} />,
    round: true,
  },
};

export const PrimarySquared: Story = {
  args: {
    type: ButtonTypes.PRIMARY,
    icon: <Icon name={IconVariant.WAND_WHITE} />,
    squared: true,
  },
};

export const PrimaryLoading: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.PRIMARY,
    isLoading: true,
  },
};

export const PrimaryGenerating: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.PRIMARY,
    isGenerating: true,
  },
};

export const PrimaryLoadingGenerating: Story = {
  args: {
    content: 'Loading and generating',
    type: ButtonTypes.PRIMARY,
    isGenerating: true,
    isLoading: true,
  },
};

export const PrimaryGeneratingSmall: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.PRIMARY,
    size: SizeTypes.XS,
    isGenerating: true,
  },
};

export const PrimaryGeneratingLarge: Story = {
  args: {
    content: 'This is a loading large primary button',
    type: ButtonTypes.PRIMARY,
    size: SizeTypes.LARGE,
    isGenerating: true,
  },
};

export const BlackLoading: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.BLACK,
    isLoading: true,
  },
};

export const BlackSmallLoading: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.BLACK,
    size: SizeTypes.XS,
    isLoading: true,
  },
};

export const BlackSmallLoadingDisabled: Story = {
  args: {
    content: 'This is a loading primary button',
    type: ButtonTypes.BLACK,
    size: SizeTypes.XS,
    isLoading: true,
    disabled: true,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    content: 'This is a disabled primary button',
    type: ButtonTypes.PRIMARY,
    disabled: true,
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    content: 'This secondary button with icon',
    type: ButtonTypes.SECONDARY,
    icon: <Icon name={IconVariant.LIGHTNING} />,
  },
};

export const SecondaryLoading: Story = {
  args: {
    content: 'This is a loading secondary button',
    type: ButtonTypes.SECONDARY,
    isLoading: true,
  },
};

export const SmallWithIcon: Story = {
  args: {
    content: 'action',
    type: ButtonTypes.DEFAULT,
    size: SizeTypes.XS,
    icon: <Icon name={IconVariant.LIGHTNING} />,
  },
};

export const LinkButtonWithImage: Story = {
  args: {
    content: 'http://www.google.com',
    type: ButtonTypes.LINK,
    size: SizeTypes.XS,
    icon: <Icon name={IconVariant.OPEN_LINK} />,
  },
};
