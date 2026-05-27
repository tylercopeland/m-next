export interface SpecDocUserRole {
  name: string;
  description: string;
  permissions: string[];
}

export interface SpecDocWorkflowStep {
  order: number;
  action: string;
  actor: string;
  expectedOutcome: string;
  errorHandling?: string;
}

export interface SpecDocWorkflow {
  name: string;
  description: string;
  steps: string[]; // Simplified to string array for spec documents
  triggers: string[];
}

export interface SpecDocDataEntityField {
  fieldName: string;
  type: string;
  required?: boolean;
  description?: string;
  source?: 'existing' | 'new'; // Whether field exists or needs to be created
  mappedFrom?: string; // Original proposed field name if mapped
  // Dropdown-specific properties
  linkedTable?: string; // Table to link dropdown to (for dynamic dropdowns)
  linkedField?: string; // Field on linked table to display as dropdown value
  initialValues?: string[]; // Static dropdown values (for static dropdowns)
}

export interface SpecDocDataEntityRelationship {
  relationshipType: string;
  relatedTable: string;
}

export interface SpecDocDataEntity {
  tableName: string;
  description: string;
  fields: SpecDocDataEntityField[];
  relationships: SpecDocDataEntityRelationship[];
  source: 'existing' | 'recommended' | 'required' | 'new';
  mappedFrom?: string; // Original suggested table name if mapped
}

export interface SpecDocBusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: 'essential' | 'important' | 'helpful' | 'niceToHave';
}

export interface SpecDocScreenSummary {
  screenName: string;
  purpose: string;
  screenType: 'list' | 'record' | 'preference' | 'dashboard' | 'portal' | 'stock' | 'other';
  isStartingScreen?: boolean;
  primaryWorkflows: string[];
  hasDetailedSpec: boolean;
  stockAppName?: string; // Name of the Method stock app if screenType is 'stock'
  baseTable: string; // Base table name for the screen
  callToActions?: string[]; // The primary interactions on the screen
  controlsSummary?: string; // Brief summary of key controls on the screen
}

export interface SpecDocIntegration {
  system: string;
  purpose: string;
  dataFlow: 'inbound' | 'outbound' | 'bidirectional';
}

export interface SpecDocUISpecification {
  componentTypes: string[];
  responsiveRequirements: string;
  accessibilityLevel: string;
  primaryInteractionPattern: string;
}

export interface SpecDocStateManagement {
  localState: string[];
  sharedState: string[];
  cacheStrategy: string;
  syncRequirements: string;
}

export interface SpecDocValidationRule {
  field: string;
  ruleType: string;
  errorMessage: string;
  condition: string;
}

export interface SpecDocPerformanceTarget {
  metric: string;
  target: string;
  priority: 'must' | 'should' | 'nice-to-have';
}

export interface SpecDocSecurityRequirement {
  area: string;
  requirement: string;
  complianceStandard?: string;
}

export interface SpecDocAnalyticsRequirement {
  event: string;
  purpose: string;
  dataPoints: string[];
}

export interface SpecDocGenerationContext {
  userIntent: string;
  clarifyingQuestions: string[];
  llmModel: string;
  confidence: number;
}

export interface SpecDocMetadata {
  version: number;
  status: 'draft' | 'review' | 'approved' | 'implemented';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  title: string;
  sessionId: string;
  tags: string[];
  isInitialSchemaCreated?: boolean;
}

/**
 * Main spec document content structure
 */
export interface SpecDocumentContent {
  appName: string;
  appPurpose: string;
  appIcon: string;
  // Core specification
  userRoles: SpecDocUserRole[];
  keyWorkflows: SpecDocWorkflow[];
  dataEntities: SpecDocDataEntity[];
  businessRules: SpecDocBusinessRule[];
  screens: SpecDocScreenSummary[];
}

/**
 * Complete spec document with metadata
 */
export interface SpecDocument {
  _id: string; // MongoDB document ID
  appId: string;
  isActive: boolean;
  content: SpecDocumentContent;
  generationContext: SpecDocGenerationContext;
  metadata: SpecDocMetadata;
}
