<script lang="ts">
  import Header from '$lib/components/Header.svelte';
</script>

<Header title="Tableau de Bord" />

<div class="p-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
      <h3 class="text-blue-100 font-medium mb-1">Chiffre d'Affaires (Mois)</h3>
      <p class="text-3xl font-bold">45 250 €</p>
      <div class="mt-4 text-sm text-blue-100 bg-white/10 inline-block px-2 py-1 rounded">+12% vs mois dernier</div>
    </div>
    <div class="bg-white rounded-xl p-6 shadow-md border border-slate-100">
      <h3 class="text-slate-500 font-medium mb-1">Devis en attente</h3>
      <p class="text-3xl font-bold text-slate-900">28</p>
      <div class="mt-4 text-sm text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">5 à relancer aujourd'hui</div>
    </div>
    <div class="bg-white rounded-xl p-6 shadow-md border border-slate-100">
      <h3 class="text-slate-500 font-medium mb-1">Taux de conversion</h3>
      <p class="text-3xl font-bold text-slate-900">24%</p>
      <div class="mt-4 text-sm text-slate-500">Objectif: 30%</div>
    </div>
  </div>

  <div class="bg-white rounded-xl shadow-md border border-slate-100 p-8 text-center">
    <img
      src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600"
      alt="Welcome"
      class="w-64 h-40 object-cover rounded-lg mx-auto mb-6 opacity-80"
    />

    <h2 class="text-xl font-bold text-slate-900 mb-2">Bienvenue sur Motomamis Admin</h2>
    <p class="text-slate-500 max-w-md mx-auto">
      Sélectionnez une option dans le menu latéral pour gérer vos devis, votre flotte de motos, vos circuits ou vos formules.
    </p>
  </div>
</div>
