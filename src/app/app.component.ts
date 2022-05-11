import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from './services/api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular13Crud';

  displayedColumns: string[] = [
    'date',
    'name',
    'category',
    'condition',
    'price',
    'comment',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '35%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'edit' || val == 'add') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editProduct(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '35%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'edit') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        alert('Le produit a été supprimé avec succès');
        this.getAllProducts();
      },
      error: (err) => {
        alert('Une erreur est survenue. La suppression du produit a échoué');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
