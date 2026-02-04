<script lang="ts">
  import Header from '$lib/components/Header.svelte';
</script>

<Header title="Tableau de Bord" showSearch={false} />

<div class="p-8">
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
