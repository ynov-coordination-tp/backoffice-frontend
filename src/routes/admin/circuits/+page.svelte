<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { Map, Plus, Eye, Edit2 } from 'lucide-svelte';

  type Circuit = {
    id: string;
    name: string;
    region: string;
    duration: string;
    difficulty: 'Facile' | 'Moyen' | 'Difficile';
    priceFrom: string;
  };

  const circuits: Circuit[] = [
    { id: 'C-001', name: 'Route des Alpes', region: 'Alpes', duration: '7 jours', difficulty: 'Difficile', priceFrom: '2 450 €' },
    { id: 'C-002', name: 'Corse Sauvage', region: 'Corse', duration: '5 jours', difficulty: 'Moyen', priceFrom: '3 100 €' },
    { id: 'C-003', name: 'Auvergne Volcanique', region: 'Auvergne', duration: '4 jours', difficulty: 'Facile', priceFrom: '1 250 €' }
  ];

  const diffVar = (d: Circuit['difficulty']) => (d === 'Difficile' ? 'error' : d === 'Moyen' ? 'warning' : 'success');

  let search = '';

  $: filtered = circuits.filter((c) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.duration.toLowerCase().includes(q) ||
      c.difficulty.toLowerCase().includes(q) ||
      c.priceFrom.toLowerCase().includes(q)
    );
  });
</script>

<Header title="Gestion des circuits" subtitle="Créez et maintenez vos parcours proposés à la réservation" bind:search>
  <Button>
    <Plus class="w-4 h-4 mr-2" />
    Nouveau circuit
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card title="Circuits" subtitle={`${filtered.length} circuit(s)`}>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Région</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Durée</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulté</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">À partir de</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {#each filtered as c}
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.region}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.duration}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm"><Badge variant={diffVar(c.difficulty)}>{c.difficulty}</Badge></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.priceFrom}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <div class="inline-flex items-center gap-1">
                  <button class="p-2 rounded hover:bg-slate-100 text-slate-500" type="button" aria-label="Voir"><Eye class="w-4 h-4" /></button>
                  <button class="p-2 rounded hover:bg-slate-100 text-slate-500" type="button" aria-label="Éditer"><Edit2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filtered.length === 0}
        <div class="text-center py-12 text-slate-500 text-sm">Aucune donnée disponible</div>
      {/if}
    </div>
  </Card>

  <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white" noPadding={false}>
    <div class="flex items-center gap-4">
      <div class="bg-blue-600 p-3 rounded-xl"><Map class="w-6 h-6" /></div>
      <div>
        <div class="font-semibold">Astuce</div>
        <div class="text-slate-200 text-sm">Structure tes circuits en étapes (jours, hôtels, points d'intérêt) pour que la génération de devis soit 100% automatique.</div>
      </div>
    </div>
  </Card>
</div>
