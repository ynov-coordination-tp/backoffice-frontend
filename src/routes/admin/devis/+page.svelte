<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import type { NotificationItem } from '$lib/types/notifications';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { Download, Edit2, Eye, FileText, Filter, Trash2, XCircle } from 'lucide-svelte';

  type DevisStatus = 'confirmed' | 'pending' | 'draft' | 'cancelled';
  type Option = { value: string; label: string };
  type Devis = {
    id: string;
    client: string;
    email: string;
    phone: string;
    circuit: string;
    date: string;
    amount: string;
    status: DevisStatus;
    notes: string;
    formule: string;
  };

  let devisList: Devis[] = [
    {
      id: 'D-2023-001',
      client: 'Sophie Martin',
      email: 'sophie.m@example.com',
      phone: '06 12 34 56 78',
      circuit: 'Route des Alpes',
      date: '12/06/2024',
      amount: '2 450 €',
      status: 'confirmed',
      notes: 'Régime végétarien demandé.',
      formule: 'Poseidon'
    },
    {
      id: 'D-2023-002',
      client: 'Thomas Dubois',
      email: 'thomas@example.com',
      phone: '06 98 76 54 32',
      circuit: 'Corse Sauvage',
      date: '05/07/2024',
      amount: '3 100 €',
      status: 'pending',
      notes: '',
      formule: 'Zeus'
    },
    {
      id: 'D-2023-003',
      client: 'Marie Leroy',
      email: 'marie.l@example.com',
      phone: '07 11 22 33 44',
      circuit: 'Pyrénées Est',
      date: '22/08/2024',
      amount: '1 890 €',
      status: 'draft',
      notes: 'Hésite entre deux dates.',
      formule: 'Athena'
    },
    {
      id: 'D-2023-004',
      client: 'Lucas Bernard',
      email: 'lucas.b@example.com',
      phone: '06 55 44 33 22',
      circuit: 'Auvergne Volcanique',
      date: '10/09/2024',
      amount: '1 250 €',
      status: 'cancelled',
      notes: 'Annulé pour raisons de santé.',
      formule: 'Athena'
    }
  ];

  let filterStatus: 'all' | DevisStatus = 'all';
  let search = '';

  let isCreateModalOpen = false;
  let isEditModalOpen = false;
  let isViewModalOpen = false;
  let isDeleteModalOpen = false;
  let isExportModalOpen = false;

  let currentDevis: Devis | null = null;

  const statusOptions: Option[] = [
    { value: 'all', label: 'Tous' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'pending', label: 'En attente' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';

  const badgeVariant = (status: DevisStatus): BadgeVariant => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'draft':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const statusLabel = (status: DevisStatus): string => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      case 'draft':
        return 'Brouillon';
      default:
        return 'Inconnu';
    }
  };

  const makeNotifications = (items: Devis[]): NotificationItem[] =>
    items
      .filter((d) => d.status === 'pending' || d.status === 'draft')
      .map((d) => ({
        id: d.id,
        title: `Devis ${statusLabel(d.status)}`,
        description: `${d.client} - ${d.circuit}`,
        date: d.date,
        read: false
      }));

  let notifications = makeNotifications(devisList);

  $: filtered = devisList.filter((d) => {
    const statusOk = filterStatus === 'all' ? true : d.status === filterStatus;
    const q = search.trim().toLowerCase();
    const searchOk =
      !q ||
      d.id.toLowerCase().includes(q) ||
      d.client.toLowerCase().includes(q) ||
      d.circuit.toLowerCase().includes(q) ||
      d.formule.toLowerCase().includes(q);
    return statusOk && searchOk;
  });

  function handleCreate() {
    currentDevis = null;
    isCreateModalOpen = true;
  }
  function handleView(d: Devis) {
    currentDevis = d;
    isViewModalOpen = true;
  }
  function handleEdit(d: Devis) {
    currentDevis = d;
    isEditModalOpen = true;
  }
  function handleDelete(d: Devis) {
    currentDevis = d;
    isDeleteModalOpen = true;
  }

  function handleDeleteConfirm() {
    const id = currentDevis?.id;
    if (!id) return;
    devisList = devisList.filter((d) => d.id !== id);
    notifications = notifications.filter((n) => n.id !== id);
    currentDevis = null;
    isDeleteModalOpen = false;
  }

  function handleResetFilters() {
    filterStatus = 'all';
    search = '';
  }

  const markAllRead = () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  };

  const markRead = (id: string) => {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  };
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
  <Button on:click={handleCreate}>
    <FileText class="w-4 h-4 mr-2" />
    Nouveau devis
  </Button>
</Header>

<div class="p-8 space-y-6">
  <Card>
    <div class="flex flex-col md:flex-row gap-4 md:items-end">
      <div class="flex-1">
        <Input bind:value={search} placeholder="Rechercher un devis, client, circuit..." />
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
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Circuit</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.circuit}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.date}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.formule}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{devis.amount}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Badge variant={badgeVariant(devis.status)}>{statusLabel(devis.status)}</Badge>
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

      {#if filtered.length === 0}
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
        <div class="text-sm text-slate-500">Date</div>
        <div class="font-semibold">{currentDevis.date}</div>
        <div class="text-sm text-slate-500">Formule</div>
        <div class="font-semibold">{currentDevis.formule}</div>
        <div class="text-sm text-slate-500">Montant</div>
        <div class="font-semibold">{currentDevis.amount}</div>
        <div class="text-sm text-slate-500">Statut</div>
        <Badge variant={badgeVariant(currentDevis.status)}>{statusLabel(currentDevis.status)}</Badge>
      </div>
    </div>

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
          isViewModalOpen = false;
          isEditModalOpen = true;
        }}
      >
        Modifier
      </Button>
    </div>
  {/if}
</Modal>

<!-- CREATE / EDIT (maquette) -->
<Modal isOpen={isCreateModalOpen} title="Créer un devis" size="xl" on:close={() => (isCreateModalOpen = false)}>
  <p class="text-slate-600 text-sm mb-6">
    Remplissez les informations ci-dessous pour créer un nouveau devis pour un client intéressé par nos circuits moto.(pas encore connecter)
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Client" placeholder="Nom et prénom" />
    <Input label="Email" placeholder="email@exemple.com" type="email" />
    <Input label="Téléphone" placeholder="06 ..." />
    <Input label="Date" placeholder="JJ/MM/AAAA" />
    <Input label="Circuit" placeholder="Route des Alpes" />
    <Input label="Formule" placeholder="Athena / Zeus / ..." />
  </div>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" on:click={() => (isCreateModalOpen = false)}>Annuler</Button>
    <Button isLoading={false}>Créer</Button>
  </div>
</Modal>

<Modal isOpen={isEditModalOpen} title="Modifier un devis" size="xl" on:close={() => (isEditModalOpen = false)}>
  {#if currentDevis}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Client" value={currentDevis.client} />
      <Input label="Email" value={currentDevis.email} type="email" />
      <Input label="Téléphone" value={currentDevis.phone} />
      <Input label="Date" value={currentDevis.date} />
      <Input label="Circuit" value={currentDevis.circuit} />
      <Input label="Formule" value={currentDevis.formule} />
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <Button variant="secondary" on:click={() => (isEditModalOpen = false)}>Annuler</Button>
      <Button>Enregistrer</Button>
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
