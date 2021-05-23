
import {
  Story,
  Meta
} from '@storybook/react';

import JadeContainedButton, { Props } from './';

const Template: Story<Props> = args => <JadeContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'JadeContainedButton'
};

export {
  Default
};

export default {
  title: 'JadeContainedButton',
  component: JadeContainedButton
} as Meta;
