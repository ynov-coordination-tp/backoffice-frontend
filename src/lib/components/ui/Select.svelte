<script lang="ts">
  import { nextId } from '$lib/utils/uid';

  type Option = { value: string; label: string };

  export let label: string | undefined = undefined;
  export let options: Option[] = [];
  export let error: string | undefined = undefined;
  export let className = '';
  export let value: string | undefined = undefined;
  export let id: string | undefined = undefined;

  const fallbackId = nextId('select');
  let selectId = id ?? fallbackId;
  let errorId = `${selectId}-error`;

  $: selectId = id ?? fallbackId;
  $: errorId = `${selectId}-error`;
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        id={selectId}
        bind:value
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        class={`mt-1.5 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
        {...$$restProps}
      >
        {#each options as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </label>
  {:else}
    <select
      id={selectId}
      bind:value
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? errorId : undefined}
      class={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
      {...$$restProps}
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {/if}
  {#if error}
    <p id={errorId} class="mt-1 text-xs text-red-600">{error}</p>
  {/if}
</div>
