
import {Watcher} from "./watcher";
import * as actions from "../actions";

import mklog from "../util/log";
const log = mklog("reactors/perf");
import {opts} from "../logger";

let prebootTime: number;
let bootTime: number;
let loginTime: number;
let pageTime: number;
let done = false;

export default function (watcher: Watcher) {
  watcher.on(actions.preboot, async (store, action) => {
    prebootTime = Date.now();
  });

  watcher.on(actions.boot, async (store, action) => {
    bootTime = Date.now();
  });

  watcher.on(actions.loginSucceeded, async (store, action) => {
    loginTime = Date.now();
  });

  watcher.on(actions.firstUsefulPage, async (store, action) => {
    if (done) {
      return;
    }
    done = true;

    pageTime = Date.now();
    log(opts, `preboot -> boot        = ${(bootTime - prebootTime)} ms`);
    log(opts, `boot    -> login       = ${(loginTime - bootTime)} ms`);
    log(opts, `login   -> first page  = ${(pageTime - loginTime)} ms`);
    
    if (process.env.PROFILE_REQUIRE === "1") {
      store.dispatch(actions.quit({}));
    }
  });
}
