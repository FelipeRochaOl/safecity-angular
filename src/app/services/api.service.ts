import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardStats, Incident } from "../models/incident.model";
import {
  AuditLog,
  AvailableReports,
  OracleReport,
  SafetyIndicatorRequest,
  TriggerInfo,
} from "../models/oracle-report.model";
import { User } from "../models/user.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly API_URL = "http://localhost:8080/api";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log("Token disponível:", token ? "Sim" : "Não");
    console.log(
      "Token (primeiros 20 chars):",
      token ? token.substring(0, 20) + "..." : "null"
    );
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    });
  }

  // Dashboard endpoints
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`, {
      headers: this.getHeaders(),
    });
  }

  getRecentIncidents(limit: number = 10): Observable<Incident[]> {
    return this.http.get<Incident[]>(
      `${this.API_URL}/dashboard/incidents/recent?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getIncidentsByStatus(status: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(
      `${this.API_URL}/dashboard/incidents/by-status?status=${status}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/dashboard/users`, {
      headers: this.getHeaders(),
    });
  }

  // Incident management
  updateIncidentStatus(
    incidentId: string,
    status: string
  ): Observable<Incident> {
    return this.http.put<Incident>(
      `${this.API_URL}/incidents/${incidentId}/status?status=${status}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.API_URL}/incidents`, {
      headers: this.getHeaders(),
    });
  }

  // Oracle Reports endpoints
  getAvailableReports(): Observable<AvailableReports> {
    return this.http.get<AvailableReports>(
      `${this.API_URL}/oracle-reports/available-reports`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  calculateSafetyIndicator(
    request: SafetyIndicatorRequest
  ): Observable<OracleReport> {
    return this.http.post<OracleReport>(
      `${this.API_URL}/oracle-reports/safety-indicator`,
      request,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getUserIncidentsSummary(userId: number): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/user-incidents-summary/${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  generateAutomaticAlerts(): Observable<OracleReport> {
    return this.http.post<OracleReport>(
      `${this.API_URL}/oracle-reports/generate-alerts`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  generateUserActivityReport(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Observable<OracleReport> {
    let url = `${this.API_URL}/oracle-reports/user-activity-report/${userId}`;
    const params: string[] = [];

    if (startDate) {
      params.push(`startDate=${encodeURIComponent(startDate)}`);
    }
    if (endDate) {
      params.push(`endDate=${encodeURIComponent(endDate)}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return this.http.get<OracleReport>(url, {
      headers: this.getHeaders(),
    });
  }

  // Oracle Functions
  countIncidentsByType(type: string): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/functions/count-by-type?type=${type}`,
      { headers: this.getHeaders() }
    );
  }

  calculateAreaRisk(area: string): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/functions/area-risk?area=${area}`,
      { headers: this.getHeaders() }
    );
  }

  getResolutionTimeAvg(): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/functions/resolution-time-avg`,
      { headers: this.getHeaders() }
    );
  }

  checkHighRiskArea(area: string): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/functions/high-risk-area?area=${area}`,
      { headers: this.getHeaders() }
    );
  }

  // Oracle Procedures
  updateOldIncidents(days: number): Observable<OracleReport> {
    return this.http.post<OracleReport>(
      `${this.API_URL}/oracle-reports/procedures/update-old-incidents?days=${days}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  generateAggregatedReport(): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/procedures/aggregated-report`,
      { headers: this.getHeaders() }
    );
  }

  cleanupOldAuditLogs(days: number): Observable<OracleReport> {
    return this.http.post<OracleReport>(
      `${this.API_URL}/oracle-reports/procedures/cleanup-audit-logs?days=${days}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Oracle Dynamic SQL
  dynamicIncidentSearch(
    type?: string,
    status?: string
  ): Observable<OracleReport> {
    const params: string[] = [];
    if (type) params.push(`type=${type}`);
    if (status) params.push(`status=${status}`);
    const queryString = params.length > 0 ? `?${params.join("&")}` : "";

    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/dynamic-sql/search${queryString}`,
      { headers: this.getHeaders() }
    );
  }

  dynamicAggregateData(field: string): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/dynamic-sql/aggregate?field=${field}`,
      { headers: this.getHeaders() }
    );
  }

  generateCustomReport(reportType: string): Observable<OracleReport> {
    return this.http.get<OracleReport>(
      `${this.API_URL}/oracle-reports/dynamic-sql/custom-report?type=${reportType}`,
      { headers: this.getHeaders() }
    );
  }

  // Oracle Triggers
  getTriggers(): Observable<TriggerInfo[]> {
    return this.http.get<TriggerInfo[]>(
      `${this.API_URL}/oracle-reports/triggers`,
      { headers: this.getHeaders() }
    );
  }

  // Oracle Audit Logs
  getAuditLogs(limit: number = 100): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(
      `${this.API_URL}/oracle-reports/audit-logs?limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }
}
