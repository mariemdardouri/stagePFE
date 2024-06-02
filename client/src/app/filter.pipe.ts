import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      const materielMatch = 
      item.categorie?.toLowerCase().includes(searchText) ||
      item.nature?.toLowerCase().includes(searchText) ||
      item.numSerie?.toLowerCase().includes(searchText) ||
      item.numInv?.toLowerCase().includes(searchText) ||
      item.numLot?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText) ||
      item.agent?.toLowerCase().includes(searchText);

      const userMatch =
      item.firstName?.toLowerCase().includes(searchText) ||
      item.lastName?.toLowerCase().includes(searchText) ||
      item.cin?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.phoneNumber?.toLowerCase().includes(searchText) ||
      item.role?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText);

    const requestMatch =
      item.firstName?.toLowerCase().includes(searchText) ||
      item.lastName?.toLowerCase().includes(searchText) ||
      item.cin?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.phoneNumber?.toLowerCase().includes(searchText) ||
      item.role?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText) ||
      (item.responsableSite && (
        item.responsableSite.firstName?.toLowerCase().includes(searchText) ||
        item.responsableSite.lastName?.toLowerCase().includes(searchText) ||
        item.responsableSite.email?.toLowerCase().includes(searchText) ||
        item.responsableSite.cin?.toLowerCase().includes(searchText) ||
        item.responsableSite.phoneNumber?.toLowerCase().includes(searchText) ||
        item.responsableSite.role?.toLowerCase().includes(searchText)
      ));
    
    const missionMatch = 
      item.title?.toLowerCase().includes(searchText) ||
      item.place?.toLowerCase().includes(searchText) ||
      item.dateStart?.toLowerCase().includes(searchText) ||
      item.dateEnd?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText) ||
      item.agentLogistique?.toLowerCase().includes(searchText);
      
    const claimMatch = 
      (item.materiel && (
        item.materiel.categorie?.toLowerCase().includes(searchText) ||
        item.materiel.nature?.toLowerCase().includes(searchText) ||
        item.materiel.numSerie?.toLowerCase().includes(searchText) ||
        item.user.numInv?.toLowerCase().includes(searchText) ||
        item.user.status?.toLowerCase().includes(searchText) 
      )) ||
      (item.user && (
        item.user.firstName?.toLowerCase().includes(searchText) ||
        item.user.lastName?.toLowerCase().includes(searchText) ||
        item.user.cin?.toLowerCase().includes(searchText) ||
        item.user.email?.toLowerCase().includes(searchText) ||
        item.user.phoneNumber?.toLowerCase().includes(searchText) ||
        item.user.role?.toLowerCase().includes(searchText)
      )) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText) ||
      item.createdAt?.toLowerCase().includes(searchText);

    return materielMatch || userMatch || missionMatch || claimMatch || requestMatch;
    }); 
  }

}
