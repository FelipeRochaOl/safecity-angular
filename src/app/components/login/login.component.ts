import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-4">
          <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
          <h2 class="fw-bold">SafeCity Dashboard</h2>
          <p class="text-muted">Faça login para acessar o painel administrativo</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              name="email"
              [(ngModel)]="credentials.email" 
              required 
              email
              #email="ngModel">
            <div *ngIf="email.invalid && email.touched" class="text-danger small mt-1">
              Email é obrigatório e deve ser válido
            </div>
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password" 
              required
              #password="ngModel">
            <div *ngIf="password.invalid && password.touched" class="text-danger small mt-1">
              Senha é obrigatória
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100" 
            [disabled]="loginForm.invalid || loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        
        <div class="mt-4 text-center">
          <small class="text-muted">
            <strong>Credenciais de teste:</strong><br>
            Email: admin@safecity.com<br>
            Senha: password
          </small>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        console.error('Login error:', error);
      }
    });
  }
}

