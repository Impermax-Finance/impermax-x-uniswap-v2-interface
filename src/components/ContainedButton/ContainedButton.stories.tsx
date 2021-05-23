
import {
  Story,
  Meta
} from '@storybook/react';

import ContainedButton, { Props } from './';

const Template: Story<Props> = args => <ContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ContainedButton'
};

export {
  Default
};

export default {
  title: 'ContainedButton',
  component: ContainedButton
} as Meta;
