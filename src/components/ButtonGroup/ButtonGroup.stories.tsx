
import {
  Story,
  Meta
} from '@storybook/react';

import ButtonGroup, {
  JadeButtonGroupItem
} from './';

const Template: Story = args => <ButtonGroup {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <ButtonGroup>
      <JadeButtonGroupItem>
        Years
      </JadeButtonGroupItem>
      <JadeButtonGroupItem>
        Months
      </JadeButtonGroupItem>
      <JadeButtonGroupItem>
        Days
      </JadeButtonGroupItem>
    </ButtonGroup>
  )
};

export {
  Default
};

export default {
  title: 'ButtonGroup',
  component: ButtonGroup
} as Meta;
