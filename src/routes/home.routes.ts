import logoSrc from '@/assets/foodie_logo_white_text.svg';
export const logo = {
  url: '/',
  src: logoSrc,
  alt: 'logo',
  title: 'Foodie',
};
export const menu = [
  { title: 'Home', url: '/' },
  {
    title: 'Restaurants',
    url: 'restaurants',
  },
  {
    title: 'Meals',
    url: 'meals',
  },
  {
    title: 'My Orders',
    url: 'orders',
  },
];
export const auth = {
  login: { title: 'Login', url: 'login' },
  signup: { title: 'Sign up', url: 'sign-up' },
};
