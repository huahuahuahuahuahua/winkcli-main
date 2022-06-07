import React from "react";
import ReactDOM from "react-dom";
import DataContext from "../utils/dataContext";
import withData from "../utils/withData";
import App from "../pages/Index";
const DataApp = withData(App);

function render(data: object = {}) {
  const element: JSX.Element = (
    <DataContext.Provider value={data}>
      <DataApp></DataApp>
    </DataContext.Provider>
  );
  return element;
}

ReactDOM.render(render(), document.getElementById("root"));
