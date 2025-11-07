import { Routes } from "@angular/router";
import { ChatBotComponent } from "./components/chatbot/chatbot.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { OracleReportsComponent } from "./components/oracle-reports/oracle-reports.component";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "oracle-reports",
    component: OracleReportsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "chatbot-db",
    component: ChatBotComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/login" },
];
