<script lang="ts">
  export let label: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let className = '';
  // value binding is through bind:value on the component, so we need to export value
  export let value: string | number | undefined = undefined;
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
  {/if}
  <div class="relative">
    <slot name="icon" />
    <input
      bind:value
      class={`block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
      {...$$restProps}
    />
  </div>
  {#if error}
    <p class="mt-1 text-xs text-red-600">{error}</p>
  {/if}
</div>
