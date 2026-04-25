'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SessionData } from '@/types/session';

type stats = {
  totalMeal?: number;
  totalOrder?: number;
  totalEarning?: number;
  totalUser?: number;
  activeUser?: number;
};

type statsType = {
  session: SessionData | null;
  statsData: stats;
};

export default function Stats({ session, statsData }: statsType) {
  let data = [
    {
      name: 'Total Meals',
      stat: statsData.totalMeal,
      change: '-12.5%',
      changeType: 'negative',
    },

    {
      name: 'Total Orders',
      stat: statsData.totalOrder,
      change: '+1.8%',
      changeType: 'positive',
    },
    {
      name: 'Total earnings',
      stat: `$${statsData.totalEarning}`,
      change: '+19.7%',
      changeType: 'positive',
    },
    {
      name: 'Reports',
      stat: '1',
      change: '-2.4%',
      changeType: 'negative',
    },
  ];

  if (session?.user?.role === 'admin') {
    data = [
      {
        name: 'Total users',
        stat: statsData.totalUser,
        change: '-12.5%',
        changeType: 'negative',
      },
      {
        name: 'Active users',
        stat: statsData.activeUser,
        change: '-2.4%',
        changeType: 'negative',
      },
      {
        name: 'Total Orders',
        stat: statsData.totalOrder,
        change: '+1.8%',
        changeType: 'positive',
      },
      {
        name: 'Total earnings',
        stat: `$${statsData.totalEarning} `,
        change: '+19.7%',
        changeType: 'positive',
      },
    ];
  }

  return (
    <div className="flex items-center justify-center p-10 w-full">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {data.map((item) => (
          <Card key={item.name} className="p-6 py-4 shadow-2xs">
            <CardContent className="p-0">
              <dt className="text-sm font-medium text-muted-foreground">
                {item.name}
              </dt>
              <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="tabular-nums text-3xl font-semibold text-foreground">
                  {item.stat}
                </span>
                {/* <span
                  className={cn(
                    item.changeType === 'positive'
                      ? 'text-green-800 dark:text-green-400'
                      : 'text-red-800 dark:text-red-400',
                    'text-sm font-medium'
                  )}
                >
                  {item.change}
                </span> */}
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </div>
  );
}
