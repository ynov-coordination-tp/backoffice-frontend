<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { Menu } from 'lucide-svelte';

  let isSidebarOpen = false;
</script>

<div class="min-h-screen bg-slate-50 flex font-sans text-slate-900">
  <Sidebar isOpen={isSidebarOpen} on:close={() => (isSidebarOpen = false)} />
  <button
    type="button"
    class="md:hidden fixed top-4 left-4 z-40 rounded-lg bg-white/90 backdrop-blur px-3 py-2 shadow border border-slate-200 text-slate-700 hover:bg-white"
    aria-label="Ouvrir le menu"
    on:click={() => (isSidebarOpen = true)}
  >
    <Menu class="w-5 h-5" />
  </button>
  <main class="flex-1 min-h-screen md:ml-64">
    <slot />
  </main>
</div>
