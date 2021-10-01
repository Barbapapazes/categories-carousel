module.exports = {
  purge: ['./*.html', './*.js'],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        darker: ['Darker Grotesque'],
      },
      colors: {
        black: '#000517',
        grey: '#F7F7F7',
        'primary-base': '#283069',
        'grey-primary-light': '#686984',
        'grey-secondary-light': '#F2F0F4',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
