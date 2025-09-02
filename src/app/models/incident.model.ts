export interface Incident {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  incidentType: IncidentType;
  status: IncidentStatus;
  userName: string;
  userEmail: string;
  userPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export enum IncidentType {
  THEFT = "THEFT",
  ASSAULT = "ASSAULT",
  VANDALISM = "VANDALISM",
  DRUG_ACTIVITY = "DRUG_ACTIVITY",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  TRAFFIC_ACCIDENT = "TRAFFIC_ACCIDENT",
  OTHER = "OTHER",
}

export enum IncidentStatus {
  PENDING = "PENDING",
  INVESTIGATING = "INVESTIGATING",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export interface DashboardStats {
  totalUsers: number;
  totalIncidents: number;
  totalNotifications: number;
  pendingIncidents: number;
  investigatingIncidents: number;
  resolvedIncidents: number;
  dismissedIncidents: number;
}
