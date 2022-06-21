import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'alert-triangle-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Content',
    icon: 'attach-outline',
    children: [
      {
        title: 'Tentang ISS',
        link: '/pages/tentang',
      },
      {
        title: 'Layanan',
        link: '/pages/layanan',
      },
      {
        title: 'Karyawan',
        link: '/pages/karyawan',
      },
      {
        title: 'Industri',
        link: '/pages/industri',
      },
      {
        title: 'Tanggung Jawab Perusahaan',
        link: '/pages/tanggungjawab',
      },
      {
        title: 'Karir',
        link: '/pages/karir',
      },
      {
        title: 'Pers',
        link: '/pages/pers',
      },
      {
        title: 'Kontak',
        link: '/pages/kontak',
      }
    ],
  },
  {
    title: 'Slider',
    icon: 'grid-outline',
    link: '/pages/slider',
  },
  {
    title: 'Setup',
    icon: 'settings-outline',
    link: '/pages/setup',
  },
  {
    title: 'Logout',
    icon: 'alert-circle-outline',
    link: '',
  }

];
