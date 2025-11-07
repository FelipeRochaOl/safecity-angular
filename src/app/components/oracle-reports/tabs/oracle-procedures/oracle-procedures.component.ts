import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OracleReport } from "../../../../models/oracle-report.model";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-oracle-procedures",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./oracle-procedures.component.html",
  styleUrls: ["./oracle-procedures.component.scss"],
})
export class OracleProceduresComponent {
  loading = false;
  executingReport = false;
  currentReport: OracleReport | null = null;
  daysThreshold = 30;
  Array = Array; // Make Array available in template

  // Modal feedback
  showModal = false;
  modalType: "success" | "error" | "warning" = "success";
  modalTitle = "";
  modalMessage = "";

  constructor(private apiService: ApiService) {}

  executeProcedure(procedureName: string): void {
    console.log("Executando procedure:", procedureName);
    this.executingReport = true;
    this.currentReport = null;

    switch (procedureName) {
      case "UPDATE_OLD_INCIDENTS":
        this.executeUpdateOldIncidents();
        break;
      case "GENERATE_AGGREGATED_REPORT":
        this.executeGenerateAggregatedReport();
        break;
      case "CLEANUP_OLD_AUDIT_LOGS":
        this.executeCleanupOldAuditLogs();
        break;
      default:
        console.error("Procedure não reconhecida:", procedureName);
        this.executingReport = false;
    }
  }

  private executeUpdateOldIncidents(): void {
    console.log(
      "Chamando API updateOldIncidents com days:",
      this.daysThreshold
    );
    this.apiService.updateOldIncidents(this.daysThreshold).subscribe({
      next: (report) => {
        console.log("Resposta recebida:", report);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Procedure executada com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar procedure:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar procedure: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  private executeGenerateAggregatedReport(): void {
    console.log("Chamando API generateAggregatedReport");
    this.apiService.generateAggregatedReport().subscribe({
      next: (report) => {
        console.log("Resposta recebida:", report);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Relatório agregado gerado com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar procedure:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar procedure: ${
            error.error?.message || error.message || "Erro desconhecido"
          }`
        );
        this.executingReport = false;
      },
    });
  }

  private executeCleanupOldAuditLogs(): void {
    console.log(
      "Chamando API cleanupOldAuditLogs com days:",
      this.daysThreshold
    );
    this.apiService.cleanupOldAuditLogs(this.daysThreshold).subscribe({
      next: (report) => {
        console.log("Resposta recebida:", report);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Sucesso!",
          "Logs de auditoria limpos com sucesso!"
        );
      },
      error: (error) => {
        console.error("Erro ao executar procedure:", error);
        this.showFeedbackModal(
          "error",
          "Erro!",
          `Falha ao executar procedure: ${
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
