import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    customGreen: { // #2 on the complementary line grayish blue
      50: '#80A1C0',
      100: '#7197B9',
      200: '#638CB2',
      300: '#5582AB',
      400: '#4E779E',
      500: '#466C8F',
      600: '#426585',
      700: '#3D5D7B',
      800: '#385571',
      900: '#324D67',
      custom: '#466C8F',
    },
    customeExit: { // #5 on the complementary line dark grayish blue
      50: '#758899',
      100: '#687B8C',
      200: '#5C6D7D',
      300: '#51606E',
      400: '#46535E',
      500: '#3A454F',
      600: '#33404a',
      700: '#323B44',
      800: '#2E363E',
      900: '#2A3139',
      custom: '#3A454F'
    },
    customYellow: { // #1 on the complementary line yellow harvest gold
      50: '#e9f5f2',
      100: '#d4a758',
      200: '#d9ba7f',
      300: '#dfcea5',
      400: '#e4e1cc',
      500: '#CF9332',
      600: '#ab8432',
      700: '#877532',
      800: '#626531',
      900: '#1a4731',
      custom: '#CF9332'
    },
    anotherCustomYellow: { // #1 on the complementary line yellow harvest gold
      50: '#f7c26e',
      100: '#f5b856',
      200: '#f4ae3e',
      300: '#f2a426',
      400: '#f19a0e',
      500: '#DB8C0D',
      600: '#c17b0b',
      700: '#a96c0a',
      800: '#915c08',
      900: '#784d07',
      custom: '#DB8C0D'
    },

    customCoyote: { // #4 on the complementary line
      50: '#B5A07E',
      100: '#AD9570',
      200: '#987F57',
      300: '#987F57',
      400: '#89734F',
      500: '#7A6646',
      600: '#51442f' /* '#726042' */,
      700: '#51442f' /* '#69583D' */,
      800: '#51442f' /* '#615138' */,
      900: '#584A33',
      custom: '#7A6646'
    },
    successGreen: {
      500: '#54CF32',
      custom: '#54CF32'
    },
    errorRed: {
      500: '#CF3A32',
      custom: '#CF3232'
    },
  }
});