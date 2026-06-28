import { Link } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail
} from './ui/sidebar'

export interface SidebarItemDefinition {
  label: string
  to: string
  condition?: boolean
  isActive?: boolean
}

export interface SidebarGroupDefinition {
  label: string
  condition?: boolean
  items: SidebarItemDefinition[]
}

export type SidebarMenuDefinition =
  | SidebarItemDefinition[]
  | SidebarGroupDefinition[]

export interface AppLayoutProps extends ComponentProps<typeof Sidebar> {
  children?: ReactNode
  sidebarHeader?: ReactNode
  sidebarMenu?: SidebarMenuDefinition
}

export function SidebarLayout({ children, ...props }: AppLayoutProps = {}) {
  return (
    <SidebarProvider>
      <AppSidebar {...props} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

const SidebarMenuItemComponent = ({
  label,
  to,
  condition,
  isActive
}: SidebarItemDefinition) =>
  condition !== false ? (
    <SidebarMenuItem key={label}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={to}>{label}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ) : null

const SidebarMenuGroupComponent = ({
  label,
  condition,
  items
}: SidebarGroupDefinition) =>
  condition !== false ? (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItemComponent key={item.label} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ) : null

function AppSidebar({
  sidebarHeader,
  sidebarMenu = [],
  ...props
}: Omit<AppLayoutProps, 'children'>) {
  return (
    <Sidebar {...props}>
      {sidebarHeader && <SidebarHeader>{sidebarHeader}</SidebarHeader>}
      <SidebarContent>
        {hasGroups(sidebarMenu)
          ? sidebarMenu.map((group) => (
              <SidebarMenuGroupComponent key={group.label} {...group} />
            ))
          : sidebarMenu.map((item) => (
              <SidebarMenuItemComponent key={item.label} {...item} />
            ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function hasGroups(
  menu: SidebarItemDefinition[] | SidebarGroupDefinition[]
): menu is SidebarGroupDefinition[] {
  return (
    menu.length > 0 && (menu[0] as SidebarGroupDefinition).items !== undefined
  )
}
