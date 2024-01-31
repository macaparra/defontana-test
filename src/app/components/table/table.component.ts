import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input('data') data:any;
  @Input('search') search:any;
  displayedColumns: string[] = ['name'];
  dataSource = [];
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;
  pageSize = 10;
  length = 0;
  constructor(private router: Router){

  }
  ngOnInit(): void {
   
      this.updateTable();

  }

  ngAfterViewInit(): void {
    this.length = this.data.length;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateTable();
    }
  }

  private updateTable() {
    this.dataSource = this.data;
    this.length = this.data.length;
  }

  onPageChange(event: any) {
    this.router.navigate([''],{queryParams:{
      page_size:event.pageSize,
      page:event.pageIndex,
      search:this.search
    }});
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  navigate(id:string){
    this.router.navigate(['artist', id])
  }
}
