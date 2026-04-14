import { ScrollArea } from '@radix-ui/react-scroll-area';
import React from 'react';

interface CallSummaryProps {
  summary: string | undefined;
}

const CallSummary: React.FC<CallSummaryProps> = ({ summary }) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Call Summary</h2>
        <div className="rounded-lg bg-muted p-6 dark:bg-gray-800">
          <p className="text-md leading-relaxed text-foreground">
            {summary ? summary : 'No summary available'}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default CallSummary;
