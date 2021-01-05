import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  usersubscription: Subscription;
  username: string;

  constructor(  private authService: AuthService) {

     this.usersubscription = this.authService.currentUser.subscribe({
      next: x => {
        if (x) {
          this.username = x.username;
        } else {
          this.username = 'Guest';
        }
      },
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done')
    });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.usersubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
