// Table schema specific artifact
export interface TableSchemaField {
  caption: string;
  description: string;
  type: {
    type: number;
    typeName: string;
  };
  isRequired?: boolean;
  isUnique?: boolean;
  size?: number;
  justification?: string;
  businessPurpose?: string;
}

export interface TableSchemaRelationship {
  type: 'dropdown' | 'linked';
  fieldName: string;
  targetTable: string;
  targetField: string;
  description: string;
  reasoning: string;
}

export interface TableSchemaBusinessRule {
  field: string;
  rule: string;
  reasoning: string;
  type: 'validation' | 'automation' | 'constraint';
}

export interface TableSchemaDependency {
  tableName: string;
  exists: boolean;
  reason: string; // Why this table is a dependency
  fieldExists?: boolean; // Whether the target field exists in the dependency table
  suggestedFields?: string[]; // Alternative field names if target field doesn't exist
  fieldAnalysis?: string; // Detailed analysis of field availability
}

export interface TableSchemaImplementation {
  priority: 'high' | 'medium' | 'low';
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  dependencies: string[]; // Legacy - will be deprecated
  dependencyAnalysis: {
    existingTables: TableSchemaDependency[];
    missingTables: TableSchemaDependency[];
    totalDependencies: number;
  };
}

export interface TableSchemaConfirmation {
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TableSchemaContent {
  table: {
    name: string;
    description: string;
    purpose: string;
    businessContext: string;
  };
  fields: TableSchemaField[];
  relationships: TableSchemaRelationship[];
  businessRules: TableSchemaBusinessRule[];
  implementation: TableSchemaImplementation;
  confirmation: TableSchemaConfirmation;
  originalPrompt?: string;
  specDocument?: string;
}
