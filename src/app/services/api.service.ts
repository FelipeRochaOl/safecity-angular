import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardStats, Incident } from "../models/incident.model";
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
}
