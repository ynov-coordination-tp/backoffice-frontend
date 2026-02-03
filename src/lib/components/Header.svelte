<script lang="ts">
  import { Bell, Search } from 'lucide-svelte';

  export let title: string;
  export let subtitle: string | undefined = undefined;
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
        <div class="hidden md:flex relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            class="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>

        <button class="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" type="button">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <slot />
      </div>
    </div>
  </div>
</header>
