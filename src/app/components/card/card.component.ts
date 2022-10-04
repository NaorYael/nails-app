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
    {title: 'לק ג\'ל', subtitle: 'ידיים ומניקור (ללא מבנה אנטומי)', price: 100, time: 120, url: '../../../assets/nail-2.jpg'},
    {title: 'לק ג\'ל  מבנה אנטומי', subtitle: 'ידיים ומניקור', price: 120, time: 120, url: '../../../assets/nail-5.jpg'},
    {title: 'לק ג\'ל', subtitle: 'רגליים', price: 100, time: 120, url: '../../../assets/nail-polish-png-46837.png'},
    // {title: 'הלחמת ריסים', subtitle: 'קלאסי', price: 300, time: 180, url: '../../../assets/eyelashes.png'},
    // {title: 'הלחמת ריסים', subtitle: 'קלאסי (מילוי בלבד)', price: 200, time: 180, url: '../../../assets/eyelashes.png'},
    // {title: 'הלחמת ריסים', subtitle: 'דו מימד', price: 350, time: 180, url: '../../../assets/eyelashes.png'},
    // {title: 'הלחמת ריסים', subtitle: 'תלת מימד', price: 400, time: 180, url: '../../../assets/eyelashes.png'},
    // {title: 'הלחמת ריסים', subtitle: 'ווליום', price: 450, time: 180, url: '../../../assets/eyelashes.png'},

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
