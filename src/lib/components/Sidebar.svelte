<script lang="ts">
  import { page } from '$app/stores';
  import { Bike, FileText, LayoutDashboard, LogOut, Map, Package, Settings } from 'lucide-svelte';

  const menuItems = [
    { href: '/admin', label: 'Tableau de bord', Icon: LayoutDashboard },
    { href: '/admin/devis', label: 'Gestion des devis', Icon: FileText },
    { href: '/admin/motos', label: 'Prix des motos', Icon: Bike },
    { href: '/admin/circuits', label: 'Gestion des circuits', Icon: Map },
    { href: '/admin/formules', label: 'Gestion des formules', Icon: Package }
  ] as const;

  const isActive = (href: string, currentPath: string) => (href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(href));
</script>

<aside class="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl z-30">
  <div class="p-6 border-b border-slate-700/50">
    <div class="flex items-center space-x-3">
      <div class="bg-blue-600 p-2 rounded-lg">
        <Bike class="w-6 h-6 text-white" />
      </div>
      <span class="text-xl font-bold tracking-tight">Motomamis</span>
    </div>
  </div>

  <nav class="flex-1 py-6 px-3 space-y-1">
    {#each menuItems as item}
      {@const active = isActive(item.href, $page.url.pathname)}
      <a
        href={item.href}
        class={`
          w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
          ${active ? 'bg-white/10 text-white border-l-4 border-blue-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
        `}
      >
        <svelte:component this={item.Icon} class={`w-5 h-5 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="p-4 border-t border-slate-700/50 bg-slate-900/50">
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">JD</div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-white truncate">Jean Dupont</p>
        <p class="text-xs text-slate-400 truncate">Admin</p>
      </div>
    </div>
    <div class="flex space-x-1">
      <button class="flex-1 flex items-center justify-center p-2 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors" type="button">
        <Settings class="w-4 h-4" />
      </button>
      <button class="flex-1 flex items-center justify-center p-2 rounded hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors" type="button">
        <LogOut class="w-4 h-4" />
      </button>
    </div>
  </div>
</aside>
