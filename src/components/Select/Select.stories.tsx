
// ray test touch <<
import {
  Story,
  Meta
} from '@storybook/react';

import Select from './';

const Template: Story = args => <Select {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Select',
  component: Select
} as Meta;
// ray test touch >>
