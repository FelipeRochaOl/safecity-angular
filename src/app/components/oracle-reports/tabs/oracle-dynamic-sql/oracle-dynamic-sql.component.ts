import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OracleReport } from "../../../../models/oracle-report.model";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-oracle-dynamic-sql",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./oracle-dynamic-sql.component.html",
  styleUrls: ["./oracle-dynamic-sql.component.scss"],
})
export class OracleDynamicSqlComponent {
  executingReport = false;
  currentReport: OracleReport | null = null;
  Array = Array; // Make Array available in template

  // Modal feedback
  showModal = false;
  modalType: "success" | "error" | "warning" = "success";
  modalTitle = "";
  modalMessage = "";

  searchType = "";
  searchStatus = "";
  aggregateField = "type";
  customReportType = "incidents_by_type";

  constructor(private apiService: ApiService) {}

  executeDynamicSearch(): void {
    console.log(
      "Executando busca dinâmica com type:",
      this.searchType,
      "status:",
      this.searchStatus
    );
    this.executingReport = true;
    this.currentReport = null;

    this.apiService
      .dynamicIncidentSearch(this.searchType, this.searchStatus)
      .subscribe({
        next: (report) => {
          console.log("Resposta busca dinâmica:", report);
          console.log("Data:", report.data);
          console.log("Data é array?", Array.isArray(report.data));
          console.log(
            "Data length:",
            Array.isArray(report.data) ? report.data.length : "N/A"
          );
          this.currentReport = report;
          this.executingReport = false;
          const recordCount = Array.isArray(report.data)
            ? report.data.length
            : 0;
          this.showFeedbackModal(
            "success",
            "Busca Concluída",
            `Busca dinâmica executada com sucesso! ${recordCount} registros encontrados.`
          );
        },
        error: (error) => {
          console.error("Erro ao executar busca:", error);
          this.executingReport = false;
          this.showFeedbackModal(
            "error",
            "Erro na Busca",
            `Erro ao executar busca dinâmica: ${
              error.message || "Erro desconhecido"
            }`
          );
        },
      });
  }

  executeDynamicAggregate(): void {
    console.log("Executando agregação com field:", this.aggregateField);
    this.executingReport = true;
    this.currentReport = null;

    this.apiService.dynamicAggregateData(this.aggregateField).subscribe({
      next: (report) => {
        console.log("Resposta agregação:", report);
        console.log("Data:", report.data);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Agregação Concluída",
          `Dados agregados por ${this.aggregateField} gerados com sucesso!`
        );
      },
      error: (error) => {
        console.error("Erro ao executar agregação:", error);
        this.executingReport = false;
        this.showFeedbackModal(
          "error",
          "Erro na Agregação",
          `Erro ao agregar dados: ${error.message || "Erro desconhecido"}`
        );
      },
    });
  }

  executeCustomReport(): void {
    console.log("Gerando relatório customizado tipo:", this.customReportType);
    this.executingReport = true;
    this.currentReport = null;

    this.apiService.generateCustomReport(this.customReportType).subscribe({
      next: (report) => {
        console.log("Resposta relatório customizado:", report);
        console.log("Data:", report.data);
        this.currentReport = report;
        this.executingReport = false;
        this.showFeedbackModal(
          "success",
          "Relatório Gerado",
          `Relatório customizado "${this.customReportType}" gerado com sucesso!`
        );
      },
      error: (error) => {
        console.error("Erro ao gerar relatório:", error);
        this.executingReport = false;
        this.showFeedbackModal(
          "error",
          "Erro no Relatório",
          `Erro ao gerar relatório customizado: ${
            error.message || "Erro desconhecido"
          }`
        );
      },
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
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
