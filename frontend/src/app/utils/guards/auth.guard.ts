import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TOKEN_CONSTANT } from '../../constants/token';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
    const routerInstance = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        if (!!sessionStorage.getItem(TOKEN_CONSTANT)) {
            return true;
        } else {
            routerInstance.navigateByUrl('/login');
            return false;
        }
    } else {
        return false;
    }
};
