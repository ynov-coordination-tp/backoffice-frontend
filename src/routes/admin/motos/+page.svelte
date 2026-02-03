<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { Bike, Plus, Edit2, Trash2 } from 'lucide-svelte';

  type Moto = {
    id: string;
    model: string;
    category: 'Roadster' | 'Trail' | 'GT';
    dailyPrice: number;
    status: 'available' | 'maintenance';
  };

  const motos: Moto[] = [
    { id: 'M-001', model: 'BMW R1250 GS', category: 'Trail', dailyPrice: 160, status: 'available' },
    { id: 'M-002', model: 'Ducati Multistrada V4', category: 'Trail', dailyPrice: 190, status: 'maintenance' },
    { id: 'M-003', model: 'Yamaha Tracer 9 GT', category: 'GT', dailyPrice: 140, status: 'available' },
    { id: 'M-004', model: 'Triumph Street Triple', category: 'Roadster', dailyPrice: 120, status: 'available' }
  ];

  const badge = (s: Moto['status']) => (s === 'available' ? 'success' : 'warning');
  const label = (s: Moto['status']) => (s === 'available' ? 'Disponible' : 'Maintenance');
</script>

<Header title="Prix des motos" subtitle="Gérez la flotte et les tarifs journaliers">
  <Button>
    <Plus class="w-4 h-4 mr-2" />
    Ajouter une moto
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card title="Tarifs" subtitle={`${motos.length} moto(s)`}>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Modèle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix/jour</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {#each motos as m, idx (m.id)}
            <tr class={`hover:bg-slate-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{m.id}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                <div class="flex items-center gap-2">
                  <Bike class="w-4 h-4 text-slate-400" />
                  {m.model}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{m.category}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{m.dailyPrice} €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm"><Badge variant={badge(m.status)}>{label(m.status)}</Badge></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <div class="inline-flex items-center gap-1">
                  <button class="p-2 rounded hover:bg-slate-100 text-slate-500" type="button" aria-label="Éditer">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button class="p-2 rounded hover:bg-red-50 text-red-500" type="button" aria-label="Supprimer">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
