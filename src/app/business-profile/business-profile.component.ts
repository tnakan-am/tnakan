import { Component, inject, OnInit } from '@angular/core';
import { ProductsComponent } from './products/products.component';
import { UsersService } from '../services/users.service';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { AsyncPipe } from '@angular/common';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [ProductsComponent, AsyncPipe],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.scss',
})
export class BusinessProfileComponent implements OnInit {
  user$!: Observable<User>;
  private firebaseAuthService = inject(FirebaseAuthService);
  constructor(private usersService: UsersService) {
    this.user$ = this.firebaseAuthService.user$;
  }

  ngOnInit() {}
}
