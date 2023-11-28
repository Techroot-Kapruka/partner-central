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
  public categorySearch = '';

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
            const subCategories: any = [];
            for (let j = 0; j < data.data[i].subcategories.length; j++) {
              if (data.data[i].subcategories[j].sub_category_name != null) {
                const subSubCategories: any = [];
                for (let x = 0; x < data.data[i].subcategories[j].subsubcategories.length; x++) {
                  const sendObj2 = {
                    sub_sub_category_name: data.data[i].subcategories[j].subsubcategories[x].sub_sub_category_name,
                    sub_sub_category_code: data.data[i].subcategories[j].subsubcategories[x].sub_sub_category_code,
                    sub_sub_category_price_rate: data.data[i].subcategories[j].subsubcategories[x].sub_sub_category_price_rate
                  };
                  subSubCategories.push(sendObj2);
                }
                const sendObj1 = {
                  sub_category_name: data.data[i].subcategories[j].sub_category_name,
                  sub_category_code: data.data[i].subcategories[j].sub_category_code,
                  sub_category_price_rate: data.data[i].subcategories[j].sub_category_price_rate,
                  subsubcategories: subSubCategories
                };
                subCategories.push(sendObj1);
              }
            }
            const sendObj = {
              category_name: data.data[i].category_name,
              category_code: data.data[i].category_code,
              subcategories: subCategories,
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

    let filterCategories = [];
    const AllData = [];
    const catName = '';
    const subcatName = '';
    const subsubcatName = '';
    filterCategories = this.mainCategoryArray.filter(category =>
      category.category_name.toLowerCase().includes(this.categorySearch.toLowerCase())
    );

    filterCategories.forEach(category => {
      // Example action: Accessing properties of each category
      const categoryName = category.category_name;
      const categoryCode = category.category_code;
      const categoryPrice = category.category_price_rate;
      const subcategories = category.subcategories;

      AllData.push([categoryCode, categoryName, subcatName, subsubcatName, categoryPrice]);

      subcategories.forEach(subcategory => {
        const subCategoryName = subcategory.sub_category_name;
        const subCategoryCode = subcategory.sub_category_code;
        const subCategoryPrice = subcategory.sub_category_price_rate;
        const subsubcategories = subcategory.subsubcategories;

        AllData.push([subCategoryCode, catName, subCategoryName, subsubcatName, subCategoryPrice]);

        subsubcategories.forEach(subsubcategory => {
          const subsubCategoryName = subsubcategory.sub_sub_category_name;
          const subsubCategoryCode = subsubcategory.sub_sub_category_code;
          const subsubCategoryPrice = subsubcategory.sub_sub_category_price_rate;

          AllData.push([subsubCategoryCode, catName, subcatName, subsubCategoryName, subsubCategoryPrice]);
        });
      });
    });

    // Create a worksheet
    const ws: excel.WorkSheet = excel.utils.aoa_to_sheet([['Category Code', 'Category Name', 'Sub Category Name', 'Sub Sub Category Name', 'Category Price'], ...AllData]);

    // Create a workbook with the worksheet
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'Category-Report');

    // Save the workbook as an Excel file
    excel.writeFile(wb, 'category-report.xlsx');
  }
}
