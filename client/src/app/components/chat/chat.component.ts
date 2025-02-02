import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { HttpCommunicationService } from '../../services/http-communication/http-communication.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked {
  isOpen = false;
  messages: string[] = [];
  newMessage = '';

  @ViewChild('chatMessages') private chatMessages!: ElementRef;

  constructor(private comms: HttpCommunicationService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push(this.newMessage);
      this.comms
        .basicGet('chat', { message: this.newMessage })
        .subscribe((res: any) => {
          this.messages.push(res);
          this.scrollToBottom();
        });
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatMessages.nativeElement.scroll({
        top: this.chatMessages.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch (err) {}
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (this.isOpen && document.activeElement?.tagName === 'INPUT') {
      this.sendMessage();
    }
  }
}
