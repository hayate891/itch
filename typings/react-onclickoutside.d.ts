
/**
 * Typings for https://github.com/Pomax/react-onclickoutside
 */
declare module 'react-onclickoutside' {
  import * as React from "react";

  function onClickOutside <T> (component: T): T
  export = onClickOutside;
}