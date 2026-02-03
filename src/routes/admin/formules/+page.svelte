<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { Package, Plus, Edit2 } from 'lucide-svelte';

  type Formule = {
    id: string;
    name: string;
    tier: 'Basic' | 'Confort' | 'Premium';
    price: string;
    status: 'active' | 'draft';
  };

  const FORMULES: Formule[] = [
    { id: 'F-001', name: 'Athena', tier: 'Premium', price: '€€€', status: 'active' },
    { id: 'F-002', name: 'Zeus', tier: 'Confort', price: '€€', status: 'active' },
    { id: 'F-003', name: 'Poseidon', tier: 'Basic', price: '€', status: 'draft' }
  ];

  const badge = (s: Formule['status']) => (s === 'active' ? { v: 'success', t: 'Actif' } : { v: 'info', t: 'Brouillon' });
</script>

<Header title="Gestion des formules" subtitle="Gérez vos offres et packs (maquette)">
  <Button on:click={() => alert('Maquette : créer une formule')}>
    <Plus class="w-4 h-4 mr-2" />
    Nouvelle formule
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card title="Formules" subtitle="Liste des formules disponibles">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tier</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {#each FORMULES as f (f.id)}
            {@const b = badge(f.status)}
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                <div class="flex items-center gap-2"><Package class="w-4 h-4 text-slate-400" /> {f.name}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{f.tier}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{f.price}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Badge variant={b.v}>{b.t}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <Button variant="ghost" size="sm" on:click={() => alert('Maquette : éditer ' + f.name)}>
                  <Edit2 class="w-4 h-4" />
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
