import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = []
  userSub: Subscription;
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers();
    this.userSub = this.userService.getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onDelete(userId: string) {
    this.userService.deleteUser(userId);
  }
}
