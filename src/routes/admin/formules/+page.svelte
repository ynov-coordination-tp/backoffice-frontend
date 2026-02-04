<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { Package, Plus, Edit2 } from 'lucide-svelte';

  type Option = { value: string; label: string };
  type Formule = {
    id: string;
    name: string;
    tier: 'Basic' | 'Confort' | 'Premium';
    price: string;
    status: 'active' | 'draft';
  };

  let FORMULES: Formule[] = [
    { id: 'F-001', name: 'Athena', tier: 'Premium', price: '€€€', status: 'active' },
    { id: 'F-002', name: 'Zeus', tier: 'Confort', price: '€€', status: 'active' },
    { id: 'F-003', name: 'Poseidon', tier: 'Basic', price: '€', status: 'draft' }
  ];

  type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  const badge = (s: Formule['status']): { v: BadgeVariant; t: string } =>
    s === 'active' ? { v: 'success', t: 'Actif' } : { v: 'info', t: 'Brouillon' };

  const tierOptions: Option[] = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Confort', label: 'Confort' },
    { value: 'Premium', label: 'Premium' }
  ];

  const statusOptions: Option[] = [
    { value: 'active', label: 'Actif' },
    { value: 'draft', label: 'Brouillon' }
  ];

  let isCreateModalOpen = false;
  let createForm: Omit<Formule, 'id'> = {
    name: '',
    tier: 'Basic',
    price: '',
    status: 'draft'
  };

  let isEditModalOpen = false;
  let currentFormuleId: string | null = null;
  let editForm: Omit<Formule, 'id'> = {
    name: '',
    tier: 'Basic',
    price: '',
    status: 'draft'
  };

  let search = '';

  $: filtered = FORMULES.filter((f) => {
    const q = search.trim().toLowerCase();
    const statusLabel = badge(f.status).t.toLowerCase();
    return (
      !q ||
      f.id.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.tier.toLowerCase().includes(q) ||
      f.price.toLowerCase().includes(q) ||
      statusLabel.includes(q)
    );
  });

  const nextFormuleId = () => {
    const max = FORMULES.reduce((acc, f) => {
      const numeric = Number(f.id.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
    }, 0);
    return `F-${String(max + 1).padStart(3, '0')}`;
  };

  const resetCreateForm = () => {
    createForm = {
      name: '',
      tier: 'Basic',
      price: '',
      status: 'draft'
    };
  };

  function handleCreateOpen() {
    resetCreateForm();
    isCreateModalOpen = true;
  }

  function handleCreateSave() {
    FORMULES = [...FORMULES, { ...createForm, id: nextFormuleId() }];
    isCreateModalOpen = false;
  }

  function handleEditOpen(f: Formule) {
    currentFormuleId = f.id;
    editForm = {
      name: f.name,
      tier: f.tier,
      price: f.price,
      status: f.status
    };
    isEditModalOpen = true;
  }

  function handleEditSave() {
    if (!currentFormuleId) return;
    FORMULES = FORMULES.map((f) =>
      f.id === currentFormuleId ? { ...f, ...editForm } : f
    );
    isEditModalOpen = false;
    currentFormuleId = null;
  }
</script>

<Header title="Gestion des formules" subtitle="Gérez vos offres et packs (maquette)" bind:search>
  <Button on:click={handleCreateOpen}>
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
          {#each filtered as f (f.id)}
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
                <Button variant="ghost" size="sm" on:click={() => handleEditOpen(f)}>
                  <Edit2 class="w-4 h-4" />
                </Button>
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

<Modal isOpen={isCreateModalOpen} title="Ajouter une formule" size="lg" on:close={() => (isCreateModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Nom" placeholder="Athena" bind:value={createForm.name} />
    <Select label="Tier" options={tierOptions} bind:value={createForm.tier} />
    <Input label="Prix" placeholder="€€" bind:value={createForm.price} />
    <Select label="Statut" options={statusOptions} bind:value={createForm.status} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isCreateModalOpen = false)}>Annuler</Button>
    <Button on:click={handleCreateSave}>Ajouter</Button>
  </div>
</Modal>

<Modal isOpen={isEditModalOpen} title="Modifier la formule" size="lg" on:close={() => (isEditModalOpen = false)}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Nom" placeholder="Athena" bind:value={editForm.name} />
    <Select label="Tier" options={tierOptions} bind:value={editForm.tier} />
    <Input label="Prix" placeholder="€€" bind:value={editForm.price} />
    <Select label="Statut" options={statusOptions} bind:value={editForm.status} />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isEditModalOpen = false)}>Annuler</Button>
    <Button on:click={handleEditSave}>Enregistrer</Button>
  </div>
</Modal>
