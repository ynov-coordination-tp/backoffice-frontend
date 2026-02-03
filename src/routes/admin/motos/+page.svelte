<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { Bike, Plus, Edit2, Trash2, Eye } from 'lucide-svelte';

  type Option = { value: string; label: string };
  type Moto = {
    id: string;
    model: string;
    category: 'Roadster' | 'Trail' | 'GT';
    dailyPrice: number;
    status: 'available' | 'maintenance';
  };

  let motos: Moto[] = [
    { id: 'M-001', model: 'BMW R1250 GS', category: 'Trail', dailyPrice: 160, status: 'available' },
    { id: 'M-002', model: 'Ducati Multistrada V4', category: 'Trail', dailyPrice: 190, status: 'maintenance' },
    { id: 'M-003', model: 'Yamaha Tracer 9 GT', category: 'GT', dailyPrice: 140, status: 'available' },
    { id: 'M-004', model: 'Triumph Street Triple', category: 'Roadster', dailyPrice: 120, status: 'available' }
  ];

  const badge = (s: Moto['status']) => (s === 'available' ? 'success' : 'warning');
  const label = (s: Moto['status']) => (s === 'available' ? 'Disponible' : 'Maintenance');

  const categoryOptions: Option[] = [
    { value: 'Roadster', label: 'Roadster' },
    { value: 'Trail', label: 'Trail' },
    { value: 'GT', label: 'GT' }
  ];

  const statusOptions: Option[] = [
    { value: 'available', label: 'Disponible' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  let isCreateModalOpen = false;
  let createForm: Omit<Moto, 'id'> = {
    model: '',
    category: 'Roadster',
    dailyPrice: 0,
    status: 'available'
  };

  let isEditModalOpen = false;
  let currentMotoId: string | null = null;
  let currentMotoModel: string | null = null;
  let editForm: Omit<Moto, 'id'> = {
    model: '',
    category: 'Roadster',
    dailyPrice: 0,
    status: 'available'
  };

  let isViewModalOpen = false;
  let currentMoto: Moto | null = null;

  let isDeleteModalOpen = false;

  let search = '';

  $: filtered = motos.filter((m) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      m.id.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      label(m.status).toLowerCase().includes(q)
    );
  });

  const nextMotoId = () => {
    const max = motos.reduce((acc, m) => {
      const numeric = Number(m.id.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
    }, 0);
    return `M-${String(max + 1).padStart(3, '0')}`;
  };

  const resetCreateForm = () => {
    createForm = {
      model: '',
      category: 'Roadster',
      dailyPrice: 0,
      status: 'available'
    };
  };

  function handleCreateOpen() {
    resetCreateForm();
    isCreateModalOpen = true;
  }

  function handleCreateSave() {
    const safePrice = Number.isFinite(createForm.dailyPrice) ? createForm.dailyPrice : 0;
    motos = [...motos, { ...createForm, id: nextMotoId(), dailyPrice: Math.max(0, safePrice) }];
    isCreateModalOpen = false;
  }

  function handleEditOpen(m: Moto) {
    currentMotoId = m.id;
    editForm = {
      model: m.model,
      category: m.category,
      dailyPrice: m.dailyPrice,
      status: m.status
    };
    isEditModalOpen = true;
  }

  function handleEditSave() {
    if (!currentMotoId) return;
    const safePrice = Number.isFinite(editForm.dailyPrice) ? editForm.dailyPrice : 0;
    motos = motos.map((m) =>
      m.id === currentMotoId
        ? { ...m, ...editForm, dailyPrice: Math.max(0, safePrice) }
        : m
    );
    isEditModalOpen = false;
    currentMotoId = null;
  }

  function handleViewOpen(m: Moto) {
    currentMoto = m;
    isViewModalOpen = true;
  }

  function handleDeleteOpen(m: Moto) {
    currentMotoId = m.id;
    currentMotoModel = m.model;
    isDeleteModalOpen = true;
  }

  function handleDeleteConfirm() {
    if (!currentMotoId) return;
    motos = motos.filter((m) => m.id !== currentMotoId);
    isDeleteModalOpen = false;
    currentMotoId = null;
    currentMotoModel = null;
  }
</script>

<Header title="Prix des motos" subtitle="Gérez la flotte et les tarifs journaliers" bind:search>
  <Button on:click={handleCreateOpen}>
    <Plus class="w-4 h-4 mr-2" />
    Ajouter une moto
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card title="Tarifs" subtitle={`${filtered.length} moto(s)`}>
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
          {#each filtered as m, idx (m.id)}
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
                  <button
                    class="p-2 rounded hover:bg-slate-100 text-slate-500"
                    type="button"
                    aria-label="Voir"
                    on:click={() => handleViewOpen(m)}
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 rounded hover:bg-slate-100 text-slate-500"
                    type="button"
                    aria-label="Éditer"
                    on:click={() => handleEditOpen(m)}
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 rounded hover:bg-red-50 text-red-500"
                    type="button"
                    aria-label="Supprimer"
                    on:click={() => handleDeleteOpen(m)}
                  >
                    <Trash2 class="w-4 h-4" />
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

<Modal isOpen={isCreateModalOpen} title="Ajouter une moto" size="lg" on:close={() => (isCreateModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Modèle" placeholder="BMW R1250 GS" bind:value={createForm.model} />
    <Input label="Prix/jour (€)" type="number" min="0" bind:value={createForm.dailyPrice} />
    <Select label="Catégorie" options={categoryOptions} bind:value={createForm.category} />
    <Select label="Statut" options={statusOptions} bind:value={createForm.status} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isCreateModalOpen = false)}>Annuler</Button>
    <Button on:click={handleCreateSave}>Ajouter</Button>
  </div>
</Modal>

<Modal isOpen={isEditModalOpen} title="Modifier la moto" size="lg" on:close={() => (isEditModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Modèle" placeholder="BMW R1250 GS" bind:value={editForm.model} />
    <Input label="Prix/jour (€)" type="number" min="0" bind:value={editForm.dailyPrice} />
    <Select label="Catégorie" options={categoryOptions} bind:value={editForm.category} />
    <Select label="Statut" options={statusOptions} bind:value={editForm.status} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isEditModalOpen = false)}>Annuler</Button>
    <Button on:click={handleEditSave}>Enregistrer</Button>
  </div>
</Modal>

<Modal isOpen={isViewModalOpen} title="Détail de la moto" size="lg" on:close={() => (isViewModalOpen = false)}>
  {#if currentMoto}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div class="text-sm text-slate-500">ID</div>
        <div class="font-semibold">{currentMoto.id}</div>
        <div class="text-sm text-slate-500">Modèle</div>
        <div class="font-semibold">{currentMoto.model}</div>
        <div class="text-sm text-slate-500">Catégorie</div>
        <div class="font-semibold">{currentMoto.category}</div>
      </div>
      <div class="space-y-3">
        <div class="text-sm text-slate-500">Prix/jour</div>
        <div class="font-semibold">{currentMoto.dailyPrice} €</div>
        <div class="text-sm text-slate-500">Statut</div>
        <Badge variant={badge(currentMoto.status)}>{label(currentMoto.status)}</Badge>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <Button variant="secondary" on:click={() => (isViewModalOpen = false)}>Fermer</Button>
      <Button
        on:click={() => {
          const moto = currentMoto;
          if (!moto) return;
          isViewModalOpen = false;
          handleEditOpen(moto);
        }}
      >
        Modifier
      </Button>
    </div>
  {/if}
</Modal>

<Modal isOpen={isDeleteModalOpen} title="Supprimer la moto" size="md" on:close={() => (isDeleteModalOpen = false)}>
  <div class="flex items-start gap-3">
    <div class="text-red-500 font-semibold">!</div>
    <div>
      <p class="font-medium text-slate-900">Confirmer la suppression ?</p>
      <p class="text-sm text-slate-600 mt-1">
        La moto <span class="font-semibold">{currentMotoModel ?? ''}</span> sera supprimée.
      </p>
    </div>
  </div>

  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isDeleteModalOpen = false)}>Annuler</Button>
    <Button variant="danger" on:click={handleDeleteConfirm}>Supprimer</Button>
  </div>
</Modal>
