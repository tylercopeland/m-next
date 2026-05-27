import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import type { SyncWidgetControl } from '@m-next/runtime-interface';
import { useDesignerContext } from '../contexts/DesignerContext';
import { useRuntimeContext } from '../contexts/RuntimeContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SyncWidget = React.lazy(
  () => import('@m-next/sync-widget') as unknown as Promise<{ default: React.ComponentType<any> }>,
);

export interface SyncWidgetWrapperProps {
  id: string;
  control?: SyncWidgetControl;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
}

type SyncWidgetInfoResponse = {
  syncWidgetStatus?: number;
  syncWidgetInfo?: string;
};

const toSyncWidgetStatus = (statusNumber: number | null, statusStringCandidate?: string): 0 | 1 | 2 | 3 | 5 => {
  if (typeof statusNumber === 'number' && !Number.isNaN(statusNumber)) {
    if (statusNumber === 0 || statusNumber === 1 || statusNumber === 2 || statusNumber === 3 || statusNumber === 5) {
      return statusNumber;
    }
  }

  if (typeof statusStringCandidate === 'string') {
    const normalized = statusStringCandidate.trim().toLowerCase();
    if (normalized === 'syncing') return 1;
    if (normalized === 'error') return 2;
  }

  return 0;
};

const coerceStatusNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized.length === 0) return null;
    const asNumber = Number(normalized);
    if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
      return asNumber;
    }
  }

  return null;
};

const getStatusAndMessage = (
  control: SyncWidgetControl | undefined,
): { status: 0 | 1 | 2 | 3 | 5; message?: string } => {
  const statusCandidate =
    coerceStatusNumber((control as unknown as Record<string, unknown> | undefined)?.status) ??
    coerceStatusNumber((control as unknown as Record<string, unknown> | undefined)?.syncWidgetStatus) ??
    coerceStatusNumber((control as unknown as Record<string, unknown> | undefined)?.syncStatus) ??
    coerceStatusNumber((control as unknown as Record<string, unknown> | undefined)?.value) ??
    coerceStatusNumber((control as unknown as Record<string, unknown> | undefined)?.defaultValue);

  const statusStringCandidate =
    (typeof (control as unknown as Record<string, unknown> | undefined)?.syncStatus === 'string' &&
      ((control as unknown as Record<string, unknown>).syncStatus as string)) ||
    (typeof (control as unknown as Record<string, unknown> | undefined)?.status === 'string' &&
      ((control as unknown as Record<string, unknown>).status as string)) ||
    (typeof (control as unknown as Record<string, unknown> | undefined)?.value === 'string' &&
      ((control as unknown as Record<string, unknown>).value as string)) ||
    undefined;

  const messageCandidate =
    (typeof (control as unknown as Record<string, unknown> | undefined)?.message === 'string' &&
      ((control as unknown as Record<string, unknown>).message as string)) ||
    (typeof (control as unknown as Record<string, unknown> | undefined)?.syncMessage === 'string' &&
      ((control as unknown as Record<string, unknown>).syncMessage as string)) ||
    (typeof (control as unknown as Record<string, unknown> | undefined)?.value === 'string' &&
      ((control as unknown as Record<string, unknown>).value as string)) ||
    (typeof (control as unknown as Record<string, unknown> | undefined)?.defaultValue === 'string' &&
      ((control as unknown as Record<string, unknown>).defaultValue as string)) ||
    undefined;

  return {
    status: toSyncWidgetStatus(statusCandidate, statusStringCandidate),
    message: messageCandidate,
  };
};

const SyncWidgetWrapperRedux: React.FC<SyncWidgetWrapperProps> = ({
  id,
  control: controlProp,
  mode = 'designer',
  onControlClick,
}) => {
  const designerContext = useDesignerContext();
  const runtimeContext = useRuntimeContext();
  const isRuntimeMode = mode === 'runtime' || runtimeContext?.mode === 'runtime' || !!controlProp;

  const [syncWidgetResponse, setSyncWidgetResponse] = useState<SyncWidgetInfoResponse | null>(null);

  const control = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? (designerContext.selectControlById(id) as SyncWidgetControl | undefined)
      : undefined;

  if (!control && mode === 'designer') return null;

  const isSyncWidgetRestrictedApplicationType =
    runtimeContext?.applicationType === 'Public' ||
    runtimeContext?.applicationType === 'EmailGadget' ||
    runtimeContext?.applicationType === 'Portal';

  const runtimeActiveRecordId = runtimeContext?.activeRecordId ?? null;
  const runtimeViewFriendlyName = runtimeContext?.viewFriendlyName ?? null;

  const canFetchSyncWidgetStatus =
    mode === 'runtime' &&
    !!runtimeContext?.store?.dispatch &&
    !!runtimeActiveRecordId &&
    !!runtimeViewFriendlyName &&
    !runtimeContext?.isMobile &&
    !isSyncWidgetRestrictedApplicationType;

  useEffect(() => {
    if (!canFetchSyncWidgetStatus) return;

    const dispatch = runtimeContext?.store?.dispatch;
    if (!dispatch) return;

    let didCancel = false;

    dispatch({
      type: 'MICROSERVICE_API',
      microserviceApi: {
        endpoint: `syncutil/syncwidget/{account}/GetSyncWidgetInfoAsync?viewNameFriendly=${encodeURIComponent(
          String(runtimeViewFriendlyName),
        )}&activeRecordID=${encodeURIComponent(String(runtimeActiveRecordId))}`,
        method: 'GET',
        success: (response: { data?: SyncWidgetInfoResponse } | undefined) => {
          if (!didCancel) {
            setSyncWidgetResponse(response?.data ?? null);
          }
          return { type: 'LOADED_SYNC_WIDGET_STATUS', payload: null };
        },
        failure: () => {
          // Sync widget must be non-blocking, so avoid surfacing an error.
          if (!didCancel) {
            setSyncWidgetResponse(null);
          }
          return { type: 'LOADED_SYNC_WIDGET_STATUS', payload: null };
        },
      },
    });

    return () => {
      didCancel = true;
    };
  }, [
    canFetchSyncWidgetStatus,
    runtimeContext?.store,
    runtimeActiveRecordId,
    runtimeViewFriendlyName,
    runtimeContext?.isMobile,
    runtimeContext?.applicationType,
  ]);

  const runtimeStatusAndMessage = useMemo(() => {
    if (mode !== 'runtime') return null;

    const statusCandidate = coerceStatusNumber(syncWidgetResponse?.syncWidgetStatus);
    const status = typeof statusCandidate === 'number' ? toSyncWidgetStatus(statusCandidate) : undefined;
    const message =
      typeof syncWidgetResponse?.syncWidgetInfo === 'string' ? syncWidgetResponse.syncWidgetInfo : undefined;

    return { status, message };
  }, [mode, syncWidgetResponse?.syncWidgetStatus, syncWidgetResponse?.syncWidgetInfo]);

  const shouldHideDueToResponse = mode === 'runtime' && coerceStatusNumber(syncWidgetResponse?.syncWidgetStatus) === 4;
  const hasValidResponse =
    mode === 'runtime' &&
    runtimeStatusAndMessage?.status !== undefined &&
    coerceStatusNumber(syncWidgetResponse?.syncWidgetStatus) !== 4;

  const dispatchSyncWidgetInteraction = useCallback(
    (interactionType: string, analyticsData: Record<string, unknown>) => {
      if (!runtimeContext?.processAnalytics) return;
      runtimeContext.processAnalytics(`Sync Widget ${interactionType}`, {
        ...analyticsData,
        screenId: runtimeContext.screenId,
        recordId: runtimeContext.activeRecordId,
        viewFriendlyName: runtimeContext.viewFriendlyName,
      });
    },
    [runtimeContext],
  );

  if (mode === 'runtime' && runtimeContext && (runtimeContext.isMobile || isSyncWidgetRestrictedApplicationType)) {
    return null;
  }

  if (shouldHideDueToResponse) {
    return null;
  }

  const controlStatusAndMessage = getStatusAndMessage(control);

  const { status, message } =
    mode === 'runtime'
      ? hasValidResponse
        ? { status: runtimeStatusAndMessage!.status!, message: runtimeStatusAndMessage!.message }
        : control
          ? controlStatusAndMessage
          : { status: 0 as const, message: undefined }
      : controlStatusAndMessage;

  if (mode === 'runtime' && !hasValidResponse && !control) {
    // Avoid displaying a misleading static state in runtime if we have neither
    // a valid API response nor a runtime control payload.
    return null;
  }

  // The sync widget includes its own outer padding; for designer canvas use,
  // remove that padding so the pill matches its intended size.
  const compactCss =
    mode === 'designer'
      ? `
    [data-sync-widget-wrapper="true"] .sync-widget { padding: 0 !important; }
  `.trim()
      : '';

  const effectiveMessage =
    typeof message === 'string' && message.trim().length > 0
      ? message
      : mode === 'designer'
        ? 'Sync details'
        : undefined;

  return (
    <div
      data-sync-widget-wrapper='true'
      style={{
        width: '100%',
        height: '100%',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
      onClick={() => onControlClick?.(id)}
      role='presentation'
    >
      {compactCss ? <style>{compactCss}</style> : null}
      <Suspense fallback={<LoadingSkeleton count={1} height={28} />}>
        <SyncWidget
          status={status}
          message={effectiveMessage}
          fnSyncWidgetInteractionAnalytics={mode === 'runtime' ? dispatchSyncWidgetInteraction : undefined}
          popupWidth={mode === 'runtime' ? 360 : undefined}
          popupMaxWidth={mode === 'runtime' ? 'calc(100vw - 32px)' : undefined}
        />
      </Suspense>
    </div>
  );
};

export default SyncWidgetWrapperRedux;
