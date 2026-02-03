<script lang="ts">
  export type Option = { value: string; label: string };

  export let label: string | undefined = undefined;
  export let options: Option[] = [];
  export let error: string | undefined = undefined;
  export let className = '';
  export let value: string | undefined = undefined;
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
  {/if}
  <select
    bind:value
    class={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
    {...$$restProps}
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if error}
    <p class="mt-1 text-xs text-red-600">{error}</p>
  {/if}
</div>
