import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../../shared/service/category.service';
import * as excel from 'xlsx';

@Component({
  selector: 'app-category-report',
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.scss']
})
export class CategoryReportComponent implements OnInit {

 public filteredCategories: any = [];
  public productCategoryArray = [];
  public mainCategoryArray: any = [];
  public subCategoryArray: any = [];
  public subSubCategoryArray: any = [];

  constructor(private categoryService: CategoryService) {
    this.getAllCategory();
    this.getAllDetails();
  }

  ngOnInit(): void {
  }
  toggleExpansion(item: any) {
    // Toggle the expansion state of the clicked item
    item.expanded = !item.expanded;
  }

  filterItems(searchTerm: string): void {
    this.filteredCategories = this.mainCategoryArray.filter(category =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  getAllCategory() {
    const sendData = {
      code: 'c'
    };

    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
    );
  }

// ++++++++++++++++++++ Categories loading Array set-up for Editable Table ++++++++++++++++
  setAllCategory(data) {
    let cr = {};
    cr = {
      name: '',
      code: ''
    };

    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        cr = {
          name: data.data[i].name,
          code: data.data[i].code
        };
        this.productCategoryArray.push(cr);
      }
    }
  }

  getAllDetails() {
    this.categoryService.getAllCategoriesDetails().subscribe(
      data => {
        this.mainCategoryArray = [];
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].category_name != null) {
            let subCategories: any = [];
            for (let j = 0; j < data.data[i].subcategories.length; j++) {
              if (data.data[i].subcategories[j].sub_category_name != null) {
                let subSubCategories: any = [];
                for (let x = 0; x < data.data[i].subcategories[j].subsubcategories.length; x++){
                    let sendObj2 = {
                      sub_sub_category_name: data.data[i].subcategories[j].subsubcategories[x].sub_sub_category_name,
                      sub_sub_category_code: data.data[i].subcategories[j].subsubcategories[x].sub_sub_category_code
                    };
                    subSubCategories.push(sendObj2);
                }
                let sendObj1 = {
                  sub_category_name: data.data[i].subcategories[j].sub_category_name,
                  sub_category_code: data.data[i].subcategories[j].sub_category_code,
                  subsubcategories: subSubCategories
                };
                subCategories.push(sendObj1);
              }
            }
            let sendObj = {
              category_name: data.data[i].category_name,
              category_code: data.data[i].category_code,
              subcategories : subCategories,
              category_price_rate: data.data[i].category_price_rate
            };
            this.mainCategoryArray.push(sendObj);
          }
        }
      },
      errors => {
      });
  }
  exportToExcel(): void {
    const element = document.getElementById('excel-table');
    const ws: excel.WorkSheet = excel.utils.table_to_sheet(element);


    // Set the width cols
    ws['!cols'] = [
      { width: 40 },
      { width: 15 },
      { width: 15 }
    ];
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'Category-Report');

    excel.writeFile(wb, 'category-report.xlsx');
  }
}
