module.exports = {
  mode: 'jit',
  content: [
    /* 현재 프로젝트의 특정 경로의 하위 모든 폴더,
     ** 특정 확장자의 모든 파일에서
     ** Tailwind 를 사용한 걸 찾아낸다. */
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'media', //class
  plugins: [require('@tailwindcss/typography')],
};
