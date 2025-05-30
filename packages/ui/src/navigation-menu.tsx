import * as React from 'react'
import * as NavigationPrimitive from '@radix-ui/react-navigation-menu'
import { cn } from './utils'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationPrimitive.Root>
>(({ className, ...props }, ref) => (
  <NavigationPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    {...props}
  />
))
NavigationMenu.displayName = NavigationPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationPrimitive.List.displayName

const NavigationMenuItem = NavigationPrimitive.Item

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
      className,
    )}
    {...props}
  >
    {children}
  </NavigationPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationPrimitive.Content
    ref={ref}
    className={cn(
      'data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in data-[motion=to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=from-start]:slide-in-from-left-4 data-[motion=from-end]:slide-in-from-right-4 data-[motion=to-start]:slide-out-to-left-4 data-[motion=to-end]:slide-out-to-right-4  absolute top-0 left-0 w-full sm:w-auto',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationPrimitive.Content.displayName

const NavigationMenuLink = NavigationPrimitive.Link

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} 