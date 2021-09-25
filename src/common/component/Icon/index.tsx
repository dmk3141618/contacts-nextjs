import React from 'react';
import styled from 'styled-components';

import heartBlank from '~/assets/icons/heart-blank.png';
import heartFill from '~/assets/icons/heart-fill.png';

const icons = {
  heartBlank,
  heartFill,
};

export type IconsType = keyof typeof icons;

const StyledIcon = styled.img`
  width: 2.4rem;
  height: 2.4rem;
`;

interface IconProps {
  icon: IconsType;
}
type Props = React.ImgHTMLAttributes<HTMLImageElement> & IconProps;
function Icon({icon, ...rest}: Props) {
  return <StyledIcon src={icons[icon]} {...rest} />;
}

export default React.memo(Icon);
