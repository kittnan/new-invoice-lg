import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-head',
  templateUrl: './sub-head.component.html',
  styleUrls: ['./sub-head.component.scss'],
})
export class SubHeadComponent implements OnInit {
  @Input() name: string = '';
  constructor() {}

  ngOnInit(): void {}
}
