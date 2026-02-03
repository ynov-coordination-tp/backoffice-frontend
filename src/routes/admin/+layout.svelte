<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="min-h-screen bg-slate-50 flex font-sans text-slate-900">
  <Sidebar />
  <main class="flex-1 ml-64 min-h-screen">
    <slot />
  </main>
</div>
