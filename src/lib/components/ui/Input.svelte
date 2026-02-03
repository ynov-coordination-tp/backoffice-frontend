<script lang="ts">
  import { nextId } from '$lib/utils/uid';

  export let label: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let className = '';
  // value binding is through bind:value on the component, so we need to export value
  export let value: string | number | undefined = undefined;
  export let id: string | undefined = undefined;

  const fallbackId = nextId('input');
  let inputId = id ?? fallbackId;
  let errorId = `${inputId}-error`;

  $: inputId = id ?? fallbackId;
  $: errorId = `${inputId}-error`;
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div class="relative mt-1.5">
        <slot name="icon" />
        <input
          id={inputId}
          bind:value
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          class={`block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
          {...$$restProps}
        />
      </div>
    </label>
  {:else}
    <div class="relative">
      <slot name="icon" />
      <input
        id={inputId}
        bind:value
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        class={`block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 transition-colors duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'} ${className}`}
        {...$$restProps}
      />
    </div>
  {/if}
  {#if error}
    <p id={errorId} class="mt-1 text-xs text-red-600">{error}</p>
  {/if}
</div>
