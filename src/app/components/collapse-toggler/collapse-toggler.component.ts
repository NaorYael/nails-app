import {Component, Input} from '@angular/core';

@Component({
  selector: 'collapse-toggler',
  templateUrl: './collapse-toggler.component.html',
  styleUrls: ['./collapse-toggler.component.scss']
})
export class CollapseTogglerComponent {
  @Input() hide = true;
}
