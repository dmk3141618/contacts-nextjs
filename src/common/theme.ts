import {DefaultTheme} from 'styled-components';

export const theme: DefaultTheme = {
  color: {
    romanticPink: '#ffbfd3', // rgba(255,191,211,1)
    deepPink: '#ff1493', // deeppink
    hotPink: '#ff69b4', // hotpink
    lightPink: '#ffe4e1', // mistyrose
    romanticBlue: '#9dadff', // rgba(157,173,255,1)
    deepBlue: '#00bfff', // deepskyblue
    skyBlue: '#87ceeb', // skyblue
    lightBlue: '#87cefa', // lightskyblue
    prettyRed: '#ff0074',
    prettyPink: '#e96d8b',
    prettyBlue: '#0055ff',
    prettyGreen: '#6ad4ce',
    prettyViolet: '#9f8cf5',
    grayBlack: '#000000',
    grayDeep: '#525252',
    grayDark: '#696969',
    grayBase: '#808080',
    grayLight: '#aeaeae',
    graySponged: '#c5c5c5',
    grayWhite: '#ffffff',
    dirtyBackground: '#f0f0f0',
    facebook: '#3b5998',
    google: '#d34836',
    apple: '#aeaeae',
    naver: '#45c537',
    kakao: '#fecc2f',
    error: '#f44336',
    accent: '#ffc107',
    accentLight: '#ffd54f',
  },
  media: {
    // keep media style order: ${media.desktop} {} => ${media.tablet} {} => ${media.phone} {}
    desktop: '@media screen and (max-width: 922px)',
    tablet: '@media screen and (max-width: 768px)',
    phone: '@media screen and (max-width: 576px)',
  },
};
