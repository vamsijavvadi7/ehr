import {Component, Input} from '@angular/core';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
}
