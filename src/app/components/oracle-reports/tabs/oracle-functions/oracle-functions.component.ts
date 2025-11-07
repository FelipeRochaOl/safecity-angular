import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  OracleReport,
  SafetyIndicatorRequest,
} from "../../../../models/oracle-report.model";
import { User } from "../../../../models/user.model";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-oracle-functions",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./oracle-functions.component.html",
  styleUrls: ["./oracle-functions.component.scss"],
})
export class OracleFunctionsComponent implements OnInit {
  loading = false;
  executingReport = false;
  currentReport: OracleReport | null = null;
  Array = Array; // Make Array available in template

  // Modal feedback
  showModal = false;
  modalType: "success" | "error" | "warning" = "success";
  modalTitle = "";
  modalMessage = "";

  safetyRequest: SafetyIndicatorRequest = {
    latitude: -23.561684,
    longitude: -46.625378,
    radiusKm: 5,
  };

  selectedUserId = "";
  users: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar usuários:", error);
        this.loading = false;
      },
    });
  }

  executeFunction(functionName: string): void {
    this.executingReport = true;
    this.currentReport = null;

    switch (functionName) {
      case "COUNT_INCIDENTS_BY_TYPE":
        this.executeCountIncidentsByType();
        break;
      case "CALCULATE_AREA_RISK":
        this.executeCalculateAreaRisk();
        break;
      case "GET_RESOLUTION_TIME_AVG":
        this.executeGetResolutionTimeAvg();
        break;
      case "CHECK_HIGH_RISK_AREA":
        this.executeCheckHighRiskArea();
        break;
    }
  }

  private executeCountIncidentsByType(): void {
    console.log("Executando função COUNT_INCIDENTS_BY_TYPE com type=ROUBO");
    this.apiService.countIncidentsByType("ROUBO").subscribe({
      next: (report) => {
        console.log("Resposta COUNT_INCIDENTS_BY_TYPE:", report);
        console.log("Data:", report.data);
        console.log("Data é array?", Array.isArray(report.data));
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Função executada com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar função:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar função: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  private executeCalculateAreaRisk(): void {
    console.log("Executando função CALCULATE_AREA_RISK com area=Centro");
    this.apiService.calculateAreaRisk("Centro").subscribe({
      next: (report) => {
        console.log("Resposta CALCULATE_AREA_RISK:", report);
        console.log("Data:", report.data);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Função executada com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar função:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar função: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  private executeGetResolutionTimeAvg(): void {
    console.log("Executando função GET_RESOLUTION_TIME_AVG");
    this.apiService.getResolutionTimeAvg().subscribe({
      next: (report) => {
        console.log("Resposta GET_RESOLUTION_TIME_AVG:", report);
        console.log("Data:", report.data);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Função executada com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar função:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar função: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  private executeCheckHighRiskArea(): void {
    console.log("Executando função CHECK_HIGH_RISK_AREA com area=Centro");
    this.apiService.checkHighRiskArea("Centro").subscribe({
      next: (report) => {
        console.log("Resposta CHECK_HIGH_RISK_AREA:", report);
        console.log("Data:", report.data);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Função executada com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar função:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar função: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  showFeedbackModal(
    type: "success" | "error" | "warning",
    title: string,
    message: string
  ): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
