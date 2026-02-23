import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, TopListener } from '../../services/analytics';

@Component({
  selector: 'app-listeners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listeners.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Listeners implements OnInit {

  listeners: TopListener[] = [];
  currentPage = 0;
  totalPages = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadListeners();
  }

  loadListeners(page: number = 0) {
    this.cdr.markForCheck();
    this.analyticsService.getTopListeners(page).subscribe(res => {
      this.listeners = res.content;
      this.totalPages = res.totalPages;
      this.currentPage = res.number;
      this.cdr.detectChanges();
    });
  }
}