import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectAppId, selectScreenId, selectVersionId } from '../services/appSlice';
import { useCopyScreenVersionMutation } from '../services/appsApi';
import { useSetDraftMutation } from '../services/screenLayoutApi';
import { createDesignerToCanvasMigration } from '../utils/migration';
import { getDesignerUrl } from '../services/urlServce';

interface RootState {
  session: {
    accountName: string;
    tokenRTC: string;
    tokenV2: string;
  };
}

interface CopyScreenVersionResponse {
  versionId: string;
}

interface DesignerControl {
  Type?: string;
  Id?: string;
  [key: string]: unknown;
}

interface DesignerPayload {
  Data: {
    screen: {
      versionId?: string;
      layout: {
        Content?: DesignerControl[];
      };
    };
  };
}

interface LayoutV4Payload {
  controls?: Record<string, Record<string, unknown>>;
  actionsUpserts?: Array<Record<string, unknown>>;
  ribbonConfiguration?: Record<string, unknown>;
  visualization?: Record<string, unknown>;
  screenProperties?: Record<string, unknown>;
  LayoutV4?: Record<string, Record<string, unknown>>;
  isV4Screen?: boolean;
}

interface UseMigrateScreenReturn {
  isMigrating: boolean;
  migrateScreen: () => Promise<boolean>;
}

/**
 * Custom hook for screen migration logic
 * Creates a new version of the screen and migrates layout positions
 *
 * @returns Migration state and handler
 */
export const useMigrateScreen = (): UseMigrateScreenReturn => {
  const appId = useSelector(selectAppId);
  const screenId = useSelector(selectScreenId);
  const versionId = useSelector(selectVersionId);
  const accountName = useSelector((state: RootState) => state.session.accountName);
  const tokenRTC = useSelector((state: RootState) => state.session.tokenRTC);
  const tokenV2 = useSelector((state: RootState) => state.session.tokenV2);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [copyScreenVersion] = useCopyScreenVersionMutation();
  const [setDraft] = useSetDraftMutation();
  const navigate = useNavigate();

  const migrateScreen = async (): Promise<boolean> => {
    if (!appId || !screenId || !versionId) {
      toast.error('Missing app, screen, or version ID');
      return false;
    }

    if (!accountName) {
      toast.error('Missing account name');
      return false;
    }

    setIsMigrating(true);

    try {
      // Step 1: Publish the current version before migration
      const publishResponse = await fetch(
        `${window.location.origin}/gateway/apps/manage/${accountName}/screen/${screenId}/version/${versionId}/status?status=1&clearDraftVersions=false&clearAll=true`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${tokenV2}`,
          },
        }
      );

      if (!publishResponse.ok) {
        throw new Error(`Failed to publish current version: ${publishResponse.statusText}`);
      }

      // Step 2: Create a copy of the current screen version
      const copyResponse = await copyScreenVersion({
        account: accountName,
        body: {
          DestinationScreenID: screenId,
          VersionID: versionId,
          LegacyResponse: false,
        },
      }).unwrap() as CopyScreenVersionResponse;

      const newVersionId = copyResponse.versionId;

      // Step 2: Fetch designer payload (old layout) from the NEW version
      const designerResponse = await fetch(
        `${getDesignerUrl()}api/v1/Designer/${appId}/${screenId}/${newVersionId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenRTC}`,
          },
        }
      );

      if (!designerResponse.ok) {
        throw new Error(`Failed to fetch designer payload: ${designerResponse.statusText}`);
      }

      const designerPayload = await designerResponse.json() as DesignerPayload;

      // Get versionId from designer payload
      const payloadVersionId = designerPayload.Data?.screen?.versionId || newVersionId;

      // Step 3: Fetch current layout v4 payload from the NEW version
      const layoutResponse = await fetch(
        `${getDesignerUrl()}api/v1/layout/${appId}/${screenId}/${newVersionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenRTC}`,
          },
        }
      );

      if (!layoutResponse.ok) {
        throw new Error(`Failed to fetch layout v4 payload: ${layoutResponse.statusText}`);
      }

      const layoutV4PayloadRaw = await layoutResponse.json() as LayoutV4Payload;

      // Step 4: Run the migration logic (modifies LayoutV4.content and sets isV4Screen flag)
      const migration = createDesignerToCanvasMigration();
      const migrationResult = migration.migrate(designerPayload, layoutV4PayloadRaw, payloadVersionId);

      if (!migrationResult.success) {
        throw new Error(`Migration failed: ${migrationResult.errors.join(', ')}`);
      }

      const migratedPayload = migrationResult.layoutV4Payload;

      // Step 5: Build the PUT body with ONLY the required fields
      // IMPORTANT: Controls need to be wrapped in versionId: { [versionId]: { ...controls } }
      const controlsWrapped = migratedPayload.controls
        ? { [payloadVersionId]: migratedPayload.controls }
        : {};

      const putBody = {
        layout: {},
        controls: controlsWrapped,
        actionsUpserts: migratedPayload.actionsUpserts || [],
        ribbonConfiguration: migratedPayload.ribbonConfiguration || {},
        visualization: migratedPayload.visualization || {},
        screenProperties: migratedPayload.screenProperties || {},
        LayoutV4: migratedPayload.LayoutV4 || {},
        isV4Screen: true,
      };

      // Step 6: Send the updated payload back to the server for the NEW version
      const putResponse = await fetch(
        `${getDesignerUrl()}api/v1/layout/${appId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${tokenRTC}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(putBody),
        }
      );

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        throw new Error(`Failed to update layout: ${putResponse.statusText} - ${errorText}`);
      }

      await putResponse.text();

      // Step 7: Set the new version as draft
      try {
        await setDraft({
          appId,
          screenId,
          versionId: newVersionId,
        }).unwrap();
      } catch {
        // Continue anyway - the version was created and migrated successfully
      }

      // Step 8: Set migration toast flag in localStorage and navigate
      localStorage.setItem('showMigrationToast', 'true');
      navigate(`/${appId}/layout/${screenId}/${newVersionId}`, { replace: true });
      window.location.reload();

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Migration failed: ${errorMessage}`);
      setIsMigrating(false);
      return false;
    }
  };

  return {
    isMigrating,
    migrateScreen,
  };
};
