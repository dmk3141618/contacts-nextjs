import React from 'react';
import styled from 'styled-components';

const FooterWrap = styled.footer`
  height: 7rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FooterCopy = styled.div`
  font-size: 1.8rem;
`;

function Footer() {
  return (
    <FooterWrap>
      <FooterCopy>&copy; 2021 thewavelet all rights reserved</FooterCopy>
    </FooterWrap>
  );
}

export default React.memo(Footer);
