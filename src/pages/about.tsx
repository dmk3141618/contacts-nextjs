import React, {ReactElement} from 'react';
import AppLayout from '~/common/component/AppLayout';
import {wrapper} from '~/common/store';
import {GetServerSideProps, GetStaticProps} from 'next';

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

// getStaticPaths 는 getStaticProps 와 함께 사용된다.
// 이와 같이 user/[id] 로 요청된 context.params.id 부분은 getStaticProps 를 사용할 경우
// getStaticPaths 로 해당 id 를 미리 넣어주어야 html 페이지들로 ssr 해놓는다.
// getServerSideProps 사용시에는 필요없다.
// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//       { params: { id: '4' } },
//     ],
//     fallback: true, // 위에 id 없는 페이지는 오류가 나는데
//   };
// }

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(store => async context => {
  console.log('getStaticProps on About page');
  return {props: {}};
});

export default About;
