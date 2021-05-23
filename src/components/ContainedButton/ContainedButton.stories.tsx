
import {
  Story,
  Meta
} from '@storybook/react';

import ContainedButton from './';

const Template: Story = args => <ContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'ContainedButton',
  component: ContainedButton
} as Meta;
