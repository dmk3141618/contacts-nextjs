import React from 'react';
import Header from '~/common/component/Header';
import Footer from '~/common/component/Footer';

type Props = {
  children: React.ReactNode;
};
export default function AppLayout({children}: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
