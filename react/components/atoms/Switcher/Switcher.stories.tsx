import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Switcher } from '.';

const meta: Meta<typeof Switcher> = {
  title: 'Atom/Switcher',
  component: Switcher,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switcher>;

export const Default: Story = {
  args: {
    id: 'size-10-unchecked',
    label: 'Size 10 unchecked',
  },
};

export const Disabled: Story = {
  args: {
    id: 'size-10-unchecked-disabled',
    label: 'Size 10 unchecked & disabled',
    disabled: true,
  },
};

export const Size10Checked: Story = {
  args: {
    id: 'size-10-checked',
    label: 'Size 10 checked',
    checked: true,
  },
};

export const Size20Unchecked: Story = {
  args: {
    id: 'size-20-unchecked',
    label: 'Size 20 unchecked',
    size: 20,
  },
};

export const Size20Checked: Story = {
  args: {
    id: 'size-20-checked',
    label: 'Size 20 checked',
    size: 20,
    checked: true,
  },
};

export const Size30Unchecked: Story = {
  args: {
    id: 'size-30-unchecked',
    label: 'Size 30 unchecked',
    size: 30,
  },
};

export const Size30Checked: Story = {
  args: {
    id: 'size-30-checked',
    label: 'Size 30 checked',
    size: 30,
    checked: true,
  },
};
