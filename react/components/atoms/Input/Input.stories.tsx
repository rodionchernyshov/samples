import type { Meta, StoryObj } from '@storybook/react';
import Input from './index';

const meta: Meta<typeof Input> = {
  title: 'Atom/Input',
  component: Input,
  // 👇 Enables auto-generated documentation for the component story
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const General: Story = {
  args: {
    id: 'custom-id-1',
    placeholder: 'Placeholder (optional)',
    style: { width: '200px' },
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Custom Placeholder',
    value: 'Some value',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Custom Placeholder',
    value: 'I am disabled',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'Custom Placeholder',
    value: 'I am read only',
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Custom Placeholder',
    value: 'This is not valid value',
    error: true,
  },
};
