import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FileBox } from '.';

const meta: Meta<typeof FileBox> = {
  title: 'Molecule/FileBox',
  component: FileBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Component to show a file box',
      },
    },
  },
};

const sampleFilePayload = {
  entityName: 'Sample file name',
  entityType: 'txt',
  entityMetaInfo: '1.2 MB | txt',
};

export default meta;
type Story = StoryObj<typeof FileBox>;

const decorator = Story => (
  <div style={{ width: '35%' }}>
    <Story />
  </div>
);

export const Default: Story = {
  args: {
    ...sampleFilePayload,
  },
  decorators: [decorator],
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  decorators: [decorator],
};

export const Analyzing: Story = {
  args: {
    status: 'queued',
    ...sampleFilePayload,
  },
  decorators: [decorator],
};

export const Error: Story = {
  args: {
    status: 'error',
    ...sampleFilePayload,
  },
  decorators: [decorator],
};
