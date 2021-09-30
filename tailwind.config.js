module.exports = {
  purge: ['./*.html', './*.js'],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        darker: ['Darker Grotesque'],
      },
      color: {
        black: '#000517',
        'primary-base': '#283069',
        'grey-secondary-light': '#F2F0F4',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
