import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.component.html'
})
export class DeliveryCheckoutComponent {
  addresses = [
    { id: 1, label: 'Maison', full: '12 rue de la Paix, 75002 Paris' },
    { id: 2, label: 'Travail', full: '5 avenue de la République, 75011 Paris' },
  ];

  carriers = [
    { id: 1, name: 'Colissimo', description: 'Livraison à domicile en 48h', price: 5 },
    { id: 2, name: 'Mondial Relay', description: 'Livraison en point relais', price: 3 },
    { id: 3, name: 'Chronopost', description: 'Livraison express en 24h', price: 10 },
  ];

  selectedAddress: number | null = null;
  billingSameAsDelivery = true;
  selectedCarrier: number | null = null;

  confirmSelection() {
    console.log('Adresse livraison:', this.selectedAddress);
    console.log('Adresse facturation identique:', this.billingSameAsDelivery);
    console.log('Transporteur:', this.selectedCarrier);
  }
}
