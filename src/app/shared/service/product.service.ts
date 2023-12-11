import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  getProduct(resArr) {
    // return this.httpClient.post<any>(this.loginUrl, resArr);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/specialGiftsByPrefix', resArr, {headers});
  }

  getBussinessPartnerName() {
    // return this.httpClient.get<any>(this.loginUr2);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/viewAllPartnersBusinessName', {headers});
  }

  // getProductByBussiness(businessName, UserID) {
  //   const formData: FormData = new FormData();
  //   formData.append('businessName', businessName);
  //   formData.append('categoryUID ', UserID);
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  //   return this.httpClient.post<any>(this.SERVER + 'product/activeProductsByCompanyName', formData, {headers});
  // }

  getAllActiveProductList(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getAllActiveProductList', formData, {headers});
  }

  getAllActiveProductCount(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getAllActiveProductCount', formData, {headers});
  }

  getPendingStockAllocationList(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getPendingStockAllocation', formData, {headers});
  }

  getSearchCategory(payloard) {
    // return this.httpClient.post<any>(this.loginUr4, payloard);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'category/searchByKeywordAndPartnerId', payloard, {headers});
  }

  insertProduct(payloard: any) {
    // return this.httpClient.post<any>(this.saveProductUrl, payloard);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/saveProduct', payloard, {headers});
  }

  insertProductWithImages(image1: any, image2: any, image3: any, image4: any, image5: any, payload: any) {
    const formData: FormData = new FormData();

    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('image3', image3);
    formData.append('image4', image4);
    formData.append('image5', image5);

    const blob = new Blob([JSON.stringify(payload)], {type: 'application/json'});
    formData.append('data', blob);

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/saveProductWithImages', formData, {headers});
  }

  insertProductImage(image1: any, image2: any, image3: any, image4: any, image5: any, id: any) {
    const formData: FormData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('product_code', id);
    formData.append('image3', image3);
    formData.append('image4', image4);
    formData.append('image5', image5);
    // return this.httpClient.post<any>(this.saveProductImage, formData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/saveImages', formData, {headers});
  }

  updatetProductImage(image1: any, image2: any, image3: any, image4: any, image5: any, id: any) {
    const formData: FormData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('product_code', id);
    formData.append('image3', image3);
    formData.append('image4', image4);
    formData.append('image5', image5);
    // return this.httpClient.post<any>(this.saveProductImage, formData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/updateImages', formData, {headers});
  }

  getAllAttributes(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'attribute/getCategoryBasicProductAttribute', payloard, {headers});
  }

  getnonActiveProduct(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/nonActiveProducts', formData, {headers});
  }

  getnonActiveProductCount(businessName, UserID) {
    console.log(businessName);
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getAllNonActiveProductCount', formData, {headers});
  }

  // getAllActiveProductList(businessName, UserID) {
  //   const formData: FormData = new FormData();
  //   formData.append('businessName', businessName);
  //   formData.append('categoryUID ', UserID);
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  //   return this.httpClient.post<any>(this.SERVER + 'product/getAllActiveProductList', formData, {headers});
  // }
  getConsignmentProducts(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getConsignmentProductsByVendor', payLoard, {headers});
  }

  getEditFieldsDataAll(role, userID) {
    const formData: FormData = new FormData();
    formData.append('role', role);
    formData.append('userID ', userID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/getNoneActiveProducts', formData, {headers});
  }

  getnonActiveImageProduct(role, userID) {
    const formData: FormData = new FormData();
    formData.append('role', role);
    formData.append('userID ', userID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/editProductImageList', formData, {headers});
  }

  ApproveProduct(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/approveProduct', payloard, {headers});
  }

  getPartnerAll() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/viewAllPartnersBusinessName', {headers});
  }

  getPartnerAllCategoryWise(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/viewAllPartnersCategoryWise', payloard, {headers});
  }

  getSelecedProductByEdit(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getProduct', payloard, {headers});
  }

  getImageForEdit(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/takeProductImage', payloard, {headers});
  }

  getEditedImageForEdit(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/getProductImage', payloard, {headers});
  }

  nonActiveProductsByCompanyName(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/nonActiveProductsByCompanyName', payloard, {headers});
  }

  getPartnersQrImage(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getProductQRList', payloard, {headers});

  }

  getSpecialGiftsByPrefixSet2(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/specialGiftByVendorNameAndPrefix', payLoard, {headers});
  }

  getSpecialGiftsByPrefix(pageNo, businessName: any, names) {
    const formData: FormData = new FormData();
    formData.append('pageNo', pageNo);
    formData.append('partner_u_id ', businessName);
    // formData.append('names ', 'pizzahut,java');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/specialGiftsByPrefixInPage', formData, {headers});
  }

  qaChecked(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/approveQualityAssurance', payLoard, {headers});
  }

  getQaApprovedAllProductsById(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getQaApprovedAllProducts', payLoard, {headers});
  }

  getAttributes(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'attribute/getCategoryBasicProductAttribute', payloard, {headers});
  }

  editField(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/save', payloard, {headers});
  }

  editShipmentField(data: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/saveEditShipmentField', data, {headers});
  }

  editAdminSave(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'genaralutill/doSimpleColumnUpdate', payloard, {headers});
  }


  editFieldImageSave(image1: any, image2: any, image3: any, image4: any, image5: any, id: any) {
    const formData: FormData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('product_code', id);
    formData.append('image3', image3);
    formData.append('image4', image4);
    formData.append('image5', image5);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/editImages', formData, {headers});
  }



  getEditFieldsDataAllForApproval(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/getEditProductByCode', payloard, {headers});
  }

  getEditFieldsImageDataAllForApproval(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/getProductImage', payloard, {headers});
  }

  approveFields(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/approved', payloard, {headers});
  }

  approveImageFields(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/approveImages', payloard, {headers});
  }

  rejectImageFields(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/rejectImages', payloard, {headers});
  }

  rejectFields(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'fieldEdit/rejectEditItem', payloard, {headers});
  }

  getCategoryWisePartners(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    // return this.httpClient.post<any>(this.SERVER + 'partner/viewAllPartnersCategoryWise',payloard, {headers});
    return this.httpClient.post<any>(this.SERVER + 'partner/viewAllPartnersCategoryWise', payloard, {headers});
  }

  getCategoryWiseProducts(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getNonActiveProductsCategoryWise', payLoard, {headers});
  }

  getAllProducts(pageNo, partnerID, pageSize: any) {
    const formData: FormData = new FormData();
    formData.append('pageNo', pageNo);
    formData.append('partner_u_id ', partnerID);
    formData.append('pageSize ', pageSize);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getAllActiveProducts', formData, {headers});
  }

  // getAllProductsByCatManager(payLoard) {
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  //   return this.httpClient.post<any>(this.SERVER + 'product/getAllProductsByCatManager', payLoard, {headers});
  // }

  // getConsignmentProducts(payLoard) {
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  //   return this.httpClient.post<any>(this.SERVER + 'product/getConsignmentProductsByVendor', payLoard, {headers});
  // }

  getOnDemandProduct(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getOnDemandProduct', payLoard, {headers});
  }

  updateStock(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/updateConsignmentProductsVirtualStock', payload, {headers});
  }

  getOutofStockofVendor(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getOutStockProdutList', formData, {headers});
  }

  getSuspendedProofVendor(businessName, UserID) {
    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getSuspendProdutList', formData, {headers});
  }

  rejectProduct(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/rejectProduct', payload, {headers});
  }

  updateProductStock(payLoad) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'productOut/setStockOut', payLoad, {headers});
  }

  // updateAvailability(payLoad){
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  //   return this.httpClient.post<any>(this.SERVER + 'productOut/setAvailability', payLoad, {headers});
  // }

  getProductPrices(payLoad) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getProductPrices', payLoad, {headers});
  }

  getAllColorsForVariation() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'product/getAllColors', {headers});
  }

  getProductVariation(payLoad) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getProductVariation', payLoad, {headers});
  }

  deleteProduct(payLoad) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.delete<any>(this.SERVER + 'product/removeProduct', {
      headers: headers,
      body: payLoad
    });
  }

  productSearchWithContext(context: string, payLoad) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/productSearch/' + context, payLoad, {headers});
  }
}
