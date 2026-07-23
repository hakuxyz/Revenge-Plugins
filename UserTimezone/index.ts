import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { findByProps } from "@vendetta/metro";

storage.userTimezones ??= {};

let unsubscribe: (() => void) | null = null;

export default {
  onLoad() {
    const Dispatcher = findByProps("dispatch", "subscribe");
    if (!Dispatcher) return;

    unsubscribe = Dispatcher.subscribe("USER_PROFILE_FETCH_SUCCESS", (event: any) => {
      const userId = event.user?.id;
      if (!userId) return;

      const savedOffset = storage.userTimezones[userId];

      if (savedOffset !== undefined) {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const userTime = new Date(utc + (3600000 * savedOffset));

        const timeString = userTime.toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        });

        showToast(
          `🕒 Local time for ${event.user.username}: ${timeString} (UTC${savedOffset >= 0 ? "+" : ""}${savedOffset})`
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
