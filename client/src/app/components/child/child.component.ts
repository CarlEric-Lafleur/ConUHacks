import { Component, Input } from '@angular/core';
import { AppUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-child',
  standalone: false,

  templateUrl: './child.component.html',
  styleUrl: './child.component.scss',
})
export class ChildComponent {
  @Input() child: AppUser = {} as AppUser;
}
