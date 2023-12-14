import React from "react";
import { Route } from "react-router-dom";

export const renderRoute = (route: IRoute) => {
  const { Component, path } = route;

  return <Route key={path} path={`${path}`} element={<Component />} />;
};

export interface IRawRoute {
  Component: React.FC;
  path: string;
}

export interface IRoute extends IRawRoute {
  needAuth: boolean;
}
