import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of, take, timer } from 'rxjs';

import { SettingsService } from '../../../core/settings.service';
import { ShellImpactTypeEnum } from './shell-impact-type.enum';

@Component({
  selector: 'app-shell-impact',
  templateUrl: './shell-impact.component.html',
  styleUrls: ['./shell-impact.component.scss']
})
export class ShellImpactComponent implements OnInit {
  @Input() interval: number;
  @Input() type?: ShellImpactTypeEnum;

  frame$: Observable<number | null>;
  readonly framesCount = 4;

  constructor(private settings: SettingsService) {
    this.frame$ = of(null);
    this.interval = settings.interval; // миллисекунд при 30 кадрах в секунду
    this.type = settings.tank.shellImpactType;
  }

  ngOnInit(): void {
    this.frame$ = timer(0, this.interval).pipe(
      take(this.framesCount + 1),
      map((n) => n)
    );
  }
}
