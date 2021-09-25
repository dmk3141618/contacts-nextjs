import React from 'react';
import {render, screen} from '@testing-library/react';
import Footer from '~/common/component/Footer';

describe('render Header', () => {
  it('should render', () => {
    render(<Footer />);
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
