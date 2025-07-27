// part10/frontend/src/components/Subheading.jsx

import React from 'react';
import Text from './Text';

const Subheading = ({ style, color, ...props }) => (
  <Text
    style={style}
    fontSize="subheading"
    fontWeight="bold"
    color={color}
    {...props}
  />
);

export default Subheading;
