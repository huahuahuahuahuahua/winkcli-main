import React from "react";
import DataContext from "./dataContext";
export default function withData(Component: React.ComponentType<unknown>) {
  return function DataComponent(props: object) {
    return (
      <DataContext.Consumer>
        {(data) => <Component {...data} {...props} />}
      </DataContext.Consumer>
    );
  };
}
