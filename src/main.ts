import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
  //disable right click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    //disable f12
    switch (e.key){
      case 'F12': {
        e.preventDefault();
        break;
      }
    }
  });
  // if(window){
  //   window.console.log=function(){};
  //   window.console.error=function(){};
  //   window.console.warn=function(){};
  // }
}else {
  // if(window){
  //   window.console.log=function(){};
  //   window.console.error=function(){};
  //   window.console.warn=function(){};
  // }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
