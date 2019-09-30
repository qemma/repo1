// @flow
export default function HistoryTitle(titleBase: string) {
  const routeState = window.history.state;
  return `${titleBase} ${routeState ? `${routeState.name}` : ''}`;
}
