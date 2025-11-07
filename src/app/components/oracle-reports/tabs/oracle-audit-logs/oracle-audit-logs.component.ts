import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuditLog } from "../../../../models/oracle-report.model";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-oracle-audit-logs",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./oracle-audit-logs.component.html",
  styleUrls: ["./oracle-audit-logs.component.scss"],
})
export class OracleAuditLogsComponent implements OnInit {
  loading = false;
  auditLogs: AuditLog[] = [];
  limit = 100;
  Array = Array; // Make Array available in template

  // Modal feedback
  showModal = false;
  modalType: "success" | "error" | "warning" = "success";
  modalTitle = "";
  modalMessage = "";

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.apiService.getAuditLogs(this.limit).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loading = false;
        this.showFeedbackModal(
          "success",
          "Logs Carregados",
          `${logs.length} registros de auditoria carregados com sucesso!`
        );
      },
      error: (error) => {
        console.error("Erro ao carregar audit logs:", error);
        this.loading = false;
        this.showFeedbackModal(
          "error",
          "Erro ao Carregar",
          `Erro ao carregar logs de auditoria: ${
            error.message || "Erro desconhecido"
          }`
        );
      },
    });
  }

  refresh(): void {
    this.loadAuditLogs();
  }

  getOperationClass(operation: string): string {
    switch (operation) {
      case "INSERT":
        return "badge bg-success";
      case "UPDATE":
        return "badge bg-warning text-dark";
      case "DELETE":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
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
}
