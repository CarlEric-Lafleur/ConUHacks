import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  standalone: false,

  templateUrl: './editable-text.component.html',
  styleUrl: './editable-text.component.scss'
})
export class EditableTextComponent {
  @Input() text!: string;
  @Input() onChange!: (s: string)=>void;
  tempText: string = this.text;
  isEditing: boolean = false;

  enableEdit() {
    this.isEditing = true;
    this.tempText = this.text;
  }

  confirmEdit() {
    this.onChange(this.tempText);
    this.text = this.tempText;
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
}
