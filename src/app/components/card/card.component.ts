import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Event} from '../../../shared/Event'
import {WorkHourService} from '../../services/work-hour.service'
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  @Output() onSelected = new EventEmitter<any>();

  isSelected = false;
  imageLoad = false;
  activeEvent!: {};

  members: any[] = [
    {title: 'הלחמת ריסים', subtitle: 'בשיטה חדשנית', price: 350, time: 90, url: '../../../assets/eyelashes.png'},
    {title: 'לק ג\'ל', subtitle: 'ידיים ומניקור', price: 100, time: 120, url: '../../../assets/nail-polish-png-46851.png'},
    {title: 'לק ג\'ל', subtitle: 'ידיים תיקון מבנה אנטומי ומניקור', price: 120, time: 120, url: '../../../assets/nail-polish-png-46829.png'},
    {title: 'לק ג\'ל', subtitle: 'רגליים', price: 100, time: 120, url: '../../../assets/nail-polish-png-46837.png'},
  ];

  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);


  constructor() { }

  ngOnInit(): void {
  }

  onLoadImage() {
    this.imageLoad = true;
  }
  onClick(event: Event) {
      this.onSelected.emit(event);
  }
}
