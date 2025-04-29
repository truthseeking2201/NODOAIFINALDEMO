import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityTabsContainer } from "@/components/vault/ActivityTabsContainer";

export default function ActivityDemo() {
  return (
    <PageContainer>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Activity Demo</h1>
        <div className="max-w-3xl mx-auto">
          <ActivityTabsContainer />
        </div>
      </div>
    </PageContainer>
  );
}
