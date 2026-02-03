<script lang="ts">
  export let title: string | undefined = undefined;
  export let subtitle: string | undefined = undefined;
  export let className = '';
  export let noPadding = false;
</script>

<div class={`bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden transition-shadow duration-300 hover:shadow-lg ${className}`}>
  {#if title || subtitle}
    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-start">
      <div>
        {#if title}<h3 class="text-lg font-semibold text-slate-900">{title}</h3>{/if}
        {#if subtitle}<p class="text-sm text-slate-500 mt-1">{subtitle}</p>{/if}
      </div>
      <div><slot name="action" /></div>
    </div>
  {/if}
  <div class={noPadding ? '' : 'p-6'}>
    <slot />
  </div>
</div>
