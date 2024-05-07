/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TosImport } from './routes/tos'
import { Route as HomeImport } from './routes/_home'

// Create Virtual Routes

const RegisterLazyImport = createFileRoute('/register')()
const IndexLazyImport = createFileRoute('/')()
const PetsUuidLazyImport = createFileRoute('/pets/$uuid')()
const HomeProfileLazyImport = createFileRoute('/_home/profile')()
const HomeHomeLazyImport = createFileRoute('/_home/home')()
const HomePetsIndexLazyImport = createFileRoute('/_home/pets/')()
const HomePetsCreateLazyImport = createFileRoute('/_home/pets/create')()

// Create/Update Routes

const RegisterLazyRoute = RegisterLazyImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/register.lazy').then((d) => d.Route))

const TosRoute = TosImport.update({
  path: '/tos',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  id: '/_home',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PetsUuidLazyRoute = PetsUuidLazyImport.update({
  path: '/pets/$uuid',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/pets.$uuid.lazy').then((d) => d.Route))

const HomeProfileLazyRoute = HomeProfileLazyImport.update({
  path: '/profile',
  getParentRoute: () => HomeRoute,
} as any).lazy(() => import('./routes/_home/profile.lazy').then((d) => d.Route))

const HomeHomeLazyRoute = HomeHomeLazyImport.update({
  path: '/home',
  getParentRoute: () => HomeRoute,
} as any).lazy(() => import('./routes/_home/home.lazy').then((d) => d.Route))

const HomePetsIndexLazyRoute = HomePetsIndexLazyImport.update({
  path: '/pets/',
  getParentRoute: () => HomeRoute,
} as any).lazy(() =>
  import('./routes/_home/pets.index.lazy').then((d) => d.Route),
)

const HomePetsCreateLazyRoute = HomePetsCreateLazyImport.update({
  path: '/pets/create',
  getParentRoute: () => HomeRoute,
} as any).lazy(() =>
  import('./routes/_home/pets.create.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/_home': {
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/tos': {
      preLoaderRoute: typeof TosImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      preLoaderRoute: typeof RegisterLazyImport
      parentRoute: typeof rootRoute
    }
    '/_home/home': {
      preLoaderRoute: typeof HomeHomeLazyImport
      parentRoute: typeof HomeImport
    }
    '/_home/profile': {
      preLoaderRoute: typeof HomeProfileLazyImport
      parentRoute: typeof HomeImport
    }
    '/pets/$uuid': {
      preLoaderRoute: typeof PetsUuidLazyImport
      parentRoute: typeof rootRoute
    }
    '/_home/pets/create': {
      preLoaderRoute: typeof HomePetsCreateLazyImport
      parentRoute: typeof HomeImport
    }
    '/_home/pets/': {
      preLoaderRoute: typeof HomePetsIndexLazyImport
      parentRoute: typeof HomeImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  HomeRoute.addChildren([
    HomeHomeLazyRoute,
    HomeProfileLazyRoute,
    HomePetsCreateLazyRoute,
    HomePetsIndexLazyRoute,
  ]),
  TosRoute,
  RegisterLazyRoute,
  PetsUuidLazyRoute,
])

/* prettier-ignore-end */
