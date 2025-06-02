import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ErrorBoundary } from "react-error-boundary";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <>
            <AgentsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense
                    fallback={
                        <LoadingState
                            title="Loading agents"
                            description="This may take a few seconds..."
                        />
                    }
                >
                    <ErrorBoundary
                        fallback={
                            <ErrorState
                                title="Failed to load agents"
                                description="Please try again later"
                            />
                        }
                    >
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default Page;
