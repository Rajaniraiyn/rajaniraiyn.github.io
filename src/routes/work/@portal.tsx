import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/work/@portal')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/work/@portal"!</div>
}
