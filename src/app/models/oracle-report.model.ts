export interface OracleReport {
  reportType: string;
  data: any;
  metadata: {
    [key: string]: any;
  };
}

export interface SafetyIndicatorRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface IncidentCountRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
  incidentType?: string;
}

export interface DynamicQueryRequest {
  tableName: string;
  whereClause?: string;
  orderBy?: string;
  maxRows?: number;
}

export interface AggregateDataRequest {
  tableName: string;
  groupByColumn: string;
  aggregateFunction: string;
  aggregateColumn: string;
  whereClause?: string;
}

export interface CustomReportRequest {
  reportType: string;
  filterParams?: string;
}

export interface AuditLog {
  id: number;
  tableName: string;
  operationType: string;
  recordId: number;
  oldValues?: string;
  newValues?: string;
  userId?: number;
  username?: string;
  operationDate: string;
  additionalInfo?: string;
}

export interface TriggerInfo {
  name: string;
  description: string;
  type: string;
  status: "ENABLED" | "DISABLED";
  tableName?: string;
}

export interface AvailableReports {
  functions: {
    [key: string]: {
      description: string;
      endpoint: string;
      method: string;
    };
  };
  procedures: {
    [key: string]: {
      description: string;
      endpoint: string;
      method: string;
    };
  };
  triggers: {
    [key: string]: {
      description: string;
      status: string;
    };
  };
  dynamicSQL: {
    [key: string]: {
      description: string;
      endpoint: string;
      method: string;
    };
  };
}
