'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';
import { ErrorBoundary } from '@/components/error-boundary';

/**
 * Component that throws an error for testing ErrorBoundary
 */
function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate ErrorBoundary!');
  }

  return (
    <Button onClick={() => setShouldThrow(true)} variant="destructive">
      Throw Error
    </Button>
  );
}

/**
 * Example component to test ErrorBoundary
 */
export function ErrorBoundaryTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Boundary Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the button below to trigger an error and see the ErrorBoundary in action.
        </p>
        <ErrorBoundary>
          <BuggyComponent />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}
