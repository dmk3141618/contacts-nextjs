import React from 'react';
import styled, {css, DefaultTheme} from 'styled-components';
import {darken, lighten} from 'polished';

interface ColorStylesType {
  color?: keyof DefaultTheme['color'];
  outline?: boolean;
}
const colorStyles = css<ColorStylesType>`
  ${({theme, color, outline}) => {
    const selected = color ? theme.color[color] : theme.color.prettyBlue;
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
      ${outline &&
      css`
        color: ${selected};
        background: none;
        border: 1px solid ${selected};
        &:hover {
          background: ${selected};
          color: white;
        }
      `}
    `;
  }}
`;

interface SizeType {
  height: string;
  fontSize: string;
}
interface SizesType {
  large: SizeType;
  medium: SizeType;
  small: SizeType;
}
const sizes: SizesType = {
  large: {
    height: '3rem',
    fontSize: '1.25rem',
  },
  medium: {
    height: '2.25rem',
    fontSize: '1rem',
  },
  small: {
    height: '1.75rem',
    fontSize: '0.875rem',
  },
};
interface SizeStylesType {
  size?: keyof SizesType;
}
const sizeStyles = css<SizeStylesType>`
  ${({size}) => css`
    height: ${size ? sizes[size].height : sizes.medium.height};
    font-size: ${size ? sizes[size].fontSize : sizes.medium.fontSize};
  `}
`;

interface FullWidthStyleType {
  fullWidth?: boolean;
}
const fullWidthStyle = css<FullWidthStyleType>`
  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
      justify-content: center;
    `}
`;

type StyledButtonType = ColorStylesType & SizeStylesType & FullWidthStyleType;
const StyledButton = styled.button<StyledButtonType>`
  /* common style */
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  ${colorStyles}
  ${sizeStyles}
  ${fullWidthStyle}
`;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & StyledButtonType;
function Button({children, color, size, outline, fullWidth, ...rest}: Props) {
  return (
    <StyledButton color={color} size={size} outline={outline} fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}

export default React.memo(Button);
