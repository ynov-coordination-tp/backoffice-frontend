<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { Plus, Eye, Edit2 } from 'lucide-svelte';

  type Option = { value: string; label: string };
  type Circuit = {
    id: string;
    name: string;
    region: string;
    duration: string;
    difficulty: 'Facile' | 'Moyen' | 'Difficile';
    priceFrom: string;
  };

  let circuits: Circuit[] = [
    { id: 'C-001', name: 'Route des Alpes', region: 'Alpes', duration: '7 jours', difficulty: 'Difficile', priceFrom: '2 450 €' },
    { id: 'C-002', name: 'Corse Sauvage', region: 'Corse', duration: '5 jours', difficulty: 'Moyen', priceFrom: '3 100 €' },
    { id: 'C-003', name: 'Auvergne Volcanique', region: 'Auvergne', duration: '4 jours', difficulty: 'Facile', priceFrom: '1 250 €' }
  ];

  const diffVar = (d: Circuit['difficulty']) => (d === 'Difficile' ? 'error' : d === 'Moyen' ? 'warning' : 'success');

  const difficultyOptions: Option[] = [
    { value: 'Facile', label: 'Facile' },
    { value: 'Moyen', label: 'Moyen' },
    { value: 'Difficile', label: 'Difficile' }
  ];

  let isCreateModalOpen = false;
  let createForm: Omit<Circuit, 'id'> = {
    name: '',
    region: '',
    duration: '',
    difficulty: 'Facile',
    priceFrom: ''
  };

  let isEditModalOpen = false;
  let currentCircuitId: string | null = null;
  let editForm: Omit<Circuit, 'id'> = {
    name: '',
    region: '',
    duration: '',
    difficulty: 'Facile',
    priceFrom: ''
  };

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

  const nextCircuitId = () => {
    const max = circuits.reduce((acc, c) => {
      const numeric = Number(c.id.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
    }, 0);
    return `C-${String(max + 1).padStart(3, '0')}`;
  };

  const resetCreateForm = () => {
    createForm = {
      name: '',
      region: '',
      duration: '',
      difficulty: 'Facile',
      priceFrom: ''
    };
  };

  function handleCreateOpen() {
    resetCreateForm();
    isCreateModalOpen = true;
  }

  function handleCreateSave() {
    circuits = [...circuits, { ...createForm, id: nextCircuitId() }];
    isCreateModalOpen = false;
  }

  function handleEditOpen(c: Circuit) {
    currentCircuitId = c.id;
    editForm = {
      name: c.name,
      region: c.region,
      duration: c.duration,
      difficulty: c.difficulty,
      priceFrom: c.priceFrom
    };
    isEditModalOpen = true;
  }

  function handleEditSave() {
    if (!currentCircuitId) return;
    circuits = circuits.map((c) =>
      c.id === currentCircuitId ? { ...c, ...editForm } : c
    );
    isEditModalOpen = false;
    currentCircuitId = null;
  }
</script>

<Header title="Gestion des circuits" subtitle="Créez et maintenez vos parcours proposés à la réservation" bind:search>
  <Button on:click={handleCreateOpen}>
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
                  <button
                    class="p-2 rounded hover:bg-slate-100 text-slate-500"
                    type="button"
                    aria-label="Éditer"
                    on:click={() => handleEditOpen(c)}
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
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
</div>

<Modal isOpen={isCreateModalOpen} title="Ajouter un circuit" size="lg" on:close={() => (isCreateModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Nom" placeholder="Route des Alpes" bind:value={createForm.name} />
    <Input label="Région" placeholder="Alpes" bind:value={createForm.region} />
    <Input label="Durée" placeholder="7 jours" bind:value={createForm.duration} />
    <Select label="Difficulté" options={difficultyOptions} bind:value={createForm.difficulty} />
    <Input label="À partir de" placeholder="2 450 €" bind:value={createForm.priceFrom} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isCreateModalOpen = false)}>Annuler</Button>
    <Button on:click={handleCreateSave}>Ajouter</Button>
  </div>
</Modal>

<Modal isOpen={isEditModalOpen} title="Modifier le circuit" size="lg" on:close={() => (isEditModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Nom" placeholder="Route des Alpes" bind:value={editForm.name} />
    <Input label="Région" placeholder="Alpes" bind:value={editForm.region} />
    <Input label="Durée" placeholder="7 jours" bind:value={editForm.duration} />
    <Select label="Difficulté" options={difficultyOptions} bind:value={editForm.difficulty} />
    <Input label="À partir de" placeholder="2 450 €" bind:value={editForm.priceFrom} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isEditModalOpen = false)}>Annuler</Button>
    <Button on:click={handleEditSave}>Enregistrer</Button>
  </div>
</Modal>
