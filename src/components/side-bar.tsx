import {
  AlignJustify,
  BarChart3,
  CalendarCheck,
  DollarSign,
  House,
  ShoppingBasket,
  TrendingUp,
  Tv,
  UsersRound,
} from 'lucide-react'

import { LinkNavigation } from './link-navigation'

const routes = [
  {
    name: 'overview',
    path: '/',
    label: 'Início',
    icon: <House strokeWidth={1.5} />,
  },
  {
    name: 'channel-sales',
    path: '/channel-sales',
    label: 'Canais de Vendas',
    icon: <ShoppingBasket strokeWidth={1.5} />,
  },
  {
    name: 'colaboradores',
    path: '/colaboradores',
    label: 'Colaboradores',
    icon: <UsersRound strokeWidth={1.5} />,
  },
  {
    name: 'goal',
    path: '/goal',
    label: 'Metas',
    icon: <DollarSign strokeWidth={1.5} />,
  },
  {
    name: 'channels',
    path: '/channels',
    label: 'Canais',
    icon: <Tv strokeWidth={1.5} />,
  },
]

export function SideBar() {
  return (
    <aside className='flex flex-col border-r p-3'>
      {routes.map((route) => (
        <LinkNavigation
          key={route.name}
          icon={route.icon}
          label={route.label}
          name={route.name}
          path={route.path}
        />
      ))}
    </aside>
  )
}
