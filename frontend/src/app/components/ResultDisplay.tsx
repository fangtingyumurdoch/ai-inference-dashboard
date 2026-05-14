import { Card } from '@/app/components/ui/card';

type PivasResult = 'PIVAS0' | 'PIVAS1' | 'PIVAS2';

interface PivasResultCardProps {
  result: PivasResult | null; // null 
}

export function PivasResultCard({ result }: PivasResultCardProps) {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Result</div>
          <div className="mt-1 text-2xl font-semibold">
            {result ?? '—'}
          </div>
        </div>

        {result ? (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {result}
          </span>
        ) : (
          <span className="rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-400">
            Pending
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Output is restricted to: PIVAS0, PIVAS1, or PIVAS2.
      </p>
    </Card>
  );
}
