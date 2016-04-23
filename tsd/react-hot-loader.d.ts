declare function require(dependency: string): any;
declare const module;

declare module 'react-hot-loader' {
  import React = __React

  type Component = React.ReactType
  type RouteComponent = Component
  
  interface AppContainer extends React.Props<AppContainer> {
    component: Component
    props?: any
  }
  interface AppContainer extends React.ComponentClass<AppContainer> {}
  const AppContainer: AppContainer
}