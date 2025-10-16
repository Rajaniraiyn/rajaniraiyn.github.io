import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/work/@abacus')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/work/@abacus"!</div>
}
