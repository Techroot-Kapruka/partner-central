import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

export interface CanComponentDeactivate {
    canDeactivate: () => Promise<boolean>;
}

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    async canDeactivate(
        component: CanComponentDeactivate
    ): Promise<boolean> {
        return component.canDeactivate ? await component.canDeactivate() : true;
    }

}
