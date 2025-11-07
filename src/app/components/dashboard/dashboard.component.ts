import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DashboardStats, Incident } from "../../models/incident.model";
import { LoginResponse, User } from "../../models/user.model";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex">
      <!-- Sidebar -->
      <nav class="sidebar" [class.show]="sidebarOpen">
        <div class="p-3">
          <div class="d-flex align-items-center mb-4">
            <i class="fas fa-shield-alt fa-2x me-3"></i>
            <h4 class="mb-0">SafeCity</h4>
          </div>

          <ul class="nav flex-column">
            <li class="nav-item">
              <a
                class="nav-link"
                [class.active]="activeTab === 'overview'"
                [attr.aria-current]="activeTab === 'overview' ? 'page' : null"
                (click)="setActiveTab('overview')"
              >
                <i class="fas fa-tachometer-alt me-2"></i>
                Visão Geral
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                [class.active]="activeTab === 'incidents'"
                [attr.aria-current]="activeTab === 'incidents' ? 'page' : null"
                (click)="setActiveTab('incidents')"
              >
                <i class="fas fa-exclamation-triangle me-2"></i>
                Incidentes
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                [class.active]="activeTab === 'users'"
                [attr.aria-current]="activeTab === 'users' ? 'page' : null"
                (click)="setActiveTab('users')"
              >
                <i class="fas fa-users me-2"></i>
                Usuários
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" routerLink="/oracle-reports">
                <i class="fas fa-database me-2"></i>
                Relatórios Oracle
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" routerLink="/chatbot-db">
                <i class="fas fa-robot me-2"></i>
                ChatBot DB
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-grow-1">
        <!-- Header -->
        <header class="bg-white shadow-sm border-bottom p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <button class="btn btn-link d-md-none" (click)="toggleSidebar()">
                <i class="fas fa-bars"></i>
              </button>
              <h2 class="mb-0 ms-2">Dashboard SafeCity</h2>
            </div>
            <div class="d-flex align-items-center">
              <span class="me-3">Olá, {{ currentUser?.name }}</span>
              <button class="btn btn-outline-primary" (click)="logout()">
                <i class="fas fa-sign-out-alt me-1"></i>
                Sair
              </button>
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="main-content">
          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando dados...</p>
          </div>

          <!-- Overview Tab -->
          <div *ngIf="activeTab === 'overview' && !loading">
            <!-- Stats Cards -->
            <div class="row mb-4">
              <div class="col-md-3 mb-3">
                <div class="card stat-card">
                  <div class="card-body text-center">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <h3>{{ stats?.totalUsers || 0 }}</h3>
                    <p class="mb-0">Total de Usuários</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card stat-card warning">
                  <div class="card-body text-center">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <h3>{{ stats?.totalIncidents || 0 }}</h3>
                    <p class="mb-0">Total de Incidentes</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card stat-card info">
                  <div class="card-body text-center">
                    <i class="fas fa-clock fa-2x mb-2"></i>
                    <h3>{{ stats?.pendingIncidents || 0 }}</h3>
                    <p class="mb-0">Pendentes</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card stat-card success">
                  <div class="card-body text-center">
                    <i class="fas fa-bell fa-2x mb-2"></i>
                    <h3>{{ stats?.totalNotifications || 0 }}</h3>
                    <p class="mb-0">Notificações</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Row -->
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Status dos Incidentes</h5>
                  </div>
                  <div class="card-body">
                    <div class="row text-center">
                      <div class="col-6 mb-3">
                        <div class="p-3 bg-warning bg-opacity-10 rounded">
                          <h4 class="text-warning">
                            {{ stats?.pendingIncidents || 0 }}
                          </h4>
                          <small>Pendentes</small>
                        </div>
                      </div>
                      <div class="col-6 mb-3">
                        <div class="p-3 bg-info bg-opacity-10 rounded">
                          <h4 class="text-info">
                            {{ stats?.investigatingIncidents || 0 }}
                          </h4>
                          <small>Investigando</small>
                        </div>
                      </div>
                      <div class="col-6 mb-3">
                        <div class="p-3 bg-success bg-opacity-10 rounded">
                          <h4 class="text-success">
                            {{ stats?.resolvedIncidents || 0 }}
                          </h4>
                          <small>Resolvidos</small>
                        </div>
                      </div>
                      <div class="col-6 mb-3">
                        <div class="p-3 bg-danger bg-opacity-10 rounded">
                          <h4 class="text-danger">
                            {{ stats?.dismissedIncidents || 0 }}
                          </h4>
                          <small>Descartados</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Incidentes Recentes</h5>
                  </div>
                  <div class="card-body">
                    <div
                      *ngFor="let incident of recentIncidents.slice(0, 5)"
                      class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                    >
                      <div>
                        <h6 class="mb-1">{{ incident.title }}</h6>
                        <small class="text-muted">{{
                          incident.createdAt | date : "short"
                        }}</small>
                      </div>
                      <span
                        class="badge"
                        [ngClass]="getStatusBadgeClass(incident.status)"
                      >
                        {{ getStatusLabel(incident.status) }}
                      </span>
                    </div>
                    <div
                      *ngIf="recentIncidents.length === 0"
                      class="text-center text-muted py-3"
                    >
                      Nenhum incidente encontrado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Incidents Tab -->
          <div *ngIf="activeTab === 'incidents' && !loading">
            <div class="card">
              <div
                class="card-header d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">Gerenciar Incidentes</h5>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    [class.active]="incidentFilter === 'all'"
                    (click)="filterIncidents('all')"
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-warning btn-sm"
                    [class.active]="incidentFilter === 'PENDING'"
                    (click)="filterIncidents('PENDING')"
                  >
                    Pendentes
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-info btn-sm"
                    [class.active]="incidentFilter === 'INVESTIGATING'"
                    (click)="filterIncidents('INVESTIGATING')"
                  >
                    Investigando
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success btn-sm"
                    [class.active]="incidentFilter === 'RESOLVED'"
                    (click)="filterIncidents('RESOLVED')"
                  >
                    Resolvidos
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Usuário</th>
                        <th>Localização</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let incident of filteredIncidents">
                        <td>
                          <strong>{{ incident.title }}</strong>
                          <br />
                          <small class="text-muted"
                            >{{
                              incident.description | slice : 0 : 50
                            }}...</small
                          >
                        </td>
                        <td>{{ incident.userName }}</td>
                        <td>
                          <small>
                            {{
                              incident.address ||
                                incident.latitude + ", " + incident.longitude
                            }}
                          </small>
                        </td>
                        <td>
                          <span
                            class="badge"
                            [ngClass]="getStatusBadgeClass(incident.status)"
                          >
                            {{ getStatusLabel(incident.status) }}
                          </span>
                        </td>
                        <td>{{ incident.createdAt | date : "short" }}</td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button
                              class="btn btn-outline-info"
                              *ngIf="incident.status === 'PENDING'"
                              (click)="
                                updateIncidentStatus(
                                  incident.id,
                                  'INVESTIGATING'
                                )
                              "
                            >
                              Investigar
                            </button>
                            <button
                              class="btn btn-outline-success"
                              *ngIf="incident.status === 'INVESTIGATING'"
                              (click)="
                                updateIncidentStatus(incident.id, 'RESOLVED')
                              "
                            >
                              Resolver
                            </button>
                            <button
                              class="btn btn-outline-danger"
                              *ngIf="incident.status !== 'DISMISSED'"
                              (click)="
                                updateIncidentStatus(incident.id, 'DISMISSED')
                              "
                            >
                              Descartar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  *ngIf="filteredIncidents.length === 0"
                  class="text-center text-muted py-4"
                >
                  Nenhum incidente encontrado
                </div>
              </div>
            </div>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users' && !loading">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Usuários Cadastrados</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Data de Cadastro</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone || "-" }}</td>
                        <td>
                          <span
                            class="badge"
                            [ngClass]="
                              user.role === 'ADMIN'
                                ? 'bg-primary'
                                : 'bg-secondary'
                            "
                          >
                            {{
                              user.role === "ADMIN"
                                ? "Administrador"
                                : "Usuário"
                            }}
                          </span>
                        </td>
                        <td>
                          <span
                            class="badge"
                            [ngClass]="
                              user.enabled ? 'bg-success' : 'bg-danger'
                            "
                          >
                            {{ user.enabled ? "Ativo" : "Inativo" }}
                          </span>
                        </td>
                        <td>{{ user.createdAt | date : "short" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  *ngIf="users.length === 0"
                  class="text-center text-muted py-4"
                >
                  Nenhum usuário encontrado
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  stats: DashboardStats | null = null;
  recentIncidents: Incident[] = [];
  allIncidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  users: User[] = [];
  loading = true;
  activeTab = "overview";
  incidentFilter = "all";
  sidebarOpen = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    Promise.all([
      this.apiService.getDashboardStats().toPromise(),
      this.apiService.getRecentIncidents().toPromise(),
      this.apiService.getAllIncidents().toPromise(),
      this.apiService.getAllUsers().toPromise(),
    ])
      .then(([stats, recentIncidents, allIncidents, users]) => {
        this.stats = stats || null;
        this.recentIncidents = recentIncidents || [];
        this.allIncidents = allIncidents || [];
        this.filteredIncidents = this.allIncidents;
        this.users = users || [];
        this.loading = false;
      })
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
        this.loading = false;
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.sidebarOpen = false; // Close sidebar on mobile
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  filterIncidents(filter: string): void {
    this.incidentFilter = filter;
    if (filter === "all") {
      this.filteredIncidents = this.allIncidents;
    } else {
      this.filteredIncidents = this.allIncidents.filter(
        (incident) => incident.status === filter
      );
    }
  }

  updateIncidentStatus(incidentId: string, status: string): void {
    this.apiService.updateIncidentStatus(incidentId, status).subscribe({
      next: (updatedIncident) => {
        // Update the incident in the arrays
        const index = this.allIncidents.findIndex((i) => i.id === incidentId);
        if (index !== -1) {
          this.allIncidents[index] = updatedIncident;
        }

        const recentIndex = this.recentIncidents.findIndex(
          (i) => i.id === incidentId
        );
        if (recentIndex !== -1) {
          this.recentIncidents[recentIndex] = updatedIncident;
        }

        // Refresh filtered incidents
        this.filterIncidents(this.incidentFilter);

        // Reload stats
        this.apiService.getDashboardStats().subscribe((stats) => {
          this.stats = stats;
        });
      },
      error: (error) => {
        console.error("Error updating incident status:", error);
        alert("Erro ao atualizar status do incidente");
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: "Pendente",
      INVESTIGATING: "Investigando",
      RESOLVED: "Resolvido",
      DISMISSED: "Descartado",
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      PENDING: "bg-warning",
      INVESTIGATING: "bg-info",
      RESOLVED: "bg-success",
      DISMISSED: "bg-danger",
    };
    return classes[status] || "bg-secondary";
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
