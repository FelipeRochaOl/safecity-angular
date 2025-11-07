import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { LoginResponse } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { OracleAuditLogsComponent } from "./tabs/oracle-audit-logs/oracle-audit-logs.component";
import { OracleDynamicSqlComponent } from "./tabs/oracle-dynamic-sql/oracle-dynamic-sql.component";
import { OracleFunctionsComponent } from "./tabs/oracle-functions/oracle-functions.component";
import { OracleProceduresComponent } from "./tabs/oracle-procedures/oracle-procedures.component";
import { OracleTriggersComponent } from "./tabs/oracle-triggers/oracle-triggers.component";

@Component({
  selector: "app-oracle-reports",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    OracleAuditLogsComponent,
    OracleDynamicSqlComponent,
    OracleFunctionsComponent,
    OracleProceduresComponent,
    OracleTriggersComponent,
  ],
  templateUrl: "./oracle-reports.component.html",
  styleUrls: ["./oracle-reports.component.scss"],
})
export class OracleReportsComponent implements OnInit {
  activeTab: string = "procedures";
  currentUser: LoginResponse | null = null;
  sidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  goToDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }
}
