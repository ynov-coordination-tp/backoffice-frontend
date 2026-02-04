<script lang="ts">
  export let variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' = 'neutral';
  export let className = '';

  const variants: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200'
  };
</script>

<span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
  <slot />
</span>
