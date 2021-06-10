
// ray test touch <
import {
  Story,
  Meta
} from '@storybook/react';

import DefaultOutlinedButton, { Props } from './';

const Template: Story<Props> = args => <DefaultOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'DefaultOutlinedButton'
};

export {
  Default
};

export default {
  title: 'DefaultOutlinedButton',
  component: DefaultOutlinedButton
} as Meta;
// ray test touch >
