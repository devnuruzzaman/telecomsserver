export interface TechStackItem {
  name: string;
  category: string;
  description: string;
  iconName: string;
  role: string;
  configSnippet?: string;
  scalingStrategy: string;
}

export interface UserRole {
  name: string;
  description: string;
  permissions: string[];
  scope: string;
}

export interface DBColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DBIndex {
  name: string;
  columns: string;
  type: string;
  purpose: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: DBColumn[];
  indexes: DBIndex[];
  triggers?: string[];
  relationships: {
    fromColumn: string;
    toTable: string;
    toColumn: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-one';
  }[];
}

export interface FolderNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  description: string;
  blueprintContent?: string;
  children?: FolderNode[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'planned';
  description: string;
  technicalDetails: string[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  subtitle: string;
  status: 'completed' | 'in-progress' | 'planned';
  tasks: RoadmapTask[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody200?: string;
  responseBody400?: string;
}

export interface APIGroup {
  groupName: string;
  description: string;
  endpoints: APIEndpoint[];
}
