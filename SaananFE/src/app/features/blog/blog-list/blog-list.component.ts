import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../blog.service';
import { BlogListResponse } from '@core/models/blog.model';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, DatePipe, PaginationComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);

  readonly blogs = signal<BlogListResponse[]>([]);
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  private readonly pageSize = 9;

  ngOnInit(): void {
    this.loadBlogs();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadBlogs();
  }

  private loadBlogs(): void {
    this.blogService.getPublishedBlogs(this.currentPage(), this.pageSize).subscribe((response) => {
      if (response.success && response.data) {
        this.blogs.set(response.data.items);
        this.totalPages.set(response.data.totalPages);
      }
    });
  }
}
