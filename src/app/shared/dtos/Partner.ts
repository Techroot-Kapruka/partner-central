export class Partner {
  businessName: string;
  businessRegisterNo: string;
  ownerName: string;
  emailbuss: string;
  mobile: string;
  businessAddress: string;
  bankAccount: string;
  bankName: string;
  creditCardSave: string;
  PartnerType: string;
  productPrefix: string;
  partner_u_id: string;


  constructor(businessName: string, businessRegisterNo: string, ownerName: string, emailbuss: string, mobile: string, businessAddress: string, bankAccount: string, bankName: string, creditCardSave: string, PartnerType: string, productPrefix: string, partner_u_id: string) {
    this.businessName = businessName;
    this.businessRegisterNo = businessRegisterNo;
    this.ownerName = ownerName;
    this.emailbuss = emailbuss;
    this.mobile = mobile;
    this.businessAddress = businessAddress;
    this.bankAccount = bankAccount;
    this.bankName = bankName;
    this.creditCardSave = creditCardSave;
    this.PartnerType = PartnerType;
    this.productPrefix = productPrefix;
  }
}
