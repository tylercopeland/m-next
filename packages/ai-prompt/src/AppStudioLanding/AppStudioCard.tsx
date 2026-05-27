import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import Pill from '@m-next/pill';
import { Card, CardIconWrapper, CardContent, CardTitle, CardSubtitle, CardContentTop } from './AppStudioLanding.styles';

export type AppCardStatus = 'planning' | 'draft' | 'published';

export interface AppCardProps {
  appName: string;
  updatedAt: string;
  updatedBy?: string;
  status: AppCardStatus;
  onClick?: () => void;
}

const PILL_STATUS_COLOR: Record<AppCardStatus, string> = {
  planning: 'blue',
  draft: 'orange',
  published: 'green',
};

export function AppStudioCard({ appName, updatedAt, updatedBy, status, onClick }: AppCardProps) {
  return (
    <Card onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardIconWrapper>
        <SvgIcon name='screen-V4' size={24} />
      </CardIconWrapper>
      <CardContent>
        <CardContentTop>
          <CardTitle>{appName}</CardTitle>
          <Pill
            style={{ textTransform: 'capitalize', marginTop: '2px' }}
            size='narrow'
            colorScheme={PILL_STATUS_COLOR[status] || 'v4-blue'}
            leadIcon={status !== 'published' ? { name: 'dot', size: 8 } : undefined}
          >
            {status}
          </Pill>
        </CardContentTop>

        <CardSubtitle>
          Updated{' '}
          {new Date(updatedAt).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
          {updatedBy ? ` by ${updatedBy}` : ''}
        </CardSubtitle>
      </CardContent>
    </Card>
  );
}
