export default {
  // Navigation
  nav: {
    overview: 'Vue d\'ensemble',
    inventory: 'Stock',
    orders: 'Commandes',
    finance: 'Finance',
    demandForecast: 'Prévision de la demande',
    reports: 'Rapports',
    backlog: 'En attente',
    companyName: 'Catalyst Components',
    subtitle: 'Système de gestion des stocks'
  },

  // Dashboard
  dashboard: {
    title: 'Vue d\'ensemble',
    kpi: {
      title: 'Indicateurs clés de performance',
      inventoryTurnover: 'Taux de rotation des stocks',
      ordersFulfilled: 'Commandes exécutées',
      orderFillRate: 'Taux d\'exécution des commandes',
      revenue: 'Chiffre d\'affaires (commandes)',
      revenueYTD: 'CA (commandes) cumul annuel',
      revenueMTD: 'CA (commandes) cumul mensuel',
      avgProcessingTime: 'Temps moyen de traitement (jours)',
      goal: 'Objectif'
    },
    summary: {
      title: 'Résumé'
    },
    orderHealth: {
      title: 'État des commandes',
      totalOrders: 'Total commandes',
      revenue: 'Chiffre d\'affaires',
      avgOrderValue: 'Valeur moyenne par commande',
      onTimeRate: 'Taux de livraison à temps',
      avgFulfillmentDays: 'Délai moyen d\'exécution (jours)',
      total: 'Total'
    },
    ordersByMonth: {
      title: 'Commandes par mois'
    },
    inventoryValue: {
      title: 'Valeur du stock par catégorie'
    },
    inventoryShortages: {
      title: 'Ruptures de stock',
      noShortages: 'Aucune rupture de stock - toutes les commandes peuvent être exécutées !',
      noData: 'Aucune donnée de stock pour les filtres sélectionnés',
      orderId: 'ID commande',
      sku: 'SKU',
      itemName: 'Nom de l\'article',
      quantityNeeded: 'Quantité nécessaire',
      quantityAvailable: 'Quantité disponible',
      shortage: 'Manque',
      daysDelayed: 'Jours de retard',
      priority: 'Priorité',
      unitsShort: 'unités manquantes',
      days: 'jours'
    },
    topProducts: {
      title: 'Meilleurs produits par chiffre d\'affaires',
      sku: 'SKU',
      product: 'Produit',
      category: 'Catégorie',
      warehouse: 'Entrepôt',
      stockStatus: 'Statut du stock',
      revenue: 'Chiffre d\'affaires',
      unitsOrdered: 'Unités commandées',
      firstOrder: 'Première commande',
      inStock: 'En stock',
      lowStock: 'Stock faible'
    }
  },

  // Inventory
  inventory: {
    title: 'Stock',
    description: 'Suivre et gérer tous les articles en stock',
    stockLevels: 'Niveaux de stock',
    skus: 'SKU',
    searchPlaceholder: 'Rechercher par nom d\'article...',
    clearSearch: 'Effacer la recherche',
    totalItems: 'Total articles',
    totalValue: 'Valeur totale',
    lowStockItems: 'Articles en stock faible',
    warehouses: 'Entrepôts',
    table: {
      sku: 'SKU',
      itemName: 'Nom de l\'article',
      name: 'Nom',
      category: 'Catégorie',
      warehouse: 'Entrepôt',
      quantity: 'Quantité',
      quantityOnHand: 'Quantité disponible',
      reorderPoint: 'Seuil de réapprovisionnement',
      unitCost: 'Coût unitaire',
      unitPrice: 'Prix unitaire',
      totalValue: 'Valeur totale',
      location: 'Emplacement',
      status: 'Statut'
    }
  },

  // Orders
  orders: {
    title: 'Commandes',
    description: 'Voir et gérer les commandes clients',
    allOrders: 'Toutes les commandes',
    totalOrders: 'Total commandes',
    totalRevenue: 'Chiffre d\'affaires total',
    avgOrderValue: 'Valeur moyenne par commande',
    onTimeDelivery: 'Livraison à temps',
    itemsCount: '{count} articles',
    quantity: 'Qté',
    table: {
      orderNumber: 'N° de commande',
      orderId: 'ID commande',
      orderDate: 'Date de commande',
      date: 'Date',
      customer: 'Client',
      category: 'Catégorie',
      warehouse: 'Entrepôt',
      items: 'Articles',
      value: 'Valeur',
      totalValue: 'Valeur totale',
      status: 'Statut',
      expectedDelivery: 'Livraison prévue',
      actualDelivery: 'Livraison effective'
    }
  },

  // Finance/Spending
  finance: {
    title: 'Tableau de bord financier',
    description: 'Suivre les revenus, les coûts et la performance financière',
    totalRevenue: 'Chiffre d\'affaires total',
    totalCosts: 'Coûts totaux',
    netProfit: 'Bénéfice net',
    avgOrderValue: 'Valeur moyenne par commande',
    fromOrders: 'À partir de {count} commandes',
    costBreakdown: 'Approvisionnement + Exploitation + Main d\'œuvre + Frais généraux',
    margin: 'marge',
    perOrderRevenue: 'Revenu par commande',
    revenueVsCosts: {
      title: 'Chiffre d\'affaires vs coûts mensuels',
      revenue: 'Chiffre d\'affaires',
      costs: 'Coûts totaux'
    },
    monthlyCostFlow: {
      title: 'Flux des coûts mensuels',
      procurement: 'Approvisionnement',
      operational: 'Exploitation',
      labor: 'Main d\'œuvre',
      overhead: 'Frais généraux'
    },
    categorySpending: {
      title: 'Dépenses par catégorie',
      ofTotal: 'du total'
    },
    transactions: {
      title: 'Transactions récentes',
      id: 'ID',
      description: 'Description',
      vendor: 'Fournisseur',
      date: 'Date',
      amount: 'Montant'
    }
  },

  // Reports
  reports: {
    title: 'Rapports de performance',
    description: 'Voir les indicateurs trimestriels et les tendances mensuelles',
    loading: 'Chargement des rapports...',
    quarterlyPerformance: 'Performance trimestrielle',
    monthlyRevenueTrend: 'Tendance du chiffre d\'affaires mensuel',
    monthOverMonth: 'Analyse mois par mois',
    table: {
      quarter: 'Trimestre',
      totalOrders: 'Total commandes',
      totalRevenue: 'Chiffre d\'affaires total',
      avgOrderValue: 'Valeur moyenne par commande',
      fulfillmentRate: 'Taux d\'exécution',
      month: 'Mois',
      orders: 'Commandes',
      revenue: 'Chiffre d\'affaires',
      change: 'Variation',
      growthRate: 'Taux de croissance'
    },
    stats: {
      totalRevenueYTD: 'CA total (cumul annuel)',
      avgMonthlyRevenue: 'CA mensuel moyen',
      totalOrdersYTD: 'Total commandes (cumul annuel)',
      bestQuarter: 'Meilleur trimestre'
    }
  },

  // Demand Forecast
  demand: {
    title: 'Prévision de la demande',
    description: 'Analyser les tendances de la demande et les prévisions',
    increasingDemand: 'Demande en hausse',
    stableDemand: 'Demande stable',
    decreasingDemand: 'Demande en baisse',
    itemsCount: '{count} articles',
    more: 'plus...',
    demandForecasts: 'Prévisions de la demande',
    table: {
      sku: 'SKU',
      itemName: 'Nom de l\'article',
      currentDemand: 'Demande actuelle',
      forecastedDemand: 'Demande prévue',
      change: 'Variation',
      trend: 'Tendance',
      period: 'Période'
    }
  },

  // Backlog
  backlog: {
    title: 'Gestion des arriérés',
    description: 'Suivre et résoudre les ruptures de stock',
    loading: 'Chargement des arriérés...',
    highPriority: 'Priorité haute',
    mediumPriority: 'Priorité moyenne',
    lowPriority: 'Priorité basse',
    totalItems: 'Total des éléments en attente',
    itemsTitle: 'Éléments en attente',
    empty: 'Aucun élément en attente - toutes les commandes peuvent être exécutées !',
    unitsShort: '{count} unités manquantes',
    days: '{count} jours',
    table: {
      orderId: 'ID commande',
      sku: 'SKU',
      itemName: 'Nom de l\'article',
      quantityNeeded: 'Quantité nécessaire',
      quantityAvailable: 'Quantité disponible',
      shortage: 'Manque',
      daysDelayed: 'Jours de retard',
      priority: 'Priorité'
    }
  },

  // Filters
  filters: {
    timePeriod: 'Période',
    location: 'Emplacement',
    category: 'Catégorie',
    orderStatus: 'Statut de la commande',
    all: 'Tous',
    allMonths: 'Tous les mois'
  },

  // Statuses
  status: {
    delivered: 'Livrée',
    shipped: 'Expédiée',
    processing: 'En traitement',
    backordered: 'En rupture',
    inStock: 'En stock',
    lowStock: 'Stock faible',
    adequate: 'Adéquat'
  },

  // Trends
  trends: {
    increasing: 'en hausse',
    stable: 'stable',
    decreasing: 'en baisse'
  },

  // Priority
  priority: {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse'
  },

  // Categories
  categories: {
    circuitBoards: 'Cartes de circuits',
    sensors: 'Capteurs',
    actuators: 'Actionneurs',
    controllers: 'Contrôleurs',
    powerSupplies: 'Alimentations'
  },

  // Spending Categories
  spendingCategories: {
    rawMaterials: 'Matières premières',
    components: 'Composants',
    equipment: 'Équipement',
    consumables: 'Consommables'
  },

  // Warehouses
  warehouses: {
    sanFrancisco: 'San Francisco',
    london: 'Londres',
    tokyo: 'Tokyo'
  },

  // Months
  months: {
    jan: 'Janv.',
    feb: 'Févr.',
    mar: 'Mars',
    apr: 'Avr.',
    may: 'Mai',
    jun: 'Juin',
    jul: 'Juil.',
    aug: 'Août',
    sep: 'Sept.',
    oct: 'Oct.',
    nov: 'Nov.',
    dec: 'Déc.',
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre'
  },

  // Profile Menu
  profile: {
    profileDetails: 'Détails du profil',
    myTasks: 'Mes tâches',
    logout: 'Déconnexion'
  },

  // Profile Details Modal
  profileDetails: {
    title: 'Détails du profil',
    email: 'E-mail',
    department: 'Service',
    location: 'Lieu',
    phone: 'Téléphone',
    joinDate: 'Date d\'embauche',
    employeeId: 'ID employé',
    close: 'Fermer'
  },

  // Tasks Modal
  tasks: {
    title: 'Mes tâches',
    taskTitle: 'Titre de la tâche',
    taskTitlePlaceholder: 'Entrez le titre de la tâche...',
    priority: 'Priorité',
    dueDate: 'Date d\'échéance',
    addTask: 'Ajouter une tâche',
    noTasks: 'Aucune tâche pour le moment. Ajoutez votre première tâche ci-dessus !'
  },

  // Theme
  theme: {
    label: 'Thème',
    light: 'Clair',
    dark: 'Sombre'
  },

  // Language
  language: {
    english: 'Anglais',
    japanese: 'Japonais',
    french: 'Français',
    selectLanguage: 'Sélectionner la langue'
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    noData: 'Aucune donnée disponible',
    viewDetails: 'Voir les détails',
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    items: 'articles'
  }
}
