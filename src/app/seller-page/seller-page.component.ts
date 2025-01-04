import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../shared/services/users.service';
import { Observable } from 'rxjs';
import { IUser } from '../shared/interfaces/user.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './seller-page.component.html',
  styleUrl: './seller-page.component.scss',
})
export class SellerPageComponent implements OnInit {
  userService = inject(UsersService);
  user!: Observable<IUser>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = this.userService.getUserById(this.route.snapshot.params['id']);
  }
}
