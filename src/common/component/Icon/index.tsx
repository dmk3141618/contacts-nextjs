import React from 'react';
import Image, {ImageProps} from 'next/image';
import styled from 'styled-components';

import heartBlank from '~/assets/icons/heart-blank.png';
import heartFill from '~/assets/icons/heart-fill.png';

const icons = {
  heartBlank,
  heartFill,
};

export type IconsType = keyof typeof icons;

// const StyledIcon = styled.img`
//   width: 2.4rem;
//   height: 2.4rem;
// `;
const StyledIcon = styled(Image)`
  //width: 2.4rem;
  //height: 2.4rem;
`;

interface IconProps {
  icon: IconsType;
}
// type Props = React.ImgHTMLAttributes<HTMLImageElement> & IconProps;
type Props = Omit<ImageProps, 'src'> & IconProps;
function Icon({icon, width = 24, height = 24, ...rest}: Props) {
  return <StyledIcon {...rest} src={icons[icon]} width={width} height={height} />;
}

export default React.memo(Icon);
