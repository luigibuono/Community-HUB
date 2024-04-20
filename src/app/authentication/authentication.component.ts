import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {

  newCurrentUser: User = {
    name: '',
    email: '',
    status: 'active',
    gender: '',
    id: 0
  };
  user!: User;
  tokenKey!: string;
  
  constructor(private router: Router, private http: HttpServiceService) {}

  login() {
    localStorage.setItem('token', this.tokenKey);

    this.http.addUser(this.newCurrentUser).subscribe((data: any) => {
      if (data.status === 201) {
        this.user = data.body;
        localStorage.setItem('currentUser', JSON.stringify(this.user));

        this.router.navigate(['/users']);
      }
    });
  }

  goToLogin() {
    const element = document.querySelector('.cont2');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
}


