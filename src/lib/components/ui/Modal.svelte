<script lang="ts">
  import { onDestroy, createEventDispatcher, tick } from 'svelte';
  import { X } from 'lucide-svelte';
  import { nextId } from '$lib/utils/uid';

  type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

  export let isOpen: boolean;
  export let title: string;
  export let size: ModalSize = 'md';

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const titleId = nextId('modal-title');

  let dialogEl: HTMLDivElement | null = null;
  let previouslyFocused: HTMLElement | null = null;
  let previousOverflow: string | null = null;
  let wasOpen = false;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const dispatch = createEventDispatcher<{ close: void }>();

  const focusDialog = async () => {
    await tick();
    dialogEl?.focus();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      dispatch('close');
      return;
    }

    if (event.key !== 'Tab' || !dialogEl || typeof document === 'undefined') return;

    const focusables = Array.from(dialogEl.querySelectorAll<HTMLElement>(focusableSelector));
    if (focusables.length === 0) {
      event.preventDefault();
      dialogEl.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  $: if (isOpen && !wasOpen) {
    wasOpen = true;

    if (typeof document !== 'undefined') {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      focusDialog();
    }
  } else if (!isOpen && wasOpen) {
    wasOpen = false;

    if (typeof document !== 'undefined') {
      if (previousOverflow !== null) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = null;
      }

      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  }

  onDestroy(() => {
    if (typeof document !== 'undefined' && previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
    }
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <button
      type="button"
      aria-label="Close"
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      on:click={() => dispatch('close')}
    ></button>

    <div
      bind:this={dialogEl}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabindex="-1"
      on:keydown={handleKeydown}
      class={`relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-2xl transform transition-all duration-200 flex flex-col max-h-[90vh]`}
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 id={titleId} class="text-lg font-semibold text-slate-900">{title}</h3>
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="text-slate-400 hover:text-slate-500 hover:bg-slate-100 p-1 rounded-full transition-colors"
          aria-label="Close"
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
