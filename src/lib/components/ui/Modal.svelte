<script lang="ts">
  import { onDestroy, createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';

  export let isOpen: boolean;
  export let title: string;
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // lock scroll when open
  $: {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }
  }

  onDestroy(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = 'unset';
  });

  const dispatch = createEventDispatcher<{ close: void }>();
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <button
      type="button"
      aria-label="Close"
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      on:click={() => dispatch('close')}
    />

    <div class={`relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-2xl transform transition-all duration-200 flex flex-col max-h-[90vh]`}>
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 class="text-lg font-semibold text-slate-900">{title}</h3>
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="text-slate-400 hover:text-slate-500 hover:bg-slate-100 p-1 rounded-full transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}
