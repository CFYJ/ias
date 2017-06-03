import { MessageService } from './../message.service';
import { AuthenticationService, User } from './../authentication.service';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user = new User('', '');
  public errorMsg = '';

  constructor(
    private _service: AuthenticationService,
    private messageService: MessageService) {}

  ngOnInit() {
  }

  login() {
    this.errorMsg = '';
    if (!this._service.login(this.user)){
      this.errorMsg = 'Błąd logowania';
    }
    //this.sendMessage('logged in');
  }
  sendMessage(msg: string): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(msg);
  }

  clearMessage(): void {
    // clear message
    this.messageService.clearMessage();
  }

}
