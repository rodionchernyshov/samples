import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutocompleteTags } from './index';

const meta: Meta<typeof AutocompleteTags> = {
  title: 'Molecule/AutocompleteTags',
  component: AutocompleteTags,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Autocomplete Tags',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ height: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AutocompleteTags>;

export const Default: Story = {
  args: {
    options: [{ name: 'Recaps' }, { name: 'Blog post builder' }],
    value: [{ name: 'Recaps' }],
  },
};
