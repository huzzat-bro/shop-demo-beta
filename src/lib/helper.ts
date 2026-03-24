import { useRouterState } from "@tanstack/react-router";

export function useCurrentPath() {
    return useRouterState({
        select(state) {
            return state.location
        },
    })
}