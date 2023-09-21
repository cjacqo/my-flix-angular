import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-basic-dialog',
  templateUrl: './info-dialog-basic.component.html',
  styleUrls: ['./info-dialog-basic.component.scss']
})
export class InfoDialogBasicComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
