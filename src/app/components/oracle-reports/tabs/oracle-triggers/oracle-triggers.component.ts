import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TriggerInfo } from "../../../../models/oracle-report.model";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-oracle-triggers",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./oracle-triggers.component.html",
  styleUrls: ["./oracle-triggers.component.scss"],
})
export class OracleTriggersComponent implements OnInit {
  loading = false;
  triggers: TriggerInfo[] = [];

  // Modal feedback
  showModal = false;
  modalType: "success" | "error" | "warning" = "success";
  modalTitle = "";
  modalMessage = "";

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTriggers();
  }

  loadTriggers(): void {
    this.loading = true;
    this.apiService.getTriggers().subscribe({
      next: (triggers) => {
        this.triggers = triggers;
        this.loading = false;
        this.showFeedbackModal(
          "success",
          "Triggers Carregados",
          `${triggers.length} triggers Oracle carregados com sucesso!`
        );
      },
      error: (error) => {
        console.error("Erro ao carregar triggers:", error);
        this.showFeedbackModal(
          "error",
          "Erro ao Carregar",
          `Erro ao carregar triggers: ${error.message || "Erro desconhecido"}`
        );
        // Fallback with hardcoded triggers
        this.triggers = [
          {
            name: "TRG_INCIDENTS_LAST_UPDATED",
            description:
              "Atualiza automaticamente o campo last_updated quando um incidente é modificado",
            type: "BEFORE UPDATE",
            tableName: "INCIDENTS",
            status: "ENABLED",
          },
          {
            name: "TRG_PREVENT_DELETE_RESOLVED",
            description:
              "Previne a exclusão de incidentes que já foram resolvidos",
            type: "BEFORE DELETE",
            tableName: "INCIDENTS",
            status: "ENABLED",
          },
          {
            name: "TRG_LOG_INCIDENT_CHANGES",
            description:
              "Registra todas as mudanças em incidentes para auditoria",
            type: "AFTER INSERT OR UPDATE OR DELETE",
            tableName: "INCIDENTS",
            status: "ENABLED",
          },
          {
            name: "TRG_AUTO_ASSIGN_PRIORITY",
            description:
              "Atribui automaticamente uma prioridade baseada na severidade do incidente",
            type: "BEFORE INSERT",
            tableName: "INCIDENTS",
            status: "ENABLED",
          },
          {
            name: "TRG_VALIDATE_STATUS_TRANSITION",
            description:
              "Valida se a transição de status do incidente é permitida",
            type: "BEFORE UPDATE",
            tableName: "INCIDENTS",
            status: "ENABLED",
          },
        ];
        this.loading = false;
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
}
