'use client';

import { Card } from 'shared-ui';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the dashboard with sidebar layout</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Card 1</h3>
          <p className="text-sm text-muted-foreground">
            This is a sample card to demonstrate the sidebar layout.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Card 2</h3>
          <p className="text-sm text-muted-foreground">
            The sidebar is collapsible on desktop and shows as a drawer on mobile.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Card 3</h3>
          <p className="text-sm text-muted-foreground">
            You can navigate using the sidebar menu items.
          </p>
        </Card>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Responsive sidebar layout</li>
          <li>Collapsible sidebar on desktop</li>
          <li>Mobile drawer sidebar</li>
          <li>Menu items with icons</li>
          <li>Collapsible menu groups</li>
          <li>Active route highlighting</li>
        </ul>
      </Card>
    </div>
  );
}
