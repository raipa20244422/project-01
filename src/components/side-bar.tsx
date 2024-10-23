import {
  AlignJustify,
  BarChart3,
  CalendarCheck,
  DollarSign,
  House,
  ShoppingBasket,
  TrendingUp,
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
    name: 'investimentos',
    path: '/investimentos',
    label: 'Investimentos',
    icon: <DollarSign strokeWidth={1.5} />,
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
