export class User {
  contactPersonName: string;
  nic: string;
  companyName: string;
  userName: string;
  email: string;
  contactNo: number;
  password: string;
  role: string;


  constructor(contactPersonName: string, nic: string, companyName: string, userName: string, email: string, contactNo: number, password: string, role: string) {
    this.contactPersonName = contactPersonName;
    this.nic = nic;
    this.companyName = companyName;
    this.userName = userName;
    this.email = email;
    this.contactNo = contactNo;
    this.password = password;
    this.role = role;
  }
}
