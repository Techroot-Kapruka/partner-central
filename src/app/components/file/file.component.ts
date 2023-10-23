import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FormControl, FormGroup} from '@angular/forms';
import {FileUploadService} from '../../shared/service/file-upload.service';
import Swal from 'sweetalert2';
import {CategoryService} from '../../shared/service/category.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClientService} from '../../shared/service/http-client.service';
import {ProductService} from '../../shared/service/product.service';
import {HttpClient} from '@angular/common/http';
import * as url from 'url';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  public formdata;
  public tableArray = [];
  public categoryArr = [];
  file: any;
  public ids = '';
  public partnerSpecificCategoryArr: any[];
  public marginPrice;
  public marginRate = 0;
  selectedImages: (string | null)[][] = [[]];
  showAddImagesElement = false;
  showAllElements = true;
  afterSavedArray = [];
  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  // public imageCliant: FormGroup;
  formDataMap: Map<string, FormData> = new Map();
  formData = new FormData();
  public imageCliant: FormGroup;
  productImages: { [productCode: string]: File[] } = {};
  productCode: string;
  pricecc = new File([''], '');
  catCodeSelected = false;
  uploaded = true;

  bioSection = new FormGroup({
    files: new FormControl(''),
    fileSource: new FormControl('')
  });

  constructor(private fileUploadService: FileUploadService, private productService: ProductService, private categoryService: CategoryService, private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService, private http: HttpClient) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.getSelectedPartner(params.get('id'));
      this.ids = params.get('id');
    });
  }

  ngOnInit(): void {
  }

  getSelectedPartner(id) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      const payLoard = {
        temp_code: sessionStorage.getItem('temp_code')
      };
      this.httpClientService.getSelectedPartnerById(payLoard).subscribe(
        data => this.userAlertFunction(data),
        error => this.alertFunction(error.status)
      );
    }
    // else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER'){
    //   const payLoard = {
    //     user_u_id: sessionStorage.getItem('userId')
    //   };
    //   this.httpClientService.getUserOrAdminProfileDetails(payLoard).subscribe(
    //       data => this.categoryMangerCategories(data),
    //       error => this.alartFunction(error.status)
    //   );
    // }

  }

  userAlertFunction(data) {
    if (data.data != null) {
      this.getCategoryByUser(data);
    }
  }

  changeValue(event) {
    const getFileLabel = (document.getElementById('Exel_file') as HTMLInputElement).value;
    (document.getElementById('prepend-big-btn') as HTMLInputElement).innerText = getFileLabel;
    event.preventDefault();
    // const files = event.dataTransfer.files;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bioSection.patchValue({
        fileSource: file
      });
      this.handleFiles(file);
    }
  }

  handleFiles(files): void {
    // Perform upload logic or further processing on the dropped files
    const file = files;
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
      this.bioSection.patchValue({
        fileSource: file
      });
      (document.getElementById('prepend-big-btn') as HTMLInputElement).innerText = file.name;
      this.callingFunction();
    } else {
      Swal.fire(
        'Whoops...!',
        'Add a Excel file....',
        'error'
      );
    }
  }

  uploadFileTo(forms: NgForm): void {

  }

  callingFunction() {
    this.fileUploadService.uploardFileExcel(this.bioSection.get('fileSource').value, sessionStorage.getItem('partnerId')).subscribe(
      data => this.manageUploadFile(data)
    );
  }

  private manageUploadFile(data) {
    for (let i = 0; i < data.data.Excel_Data.length; i++) {
      const index = i + 1;
      const payload = {
        index,
        category: data.data.Excel_Data[i].category,
        productName: data.data.Excel_Data[i].productName,
        brand: data.data.Excel_Data[i].brand,
        sellerSku: data.data.Excel_Data[i].sellerSku,
        listingPrice: data.data.Excel_Data[i].listingPrice,
        productDescription: data.data.Excel_Data[i].productDescription,
        keywordList: data.data.Excel_Data[i].keywordList,
        createdDate: data.data.Excel_Data[i].createdDate,
        createdDateTime: data.data.Excel_Data[i].createdDateTime,
        status: data.data.Excel_Data[i].status,
        subCategory: data.data.Excel_Data[i].subCategory,
        mainCategory: data.data.Excel_Data[i].mainCategory,
        marginRate: data.data.Excel_Data[i].marginRate,
        sellerIncome: data.data.Excel_Data[i].sellerIncome,
        vendorId: data.data.Excel_Data[i].vendorId,
        itemGroup: data.data.Excel_Data[i].itemGroup,
        productVariant: data.data.Excel_Data[i].productVariant,
        image1: 'image1',
        image2: 'image2',
        image3: 'image3',
        image4: 'image4',
        image5: 'image5',
      };
      this.tableArray.push(payload);
    }
    this.uploaded = false;
  }

  getCategoryByUser(data) {
    let sendObj = {};
    const partnerId = data.data.partnerUser.id;
    sendObj = {
      id: partnerId
    };
    this.categoryService.getCategoryByCorePartnerId(sendObj).subscribe(
      data => this.manageCategoryCoreDetails(data),
      error => this.alertFunction(error.status)
    );
  }

  manageCategoryCoreDetails(data) {
    if (data.data != null) {
      this.partnerSpecificCategoryArr = [];
      let categoryArray = {};
      for (const element of data.data) {
        categoryArray = {
          catName: element.category_path,
          catCode: element.category_code
        };
        this.partnerSpecificCategoryArr.push(categoryArray);
      }
    }
  }

  onCategoryChange(event: any, i, listingPrice) {
    const selectedCat = event.target.value;
    this.getCategoryDetails(selectedCat, i, listingPrice);
  }

  getCategoryDetails(catCode: string, i, listingPrice) {
    const payload = {
      code: catCode
    };
    this.categoryService.getCategoryByCode(payload).subscribe(
      data => this.manageMarginRate(data, i, listingPrice, catCode),
      err => this.marginRate = 0
    );
  }

  manageMarginRate(data, i, listingPrice, catCode) {
    this.marginRate = data.data.selling_price_margin;
    const sellerIncome = this.calculateSellerIncome(listingPrice, this.marginRate);
    this.updateSellerIncome(i, sellerIncome, this.marginRate, catCode);
  }

  updateSellerIncome(conditionValue: number, newValue, newMarginRate, catCode) {
    conditionValue = conditionValue + 1;
    for (const element of this.tableArray) {
      if (element.index === conditionValue) {
        element.sellerIncome = newValue;
        element.marginRate = newMarginRate;
        element.category = catCode;
        break;
      }
    }
  }

  calculateSellerIncome(listingPrice, marginRate) {
    return listingPrice - (listingPrice * (marginRate / 100));
  }

  updateMarginRate(conditionValue: number, newValue) {
    for (const element of this.tableArray) {
      if (element.index === conditionValue + 1) {
        element.marginRate = newValue;
        this.marginRate = 0;
        break;
      }
    }
  }

  alertFunction(data) {
  }

  openFileInput(row: number, imageIndex: number) {
    const fileInput = document.getElementById('fileInput_' + row + '_' + imageIndex) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Event handler for file input change
  onFileInputChange(event: Event, row: number, imageIndex: number, productCode: string) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      if (!this.isImage(selectedFile)) {
        Swal.fire(
          'Error!',
          'Please select a image',
          'error'
        );
        return;
      }
      if (this.productImages[productCode]) {
        this.productImages[productCode].push(selectedFile);
      }

      const formData = new FormData();
      formData.append('image', selectedFile);

      if (!this.selectedImages[row]) {
        this.selectedImages[row] = [];
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImages[row][imageIndex] =
          reader.result as string
        ;
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }

  getImageSource(row: number, imageIndex: number): string {
    if (this.selectedImages[row - 1] && this.selectedImages[row - 1][imageIndex]) {
      return this.selectedImages[row - 1][imageIndex];
    } else {
      return 'assets/images/dashboard/icons8-plus.gif'; // Default source
    }
  }

  bulkProductSave(event: Event) {
    event.preventDefault();
    if (this.tableArray.length !== 0) {
      for (let j = 0; j < this.tableArray.length; j++) {
        const item = this.tableArray[j];
        this.catCodeSelected = item.sellerIncome !== 0;
      }

      if (this.catCodeSelected === true) {
        this.fileUploadService.saveBulk(this.tableArray).subscribe(
          data => this.manageProductUploadSuccess(data),
          error => this.manageErrors(error)
        );
      }
      if (this.catCodeSelected === false) {
        Swal.fire(
          'Failed!',
          'Please select all categories',
          'error'
        );
      }
    } else {
      Swal.fire(
        'Empty Bulk!',
        'Please add products',
        'warning'
      );
    }
  }

  bulkImageSave(event: Event) {
    event.preventDefault();
    this.uploadImages();
  }

  manageProductUploadSuccess(data) {
    if (data.status_code === 200) {
      Swal.fire(
        'Add Images!',
        'Please Add Images',
        'info'
      );
      this.showAddImagesElement = true;
      this.showAllElements = false;
      this.afterSavedArray = data.data;
      this.afterSavedArray.forEach((item: any) => {
        const productCode = item.productCode; // Extract the productCode
        if (!this.productImages[productCode]) {
          this.productImages[productCode] = [];
        }
      });
    } else {
      Swal.fire(
        'Error!',
        'Something Went Wrong',
        'error'
      );

    }
  }

  manageErrors(error) {
    Swal.fire(
      'Oops!',
      error.Error.message(),
      'error'
    );
  }

  successMessage() {
    Swal.fire(
      'Good Job!',
      'Bulk Successfully Added!',
      'success'
    );
  }

  checkImageValidation() {
    for (const product_code in this.productImages) {
      const imagesForProduct = this.productImages[product_code];
      if (imagesForProduct[0] == null) {
        return false;
      }
    }
    return true;
  }

  uploadImages() {

    if (this.checkImageValidation()) {
      // tslint:disable-next-line:forin
      for (const product_code in this.productImages) {
        const imagesForProduct = this.productImages[product_code];
        if (imagesForProduct[0] == null) {
          Swal.fire(
            'Failed!',
            'Please Add Main Image!',
            'error'
          );
          break;
        }
        try {
          const response = this.productService.insertProductImage(
            this.image1 = imagesForProduct[0] || this.pricecc,
            this.image2 = imagesForProduct[1] || this.pricecc,
            this.image3 = imagesForProduct[2] || this.pricecc,
            this.image4 = imagesForProduct[3] || this.pricecc,
            this.image5 = imagesForProduct[4] || this.pricecc,
            product_code
          );

          if (response.subscribe(
          )) {
            Swal.fire(
              'Good Job!',
              'Product added',
              'success'
            );
          } else {
            Swal.fire(
              'Error!',
              'Something Went Wrong',
              'error'
            );
          }
        } catch (error) {
          Swal.fire(
            'Error!',
            error,
            'error'
          );
        }
      }
    } else {
      Swal.fire(
        'Failed!',
        'Please Add Main Image!',
        'error'
      );
    }
  }

  downloadBulkItemExcel() {
    const excelFileUrl = 'assets/excel/BulkUpload.xlsx'; // Replace with your Excel file URL

    // Make a GET request to fetch the Excel file data
    this.http.get(excelFileUrl, {responseType: 'blob'}).subscribe((data: Blob) => {
      const fileName = 'BulkItemUpload.xlsx'; // Replace with the desired file name

      // Create a Blob object and initiate the download
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

      if (window.navigator.msSaveOrOpenBlob) {
        // For IE
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        // For modern browsers
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    });
  }
}


