import React from "react";
import combineSubmodule from "../utils/combineSubmodule";
const data = combineSubmodule("Index");
export function Index() {
  return <h1>Page</h1>;
}
Index.defaultProps = data;
export default Index;
