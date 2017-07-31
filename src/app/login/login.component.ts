import { MessageService } from './../message.service';
import { AuthenticationService, User } from './../authentication.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user = new User('', '');
  public errorMsg = '';
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: AuthenticationService,
    private messageService: MessageService) { }

  ngOnInit() {
    this._service.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/kontakty';
  }

  login() {
    this.errorMsg = '';
    this.user.name = this.user.name.toUpperCase();
    this._service.login(this.user).subscribe(data => {
      this.router.navigate([this.returnUrl]);
    }, error => {
      this.errorMsg = 'Błąd logowania';
    })
    // if (!this._service.login(this.user)) {
    //   this.errorMsg = 'Błąd logowania';
    // } else {
    //   this.router.navigate([this.returnUrl]);
    // }
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
