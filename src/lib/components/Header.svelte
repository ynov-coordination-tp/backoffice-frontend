<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { Bell, Search } from 'lucide-svelte';
  import type { NotificationItem } from '$lib/types/notifications';

  export let title: string;
  export let subtitle: string | undefined = undefined;
  export let showSearch = true;
  export let search = '';
  export let searchPlaceholder = 'Rechercher...';

  export let showNotifications = true;
  export let notifications: NotificationItem[] = [];

  let isNotificationsOpen = false;
  let menuEl: HTMLDivElement | null = null;
  let buttonEl: HTMLButtonElement | null = null;

  const dispatch = createEventDispatcher<{
    markAllRead: void;
    markRead: string;
  }>();

  $: unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = () => {
    isNotificationsOpen = !isNotificationsOpen;
    if (isNotificationsOpen) {
      dispatch('markAllRead');
    }
  };

  onMount(() => {
    if (typeof document === 'undefined') return;

    const onDocClick = (event: MouseEvent) => {
      if (!isNotificationsOpen) return;
      const target = event.target as Node;
      if (menuEl?.contains(target) || buttonEl?.contains(target)) return;
      isNotificationsOpen = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNotificationsOpen) {
        isNotificationsOpen = false;
      }
    };

    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  onDestroy(() => {
    isNotificationsOpen = false;
  });
</script>

<header class="bg-white border-b border-slate-200 sticky top-0 z-20">
  <div class="px-8 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{title}</h1>
        {#if subtitle}
          <p class="text-sm text-slate-500 mt-1">{subtitle}</p>
        {/if}
      </div>

      <div class="flex items-center space-x-4">
        {#if showSearch}
          <div class="hidden md:flex relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              bind:value={search}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              class="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        {/if}

        {#if showNotifications}
          <div class="relative">
            <button
              bind:this={buttonEl}
              class="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              type="button"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={isNotificationsOpen}
              on:click={toggleNotifications}
            >
              <Bell class="w-5 h-5" />
              {#if unreadCount > 0}
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true"></span>
              {/if}
            </button>

            {#if isNotificationsOpen}
              <div
                bind:this={menuEl}
                role="menu"
                class="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl z-20"
              >
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div class="text-sm font-semibold text-slate-900">Notifications</div>
                  {#if notifications.length > 0}
                    <button
                      type="button"
                      class="text-xs text-slate-500 hover:text-slate-700"
                      on:click={() => dispatch('markAllRead')}
                    >
                      Tout marquer lu
                    </button>
                  {/if}
                </div>

                {#if notifications.length === 0}
                  <div class="px-4 py-6 text-sm text-slate-500">Aucune notification</div>
                {:else}
                  <ul class="max-h-80 overflow-auto">
                    {#each notifications as n (n.id)}
                      <li>
                        <button
                          type="button"
                          class={`w-full text-left px-4 py-3 transition-colors ${n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/60 hover:bg-blue-50'}`}
                          on:click={() => dispatch('markRead', n.id)}
                        >
                          <div class="flex items-start gap-3">
                            <span class={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-500'}`} aria-hidden="true"></span>
                            <div class="min-w-0">
                              <div class="text-sm font-medium text-slate-900">{n.title}</div>
                              <div class="text-xs text-slate-600 mt-1">{n.description}</div>
                              <div class="text-[11px] text-slate-400 mt-1">{n.date}</div>
                            </div>
                          </div>
                        </button>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/if}
          </div>
        {/if}

        <slot />
      </div>
    </div>
  </div>
</header>
