// index.ts
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { findByProps } from "@vendetta/metro";
storage.userTimezones ??= {};
var unsubscribe = null;
var index_default = {
  onLoad() {
    const Dispatcher = findByProps("dispatch", "subscribe");
    if (!Dispatcher) return;
    unsubscribe = Dispatcher.subscribe("USER_PROFILE_FETCH_SUCCESS", (event) => {
      const userId = event.user?.id;
      if (!userId) return;
      const savedOffset = storage.userTimezones[userId];
      if (savedOffset !== void 0) {
        const now = /* @__PURE__ */ new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 6e4;
        const userTime = new Date(utc + 36e5 * savedOffset);
        const timeString = userTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
        showToast(
          `\u{1F552} Local time for ${event.user.username}: ${timeString} (UTC${savedOffset >= 0 ? "+" : ""}${savedOffset})`
        );
      }
    });
    showToast("User Timezone plugin started!");
  },
  onUnload() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }
};
export {
  index_default as default
};
