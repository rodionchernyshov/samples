import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { HighlightColor, Text, TextColor, TextSize, BackgroundColor, FontFace } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atom/Typography/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component to render headings.',
      },
    },
  },
  args: {
    children:
      'This is the water and this is the well. Drink full and descend. The horse is the white of the eyes, and dark within.',
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        component: 'A component to render headings.',
      },
    },
  },
};

export const XXXS: Story = {
  args: {
    variant: TextSize.XXXS,
  },
};

export const XXS: Story = {
  args: {
    variant: TextSize.XXS,
  },
};

export const XS: Story = {
  args: {
    variant: TextSize.XS,
  },
};

export const S: Story = {
  args: {
    variant: TextSize.S,
  },
};

export const M: Story = {
  args: {
    variant: TextSize.M,
  },
};

export const L: Story = {
  args: {
    variant: TextSize.L,
  },
};

export const XL: Story = {
  args: {
    variant: TextSize.XL,
  },
};

export const XXL: Story = {
  args: {
    variant: TextSize.XXL,
  },
};

export const XXXL: Story = {
  args: {
    variant: TextSize.XXXL,
  },
};

export const Light: Story = {
  args: {
    variant: TextSize.L,
    light: true,
  },
};

export const Medium: Story = {
  args: {
    variant: TextSize.L,
    medium: true,
  },
};

export const Bold: Story = {
  args: {
    variant: TextSize.L,
    bold: true,
  },
};

export const Italic: Story = {
  args: {
    variant: TextSize.L,
    italic: true,
  },
};

export const Underlined: Story = {
  args: {
    variant: TextSize.L,
    underline: true,
  },
};

export const Caps: Story = {
  args: {
    variant: TextSize.L,
    caps: true,
  },
};

export const SmallCaps: Story = {
  args: {
    variant: TextSize.L,
    smallCaps: true,
  },
};

export const ExtraSmallCaps: Story = {
  args: {
    variant: TextSize.L,
    extraSmallCaps: true,
  },
};

export const UpperCase: Story = {
  args: {
    variant: TextSize.L,
    upperCase: true,
  },
};

export const WithEllipsis: Story = {
  args: {
    variant: TextSize.L,
    ellipsisOverflow: true,
  },
  decorators: [
    Story => (
      <div style={{ width: '550px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Black: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.BLACK,
  },
};

export const Grey: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.GREY,
  },
};

export const Grey2: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.GREY2,
  },
};

export const Grey3: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.GREY3,
  },
};

export const Orange: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.ORANGE,
  },
};

export const White: Story = {
  args: {
    variant: TextSize.L,
    color: TextColor.WHITE,
  },
  decorators: [
    Story => (
      <div
        style={{
          padding: '10px',
          backgroundColor: '#2b2b2b',
          display: 'inline-block',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const LightOrangeHighlight: Story = {
  args: {
    variant: TextSize.L,
    highlightColor: HighlightColor.LIGHT_ORANGE,
  },
  decorators: [
    Story => (
      <div style={{ display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
};

export const RedHighlight: Story = {
  args: {
    variant: TextSize.L,
    highlightColor: HighlightColor.RED,
  },
  decorators: [
    Story => (
      <div style={{ display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
};

export const GreenHighlight: Story = {
  args: {
    variant: TextSize.L,
    highlightColor: HighlightColor.GREEN,
  },
  decorators: [
    Story => (
      <div style={{ display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
};

export const GreenBackground: Story = {
  args: {
    variant: TextSize.L,
    backgroundColor: BackgroundColor.GREEN,
  },
  decorators: [
    Story => (
      <div style={{ display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
};

export const Font1: Story = {
  args: {
    variant: TextSize.L,
    fontFace: FontFace.poppins,
  },
};

export const Font2: Story = {
  args: {
    variant: TextSize.L,
    fontFace: FontFace.monospace,
  },
};
