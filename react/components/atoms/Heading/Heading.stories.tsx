import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Heading, HeadingColor, HeadingVariant } from '.';

const meta: Meta<typeof Heading> = {
  title: 'Atom/Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component to render headings.',
      },
    },
  },
  args: {
    children: 'Sample heading',
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const Heading2: Story = {
  args: {
    variant: HeadingVariant.H2,
  },
};

export const Heading3: Story = {
  args: {
    variant: HeadingVariant.H3,
  },
};

export const Heading4: Story = {
  args: {
    variant: HeadingVariant.H4,
  },
};

export const Heading5: Story = {
  args: {
    variant: HeadingVariant.H5,
  },
};

export const Heading6: Story = {
  args: {
    variant: HeadingVariant.H6,
  },
};

export const Black: Story = {
  args: {
    color: HeadingColor.BLACK,
    variant: HeadingVariant.H2,
  },
};

export const Grey: Story = {
  args: {
    color: HeadingColor.GREY,
    variant: HeadingVariant.H2,
  },
};

export const Grey2: Story = {
  args: {
    color: HeadingColor.GREY2,
    variant: HeadingVariant.H2,
  },
};

export const Bold: Story = {
  args: {
    bold: true,
    variant: HeadingVariant.H2,
  },
};

export const Medium: Story = {
  args: {
    medium: true,
    variant: HeadingVariant.H2,
  },
};

export const Uppercase: Story = {
  args: {
    upperCase: true,
    variant: HeadingVariant.H2,
  },
};
