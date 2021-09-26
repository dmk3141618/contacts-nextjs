import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const HeaderWrap = styled.header`
  padding-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
`;

const HeaderNavMenu = styled.ul`
  margin-left: 2rem;
  justify-self: stretch;
`;

const HeaderNavLi = styled.li`
  display: inline-block;
  margin-right: 1rem;
  padding: 1rem;
  cursor: pointer;
`;

const HeaderNavItem = styled.a`
  text-decoration: none;
  font-size: 2rem;
  color: ${props => props.theme.color.grayLight};
  &:hover {
    color: ${props => props.theme.color.hotPink} !important;
  }
  &.active {
    color: ${props => props.theme.color.deepPink};
  }
`;

export default function Header() {
  return (
    <HeaderWrap>
      <HeaderNavMenu>
        <HeaderNavLi>
          <Link href="/">
            <HeaderNavItem>Contacts</HeaderNavItem>
          </Link>
        </HeaderNavLi>
        <HeaderNavLi>
          <Link href="preview-components">
            <HeaderNavItem>Preview Components</HeaderNavItem>
          </Link>
        </HeaderNavLi>
        <HeaderNavLi>
          <Link href="about">
            <HeaderNavItem>About</HeaderNavItem>
          </Link>
        </HeaderNavLi>
      </HeaderNavMenu>
    </HeaderWrap>
  );
}
