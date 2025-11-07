export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  sqlQuery?: string;
  data?: any;
  error?: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  sqlQuery?: string;
  data?: any;
  timestamp: number;
  error?: string;
}

export interface QuickStats {
  totalIncidents: number;
  pendingIncidents: number;
  totalUsers: number;
  incidentsByType: Array<{
    incident_type: string;
    count: number;
  }>;
}
