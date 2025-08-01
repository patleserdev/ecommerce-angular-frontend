export const links = [
    { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'customer'] },
    { path: '/dashboard/categories', label: 'Catégories', roles: ['admin'] },
    { path: '/dashboard/brands', label: 'Marques' , roles: ['admin']},
    { path: '/dashboard/products', label: 'Produits' , roles: ['admin']},
    { path: '/dashboard/orders', label: 'Commandes', roles: ['admin'] },
    { path: '/dashboard/invoices', label: 'Factures', roles: ['admin'] },
    { path: '/dashboard/medias', label: 'Médiathèque', roles: ['admin'] },
  ];

  export type linksType ={
    path:string,
    label:string,
    roles:[string]
  }
