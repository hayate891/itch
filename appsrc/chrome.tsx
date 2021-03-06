// This file is the entry point for renderer processes

import "./boot/env";
import "./boot/bluebird";
import "./boot/fs";
import "./boot/env";
import "./boot/sniff-language";

import os from "./util/os";

import * as React from "react";
import * as ReactDOM from "react-dom";

let AppContainer: React.ComponentClass<void> = null;
try {
  const rhl = require("react-hot-loader");
  AppContainer = rhl.AppContainer;
} catch (e) { /* muffin */ }

import * as electron from "electron";
import App from "./components/app";

import store from "./store/chrome-store";

import setupShortcuts from "./shortcuts";

require("./style/bundle.scss");

let appNode: Element;

function render (RealApp: typeof App) {
  appNode = document.querySelector("#app");
  let rootComponent: JSX.Element;
  if (AppContainer) {
    rootComponent = <AppContainer>
      <RealApp/>
    </AppContainer>;
  } else {
    rootComponent = <RealApp/>;
  }
  ReactDOM.render(rootComponent, appNode);
}

document.addEventListener("DOMContentLoaded", () => {
  setupShortcuts(store);
  render(App);

  if ((module as any).hot) {
    (module as any).hot.accept("./components/app", () => {
      const NextApp = require("./components/app").default;
      render(NextApp);
    });
  }
});

window.addEventListener("beforeunload", () => {
  if (appNode) {
    ReactDOM.unmountComponentAtNode(appNode);
    appNode = null;
  }
});

// open actual link elements in external browser

document.addEventListener("click", (e: MouseEvent) => {
  let target = e.target as Element;

  while (target && target.tagName !== "A") {
    target = target.parentNode as Element;
  }

  if (target) {
    e.preventDefault();
    electron.remote.shell.openExternal((target as HTMLLinkElement).href);
    return false;
  }
});

// disable two-finger zoom on macOS

if (os.platform() === "darwin") {
  try {
    electron.webFrame.setVisualZoomLevelLimits(1, 1);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(`couldn't disable two-finger zoom: ${e.stack || e}`);
  }
}
