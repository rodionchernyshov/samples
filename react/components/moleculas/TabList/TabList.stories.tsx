import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabList } from '.';

const meta: Meta<typeof TabList> = {
  title: 'Molecule/TabList',
  component: TabList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabList>;

export const Default: Story = {
  args: {
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: <div>Tab content here 1</div>,
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: <div>Tab content here 2</div>,
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: <div>Tab content here 3</div>,
      },
    ],
  },
};
