import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityTabs } from "./ActivityTabs";

export function ActivityTabsContainer() {
  return (
    <Card className="activity-panel border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityTabs />
      </CardContent>
    </Card>
  );
}
