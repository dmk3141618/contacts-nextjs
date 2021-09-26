import React, {ReactElement} from 'react';
import AppLayout from '~/common/component/AppLayout';

function About() {
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default About;
