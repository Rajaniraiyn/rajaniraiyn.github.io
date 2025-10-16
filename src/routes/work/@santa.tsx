import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/work/@santa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/work/@santa"!</div>
}
