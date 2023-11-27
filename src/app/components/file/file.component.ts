import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {FileUploadService} from '../../shared/service/file-upload.service';
import Swal from 'sweetalert2';
import {CategoryService} from '../../shared/service/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '../../shared/service/http-client.service';
import {ProductService} from '../../shared/service/product.service';
import {HttpClient} from '@angular/common/http';
import {CanComponentDeactivate} from "../../can-deactivate.guard";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, concatMap, finalize, switchMap, takeWhile, tap, toArray} from "rxjs/operators";
import {from, Observable, of} from "rxjs";
import {ImageService} from "../../shared/service/image.service";
import {map} from "rxjs/internal/operators";

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit, CanComponentDeactivate {
    public formdata;
    public tableArray = [];
    public categoryArr = [];
    file: any;
    public ids = '';
    public partnerSpecificCategoryArr: any[];
    public partnerSpecificCategoryArrForTemplate: any[];
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
    modalRef: any;
    fieldPopRef: any;
    productNameModal = "";
    editFieldName = "";
    modalIndex = 0;
    // public imageCliant: FormGroup;
    formDataMap: Map<string, FormData> = new Map();
    formData = new FormData();
    public imageCliant: FormGroup;
    productImages: { [productCode: string]: File[] } = {};
    productCode: string;
    pricecc = new File([''], '');
    catCodeSelected = false;
    uploaded = false;
    clicked = false;
    bulkTemplateHref = 'assets/excel/BulkUpload.xlsx';
    selectedCategoryForTemplate = ''
    bulkTemplateCatSelected = false;
    verificationClicked = false;
    editInputType = 'text';
    editInputValue: any;
    inputValue: any;
    selectedMainCategory: string = '';
    excelUploaded = false
    headers: string[] = [];
    needVerification = true;
    verifying = false;
    categoryMatched = false;
    showSavedElements = true;
    disableSaveButton = false;
    uploadComplete = false;


    bioSection = new FormGroup({
        files: new FormControl(''),
        fileSource: new FormControl('')
    });

    async canDeactivate(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.excelUploaded && !this.uploadComplete) {
                Swal.fire({
                    title: 'Bulk Upload Not Completed Yet!',
                    text: 'Do you really want to leave this page?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, leave',
                    cancelButtonText: 'No, stay',
                    customClass: {
                        popup: 'swal-popup',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(true);
            }
        });
    }

    @ViewChild('imagePopup') imagePopup: ElementRef;
    @ViewChild('editFieldPopup') editFieldPopup: ElementRef;

    constructor(private fileUploadService: FileUploadService, private productService: ProductService, private categoryService: CategoryService, private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService, private http: HttpClient, private router: Router, private modal: NgbModal, private imageService: ImageService) {
        this._Activatedroute.paramMap.subscribe(params => {
            this.getSelectedPartner(params.get('id'));
            this.ids = params.get('id');
        });
    }

    ngOnInit(): void {
    }

    popUpImageActive(index: number) {
        this.modalRef = this.modal.open(this.imagePopup, {centered: true});
        this.productNameModal = this.tableArray[index]['Product Name'];
        this.modalIndex = index;
    }

    popUpEditActive(index: number, rowName: string, oldValue: any) {
        this.editInputValue = oldValue;
        switch (rowName.toUpperCase()) {
            case 'SELLING PRICE': {
                this.editInputType = 'number';
                break;
            }
            case 'MARGIN': {
                this.editInputType = 'number';
                return
                break;
            }
            default: {
                this.editInputType = 'text';
                break;
            }
        }
        this.fieldPopRef = this.modal.open(this.editFieldPopup, {centered: true});
        this.editFieldName = rowName;
        this.modalIndex = index - 1;
    }

    popUpEditClose() {
        this.editInputType = 'text';
        this.editInputValue = '';
        this.modalIndex = 0
        this.fieldPopRef.close();
    }

    popUpEditSave(index: number) {
        if (this.inputValue === undefined || this.inputValue === '') {
            this.popUpEditClose();
            return;
        }
        //save data to table
        this.tableArray[index][this.editFieldName] = this.inputValue
        this.needVerification = true;

        this.editInputValue = '';
        this.inputValue = '';
        this.editInputType = 'text';
        this.modalIndex = 0
        this.fieldPopRef.close();
    }

    changeModelOnChange(event: any) {
        this.inputValue = event.target.value;
    }

    popUpImageSave(index: number) {
        // Filter out null and empty values
        let arr = this.selectedImages;
        const nonNullNonEmptyArray = arr[index].filter(value => value !== null && value !== "");

        let addedImageCount = nonNullNonEmptyArray.length;
        if (addedImageCount >= 1) {
            document.getElementById('addImageButton_' + index).innerText = `${addedImageCount} Images Added`;
            document.getElementById('addImageButton_' + index).className = 'btn btn-success btn-sm';
        }
        this.needVerification = true;
        this.productNameModal = "";
        this.modalIndex = 0
        this.modalRef.close();
    }

    popUpImageClose() {
        this.productNameModal = "";
        this.modalIndex = 0
        this.modalRef.close();
    }

    editValue(event: any) {

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
        if (this.showAddImagesElement === true) {
            Swal.fire(
                "Oops!",
                "Please Complete Previous Bulk First",
                "error"
            )
            return;
        }
        this.tableArray = [];
        this.uploaded = true;
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
        this.headers = Object.keys(data.data.Excel_Data[0]);
        for (let i = 0; i < data.data.Excel_Data.length; i++) {
            const index = i;
            // const payload = {
            //   index,
            //   category: data.data.Excel_Data[i].category,
            //   productName: data.data.Excel_Data[i].productName,
            //   brand: data.data.Excel_Data[i].brand,
            //   sellerSku: data.data.Excel_Data[i].sellerSku,
            //   listingPrice: data.data.Excel_Data[i].listingPrice,
            //   productDescription: data.data.Excel_Data[i].productDescription,
            //   keywordList: data.data.Excel_Data[i].keywordList,
            //   createdDate: data.data.Excel_Data[i].createdDate,
            //   createdDateTime: data.data.Excel_Data[i].createdDateTime,
            //   status: data.data.Excel_Data[i].status,
            //   subCategory: data.data.Excel_Data[i].subCategory,
            //   mainCategory: data.data.Excel_Data[i].mainCategory,
            //   marginRate: data.data.Excel_Data[i].marginRate,
            //   sellerIncome: data.data.Excel_Data[i].sellerIncome,
            //   vendorId: data.data.Excel_Data[i].vendorId,
            //   itemGroup: data.data.Excel_Data[i].itemGroup,
            //   productVariant: data.data.Excel_Data[i].productVariant,
            //   image1: 'image1',
            //   image2: 'image2',
            //   image3: 'image3',
            //   image4: 'image4',
            //   image5: 'image5',
            // };
            const payload = data.data.Excel_Data[i];
            payload['image1'] = 'image1';
            payload['image2'] = 'image2';
            payload['image3'] = 'image3';
            payload['image4'] = 'image4';
            payload['image5'] = 'image5';
            payload['index'] = index;
            console.log(payload)
            console.log(this.headers)
            this.tableArray.push(payload);
        }
        this.excelUploaded = true
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
            this.partnerSpecificCategoryArrForTemplate = [];
            let categoryArray = {};
            let templateCatArray = {};
            for (const element of data.data) {
                templateCatArray = {
                    value: element.category_path,
                    label: element.category_path
                };
                categoryArray = {
                    catName: element.category_path,
                    catCode: element.category_code
                };
                this.partnerSpecificCategoryArrForTemplate.push(templateCatArray);
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
    async onFileInputChange(event: Event, row: number, imageIndex: number, index) {
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
            if (!selectedFile.type.match(/^image\/jpeg$/i)) {
                Swal.fire(
                    'Error',
                    'Please select a JPEG (jpg) image.',
                    'warning'
                );
                return;
            }

            // Check the image resolution
            let image = new Image();
            image.src = URL.createObjectURL(selectedFile);

            // Create a promise to hold the async operation
            const checkImageResolution = new Promise<void>((resolve, reject) => {
                image.onload = () => {
                    if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
                        Swal.fire(
                            'Error',
                            'The maximum resolution supported for images is 5000x5000 pixels.',
                            'error'
                        );
                        reject('Invalid image resolution'); // Reject the promise to stop further actions
                    } else {
                        resolve(); // Resolve the promise to continue with further actions
                    }
                };
            });

            try {
                // Wait for the image resolution check to complete
                await checkImageResolution;

                // Upload and handle the image
                this.imageService.resizeImage(selectedFile)
                    .then((resizedFile) => {
                        if (this.tableArray[index]) {
                            switch (imageIndex) {
                                case 1: {
                                    this.tableArray[index].image1 = resizedFile;
                                    break;
                                }
                                case 2: {
                                    this.tableArray[index].image2 = resizedFile;
                                    break;
                                }
                                case 3: {
                                    this.tableArray[index].image3 = resizedFile;
                                    break;
                                }
                                case 4: {
                                    this.tableArray[index].image4 = resizedFile;
                                    break;
                                }
                                case 5: {
                                    this.tableArray[index].image5 = resizedFile;
                                    break;
                                }
                            }

                        }

                        const formData = new FormData();
                        formData.append('image', resizedFile);

                        if (!this.selectedImages[row]) {
                            this.selectedImages[row] = [];
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                            this.selectedImages[row][imageIndex] =
                                reader.result as string
                            ;
                        };
                        reader.readAsDataURL(resizedFile);
                    })
                    .catch((error) => {
                        Swal.fire(
                            'error',
                            'Image upload error: ' + error,
                            'error'
                        );
                    });
            } catch (error) {
                Swal.fire(
                    'Error',
                    'The maximum resolution supported for images is 5000x5000 pixels.',
                    'error'
                );
            }


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

    parseValues(value: string): string[] {
        return value.split(",");
    }

    async bulkProductSave(event: Event) {
        this.disableSaveButton = true;
        this.needVerification = false;
        event.preventDefault();
        const vendorId = sessionStorage.getItem('partnerId');
        if (this.tableArray.length !== 0) {
            for (let j = 0; j < this.tableArray.length; j++) {
                const item = this.tableArray[j];
                this.catCodeSelected = item.sellerIncome !== 0;
            }
            const observables: Observable<any>[] = [];
            for (let table of this.tableArray) {
                //variation is now always NA for development
                table.variations = 'NA';

                document.getElementById(`status_${table.index}`).innerHTML =
                    '<div class="spinner-border text-success spinner-border-sm" role="status">\n' +
                    '</div>';

                //get cat code from
                const category = this.findCaseInsensitiveFromObj(table, 'Category');
                const subCategory = this.findCaseInsensitiveFromObj(table, 'Sub Category');
                const subSubCategory = this.findCaseInsensitiveFromObj(table, 'Sub Sub Category');

                const sanitizedCategory = category.trim() !== 'NA' ? category : null;
                const sanitizedSubCategory = subCategory.trim() !== 'NA' ? subCategory : null;
                const sanitizedSubSubCategory = subSubCategory.trim() !== 'NA' ? subSubCategory : null;

                const categoryPath = await this.setCatPath(
                    sanitizedCategory,
                    sanitizedSubCategory,
                    sanitizedSubSubCategory
                )

                const categoryCode = await this.returnCatCodeFromPath(categoryPath);
                //calculate cost price
                let costPrice = 0;
                costPrice = this.calculateSellerIncome(this.findCaseInsensitiveFromObj(table, 'Selling price'), (this.findCaseInsensitiveFromObj(table, 'Margin')))

                const productVariation = [];
                if (this.removeSpacesFromString(this.selectedMainCategory) === this.removeSpacesFromString('CLOTHING') || this.selectedMainCategory === this.removeSpacesFromString('ELECTRONICS')) {

                }
                if (
                    (this.removeSpacesFromString(this.selectedMainCategory) === this.removeSpacesFromString('CLOTHING') || this.selectedMainCategory === this.removeSpacesFromString('ELECTRONICS')) &&
                    this.removeSpacesFromString(this.findCaseInsensitiveFromObj(table, 'Variations')) !== this.removeSpacesFromString('NA')
                ) {
                    const parts: string[] = table.productVariant.split("|");
                    const sizes: string[] = [];
                    const colors: string[] = [];

                    for (const part of parts) {
                        const keyValue: string[] = part.split("=");
                        if (keyValue.length === 2) {
                            const key: string = keyValue[0].trim();
                            const value: string = keyValue[1].trim();

                            if (key === "size") {
                                sizes.push(...this.parseValues(value));
                            } else if (key === "color") {
                                colors.push(...this.parseValues(value));
                            }
                        }
                    }
                    for (const color of colors) {
                        for (const size of sizes) {
                            const variationp = {
                                changing_amount: 0,
                                changing_rate: 0.0,
                                cost_price: costPrice,
                                selling_price: this.findCaseInsensitiveFromObj(table, 'Selling price'),
                                variation: 'Black',
                                variation_theme: 'color',
                                variations: [
                                    {
                                        theame: 'color',
                                        theame_value: color
                                    },
                                    {
                                        theame: 'size',
                                        theame_value: size
                                    }
                                ]
                            }
                            productVariation.push(variationp);
                        }
                    }
                } else {
                    const pp = {
                        changing_amount: 0,
                        changing_rate: 0.0,
                        cost_price: costPrice,
                        selling_price: this.findCaseInsensitiveFromObj(table, 'Selling price'),
                        variation: 'None',
                        variation_theme: 'None',
                        variations: [],
                    }
                    productVariation.push(pp);
                }
                if (this.categoryMatched === true) {
                    let keywords = [];
                    let keywordsString = this.findCaseInsensitiveFromObj(table, 'keywords');
                    if (keywordsString !== undefined) {
                        keywords = keywordsString.split(',');
                    }
                    const payload = {
                        category_code: categoryCode, // get cat code from cat path
                        title: this.findCaseInsensitiveFromObj(table, 'Product Name'),
                        brand: 'None',
                        manufacture: '',
                        vendor: vendorId,
                        has_group: 1,
                        maintain_stock: 1,
                        stock_uom: 'Nos',
                        item_group: '',
                        productDescription: {
                            description: this.findCaseInsensitiveFromObj(table, 'Product Description'),
                            special_notes: ' ',
                            availability: 'no'
                        },
                        productOffer: {
                            seller_sku: this.findCaseInsensitiveFromObj(table, 'Seller SKU'),
                            price: 0.0,
                            condition: 'Brand New',
                            amount: 0.0,
                            price_rate: 0.0,
                            seling_price: this.findCaseInsensitiveFromObj(table, 'Selling price')
                        },
                        productVariation,
                        productKeyword: {
                            keywords: keywords
                        },
                        productAttributes: []
                    }
                    const emptyFile = new File([''], '');
                    //get images
                    let image1 = emptyFile
                    let image2 = emptyFile
                    let image3 = emptyFile
                    let image4 = emptyFile
                    let image5 = emptyFile

                    if (table.image1 !== 'image1') {
                        image1 = table.image1
                    }
                    if (table.image2 !== 'image2') {
                        image2 = table.image2
                    }
                    if (table.image3 !== 'image3') {
                        image3 = table.image3
                    }
                    if (table.image4 !== 'image4') {
                        image4 = table.image4
                    }
                    if (table.image5 !== 'image5') {
                        image5 = table.image5
                    }

                    // Create an observable for each product
                    const productObservable: Observable<any> = this.productService.insertProductWithImages(
                        image1,
                        image2,
                        image3,
                        image4,
                        image5,
                        payload
                    ).pipe(
                        catchError(error => {
                            // Handle the error here (e.g., show an alert)
                            Swal.fire(
                                'Error',
                                `Failed to insert product: ${error.message}`,
                                'error'
                            );
                            return of({index: table.index, message_status: 'failed'}); // Return an observable to replace the failed one
                        }),
                        map(result => ({...result, index: table.index}))
                    );
                    observables.push(productObservable);
                } else {
                    return;
                }
            }
            if (observables.length > 0) {
                from(observables).pipe(
                    concatMap((productObservable) =>
                        productObservable.pipe(
                            catchError((error) => {
                                Swal.fire('Error', `Failed to insert product: ${error.message}`, 'error');
                                // return of({ index: productObservable.index, message_status: 'failed' });
                                return of(productObservable);
                            }),
                            tap((result) => {
                                if (result.message_status === 'Success') {
                                    // Update the row color for success
                                    this.showSavedElements = false;
                                    document.getElementById(`index_${result.index}`).style.color = 'green';
                                    document.getElementById(`index_${result.index}`).classList.add('disabled-row');
                                    document.getElementById(`status_${result.index}`).setAttribute('colspan', '2')

                                    document.getElementById(`status_${result.index}`).innerHTML =
                                        '<i class="fa fa-check-circle-o" style="color: #5cb85c" aria-hidden="true"></i><p style="color: black">' + result.message + '</p>';
                                    document.getElementById(`status_${result.index}`).style.color = 'white';
                                    document.getElementById(`status_${result.index}`).style.backgroundColor = 'white';
                                    document.getElementById(`status_${result.index}`).style.opacity = '1';

                                } else if (result.message_status === 'failed') {
                                    // Update the row color for failure
                                    console.log(result.index)
                                    document.getElementById(`index_${result.index}`).style.color = 'red';
                                    document.getElementById(`index_${result.index}`).classList.add('disabled-row');
                                    document.getElementById(`status_${result.index}`).setAttribute('colspan', '2')
                                    document.getElementById(`status_${result.index}`).innerHTML =
                                        '<i class="fa fa-times-circle-o" style="color: #d9534f " aria-hidden="true"></i>' +
                                        '<p style="color: black">' + result.message + '</p>';
                                    document.getElementById(`status_${result.index}`).style.color = 'white';
                                    document.getElementById(`status_${result.index}`).style.backgroundColor = 'white';
                                    document.getElementById(`status_${result.index}`).style.opacity = '1';
                                }
                            })
                        )
                    ),
                    toArray(),
                    switchMap((results: any[]) => {
                        const hasError = results.some((result) => result.message_status === 'failed');

                        if (hasError) {
                            Swal.fire(
                                'Error',
                                'One or more product insertions failed!',
                                'error'
                            );
                            return of(null);
                        } else {
                            console.log(results);
                            const allSuccess = results.every((result) => result.message_status === 'Success');
                            if (allSuccess) {
                                return of(results);
                            } else {
                                return of(null);
                            }
                        }
                    }),
                    takeWhile((results) => results !== null),
                    // finalize(() => {
                    //   Swal.fire('Success', 'Bulk product insertion successful', 'success');
                    // })
                ).subscribe(
                    (results) => {
                        console.log(results)
                        if (results) {
                            console.log('All products inserted successfully');
                        }
                        this.uploadComplete = true;
                    }
                );
            }
            if (this.catCodeSelected === false) {
                Swal.fire(
                    'Failed!',
                    'Please select all categories',
                    'error'
                );
                this.disableSaveButton = false;
                this.needVerification = true;
            }

        } else {
            Swal.fire(
                'Empty Bulk!',
                'Please add products',
                'warning'
            );
            this.disableSaveButton = false;
        }
    }

    bulkImageSave(event: Event) {
        this.clicked = true;
        event.preventDefault();
        console.log(this.tableArray);
        // this.uploadImages();
    }

    manageProductUploadSuccess(data) {
        if (data.status_code === 200) {
            // Swal.fire(
            //   'Add Images!',
            //   'Please Add Images',
            //   'info'
            // );
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
                    this.clicked = false;
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

    changeBulkTemplateOnCategory(event) {
        this.bulkTemplateCatSelected = true;
        this.selectedMainCategory = event.value;
        const category = event.value.toUpperCase();
        switch (category) {
            case 'CLOTHING': {
                this.bulkTemplateHref = 'assets/excel/BulkUpload(clothing).xlsx';
                this.selectedCategoryForTemplate = ' - Clothing';
                break;
            }
            case 'ELECTRONICS': {
                this.bulkTemplateHref = 'assets/excel/BulkUpload(electronics).xlsx';
                this.selectedCategoryForTemplate = ' - Electronics';
                break;
            }
            default: {
                this.bulkTemplateHref = 'assets/excel/BulkUpload.xlsx';
                this.selectedCategoryForTemplate = '';
                break;
            }
        }

    }

    syncWrapper(callback) {
        callback();
    }

    async verifyDetails() {
        let index = 0;
        let allDetailsOk = true;

        for (const table of this.tableArray) {
            let verified = true;
            let allVerified: boolean;
            let errorMessages = []
            const addImageBtnTable = document.getElementById('addImageBtn_' + index);
            const addImageBtn = document.getElementById('addImageButton_' + index);
            const sellingPrice = document.getElementById('sellingprice_' + index);
            const marginRate = document.getElementById('margin_' + index);
            // const sellerIncome = document.getElementById('sellerincome_' + index);
            const status = document.getElementById('status_' + index);
            const statusBtn = document.getElementById('btn_status' + index);
            const description = document.getElementById('productdescription_' + index);
            const sku = document.getElementById('sellersku_' + index);
            // const brand = document.getElementById('brand_' + index);
            const productName = document.getElementById('productname_' + index);
            const category = document.getElementById('category_' + index);
            const subCategory = document.getElementById('subcategory_' + index);
            const subSubCategory = document.getElementById('subsubcategory_' + index);

            // Reset all styles
            addImageBtnTable?.classList.forEach(className => addImageBtnTable.classList.remove(className));
            addImageBtn?.style.removeProperty('backgroundColor');
            sellingPrice?.classList.forEach(className => sellingPrice.classList.remove(className));
            marginRate?.classList.forEach(className => marginRate.classList.remove(className));
            category?.classList.forEach(className => category.classList.remove(className));
            subCategory?.classList.forEach(className => subCategory.classList.remove(className));
            subSubCategory?.classList.forEach(className => subSubCategory.classList.remove(className));


            // sellerIncome.className = '';
            this.verifying = true;
            status.innerHTML =
                '<div class="spinner-border text-success spinner-border-sm" role="status">\n' +
                '</div>';


            setTimeout(async () => {

                let marginRateDb;


                // Check if main image is present
                // data-toggle="tooltip" data-placement="top" title="Tooltip on top"
                if (table.image1 === 'image1') {
                    addImageBtnTable.className = 'table-danger';
                    addImageBtn.style.backgroundColor = 'red';
                    errorMessages.push("Main Image is Empty!");
                    verified = false;
                }

                const categoryChecked = await this.catChecked(table)
                //check if category has sub cats
                let mainCatHasSub = categoryChecked.mainCatHasSub;
                let subCatHasSubs = categoryChecked.subCatHasSubs;

                //set cat path
                let isSubCat = false;
                let isSubSubCat = false;
                let categoryPath = this.findCaseInsensitiveFromObj(table, 'Category')
                if (this.findCaseInsensitiveFromObj(table, 'Sub Category') !== this.removeSpacesFromString('NA')) {
                    if (this.findCaseInsensitiveFromObj(table, 'Sub Sub Category') === this.removeSpacesFromString('NA')) {
                        if (subCatHasSubs) {
                            subSubCategory.className = 'table-danger'
                            errorMessages.push("Please Select Sub Sub Category");
                            verified = false;
                        }
                        isSubCat = true
                        categoryPath = categoryPath + ' > ' + this.findCaseInsensitiveFromObj(table, 'Sub Category');
                    } else {
                        if (subCatHasSubs) {
                            isSubCat = true
                            isSubSubCat = true
                            categoryPath = categoryPath + ' > ' + this.findCaseInsensitiveFromObj(table, 'Sub Category') + ' > ' + this.findCaseInsensitiveFromObj(table, 'Sub Sub Category');
                        } else {
                            categoryPath = categoryPath + ' > ' + this.findCaseInsensitiveFromObj(table, 'Sub Category')
                        }
                    }
                } else if (mainCatHasSub) {
                    subCategory.className = 'table-danger'
                    errorMessages.push("Please Select Sub");
                    verified = false;
                }

                // Check if margin rate is 0
                const marginValue = this.findCaseInsensitiveFromObj(table, 'Margin');
                if (marginValue !== undefined) {
                    if (marginValue === '0' || marginValue === null) {
                        marginRate.className = 'table-danger';
                        errorMessages.push("Invalid Margin Rate!");
                        verified = false;
                    }
                } else {
                    errorMessages.push("No Margin Rate Field!");
                    verified = false
                }

                //check if category path exist
                let payload = {keyword: categoryPath}
                const data = await this.categoryService.searchByPath(payload).toPromise();

                if (data.data.pathList[0] === undefined || data.data.pathList[0] === null) {
                    verified = false
                    marginRateDb = 0;
                    if (isSubSubCat) {
                        //check from sub cat
                        let lastIndex = categoryPath.lastIndexOf(">");
                        if (lastIndex !== -1) {
                            categoryPath = categoryPath.substring(0, lastIndex).trim();
                            const payload2 = {keyword: categoryPath}
                            const subData = await this.categoryService.searchByPath(payload2).toPromise();

                            if (subData.data.pathList[0] === undefined || subData.data.pathList[0] === null) {
                                subCategory.className = 'table-danger'
                                errorMessages.push("Invalid Sub Category");
                            } else if (subData.data.pathList.length > 1) {
                                subSubCategory.className = 'table-danger'
                                subCategory.className = 'table-danger'
                                errorMessages.push("Invalid Category Path");
                            } else {
                                subCategory.className = 'table-danger'
                                subCategory.className = 'table-danger'
                                errorMessages.push("Invalid Category Path");
                            }
                        }
                    } else {
                        subCategory.className = 'table-danger'
                        errorMessages.push("Invalid Sub Category");
                    }
                } else if (data.data.pathList[0].path !== categoryPath.trim()) {
                    subSubCategory.className = 'table-danger'
                    errorMessages.push("Invalid Sub Sub Category Path");
                    verified = false
                } else {
                    marginRateDb = data.data.pathList[0].rate;
                    //check if margin rate equal to db margin rate
                    if (marginRateDb != 0) {
                        if (marginValue !== marginRateDb.toString()) {
                            marginRate.className = 'table-danger';
                            errorMessages.push("Cannot Change Margin Rate");
                            verified = false;
                        }
                    } else {
                        verified = false;
                    }
                }


                await this.delay(400)

                // Check if listing price contains negative values
                const sellingPriceValue = this.findCaseInsensitiveFromObj(table, 'Selling price');
                if (sellingPriceValue !== undefined) {
                    if (sellingPriceValue <= 0 || sellingPriceValue === null) {
                        sellingPrice.className = 'table-danger';
                        errorMessages.push("Invalid Selling Price!");
                        verified = false;
                    }
                } else {
                    errorMessages.push("No Selling Price Field!");
                    verified = false
                }

                //check description
                const descriptionValue = this.findCaseInsensitiveFromObj(table, 'Product Description');
                if (descriptionValue !== undefined) {
                    if (descriptionValue === '' || descriptionValue === null) {
                        description.className = 'table-danger';
                        errorMessages.push("Empty Description!");
                        verified = false;
                    }
                } else {
                    verified = false
                }

                //check category
                const categoryValue = this.findCaseInsensitiveFromObj(table, 'Category');
                if (categoryValue !== undefined) {
                    if (categoryValue === '' || categoryValue === null) {
                        category.className = 'table-danger';
                        errorMessages.push("Empty Category Name!");
                        verified = false;
                    } else {
                        if (this.removeSpacesFromString(categoryValue) !== this.removeSpacesFromString(this.selectedMainCategory)) {
                            category.className = 'table-danger';
                            errorMessages.push("Invalid Category!");
                            verified = false;
                        } else {
                            this.categoryMatched = true;
                        }
                    }
                } else {
                    verified = false
                    errorMessages.push("No Category Field!");
                }


                //check sku
                const skuValue = this.findCaseInsensitiveFromObj(table, 'Seller SKU');
                if (skuValue !== undefined) {
                    if (skuValue === '' || skuValue === null) {
                        sku.className = 'table-danger';
                        errorMessages.push("Empty Seller SKU!");
                        verified = false;
                    }
                } else {
                    errorMessages.push("No Seller SKU Field!");
                    verified = false
                }

                //check product name
                const productNameValue = this.findCaseInsensitiveFromObj(table, 'Seller SKU');
                if (productNameValue !== undefined) {
                    if (table['Product Name'] === '' || table['Product Name'] === null) {
                        productName.className = 'table-danger';
                        errorMessages.push("Empty Product Name!");
                        verified = false;
                    }
                } else {
                    errorMessages.push("No Product Name Field");
                    verified = false
                }


                // If success green tick else cross after 2 secs
                allVerified = verified;
                let messageElement: string = '';
                for (const errorMessage of errorMessages) {
                    messageElement += '<li style="list-style-type: disc !important; font-size: 13px">' + errorMessage + '</li>';
                }
                if (allVerified) {
                    status.innerHTML =
                        // '<i class="fa fa-check-circle-o" style="color: #5cb85c" aria-hidden="true"></i>';
                        '<p style="color: #5cb85c">Verified</p>';
                } else {
                    allDetailsOk = false;
                    status.innerHTML =
                        // '<i class="fa fa-times-circle-o" style="color: #d9534f " aria-hidden="true" data-toggle="tooltip" data-placement="top" title=" ' + messageElement + ' "></i>';
                        '<ul style="color: #d9534f; margin-left: 5px">' + messageElement + '</ul>';
                }


            }, 1000); // 1s
            index++;
        }
        setTimeout(() => {
            if (allDetailsOk) {
                this.needVerification = false
            }
            this.verifying = false;
        }, 3000)
    }

    async catChecked(table) {
        const hasSubs = {
            mainCatHasSub: false,
            subCatHasSubs: false
        };

        if (this.findCaseInsensitiveFromObj(table, 'Category') !== undefined) {
            if (
                this.findCaseInsensitiveFromObj(table, 'Category') !== '' &&
                this.findCaseInsensitiveFromObj(table, 'Category') !== null
            ) {
                const mainCatData = await this.categoryService.searchByPath({
                    keyword: this.findCaseInsensitiveFromObj(table, 'Category') + ' > '
                }).toPromise();

                if (mainCatData.data.pathList.length > 0) {
                    hasSubs.mainCatHasSub = true;

                    const subCatData = await this.categoryService
                        .searchByPath({
                            keyword:
                                this.findCaseInsensitiveFromObj(table, 'Category') +
                                ' > ' +
                                this.findCaseInsensitiveFromObj(table, 'Sub Category') +
                                ' > '
                        })
                        .toPromise();

                    if (subCatData.data.pathList.length > 0) {
                        hasSubs.subCatHasSubs = true;
                    }
                }
            }
        }

        return hasSubs;
    }


    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    removeSpacesFromString(string: string) {
        return string.toLowerCase().replace(/\s/g, '');
    }

    findCaseInsensitiveFromObj(obj, key) {
        const lowerKey = key.toLowerCase().replace(/\s/g, '');
        for (const objKey in obj) {
            if (objKey.toLowerCase().replace(/\s/g, '') === lowerKey) {
                return obj[objKey];
            }
        }
        return undefined;
    }

    findCaseInsensitiveFromArray(array, key) {
        const lowerKey = key.toLowerCase().replace(/\s/g, '');

        for (const obj of array) {
            for (const objKey in obj) {
                if (objKey.toLowerCase().replace(/\s/g, '') === lowerKey) {
                    return obj[objKey];
                }
            }
        }

        return undefined;
    }

    checkEditRestrictFeild(field: string) {
        switch (this.removeSpacesFromString(field)) {
            case 'margin': {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    async setCatPath(mainCat: string, subCat: string, subSubCat: string) {
        if (subCat === null) {
            return mainCat;
        } else if (subSubCat === null) {
            return mainCat + ' > ' + subCat
        } else {
            return mainCat + ' > ' + subCat + ' > ' + subSubCat
        }
    }

    async returnCatCodeFromPath(path: string): Promise<string> {
        return this.categoryService.searchByPath({keyword: path}).pipe(
            map(data => {
                console.log(data);
                if (data.data !== null) {
                    return data.data.pathList[0].code;
                } else {
                    return ''; // or null if preferred
                }
            })
        ).toPromise();
    }

}


