import React from 'react';
import { shallow } from 'enzyme';

import InputGroup from './index';

describe('InputGroup component', () => {
  it('should render properly default state', () => {
    let checkVal = '';
    const handleSearchCheck = (e: string) => {
      checkVal = e;
    };
    const wrapper = shallow(
      <InputGroup
        value={checkVal}
        handleChangeInput={e => handleSearchCheck(e.target.value)}
        id="custom-1"
        label="Input Label"
        placeholder="Placeholder"
      />,
    );
    wrapper
      .find('Input')
      .at(0)
      .dive()
      .childAt(0)
      .simulate('change', { target: { value: 'check' } });
    expect(checkVal === 'check');
    expect(wrapper.find('Label').at(0).prop('children')).toContain('Input Label');
    expect(wrapper.children()).toHaveLength(3);
  });
  it('should render properly as Required', () => {
    const wrapper = shallow(
      <InputGroup
        value=""
        handleChangeInput={() => {}}
        id="custom-1"
        label="Input Label"
        placeholder="Placeholder"
        required
      />,
    );
    expect(wrapper.find('Label').at(0).prop('required')).toEqual(true);
  });
  it('should render properly with Error Text and Helper Text', () => {
    const wrapper = shallow(
      <InputGroup
        value=""
        handleChangeInput={() => {}}
        id="custom-1"
        label="Input Label"
        placeholder="Placeholder"
        errorText="Error Text"
        helperText="Helper Text"
      />,
    );
    expect(wrapper.find('Label').at(0).prop('errorText')).toEqual('Error Text');
    expect(wrapper.childAt(2).prop('children')).toEqual('Helper Text');
  });
});
