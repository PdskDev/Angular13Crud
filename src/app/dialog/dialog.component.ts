import { ApiService } from './../services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  ProductConditionListing = ['Nouveau', 'Occasion', 'Reconditionné'];
  productForm!: FormGroup;
  formTitle: string = 'Ajouter un nouveau produit';
  actionBtn: string = 'Enregistrer';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      date: ['', Validators.required],
      comment: ['', Validators.required],
    });

    if (this.editData) {
      this.formTitle = 'Modifier un produit';
      this.actionBtn = 'Modifier';
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Le produit a été ajouté avec succès');
            this.productForm.reset();
            this.dialogRef.close('add');
          },
          error: (err) => {
            alert("Une erreur est survenue. L'ajout du produit a échoué");
          },
        });
      } else {
        this.updateProduct();
      }
    } else {
      if (this.productForm.valid) {
        this.updateProduct();
      }
    }
    //console.log(this.productForm.value);
  }

  updateProduct() {
    this.api.putProduct(this.editData.id, this.productForm.value).subscribe({
      next: (res) => {
        alert('Le produit a été mis à jour avec succès');
        this.productForm.reset();
        this.dialogRef.close('edit');
      },
      error: (err) => {
        alert('Une erreur est survenue. La modification du produit a échoué');
      },
    });
  }
}
