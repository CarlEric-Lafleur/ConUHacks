import { Component, Input } from '@angular/core';
import { DateService } from '../../../services/date/date.service';
import {
  Day,
  DrugType,
  Prescription,
  Schedule,
} from '../../../interfaces/prescription.interface';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { AppPages } from '../../../enums/app-pages.enum';
import { PrescriptionInfoService } from '../../../services/prescription-info.service';
import { Role } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-medicine-card',
  standalone: false,

  templateUrl: './medicine-card.component.html',
  styleUrl: './medicine-card.component.scss',
})
export class MedicineCardComponent {
  constructor(
    private dateService: DateService,
    private userService: UserService,
    private router: Router,
    private prescriptionInfoService: PrescriptionInfoService
  ) {}

  @Input() prescription!: Prescription;
  @Input() index!: number;
  private icon!: string;
  public timeLeft!: string;
  subscribtion: any;

  userRole: Role = Role.Assisted;

  ngOnInit() {
    this.prescription.type ? this.setIcon(this.prescription.type) : null;
    this.subscribtion = this.userService.user.subscribe((user) => {
      console.log(user);
      this.userRole = user!.role;
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  isAssistedUser() {
    return this.userRole === Role.Assisted;
  }

  getDateText() {
    return this.dateService.getDateText(this.prescription);
  }

  readyToTake() {
    return this.dateService.readyToTake(this.prescription);
  }

  public getIcon(): string {
    return this.icon;
  }

  private setIcon(icon: DrugType) {
    switch (icon) {
      case DrugType.PILL:
        this.icon = 'Medication_Liquid';
        break;
      case DrugType.PATCH:
        this.icon = 'healing';
        break;
      case DrugType.OTHER:
        this.icon = 'medical_services';
        break;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  takeNow() {
    if (this.userService.user.getValue()?.assistMode) {
      this.navigateTo(AppPages.takeDrug);
    }
  }

  Edit() {
    this.prescriptionInfoService.setPrescription(this.prescription, this.index);
    this.navigateTo(AppPages.Form);
  }
}
