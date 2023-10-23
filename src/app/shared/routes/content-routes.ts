import {Routes} from '@angular/router';
import {AuthGuard} from "../../auth.guard";

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'filess',
    loadChildren: () => import('../../components/file/file.module').then(m => m.FileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule),
    data: {
      breadcrumb: 'Products'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('../../components/orders/orders.module').then(m => m.OrdersModule),
    data: {
      breadcrumb: 'Orders'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: 'Users'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('../../components/payment/payment.module').then(m => m.PaymentModule),
    data: {
      breadcrumb: 'Payment'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'shipment',
    loadChildren: () => import('../../components/shipment/shipment.module').then(m => m.ShipmentModule),
    data: {
      breadcrumb: 'Shipment'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    loadChildren: () => import('../../components/category/category.module').then(m => m.CategoryModule),
    data: {
      breadcrumb: 'Category'
    }
  },
  {
    path: 'report',
    loadChildren: () => import('../../components/report/report.module').then(m => m.ReportModule),
    data: {
      breadcrumb: 'Category Report'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'po-list',
    loadChildren: () => import('../../components/accounts/accounts.module').then(m => m.AccountsModule),
    data: {
      breadcrumb: 'PO List'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'sales-order-list',
    loadChildren: () => import('../../components/accounts/accounts.module').then(m => m.AccountsModule),
    data: {
      breadcrumb: 'Sales Order List'
    },
    canActivate: [AuthGuard]
  }
];
