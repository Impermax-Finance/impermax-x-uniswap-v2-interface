
// ray test touch <
import {
  Story,
  Meta
} from '@storybook/react';

import ButtonGroup from './';

const Template: Story = args => <ButtonGroup {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'ButtonGroup',
  component: ButtonGroup
} as Meta;
// ray test touch >
