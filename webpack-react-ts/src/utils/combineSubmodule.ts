export default function combineSubmodule(entry: string) {
  const mainConfig = import(`../config/${entry}.data.tsx`);
  return mainConfig;
}
