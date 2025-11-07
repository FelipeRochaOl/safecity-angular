import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatRequest, ChatResponse, QuickStats } from "../models/chatbot.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ChatBotService {
  private readonly API_URL = "http://localhost:8080/api/chatbot";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    });
  }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API_URL}/chat`, request, {
      headers: this.getHeaders(),
    });
  }

  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.API_URL}/stats`, {
      headers: this.getHeaders(),
    });
  }

  healthCheck(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/health`, {
      headers: this.getHeaders(),
    });
  }
}
