import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ChatMessage, QuickStats } from "../../models/chatbot.model";
import { AuthService } from "../../services/auth.service";
import { ChatBotService } from "../../services/chatbot.service";

@Component({
  selector: "app-chatbot",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.scss"],
})
export class ChatBotComponent implements OnInit {
  @ViewChild("messagesContainer") private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = "";
  isLoading: boolean = false;
  isTyping: boolean = false;
  quickStats: QuickStats | null = null;
  showWelcome: boolean = true;

  suggestedQuestions: string[] = [
    "Quantos incidentes foram reportados hoje?",
    "Quais são as áreas de maior risco?",
    "Mostre os incidentes pendentes",
    "Qual é o tipo de incidente mais comum?",
    "Liste os últimos 10 incidentes",
    "Quantos usuários estão cadastrados?",
    "Mostre estatísticas de segurança",
  ];

  constructor(
    private chatBotService: ChatBotService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuickStats();
    this.checkChatbotHealth();
    this.addWelcomeMessage();
  }

  loadQuickStats(): void {
    this.chatBotService.getQuickStats().subscribe({
      next: (stats) => {
        this.quickStats = stats;
      },
      error: (error) => {
        console.error("Error loading quick stats:", error);
      },
    });
  }

  checkChatbotHealth(): void {
    this.chatBotService.healthCheck().subscribe({
      next: (health) => {
        console.log("ChatBot health:", health);
      },
      error: (error) => {
        console.error("ChatBot health check failed:", error);
      },
    });
  }

  addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      role: "assistant",
      content: `👋 Olá! Sou o assistente virtual do SafeCity.\n\nPosso ajudá-lo a:\n• Consultar informações sobre incidentes\n• Gerar relatórios e estatísticas\n• Identificar áreas de risco\n• Analisar tendências de segurança\n\nComo posso ajudar você hoje?`,
      timestamp: Date.now(),
    };
    this.messages.push(welcomeMessage);
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) {
      return;
    }

    this.showWelcome = false;

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      role: "user",
      content: this.currentMessage,
      timestamp: Date.now(),
    };
    this.messages.push(userMessage);

    const messageText = this.currentMessage;
    this.currentMessage = "";
    this.isLoading = true;
    this.isTyping = true;

    this.scrollToBottom();

    // Enviar para o backend
    this.chatBotService
      .sendMessage({
        message: messageText,
        conversationHistory: this.messages.slice(0, -1), // Últimas mensagens (exceto a atual)
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isTyping = false;

          // Adicionar resposta do assistente
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.message,
            timestamp: response.timestamp,
            sqlQuery: response.sqlQuery,
            data: response.data,
            error: response.error,
          };
          this.messages.push(assistantMessage);

          this.scrollToBottom();
        },
        error: (error) => {
          this.isLoading = false;
          this.isTyping = false;

          const errorMessage: ChatMessage = {
            role: "assistant",
            content:
              "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
            timestamp: Date.now(),
            error: error.message,
          };
          this.messages.push(errorMessage);

          this.scrollToBottom();
        },
      });
  }

  useSuggestedQuestion(question: string): void {
    this.currentMessage = question;
    this.sendMessage();
  }

  clearConversation(): void {
    this.messages = [];
    this.showWelcome = true;
    this.addWelcomeMessage();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  formatData(data: any): string {
    if (!data) return "";
    return JSON.stringify(data, null, 2);
  }

  isArray(data: any): boolean {
    return Array.isArray(data);
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
