<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import type { NotificationItem } from '$lib/types/notifications';
  import {
    quotesStore,
    loadQuotes,
    deleteQuote,
    updateQuote,
    updateCustomer,
    type Devis,
    type DevisStatus
  } from '$lib/stores/quotes';
  import { QuoteStatus } from '$lib/types/api';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { Download, Edit2, Eye, Filter, Trash2, XCircle } from 'lucide-svelte';

  type Option = { value: string; label: string };
  let devisList: Devis[] = [];

  let filterStatus: 'all' | DevisStatus = 'all';
  let search = '';

  let isEditModalOpen = false;
  let isViewModalOpen = false;
  let isDeleteModalOpen = false;
  let isExportModalOpen = false;

  let currentDevis: Devis | null = null;
  type StatusUi = 'pending_new' | 'pending_progress' | 'sent' | 'confirmed' | 'cancelled';

  let editForm: {
    client: string;
    email: string;
    phone: string;
    status: StatusUi;
  } = {
    client: '',
    email: '',
    phone: '',
    status: 'pending_new'
  };

  const statusOptions: Option[] = [
    { value: 'all', label: 'Tous' },
    { value: 'pending_new', label: 'Non traité' },
    { value: 'pending_progress', label: 'En cours' },
    { value: 'sent', label: 'Envoyé' },
    { value: 'confirmed', label: 'Validé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';

  const statusLabelFor = (devis: Devis): string => {
    switch (devis.status) {
      case 'confirmed':
        return 'Validé';
      case 'cancelled':
        return 'Annulé';
      case 'pending_progress':
        return 'En cours';
      case 'sent':
        return 'Envoyé';
      case 'pending_new':
        return 'Non traité';
      default:
        return 'Inconnu';
    }
  };

  const badgeVariantFor = (devis: Devis): BadgeVariant => {
    switch (devis.status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending_progress':
        return 'warning';
      case 'sent':
        return 'info';
      case 'pending_new':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const makeNotifications = (items: Devis[], readById: Record<string, boolean>): NotificationItem[] =>
    items
      .filter((d) => d.status === 'pending_new' || d.status === 'pending_progress' || d.status === 'sent')
      .map((d) => ({
        id: d.id,
        title: `Devis ${statusLabelFor(d)}`,
        description: `${d.client} - ${d.circuit}`,
        date: d.date,
        read: readById[d.id] ?? false
      }));

  let readById: Record<string, boolean> = {};
  let notifications: NotificationItem[] = [];

  onMount(() => {
    loadQuotes();
  });

  $: devisList = $quotesStore.items;
  $: notifications = makeNotifications(devisList, readById);

  const editStatusOptions: Option[] = [
    { value: 'pending_new', label: 'Non traité' },
    { value: 'pending_progress', label: 'En cours' },
    { value: 'sent', label: 'Envoyé' },
    { value: 'confirmed', label: 'Validé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  $: filtered = devisList.filter((d) => {
    const statusOk = filterStatus === 'all' ? true : d.status === filterStatus;
    const q = search.trim().toLowerCase();
    const searchOk =
      !q ||
      d.id.toLowerCase().includes(q) ||
      d.client.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      d.circuit.toLowerCase().includes(q) ||
      d.formule.toLowerCase().includes(q);
    return statusOk && searchOk;
  });

  function handleView(d: Devis) {
    currentDevis = d;
    isViewModalOpen = true;
  }
  function handleEdit(d: Devis) {
    currentDevis = d;
    editForm = {
      client: d.client,
      email: d.email,
      phone: d.phone,
      status: d.status
    };
    isEditModalOpen = true;
  }
  function handleDelete(d: Devis) {
    currentDevis = d;
    isDeleteModalOpen = true;
  }

  async function handleDeleteConfirm() {
    const apiId = currentDevis?.apiId;
    const id = currentDevis?.id;
    if (!apiId || !id) return;
    await deleteQuote(apiId);
    readById = Object.fromEntries(Object.entries(readById).filter(([key]) => key !== id));
    currentDevis = null;
    isDeleteModalOpen = false;
  }

  function handleResetFilters() {
    filterStatus = 'all';
    search = '';
  }

  const markAllRead = () => {
    readById = Object.fromEntries(notifications.map((n) => [n.id, true]));
  };

  const markRead = (id: string) => {
    readById = { ...readById, [id]: true };
  };

  const toApiStatus = (status: StatusUi) => {
    switch (status) {
      case 'confirmed':
        return QuoteStatus.Confirmed;
      case 'cancelled':
        return QuoteStatus.Cancelled;
      case 'pending_progress':
        return QuoteStatus.PendingProgress;
      case 'sent':
        return QuoteStatus.Sent;
      case 'pending_new':
        return QuoteStatus.PendingNew;
      default:
        return QuoteStatus.PendingNew;
    }
  };

  const splitName = (value: string) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    const firstName = parts.shift() ?? '';
    const lastName = parts.join(' ');
    return { firstName, lastName };
  };

  async function handleEditSave() {
    if (!currentDevis) return;
    const customerId = currentDevis.customerId;

    if (customerId) {
      const { firstName, lastName } = splitName(editForm.client);
      await updateCustomer(customerId, {
        firstName,
        lastName,
        email: editForm.email,
        phone: editForm.phone
      });
    }

    await updateQuote(currentDevis.apiId, {
      status: toApiStatus(editForm.status)
    });

    currentDevis = null;
    isEditModalOpen = false;
  }
</script>

<Header
  title="Gestion des devis"
  subtitle="Consultez, filtrez et gérez vos demandes de devis"
  showSearch={false}
  notifications={notifications}
  on:markAllRead={markAllRead}
  on:markRead={(event) => markRead(event.detail)}
>
  <Button variant="secondary" on:click={() => (isExportModalOpen = true)}>
    <Download class="w-4 h-4 mr-2" />
    Exporter
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card>
    <div class="flex flex-col md:flex-row gap-4 md:items-end">
      <div class="flex-1">
        <Input bind:value={search} placeholder="Rechercher un devis, client, email, téléphone, circuit..." />
      </div>
      <div class="w-full md:w-64">
        <Select label="Statut" bind:value={filterStatus} options={statusOptions} />
      </div>
      <Button variant="secondary" on:click={handleResetFilters}>
        <Filter class="w-4 h-4 mr-2" />
        Réinitialiser
      </Button>
    </div>
  </Card>

  <Card title="Liste des devis" subtitle={`${filtered.length} résultat(s)`}>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">N° Devis</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Téléphone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Circuit</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Formule</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Montant</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {#each filtered as devis, idx (devis.id)}
            <tr class={`hover:bg-slate-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{devis.id}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.client}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.email}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.phone}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.circuit}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.date}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.formule}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.amount}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Badge variant={badgeVariantFor(devis)}>{statusLabelFor(devis)}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <div class="inline-flex items-center gap-1">
                  <button class="p-2 rounded hover:bg-slate-100 text-slate-500" on:click={() => handleView(devis)} type="button" aria-label="Voir">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button class="p-2 rounded hover:bg-slate-100 text-slate-500" on:click={() => handleEdit(devis)} type="button" aria-label="Éditer">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button class="p-2 rounded hover:bg-red-50 text-red-500" on:click={() => handleDelete(devis)} type="button" aria-label="Supprimer">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if $quotesStore.loading}
        <div class="text-center py-12 text-slate-500 text-sm">Chargement...</div>
      {:else if $quotesStore.error}
        <div class="text-center py-12 text-red-600 text-sm">{$quotesStore.error}</div>
      {:else if filtered.length === 0}
        <div class="text-center py-12 text-slate-500 text-sm">Aucune donnée disponible</div>
      {/if}
    </div>
  </Card>
</div>

<!-- VIEW -->
<Modal isOpen={isViewModalOpen} title="Détail du devis" size="lg" on:close={() => (isViewModalOpen = false)}>
  {#if currentDevis}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div class="text-sm text-slate-500">N°</div>
        <div class="font-semibold">{currentDevis.id}</div>
        <div class="text-sm text-slate-500">Client</div>
        <div class="font-semibold">{currentDevis.client}</div>
        <div class="text-sm text-slate-500">Email</div>
        <div class="font-semibold">{currentDevis.email}</div>
        <div class="text-sm text-slate-500">Téléphone</div>
        <div class="font-semibold">{currentDevis.phone}</div>
      </div>
      <div class="space-y-3">
        <div class="text-sm text-slate-500">Circuit</div>
        <div class="font-semibold">{currentDevis.circuit}</div>
        <div class="text-sm text-slate-500">Dates</div>
        <div class="font-semibold">{currentDevis.date}</div>
        <div class="text-sm text-slate-500">Formule</div>
        <div class="font-semibold">{currentDevis.formule}</div>
        <div class="text-sm text-slate-500">Montant</div>
        <div class="font-semibold">{currentDevis.amount}</div>
        <div class="text-sm text-slate-500">Statut</div>
        <Badge variant={badgeVariantFor(currentDevis)}>{statusLabelFor(currentDevis)}</Badge>
        {#if currentDevis.participantCount}
          <div class="text-sm text-slate-500">Participants</div>
          <div class="font-semibold">{currentDevis.participantCount}</div>
        {/if}
      </div>
    </div>

    {#if currentDevis.participantsDetails.length > 0}
      <div class="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div class="text-sm font-medium text-slate-700 mb-3">Participants</div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th class="py-2 text-left font-medium">Participant</th>
                <th class="py-2 text-left font-medium">Moto</th>
                <th class="py-2 text-left font-medium">Hébergement</th>
                <th class="py-2 text-left font-medium">Options</th>
                <th class="py-2 text-right font-medium">Prix</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              {#each currentDevis.participantsDetails as participant}
                <tr>
                  <td class="py-2 pr-4 text-slate-700">{participant.name}</td>
                  <td class="py-2 pr-4 text-slate-700">{participant.moto ?? '—'}</td>
                  <td class="py-2 pr-4 text-slate-700">{participant.accommodation ?? '—'}</td>
                  <td class="py-2 pr-4 text-slate-700">
                    {#if participant.options.length > 0}
                      {participant.options.join(', ')}
                    {:else}
                      —
                    {/if}
                  </td>
                  <td class="py-2 text-right text-slate-700">{participant.unitPrice}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    {#if currentDevis.notes}
      <div class="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div class="text-sm font-medium text-slate-700 mb-2">Notes</div>
        <p class="text-sm text-slate-600">{currentDevis.notes}</p>
      </div>
    {/if}

    <div class="mt-6 flex justify-end gap-2">
      <Button variant="secondary" on:click={() => (isViewModalOpen = false)}>Fermer</Button>
      <Button
        on:click={() => {
          const devis = currentDevis;
          if (!devis) return;
          isViewModalOpen = false;
          handleEdit(devis);
        }}
      >
        Modifier
      </Button>
    </div>
  {/if}
</Modal>

<Modal isOpen={isEditModalOpen} title="Modifier un devis" size="xl" on:close={() => (isEditModalOpen = false)}>
  {#if currentDevis}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Client" bind:value={editForm.client} />
      <Input label="Email" type="email" bind:value={editForm.email} />
      <Input label="Téléphone" bind:value={editForm.phone} />
      <Select label="Statut" options={editStatusOptions} bind:value={editForm.status} />
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <Button variant="secondary" on:click={() => (isEditModalOpen = false)}>Annuler</Button>
      <Button on:click={handleEditSave}>Enregistrer</Button>
    </div>
  {/if}
</Modal>

<!-- DELETE -->
<Modal isOpen={isDeleteModalOpen} title="Supprimer le devis" size="md" on:close={() => (isDeleteModalOpen = false)}>
  {#if currentDevis}
    <div class="flex items-start gap-3">
      <XCircle class="w-6 h-6 text-red-500" />
      <div>
        <p class="font-medium text-slate-900">Confirmer la suppression ?</p>
        <p class="text-sm text-slate-600 mt-1">Le devis <span class="font-semibold">{currentDevis.id}</span> sera supprimé.</p>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <Button variant="secondary" on:click={() => (isDeleteModalOpen = false)}>Annuler</Button>
      <Button variant="danger" on:click={handleDeleteConfirm}>Supprimer</Button>
    </div>
  {/if}
</Modal>

<!-- EXPORT -->
<Modal isOpen={isExportModalOpen} title="Exporter" size="md" on:close={() => (isExportModalOpen = false)}>
  <div class="space-y-4">
    <p class="text-sm text-slate-600">PAS ENCORE FUNCTIONNEL</p>
    <div class="grid grid-cols-1 gap-3">
      <Button variant="secondary"><Download class="w-4 h-4 mr-2" />CSV</Button>
      <Button variant="secondary"><Download class="w-4 h-4 mr-2" />Excel</Button>
      <Button variant="secondary"><Download class="w-4 h-4 mr-2" />PDF</Button>
    </div>
    <div class="flex justify-end">
      <Button on:click={() => (isExportModalOpen = false)}>Fermer</Button>
    </div>
  </div>
</Modal>
